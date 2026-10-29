# 碳伴识别网关 · Render 部署

把 `server/ai-server.mjs` 部署到 Render，手机不必与电脑同网也能识别。

## 部署步骤

1. 新建一个 GitHub 仓库（可以只有本目录三个文件：`server.mjs`、`package.json`、`render.yaml`）。
2. Render 控制台 → **New → Blueprint**，选中该仓库；Render 会读 `render.yaml` 自动建服务。
   也可以 **New → Web Service** 手动建：
   - Runtime：Node
   - Build Command：`npm install --omit=dev`
   - Start Command：`node server.mjs`
   - Health Check Path：`/api/health`
3. 在 **Environment** 里填两个变量（不要提交到仓库）：
   - `DEEPSEEK_API_KEY`：你的 DeepSeek 密钥
   - `CARBONMATE_AI_CLIENT_TOKEN`：至少 24 位，随便起，但要和 App 里填的一致
4. 部署完成后拿到地址，形如 `https://carbonmate-ai-gateway.onrender.com`。

## App 里怎么填

「我的 → DeepSeek 图片识别网关」：

| 字段 | 值 |
|---|---|
| 网关地址 | `https://carbonmate-ai-gateway.onrender.com` |
| 客户端令牌 | 与 `CARBONMATE_AI_CLIENT_TOKEN` 相同 |

注意用 `https://`，不要加 `:4175`。

## 自检

```bash
curl -H "Authorization: Bearer <TOKEN>" https://<你的域名>/api/health
# → {"ready":true,"provider":"DeepSeek","model":"deepseek-flash"}
```

不带令牌应返回 401，说明令牌校验生效。

## 免费额度的两个坑

1. **冷启动**：免费实例闲置 15 分钟后休眠，下一次请求要等 30–60 秒才响应。
   比赛演示前先调一次 `/api/health` 唤醒，别在评委面前等。
2. **每月时长**：免费额度约 750 小时/月，够单人调试；长期演示建议升到 Starter（$7/月，不休眠）。

## 安全边界

- 令牌失效即 401，网关本身不做限流，公开到公网时别把令牌写进任何前端代码；
- 图片只在内存里转发给 DeepSeek，不落盘、不记录日志；
- 若只在自己电脑上用，继续用本地 `server/ai-server.mjs` 更省事，不需要这套。
