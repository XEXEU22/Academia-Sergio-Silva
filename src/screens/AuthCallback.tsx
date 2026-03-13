import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Escuta por mudanças na autenticação (especialmente o login via link de e-mail)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        // Redireciona para o dashboard assim que o login for confirmado
        // Reduzido o delay para 300ms apenas para o feedback visual de "Validando" ser perceptível mas não irritante
        setTimeout(() => {
          navigate('/dashboard');
        }, 300);
      }
    });

    // Se após 5 segundos nada acontecer, volta para o login
    const timeout = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-dark text-white font-display">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/20 rounded-full blur-[140px] animate-pulse" />
      </div>
      
      <div className="relative z-10 text-center px-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-8 shadow-2xl shadow-primary/20" />
        <h1 className="text-2xl font-black italic tracking-tighter mb-4 uppercase">Validando Identidade</h1>
        <p className="text-slate-400 text-sm font-medium tracking-wide max-w-[280px] mx-auto uppercase leading-relaxed">
          Prepare-se, Guerreiro. <br /> Seu acesso está sendo liberado...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
