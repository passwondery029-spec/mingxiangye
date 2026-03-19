import type { VercelRequest, VercelResponse } from '@vercel/node';

// ==================== 100张水墨/绘画风格图片库 ====================
// 来源：Pixabay 插画分类，筛选 watercolor/painting/illustration

interface ImageItem {
  url: string;
  tags: string[];
  emotions: string[];
}

const IMAGES: ImageItem[] = [
  // ==================== 山水水墨画 (1-20) ====================
  { url: 'https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg', tags: ['山', '星空', '夜晚', '梦想'], emotions: ['宁静', '梦想', '神秘'] },
  { url: 'https://cdn.pixabay.com/photo/2016/03/09/09/17/composition-1245555_960_720.jpg', tags: ['山', '水墨', '意境', '禅意'], emotions: ['禅意', '意境', '宁静'] },
  { url: 'https://cdn.pixabay.com/photo/2016/10/20/18/35/earth-1756274_960_720.jpg', tags: ['山', '云海', '日出', '希望'], emotions: ['希望', '壮阔', '新生'] },
  { url: 'https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_960_720.jpg', tags: ['山', '雾', '森林', '神秘'], emotions: ['神秘', '宁静', '深远'] },
  { url: 'https://cdn.pixabay.com/photo/2017/02/01/12/05/mountains-2029239_960_720.jpg', tags: ['雪山', '纯净', '高远'], emotions: ['纯净', '超脱', '宁静'] },
  { url: 'https://cdn.pixabay.com/photo/2015/06/19/21/24/fog-815320_960_720.jpg', tags: ['雾', '山', '神秘', '朦胧'], emotions: ['神秘', '朦胧', '未知'] },
  { url: 'https://cdn.pixabay.com/photo/2017/03/27/14/02/mountain-2178785_960_720.jpg', tags: ['山峰', '攀登', '向上', '力量'], emotions: ['力量', '坚定', '向上'] },
  { url: 'https://cdn.pixabay.com/photo/2016/09/19/17/34/landscape-1670414_960_720.jpg', tags: ['草原', '宽广', '自由', '舒展'], emotions: ['自由', '宽广', '舒展'] },
  { url: 'https://cdn.pixabay.com/photo/2014/09/10/00/59/mountains-439909_960_720.jpg', tags: ['远山', '云', '远方', '梦想'], emotions: ['梦想', '远方', '希望'] },
  { url: 'https://cdn.pixabay.com/photo/2016/07/30/00/03/mount-rainier-1557098_960_720.jpg', tags: ['雪山', '纯净', '高远', '超脱'], emotions: ['纯净', '超脱', '升华'] },
  { url: 'https://cdn.pixabay.com/photo/2018/04/16/16/16/sunset-3325020_960_720.jpg', tags: ['日落', '山', '宁静', '温暖'], emotions: ['宁静', '温暖', '安详'] },
  { url: 'https://cdn.pixabay.com/photo/2015/07/05/10/18/tree-832079_960_720.jpg', tags: ['树', '夕阳', '孤独', '思考'], emotions: ['孤独', '思考', '宁静'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_960_720.jpg', tags: ['星空', '山', '宇宙', '无限'], emotions: ['无限', '梦想', '宁静'] },
  { url: 'https://cdn.pixabay.com/photo/2016/10/13/10/37/water-1737229_960_720.jpg', tags: ['山', '湖', '倒影', '平静'], emotions: ['平静', '自省', '澄澈'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/23/13/48/flower-1852807_960_720.jpg', tags: ['山谷', '阳光', '温暖'], emotions: ['温暖', '平静', '安详'] },
  { url: 'https://cdn.pixabay.com/photo/2015/09/09/16/05/forest-931706_960_720.jpg', tags: ['森林', '光', '希望', '指引'], emotions: ['希望', '指引', '温暖'] },
  { url: 'https://cdn.pixabay.com/photo/2017/08/06/12/52/nature-2591897_960_720.jpg', tags: ['森林', '阳光', '温暖', '治愈'], emotions: ['治愈', '温暖', '希望'] },
  { url: 'https://cdn.pixabay.com/photo/2013/07/18/10/56/rain-163612_960_720.jpg', tags: ['雨', '窗户', '思考', '内省'], emotions: ['内省', '思考', '平静'] },
  { url: 'https://cdn.pixabay.com/photo/2016/01/19/17/41/friends-1149910_960_720.jpg', tags: ['山', '旅途', '陪伴', '友情'], emotions: ['陪伴', '温暖', '友情'] },
  { url: 'https://cdn.pixabay.com/photo/2017/01/14/12/59/iceland-1979455_960_720.jpg', tags: ['极光', '奇迹', '神秘', '美丽'], emotions: ['奇迹', '神秘', '震撼'] },

  // ==================== 花卉植物 (21-40) ====================
  { url: 'https://cdn.pixabay.com/photo/2017/08/02/00/49/lotus-2569142_960_720.jpg', tags: ['莲花', '纯净', '禅意', '觉悟'], emotions: ['纯净', '觉悟', '圣洁'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/29/04/16/blossom-1867602_960_720.jpg', tags: ['樱花', '春天', '美丽', '短暂'], emotions: ['美丽', '珍惜', '温柔'] },
  { url: 'https://cdn.pixabay.com/photo/2017/06/26/12/12/nature-2443947_960_720.jpg', tags: ['花', '绽放', '美丽', '希望'], emotions: ['绽放', '美丽', '希望'] },
  { url: 'https://cdn.pixabay.com/photo/2016/01/08/11/54/bamboo-1127557_960_720.jpg', tags: ['竹子', '坚韧', '正直'], emotions: ['坚韧', '正直', '向上'] },
  { url: 'https://cdn.pixabay.com/photo/2017/07/25/14/41/leaf-2538716_960_720.jpg', tags: ['叶子', '秋天', '放下', '轮回'], emotions: ['放下', '轮回', '释然'] },
  { url: 'https://cdn.pixabay.com/photo/2018/05/28/21/52/tree-3436050_960_720.jpg', tags: ['树', '成长', '生命', '扎根'], emotions: ['成长', '生命', '坚强'] },
  { url: 'https://cdn.pixabay.com/photo/2018/02/19/21/54/branch-3165322_960_720.jpg', tags: ['树枝', '极简', '禅意', '留白'], emotions: ['禅意', '极简', '宁静'] },
  { url: 'https://cdn.pixabay.com/photo/2017/05/08/13/15/spring-2296052_960_720.jpg', tags: ['春天', '新生', '希望', '绿色'], emotions: ['新生', '希望', '活力'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/22/19/25/autumn-1850223_960_720.jpg', tags: ['秋天', '金黄', '收获', '成熟'], emotions: ['收获', '成熟', '满足'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/18/08/21/flower-1833973_960_720.jpg', tags: ['花', '温柔', '治愈', '美丽'], emotions: ['温柔', '治愈', '美丽'] },
  { url: 'https://cdn.pixabay.com/photo/2017/05/11/11/15/thistle-2303225_960_720.jpg', tags: ['植物', '坚韧', '生命力'], emotions: ['坚韧', '生命力', '顽强'] },
  { url: 'https://cdn.pixabay.com/photo/2017/06/25/14/17/flower-2440269_960_720.jpg', tags: ['花', '浪漫', '温柔', '爱'], emotions: ['浪漫', '温柔', '爱'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/08/05/06/blossom-1807502_960_720.jpg', tags: ['花', '绽放', '美丽', '希望'], emotions: ['绽放', '美丽', '希望'] },
  { url: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510_960_720.jpg', tags: ['雏菊', '纯洁', '简单', '美好'], emotions: ['纯洁', '简单', '美好'] },
  { url: 'https://cdn.pixabay.com/photo/2017/04/05/13/37/cherry-blossom-2205682_960_720.jpg', tags: ['樱花', '春天', '浪漫', '美丽'], emotions: ['浪漫', '美丽', '温柔'] },
  { url: 'https://cdn.pixabay.com/photo/2017/02/15/13/40/tulip-2069758_960_720.jpg', tags: ['郁金香', '优雅', '美丽', '绽放'], emotions: ['优雅', '美丽', '绽放'] },
  { url: 'https://cdn.pixabay.com/photo/2016/07/11/15/43/plant-1509927_960_720.jpg', tags: ['嫩芽', '新生', '希望', '开始'], emotions: ['新生', '希望', '开始'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/14/04/45/leaf-1822520_960_720.jpg', tags: ['叶子', '自然', '简单', '纯净'], emotions: ['简单', '纯净', '自然'] },
  { url: 'https://cdn.pixabay.com/photo/2017/09/12/12/40/branch-2741845_960_720.jpg', tags: ['树枝', '秋天', '放下', '告别'], emotions: ['放下', '告别', '释然'] },
  { url: 'https://cdn.pixabay.com/photo/2016/08/15/14/41/nature-1595906_960_720.jpg', tags: ['森林', '宁静', '治愈', '自然'], emotions: ['宁静', '治愈', '自然'] },

  // ==================== 水之意象 (41-60) ====================
  { url: 'https://cdn.pixabay.com/photo/2016/11/18/15/54/waves-1835168_960_720.jpg', tags: ['海浪', '力量', '冲击', '释放'], emotions: ['释放', '力量', '冲击'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/14/03/16/waterfall-1822519_960_720.jpg', tags: ['瀑布', '流动', '释放', '净化'], emotions: ['释放', '净化', '流动'] },
  { url: 'https://cdn.pixabay.com/photo/2017/01/14/13/59/ocean-1979898_960_720.jpg', tags: ['海洋', '宽广', '包容', '无限'], emotions: ['包容', '宽广', '豁达'] },
  { url: 'https://cdn.pixabay.com/photo/2018/06/06/14/02/water-3456842_960_720.jpg', tags: ['水滴', '涟漪', '细微'], emotions: ['细腻', '温柔', '感动'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/29/02/04/beach-1867286_960_720.jpg', tags: ['海边', '沙滩', '放松', '自由'], emotions: ['放松', '自由', '宁静'] },
  { url: 'https://cdn.pixabay.com/photo/2017/08/07/01/39/nature-2598751_960_720.jpg', tags: ['溪流', '清澈', '纯净', '流动'], emotions: ['纯净', '清澈', '流动'] },
  { url: 'https://cdn.pixabay.com/photo/2017/08/02/06/12/sea-2569622_960_720.jpg', tags: ['湖', '倒影', '自省', '平静'], emotions: ['自省', '平静', '沉思'] },
  { url: 'https://cdn.pixabay.com/photo/2014/08/15/11/29/beach-418742_960_720.jpg', tags: ['海边', '日落', '宁静', '浪漫'], emotions: ['宁静', '浪漫', '温暖'] },
  { url: 'https://cdn.pixabay.com/photo/2015/10/30/20/13/sunset-1014712_960_720.jpg', tags: ['海', '日落', '温暖', '安详'], emotions: ['温暖', '安详', '宁静'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/16/16/33/wave-1829587_960_720.jpg', tags: ['浪', '力量', '冲击', '突破'], emotions: ['力量', '突破', '冲击'] },
  { url: 'https://cdn.pixabay.com/photo/2016/10/21/14/47/wave-1758966_960_720.jpg', tags: ['海浪', '自由', '力量', '释放'], emotions: ['自由', '释放', '力量'] },
  { url: 'https://cdn.pixabay.com/photo/2017/01/20/00/28/wave-1991155_960_720.jpg', tags: ['浪', '冲击', '力量', '突破'], emotions: ['突破', '力量', '冲击'] },
  { url: 'https://cdn.pixabay.com/photo/2016/10/18/21/07/water-1751459_960_720.jpg', tags: ['水', '平静', '清澈', '纯净'], emotions: ['平静', '清澈', '纯净'] },
  { url: 'https://cdn.pixabay.com/photo/2017/08/14/16/19/nature-2640739_960_720.jpg', tags: ['溪流', '森林', '治愈', '自然'], emotions: ['治愈', '自然', '宁静'] },
  { url: 'https://cdn.pixabay.com/photo/2015/06/08/15/02/water-801898_960_720.jpg', tags: ['水', '涟漪', '平静', '治愈'], emotions: ['治愈', '平静', '安宁'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/23/14/55/rain-1853228_960_720.jpg', tags: ['雨', '洗涤', '净化', '释然'], emotions: ['净化', '释然', '洗涤'] },
  { url: 'https://cdn.pixabay.com/photo/2015/11/04/20/44/water-1023527_960_720.jpg', tags: ['水滴', '清新', '纯净', '希望'], emotions: ['清新', '纯净', '希望'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/29/06/07/autumn-1868718_960_720.jpg', tags: ['湖', '秋天', '宁静', '美丽'], emotions: ['宁静', '美丽', '安详'] },
  { url: 'https://cdn.pixabay.com/photo/2017/07/03/20/54/nature-2468374_960_720.jpg', tags: ['河', '流动', '放下', '顺其自然'], emotions: ['放下', '顺其自然', '流动'] },
  { url: 'https://cdn.pixabay.com/photo/2017/09/18/16/21/nature-2762297_960_720.jpg', tags: ['海洋', '宽广', '自由', '无限'], emotions: ['自由', '无限', '宽广'] },

  // ==================== 天空云霞 (61-80) ====================
  { url: 'https://cdn.pixabay.com/photo/2016/01/11/19/17/sunset-1134350_960_720.jpg', tags: ['日落', '温暖', '宁静', '美丽'], emotions: ['温暖', '宁静', '美丽'] },
  { url: 'https://cdn.pixabay.com/photo/2015/03/26/09/47/sky-690293_960_720.jpg', tags: ['云', '自由', '漂浮', '轻盈'], emotions: ['自由', '轻盈', '无拘'] },
  { url: 'https://cdn.pixabay.com/photo/2015/07/13/16/01/sky-843329_960_720.jpg', tags: ['蓝天', '宽广', '自由', '豁达'], emotions: ['自由', '豁达', '宽广'] },
  { url: 'https://cdn.pixabay.com/photo/2018/01/06/14/05/snow-3066167_960_720.jpg', tags: ['雪', '纯净', '洁白', '宁静'], emotions: ['纯净', '洁白', '宁静'] },
  { url: 'https://cdn.pixabay.com/photo/2016/04/20/19/47/water-1341645_960_720.jpg', tags: ['彩虹', '希望', '奇迹', '美好'], emotions: ['希望', '奇迹', '美好'] },
  { url: 'https://cdn.pixabay.com/photo/2017/02/08/13/26/nature-2048080_960_720.jpg', tags: ['月亮', '思念', '浪漫', '宁静'], emotions: ['思念', '浪漫', '宁静'] },
  { url: 'https://cdn.pixabay.com/photo/2016/01/08/05/03/sunrise-1127028_960_720.jpg', tags: ['日出', '希望', '新的开始', '光明'], emotions: ['希望', '开始', '光明'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/29/04/19/laptop-1867240_960_720.jpg', tags: ['星空', '梦想', '无限', '神秘'], emotions: ['梦想', '无限', '神秘'] },
  { url: 'https://cdn.pixabay.com/photo/2015/09/14/19/43/after-the-rain-940058_960_720.jpg', tags: ['雨后', '彩虹', '希望', '转机'], emotions: ['希望', '转机', '美好'] },
  { url: 'https://cdn.pixabay.com/photo/2016/07/30/17/03/sunset-1557467_960_720.jpg', tags: ['日落', '温暖', '安详', '美丽'], emotions: ['温暖', '安详', '美丽'] },
  { url: 'https://cdn.pixabay.com/photo/2017/07/05/15/03/sunset-2473203_960_720.jpg', tags: ['晚霞', '绚烂', '美丽', '感动'], emotions: ['绚烂', '美丽', '感动'] },
  { url: 'https://cdn.pixabay.com/photo/2016/09/07/11/37/sunset-1651426_960_720.jpg', tags: ['日落', '温暖', '希望', '安详'], emotions: ['温暖', '希望', '安详'] },
  { url: 'https://cdn.pixabay.com/photo/2014/09/27/21/34/sunset-463376_960_720.jpg', tags: ['日落', '海', '宁静', '浪漫'], emotions: ['宁静', '浪漫', '温暖'] },
  { url: 'https://cdn.pixabay.com/photo/2016/08/17/01/39/clouds-1599073_960_720.jpg', tags: ['云', '自由', '漂浮', '无拘'], emotions: ['自由', '无拘', '漂浮'] },
  { url: 'https://cdn.pixabay.com/photo/2017/05/27/10/37/nature-2249691_960_720.jpg', tags: ['云', '蓝天', '自由', '宽广'], emotions: ['自由', '宽广', '舒展'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/06/05/36/lake-1802337_960_720.jpg', tags: ['湖', '倒影', '平静', '自省'], emotions: ['平静', '自省', '沉思'] },
  { url: 'https://cdn.pixabay.com/photo/2016/05/05/02/04/sky-1373167_960_720.jpg', tags: ['云', '阳光', '希望', '温暖'], emotions: ['希望', '温暖', '光明'] },
  { url: 'https://cdn.pixabay.com/photo/2015/11/07/11/06/sky-1031067_960_720.jpg', tags: ['云', '自由', '漂浮', '轻盈'], emotions: ['自由', '轻盈', '无拘'] },
  { url: 'https://cdn.pixabay.com/photo/2017/03/05/00/34/clouds-2117518_960_720.jpg', tags: ['云', '阳光', '希望', '光明'], emotions: ['希望', '光明', '温暖'] },
  { url: 'https://cdn.pixabay.com/photo/2016/05/02/21/29/clouds-1367676_960_720.jpg', tags: ['云', '日落', '温暖', '美丽'], emotions: ['温暖', '美丽', '安详'] },

  // ==================== 禅意空间 (81-90) ====================
  { url: 'https://cdn.pixabay.com/photo/2017/01/14/12/00/candle-1979450_960_720.jpg', tags: ['蜡烛', '温暖', '光明', '希望'], emotions: ['温暖', '希望', '宁静'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/29/12/53/bridge-1869628_960_720.jpg', tags: ['桥', '过渡', '连接', '跨越'], emotions: ['跨越', '过渡', '连接'] },
  { url: 'https://cdn.pixabay.com/photo/2018/02/04/09/50/meditation-3129784_960_720.jpg', tags: ['冥想', '静心', '禅意', '觉知'], emotions: ['静心', '觉知', '平和'] },
  { url: 'https://cdn.pixabay.com/photo/2015/07/02/20/57/candle-829893_960_720.jpg', tags: ['蜡烛', '温暖', '宁静', '光明'], emotions: ['温暖', '宁静', '光明'] },
  { url: 'https://cdn.pixabay.com/photo/2016/05/24/16/48/candles-1412623_960_720.jpg', tags: ['蜡烛', '温暖', '希望', '安宁'], emotions: ['温暖', '希望', '安宁'] },
  { url: 'https://cdn.pixabay.com/photo/2017/02/23/12/42/yoga-2092169_960_720.jpg', tags: ['瑜伽', '冥想', '静心', '放松'], emotions: ['静心', '放松', '平和'] },
  { url: 'https://cdn.pixabay.com/photo/2017/08/02/11/53/meditation-2569502_960_720.jpg', tags: ['冥想', '禅意', '静心', '觉知'], emotions: ['静心', '禅意', '觉知'] },
  { url: 'https://cdn.pixabay.com/photo/2017/05/07/19/59/meditation-2291818_960_720.jpg', tags: ['冥想', '宁静', '禅意', '平和'], emotions: ['宁静', '禅意', '平和'] },
  { url: 'https://cdn.pixabay.com/photo/2015/07/28/21/58/person-864937_960_720.jpg', tags: ['冥想', '静心', '禅意', '内省'], emotions: ['静心', '内省', '禅意'] },
  { url: 'https://cdn.pixabay.com/photo/2016/08/01/21/07/light-1561882_960_720.jpg', tags: ['光', '希望', '温暖', '指引'], emotions: ['希望', '温暖', '指引'] },

  // ==================== 动物生灵 (91-100) ====================
  { url: 'https://cdn.pixabay.com/photo/2017/07/31/20/43/bird-2561426_960_720.jpg', tags: ['鸟', '自由', '飞翔', '超越'], emotions: ['自由', '飞翔', '超越'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/18/13/58/bird-1834820_960_720.jpg', tags: ['飞鸟', '自由', '远方', '梦想'], emotions: ['自由', '梦想', '远方'] },
  { url: 'https://cdn.pixabay.com/photo/2017/06/04/16/17/butterfly-2372330_960_720.jpg', tags: ['蝴蝶', '蜕变', '美丽', '重生'], emotions: ['蜕变', '美丽', '重生'] },
  { url: 'https://cdn.pixabay.com/photo/2015/05/26/23/52/cat-785642_960_720.jpg', tags: ['猫', '安静', '独立', '自在'], emotions: ['安静', '独立', '自在'] },
  { url: 'https://cdn.pixabay.com/photo/2017/11/06/18/39/deer-2924675_960_720.jpg', tags: ['鹿', '灵动', '优雅', '温柔'], emotions: ['灵动', '优雅', '温柔'] },
  { url: 'https://cdn.pixabay.com/photo/2016/11/18/18/14/fish-1836020_960_720.jpg', tags: ['鱼', '自由', '游弋', '流动'], emotions: ['自由', '流动', '无拘'] },
  { url: 'https://cdn.pixabay.com/photo/2018/05/03/22/03/eagle-3373551_960_720.jpg', tags: ['鹰', '远见', '力量', '高远'], emotions: ['远见', '力量', '高远'] },
  { url: 'https://cdn.pixabay.com/photo/2016/10/19/18/56/bird-1754393_960_720.jpg', tags: ['鸟', '自由', '飞翔', '无拘'], emotions: ['自由', '无拘', '飞翔'] },
  { url: 'https://cdn.pixabay.com/photo/2017/05/31/17/47/butterfly-2360547_960_720.jpg', tags: ['蝴蝶', '美丽', '自由', '蜕变'], emotions: ['美丽', '自由', '蜕变'] },
  { url: 'https://cdn.pixabay.com/photo/2014/05/07/22/18/butterfly-339357_960_720.jpg', tags: ['蝴蝶', '美丽', '轻盈', '自由'], emotions: ['美丽', '轻盈', '自由'] },
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
