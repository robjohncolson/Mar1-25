import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type User = {
  id: string;
  username: string;
  name?: string | null;
};

type SimpleAuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string) => Promise<{ error: any | null }>;
  logout: () => void;
};

// Create a default context
const defaultSimpleAuthContext: SimpleAuthContextType = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => ({ error: new Error('Auth not initialized') }),
  logout: () => {},
};

const SimpleAuthContext = createContext<SimpleAuthContextType>(defaultSimpleAuthContext);

export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if we have a token and user in localStorage
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (username: string) => {
    setIsLoading(true);
    
    try {
      // Call our username-auth API
      const response = await fetch('/api/auth/username-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setIsLoading(false);
        return { error: new Error(data.error || 'Authentication failed') };
      }
      
      // Store the token and user in localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update state
      setUser(data.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { error };
    }
  };

  const logout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <SimpleAuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </SimpleAuthContext.Provider>
  );
}

export function useSimpleAuth() {
  return useContext(SimpleAuthContext);
} 