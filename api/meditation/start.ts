import type { VercelRequest, VercelResponse } from '@vercel/node';

// ==================== 100张水墨/绘画风格图片库 ====================
// 使用 Unsplash 直链图片（国内可访问）

interface ImageItem {
  url: string;
  tags: string[];
  emotions: string[];
}

const IMAGES: ImageItem[] = [
  // ==================== 山水水墨画 (1-20) ====================
  { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80', tags: ['山', '星空', '夜晚', '梦想'], emotions: ['宁静', '梦想', '神秘'] },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', tags: ['山', '水墨', '意境', '禅意'], emotions: ['禅意', '意境', '宁静'] },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', tags: ['山', '云海', '日出', '希望'], emotions: ['希望', '壮阔', '新生'] },
  { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', tags: ['山', '雾', '森林', '神秘'], emotions: ['神秘', '宁静', '深远'] },
  { url: 'https://images.unsplash.com/photo-1464823063530-27f46bf2b48e?w=800&q=80', tags: ['雪山', '纯净', '高远'], emotions: ['纯净', '超脱', '宁静'] },
  { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', tags: ['雾', '山', '神秘', '朦胧'], emotions: ['神秘', '朦胧', '未知'] },
  { url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80', tags: ['山峰', '攀登', '向上', '力量'], emotions: ['力量', '坚定', '向上'] },
  { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', tags: ['草原', '宽广', '自由', '舒展'], emotions: ['自由', '宽广', '舒展'] },
  { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', tags: ['远山', '云', '远方', '梦想'], emotions: ['梦想', '远方', '希望'] },
  { url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80', tags: ['雪山', '纯净', '高远', '超脱'], emotions: ['纯净', '超脱', '升华'] },
  { url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80', tags: ['日落', '山', '宁静', '温暖'], emotions: ['宁静', '温暖', '安详'] },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', tags: ['树', '夕阳', '孤独', '思考'], emotions: ['孤独', '思考', '宁静'] },
  { url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80', tags: ['星空', '山', '宇宙', '无限'], emotions: ['无限', '梦想', '宁静'] },
  { url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80', tags: ['山', '湖', '倒影', '平静'], emotions: ['平静', '自省', '澄澈'] },
  { url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80', tags: ['山谷', '阳光', '温暖'], emotions: ['温暖', '平静', '安详'] },
  { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80', tags: ['森林', '光', '希望', '指引'], emotions: ['希望', '指引', '温暖'] },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', tags: ['森林', '阳光', '温暖', '治愈'], emotions: ['治愈', '温暖', '希望'] },
  { url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80', tags: ['雨', '窗户', '思考', '内省'], emotions: ['内省', '思考', '平静'] },
  { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', tags: ['山', '旅途', '陪伴', '友情'], emotions: ['陪伴', '温暖', '友情'] },
  { url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80', tags: ['极光', '奇迹', '神秘', '美丽'], emotions: ['奇迹', '神秘', '震撼'] },

  // ==================== 花卉植物 (21-40) ====================
  { url: 'https://images.unsplash.com/photo-1518882605630-8eb582ebb004?w=800&q=80', tags: ['莲花', '纯净', '禅意', '觉悟'], emotions: ['纯净', '觉悟', '圣洁'] },
  { url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80', tags: ['樱花', '春天', '美丽', '短暂'], emotions: ['美丽', '珍惜', '温柔'] },
  { url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', tags: ['花', '绽放', '美丽', '希望'], emotions: ['绽放', '美丽', '希望'] },
  { url: 'https://images.unsplash.com/photo-1552083375-1447ce886485?w=800&q=80', tags: ['竹子', '坚韧', '正直'], emotions: ['坚韧', '正直', '向上'] },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', tags: ['叶子', '秋天', '放下', '轮回'], emotions: ['放下', '轮回', '释然'] },
  { url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80', tags: ['树', '成长', '生命', '扎根'], emotions: ['成长', '生命', '坚强'] },
  { url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80', tags: ['树枝', '极简', '禅意', '留白'], emotions: ['禅意', '极简', '宁静'] },
  { url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', tags: ['春天', '新生', '希望', '绿色'], emotions: ['新生', '希望', '活力'] },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', tags: ['秋天', '金黄', '收获', '成熟'], emotions: ['收获', '成熟', '满足'] },
  { url: 'https://images.unsplash.com/photo-1518882605630-8eb582ebb004?w=800&q=80', tags: ['花', '温柔', '治愈', '美丽'], emotions: ['温柔', '治愈', '美丽'] },
  { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', tags: ['植物', '坚韧', '生命力'], emotions: ['坚韧', '生命力', '顽强'] },
  { url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80', tags: ['花', '浪漫', '温柔', '爱'], emotions: ['浪漫', '温柔', '爱'] },
  { url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', tags: ['花', '绽放', '美丽', '希望'], emotions: ['绽放', '美丽', '希望'] },
  { url: 'https://images.unsplash.com/photo-1518882605630-8eb582ebb004?w=800&q=80', tags: ['雏菊', '纯洁', '简单', '美好'], emotions: ['纯洁', '简单', '美好'] },
  { url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80', tags: ['樱花', '春天', '浪漫', '美丽'], emotions: ['浪漫', '美丽', '温柔'] },
  { url: 'https://images.unsplash.com/photo-1518882605630-8eb582ebb004?w=800&q=80', tags: ['郁金香', '优雅', '美丽', '绽放'], emotions: ['优雅', '美丽', '绽放'] },
  { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', tags: ['嫩芽', '新生', '希望', '开始'], emotions: ['新生', '希望', '开始'] },
  { url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80', tags: ['叶子', '自然', '简单', '纯净'], emotions: ['简单', '纯净', '自然'] },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', tags: ['树枝', '秋天', '放下', '告别'], emotions: ['放下', '告别', '释然'] },
  { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80', tags: ['森林', '宁静', '治愈', '自然'], emotions: ['宁静', '治愈', '自然'] },

  // ==================== 水之意象 (41-60) ====================
  { url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80', tags: ['海浪', '力量', '冲击', '释放'], emotions: ['释放', '力量', '冲击'] },
  { url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80', tags: ['瀑布', '流动', '释放', '净化'], emotions: ['释放', '净化', '流动'] },
  { url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80', tags: ['海洋', '宽广', '包容', '无限'], emotions: ['包容', '宽广', '豁达'] },
  { url: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80', tags: ['水滴', '涟漪', '细微'], emotions: ['细腻', '温柔', '感动'] },
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', tags: ['海边', '沙滩', '放松', '自由'], emotions: ['放松', '自由', '宁静'] },
  { url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80', tags: ['溪流', '清澈', '纯净', '流动'], emotions: ['纯净', '清澈', '流动'] },
  { url: 'https://images.unsplash.com/photo-1439405326854-0145970891b8?w=800&q=80', tags: ['湖', '倒影', '自省', '平静'], emotions: ['自省', '平静', '沉思'] },
  { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', tags: ['海边', '日落', '宁静', '浪漫'], emotions: ['宁静', '浪漫', '温暖'] },
  { url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80', tags: ['海', '日落', '温暖', '安详'], emotions: ['温暖', '安详', '宁静'] },
  { url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80', tags: ['浪', '力量', '冲击', '突破'], emotions: ['力量', '突破', '冲击'] },
  { url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80', tags: ['海浪', '自由', '力量', '释放'], emotions: ['自由', '释放', '力量'] },
  { url: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80', tags: ['浪', '冲击', '力量', '突破'], emotions: ['突破', '力量', '冲击'] },
  { url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80', tags: ['水', '平静', '清澈', '纯净'], emotions: ['平静', '清澈', '纯净'] },
  { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80', tags: ['溪流', '森林', '治愈', '自然'], emotions: ['治愈', '自然', '宁静'] },
  { url: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80', tags: ['水', '涟漪', '平静', '治愈'], emotions: ['治愈', '平静', '安宁'] },
  { url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80', tags: ['雨', '洗涤', '净化', '释然'], emotions: ['净化', '释然', '洗涤'] },
  { url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80', tags: ['水滴', '清新', '纯净', '希望'], emotions: ['清新', '纯净', '希望'] },
  { url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80', tags: ['湖', '秋天', '宁静', '美丽'], emotions: ['宁静', '美丽', '安详'] },
  { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', tags: ['河', '流动', '放下', '顺其自然'], emotions: ['放下', '顺其自然', '流动'] },
  { url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80', tags: ['海洋', '宽广', '自由', '无限'], emotions: ['自由', '无限', '宽广'] },

  // ==================== 天空云霞 (61-80) ====================
  { url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80', tags: ['日落', '温暖', '宁静', '美丽'], emotions: ['温暖', '宁静', '美丽'] },
  { url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80', tags: ['云', '自由', '漂浮', '轻盈'], emotions: ['自由', '轻盈', '无拘'] },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', tags: ['蓝天', '宽广', '自由', '豁达'], emotions: ['自由', '豁达', '宽广'] },
  { url: 'https://images.unsplash.com/photo-1478265409131-851e21ca9e06?w=800&q=80', tags: ['雪', '纯净', '洁白', '宁静'], emotions: ['纯净', '洁白', '宁静'] },
  { url: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=80', tags: ['彩虹', '希望', '奇迹', '美好'], emotions: ['希望', '奇迹', '美好'] },
  { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80', tags: ['月亮', '思念', '浪漫', '宁静'], emotions: ['思念', '浪漫', '宁静'] },
  { url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80', tags: ['日出', '希望', '新的开始', '光明'], emotions: ['希望', '开始', '光明'] },
  { url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80', tags: ['星空', '梦想', '无限', '神秘'], emotions: ['梦想', '无限', '神秘'] },
  { url: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=80', tags: ['雨后', '彩虹', '希望', '转机'], emotions: ['希望', '转机', '美好'] },
  { url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80', tags: ['日落', '温暖', '安详', '美丽'], emotions: ['温暖', '安详', '美丽'] },
  { url: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800&q=80', tags: ['晚霞', '绚烂', '美丽', '感动'], emotions: ['绚烂', '美丽', '感动'] },
  { url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80', tags: ['日落', '温暖', '希望', '安详'], emotions: ['温暖', '希望', '安详'] },
  { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', tags: ['日落', '海', '宁静', '浪漫'], emotions: ['宁静', '浪漫', '温暖'] },
  { url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80', tags: ['云', '自由', '漂浮', '无拘'], emotions: ['自由', '无拘', '漂浮'] },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', tags: ['云', '蓝天', '自由', '宽广'], emotions: ['自由', '宽广', '舒展'] },
  { url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80', tags: ['湖', '倒影', '平静', '自省'], emotions: ['平静', '自省', '沉思'] },
  { url: 'https://images.unsplash.com/photo-1478265409131-851e21ca9e06?w=800&q=80', tags: ['云', '阳光', '希望', '温暖'], emotions: ['希望', '温暖', '光明'] },
  { url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80', tags: ['云', '自由', '漂浮', '轻盈'], emotions: ['自由', '轻盈', '无拘'] },
  { url: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=80', tags: ['云', '阳光', '希望', '光明'], emotions: ['希望', '光明', '温暖'] },
  { url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80', tags: ['云', '日落', '温暖', '美丽'], emotions: ['温暖', '美丽', '安详'] },

  // ==================== 禅意空间 (81-90) ====================
  { url: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80', tags: ['蜡烛', '温暖', '光明', '希望'], emotions: ['温暖', '希望', '宁静'] },
  { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', tags: ['桥', '过渡', '连接', '跨越'], emotions: ['跨越', '过渡', '连接'] },
  { url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', tags: ['冥想', '静心', '禅意', '觉知'], emotions: ['静心', '觉知', '平和'] },
  { url: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80', tags: ['蜡烛', '温暖', '宁静', '光明'], emotions: ['温暖', '宁静', '光明'] },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', tags: ['蜡烛', '温暖', '希望', '安宁'], emotions: ['温暖', '希望', '安宁'] },
  { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', tags: ['瑜伽', '冥想', '静心', '放松'], emotions: ['静心', '放松', '平和'] },
  { url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', tags: ['冥想', '禅意', '静心', '觉知'], emotions: ['静心', '禅意', '觉知'] },
  { url: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80', tags: ['冥想', '宁静', '禅意', '平和'], emotions: ['宁静', '禅意', '平和'] },
  { url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', tags: ['冥想', '静心', '禅意', '内省'], emotions: ['静心', '内省', '禅意'] },
  { url: 'https://images.unsplash.com/photo-1478265409131-851e21ca9e06?w=800&q=80', tags: ['光', '希望', '温暖', '指引'], emotions: ['希望', '温暖', '指引'] },

  // ==================== 动物生灵 (91-100) ====================
  { url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80', tags: ['鸟', '自由', '飞翔', '超越'], emotions: ['自由', '飞翔', '超越'] },
  { url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80', tags: ['飞鸟', '自由', '远方', '梦想'], emotions: ['自由', '梦想', '远方'] },
  { url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80', tags: ['蝴蝶', '蜕变', '美丽', '重生'], emotions: ['蜕变', '美丽', '重生'] },
  { url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80', tags: ['猫', '安静', '独立', '自在'], emotions: ['安静', '独立', '自在'] },
  { url: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=800&q=80', tags: ['鹿', '灵动', '优雅', '温柔'], emotions: ['灵动', '优雅', '温柔'] },
  { url: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800&q=80', tags: ['鱼', '自由', '游弋', '流动'], emotions: ['自由', '流动', '无拘'] },
  { url: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=800&q=80', tags: ['鹰', '远见', '力量', '高远'], emotions: ['远见', '力量', '高远'] },
  { url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80', tags: ['鸟', '自由', '飞翔', '无拘'], emotions: ['自由', '无拘', '飞翔'] },
  { url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80', tags: ['蝴蝶', '美丽', '自由', '蜕变'], emotions: ['美丽', '自由', '蜕变'] },
  { url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80', tags: ['蝴蝶', '美丽', '轻盈', '自由'], emotions: ['美丽', '轻盈', '自由'] },
];

// ==================== 关键词匹配 ====================

const EMOTION_MAP: Record<string, string[]> = {
  '焦虑': ['宁静', '平静', '放松', '释然'],
  '迷茫': ['希望', '方向', '光明', '指引'],
  '孤独': ['陪伴', '温暖', '理解', '共鸣'],
  '失落': ['希望', '新生', '开始', '期待'],
  '愤怒': ['平静', '释放', '冷静', '平和'],
  '悲伤': ['治愈', '温暖', '希望', '安慰'],
  '恐惧': ['勇气', '力量', '安全', '坚定'],
  '压力': ['放松', '释放', '自由', '舒展'],
  '纠结': ['放下', '释然', '选择', '决定'],
  '执着': ['放下', '随缘', '释然', '自由'],
  '不甘': ['放下', '释然', '接纳', '和解'],
  '疲惫': ['休息', '疗愈', '恢复', '放松'],
  '烦躁': ['平静', '宁静', '冷静', '安抚'],
  '伤心': ['治愈', '温暖', '安慰', '陪伴'],
  '难过': ['治愈', '温暖', '希望', '释然'],
  '痛苦': ['治愈', '释放', '放下', '解脱'],
  '担心': ['安心', '平静', '信任', '放下'],
  '希望': ['希望', '光明', '期待', '新生'],
  '爱': ['爱情', '温暖', '浪漫', '深情'],
  '梦想': ['梦想', '追求', '翱翔', '无限'],
  '自由': ['自由', '无拘', '飞翔', '宽广'],
  '复苏': ['新生', '希望', '春天', '活力'],
  '未来': ['希望', '光明', '梦想', '新生'],
};

const THEME_MAP: Record<string, string[]> = {
  '工作': ['山', '向上', '攀登', '成长', '坚定'],
  '事业': ['山', '远山', '日出', '阳光', '希望'],
  '爱情': ['花', '温暖', '浪漫', '美丽'],
  '感情': ['花', '温暖', '治愈', '放下'],
  '家庭': ['温暖', '和谐', '宁静', '安宁'],
  '健康': ['生命', '活力', '自然', '成长'],
  '金钱': ['收获', '金黄', '成熟'],
  '学习': ['智慧', '成长', '新生'],
  '未来': ['日出', '光明', '希望', '梦想'],
  '过去': ['放下', '释然', '回忆', '告别'],
  '万物': ['自然', '生命', '春天', '新生'],
};

function matchImage(obsession: string): { url: string; tags: string[]; emotions: string[] } {
  const keywords: string[] = [];
  
  for (const [k, v] of Object.entries(EMOTION_MAP)) {
    if (obsession.includes(k)) keywords.push(k, ...v);
  }
  for (const [k, v] of Object.entries(THEME_MAP)) {
    if (obsession.includes(k)) keywords.push(k, ...v);
  }
  
  const words = obsession.split(/[，。、！？\s,.\!?]+/).filter(k => k.length > 0);
  keywords.push(...words);
  
  console.log('[匹配] 输入:', obsession, '关键词:', keywords.slice(0, 10).join(','));
  
  const scores = IMAGES.map(img => {
    let score = 0;
    for (const kw of keywords) {
      if (img.tags.some(t => kw.includes(t) || t.includes(kw))) score += 3;
      if (img.emotions.some(e => kw.includes(e) || e.includes(kw))) score += 2;
    }
    return { img, score };
  });
  
  scores.sort((a, b) => b.score - a.score);
  
  const topScore = scores[0].score;
  const topImages = scores.filter(s => s.score >= Math.max(0, topScore - 1));
  const selected = topImages[Math.floor(Math.random() * topImages.length)];
  
  console.log('[匹配] 最高分:', topScore, '选中:', selected.img.tags.slice(0, 3));
  
  return { url: selected.img.url, tags: selected.img.tags, emotions: selected.img.emotions };
}

// ==================== ARK API ====================

async function callARK(obsession: string): Promise<{ title: string; poem: string }> {
  const apiKey = process.env.ARK_API_KEY;
  const modelId = process.env.ARK_MODEL_ID || 'ep-m-20260305204118-rh2xg';
  
  const fallback = { title: '心境', poem: '心若止水，\n万物皆空。\n执念如云，\n随风而去。' };
  
  if (!apiKey) {
    console.log('[ARK] API Key 未配置');
    return fallback;
  }
  
  try {
    console.log('[ARK] 调用:', modelId);
    
    const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: 'system', content: '你是东方禅意疗愈师。根据用户执念写4-6行现代诗。返回JSON: {"title":"标题","poem":"诗句\\n换行"}' },
          { role: 'user', content: `执念：「${obsession}」` }
        ],
        temperature: 0.8,
        max_tokens: 200
      })
    });
    
    if (!res.ok) {
      console.error('[ARK] 错误:', res.status);
      return fallback;
    }
    
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';
    console.log('[ARK] 响应:', content.substring(0, 80));
    
    const jsonStr = content.match(/\{[\s\S]*\}/)?.[0] || content;
    const json = JSON.parse(jsonStr);
    
    return {
      title: json.title || fallback.title,
      poem: (json.poem || fallback.poem).replace(/\\n/g, '\n')
    };
  } catch (e) {
    console.error('[ARK] 异常:', e);
    return fallback;
  }
}

// ==================== 主函数 ====================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { obsession } = req.body || {};
    console.log('[API] 请求:', obsession);
    
    if (!obsession) return res.status(400).json({ error: '请输入执念' });

    const [img, poem] = await Promise.all([
      Promise.resolve(matchImage(obsession)),
      callARK(obsession)
    ]);
    
    console.log('[API] 完成 - 图片:', img.tags.slice(0, 2), '标题:', poem.title);

    return res.status(200).json({
      sessionId: `session_${Date.now()}`,
      status: 'completed',
      result: {
        title: poem.title,
        poem: poem.poem,
        imageBase64: img.url,
        matchedTags: img.tags,
        matchedEmotions: img.emotions
      }
    });

  } catch (error: any) {
    console.error('[API] 异常:', error);
    
    const randomImg = IMAGES[Math.floor(Math.random() * IMAGES.length)];
    
    return res.status(200).json({
      sessionId: `session_${Date.now()}`,
      status: 'completed',
      result: {
        title: '心境',
        poem: '心若止水，\n万物皆空。\n执念如云，\n随风而去。',
        imageBase64: randomImg.url,
        matchedTags: randomImg.tags,
        matchedEmotions: randomImg.emotions
      }
    });
  }
}
