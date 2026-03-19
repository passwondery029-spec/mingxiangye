// pages/incubation/incubation.js
const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    phase: '吸气',
    timeLeft: 420, // 7 分钟
    formatTime: '7:00',
    isReady: false,
    isSkipping: false,
    isGenerating: true, // 新增：生成状态
    skipButtonText: '正在生成画作...'
  },

  onLoad() {
    this.obsession = app.globalData.obsession;
    this.startBreathingCycle();
    this.startTimer();
    this.generateContent();
  },

  onUnload() {
    // 清除定时器
    if (this.breathTimer) clearInterval(this.breathTimer);
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  },

  // 呼吸循环
  startBreathingCycle() {
    this.breathTimer = setInterval(() => {
      this.setData({
        phase: this.data.phase === '吸气' ? '呼气' : '吸气'
      });
    }, 4000);
  },

  // 倒计时
  startTimer() {
    this.countdownTimer = setInterval(() => {
      const timeLeft = this.data.timeLeft - 1;
      if (timeLeft <= 0) {
        clearInterval(this.countdownTimer);
        this.setData({ timeLeft: 0, formatTime: '0:00' });
        this.checkAndNavigate();
      } else {
        this.setData({
          timeLeft,
          formatTime: this.formatTime(timeLeft)
        });
      }
    }, 1000);
  },

  // 格式化时间
  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  },

  // 生成内容
  async generateContent() {
    console.log('[冥想] 开始后台生成...');
    
    try {
      const result = await api.generateHealingContent(this.obsession);
      console.log('[冥想] 生成完成:', result.title);
      
      const artPiece = {
        id: Date.now().toString(),
        obsession: this.obsession,
        title: result.title,
        poem: result.poem,
        imageBase64: result.imageBase64,
        date: new Date().toISOString()
      };

      app.globalData.currentArt = artPiece;
      this.setData({ 
        isReady: true,
        isGenerating: false,
        skipButtonText: '提前结束冥想'
      });
      this.checkAndNavigate();
    } catch (err) {
      console.error('生成失败:', err);
      // 使用兜底内容
      const fallback = api.getFallbackContent(this.obsession);
      app.globalData.currentArt = {
        id: Date.now().toString(),
        obsession: this.obsession,
        title: fallback.title,
        poem: fallback.poem,
        imageBase64: fallback.imageBase64,
        date: new Date().toISOString()
      };
      this.setData({ 
        isReady: true,
        isGenerating: false,
        skipButtonText: '提前结束冥想'
      });
      this.checkAndNavigate();
    }
  },

  // 跳过
  handleSkip() {
    if (this.data.isSkipping) return;
    this.setData({ 
      isSkipping: true,
      skipButtonText: this.data.isReady ? '即将展现...' : '正在凝结画作...'
    });
    this.checkAndNavigate();
  },

  // 检查并导航
  checkAndNavigate() {
    if ((this.data.timeLeft === 0 || this.data.isSkipping) && this.data.isReady) {
      clearInterval(this.breathTimer);
      clearInterval(this.countdownTimer);
      wx.redirectTo({
        url: '/pages/blooming/blooming'
      });
    }
  }
});
