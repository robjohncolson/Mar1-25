import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Profile, getUserProfile, createUserProfileIfNotExists } from '@/utils/supabaseClient';

type NextAuthContextType = {
  user: {
    id: string;
    username: string;
    name?: string | null;
  } | null;
  profile: Profile | null;
  isLoading: boolean;
  signInWithUsername: (username: string) => Promise<{ error: any | null }>;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

// Create a default context
const defaultNextAuthContext: NextAuthContextType = {
  user: null,
  profile: null,
  isLoading: false,
  signInWithUsername: async () => ({ error: new Error('Auth not initialized') }),
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

  const signInWithUsername = async (username: string) => {
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
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
        signInWithUsername,
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