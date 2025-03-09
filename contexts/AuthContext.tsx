import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile, getUserProfile, createUserProfileIfNotExists } from '@/utils/supabaseClient';
import config from '@/utils/config';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isSupabaseAvailable: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string) => Promise<{ error: any | null, user: User | null }>;
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
  signUp: async () => ({ error: new Error('Auth not initialized'), user: null }),
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
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Get or create profile
          const profile = await getUserProfile(session.user.id);
          if (!profile) {
            // Create profile if it doesn't exist
            const newProfile = await createUserProfileIfNotExists(session.user.id);
            setProfile(newProfile);
          } else {
            setProfile(profile);
          }
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
    console.log('Signing in with email/password:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Sign in error:', error);
    } else {
      console.log('Sign in successful:', data.user?.email);
      
      // Ensure profile exists
      if (data.user) {
        await createUserProfileIfNotExists(data.user.id);
      }
    }
    
    setIsLoading(false);
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseAvailable) {
      return { error: new Error('Supabase client is not available'), user: null };
    }

    setIsLoading(true);
    console.log('Signing up with email/password:', email);
    
    // First, check if the user already exists
    const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (!checkError && existingUser.user) {
      console.log('User already exists, signing in:', email);
      
      // Ensure profile exists
      await createUserProfileIfNotExists(existingUser.user.id);
      
      setIsLoading(false);
      return { error: null, user: existingUser.user };
    }
    
    // Create a new user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Skip email verification for simplicity
        emailRedirectTo: `${config.site.baseUrl}/auth/callback`,
        data: {
          display_name: email.split('@')[0] // Use part of email as display name
        }
      }
    });
    
    if (error) {
      console.error('Sign up error:', error);
      setIsLoading(false);
      return { error, user: null };
    }
    
    console.log('Sign up successful:', data.user?.email);
    
    // Create a profile for the new user
    if (data.user) {
      try {
        // Create profile
        await createUserProfileIfNotExists(data.user.id, email.split('@')[0]);
      } catch (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }
    
    setIsLoading(false);
    return { error, user: data.user };
  };

  const signOut = async () => {
    if (!isSupabaseAvailable) {
      return;
    }

    setIsLoading(true);
    console.log('Signing out');
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