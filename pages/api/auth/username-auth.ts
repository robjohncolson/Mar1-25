import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { sign } from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    // Username validation - only allow alphanumeric characters and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ 
        error: 'Username can only contain letters, numbers, and underscores' 
      });
    }
    
    console.log(`Authenticating user: ${username}`);
    
    // Check if user exists
    const { data: existingUser, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();
    
    if (userError && userError.code !== 'PGRST116') {
      console.error('Error checking for user:', userError);
      return res.status(500).json({ error: userError.message });
    }
    
    let user = existingUser;
    
    // If user doesn't exist, create one
    if (!user) {
      console.log(`User not found, creating new user: ${username}`);
      
      // Generate a UUID for the user
      const userId = uuidv4();
      
      // Insert directly into the profiles table
      const { data: newUser, error: createError } = await supabase
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
      
      if (createError) {
        console.error('Error creating user:', createError);
        
        // Check if it's a foreign key constraint error
        if (createError.message.includes('foreign key constraint')) {
          return res.status(400).json({
            error: 'Foreign key constraint violation. You need to modify your database schema.',
            message: 'Your profiles table has a foreign key constraint that requires each profile to have a corresponding auth.users entry. You need to remove this constraint to use username-only authentication.',
            instructions: [
              "1. Go to your Supabase dashboard",
              "2. Open the SQL Editor",
              "3. Run the following SQL:",
              "ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;",
              "4. Then try again"
            ]
          });
        }
        
        return res.status(500).json({ error: createError.message });
      }
      
      user = newUser;
    }
    
    // Create a JWT token
    const token = sign(
      { 
        id: user.id, 
        username: user.username,
        name: user.display_name
      },
      process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '30d' }
    );
    
    console.log(`Authentication successful for user: ${username}`);
    
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.display_name
      },
      token,
      message: `Authentication successful for user: ${username}`
    });
  } catch (error: any) {
    console.error('Unexpected error during authentication:', error);
    return res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
} 