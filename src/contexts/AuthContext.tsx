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

  const fetchProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      
      if (error) throw error;
      setProfile(data);
      // Cache the profile
      localStorage.setItem('user_profile', JSON.stringify(data));
    } catch (err) {
      console.error('Error fetching profile:', err);
      // Don't clear profile if we have a cached version and fetch fails (offline/error)
    }
  };

  useEffect(() => {
    // Load cached profile if available
    const cachedProfile = localStorage.getItem('user_profile');
    if (cachedProfile) {
      try {
        setProfile(JSON.parse(cachedProfile));
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
          await fetchProfile(currentUser.id);
        }
      } catch (err) {
        console.error('Error in initial session setup:', err);
      } finally {
        setLoading(false);
      }
    };

    setupInitialSession();

    // Safety timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 8000); // 8 seconds safety cap

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        setSession(session);
        const currentUser = session?.user ?? null;
        
        // Update user state first for responsiveness
        setUser(currentUser);
        
        if (currentUser) {
          // If it's a new sign in or profile is missing, set loading
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || !profile) {
            setLoading(true);
          }
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
          localStorage.removeItem('user_profile');
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
      } finally {
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
