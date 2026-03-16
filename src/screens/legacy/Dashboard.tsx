import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, TrendingUp, PlayCircle, Star, Clock } from '../icons';
import BottomNav from '../components/BottomNav';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-dark min-h-screen flex flex-col text-white">
      <header className="flex items-center p-4 sticky top-0 z-50 border-b border-border-dark bg-background-dark/90 backdrop-blur-md">
        <div className="flex size-10 shrink-0 items-center overflow-hidden rounded-full mr-3 border-2 border-primary">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover size-full"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAyLoDGh-Tt9ZebKP2Hb2h-w7piLur8tbIxTZG8byQS7LEnkpy05vn-xv3Wr_5SSex_W80uJ6RKeAONZ-QbNbHJI4Em8uXwYaFhYlLYjNLw1JQuXQGgxl8fvHhiQzPCVT_G00l_UKf-uLovOs-8q01RhsPBS7448shU2Y6Ug6zZ1n4Rz9SBQFRlfNDQdbYcaHVEt_7RgRG_Zq-wlFie09ZyVikLstL0LkI3HS7RJ0Hxt767QYD-Wgx2_zDXkeQAY6Dt_P1SxHpntCs")' }}
          />
        </div>
        <h2 className="text-lg font-bold flex-1">Painel</h2>
        <button 
          onClick={() => navigate('/notifications')}
          className="p-2 rounded-full hover:bg-primary/10 text-white"
        >
          <Bell size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <section className="p-4 pt-6">
          <p className="text-primary text-sm font-medium uppercase tracking-wider">Bem-vindo de volta</p>
          <h1 className="text-3xl font-bold leading-tight">Osu, Alex!</h1>
          <p className="text-slate-400">Faixa Marrom • Jiu-Jitsu Brasileiro</p>
        </section>

        <section className="px-4 py-2 flex gap-3 overflow-x-auto no-scrollbar">
          <button onClick={() => navigate('/schedule')} className="flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-2xl bg-card-dark border border-border-dark hover:border-primary transition-all group">
            <Calendar size={32} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-center">Agendar Aula</span>
          </button>
          <button className="flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-2xl bg-card-dark border border-border-dark hover:border-primary transition-all group">
            <TrendingUp size={32} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-center">Meu Progresso</span>
          </button>
          <button onClick={() => navigate('/videos')} className="flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-2xl bg-card-dark border border-border-dark hover:border-primary transition-all group">
            <PlayCircle size={32} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-center">Tutoriais</span>
          </button>
        </section>

        <section className="p-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">Próxima Aula</h3>
            <button onClick={() => navigate('/schedule')} className="text-primary text-sm font-semibold hover:underline">Ver Todas</button>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-card-dark border border-border-dark">
            <div 
              className="w-full aspect-[16/7] bg-center bg-cover opacity-80"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCenTU7-166VDlRsxdDHXT7ZPRRFY1Ko5gn6YOiRKMN3pANl9w-3-4epz6tQevkmtXc9EOri9ImxOk1vsOoHTybPfR4Hk5jt9p0STZ0OcQ9z7uGdiKhvELT6zIJ_XwIcJCiyMu0BRXAiV2KBkVfx_4oVfd9io9y0R-NvlL_2f8O05cO7xLDx8iiHI7Cj-FOxYRvxmNsAvtWLvj-bSITqelvZvDgcyYrNxy7BmwIFmMMRQvZOG9h1cjaAkxg1h3GvgoCRhfp9QWpZIw")' }}
            />
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                <p className="text-primary text-xs font-bold uppercase tracking-widest">Começa em 1h 45m</p>
              </div>
              <p className="text-xl font-bold">Grappling No-Gi Avançado</p>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock size={16} />
                <p className="text-sm">Hoje às 18:30</p>
              </div>
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-border-dark">
                <div className="flex items-center gap-2">
                  <div 
                    className="size-8 rounded-full bg-cover bg-center border border-border-dark"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCw4DksTN5fvChpPJk01YnZ8geeJpzqEYAGvIRSfn_9t7rdT7pl6omCnr7pY4aRBZalOfGpAnDXu_wo0uwzT46zL5ZLmAxUacADTNfkfxEEOGKhEJDrOBbGAQUD22d7UrsshOyOqKQywmaqeWObWiN7R8fQePC6C4hqPvtUfkF08pV8VGKHkCSNVRPQCsxL7gTv7xqH4ohBJjUsfJbORvtnCkRQQxunNYmZH9E-CJcEaOlwpVPGDbFUaIE84G4Zgw1hg27sTUG2vzA")' }}
                  />
                  <p className="text-sm font-medium">Professor Silva</p>
                </div>
                <button className="h-9 px-4 bg-primary text-white text-sm font-bold rounded-lg shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                  Check-in
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-4">
          <h3 className="text-lg font-bold mb-3">Sua Semana</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card-dark p-4 rounded-2xl border border-border-dark">
              <p className="text-slate-500 text-xs font-medium uppercase mb-1">Aulas Frequentadas</p>
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-[10px] text-green-500 mt-1 flex items-center gap-1">
                <TrendingUp size={12} /> +2 em relação ao mês passado
              </p>
            </div>
            <div className="bg-card-dark p-4 rounded-2xl border border-border-dark">
              <p className="text-slate-500 text-xs font-medium uppercase mb-1">Sequência Atual</p>
              <p className="text-2xl font-bold text-primary">5 Dias</p>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-1 flex-1 rounded-full bg-primary" />)}
                {[6, 7].map(i => <div key={i} className="h-1 flex-1 rounded-full bg-slate-700" />)}
              </div>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
