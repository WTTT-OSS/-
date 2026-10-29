# 碳伴 CarbonMate

运行在 HarmonyOS 上的低碳生活记录应用。记录九类日常低碳行为，保存时生成碳排放估算，并累计成个人碳账户。

- 参赛赛题：开源鸿蒙大赛 · 赛题二　碳足迹 · 全民绿色生活碳积分与减排指南
- 运行环境：HarmonyOS，API 12（5.0.0）
- 包名：`com.carbonmate.openharmony`

## 功能

| 入口 | 内容 |
|---|---|
| 首页 | 当日估算、累计减碳量、当日任务、本周建议 |
| 记录 | 九类行为表单、拍照识别、历史检索、编辑与删除 |
| 数据 | 日 / 周 / 月 / 年趋势、柱状与折线切换、类别构成、CSV 导出 |
| 科普 | 六个递进专题与配套练习 |
| 我的 | 积分、徽章、数字纪念、家庭碳账户、识别网关设置 |

九类行为：骑行、步行、公交、地铁、节约用电、节约用水、纸类回收、光盘行动、旧物再利用。

## 目录结构

```
entry/            应用模块（ArkTS / ArkUI）
  src/main/ets/
    pages/        五个一级页面
    components/   通用组件
    domain/       因子仓库、计算、统计、导出
    services/     记录、积分、任务、家庭同步
    data/         关系型数据库与迁移
server/           拍照识别网关（本地 Node 服务）
deploy/render/    网关的 Render 部署包
web-preview/      网页版预览（仅用于调试）
tests/            领域层单元测试
docs/             架构、因子治理与实施状态文档
```

## 本地运行

1. DevEco Studio 打开工程，选中 `entry` 模块运行；
2. 拍照识别需要先启动网关：

```powershell
Copy-Item .env.example .env
# 在 .env 里填写 DEEPSEEK_API_KEY 与 CARBONMATE_AI_CLIENT_TOKEN（≥24 位）
node server/ai-server.mjs
```

3. App 内「我的 → DeepSeek 图片识别网关」填写网关地址与客户端令牌。

## 测试

```powershell
node --test tests/
```

## 估算口径

- 节约用电：0.5306 kg CO₂/kWh，取自生态环境部与国家统计局《2023 年电力二氧化碳排放因子》全国平均值（官方因子）。
- 其余八类为参考值，由公开参数复算，用于趋势比较，不作核证依据；每条记录都保存因子标识、版本与等级。
