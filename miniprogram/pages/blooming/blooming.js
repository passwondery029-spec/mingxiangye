// pages/blooming/blooming.js
const app = getApp();

Page({
  data: {
    artPiece: null,
    poemLines: []
  },

  onLoad() {
    const artPiece = app.globalData.currentArt;
    
    if (artPiece) {
      // 解析诗句
      const poemLines = artPiece.poem.split(/\n|\\n/);
      
      this.setData({
        artPiece,
        poemLines
      });
    }
  },

  // 预览图片
  previewImage() {
    if (this.data.artPiece && this.data.artPiece.imageBase64) {
      // 判断是否为 base64
      const imageUrl = this.data.artPiece.imageBase64;
      if (imageUrl.startsWith('data:')) {
        // base64 图片需要先保存到本地
        wx.showToast({
          title: '暂不支持预览',
          icon: 'none'
        });
      } else {
        wx.previewImage({
          urls: [imageUrl],
          current: imageUrl
        });
      }
    }
  },

  // 保存到图鉴
  handleSave() {
    if (this.data.artPiece) {
      app.saveGallery(this.data.artPiece);
      
      wx.showToast({
        title: '已收录心境图鉴',
        icon: 'success'
      });
      
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/gallery/gallery'
        });
      }, 1500);
    }
  },

  // 随风散去
  handleDiscard() {
    app.clearCurrent();
    
    wx.redirectTo({
      url: '/pages/sowing/sowing'
    });
  }
});
