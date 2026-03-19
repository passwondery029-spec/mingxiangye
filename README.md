# 冥想夜 🌸

一款冥想疗愈应用，用户输入执念后通过 7 分钟冥想，AI 生成专属画作和诗句。

## 功能特性

- **执念输入** - 用户输入心中的执念或烦恼
- **情绪炼金** - AI（Gemini）根据执念生成疗愈诗句和画作
- **冥想体验** - 7 分钟引导冥想
- **视觉化疗愈** - 展示 AI 生成的禅意水墨画
- **资产沉淀** - 历史记录保存

## 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                      前端 (React + Vite)                     │
│  - Tailwind CSS 水墨风格 UI                                  │
│  - Motion 动画效果                                          │
│  - 通过 /api 调用后端                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              后端 (Vercel Serverless Functions)              │
│  - api/meditation/start.ts - 冥想生成 API                    │
│  - api/health.ts - 健康检查                                  │
│  - api/debug.ts - 环境变量调试                                │
│                                                              │
│  调用 Gemini API 生成诗句和画作                               │
└─────────────────────────────────────────────────────────────┘
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite 6 |
| 样式 | Tailwind CSS 4 |
| 动画 | Motion |
| 后端 | Vercel Serverless Functions |
| AI | Google Gemini API |

## 目录结构

```
mingxiangye/
├── api/                      # Vercel Serverless Functions
│   ├── meditation/
│   │   └── start.ts          # 冥想生成 API（主逻辑）
│   ├── health.ts             # 健康检查
│   └── debug.ts              # 环境变量调试
├── src/
│   ├── components/           # React 组件
│   │   ├── SowingPage.tsx    # 执念输入页
│   │   ├── IncubationPage.tsx # 冥想过程页
│   │   ├── BloomingPage.tsx  # 结果展示页
│   │   └── GalleryPage.tsx   # 历史记录页
│   ├── services/
│   │   └── geminiService.ts  # API 调用服务
│   ├── App.tsx               # 主应用
│   └── main.tsx              # 入口
├── public/                   # 静态资源
├── vercel.json               # Vercel 配置
├── vite.config.ts            # Vite 配置
└── package.json              # 依赖配置
```

## API 接口

### POST /api/meditation/start

开始冥想，生成疗愈内容。

**请求：**
```json
{
  "obsession": "希望找到内心的平静"
}
```

**响应：**
```json
{
  "sessionId": "session_xxx",
  "status": "completed",
  "result": {
    "title": "心境",
    "poem": "心若止水，\n万物皆空。",
    "imageBase64": "data:image/jpeg;base64,..."
  }
}
```

### GET /api/health

健康检查。

### GET /api/debug

检查环境变量配置状态。

## 本地开发

### 前置条件

- Node.js 20+
- pnpm（推荐）或 npm

### 步骤

```bash
# 1. 安装依赖
pnpm install

# 2. 创建 .env 文件（仅本地开发需要）
echo "GEMINI_API_KEY=your_api_key_here" > .env

# 3. 启动开发服务器
pnpm dev

# 访问 http://localhost:5000
```

## Vercel 部署

### 1. 连接 GitHub 仓库

在 Vercel 中导入 GitHub 仓库。

### 2. 配置环境变量

在 **Settings → Environment Variables** 添加：

```
GEMINI_API_KEY = 你的 Gemini API Key
```

### 3. 部署

Vercel 会自动检测 Vite 项目并部署。

### 4. 验证

- 访问 `/api/health` 确认服务正常
- 访问 `/api/debug` 确认环境变量已配置

## 安全说明

⚠️ **API Key 安全**

- GEMINI_API_KEY 只存在于 Vercel 后端环境变量
- 前端代码不包含任何密钥
- 用户无法通过浏览器获取 API Key

## 业务逻辑

### 每日限制

- 每日 3 次 AI 生成（静默处理，用户无感知）
- 超限后自动使用兜底内容

### 兜底内容

- 30 张精选 Unsplash 禅意图片
- 6 首原创禅意诗句

## 获取 Gemini API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 创建 API Key
3. 将 Key 配置到 Vercel 环境变量

## 许可证

MIT
