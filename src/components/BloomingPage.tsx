import { motion } from 'motion/react';
import { ArtPiece } from '../App';

interface BloomingPageProps {
  key?: string;
  artPiece: ArtPiece;
  onSave: (artPiece: ArtPiece) => void;
  onDiscard: () => void;
}

export default function BloomingPage({ artPiece, onSave, onDiscard }: BloomingPageProps) {
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center relative px-6 py-12 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
    >
      {/* Dramatic background glow */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,108,111,0.05),transparent_70%)] pointer-events-none" 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
      />

      <div className="max-w-2xl w-full flex flex-col items-center z-10">
        <div 
          className="w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(74,108,111,0.1)] mb-10 relative bg-secondary"
        >
          {/* Blank canvas texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] opacity-40 mix-blend-multiply" />
          
          {/* The revealed image with clip-path wipe effect */}
          <motion.div
            className="absolute inset-0"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 3.5, ease: "easeInOut", delay: 0.5 }}
          >
            {artPiece.imageBase64 ? (
              <img src={artPiece.imageBase64} alt="Healing Art" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                <p className="text-primary/40 font-serif-sc">画作未能显现，但心意已达。</p>
              </div>
            )}
            {/* subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#4a6c6f]/20 via-transparent to-transparent mix-blend-multiply" />
          </motion.div>

          {/* Glowing brush tip moving across */}
          <motion.div
            className="absolute top-[-20%] bottom-[-20%] w-32 pointer-events-none mix-blend-multiply"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(74,108,111,0.4) 0%, rgba(74,108,111,0.1) 40%, transparent 70%)',
              filter: 'blur(15px)'
            }}
            initial={{ left: '-20%', opacity: 0 }}
            animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.5, ease: "easeInOut", delay: 0.5 }}
          />
        </div>

        <motion.div 
          className="text-center space-y-4 mb-12 relative"
          initial={{ y: 20, opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, delay: 3.5 }} // Delayed until brush finishes
        >
          <p className="text-primary/80 text-lg md:text-xl font-serif-sc mb-6 tracking-[0.3em]">{artPiece.title}</p>
          {artPiece.poem.split(/\n|\\n/).map((line, i) => (
            <p key={i} className="text-xl md:text-2xl font-serif-sc tracking-[0.2em] text-primary leading-loose drop-shadow-sm">
              {line}
            </p>
          ))}
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full px-8 sm:px-0 sm:w-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 4.5 }} // Delayed until poem finishes
        >
          <button 
            onClick={() => onSave(artPiece)}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-full bg-primary hover:bg-primary/90 text-white transition-all font-serif-sc tracking-widest shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap text-sm sm:text-base"
          >
            收录心境图鉴
          </button>
          <button 
            onClick={onDiscard}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-full border border-primary/20 bg-transparent hover:bg-primary/5 text-primary/60 hover:text-primary transition-all font-serif-sc tracking-widest cursor-pointer whitespace-nowrap text-sm sm:text-base"
          >
            随风散去
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
