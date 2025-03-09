import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile, getUserProfile } from '@/utils/supabaseClient';
import config from '@/utils/config';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isSupabaseAvailable: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

// Create a default mock implementation for SSR/SSG
const defaultAuthContext: AuthContextType = {
  user: null,
  profile: null,
  session: null,
  isLoading: false,
  isSupabaseAvailable: false,
  signIn: async () => ({ error: new Error('Auth not initialized') }),
  signUp: async () => ({ error: new Error('Auth not initialized') }),
  signOut: async () => {},
  refreshProfile: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Check if Supabase is properly initialized
const checkSupabaseAvailability = () => {
  try {
    return typeof supabase.auth !== 'undefined' && 
           typeof supabase.from === 'function' && 
           typeof supabase.auth.signInWithPassword === 'function';
  } catch (error) {
    console.error('Supabase client initialization error:', error);
    return false;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(checkSupabaseAvailability());

  useEffect(() => {
    if (!isSupabaseAvailable) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        getUserProfile(session.user.id).then(profile => {
          setProfile(profile);
        });
      }
      
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profile = await getUserProfile(session.user.id);
          setProfile(profile);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [isSupabaseAvailable]);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseAvailable) {
      return { error: new Error('Supabase client is not available') };
    }

    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    setIsLoading(false);
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseAvailable) {
      return { error: new Error('Supabase client is not available') };
    }

    setIsLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${config.site.baseUrl}/auth/callback`,
      }
    });
    
    setIsLoading(false);
    return { error };
  };

  const signOut = async () => {
    if (!isSupabaseAvailable) {
      return;
    }

    setIsLoading(true);
    await supabase.auth.signOut();
    setIsLoading(false);
  };

  const refreshProfile = async () => {
    if (user && isSupabaseAvailable) {
      const profile = await getUserProfile(user.id);
      setProfile(profile);
    }
  };

  const value = {
    user,
    profile,
    session,
    isLoading,
    isSupabaseAvailable,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  // Use the context, but don't throw an error if it's not available
  // This allows the hook to be used during SSR/SSG
  const context = useContext(AuthContext);
  return context;
} 