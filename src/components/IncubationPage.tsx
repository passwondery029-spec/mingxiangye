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

  // 引导步骤自动推进
  useEffect(() => {
    if (stage !== 'guide') return;
    if (currentStep < GUIDE_STEPS.length - 1) {
      const timer = setTimeout(() => setCurrentStep(s => s + 1), 3000);
      return () => clearTimeout(timer);
    }
  }, [stage, currentStep]);

  // 开始冥想
  const startMeditation = () => {
    setStage('meditation');
    
    // 开始播放音乐
    if (selectedMusic && audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
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

      {/* 隐藏的音频元素 */}
      <audio ref={audioRef} loop preload="none">
        {/* 音频源需要替换为实际音频文件 */}
        <source src={`/audio/${selectedMusic?.id}.mp3`} type="audio/mpeg" />
      </audio>

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
              <div className="grid grid-cols-4 gap-2">
                {MUSIC_TRACKS.filter(t => t.type === 'guided').map(track => (
                  <motion.button
                    key={track.id}
                    onClick={() => setSelectedMusic(track)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      selectedMusic?.id === track.id 
                        ? 'bg-primary/10 border-2 border-primary' 
                        : 'bg-primary/5 border border-primary/20 hover:border-primary/40'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-xl mb-1">{track.icon}</div>
                    <div className="text-xs font-serif-sc text-primary truncate">{track.name}</div>
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
