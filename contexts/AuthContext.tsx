import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile, getUserProfile, createUserProfileIfNotExists } from '@/utils/supabaseClient';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string) => Promise<{ error: any | null, user: User | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

// Create a default context
const defaultAuthContext: AuthContextType = {
  user: null,
  profile: null,
  session: null,
  isLoading: false,
  signIn: async () => ({ error: new Error('Auth not initialized') }),
  signUp: async () => ({ error: new Error('Auth not initialized'), user: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth
  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
        return;
      }
      
      const currentSession = data.session;
      
      if (currentSession) {
        // Set session and user
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Get profile
        getUserProfile(currentSession.user.id).then(userProfile => {
          if (userProfile) {
            setProfile(userProfile);
          }
          setIsLoading(false);
        }).catch(err => {
          console.error('Error getting profile:', err);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
          
          // Get or create profile
          const userProfile = await getUserProfile(newSession.user.id);
          if (userProfile) {
            setProfile(userProfile);
          } else {
            const newProfile = await createUserProfileIfNotExists(newSession.user.id);
            setProfile(newProfile);
          }
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      }
    );

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
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
      
      // Auth state change listener will handle updating state
      setIsLoading(false);
      return { error: null };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      setIsLoading(false);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Create a new user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign up error:', error);
        setIsLoading(false);
        return { error, user: null };
      }
      
      // Create a profile for the new user if we have a session
      if (data.user && data.session) {
        try {
          const newProfile = await createUserProfileIfNotExists(data.user.id, email.split('@')[0]);
          setProfile(newProfile);
        } catch (profileError) {
          console.error('Error creating profile:', profileError);
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
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // Auth state change listener will handle updating state
      setIsLoading(false);
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const userProfile = await getUserProfile(user.id);
      if (userProfile) {
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 