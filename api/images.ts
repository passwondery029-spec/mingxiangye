import type { VercelRequest, VercelResponse } from '@vercel/node';
import { IMAGE_LIBRARY } from './_lib/images';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'GET') {
    // 返回图片库统计
    return res.status(200).json({
      total: IMAGE_LIBRARY.length,
      categories: {
        '山水水墨': IMAGE_LIBRARY.filter(i => i.style.includes('水墨')).length,
      },
      sample: IMAGE_LIBRARY.slice(0, 5).map(i => ({
        url: i.url,
        tags: i.tags,
        style: i.style
      }))
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
