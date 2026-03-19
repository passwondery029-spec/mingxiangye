// 最简单的测试 API
export default function handler(req: any, res: any) {
  res.status(200).json({ 
    message: 'Hello from Vercel!',
    time: new Date().toISOString()
  });
}
