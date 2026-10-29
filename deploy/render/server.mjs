import { createServer } from 'node:http';
import { timingSafeEqual } from 'node:crypto';

/**
 * 碳伴识别网关 —— Render 部署版。
 * 与 server/ai-server.mjs 行为一致，区别只有三点：
 *   1. 只从环境变量读配置（Render 上不存在 ../.env）；
 *   2. 监听 0.0.0.0 并使用平台注入的 PORT；
 *   3. 客户端令牌强制启用，且不接受少于 24 位。
 */

const PORT = Number(process.env.PORT || 4175);
const HOST = '0.0.0.0';
const CLIENT_TOKEN = String(process.env.CARBONMATE_AI_CLIENT_TOKEN || '');
const DEEPSEEK_API_KEY = String(process.env.DEEPSEEK_API_KEY || '');
const MODEL = String(process.env.DEEPSEEK_MODEL || 'deepseek-flash');

// 浏览器预览页的来源；原生 App 不带 Origin，不受此限制
const ALLOWED_ORIGINS = new Set(
  String(process.env.CARBONMATE_PREVIEW_ORIGIN || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
);

const KINDS = new Set(['bicycle', 'walk', 'bus', 'metro', 'electricity', 'water', 'recycle', 'meal', 'reuse']);
const MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

if (CLIENT_TOKEN.length < 24) {
  throw new Error('必须设置至少 24 位的 CARBONMATE_AI_CLIENT_TOKEN，否则拒绝启动。');
}

function send(response, status, payload, origin) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': origin,
    Vary: 'Origin'
  });
  response.end(JSON.stringify(payload));
}

function hasValidClientToken(request) {
  const header = String(request.headers.authorization || '');
  const expected = `Bearer ${CLIENT_TOKEN}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

async function readJson(request, maxBytes) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBytes) throw Object.assign(new Error('请求过大，请选择 10 MB 以内的图片'), { status: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw Object.assign(new Error('请求内容格式不正确'), { status: 400 });
  }
}

function safeRecognitionResult(raw) {
  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    throw new Error('模型未返回有效的识别草稿，请重试或手动填写');
  }
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

const PROMPT = '你是低碳行动图片分类助手。只输出一个 JSON 对象，不要 Markdown。根据图片可见证据，识别最可能的一项真实行动。kind 必须是 bicycle, walk, bus, metro, electricity, water, recycle, meal, reuse 之一；无法确定时 kind 为 unknown。quantity 只有在图片中明确可见、可读或能直接数出的事实时才填写数字，否则为 null；严禁估算出行距离、节电量、用水量、纸张重量、食物份数或减排量。不得仅凭风景图推断用户完成了行动。actionDetail 写可见证据或具体行动，itemCategory 仅用于 reuse，destination 只在图片清楚表明处理去向时填写，note 简短说明不确定性，confidence 为 0 到 1 的保守置信度。字段格式：{"kind":"unknown","quantity":null,"actionDetail":"","itemCategory":"","destination":"","note":"","confidence":0}';

const server = createServer(async (request, response) => {
  const origin = request.headers.origin || '';
  if (origin && ALLOWED_ORIGINS.size > 0 && !ALLOWED_ORIGINS.has(origin)) {
    return send(response, 403, { error: '不允许此来源访问识别服务' }, 'null');
  }
  const allowedOrigin = origin && (ALLOWED_ORIGINS.size === 0 || ALLOWED_ORIGINS.has(origin)) ? origin : (ALLOWED_ORIGINS.values().next().value || '*');

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '600',
      Vary: 'Origin'
    });
    return response.end();
  }

  // 健康检查必须放在令牌校验之前：Render 的平台探针不带 Authorization 头，
  // 放在后面会导致部署永远卡在 "Waiting for internal health check"。
  if (request.method === 'GET' && request.url === '/api/health') {
    return send(response, 200, { ready: Boolean(DEEPSEEK_API_KEY), provider: 'DeepSeek', model: MODEL }, allowedOrigin);
  }

  if (!hasValidClientToken(request)) {
    return send(response, 401, { error: '识别服务客户端令牌无效' }, allowedOrigin);
  }

  if (request.method === 'GET' && request.url === '/') {
    return send(response, 200, { service: 'CarbonMate AI Gateway', endpoints: ['/api/health', '/api/recognize-carbon-action'] }, allowedOrigin);
  }

  if (request.method !== 'POST' || request.url !== '/api/recognize-carbon-action') {
    return send(response, 404, { error: '接口不存在' }, allowedOrigin);
  }

  if (!DEEPSEEK_API_KEY) {
    return send(response, 503, { error: '识别服务尚未配置 DEEPSEEK_API_KEY' }, allowedOrigin);
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
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.1,
        max_tokens: 700,
        messages: [
          { role: 'system', content: PROMPT },
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
      const message =
        upstream.status === 401 || upstream.status === 403
          ? 'DeepSeek 密钥无效或无权限，请检查服务配置。'
          : `DeepSeek 暂不可用（${upstream.status}），请稍后重试或手动填写。`;
      return send(response, 502, { error: message }, allowedOrigin);
    }

    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
      return send(response, 502, { error: 'DeepSeek 没有返回可识别的结果' }, allowedOrigin);
    }
    const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] || content;
    return send(response, 200, safeRecognitionResult(fenced.trim()), allowedOrigin);
  } catch (error) {
    const status = Number.isInteger(error.status) ? error.status : 502;
    const message = status === 413 || status === 400 ? error.message : '识别服务连接失败，请检查网络后重试。';
    return send(response, status, { error: message }, allowedOrigin);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`CarbonMate AI gateway listening on http://${HOST}:${PORT}`);
  if (!DEEPSEEK_API_KEY) console.log('DEEPSEEK_API_KEY 未设置，识别接口会返回 503。');
});
