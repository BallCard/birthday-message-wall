# 生日祝福墙

> 访客留言、送礼祝福，给 TA 一个温暖的生日惊喜

一个全栈生日留言墙应用。朋友们的祝福化作卡片飘落在页面上，还可以送虚拟礼物、和桌面宠物互动。

| 项目状态 | 用途 | 在线成果 | 验证命令 | 下一步 |
|---|---|---|---|---|
| 已完成（一次性活动项目） | 为特定生日活动收集和展示祝福 | [Vercel 演示](https://birthday-message-wall.vercel.app/) | `npm run lint && npm run build` | 归档维护，无计划新增功能 |

## 在线体验

[https://birthday-message-wall.vercel.app/](https://birthday-message-wall.vercel.app/)

> 在线服务依赖 Vercel 与 Upstash Redis。仓库保存源码和设计资料，不保存线上留言数据或平台账号配置。

## 预览

<p align="center">
  <img src="docs/screenshots/01-main.png" width="600"/>
</p>

## 功能

- **祝福卡片墙** — 访客留下祝福，以卡片形式展示
- **虚拟礼物** — 蛋糕、蜡烛、花束、气球、星星、烟花，送给任意祝福
- **桌面宠物** — 可爱的桌面小角色，会回应你的互动
- **庆祝动效** — 彩纸飘落、烟花绽放、花瓣飘落等动画
- **口令保护** — 可选的密钥验证，限制随意发帖
- **响应式设计** — 手机和电脑都能用

## 项目成果

- 完成 React 前端、Vercel Serverless API 与 Redis 数据存储的全栈交付
- 提供留言、虚拟礼物、互动宠物、庆祝动效和可选口令保护
- 保留设计规格、视觉生成提示词和最终页面截图，便于理解与复用
- 项目过程与关键取舍见 [项目故事](docs/PROJECT_STORY.md)
- 最终交付与验证边界见 [验收记录](docs/ACCEPTANCE.md)

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 19 + TypeScript + Tailwind CSS + Motion |
| 后端 | Vercel Serverless Functions (Node.js) |
| 数据库 | Upstash Redis (Vercel KV) |
| 部署 | Vercel |

## 快速开始

1. **克隆并安装依赖：**
   ```bash
   git clone https://github.com/BallCard/birthday-message-wall.git
   cd birthday-message-wall
   npm install
   ```

2. **部署到 Vercel：**
   ```bash
   vercel --prod
   ```

3. **配置数据库：**
   - Vercel 控制台 → Storage → 创建 **Upstash for Redis**
   - 关联到你的项目

4. **配置环境变量**（Vercel 控制台 → Settings → Environment Variables）：

   | 变量 | 必需 | 说明 |
   |------|------|------|
   | `BIRTHDAY_PERSON` | 是 | 寿星的名字 |
   | `KV_REST_API_URL` | 自动 | Upstash 自动注入 |
   | `KV_REST_API_TOKEN` | 自动 | Upstash 自动注入 |
   | `PASSPHRASE_ENABLED` | 可选 | 设为 `true` 启用口令保护 |
   | `PASSPHRASE_SECRET` | 启用口令时必需 | 自定义口令；不要提交真实值 |
   | `CORS_ORIGINS` | 可选 | 逗号分隔的允许来源 |

5. **重新部署**，然后分享链接！

## 项目结构

```
├── api/                    # Vercel Serverless Functions
│   ├── _lib/               # 共享工具（校验、限流、CORS）
│   ├── config.js           # GET /api/config
│   ├── messages.js         # GET/POST /api/messages
│   ├── gifts.js            # GET /api/gifts
│   └── gifts/send.js       # POST /api/gifts/send
├── src/                    # React 前端
│   ├── components/         # MessageCard、SubmitForm、DesktopPet 等
│   ├── services/           # 音效服务（Web Audio API）
│   └── types.ts            # TypeScript 类型定义
├── docs/                   # 设计文档
└── vercel.json             # 构建和路由配置
```

## 归档说明

仓库保留不可再生或能解释项目的内容：源码、设计决策、提示词、截图和验收记录。以下内容不进入归档，因为可以重新生成或由外部平台管理：

- `node_modules/`、`dist/` 等依赖与构建产物
- Vercel、Upstash 的账号配置和线上运行数据
- 本地 `.env` 与任何真实密钥

恢复开发时，克隆仓库并按“快速开始”重新安装依赖即可。

## License

MIT
