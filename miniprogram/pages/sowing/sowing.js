// pages/sowing/sowing.js
const app = getApp();

Page({
  data: {
    text: '',
    isSowing: false
  },

  onInput(e) {
    this.setData({
      text: e.detail.value
    });
  },

  handleSow() {
    if (!this.data.text.trim()) return;

    this.setData({ isSowing: true });

    // 保存执念到全局
    app.globalData.obsession = this.data.text;

    // 动画后跳转
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/incubation/incubation'
      });
    }, 2000);
  },

  goGallery() {
    wx.navigateTo({
      url: '/pages/gallery/gallery'
    });
  },

  onShow() {
    // 每次显示页面时重置状态
    this.setData({ 
      isSowing: false,
      text: ''
    });
  }
});
