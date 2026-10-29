import { buffer } from '@kit.ArkTS';
import { fileIo } from '@kit.CoreFileKit';
import { http } from '@kit.NetworkKit';

export interface RecognitionDraft {
  kind: string;
  quantity: number | null;
  actionDetail: string;
  itemCategory: string;
  destination: string;
  note: string;
  confidence: number;
  needsReview: boolean;
}

export class AIRecognitionService {
  static async checkGateway(gatewayUrl: string, clientToken: string): Promise<string> {
    const normalizedUrl = gatewayUrl.trim().replace(/\/$/, '');
    if ((!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) || clientToken.trim().length < 24) {
      throw new Error('请填写有效的网关地址和至少 24 位客户端令牌');
    }
    const request = http.createHttp();
    try {
      const response = await request.request(`${normalizedUrl}/api/health`, {
        method: http.RequestMethod.GET,
        header: { 'Authorization': `Bearer ${clientToken.trim()}` },
        connectTimeout: 8000,
        readTimeout: 8000
      });
      if (response.responseCode < 200 || response.responseCode >= 300) {
        throw new Error(response.responseCode === 401 ? '客户端令牌不正确' : '网关未就绪，请确认服务已启动');
      }
      const body = typeof response.result === 'string' ? JSON.parse(response.result) as Record<string, Object> : response.result as Record<string, Object>;
      if (body.ready !== true) throw new Error('网关已连接，但 DeepSeek API Key 尚未配置');
      return typeof body.model === 'string' ? `连接成功 · ${body.model}` : '连接成功';
    } finally {
      request.destroy();
    }
  }

  static async recognize(uri: string, gatewayUrl: string, clientToken: string): Promise<RecognitionDraft> {
    const normalizedUrl = gatewayUrl.trim().replace(/\/$/, '');
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      throw new Error('识别服务地址需以 http:// 或 https:// 开头');
    }
    if (clientToken.trim().length < 24) {
      throw new Error('客户端令牌至少需要 24 个字符');
    }

    let imageFile: fileIo.File | undefined;
    try {
      imageFile = fileIo.openSync(uri, fileIo.OpenMode.READ_ONLY);
      const fileSize = fileIo.statSync(imageFile.fd).size;
      if (fileSize <= 0 || fileSize > 10 * 1024 * 1024) {
        throw new Error('照片为空或超过 10 MB，请重新拍摄或选择较小图片');
      }
      const bytes = new ArrayBuffer(fileSize);
      const readLength = fileIo.readSync(imageFile.fd, bytes);
      if (readLength <= 0) throw new Error('无法读取所选照片');
      const byteView = new Uint8Array(bytes, 0, readLength);
      const mimeType = AIRecognitionService.detectMime(byteView);
      const base64 = buffer.from(bytes, 0, readLength).toString('base64');
      const request = http.createHttp();
      try {
        const response = await request.request(`${normalizedUrl}/api/recognize-carbon-action`, {
          method: http.RequestMethod.POST,
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clientToken.trim()}`
          },
          extraData: JSON.stringify({ mimeType, image: `data:${mimeType};base64,${base64}` }),
          connectTimeout: 15000,
          readTimeout: 65000
        });
        const responseText = typeof response.result === 'string' ? response.result : JSON.stringify(response.result);
        let payload: Object;
        try { payload = JSON.parse(responseText) as Object; }
        catch (_) { throw new Error('识别服务返回内容无法读取，请检查网关地址'); }
        if (response.responseCode < 200 || response.responseCode >= 300) {
          const message = (payload as Record<string, Object>).error;
          throw new Error(typeof message === 'string' ? message : '识别服务暂不可用，请稍后重试');
        }
        return AIRecognitionService.validateDraft(payload);
      } finally {
        request.destroy();
      }
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('识别服务连接失败，请检查网关地址、令牌和网络');
    } finally {
      if (imageFile) fileIo.closeSync(imageFile);
    }
  }

  private static detectMime(bytes: Uint8Array): string {
    if (bytes.length >= 8 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71) {
      return 'image/png';
    }
    if (bytes.length >= 12 && bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70 &&
      bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80) {
      return 'image/webp';
    }
    if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg';
    throw new Error('只支持 JPG、PNG 或 WebP 图片，请换一张照片');
  }

  private static validateDraft(payload: Object): RecognitionDraft {
    const row = payload as Record<string, Object>;
    const allowedKinds: string[] = ['bicycle', 'walk', 'bus', 'metro', 'electricity', 'water', 'recycle', 'meal', 'reuse', 'unknown'];
    const kind = typeof row.kind === 'string' && allowedKinds.includes(row.kind) ? row.kind : 'unknown';
    const rawQuantity = row.quantity;
    const quantity = typeof rawQuantity === 'number' && Number.isFinite(rawQuantity) && rawQuantity > 0 ? rawQuantity : null;
    return {
      kind,
      quantity,
      actionDetail: typeof row.actionDetail === 'string' ? row.actionDetail.slice(0, 80) : '',
      itemCategory: typeof row.itemCategory === 'string' ? row.itemCategory.slice(0, 30) : '',
      destination: typeof row.destination === 'string' ? row.destination.slice(0, 40) : '',
      note: typeof row.note === 'string' ? row.note.slice(0, 100) : '',
      confidence: typeof row.confidence === 'number' ? Math.max(0, Math.min(1, row.confidence)) : 0,
      needsReview: true
    };
  }
}
