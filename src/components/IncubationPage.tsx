import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { generateHealingContent } from '../services/geminiService';
import { ArtPiece } from '../App';

interface IncubationPageProps {
  key?: string;
  obsession: string;
  onComplete: (artPiece: ArtPiece) => void;
}

export default function IncubationPage({ obsession, onComplete }: IncubationPageProps) {
  const [phase, setPhase] = useState('吸气');
  const [timeLeft, setTimeLeft] = useState(420); // 7 minutes
  const [artPiece, setArtPiece] = useState<ArtPiece | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  useEffect(() => {
    // Breathing cycle
    const interval = setInterval(() => {
      setPhase(p => p === '吸气' ? '呼气' : '吸气');
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Timer
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
  }, []);

  useEffect(() => {
    // Start generation in background
    generateHealingContent(obsession).then(result => {
      setArtPiece({
        id: Date.now().toString(),
        obsession,
        title: result.title,
        poem: result.poem,
        imageBase64: result.imageBase64,
        date: new Date().toISOString()
      });
      setIsReady(true);
    }).catch(err => {
      console.error("Incubation error:", err);
      setArtPiece({
        id: Date.now().toString(),
        obsession,
        title: "心如止水",
        poem: "心如止水，\n万物生辉。\n执念散去，\n清风徐来。",
        imageBase64: "", // Fallback
        date: new Date().toISOString()
      });
      setIsReady(true);
    });
  }, [obsession]);

  useEffect(() => {
    if ((timeLeft === 0 || isSkipping) && isReady && artPiece) {
      onComplete(artPiece);
    }
  }, [timeLeft, isSkipping, isReady, artPiece, onComplete]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-bg-main"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] opacity-20 pointer-events-none" />

      {/* Clean Zen Water Ripples Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Colored Ambient Lights */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 mix-blend-multiply">
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
          <motion.div
            className="absolute top-[40%] right-[30%] w-[50vw] h-[50vw] rounded-full bg-[#BA999C] blur-[100px]"
            animate={{ x: [0, 30, -40, 0], y: [0, 20, -50, 0], scale: [1, 1.4, 0.8, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Soft central breathing glow */}
        <motion.div
          className="absolute w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Expanding ripples */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/40"
            initial={{ width: '5vw', height: '5vw', opacity: 0.8, borderWidth: '4px' }}
            animate={{ width: '150vw', height: '150vw', opacity: 0, borderWidth: '1px' }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              delay: i * 4, 
              ease: "easeOut" 
            }}
          />
        ))}
      </div>

      <div className="z-10 flex flex-col items-center w-full">
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

        <p className="mt-8 font-mono text-primary/50 text-sm tracking-widest">
          {formatTime(timeLeft)}
        </p>

        {/* Skip button */}
        <button 
          onClick={() => setIsSkipping(true)}
          disabled={isSkipping}
          className="absolute bottom-10 px-6 py-2.5 rounded-full bg-primary/5 hover:bg-primary/10 text-xs text-primary/50 hover:text-primary/80 transition-colors tracking-widest font-serif-sc disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isSkipping ? (isReady ? "即将展现..." : "正在为您凝结画作...") : "提前结束冥想"}
        </button>
      </div>
    </motion.div>
  );
}
