import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if the username column exists
    const { error: checkError } = await supabase
      .from('profiles')
      .select('username')
      .limit(1);
    
    if (checkError) {
      // Column doesn't exist, we need to create it
      // Unfortunately, we can't run ALTER TABLE directly from the client
      // We need to use the Supabase dashboard or SQL editor
      
      return res.status(400).json({ 
        error: "Username column doesn't exist. Please add it manually in the Supabase dashboard.",
        instructions: [
          "1. Go to your Supabase dashboard at https://app.supabase.com/",
          "2. Select your project",
          "3. Go to the 'SQL Editor' section",
          "4. Create a new query",
          "5. Paste the following SQL:",
          "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;",
          "CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);",
          "6. Run the query",
          "7. Then come back and try again"
        ],
        message: "You need to add the username column to your profiles table"
      });
    }
    
    // If we get here, the column exists
    // Update existing profiles to set username based on display_name or id
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, display_name')
      .is('username', null);
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return res.status(500).json({ error: profilesError.message });
    }
    
    // Update each profile with a username
    const updates = [];
    for (const profile of profiles || []) {
      const username = profile.display_name || `user_${profile.id.substring(0, 8)}`;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', profile.id);
      
      if (updateError) {
        console.error(`Error updating profile ${profile.id}:`, updateError);
        updates.push({ id: profile.id, success: false, error: updateError.message });
      } else {
        updates.push({ id: profile.id, success: true, username });
      }
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Username column exists and profiles updated',
      updates,
      profilesUpdated: updates.length
    });
  } catch (error: any) {
    console.error('Unexpected error during migration:', error);
    return res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
} 