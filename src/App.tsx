/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import SowingPage from './components/SowingPage';
import IncubationPage from './components/IncubationPage';
import BloomingPage from './components/BloomingPage';
import GalleryPage from './components/GalleryPage';

export type ViewState = 'sowing' | 'incubation' | 'blooming' | 'gallery';

export interface ArtPiece {
  id: string;
  obsession: string;
  title: string;
  poem: string;
  imageBase64: string;
  date: string;
}

export default function App() {
  const [view, setView] = useState<ViewState>('sowing');
  const [obsession, setObsession] = useState('');
  const [currentArt, setCurrentArt] = useState<ArtPiece | null>(null);
  const [gallery, setGallery] = useState<ArtPiece[]>([]);

  const handleSow = (text: string) => {
    setObsession(text);
    setView('incubation');
  };

  const handleIncubationComplete = (artPiece: ArtPiece) => {
    setCurrentArt(artPiece);
    setView('blooming');
  };

  const handleSaveArt = (artPiece: ArtPiece) => {
    setGallery(prev => [artPiece, ...prev]);
    setView('gallery');
  };

  const handleDiscardArt = () => {
    setView('sowing');
    setObsession('');
    setCurrentArt(null);
  };

  return (
    <div className="bg-bg-main min-h-screen text-primary selection:bg-primary/20">
      <AnimatePresence mode="wait">
        {view === 'sowing' && (
          <SowingPage 
            key="sowing" 
            onSow={handleSow} 
            onGoGallery={() => setView('gallery')} 
          />
        )}
        {view === 'incubation' && (
          <IncubationPage 
            key="incubation" 
            obsession={obsession} 
            onComplete={handleIncubationComplete} 
          />
        )}
        {view === 'blooming' && currentArt && (
          <BloomingPage 
            key="blooming" 
            artPiece={currentArt} 
            onSave={handleSaveArt} 
            onDiscard={handleDiscardArt} 
          />
        )}
        {view === 'gallery' && (
          <GalleryPage 
            key="gallery" 
            gallery={gallery} 
            onBack={() => setView('sowing')} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
