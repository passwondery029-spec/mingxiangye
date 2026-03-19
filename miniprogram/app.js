// app.js - 小程序入口
App({
  globalData: {
    // 当前执念
    obsession: '',
    // 当前生成的艺术作品
    currentArt: null,
    // 图鉴收藏
    gallery: [],
    // API 基础地址（后端服务地址）
    apiBaseUrl: 'https://mingxiangye.vercel.app'
  },

  onLaunch() {
    // 从本地存储加载图鉴
    const gallery = wx.getStorageSync('gallery') || [];
    this.globalData.gallery = gallery;
  },

  // 保存图鉴到本地存储
  saveGallery(artPiece) {
    this.globalData.gallery.unshift(artPiece);
    wx.setStorageSync('gallery', this.globalData.gallery);
  },

  // 清空当前状态
  clearCurrent() {
    this.globalData.obsession = '';
    this.globalData.currentArt = null;
  }
});
