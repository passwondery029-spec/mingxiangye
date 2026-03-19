import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useRef } from 'react';
import { generateHealingContent } from '../services/geminiService';
import { ArtPiece } from '../App';

// ==================== 音乐配置 ====================
interface MusicTrack {
  id: string;
  name: string;
  description: string;
  type: 'guided' | 'ambient';
  duration?: string;
  icon: string;
}

const MUSIC_TRACKS: MusicTrack[] = [
  // 云英引导系列（晨午暮睡）
  { id: 'morning', name: '晨曦云英', description: '清晨冥想，唤醒身心', type: 'guided', icon: '🌅' },
  { id: 'noon', name: '午间云英', description: '正午冥想，重获能量', type: 'guided', icon: '☀️' },
  { id: 'evening', name: '暮色云英', description: '傍晚冥想，沉淀心灵', type: 'guided', icon: '🌆' },
  { id: 'sleep', name: '睡前云英', description: '入睡引导，安然入梦', type: 'guided', icon: '🌙' },
  // 自然之声（精选3段）
  { id: 'forest', name: '林间鸟鸣', description: '自然之声，宁静悠远', type: 'ambient', icon: '🌲' },
  { id: 'stream', name: '溪水潺潺', description: '流水声，洗涤心灵', type: 'ambient', icon: '💧' },
  { id: 'bell', name: '古刹钟声', description: '禅钟悠扬，空灵澄澈', type: 'ambient', icon: '🔔' },
];

// ==================== 引导步骤 ====================
const GUIDE_STEPS = [
  { icon: '🧘', title: '调整姿势', description: '盘腿而坐，脊背自然挺直，双手轻放于膝上' },
  { icon: '🔥', title: '点燃心香', description: '若有条件，可点燃一炷清香，让香气环绕' },
  { icon: '👁️', title: '闭目凝神', description: '轻轻闭眼，让呼吸自然流转，放下杂念' },
  { icon: '🎵', title: '选择音乐', description: '选择一段冥想音乐，开启你的疗愈之旅' },
];

// ==================== 主组件 ====================
interface IncubationPageProps {
  obsession: string;
  onComplete: (artPiece: ArtPiece) => void;
}

type Stage = 'guide' | 'music' | 'meditation';

