# 冥想夜 - 微信小程序版 🌸

冥想疗愈应用的微信小程序原生版本。

## 后端配置

本项目使用 **火山引擎 ARK 模型** 生成诗句。

### 需要在 Vercel 后端配置的环境变量：

| 变量名 | 说明 |
|--------|------|
| `ARK_API_KEY` | ARK API 密钥 |
| `ARK_MODEL_ID` | ARK 模型接入点 ID |

详见主项目 README。

## 目录结构

```
mingxiangye-miniprogram/
├── app.js                 # 小程序入口
├── app.json               # 全局配置
├── app.wxss               # 全局样式
├── sitemap.json           # 小程序索引配置
├── images/
│   └── lotus.svg          # 莲花图标
├── utils/
│   └── api.js             # API 调用封装
└── pages/
    ├── sowing/            # 执念输入页
    │   ├── sowing.wxml
    │   ├── sowing.wxss
    │   ├── sowing.js
    │   └── sowing.json
    ├── incubation/        # 冥想过程页
    │   ├── incubation.wxml
    │   ├── incubation.wxss
    │   ├── incubation.js
    │   └── incubation.json
    ├── blooming/          # 结果展示页
    │   ├── blooming.wxml
    │   ├── blooming.wxss
    │   ├── blooming.js
    │   └── blooming.json
    └── gallery/           # 心境图鉴页
        ├── gallery.wxml
        ├── gallery.wxss
        ├── gallery.js
        └── gallery.json
```

## 配置说明

### API 地址配置

在 `app.js` 中修改 `apiBaseUrl`：

```javascript
globalData: {
  apiBaseUrl: 'https://your-api-domain.com'
}
```

### 后端 API 要求

后端需要提供 `/api/meditation/start` 接口：

**请求：**
```
POST /api/meditation/start
Content-Type: application/json
x-user-id: user_xxx

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
    "imageBase64": "https://xxx.jpg 或 data:image/jpeg;base64,..."
  }
}
```

## 使用方式

1. 下载微信开发者工具
2. 导入此目录
3. 修改 `app.js` 中的 `apiBaseUrl`
4. 点击「编译」预览

## 页面说明

| 页面 | 路径 | 功能 |
|------|------|------|
| 执念输入 | pages/sowing/sowing | 用户输入执念 |
| 冥想过程 | pages/incubation/incubation | 7 分钟冥想 + AI 生成 |
| 结果展示 | pages/blooming/blooming | 展示诗句和画作 |
| 心境图鉴 | pages/gallery/gallery | 收藏历史 |

## 注意事项

1. 小程序需要在微信公众平台配置合法域名
2. 如使用 base64 图片，可能需要处理图片缓存
3. 禅意风格图片使用 Unsplash，确保网络可访问
