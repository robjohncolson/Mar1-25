import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Profile, getUserProfile, createUserProfileIfNotExists } from '@/utils/supabaseClient';

type NextAuthContextType = {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
  } | null;
  profile: Profile | null;
  isLoading: boolean;
  signInWithCredentials: (email: string, password: string) => Promise<{ error: any | null }>;
  signUpWithCredentials: (email: string, password: string) => Promise<{ error: any | null, user: any | null }>;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

// Create a default context
const defaultNextAuthContext: NextAuthContextType = {
  user: null,
  profile: null,
  isLoading: false,
  signInWithCredentials: async () => ({ error: new Error('Auth not initialized') }),
  signUpWithCredentials: async () => ({ error: new Error('Auth not initialized'), user: null }),
  signOutUser: async () => {},
  refreshProfile: async () => {},
};

const NextAuthContext = createContext<NextAuthContextType>(defaultNextAuthContext);

export function NextAuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(status === 'loading');

  // Load profile when session changes
  useEffect(() => {
    if (session?.user?.id) {
      loadUserProfile(session.user.id);
    } else {
      setProfile(null);
    }
    
    setIsLoading(status === 'loading');
  }, [session, status]);

  const loadUserProfile = async (userId: string) => {
    try {
      const userProfile = await getUserProfile(userId);
      if (userProfile) {
        setProfile(userProfile);
      } else {
        // Create profile if it doesn't exist
        const newProfile = await createUserProfileIfNotExists(userId);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signInWithCredentials = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      setIsLoading(false);
      
      if (result?.error) {
        return { error: new Error(result.error) };
      }
      
      return { error: null };
    } catch (error) {
      setIsLoading(false);
      return { error };
    }
  };

  // For signup, we'll use our custom API endpoint
  const signUpWithCredentials = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Call our API to create a user
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setIsLoading(false);
        return { error: new Error(data.error), user: null };
      }
      
      // If email confirmation is required, return success but don't sign in
      if (data.user && !data.user.emailConfirmed) {
        setIsLoading(false);
        return { error: null, user: { ...data.user, email_confirmed_at: null } };
      }
      
      // If email is already confirmed, sign in the user
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      setIsLoading(false);
      
      if (result?.error) {
        return { error: new Error(result.error), user: null };
      }
      
      return { error: null, user: data.user };
    } catch (error) {
      console.error('Error during sign up:', error);
      setIsLoading(false);
      return { error, user: null };
    }
  };

  const signOutUser = async () => {
    setIsLoading(true);
    
    try {
      await signOut({ redirect: false });
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!session?.user?.id) return;
    
    try {
      const userProfile = await getUserProfile(session.user.id);
      if (userProfile) {
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  return (
    <NextAuthContext.Provider
      value={{
        user: session?.user || null,
        profile,
        isLoading,
        signInWithCredentials,
        signUpWithCredentials,
        signOutUser,
        refreshProfile,
      }}
    >
      {children}
    </NextAuthContext.Provider>
  );
}

export function useNextAuth() {
  return useContext(NextAuthContext);
} 