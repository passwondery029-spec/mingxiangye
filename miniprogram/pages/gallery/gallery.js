// pages/gallery/gallery.js
const app = getApp();

Page({
  data: {
    gallery: [],
    showModal: false,
    currentArt: {},
    currentPoemLines: []
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    this.setData({
      gallery: app.globalData.gallery || []
    });
  },

  // 格式化日期
  formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  },

  // 查看详情
  viewDetail(e) {
    const index = e.currentTarget.dataset.index;
    const art = this.data.gallery[index];
    
    this.setData({
      showModal: true,
      currentArt: art,
      currentPoemLines: art.poem.split(/\n|\\n/)
    });
  },

  // 关闭弹窗
  closeModal() {
    this.setData({ showModal: false });
  },

  // 阻止冒泡
  preventClose() {},

  // 返回
  goBack() {
    wx.navigateBack();
  }
});
