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
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }
        
        const currentSession = data.session;
        console.log('Initial session:', currentSession ? 'Found' : 'None');
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          console.log('User found in session:', currentSession.user.email);
          setUser(currentSession.user);
          
          // Get or create profile
          const userProfile = await getUserProfile(currentSession.user.id);
          if (userProfile) {
            console.log('Profile found for user');
            setProfile(userProfile);
          } else {
            console.log('Creating profile for user');
            const newProfile = await createUserProfileIfNotExists(currentSession.user.id);
            setProfile(newProfile);
          }
        } else {
          console.log('No user in session');
          setUser(null);
          setProfile(null);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };
    
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.email);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Get or create profile
          const profile = await getUserProfile(newSession.user.id);
          if (!profile) {
            // Create profile if it doesn't exist
            console.log('Creating profile for user after auth change');
            const newProfile = await createUserProfileIfNotExists(newSession.user.id);
            setProfile(newProfile);
          } else {
            console.log('Profile found for user after auth change');
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
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error);
        setIsLoading(false);
        return { error };
      }
      
      console.log('Sign in successful:', data.user?.email);
      console.log('Session established:', !!data.session);
      
      // Ensure profile exists
      if (data.user) {
        try {
          await createUserProfileIfNotExists(data.user.id);
        } catch (profileError) {
          console.error('Error ensuring profile exists:', profileError);
          // Continue anyway, as authentication was successful
        }
      }
      
      setIsLoading(false);
      return { error: null };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      setIsLoading(false);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseAvailable) {
      return { error: new Error('Supabase client is not available'), user: null };
    }

    setIsLoading(true);
    console.log('Signing up with email/password:', email);
    
    try {
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
      console.log('Session established:', !!data.session);
      
      // Create a profile for the new user
      if (data.user) {
        try {
          // Wait a moment for the auth to propagate
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Create profile
          await createUserProfileIfNotExists(data.user.id, email.split('@')[0]);
        } catch (profileError) {
          console.error('Error creating profile:', profileError);
          // Continue anyway, as authentication was successful
        }
      }
      
      setIsLoading(false);
      return { error: null, user: data.user };
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      setIsLoading(false);
      return { error, user: null };
    }
  };

  const signOut = async () => {
    if (!isSupabaseAvailable) {
      return;
    }

    setIsLoading(true);
    console.log('Signing out');
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        console.log('Sign out successful');
        // Clear user and profile state
        setUser(null);
        setProfile(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user && isSupabaseAvailable) {
      try {
        const profile = await getUserProfile(user.id);
        setProfile(profile);
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
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