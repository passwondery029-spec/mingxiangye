import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { ArtPiece } from '../App';

interface GalleryPageProps {
  key?: string;
  gallery: ArtPiece[];
  onBack: () => void;
}

export default function GalleryPage({ gallery, onBack }: GalleryPageProps) {
  return (
    <motion.div 
      className="min-h-screen bg-bg-main px-6 py-12 md:py-20"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 hover:bg-primary/10 text-primary/70 hover:text-primary transition-colors mb-12 font-serif-sc tracking-widest cursor-pointer"
        >
          <ArrowLeft size={18} />
          返回
        </button>

        <h2 className="text-3xl font-serif-sc text-primary tracking-[0.2em] mb-16 text-center">心境图鉴</h2>

        {gallery.length === 0 ? (
          <div className="text-center text-primary/40 font-serif-sc py-20">
            卷轴尚空，待君播种。
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallery.map((item) => (
              <motion.div 
                key={item.id}
                className="bg-secondary rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-[0_15px_35px_rgba(74,108,111,0.1)] transition-all duration-500 border border-primary/10 flex flex-col"
                whileHover={{ y: -5 }}
              >
                <div className="aspect-square relative overflow-hidden">
                  {item.imageBase64 ? (
                    <img src={item.imageBase64} alt="Art" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-primary/5" />
                  )}
                  {/* Subtle inner shadow for depth */}
                  <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(74,108,111,0.05)] pointer-events-none" />
                </div>
                <div className="p-5 bg-menu flex flex-col flex-grow">
                  <p className="text-primary font-serif-sc text-lg mb-1 truncate">{item.title}</p>
                  <p className="text-primary/60 text-xs truncate">执念：{item.obsession}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
