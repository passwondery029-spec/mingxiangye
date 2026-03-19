import { motion } from 'motion/react';
import { useState } from 'react';

interface SowingPageProps {
  key?: string;
  onSow: (obsession: string) => void;
  onGoGallery: () => void;
}

export default function SowingPage({ onSow, onGoGallery }: SowingPageProps) {
  const [text, setText] = useState('');
  const [isSowing, setIsSowing] = useState(false);

  const handleSow = () => {
    if (!text.trim()) return;
    setIsSowing(true);
    setTimeout(() => {
      onSow(text);
    }, 2000); // 2 seconds for the seed animation
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center relative px-6 bg-bg-main"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {!isSowing ? (
        <motion.div className="w-full max-w-md flex flex-col items-center z-10"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        >
          <div className="relative flex flex-col items-center w-full mb-12">
            {/* Ink Wash Lotus Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10">
              <svg viewBox="0 0 512 512" className="w-[18rem] h-[18rem] text-primary opacity-[0.06]" fill="currentColor">
                <path d="M256,48 C270,120 320,180 256,280 C192,180 242,120 256,48 Z" />
                <path d="M256,280 C220,240 150,200 80,220 C130,260 200,280 256,280 Z" />
                <path d="M256,280 C292,240 362,200 432,220 C382,260 312,280 256,280 Z" />
                <path d="M256,280 C210,210 120,140 60,120 C120,170 200,230 256,280 Z" />
                <path d="M256,280 C302,210 392,140 452,120 C392,170 312,230 256,280 Z" />
                <path d="M256,280 C230,320 180,350 120,360 C180,340 230,310 256,280 Z" />
                <path d="M256,280 C282,320 332,350 392,360 C332,340 282,310 256,280 Z" />
              </svg>
            </div>
            <h1 className="text-3xl font-serif-sc tracking-widest text-primary relative z-10">一念生花</h1>
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="写下你此刻的执念、焦虑或愿望..."
            className="w-full bg-transparent border-b border-primary/20 text-center text-lg font-serif-sc p-4 focus:outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-primary/40 text-primary"
            rows={3}
          />
          
          <button 
            onClick={handleSow}
            disabled={!text.trim()}
            className="mt-10 px-10 py-3.5 rounded-full bg-primary text-white shadow-sm hover:shadow-md hover:bg-primary/90 transition-all tracking-widest font-serif-sc disabled:opacity-40 disabled:shadow-none cursor-pointer"
          >
            化作种子
          </button>

          <p className="mt-6 text-xs text-primary/40 font-serif-sc tracking-widest text-center">
            播下种子后，将开启一段 7 分钟的静心冥想
          </p>

          <button onClick={onGoGallery} className="absolute bottom-10 px-6 py-2.5 rounded-full bg-primary/5 hover:bg-primary/10 text-sm text-primary/60 hover:text-primary/90 transition-colors tracking-widest cursor-pointer whitespace-nowrap">
            心境图鉴
          </button>
        </motion.div>
      ) : (
        <motion.div 
          className="z-10 flex flex-col items-center"
          initial={{ scale: 1 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
           <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_30px_10px_rgba(74,108,111,0.4)]" />
        </motion.div>
      )}
    </motion.div>
  );
}
