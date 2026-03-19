// pages/incubation/incubation.js
const app = getApp();
const api = require('../../utils/api');

// 音乐配置
const MUSIC_TRACKS = [
  // 云英引导系列（晨午暮睡）
  { id: 'morning', name: '晨曦云英', desc: '清晨冥想，唤醒身心', type: 'guided', icon: '🌅' },
  { id: 'noon', name: '午间云英', desc: '正午冥想，重获能量', type: 'guided', icon: '☀️' },
  { id: 'evening', name: '暮色云英', desc: '傍晚冥想，沉淀心灵', type: 'guided', icon: '🌆' },
  { id: 'sleep', name: '睡前云英', desc: '入睡引导，安然入梦', type: 'guided', icon: '🌙' },
  // 自然之声（精选3段）
  { id: 'forest', name: '林间鸟鸣', desc: '自然之声', type: 'ambient', icon: '🌲' },
  { id: 'stream', name: '溪水潺潺', desc: '流水声', type: 'ambient', icon: '💧' },
  { id: 'bell', name: '古刹钟声', desc: '禅钟悠扬', type: 'ambient', icon: '🔔' },
];

// 引导步骤
const GUIDE_STEPS = [
  { icon: '🧘', title: '调整姿势', desc: '盘腿而坐，脊背自然挺直' },
  { icon: '🔥', title: '点燃心香', desc: '若有条件，可点燃一炷清香' },
  { icon: '👁️', title: '闭目凝神', desc: '轻轻闭眼，让呼吸自然流转' },
  { icon: '🎵', title: '选择音乐', desc: '开启你的疗愈之旅' },
];

Page({
  data: {
    // 阶段: guide | music | meditation
    stage: 'guide',
    
    // 引导阶段
    currentStep: 0,
    guideSteps: GUIDE_STEPS,
    
    // 音乐选择
    musicTracks: MUSIC_TRACKS,
    selectedMusic: null,
    
    // 冥想阶段
    phase: '吸气',
    timeLeft: 420,
    formatTime: '7:00',
    isReady: false,
    isSkipping: false,
    isGenerating: true,
    skipButtonText: '正在生成画作...',
    
    // 音频状态
    isPlaying: false,
  },

  onLoad() {
    this.obsession = app.globalData.obsession;
    this.audioContext = wx.createInnerAudioContext();
    this.startGuideTimer();
  },

  onUnload() {
    if (this.guideTimer) clearInterval(this.guideTimer);
    if (this.breathTimer) clearInterval(this.breathTimer);
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    if (this.audioContext) {
      this.audioContext.stop();
      this.audioContext.destroy();
    }
  },

  // ==================== 引导阶段 ====================
  startGuideTimer() {
    this.guideTimer = setInterval(() => {
      if (this.data.currentStep < GUIDE_STEPS.length - 1) {
        this.setData({ currentStep: this.data.currentStep + 1 });
      } else {
        clearInterval(this.guideTimer);
      }
    }, 3000);
  },

  // 下一步
  handleNextStep() {
    if (this.data.currentStep < GUIDE_STEPS.length - 1) {
      this.setData({ currentStep: this.data.currentStep + 1 });
    } else {
      this.setData({ stage: 'music' });
    }
  },

  // ==================== 音乐选择 ====================
  handleSelectMusic(e) {
    const trackId = e.currentTarget.dataset.id;
    const track = MUSIC_TRACKS.find(t => t.id === trackId);
    this.setData({ selectedMusic: track });
  },

  // 开始冥想
  handleStartMeditation() {
    if (!this.data.selectedMusic) {
      wx.showToast({ title: '请选择音乐', icon: 'none' });
      return;
    }

    this.setData({ stage: 'meditation' });
    
    // 播放音乐
    this.playMusic();
    
    // 开始呼吸循环
    this.startBreathingCycle();
    
    // 开始倒计时
    this.startTimer();
    
    // 生成内容
    this.generateContent();
  },

  // 播放音乐
  playMusic() {
    const track = this.data.selectedMusic;
    if (!track) return;
    
    // 音频文件路径（需要放在 miniprogram/audio/ 目录下）
    this.audioContext.src = `/audio/${track.id}.mp3`;
    this.audioContext.loop = true;
    this.audioContext.play()
      .then(() => this.setData({ isPlaying: true }))
      .catch(err => {
        console.log('音频播放失败:', err);
        // 如果音频文件不存在，静默失败
      });
  },

  // 切换播放/暂停
  togglePlay() {
    if (this.data.isPlaying) {
      this.audioContext.pause();
      this.setData({ isPlaying: false });
    } else {
      this.audioContext.play();
      this.setData({ isPlaying: true });
    }
  },

  // ==================== 冥想阶段 ====================
  startBreathingCycle() {
    this.breathTimer = setInterval(() => {
      this.setData({
        phase: this.data.phase === '吸气' ? '呼气' : '吸气'
      });
    }, 4000);
  },

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

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  },

  async generateContent() {
    try {
      const result = await api.generateHealingContent(this.obsession);
      
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

  handleSkip() {
    if (this.data.isSkipping) return;
    this.setData({ 
      isSkipping: true,
      skipButtonText: this.data.isReady ? '即将展现...' : '正在凝结画作...'
    });
    this.checkAndNavigate();
  },

  checkAndNavigate() {
    if ((this.data.timeLeft === 0 || this.data.isSkipping) && this.data.isReady) {
      clearInterval(this.breathTimer);
      clearInterval(this.countdownTimer);
      if (this.audioContext) {
        this.audioContext.stop();
      }
      wx.redirectTo({
        url: '/pages/blooming/blooming'
      });
    }
  }
});
