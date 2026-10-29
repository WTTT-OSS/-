import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { matchesClientToken, requiresClientToken } from './ai-gateway-security.mjs';

let localConfig = {};
try {
  const contents = readFileSync(new URL('../.env', import.meta.url), 'utf8');
  localConfig = Object.fromEntries(contents.split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#')).map(line => {
    const separator = line.indexOf('=');
    if (separator < 1) return ['', ''];
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim().replace(/^(['"])(.*)\1$/, '$2')];
  }).filter(([key]) => key));
} catch {}
const config = name => process.env[name] || localConfig[name] || '';

const PORT = Number(config('CARBONMATE_AI_PORT') || 4175);
const HOST = config('CARBONMATE_AI_HOST') || '127.0.0.1';
const CLIENT_TOKEN = config('CARBONMATE_AI_CLIENT_TOKEN');
const REQUIRE_CLIENT_TOKEN = requiresClientToken(HOST);
const MODEL = config('DEEPSEEK_MODEL') || 'deepseek-flash';
const ALLOWED_ORIGINS = new Set([
  'http://127.0.0.1:4173',
  'http://localhost:4173',
  ...(config('CARBONMATE_PREVIEW_ORIGIN') ? [config('CARBONMATE_PREVIEW_ORIGIN')] : [])
]);
const KINDS = new Set(['bicycle', 'walk', 'bus', 'metro', 'electricity', 'water', 'recycle', 'meal', 'reuse']);
const MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function send(response, status, payload, origin) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin'
  });
  response.end(JSON.stringify(payload));
}

function hasValidClientToken(request) {
  if (!REQUIRE_CLIENT_TOKEN) return true;
  return matchesClientToken(request.headers.authorization, CLIENT_TOKEN);
}

async function readJson(request, maxBytes) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBytes) throw Object.assign(new Error('请求过大，请选择 10 MB 以内的图片'), { status: 413 });
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw Object.assign(new Error('请求内容格式不正确'), { status: 400 }); }
}

function safeRecognitionResult(raw) {
  let result;
  try { result = JSON.parse(raw); }
  catch { throw new Error('模型未返回有效的识别草稿，请重试或手动填写'); }
  const kind = KINDS.has(result.kind) ? result.kind : 'unknown';
  const quantityValue = result.quantity === null || result.quantity === '' ? null : Number(result.quantity);
  const quantity = Number.isFinite(quantityValue) && quantityValue > 0 && quantityValue <= 100000 ? quantityValue : null;
  return {
    kind,
    quantity,
    actionDetail: String(result.actionDetail || '').trim().slice(0, 80),
    itemCategory: String(result.itemCategory || '').trim().slice(0, 30),
    destination: String(result.destination || '').trim().slice(0, 40),
    note: String(result.note || '').trim().slice(0, 100),
    confidence: Math.max(0, Math.min(1, Number(result.confidence) || 0)),
    needsReview: true
  };
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin || '';
  if (origin && !ALLOWED_ORIGINS.has(origin)) return send(response, 403, { error: '不允许此网页访问本机识别服务' }, 'null');
  const allowedOrigin = origin || 'http://127.0.0.1:4173';
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '600',
      'Vary': 'Origin'
    });
    return response.end();
  }
  if (!hasValidClientToken(request)) {
    return send(response, 401, { error: '识别服务客户端令牌无效或未配置' }, allowedOrigin);
  }
  if (request.method === 'GET' && request.url === '/api/health') {
    return send(response, 200, { ready: Boolean(config('DEEPSEEK_API_KEY')), provider: 'DeepSeek', model: MODEL }, allowedOrigin);
  }
  if (request.method !== 'POST' || request.url !== '/api/recognize-carbon-action') {
    return send(response, 404, { error: '接口不存在' }, allowedOrigin);
  }
  if (!config('DEEPSEEK_API_KEY')) {
    return send(response, 503, { error: 'DeepSeek 尚未配置。请在本机设置 DEEPSEEK_API_KEY 并重启识别服务；密钥不会放入网页代码。' }, allowedOrigin);
  }

  try {
    const body = await readJson(request, 15 * 1024 * 1024);
    const mimeType = String(body.mimeType || '');
    const image = String(body.image || '');
    const match = image.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
    if (!MIME_TYPES.has(mimeType) || !match || match[1] !== mimeType) {
      return send(response, 400, { error: '图片格式不支持，请使用 JPG、PNG 或 WebP' }, allowedOrigin);
    }
    if (Buffer.from(match[2], 'base64').byteLength > MAX_IMAGE_BYTES) {
      return send(response, 413, { error: '图片超过 10 MB，请压缩后重试' }, allowedOrigin);
    }

    const upstream = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config('DEEPSEEK_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.1,
        max_tokens: 700,
        messages: [
          {
            role: 'system',
            content: '你是低碳行动图片分类助手。只输出一个 JSON 对象，不要 Markdown。根据图片可见证据，识别最可能的一项真实行动。kind 必须是 bicycle, walk, bus, metro, electricity, water, recycle, meal, reuse 之一；无法确定时 kind 为 unknown。quantity 只有在图片中明确可见、可读或能直接数出的事实时才填写数字，否则为 null；严禁估算出行距离、节电量、用水量、纸张重量、食物份数或减排量。不得仅凭风景图推断用户完成了行动。actionDetail 写可见证据或具体行动，itemCategory 仅用于 reuse，destination 只在图片清楚表明处理去向时填写，note 简短说明不确定性，confidence 为 0 到 1 的保守置信度。字段格式：{"kind":"unknown","quantity":null,"actionDetail":"","itemCategory":"","destination":"","note":"","confidence":0}'
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: '请把这张照片转成低碳行动待确认草稿。没有明确证据就返回 unknown，不要猜测。' },
              { type: 'image_url', image_url: { url: image, detail: 'high' } }
            ]
          }
        ]
      }),
      signal: AbortSignal.timeout(60000)
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const message = upstream.status === 401 || upstream.status === 403
        ? 'DeepSeek 密钥无效或无权限，请检查本机服务配置。'
        : `DeepSeek 暂不可用（${upstream.status}），请稍后重试或手动填写。`;
      return send(response, 502, { error: message }, allowedOrigin);
    }
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== 'string') return send(response, 502, { error: 'DeepSeek 没有返回可识别的结果' }, allowedOrigin);
    const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] || content;
    const result = safeRecognitionResult(fenced.trim());
    return send(response, 200, result, allowedOrigin);
  } catch (error) {
    const status = Number.isInteger(error.status) ? error.status : 502;
    const message = status === 413 || status === 400 ? error.message : '识别服务连接失败，请检查网络后重试。';
    return send(response, status, { error: message }, allowedOrigin);
  }
});

if (REQUIRE_CLIENT_TOKEN && CLIENT_TOKEN.length < 24) {
  throw new Error('绑定到局域网前必须设置至少 24 位 CARBONMATE_AI_CLIENT_TOKEN；建议仅在可信家庭/实验室网络使用。');
}

server.listen(PORT, HOST, () => {
  console.log(`CarbonMate local AI gateway listening on http://${HOST}:${PORT}`);
  if (REQUIRE_CLIENT_TOKEN) console.log('LAN access is protected by a client token; use only on a trusted local network.');
  if (!config('DEEPSEEK_API_KEY')) console.log('DEEPSEEK_API_KEY is not set; AI requests will return a setup message.');
});
