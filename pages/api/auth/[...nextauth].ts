import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '@/utils/supabaseClient';

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name?: string | null;
    }
  }
  
  interface User {
    id: string;
    username: string;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Username',
      credentials: {
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.username) {
          return null;
        }

        try {
          // Check if user exists in the database
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', credentials.username)
            .single();

          if (error) {
            // If user doesn't exist, create a new one
            if (error.code === 'PGRST116') {
              // Generate a unique ID for the new user
              const userId = crypto.randomUUID();
              
              // Create a new user in the auth.users table (simplified approach)
              const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
                email: `${credentials.username}@example.com`,
                password: crypto.randomUUID(),
                user_metadata: { username: credentials.username }
              });
              
              if (authError) {
                console.error('Error creating auth user:', authError);
                return null;
              }
              
              // Create a profile for the new user
              const { data: newProfile, error: profileError } = await supabase
                .from('profiles')
                .insert({
                  id: authUser.user.id,
                  username: credentials.username,
                  display_name: credentials.username,
                  avatar_data: {
                    resolution: 2,
                    colors: ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f'],
                    last_edited: new Date().toISOString()
                  },
                  stars_count: 0,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .select()
                .single();
              
              if (profileError) {
                console.error('Error creating profile:', profileError);
                return null;
              }
              
              return {
                id: authUser.user.id,
                username: credentials.username,
                name: credentials.username
              };
            }
            
            console.error('Error finding user:', error);
            return null;
          }
          
          // Return the existing user
          return {
            id: data.id,
            username: data.username || credentials.username,
            name: data.display_name
          };
        } catch (error) {
          console.error('Unexpected error during authentication:', error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login', // Error code passed in query string as ?error=
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions); 