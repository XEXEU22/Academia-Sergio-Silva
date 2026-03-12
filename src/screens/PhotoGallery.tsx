import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Image as ImageIcon } from '../icons';
import BottomNav from '../components/BottomNav';

const PhotoGallery: React.FC = () => {
  const navigate = useNavigate();

  const photos = [
    { category: 'Muay Thai', url: 'https://picsum.photos/seed/mt1/400/400' },
    { category: 'Karatê', url: 'https://picsum.photos/seed/k1/400/400' },
    { category: 'Wing Chun', url: 'https://picsum.photos/seed/wc1/400/400' },
    { category: 'Muay Thai', url: 'https://picsum.photos/seed/mt2/400/400' },
    { category: 'Karatê', url: 'https://picsum.photos/seed/k2/400/400' },
    { category: 'Academia', url: 'https://picsum.photos/seed/ac1/400/400' },
  ];

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-white">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-border-dark">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto w-full">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
            <ChevronLeft size={24} className="text-white" />
          </button>
          <h2 className="text-lg font-bold flex-1 text-center">Galeria de Fotos</h2>
          <div className="size-10" />
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full pb-24">
        <div className="flex gap-3 p-4 overflow-x-auto no-scrollbar">
          {['Todos', 'Muay Thai', 'Karatê', 'Wing Chun', 'Jiu-Jitsu'].map((filter, i) => (
            <button key={filter} className={`h-11 shrink-0 px-6 rounded-xl text-sm font-bold transition-all border ${
              i === 0 ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-card-dark border-border-dark text-slate-400 hover:border-primary/50'
            }`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 p-4">
          {photos.map((photo, i) => (
            <div key={i} className="group relative flex flex-col gap-2">
              <div 
                className="w-full aspect-square bg-cover bg-center rounded-2xl shadow-xl border border-border-dark overflow-hidden transition-transform group-hover:scale-[1.02]"
                style={{ backgroundImage: `url("${photo.url}")` }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              </div>
              <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-background-dark/80 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{photo.category}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default PhotoGallery;
