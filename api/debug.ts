import type { VercelRequest, VercelResponse } from '@vercel/node';

// 调试端点 - 检查环境变量配置
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  return res.status(200).json({
    status: 'ok',
    env: {
      GEMINI_API_KEY: apiKey ? {
        set: true,
        length: apiKey.length,
        prefix: apiKey.substring(0, 10) + '...',
        suffix: '...' + apiKey.substring(apiKey.length - 4)
      } : {
        set: false,
        message: 'GEMINI_API_KEY is not set in environment variables'
      },
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    },
    timestamp: new Date().toISOString()
  });
}
