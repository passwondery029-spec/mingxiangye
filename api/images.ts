import type { VercelRequest, VercelResponse } from '@vercel/node';

// ==================== 绘画风格图片库 ====================
// 精选手绘、水墨、插画风格的疗愈图片
// 来源：Pixabay 插画分类、公开艺术作品

interface CuratedImage {
  url: string;
  tags: string[];
  emotions: string[];
  elements: string[];
  style: string;
}

const IMAGE_LIBRARY: CuratedImage[] = [
  // ==================== 山水水墨 (1-20) ====================
  {
    url: 'https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg',
    tags: ['山', '远山', '星空', '夜晚', '梦想'],
    emotions: ['宁静', '梦想', '神秘', '深邃'],
    elements: ['mountain', 'night', 'stars'],
    style: '水墨意境'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/10/20/18/35/earth-1756274_960_720.jpg',
    tags: ['山', '云海', '日出', '希望'],
    emotions: ['希望', '壮阔', '新生', '力量'],
    elements: ['mountain', 'sunrise', 'clouds'],
    style: '水墨写意'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_960_720.jpg',
    tags: ['山', '雾', '森林', '神秘'],
    emotions: ['神秘', '宁静', '深远', '探索'],
    elements: ['mountain', 'fog', 'forest'],
    style: '水墨朦胧'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2017/02/01/12/05/mountains-2029239_960_720.jpg',
    tags: ['雪山', '纯净', '高远', '超脱'],
    emotions: ['纯净', '超脱', '宁静', '升华'],
    elements: ['snow', 'mountain', 'pure'],
    style: '雪山水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_960_720.jpg',
    tags: ['星空', '山', '宇宙', '无限'],
    emotions: ['无限', '梦想', '渺小', '宁静'],
    elements: ['stars', 'mountain', 'universe'],
    style: '星空水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2017/01/14/12/59/iceland-1979455_960_720.jpg',
    tags: ['极光', '奇迹', '神秘', '美丽'],
    emotions: ['奇迹', '神秘', '震撼', '美丽'],
    elements: ['aurora', 'night', 'magic'],
    style: '极光意境'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2018/04/16/16/16/sunset-3325020_960_720.jpg',
    tags: ['日落', '山', '宁静', '温暖'],
    emotions: ['宁静', '温暖', '安详', '释然'],
    elements: ['sunset', 'mountain', 'peace'],
    style: '日落水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2015/07/05/10/18/tree-832079_960_720.jpg',
    tags: ['树', '夕阳', '孤独', '思考'],
    emotions: ['孤独', '思考', '宁静', '美丽'],
    elements: ['tree', 'sunset', 'silhouette'],
    style: '剪影水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2013/07/18/10/56/rain-163612_960_720.jpg',
    tags: ['雨', '窗户', '思考', '内省'],
    emotions: ['内省', '思考', '平静', '忧郁'],
    elements: ['rain', 'window', 'reflection'],
    style: '雨意水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2015/09/09/16/05/forest-931706_960_720.jpg',
    tags: ['森林', '光', '希望', '指引'],
    emotions: ['希望', '指引', '神秘', '温暖'],
    elements: ['forest', 'light', 'path'],
    style: '森林水墨'
  },

  // ==================== 花草植物 (21-40) ====================
  {
    url: 'https://cdn.pixabay.com/photo/2017/08/02/00/49/lotus-2569142_960_720.jpg',
    tags: ['莲花', '纯净', '禅意', '觉悟'],
    emotions: ['纯净', '觉悟', '圣洁', '宁静'],
    elements: ['lotus', 'pure', 'zen'],
    style: '莲花水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/11/29/04/16/blossom-1867602_960_720.jpg',
    tags: ['樱花', '春天', '美丽', '短暂'],
    emotions: ['美丽', '珍惜', '温柔', '感动'],
    elements: ['cherry', 'blossom', 'spring'],
    style: '樱花水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2017/06/26/12/12/nature-2443947_960_720.jpg',
    tags: ['花', '绽放', '美丽', '希望'],
    emotions: ['绽放', '美丽', '希望', '新生'],
    elements: ['flower', 'bloom', 'beauty'],
    style: '花卉水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/01/08/11/54/bamboo-1127557_960_720.jpg',
    tags: ['竹子', '坚韧', '正直', '节节高'],
    emotions: ['坚韧', '正直', '向上', '气节'],
    elements: ['bamboo', 'green', 'strong'],
    style: '竹子水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2017/07/25/14/41/leaf-2538716_960_720.jpg',
    tags: ['叶子', '秋天', '放下', '轮回'],
    emotions: ['放下', '轮回', '释然', '美丽'],
    elements: ['leaf', 'autumn', 'fall'],
    style: '落叶水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/11/23/13/48/flower-1852807_960_720.jpg',
    tags: ['花', '柔和', '温暖', '治愈'],
    emotions: ['温暖', '治愈', '柔和', '美丽'],
    elements: ['flower', 'soft', 'warm'],
    style: '柔花水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2018/05/28/21/52/tree-3436050_960_720.jpg',
    tags: ['树', '成长', '生命', '扎根'],
    emotions: ['成长', '生命', '坚强', '希望'],
    elements: ['tree', 'growth', 'life'],
    style: '树木水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2018/02/19/21/54/branch-3165322_960_720.jpg',
    tags: ['树枝', '极简', '禅意', '留白'],
    emotions: ['禅意', '极简', '宁静', '淡然'],
    elements: ['branch', 'minimal', 'zen'],
    style: '枝条水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2017/05/08/13/15/spring-2296052_960_720.jpg',
    tags: ['春天', '新生', '希望', '绿色'],
    emotions: ['新生', '希望', '活力', '开始'],
    elements: ['spring', 'green', 'new'],
    style: '春意水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/11/22/19/25/autumn-1850223_960_720.jpg',
    tags: ['秋天', '金黄', '收获', '成熟'],
    emotions: ['收获', '成熟', '满足', '美丽'],
    elements: ['autumn', 'golden', 'leaves'],
    style: '秋意水墨'
  },

  // ==================== 水之意象 (41-55) ====================
  {
    url: 'https://cdn.pixabay.com/photo/2016/10/13/10/37/water-1737229_960_720.jpg',
    tags: ['水', '平静', '心如止水', '宁静'],
    emotions: ['宁静', '平静', '安定', '清澈'],
    elements: ['water', 'calm', 'still'],
    style: '静水水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/11/18/15/54/waves-1835168_960_720.jpg',
    tags: ['海浪', '力量', '冲击', '释放'],
    emotions: ['释放', '力量', '冲击', '宣泄'],
    elements: ['wave', 'ocean', 'power'],
    style: '海浪水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/11/14/03/16/waterfall-1822519_960_720.jpg',
    tags: ['瀑布', '流动', '释放', '净化'],
    emotions: ['释放', '净化', '流动', '洗涤'],
    elements: ['waterfall', 'water', 'nature'],
    style: '瀑布水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2017/01/14/13/59/ocean-1979898_960_720.jpg',
    tags: ['海洋', '宽广', '包容', '无限'],
    emotions: ['包容', '宽广', '豁达', '自由'],
    elements: ['ocean', 'horizon', 'freedom'],
    style: '海洋水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2018/06/06/14/02/water-3456842_960_720.jpg',
    tags: ['水滴', '涟漪', '细微', '影响'],
    emotions: ['细腻', '温柔', '感动', '敏感'],
    elements: ['water', 'droplet', 'ripple'],
    style: '水滴水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/11/29/02/04/beach-1867286_960_720.jpg',
    tags: ['海边', '沙滩', '放松', '自由'],
    emotions: ['放松', '自由', '宁静', '释然'],
    elements: ['beach', 'sand', 'peace'],
    style: '海滩水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2017/08/07/01/39/nature-2598751_960_720.jpg',
    tags: ['溪流', '清澈', '纯净', '流动'],
    emotions: ['纯净', '清澈', '流动', '洗涤'],
    elements: ['stream', 'clear', 'flow'],
    style: '溪流水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2017/08/02/06/12/sea-2569622_960_720.jpg',
    tags: ['湖', '倒影', '自省', '平静'],
    emotions: ['自省', '平静', '沉思', '澄澈'],
    elements: ['lake', 'reflection', 'calm'],
    style: '湖泊水墨'
  },

  // ==================== 天空云霞 (56-70) ====================
  {
    url: 'https://cdn.pixabay.com/photo/2016/01/11/19/17/sunset-1134350_960_720.jpg',
    tags: ['日落', '温暖', '宁静', '美丽'],
    emotions: ['温暖', '宁静', '美丽', '释然'],
    elements: ['sunset', 'warm', 'peace'],
    style: '日落水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2015/03/26/09/47/sky-690293_960_720.jpg',
    tags: ['云', '自由', '漂浮', '轻盈'],
    emotions: ['自由', '轻盈', '无拘', '释然'],
    elements: ['cloud', 'sky', 'freedom'],
    style: '云朵水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2015/07/13/16/01/sky-843329_960_720.jpg',
    tags: ['蓝天', '宽广', '自由', '豁达'],
    emotions: ['自由', '豁达', '宽广', '舒畅'],
    elements: ['blue', 'sky', 'freedom'],
    style: '蓝天水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2018/01/06/14/05/snow-3066167_960_720.jpg',
    tags: ['雪', '纯净', '洁白', '宁静'],
    emotions: ['纯净', '洁白', '宁静', '超脱'],
    elements: ['snow', 'white', 'pure'],
    style: '雪景水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/04/20/19/47/water-1341645_960_720.jpg',
    tags: ['彩虹', '希望', '奇迹', '美好'],
    emotions: ['希望', '奇迹', '美好', '转机'],
    elements: ['rainbow', 'hope', 'miracle'],
    style: '彩虹水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/11/29/04/19/laptop-1867240_960_720.jpg',
    tags: ['星空', '梦想', '无限', '神秘'],
    emotions: ['梦想', '无限', '神秘', '向往'],
    elements: ['stars', 'night', 'dream'],
    style: '星空水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2017/02/08/13/26/nature-2048080_960_720.jpg',
    tags: ['月亮', '思念', '浪漫', '宁静'],
    emotions: ['思念', '浪漫', '宁静', '孤独'],
    elements: ['moon', 'night', 'romantic'],
    style: '月夜水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/01/08/05/03/sunrise-1127028_960_720.jpg',
    tags: ['日出', '希望', '新的开始', '光明'],
    emotions: ['希望', '开始', '光明', '期待'],
    elements: ['sunrise', 'hope', 'new'],
    style: '日出水墨'
  },

  // ==================== 禅意空间 (71-85) ====================
  {
    url: 'https://cdn.pixabay.com/photo/2017/01/14/12/00/candle-1979450_960_720.jpg',
    tags: ['蜡烛', '温暖', '光明', '希望'],
    emotions: ['温暖', '希望', '宁静', '光明'],
    elements: ['candle', 'light', 'warm'],
    style: '烛光水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/11/29/12/53/bridge-1869628_960_720.jpg',
    tags: ['桥', '过渡', '连接', '跨越'],
    emotions: ['跨越', '过渡', '连接', '突破'],
    elements: ['bridge', 'path', 'journey'],
    style: '小桥水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/11/23/14/49/building-1853115_960_720.jpg',
    tags: ['窗户', '内省', '安静', '思考'],
    emotions: ['安静', '思考', '内省', '宁静'],
    elements: ['window', 'quiet', 'reflection'],
    style: '窗户水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2018/02/04/09/50/meditation-3129784_960_720.jpg',
    tags: ['冥想', '静心', '禅意', '觉知'],
    emotions: ['静心', '觉知', '平和', '禅意'],
    elements: ['meditation', 'zen', 'peace'],
    style: '冥想水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/08/24/14/29/earth-1617121_960_720.jpg',
    tags: ['地球', '世界', '宽广', '视角'],
    emotions: ['宽广', '渺小', '豁达', '释然'],
    elements: ['earth', 'world', 'perspective'],
    style: '地球水墨'
  },

  // ==================== 动物生灵 (86-100) ====================
  {
    url: 'https://cdn.pixabay.com/photo/2017/07/31/20/43/bird-2561426_960_720.jpg',
    tags: ['鸟', '自由', '飞翔', '超越'],
    emotions: ['自由', '飞翔', '超越', '无拘'],
    elements: ['bird', 'fly', 'freedom'],
    style: '飞鸟水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/11/18/13/58/bird-1834820_960_720.jpg',
    tags: ['飞鸟', '自由', '远方', '梦想'],
    emotions: ['自由', '梦想', '远方', '希望'],
    elements: ['bird', 'freedom', 'journey'],
    style: '飞鸟水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2017/06/04/16/17/butterfly-2372330_960_720.jpg',
    tags: ['蝴蝶', '蜕变', '美丽', '重生'],
    emotions: ['蜕变', '美丽', '重生', '自由'],
    elements: ['butterfly', 'transform', 'beauty'],
    style: '蝴蝶水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2015/05/26/23/52/cat-785642_960_720.jpg',
    tags: ['猫', '安静', '独立', '自在'],
    emotions: ['安静', '独立', '自在', '神秘'],
    elements: ['cat', 'calm', 'independent'],
    style: '猫咪水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2017/11/06/18/39/deer-2924675_960_720.jpg',
    tags: ['鹿', '灵动', '优雅', '温柔'],
    emotions: ['灵动', '优雅', '温柔', '警觉'],
    elements: ['deer', 'grace', 'gentle'],
    style: '鹿之水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2016/11/18/18/14/fish-1836020_960_720.jpg',
    tags: ['鱼', '自由', '游弋', '流动'],
    emotions: ['自由', '流动', '无拘', '自在'],
    elements: ['fish', 'swim', 'freedom'],
    style: '游鱼水墨'
  },
  {
    url: 'https://cdn.pixabay.com/photo/2018/05/03/22/03/eagle-3373551_960_720.jpg',
    tags: ['鹰', '远见', '力量', '高远'],
    emotions: ['远见', '力量', '高远', '雄心'],
    elements: ['eagle', 'vision', 'power'],
    style: '雄鹰水墨'
  }
];

