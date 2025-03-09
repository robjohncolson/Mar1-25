import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '@/utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

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
          console.error('No username provided');
          return null;
        }

        const username = credentials.username.trim();
        console.log(`Attempting to authenticate user: ${username}`);

        // Username validation - only allow alphanumeric characters and underscores
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          console.error('Invalid username format');
          return null;
        }

        try {
          // First, check if the user exists in the profiles table
          const { data: existingProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .maybeSingle();

          if (profileError) {
            console.error('Error checking for existing profile:', profileError);
            return null;
          }

          // If user exists, return the user data
          if (existingProfile) {
            console.log(`User found: ${username}`);
            return {
              id: existingProfile.id,
              username: existingProfile.username,
              name: existingProfile.display_name
            };
          }

          console.log(`User not found, creating new user: ${username}`);
          
          // Generate a UUID for the new user
          const userId = uuidv4();
          
          // Create a profile directly in the profiles table
          const { data: newProfile, error: newProfileError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              username: username,
              display_name: username,
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
            
          if (newProfileError) {
            console.error('Error creating profile:', newProfileError);
            return null;
          }
          
          console.log(`Profile created for: ${username} with ID: ${userId}`);
          return {
            id: userId,
            username: username,
            name: username
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
        console.log('Setting JWT token with user:', user);
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        console.log('Setting session with token:', token);
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
  debug: true, // Enable debug mode to see more detailed logs
};

export default NextAuth(authOptions); 