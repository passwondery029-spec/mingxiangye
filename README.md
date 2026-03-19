# 冥想夜 🌸

一款冥想疗愈应用，用户输入执念后通过 7 分钟冥想，AI 生成专属画作和诗句。

## 多端版本

本项目提供两个版本：

| 版本 | 目录 | 技术栈 | 适用场景 |
|------|------|--------|----------|
| Web 版 | `/` (根目录) | React + Vite + Tailwind | 网页、H5 |
| 小程序版 | `/miniprogram` | 微信小程序原生 | 微信小程序 |

## 功能特性

- **执念输入** - 用户输入心中的执念或烦恼
- **情绪炼金** - AI（ARK 模型）根据执念生成疗愈诗句
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
│  调用 ARK API (火山引擎) 生成诗句                             │
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
| AI | 火山引擎 ARK 模型 |

## 环境变量配置

### 需要配置的环境变量

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `ARK_API_KEY` | ARK API 密钥 | 火山引擎控制台 |
| `ARK_MODEL_ID` | ARK 模型 ID | 火山引擎控制台（推理接入点） |

### 获取 ARK API Key

1. **注册火山引擎账号**
   - 访问 [火山引擎](https://www.volcengine.com/)
   - 注册并登录

2. **开通 ARK 服务**
   - 进入 [ARK 控制台](https://console.volcengine.com/ark)
   - 开通服务

3. **创建 API Key**
   - 左侧菜单 → 「API Key 管理」
   - 点击「创建 API Key」
   - 复制生成的 Key

4. **创建模型接入点**
   - 左侧菜单 → 「推理」→「创建推理接入点」
   - 选择模型（推荐：Doubao-pro-32k 或其他）
   - 创建后会得到一个接入点 ID（格式：`ep-xxxxxxxxxxxx`）
   - 这就是你的 `ARK_MODEL_ID`

### Vercel 配置步骤

1. 进入 Vercel 项目 → **Settings** → **Environment Variables**
2. 添加两个变量：
   ```
   ARK_API_KEY = 你的API密钥
   ARK_MODEL_ID = ep-xxxxxxxxxxxx
   ```
3. 选择 **Production, Preview, Development**
4. 点击 **Save**
5. **重要**：保存后需要 **Redeploy** 才能生效！

## 目录结构

```
mingxiangye/
├── api/                      # Vercel Serverless Functions
│   ├── meditation/
│   │   └── start.ts          # 冥想生成 API（主逻辑）
│   ├── health.ts             # 健康检查
│   └── debug.ts              # 环境变量调试
├── miniprogram/              # 微信小程序版本
├── src/
│   ├── components/           # React 组件
│   ├── services/
│   │   └── geminiService.ts  # API 调用服务
│   ├── App.tsx               # 主应用
│   └── main.tsx              # 入口
├── vercel.json               # Vercel 配置
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
    "imageBase64": "https://images.unsplash.com/..."
  }
}
```

### GET /api/debug

检查环境变量配置状态。

## 本地开发

```bash
# 1. 安装依赖
pnpm install

# 2. 创建 .env 文件
echo "ARK_API_KEY=your_api_key" > .env
echo "ARK_MODEL_ID=ep-xxxxxxxxxxxx" >> .env

# 3. 启动开发服务器
pnpm dev
```

## 安全说明

- ARK_API_KEY 只存在于 Vercel 后端环境变量
- 前端代码不包含任何密钥
- 用户无法通过浏览器获取 API Key

## 业务逻辑

### 每日限制

- 每日 3 次 AI 生成（静默处理，用户无感知）
- 超限后自动使用兜底内容

### 兜底内容

- 30 张精选 Unsplash 禅意图片
- 6 首原创禅意诗句

## 许可证

MIT
