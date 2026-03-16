import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string, isBackground = false) => {
    try {
      if (!isBackground && !profile) {
        setLoading(true);
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle(); // Changed from .single() to .maybeSingle() to handle missing profiles gracefully
      
      if (error) throw error;
      
      if (data) {
        setProfile(data);
        localStorage.setItem('user_profile', JSON.stringify(data));
      } else {
        // Fallback: if no profile found, set a basic one to avoid breaking the UI
        console.warn('Profile not found for user:', uid);
        const fallbackProfile = { 
          id: uid, 
          full_name: user?.email?.split('@')[0] || 'Guerreiro', 
          role: 'student' 
        };
        setProfile(fallbackProfile);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      if (!isBackground) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // 1. Optimistic Load: Try to get profile from localStorage immediately
    const cachedProfile = localStorage.getItem('user_profile');
    let hasOptimisticProfile = false;
    if (cachedProfile) {
      try {
        const parsed = JSON.parse(cachedProfile);
        setProfile(parsed);
        hasOptimisticProfile = true;
        // If we have a cached profile, we can stop the initial spinner earlier
        setLoading(false);
      } catch (e) {
        console.error('Error parsing cached profile:', e);
      }
    }

    // Get initial session
    const setupInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          // 2. Background Refresh: If we have an optimistic profile, fetch the latest in background
          // Otherwise, fetch it normally (will show spinner)
          await fetchProfile(currentUser.id, hasOptimisticProfile);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in initial session setup:', err);
        setLoading(false);
      }
    };

    setupInitialSession();

    // 3. Shorter Safety Timeout (3s instead of 8s)
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        setSession(session);
        const currentUser = session?.user ?? null;
        
        setUser(currentUser);
        
        if (currentUser) {
          // Only show loading if we don't have any profile data yet
          if (!profile && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
            setLoading(true);
          }
          await fetchProfile(currentUser.id, !!profile);
        } else {
          setProfile(null);
          localStorage.removeItem('user_profile');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
