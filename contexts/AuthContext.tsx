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
  signIn: (email: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if Supabase is properly initialized
const checkSupabaseAvailability = () => {
  try {
    return typeof supabase.auth !== 'undefined' && typeof supabase.from === 'function';
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

  const signIn = async (email: string) => {
    if (!isSupabaseAvailable) {
      return { error: new Error('Supabase client is not available') };
    }

    setIsLoading(true);
    
    // Use the site URL from config
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${config.site.baseUrl}/auth/callback`,
      },
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
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 