export default function IncubationPage({ obsession, onComplete }: IncubationPageProps) {
  const [stage, setStage] = useState<Stage>('guide');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack | null>(null);
  
  // 冥想状态
  const [phase, setPhase] = useState('吸气');
  const [timeLeft, setTimeLeft] = useState(420); // 7 minutes
  const [artPiece, setArtPiece] = useState<ArtPiece | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  
  // 音频
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);

  // 引导步骤自动推进
  useEffect(() => {
    if (stage !== 'guide') return;
    if (currentStep < GUIDE_STEPS.length - 1) {
      const timer = setTimeout(() => setCurrentStep(s => s + 1), 3000);
      return () => clearTimeout(timer);
    }
  }, [stage, currentStep]);

  // 预加载音频
  useEffect(() => {
    if (selectedMusic && audioRef.current) {
      audioRef.current.load();
      audioRef.current.oncanplaythrough = () => {
        setAudioLoaded(true);
      };
    }
  }, [selectedMusic]);

  // 开始冥想
  const startMeditation = async () => {
    setStage('meditation');
    
    // 确保音频播放（用户点击触发的交互）
    if (selectedMusic && audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setIsPlaying(true);
        console.log('[冥想] 音频开始播放:', selectedMusic.name);
      } catch (err) {
        console.error('[冥想] 音频播放失败:', err);
        // 如果自动播放失败，提示用户点击播放
      }
    }
    
    // 开始生成内容
    generateHealingContent(obsession).then(result => {
      console.log('[冥想] 生成完成:', result.title);
      setArtPiece({
        id: Date.now().toString(),
        obsession,
        title: result.title,
        poem: result.poem,
        imageBase64: result.imageBase64,
        date: new Date().toISOString()
      });
      setIsReady(true);
      setIsGenerating(false);
    }).catch(err => {
      console.error("Incubation error:", err);
      setArtPiece({
        id: Date.now().toString(),
        obsession,
        title: "心如止水",
        poem: "心如止水，\n万物生辉。\n执念散去，\n清风徐来。",
        imageBase64: "",
        date: new Date().toISOString()
      });
      setIsReady(true);
      setIsGenerating(false);
    });
  };

  // 呼吸循环
  useEffect(() => {
    if (stage !== 'meditation') return;
    const interval = setInterval(() => {
      setPhase(p => p === '吸气' ? '呼气' : '吸气');
    }, 4000);
    return () => clearInterval(interval);
  }, [stage]);

  // 倒计时
  useEffect(() => {
    if (stage !== 'meditation') return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [stage]);

  // 结束冥想
  useEffect(() => {
    if ((timeLeft === 0 || isSkipping) && isReady && artPiece) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      onComplete(artPiece);
    }
  }, [timeLeft, isSkipping, isReady, artPiece, onComplete]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  // ==================== 渲染 ====================
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-bg-main"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* 背景纹理 */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] opacity-20 pointer-events-none" />
      
      {/* 动态背景 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-40 mix-blend-multiply">
          <motion.div
            className="absolute top-[10%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#6B8E8F] blur-[100px]"
            animate={{ x: [0, 50, -20, 0], y: [0, -30, 40, 0], scale: [1, 1.2, 0.9, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[10%] right-[10%] w-[70vw] h-[70vw] rounded-full bg-[#B88E6C] blur-[100px]"
            animate={{ x: [0, -40, 30, 0], y: [0, 50, -20, 0], scale: [1, 1.1, 1.3, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* 游走曲线动效 - 仅在冥想阶段显示，营造"正在作画"氛围 */}
      {stage === 'meditation' && (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* 发光滤镜 */}
          <defs>
            <filter id="glow1" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow2" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowSoft" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 画笔轨迹1 - 主曲线：绘制 → 停留 → 从头消失 */}
          <motion.path
            d="M10,90 Q5,75 15,70 T25,55 Q30,45 35,50 T50,35 Q55,25 60,30 T75,20 Q85,15 90,25"
            fill="none"
            stroke="rgba(74,108,111,0.6)"
            strokeWidth="0.3"
            strokeLinecap="round"
            filter="url(#glowSoft)"
            strokeDasharray="100"
            initial={{ strokeDashoffset: 100, opacity: 0 }}
            animate={{ 
              strokeDashoffset: [100, 0, 0, -100],
              opacity: [0, 0.8, 0.8, 0]
            }}
            transition={{ 
              strokeDashoffset: { duration: 10, ease: "easeInOut", repeat: Infinity },
              opacity: { duration: 10, ease: "easeInOut", repeat: Infinity }
            }}
          />
          
          {/* 画笔轨迹2 - 快速游走 */}
          <motion.path
            d="M85,85 Q90,70 80,65 T70,50 Q65,40 75,35 T60,25 Q50,20 45,30 T30,15"
            fill="none"
            stroke="rgba(107,142,143,0.5)"
            strokeWidth="0.25"
            strokeLinecap="round"
            filter="url(#glow1)"
            strokeDasharray="80"
            initial={{ strokeDashoffset: 80, opacity: 0 }}
            animate={{ 
              strokeDashoffset: [80, 0, 0, -80],
              opacity: [0, 0.7, 0.7, 0]
            }}
            transition={{ 
              strokeDashoffset: { duration: 7, ease: "easeInOut", repeat: Infinity, delay: 2 },
              opacity: { duration: 7, ease: "easeInOut", repeat: Infinity, delay: 2 }
            }}
          />

          {/* 画笔轨迹3 - 蜿蜒曲线 */}
          <motion.path
            d="M5,60 Q15,55 20,60 T35,45 Q40,35 50,40 T60,30 Q70,25 75,35 T90,40"
            fill="none"
            stroke="rgba(74,108,111,0.4)"
            strokeWidth="0.2"
            strokeLinecap="round"
            filter="url(#glow2)"
            strokeDasharray="90"
            initial={{ strokeDashoffset: 90, opacity: 0 }}
            animate={{ 
              strokeDashoffset: [90, 0, 0, -90],
              opacity: [0, 0.6, 0.6, 0]
            }}
            transition={{ 
              strokeDashoffset: { duration: 12, ease: "easeInOut", repeat: Infinity, delay: 1 },
              opacity: { duration: 12, ease: "easeInOut", repeat: Infinity, delay: 1 }
            }}
          />

          {/* 画笔轨迹4 - 轻柔点缀 */}
          <motion.path
            d="M30,80 Q25,70 35,65 T45,55 Q50,48 55,55 T70,50"
            fill="none"
            stroke="rgba(184,142,108,0.4)"
            strokeWidth="0.2"
            strokeLinecap="round"
            filter="url(#glow1)"
            strokeDasharray="50"
            initial={{ strokeDashoffset: 50, opacity: 0 }}
            animate={{ 
              strokeDashoffset: [50, 0, 0, -50],
              opacity: [0, 0.5, 0.5, 0]
            }}
            transition={{ 
              strokeDashoffset: { duration: 6, ease: "easeInOut", repeat: Infinity, delay: 3 },
              opacity: { duration: 6, ease: "easeInOut", repeat: Infinity, delay: 3 }
            }}
          />

          {/* 画笔轨迹5 - 长弧线 */}
          <motion.path
            d="M95,95 Q70,80 50,85 T20,70 Q10,60 25,50 T40,35 Q50,25 60,35 T80,20 Q95,10 85,5"
            fill="none"
            stroke="rgba(74,108,111,0.35)"
            strokeWidth="0.15"
            strokeLinecap="round"
            filter="url(#glowSoft)"
            strokeDasharray="120"
            initial={{ strokeDashoffset: 120, opacity: 0 }}
            animate={{ 
              strokeDashoffset: [120, 0, 0, -120],
              opacity: [0, 0.5, 0.5, 0]
            }}
            transition={{ 
              strokeDashoffset: { duration: 14, ease: "easeInOut", repeat: Infinity, delay: 0.5 },
              opacity: { duration: 14, ease: "easeInOut", repeat: Infinity, delay: 0.5 }
            }}
          />

          {/* 画笔轨迹6 - 快速掠过 */}
          <motion.path
            d="M15,40 Q25,35 30,42 T45,38 Q55,32 50,45 T65,42 Q75,38 70,50"
            fill="none"
            stroke="rgba(107,142,143,0.3)"
            strokeWidth="0.18"
            strokeLinecap="round"
            filter="url(#glow2)"
            strokeDasharray="60"
            initial={{ strokeDashoffset: 60, opacity: 0 }}
            animate={{ 
              strokeDashoffset: [60, 0, 0, -60],
              opacity: [0, 0.5, 0.5, 0]
            }}
            transition={{ 
              strokeDashoffset: { duration: 5, ease: "easeInOut", repeat: Infinity, delay: 4 },
              opacity: { duration: 5, ease: "easeInOut", repeat: Infinity, delay: 4 }
            }}
          />

          {/* 画笔轨迹7 - 点状轨迹 */}
          <motion.path
            d="M80,70 Q75,65 78,60 T72,52 Q68,48 72,45 T68,38"
            fill="none"
            stroke="rgba(74,108,111,0.25)"
            strokeWidth="0.12"
            strokeLinecap="round"
            filter="url(#glow1)"
            strokeDasharray="35"
            initial={{ strokeDashoffset: 35, opacity: 0 }}
            animate={{ 
              strokeDashoffset: [35, 0, 0, -35],
              opacity: [0, 0.4, 0.4, 0]
            }}
            transition={{ 
              strokeDashoffset: { duration: 8, ease: "easeInOut", repeat: Infinity, delay: 1.5 },
              opacity: { duration: 8, ease: "easeInOut", repeat: Infinity, delay: 1.5 }
            }}
          />

          {/* 画笔轨迹8 - 收尾点缀 */}
          <motion.path
            d="M50,95 Q45,90 55,85 T65,80 Q70,75 65,70 T75,65 Q82,60 78,55"
            fill="none"
            stroke="rgba(184,142,108,0.3)"
            strokeWidth="0.15"
            strokeLinecap="round"
            filter="url(#glow2)"
            strokeDasharray="45"
            initial={{ strokeDashoffset: 45, opacity: 0 }}
            animate={{ 
              strokeDashoffset: [45, 0, 0, -45],
              opacity: [0, 0.45, 0.45, 0]
            }}
            transition={{ 
              strokeDashoffset: { duration: 9, ease: "easeInOut", repeat: Infinity, delay: 5 },
              opacity: { duration: 9, ease: "easeInOut", repeat: Infinity, delay: 5 }
            }}
          />
        </svg>
      )}

      {/* 隐藏的音频元素 - 预加载以支持自动播放 */}
      {selectedMusic && (
        <audio 
          ref={audioRef} 
          loop 
          preload="auto"
          src={`/audio/${selectedMusic.id}.mp3`}
        />
      )}

      <AnimatePresence mode="wait">
        {/* ==================== 引导阶段 ==================== */}
        {stage === 'guide' && (
          <motion.div
            key="guide"
            className="z-10 flex flex-col items-center w-full px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* 标题 */}
            <motion.p 
              className="text-2xl font-serif-sc tracking-widest text-primary mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              准备冥想
            </motion.p>

            {/* 步骤指示器 */}
            <div className="flex gap-2 mb-8">
              {GUIDE_STEPS.map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i === currentStep ? 'bg-primary w-6' : 
                    i < currentStep ? 'bg-primary/50' : 'bg-primary/20'
                  }`}
                />
              ))}
            </div>

            {/* 当前步骤 */}
            <motion.div
              key={currentStep}
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-6">{GUIDE_STEPS[currentStep].icon}</div>
              <h3 className="text-xl font-serif-sc text-primary mb-3">
                {GUIDE_STEPS[currentStep].title}
              </h3>
              <p className="text-primary/60 font-serif-sc leading-relaxed max-w-xs">
                {GUIDE_STEPS[currentStep].description}
              </p>
            </motion.div>

            {/* 下一步按钮 */}
            <button
              onClick={() => {
                if (currentStep < GUIDE_STEPS.length - 1) {
                  setCurrentStep(s => s + 1);
                } else {
                  setStage('music');
                }
              }}
              className="mt-12 px-8 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-serif-sc tracking-widest transition-colors"
            >
              {currentStep < GUIDE_STEPS.length - 1 ? '下一步' : '选择音乐'}
            </button>
          </motion.div>
        )}

        {/* ==================== 音乐选择阶段 ==================== */}
        {stage === 'music' && (
          <motion.div
            key="music"
            className="z-10 flex flex-col items-center w-full px-6 pb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.p 
              className="text-2xl font-serif-sc tracking-widest text-primary mb-2"
            >
              选择冥想音乐
            </motion.p>
            <p className="text-primary/50 text-sm mb-8">选择一段音乐陪伴你的冥想时光</p>

            {/* 云英引导系列 */}
            <div className="w-full max-w-md mb-6">
              <p className="text-primary/60 text-xs tracking-wider mb-3">云英引导系列</p>
              <div className="grid grid-cols-2 gap-3">
                {MUSIC_TRACKS.filter(t => t.type === 'guided').map(track => (
                  <motion.button
                    key={track.id}
                    onClick={() => setSelectedMusic(track)}
                    className={`p-4 rounded-xl text-center transition-all ${
                      selectedMusic?.id === track.id 
                        ? 'bg-primary/10 border-2 border-primary' 
                        : 'bg-primary/5 border border-primary/20 hover:border-primary/40'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-2">{track.icon}</div>
                    <div className="text-sm font-serif-sc text-primary mb-1">{track.name}</div>
                    <div className="text-xs text-primary/50 truncate">{track.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 自然之声 */}
            <div className="w-full max-w-md">
              <p className="text-primary/60 text-xs tracking-wider mb-3">自然之声</p>
              <div className="grid grid-cols-3 gap-3">
                {MUSIC_TRACKS.filter(t => t.type === 'ambient').map(track => (
                  <motion.button
                    key={track.id}
                    onClick={() => setSelectedMusic(track)}
                    className={`p-4 rounded-xl text-center transition-all ${
                      selectedMusic?.id === track.id 
                        ? 'bg-primary/10 border-2 border-primary' 
                        : 'bg-primary/5 border border-primary/20 hover:border-primary/40'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-2">{track.icon}</div>
                    <div className="text-sm font-serif-sc text-primary">{track.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 已选音乐信息 */}
            {selectedMusic && (
              <motion.div 
                className="mt-6 p-4 bg-primary/5 rounded-lg text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-primary/60 text-xs">
                  已选择：{selectedMusic.name} · {selectedMusic.description}
                </p>
              </motion.div>
            )}

            {/* 开始按钮 */}
            <button
              onClick={startMeditation}
              disabled={!selectedMusic}
              className={`mt-8 px-8 py-3 rounded-full font-serif-sc tracking-widest transition-all ${
                selectedMusic 
                  ? 'bg-primary hover:bg-primary/90 text-white' 
                  : 'bg-primary/20 text-primary/40 cursor-not-allowed'
              }`}
            >
              开始冥想
            </button>
          </motion.div>
        )}

        {/* ==================== 冥想阶段 ==================== */}
        {stage === 'meditation' && (
          <motion.div
            key="meditation"
            className="z-10 flex flex-col items-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 音乐控制 */}
            {selectedMusic && (
              <motion.button
                onClick={togglePlay}
                className="absolute top-6 right-6 p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <span className="text-lg">{isPlaying ? '🔊' : '🔇'}</span>
              </motion.button>
            )}

            {/* 呼吸引导 */}
            <motion.p 
              className="text-2xl font-serif-sc tracking-widest text-primary drop-shadow-sm"
              key={phase}
              initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.9 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
              transition={{ duration: 1.5 }}
            >
              {phase}
            </motion.p>

            {/* 计时器 */}
            <p className="mt-8 font-mono text-primary/50 text-sm tracking-widest">
              {formatTime(timeLeft)}
            </p>

            {/* 当前音乐 */}
            {selectedMusic && (
              <div className="absolute top-6 left-6 flex items-center gap-2 text-primary/40 text-xs">
                <span>{selectedMusic.icon}</span>
                <span className="font-serif-sc">{selectedMusic.name}</span>
              </div>
            )}

            {/* 跳过按钮 */}
            <button 
              onClick={() => setIsSkipping(true)}
              disabled={isSkipping}
              className="absolute bottom-10 px-6 py-2.5 rounded-full bg-primary/5 hover:bg-primary/10 text-xs text-primary/50 hover:text-primary/80 transition-colors tracking-widest font-serif-sc disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSkipping ? (
                isReady ? "即将展现..." : "正在凝结画作..."
              ) : (
                isGenerating ? "正在生成画作..." : "提前结束冥想"
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
