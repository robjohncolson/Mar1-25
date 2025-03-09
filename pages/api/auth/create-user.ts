import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get username from request or generate one
    const username = req.body?.username || `user_${Date.now()}`;
    
    // Generate a UUID for the user
    const userId = uuidv4();
    
    console.log(`Creating user with username: ${username} and ID: ${userId}`);
    
    // Insert directly into the profiles table
    const { data: profile, error } = await supabase
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
    
    if (error) {
      console.error('Error creating user:', error);
      
      // Check if it's a foreign key constraint error
      if (error.message.includes('foreign key constraint')) {
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
      
      return res.status(500).json({ error: error.message });
    }
    
    console.log(`User created successfully: ${username}`);
    
    return res.status(200).json({
      success: true,
      user: {
        id: userId,
        username: username,
        display_name: username
      },
      message: `User created successfully: ${username}`
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
} 