// ==================== 关键词匹配函数 ====================

// 情感关键词映射
const EMOTION_MAP: Record<string, string[]> = {
  // 负面情感（需要疗愈）
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
  '嫉妒': ['平和', '知足', '感恩', '欣赏'],
  '自卑': ['自信', '绽放', '美丽', '价值'],
  '疲惫': ['休息', '疗愈', '恢复', '放松'],
  '烦躁': ['平静', '宁静', '冷静', '安抚'],
  '伤心': ['治愈', '温暖', '安慰', '陪伴'],
  '难过': ['治愈', '温暖', '希望', '释然'],
  '痛苦': ['治愈', '释放', '放下', '解脱'],
  '担心': ['安心', '平静', '信任', '放下'],
  
  // 正面情感
  '希望': ['希望', '光明', '期待', '新生'],
  '爱': ['爱情', '温暖', '浪漫', '深情'],
  '感恩': ['感恩', '满足', '幸福', '珍惜'],
  '梦想': ['梦想', '追求', '翱翔', '无限'],
  '勇气': ['勇气', '力量', '坚定', '突破'],
  '自由': ['自由', '无拘', '飞翔', '宽广'],
};

// 主题关键词映射
const THEME_MAP: Record<string, string[]> = {
  '工作': ['山', '向上', '攀登', '成长', '坚定'],
  '事业': ['山', '远山', '日出', '阳光', '希望'],
  '爱情': ['花', '温暖', '浪漫', '美丽'],
  '感情': ['花', '温暖', '治愈', '放下'],
  '家庭': ['温暖', '和谐', '宁静', '安宁'],
  '健康': ['生命', '活力', '自然', '成长'],
  '金钱': ['收获', '金黄', '成熟'],
  '学习': ['智慧', '成长', '新生'],
  '人际关系': ['和谐', '包容', '理解', '宽广'],
  '人生': ['路', '小径', '方向', '远方'],
  '未来': ['日出', '光明', '希望', '梦想'],
  '过去': ['放下', '释然', '回忆', '告别'],
  '自己': ['自省', '倒影', '真实', '接纳'],
  '他人': ['理解', '包容', '和谐', '宽广'],
};

