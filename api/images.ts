import type { VercelRequest, VercelResponse } from '@vercel/node';

// ==================== 精美绘画图片库 ====================
// 每张图片包含：URL、标签、情感关键词
// 标签用于匹配用户输入的执念/情感

interface CuratedImage {
  url: string;
  tags: string[];      // 主题标签
  emotions: string[];  // 情感标签
  elements: string[];  // 元素标签
  style: string;       // 风格
}

const IMAGE_LIBRARY: CuratedImage[] = [
  // ==================== 山水意境 (1-15) ====================
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    tags: ['山', '远山', '高山', '山峰', '攀登'],
    emotions: ['坚定', '向上', '力量', '壮志', '豪迈'],
    elements: ['mountain', 'peak', 'cloud'],
    style: '写实风景'
  },
  {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    tags: ['山', '云雾', '神秘', '远方'],
    emotions: ['迷茫', '探索', '未知', '憧憬'],
    elements: ['mountain', 'mist', 'fog'],
    style: '水墨意境'
  },
  {
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    tags: ['雪山', '星空', '夜晚', '梦想', '纯净'],
    emotions: ['宁静', '纯洁', '梦想', '孤独', '超脱'],
    elements: ['snow', 'mountain', 'stars', 'night'],
    style: '梦幻写意'
  },
  {
    url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
    tags: ['山峰', '日出', '希望', '新的开始'],
    emotions: ['希望', '新生', '勇气', '突破'],
    elements: ['sunrise', 'mountain', 'dawn'],
    style: '光影绘画'
  },
  {
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    tags: ['山谷', '阳光', '温暖', '平静'],
    emotions: ['温暖', '平静', '安详', '治愈'],
    elements: ['valley', 'sunlight', 'meadow'],
    style: '印象派'
  },
  {
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    tags: ['森林', '光线', '自然', '生机'],
    emotions: ['生机', '活力', '希望', '成长'],
    elements: ['forest', 'light', 'nature'],
    style: '自然写实'
  },
  {
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    tags: ['草地', '山丘', '自由', '宽广'],
    emotions: ['自由', '放松', '释然', '宽广'],
    elements: ['meadow', 'hills', 'sky'],
    style: '田园风光'
  },
  {
    url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80',
    tags: ['瀑布', '流水', '释放', '冲刷'],
    emotions: ['释放', '宣泄', '净化', '流动'],
    elements: ['waterfall', 'water', 'nature'],
    style: '动态风景'
  },
  {
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    tags: ['湖泊', '倒影', '自省', '平静'],
    emotions: ['自省', '平静', '沉思', '澄澈'],
    elements: ['lake', 'reflection', 'mirror'],
    style: '镜像意境'
  },
  {
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80',
    tags: ['森林', '小径', '探索', '人生路'],
    emotions: ['探索', '前行', '坚定', '选择'],
    elements: ['forest', 'path', 'journey'],
    style: '诗意小径'
  },
  {
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80',
    tags: ['秋天', '金黄', '收获', '成熟'],
    emotions: ['收获', '满足', '成熟', '感恩'],
    elements: ['autumn', 'leaves', 'golden'],
    style: '秋意浓'
  },
  {
    url: 'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=800&q=80',
    tags: ['树林', '晨光', '新的开始', '觉醒'],
    emotions: ['觉醒', '开始', '清新', '希望'],
    elements: ['trees', 'morning', 'light'],
    style: '晨光意境'
  },
  {
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80',
    tags: ['森林', '绿色', '生命', '成长'],
    emotions: ['成长', '活力', '生命', '希望'],
    elements: ['forest', 'green', 'life'],
    style: '生机盎然'
  },
  {
    url: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=800&q=80',
    tags: ['秋林', '迷雾', '神秘', '过渡'],
    emotions: ['过渡', '变化', '神秘', '接纳'],
    elements: ['forest', 'autumn', 'mist'],
    style: '迷雾森林'
  },
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    tags: ['林间', '阳光', '温暖', '指引'],
    emotions: ['温暖', '指引', '希望', '光明'],
    elements: ['sunlight', 'forest', 'rays'],
    style: '光之诗'
  },

  // ==================== 水之意象 (16-30) ====================
  {
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80',
    tags: ['湖面', '平静', '心如止水', '宁静'],
    emotions: ['宁静', '平和', '安定', '释然'],
    elements: ['lake', 'calm', 'still'],
    style: '静水意境'
  },
  {
    url: 'https://images.unsplash.com/photo-1494472155656-f34e81b17ddc?w=800&q=80',
    tags: ['河流', '流动', '放下', '顺其自然'],
    emotions: ['放下', '顺从', '流动', '释怀'],
    elements: ['river', 'flow', 'water'],
    style: '流水意境'
  },
  {
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
    tags: ['大海', '宽广', '包容', '无限'],
    emotions: ['包容', '宽广', '豁达', '释放'],
    elements: ['ocean', 'waves', 'horizon'],
    style: '海之韵'
  },
  {
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
    tags: ['水滴', '涟漪', '影响', '细微'],
    emotions: ['细腻', '感动', '温柔', '敏感'],
    elements: ['water', 'droplet', 'ripple'],
    style: '微观意境'
  },
  {
    url: 'https://images.unsplash.com/photo-1518882605630-8eb7c5f5a1ed?w=800&q=80',
    tags: ['水波', '律动', '节奏', '呼吸'],
    emotions: ['平静', '呼吸', '律动', '放松'],
    elements: ['water', 'wave', 'rhythm'],
    style: '水之律动'
  },
  {
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    tags: ['海浪', '力量', '冲击', '突破'],
    emotions: ['力量', '勇气', '突破', '冲击'],
    elements: ['wave', 'ocean', 'power'],
    style: '澎湃之力'
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    tags: ['海边', '沙滩', '放松', '度假'],
    emotions: ['放松', '度假', '自由', '快乐'],
    elements: ['beach', 'sand', 'vacation'],
    style: '海岸风情'
  },
  {
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    tags: ['倒影', '镜像', '自我', '审视'],
    emotions: ['自省', '审视', '真实', '面对'],
    elements: ['reflection', 'mirror', 'self'],
    style: '镜像之美'
  },
  {
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    tags: ['晨露', '清新', '开始', '纯净'],
    emotions: ['清新', '纯净', '开始', '希望'],
    elements: ['dew', 'morning', 'fresh'],
    style: '晨露诗意'
  },
  {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    tags: ['雨后', '彩虹', '希望', '转机'],
    emotions: ['希望', '转机', '美好', '奇迹'],
    elements: ['rain', 'rainbow', 'after'],
    style: '雨后彩虹'
  },
  {
    url: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=800&q=80',
    tags: ['溪流', '清澈', '纯净', '净化'],
    emotions: ['净化', '清澈', '纯真', '洗涤'],
    elements: ['stream', 'clear', 'pure'],
    style: '清溪流韵'
  },
  {
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80',
    tags: ['水面', '落叶', '漂浮', '放下'],
    emotions: ['放下', '漂浮', '随缘', '自然'],
    elements: ['water', 'leaves', 'float'],
    style: '落叶浮水'
  },
  {
    url: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=800&q=80',
    tags: ['温泉', '疗愈', '温暖', '舒适'],
    emotions: ['疗愈', '温暖', '舒适', '放松'],
    elements: ['hot', 'spring', 'steam'],
    style: '温泉意境'
  },
  {
    url: 'https://images.unsplash.com/photo-1520579231422-497adb46b5d3?w=800&q=80',
    tags: ['雨', '洗涤', '净化', '新生'],
    emotions: ['净化', '洗涤', '新生', '释然'],
    elements: ['rain', 'wash', 'cleanse'],
    style: '雨之诗'
  },
  {
    url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80',
    tags: ['云海', '超脱', '升华', '境界'],
    emotions: ['超脱', '升华', '境界', '自在'],
    elements: ['clouds', 'sky', 'dream'],
    style: '云海仙境'
  },

  // ==================== 花草植物 (31-50) ====================
  {
    url: 'https://images.unsplash.com/photo-1564064235862-0b9b86828f6e?w=800&q=80',
    tags: ['莲花', '纯净', '出淤泥', '觉悟'],
    emotions: ['纯净', '觉悟', '超脱', '圣洁'],
    elements: ['lotus', 'flower', 'pure'],
    style: '莲之禅意'
  },
  {
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    tags: ['花朵', '绽放', '盛开', '美丽'],
    emotions: ['绽放', '美丽', '自信', '喜悦'],
    elements: ['flower', 'bloom', 'beauty'],
    style: '花开之美'
  },
  {
    url: 'https://images.unsplash.com/photo-1518882605630-8eb7c5f5a1ed?w=800&q=80',
    tags: ['樱花', '短暂', '珍惜', '美丽'],
    emotions: ['珍惜', '美丽', '短暂', '感动'],
    elements: ['cherry', 'blossom', 'pink'],
    style: '樱花烂漫'
  },
  {
    url: 'https://images.unsplash.com/photo-1509225770129-fbcf8a696c0b?w=800&q=80',
    tags: ['向日葵', '阳光', '积极', '向阳'],
    emotions: ['积极', '阳光', '希望', '向上'],
    elements: ['sunflower', 'sun', 'bright'],
    style: '向阳而生'
  },
  {
    url: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80',
    tags: ['玫瑰', '爱情', '热情', '浪漫'],
    emotions: ['爱情', '热情', '浪漫', '温暖'],
    elements: ['rose', 'love', 'red'],
    style: '玫瑰情愫'
  },
  {
    url: 'https://images.unsplash.com/photo-1462275646964-a0e3571f4f8f?w=800&q=80',
    tags: ['牡丹', '富贵', '华丽', '绽放'],
    emotions: ['富贵', '华丽', '自信', '骄傲'],
    elements: ['peony', 'flower', 'elegant'],
    style: '牡丹华贵'
  },
  {
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    tags: ['兰花', '高雅', '淡泊', '君子'],
    emotions: ['高雅', '淡泊', '君子', '清高'],
    elements: ['orchid', 'elegant', 'refined'],
    style: '兰之幽雅'
  },
  {
    url: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800&q=80',
    tags: ['竹子', '坚韧', '正直', '节节高'],
    emotions: ['坚韧', '正直', '向上', '气节'],
    elements: ['bamboo', 'green', 'strong'],
    style: '竹之节气'
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    tags: ['松树', '长寿', '坚强', '永恒'],
    emotions: ['坚强', '永恒', '长寿', '稳重'],
    elements: ['pine', 'tree', 'evergreen'],
    style: '松之坚贞'
  },
  {
    url: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=800&q=80',
    tags: ['梅花', '坚韧', '傲雪', '坚强'],
    emotions: ['坚韧', '坚强', '傲骨', '不屈'],
    elements: ['plum', 'blossom', 'winter'],
    style: '梅之傲骨'
  },
  {
    url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80',
    tags: ['荷叶', '碧绿', '广阔', '包容'],
    emotions: ['包容', '广阔', '清凉', '舒展'],
    elements: ['lotus', 'leaf', 'green'],
    style: '荷塘碧绿'
  },
  {
    url: 'https://images.unsplash.com/photo-1509225770129-fbcf8a696c0b?w=800&q=80',
    tags: ['蒲公英', '自由', '散播', '梦想'],
    emotions: ['自由', '梦想', '飞翔', '希望'],
    elements: ['dandelion', 'seed', 'fly'],
    style: '蒲公英之梦'
  },
  {
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    tags: ['草地', '柔软', '舒适', '自然'],
    emotions: ['舒适', '自然', '放松', '自由'],
    elements: ['grass', 'meadow', 'soft'],
    style: '草地诗意'
  },
  {
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    tags: ['野花', '自然', '自由', '野性'],
    emotions: ['自由', '野性', '自然', '活力'],
    elements: ['wildflower', 'field', 'nature'],
    style: '野花之美'
  },
  {
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80',
    tags: ['苔藓', '静谧', '古老', '沉静'],
    emotions: ['沉静', '古老', '神秘', '静谧'],
    elements: ['moss', 'green', 'ancient'],
    style: '苔藓意境'
  },
  {
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80',
    tags: ['树木', '成长', '扎根', '生命'],
    emotions: ['成长', '扎根', '生命', '坚强'],
    elements: ['tree', 'growth', 'life'],
    style: '树木之歌'
  },
  {
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80',
    tags: ['落叶', '放下', '告别', '轮回'],
    emotions: ['放下', '告别', '轮回', '释然'],
    elements: ['leaves', 'autumn', 'fall'],
    style: '落叶诗意'
  },
  {
    url: 'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=800&q=80',
    tags: ['嫩芽', '新生', '希望', '开始'],
    emotions: ['新生', '希望', '开始', '成长'],
    elements: ['sprout', 'new', 'growth'],
    style: '嫩芽新生'
  },
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    tags: ['蕨类', '原始', '生命力', '顽强'],
    emotions: ['顽强', '生命力', '原始', '坚韧'],
    elements: ['fern', 'green', 'ancient'],
    style: '蕨类意境'
  },
  {
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80',
    tags: ['树根', '根基', '稳定', '深层'],
    emotions: ['稳定', '根基', '深层', '扎实'],
    elements: ['roots', 'tree', 'deep'],
    style: '树根力量'
  },

  // ==================== 天空云霞 (51-65) ====================
  {
    url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80',
    tags: ['云朵', '自由', '漂浮', '轻盈'],
    emotions: ['自由', '轻盈', '漂浮', '无拘'],
    elements: ['cloud', 'sky', 'freedom'],
    style: '云之自由'
  },
  {
    url: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800&q=80',
    tags: ['日出', '希望', '新的开始', '光明'],
    emotions: ['希望', '开始', '光明', '期待'],
    elements: ['sunrise', 'dawn', 'hope'],
    style: '日出希望'
  },
  {
    url: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=800&q=80',
    tags: ['日落', '结束', '宁静', '温暖'],
    emotions: ['宁静', '温暖', '结束', '安详'],
    elements: ['sunset', 'dusk', 'warm'],
    style: '日落温情'
  },
  {
    url: 'https://images.unsplash.com/photo-1509225770129-fbcf8a696c0b?w=800&q=80',
    tags: ['星空', '梦想', '无限', '神秘'],
    emotions: ['梦想', '无限', '神秘', '向往'],
    elements: ['stars', 'night', 'dream'],
    style: '星空梦幻'
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    tags: ['月亮', '思念', '浪漫', '宁静'],
    emotions: ['思念', '浪漫', '宁静', '孤独'],
    elements: ['moon', 'night', 'romantic'],
    style: '月夜思念'
  },
  {
    url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80',
    tags: ['晚霞', '绚烂', '美丽', '绽放'],
    emotions: ['绚烂', '美丽', '感动', '辉煌'],
    elements: ['twilight', 'sunset', 'colorful'],
    style: '晚霞绚烂'
  },
  {
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    tags: ['彩虹', '希望', '奇迹', '美好'],
    emotions: ['希望', '奇迹', '美好', '转机'],
    elements: ['rainbow', 'sky', 'hope'],
    style: '彩虹希望'
  },
  {
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    tags: ['蓝天', '宽广', '自由', '豁达'],
    emotions: ['自由', '豁达', '宽广', '舒畅'],
    elements: ['blue', 'sky', 'freedom'],
    style: '蓝天自由'
  },
  {
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80',
    tags: ['阴天', '沉静', '等待', '积蓄'],
    emotions: ['沉静', '等待', '积蓄', '酝酿'],
    elements: ['cloudy', 'grey', 'calm'],
    style: '阴天沉静'
  },
  {
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80',
    tags: ['雾气', '神秘', '朦胧', '模糊'],
    emotions: ['神秘', '朦胧', '模糊', '未知'],
    elements: ['fog', 'mist', 'mystery'],
    style: '雾气朦胧'
  },
  {
    url: 'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=800&q=80',
    tags: ['阳光', '温暖', '光明', '希望'],
    emotions: ['温暖', '希望', '光明', '积极'],
    elements: ['sun', 'light', 'warm'],
    style: '阳光温暖'
  },
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    tags: ['云海', '超脱', '仙境', '升华'],
    emotions: ['超脱', '升华', '仙境', '自在'],
    elements: ['clouds', 'sea', 'dream'],
    style: '云海仙境'
  },
  {
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80',
    tags: ['闪电', '力量', '突破', '觉醒'],
    emotions: ['力量', '突破', '觉醒', '震撼'],
    elements: ['lightning', 'storm', 'power'],
    style: '闪电力量'
  },
  {
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    tags: ['极光', '奇迹', '神秘', '美丽'],
    emotions: ['奇迹', '神秘', '美丽', '震撼'],
    elements: ['aurora', 'northern', 'lights'],
    style: '极光奇迹'
  },
  {
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80',
    tags: ['晨曦', '开始', '希望', '新生'],
    emotions: ['希望', '新生', '开始', '期待'],
    elements: ['dawn', 'morning', 'new'],
    style: '晨曦希望'
  },

  // ==================== 禅意空间 (66-80) ====================
  {
    url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80',
    tags: ['茶室', '宁静', '冥想', '禅意'],
    emotions: ['宁静', '冥想', '禅意', '平和'],
    elements: ['tea', 'room', 'zen'],
    style: '茶室禅意'
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    tags: ['庭院', '安静', '自然', '和谐'],
    emotions: ['安静', '和谐', '自然', '平和'],
    elements: ['garden', 'courtyard', 'peace'],
    style: '庭院宁静'
  },
  {
    url: 'https://images.unsplash.com/photo-1509225770129-fbcf8a696c0b?w=800&q=80',
    tags: ['竹林', '清幽', '淡泊', '高雅'],
    emotions: ['清幽', '淡泊', '高雅', '宁静'],
    elements: ['bamboo', 'forest', 'quiet'],
    style: '竹林清幽'
  },
  {
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    tags: ['石阶', '修行', '向上', '坚定'],
    emotions: ['坚定', '向上', '修行', '坚持'],
    elements: ['stone', 'steps', 'path'],
    style: '石阶修行'
  },
  {
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    tags: ['枯山水', '极简', '禅意', '静观'],
    emotions: ['极简', '禅意', '静观', '淡然'],
    elements: ['zen', 'garden', 'stones'],
    style: '枯山水禅意'
  },
  {
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80',
    tags: ['香薰', '冥想', '放松', '疗愈'],
    emotions: ['放松', '疗愈', '冥想', '平静'],
    elements: ['incense', 'meditation', 'calm'],
    style: '香薰冥想'
  },
  {
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80',
    tags: ['蜡烛', '温暖', '光明', '希望'],
    emotions: ['温暖', '希望', '光明', '宁静'],
    elements: ['candle', 'light', 'warm'],
    style: '烛光温暖'
  },
  {
    url: 'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=800&q=80',
    tags: ['书卷', '智慧', '学习', '成长'],
    emotions: ['智慧', '学习', '成长', '沉静'],
    elements: ['book', 'wisdom', 'study'],
    style: '书卷智慧'
  },
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    tags: ['古寺', '宁静', '超脱', '修行'],
    emotions: ['宁静', '超脱', '修行', '虔诚'],
    elements: ['temple', 'ancient', 'zen'],
    style: '古寺宁静'
  },
  {
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80',
    tags: ['水墨', '意境', '留白', '禅意'],
    emotions: ['意境', '留白', '禅意', '淡然'],
    elements: ['ink', 'painting', 'minimal'],
    style: '水墨意境'
  },
  {
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    tags: ['茶具', '品茶', '慢生活', '宁静'],
    emotions: ['宁静', '慢生活', '品茶', '放松'],
    elements: ['tea', 'ceremony', 'calm'],
    style: '茶道之美'
  },
  {
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80',
    tags: ['禅修', '冥想', '静心', '觉知'],
    emotions: ['静心', '觉知', '冥想', '平和'],
    elements: ['meditation', 'zen', 'peace'],
    style: '禅修静心'
  },
  {
    url: 'https://images.unsplash.com/photo-1494472155656-f34e81b17ddc?w=800&q=80',
    tags: ['古琴', '音乐', '雅致', '清幽'],
    emotions: ['雅致', '清幽', '音乐', '宁静'],
    elements: ['guqin', 'music', 'elegant'],
    style: '古琴雅致'
  },
  {
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
    tags: ['花道', '插花', '艺术', '雅致'],
    emotions: ['艺术', '雅致', '美', '创造'],
    elements: ['flower', 'arrangement', 'art'],
    style: '花道艺术'
  },
  {
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
    tags: ['香道', '嗅觉', '沉静', '意境'],
    emotions: ['沉静', '意境', '嗅觉', '宁静'],
    elements: ['incense', 'scent', 'zen'],
    style: '香道意境'
  },

  // ==================== 季节更替 (81-90) ====================
  {
    url: 'https://images.unsplash.com/photo-1518882605630-8eb7c5f5a1ed?w=800&q=80',
    tags: ['春天', '新生', '开始', '希望'],
    emotions: ['新生', '希望', '开始', '活力'],
    elements: ['spring', 'new', 'life'],
    style: '春之新生'
  },
  {
    url: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=800&q=80',
    tags: ['夏天', '热情', '活力', '茂盛'],
    emotions: ['热情', '活力', '茂盛', '生命'],
    elements: ['summer', 'green', 'vibrant'],
    style: '夏之热情'
  },
  {
    url: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=800&q=80',
    tags: ['秋天', '收获', '成熟', '金黄'],
    emotions: ['收获', '成熟', '金黄', '满足'],
    elements: ['autumn', 'golden', 'harvest'],
    style: '秋之收获'
  },
  {
    url: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=800&q=80',
    tags: ['冬天', '沉静', '内省', '休养'],
    emotions: ['沉静', '内省', '休养', '宁静'],
    elements: ['winter', 'snow', 'quiet'],
    style: '冬之沉静'
  },
  {
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    tags: ['雪景', '纯净', '洁白', '宁静'],
    emotions: ['纯净', '洁白', '宁静', '超脱'],
    elements: ['snow', 'white', 'pure'],
    style: '雪之纯净'
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    tags: ['春花', '绽放', '美丽', '希望'],
    emotions: ['绽放', '美丽', '希望', '喜悦'],
    elements: ['spring', 'flower', 'bloom'],
    style: '春花绽放'
  },
  {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    tags: ['夏雨', '清凉', '洗涤', '净化'],
    emotions: ['清凉', '洗涤', '净化', '舒爽'],
    elements: ['summer', 'rain', 'fresh'],
    style: '夏雨清凉'
  },
  {
    url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
    tags: ['秋叶', '凋零', '放下', '轮回'],
    emotions: ['放下', '轮回', '凋零', '释然'],
    elements: ['autumn', 'leaves', 'fall'],
    style: '秋叶凋零'
  },
  {
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80',
    tags: ['冬梅', '坚强', '傲骨', '不屈'],
    emotions: ['坚强', '傲骨', '不屈', '坚韧'],
    elements: ['winter', 'plum', 'strength'],
    style: '冬梅傲骨'
  },
  {
    url: 'https://images.unsplash.com/photo-1518882605630-8eb7c5f5a1ed?w=800&q=80',
    tags: ['四季', '轮回', '变化', '无常'],
    emotions: ['轮回', '变化', '无常', '接纳'],
    elements: ['seasons', 'cycle', 'change'],
    style: '四季轮回'
  },

  // ==================== 动物生灵 (91-100) ====================
  {
    url: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&q=80',
    tags: ['蝴蝶', '蜕变', '美丽', '自由'],
    emotions: ['蜕变', '美丽', '自由', '重生'],
    elements: ['butterfly', 'transform', 'freedom'],
    style: '蝶之蜕变'
  },
  {
    url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80',
    tags: ['飞鸟', '自由', '翱翔', '超越'],
    emotions: ['自由', '翱翔', '超越', '无拘'],
    elements: ['bird', 'fly', 'freedom'],
    style: '鸟之自由'
  },
  {
    url: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=800&q=80',
    tags: ['鱼', '游弋', '自由', '流动'],
    emotions: ['自由', '流动', '游弋', '无拘'],
    elements: ['fish', 'swim', 'water'],
    style: '鱼之游弋'
  },
  {
    url: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&q=80',
    tags: ['鹿', '灵动', '优雅', '警觉'],
    emotions: ['灵动', '优雅', '警觉', '温柔'],
    elements: ['deer', 'grace', 'gentle'],
    style: '鹿之灵动'
  },
  {
    url: 'https://images.unsplash.com/photo-1544923246-77307dd628b8?w=800&q=80',
    tags: ['猫', '独立', '安静', '神秘'],
    emotions: ['独立', '安静', '神秘', '自在'],
    elements: ['cat', 'independent', 'calm'],
    style: '猫之独立'
  },
  {
    url: 'https://images.unsplash.com/photo-1517152030172-8dde3e0e6941?w=800&q=80',
    tags: ['鹤', '长寿', '优雅', '超脱'],
    emotions: ['长寿', '优雅', '超脱', '仙气'],
    elements: ['crane', 'elegance', 'immortal'],
    style: '鹤之优雅'
  },
  {
    url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&q=80',
    tags: ['鹰', '远见', '力量', '高远'],
    emotions: ['远见', '力量', '高远', '雄心'],
    elements: ['eagle', 'vision', 'power'],
    style: '鹰之远见'
  },
  {
    url: 'https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?w=800&q=80',
    tags: ['萤火虫', '微光', '希望', '指引'],
    emotions: ['希望', '指引', '微光', '温暖'],
    elements: ['firefly', 'light', 'hope'],
    style: '萤火微光'
  },
  {
    url: 'https://images.unsplash.com/photo-1497752531616-c3afd9760a11?w=800&q=80',
    tags: ['蜻蜓', '轻盈', '停留', '短暂'],
    emotions: ['轻盈', '短暂', '珍惜', '美好'],
    elements: ['dragonfly', 'light', 'moment'],
    style: '蜻蜓点水'
  },
  {
    url: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=800&q=80',
    tags: ['蜜蜂', '勤劳', '甜蜜', '收获'],
    emotions: ['勤劳', '甜蜜', '收获', '努力'],
    elements: ['bee', 'honey', 'work'],
    style: '蜜蜂勤劳'
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
  '爱情': ['花', '玫瑰', '温暖', '浪漫', '美丽'],
  '家庭': ['温暖', '和谐', '宁静', '安宁'],
  '健康': ['生命', '活力', '自然', '成长'],
  '金钱': ['收获', '金黄', '成熟', '财富'],
  '学习': ['智慧', '成长', '书卷', '新生'],
  '人际关系': ['和谐', '包容', '理解', '宽广'],
  '人生方向': ['路', '小径', '方向', '远方'],
  '自我': ['自省', '倒影', '镜子', '真实'],
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
export function getMatchedImage(obsession: string): { url: string; tags: string[]; emotions: string[] } {
  // 提取关键词
  const keywords: string[] = [];
  
  // 从情感映射中获取相关情感
  for (const [emotion, related] of Object.entries(EMOTION_MAP)) {
    if (obsession.includes(emotion)) {
      keywords.push(emotion, ...related);
    }
  }
  
  // 从主题映射中获取相关主题
  for (const [theme, related] of Object.entries(THEME_MAP)) {
    if (obsession.includes(theme)) {
      keywords.push(theme, ...related);
    }
  }
  
  // 直接从输入中提取关键词
  const directKeywords = obsession.split(/[，。、！？\s,.\!?]+/).filter(k => k.length > 0);
  keywords.push(...directKeywords);
  
  // 计算所有图片的匹配分数
  const scoredImages = IMAGE_LIBRARY.map(img => ({
    image: img,
    score: calculateMatchScore(img, keywords)
  }));
  
  // 按分数排序
  scoredImages.sort((a, b) => b.score - a.score);
  
  // 从高分图片中随机选择（增加多样性）
  const topImages = scoredImages.filter(s => s.score >= scoredImages[0].score - 2);
  const selected = topImages[Math.floor(Math.random() * topImages.length)];
  
  return {
    url: selected.image.url,
    tags: selected.image.tags,
    emotions: selected.image.emotions
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
