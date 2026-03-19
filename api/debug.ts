import type { VercelRequest, VercelResponse } from '@vercel/node';

// 调试端点 - 检查环境变量配置
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const arkApiKey = process.env.ARK_API_KEY;
  const arkModelId = process.env.ARK_MODEL_ID;
  
  return res.status(200).json({
    status: 'ok',
    env: {
      ARK_API_KEY: arkApiKey ? {
        set: true,
        length: arkApiKey.length,
        prefix: arkApiKey.substring(0, 8) + '...',
      } : {
        set: false,
        message: 'ARK_API_KEY is not set'
      },
      ARK_MODEL_ID: arkModelId ? {
        set: true,
        value: arkModelId
      } : {
        set: false,
        message: 'ARK_MODEL_ID is not set (will use default)'
      },
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    },
    timestamp: new Date().toISOString()
  });
}
