import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Calendar, Video, User, Bell, Image as ImageIcon, Dumbbell, Zap } from '../icons';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Início', icon: Home },
    { path: '/schedule', label: 'Agenda', icon: Calendar },
    { path: '/videos', label: 'Treinos', icon: Zap },
    { path: '/instructor', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] border-t border-border-dark bg-background-dark/80 backdrop-blur-3xl px-6 pb-10 pt-5">
      <div className="flex justify-between items-center max-w-sm mx-auto relative">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-2 group outline-none"
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -top-3 -bottom-3 -left-4 -right-4 bg-primary/10 rounded-2xl border border-primary/20 z-0"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className={`relative z-10 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-slate-600 group-hover:text-slate-300'}`}>
                <Icon size={22} strokeWidth={isActive ? 3 : 2} className={isActive ? 'fill-current/10' : ''} />
              </div>
              
              <p className={`relative z-10 text-[9px] uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? 'font-black text-primary' : 'font-bold text-slate-600 group-hover:text-slate-400'}`}>
                {item.label}
              </p>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
