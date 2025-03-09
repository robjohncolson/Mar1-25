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

          if (profileError && profileError.code !== 'PGRST116') {
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
          
          // Create a random email and password for the auth user
          const timestamp = Date.now();
          const randomEmail = `${username}_${timestamp}@example.com`;
          const randomPassword = Math.random().toString(36).slice(-10);
          
          // Create a new user in the auth.users table
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: randomEmail,
            password: randomPassword,
            options: {
              data: {
                username: username
              }
            }
          });
          
          if (authError || !authData.user) {
            console.error('Error creating auth user:', authError);
            return null;
          }
          
          console.log(`Auth user created with ID: ${authData.user.id}`);
          
          // Wait a moment for the trigger to create the profile
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if the profile was created by the trigger
          const { data: newProfile, error: newProfileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();
          
          if (newProfileError) {
            console.error('Error fetching new profile:', newProfileError);
            
            // If the profile wasn't created by the trigger, create it manually
            const { data: manualProfile, error: manualProfileError } = await supabase
              .from('profiles')
              .insert({
                id: authData.user.id,
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
            
            if (manualProfileError) {
              console.error('Error creating manual profile:', manualProfileError);
              return null;
            }
            
            console.log(`Manual profile created for: ${username}`);
            return {
              id: authData.user.id,
              username: username,
              name: username
            };
          }
          
          // Update the profile with the username if it wasn't set by the trigger
          if (!newProfile.username) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ username: username })
              .eq('id', authData.user.id);
            
            if (updateError) {
              console.error('Error updating profile with username:', updateError);
            }
          }
          
          console.log(`Profile created for: ${username} with ID: ${authData.user.id}`);
          return {
            id: authData.user.id,
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