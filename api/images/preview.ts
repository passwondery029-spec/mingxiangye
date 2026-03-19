import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getImageLibrary, getMatchedImage } from '../images';

// 图片库查询端点
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { keyword, count } = req.query;
  
  // 如果有关键词，返回匹配的图片
  if (keyword && typeof keyword === 'string') {
    const matched = getMatchedImage(keyword);
    return res.status(200).json({
      keyword,
      matched: {
        url: matched.url,
        tags: matched.tags,
        emotions: matched.emotions
      }
    });
  }
  
  // 返回图片库统计
  const library = getImageLibrary();
  
  // 统计分类
  const categories = {
    '山水意境': library.filter(i => i.tags.some(t => ['山', '水', '山峦', '河流'].includes(t))).length,
    '水之意象': library.filter(i => i.tags.some(t => ['水', '海', '河', '湖'].includes(t))).length,
    '花草植物': library.filter(i => i.tags.some(t => ['花', '树', '草', '叶'].includes(t))).length,
    '天空云霞': library.filter(i => i.tags.some(t => ['天', '云', '星', '月'].includes(t))).length,
    '禅意空间': library.filter(i => i.tags.some(t => ['禅', '茶', '静', '冥想'].includes(t))).length,
    '季节更替': library.filter(i => i.tags.some(t => ['春', '夏', '秋', '冬'].includes(t))).length,
    '动物生灵': library.filter(i => i.elements.some(e => ['bird', 'fish', 'deer', 'cat', 'butterfly'].includes(e))).length,
  };
  
  // 返回部分图片预览
  const previewCount = Math.min(Number(count) || 20, 100);
  const preview = library.slice(0, previewCount).map(img => ({
    url: img.url,
    tags: img.tags.slice(0, 3),
    emotions: img.emotions.slice(0, 2),
    style: img.style
  }));
  
  return res.status(200).json({
    total: library.length,
    categories,
    preview
  });
}
