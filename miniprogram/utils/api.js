// utils/api.js - API 调用封装
// 后端使用火山引擎 ARK 模型生成诗句
// 图片使用 100 张精选绘画风格图片库，支持关键词匹配

const app = getApp();

/**
 * 生成疗愈内容
 * @param {string} obsession - 用户的执念
 * @returns {Promise} - 返回生成的内容
 */
function generateHealingContent(obsession) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.apiBaseUrl}/api/meditation/start`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'x-user-id': getUserId()
      },
      data: {
        obsession: obsession
      },
      timeout: 120000, // 2 分钟超时
      success(res) {
        if (res.statusCode === 200 && res.data.status === 'completed') {
          resolve({
            title: res.data.result.title,
            poem: res.data.result.poem,
            imageBase64: res.data.result.imageBase64,
            matchedTags: res.data.result.matchedTags || [],
            matchedEmotions: res.data.result.matchedEmotions || []
          });
        } else {
          resolve(getFallbackContent(obsession));
        }
      },
      fail(err) {
        console.error('API 调用失败:', err);
        resolve(getFallbackContent(obsession));
      }
    });
  });
}

/**
 * 获取兜底内容
 */
function getFallbackContent(obsession) {
  const poems = [
    '心若止水，\n万物皆空。\n执念如云，\n随风而去。',
    '一念花开，\n一念花落。\n心安处，\n即是归处。',
    '静观自在，\n心无挂碍。\n万物静默，\n皆是答案。',
    '执念深处，\n自有光明。\n放下刹那，\n便是永恒。',
    '山高水长，\n心境澄明。\n一呼一吸，\n皆是修行。',
    '云卷云舒，\n皆是风景。\n心随云动，\n自在从容。'
  ];

  // 更新为新的图片库（Pixabay 绘画风格）
  const images = [
    'https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg',
    'https://cdn.pixabay.com/photo/2016/03/09/09/17/composition-1245555_960_720.jpg',
    'https://cdn.pixabay.com/photo/2016/10/20/18/35/earth-1756274_960_720.jpg',
    'https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_960_720.jpg',
    'https://cdn.pixabay.com/photo/2017/02/01/12/05/mountains-2029239_960_720.jpg',
    'https://cdn.pixabay.com/photo/2017/08/02/00/49/lotus-2569142_960_720.jpg',
    'https://cdn.pixabay.com/photo/2016/11/29/04/16/blossom-1867602_960_720.jpg',
    'https://cdn.pixabay.com/photo/2016/01/08/11/54/bamboo-1127557_960_720.jpg',
    'https://cdn.pixabay.com/photo/2016/01/11/19/17/sunset-1134350_960_720.jpg',
    'https://cdn.pixabay.com/photo/2018/01/06/14/05/snow-3066167_960_720.jpg'
  ];

  const hash = obsession.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return {
    title: '心境',
    poem: poems[hash % poems.length],
    imageBase64: images[hash % images.length],
    matchedTags: [],
    matchedEmotions: []
  };
}

/**
 * 获取或创建用户 ID
 */
function getUserId() {
  let userId = wx.getStorageSync('mingxiangye_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    wx.setStorageSync('mingxiangye_user_id', userId);
  }
  return userId;
}

module.exports = {
  generateHealingContent,
  getFallbackContent,
  getUserId
};