// 计算图片与关键词的匹配分数
function calculateMatchScore(image: CuratedImage, keywords: string[]): number {
  let score = 0;
  
  for (const keyword of keywords) {
    // 检查标签匹配
    if (image.tags.some(tag => keyword.includes(tag) || tag.includes(keyword))) {
      score += 3;
    }
    
    // 检查情感匹配
    if (image.emotions.some(emotion => keyword.includes(emotion) || emotion.includes(keyword))) {
      score += 2;
    }
    
    // 检查元素匹配（英文）
    if (image.elements.some(el => keyword.toLowerCase().includes(el))) {
      score += 1;
    }
  }
  
  return score;
}

// 根据用户输入获取最匹配的图片
export function getMatchedImage(obsession: string): { url: string; tags: string[]; emotions: string[]; score: number } {
  // 提取关键词
  const keywords: string[] = [];
  
  console.log('[匹配] 开始分析用户输入:', obsession);
  
  // 从情感映射中获取相关情感
  for (const [emotion, related] of Object.entries(EMOTION_MAP)) {
    if (obsession.includes(emotion)) {
      keywords.push(emotion, ...related);
      console.log(`[匹配] 发现情感关键词: ${emotion} → ${related.join(', ')}`);
    }
  }
  
  // 从主题映射中获取相关主题
  for (const [theme, related] of Object.entries(THEME_MAP)) {
    if (obsession.includes(theme)) {
      keywords.push(theme, ...related);
      console.log(`[匹配] 发现主题关键词: ${theme} → ${related.join(', ')}`);
    }
  }
  
  // 直接从输入中提取关键词
  const directKeywords = obsession.split(/[，。、！？\s,.\!?]+/).filter(k => k.length > 0);
  keywords.push(...directKeywords);
  
  console.log('[匹配] 提取的关键词:', [...new Set(keywords)]);
  
  // 计算所有图片的匹配分数
  const scoredImages = IMAGE_LIBRARY.map(img => ({
    image: img,
    score: calculateMatchScore(img, keywords)
  }));
  
  // 按分数排序
  scoredImages.sort((a, b) => b.score - a.score);
  
  console.log('[匹配] 最高分:', scoredImages[0].score, '图片:', scoredImages[0].image.tags);
  
  // 从高分图片中随机选择（增加多样性）
  const topScore = scoredImages[0].score;
  const topImages = scoredImages.filter(s => s.score >= topScore - 1);
  const selected = topImages[Math.floor(Math.random() * topImages.length)];
  
  console.log('[匹配] 最终选择:', selected.image.tags, '分数:', selected.score);
  
  return {
    url: selected.image.url,
    tags: selected.image.tags,
    emotions: selected.image.emotions,
    score: selected.score
  };
}

// 获取随机图片（兜底）
export function getRandomImage(): string {
  const randomIndex = Math.floor(Math.random() * IMAGE_LIBRARY.length);
  return IMAGE_LIBRARY[randomIndex].url;
}

// 导出完整图片库（调试用）
export function getImageLibrary(): CuratedImage[] {
  return IMAGE_LIBRARY;
}

// ==================== API 端点 ====================
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
