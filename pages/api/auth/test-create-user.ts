import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Generate a test username
    const testUsername = `test_${Date.now()}`;
    
    // Generate a UUID for the new user
    const userId = uuidv4();
    
    console.log(`Creating test user: ${testUsername} with ID: ${userId}`);
    
    // Create a profile directly in the profiles table
    const { data: newProfile, error: newProfileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: testUsername,
        display_name: testUsername,
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
      return res.status(500).json({ error: newProfileError.message });
    }
    
    console.log(`Profile created for: ${testUsername}`);
    return res.status(200).json({ 
      success: true, 
      profile: newProfile,
      message: `Successfully created user: ${testUsername}`
    });
  } catch (error: any) {
    console.error('Unexpected error during test:', error);
    return res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
} 