import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Generate a test username
    const testUsername = `test_${Date.now()}`;
    
    // Create a random email and password for the auth user
    const timestamp = Date.now();
    const randomEmail = `test_${timestamp}@example.com`;
    const randomPassword = Math.random().toString(36).slice(-10);
    
    console.log(`Creating test user: ${testUsername} with email: ${randomEmail}`);
    
    // Create a new user in the auth.users table
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: randomEmail,
      password: randomPassword,
      options: {
        data: {
          username: testUsername
        }
      }
    });
    
    if (authError || !authData.user) {
      console.error('Error creating auth user:', authError);
      return res.status(500).json({ error: authError?.message || 'Failed to create auth user' });
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
      
      if (manualProfileError) {
        console.error('Error creating manual profile:', manualProfileError);
        return res.status(500).json({ error: manualProfileError.message });
      }
      
      console.log(`Manual profile created for: ${testUsername}`);
      return res.status(200).json({ 
        success: true, 
        profile: manualProfile,
        message: `Successfully created user: ${testUsername} (manual profile creation)`
      });
    }
    
    // Update the profile with the username if it wasn't set by the trigger
    if (!newProfile.username) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username: testUsername })
        .eq('id', authData.user.id);
      
      if (updateError) {
        console.error('Error updating profile with username:', updateError);
      }
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