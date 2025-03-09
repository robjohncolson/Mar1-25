import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if we can connect to Supabase
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    // Try to create a user with signUp
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    return res.status(200).json({
      supabaseConnected: !profilesError,
      profilesError: profilesError ? profilesError.message : null,
      authWorking: !authError,
      authError: authError ? authError.message : null,
      authData: authData ? {
        user: authData.user ? {
          id: authData.user.id,
          email: authData.user.email,
        } : null,
        session: !!authData.session,
      } : null,
    });
  } catch (error: any) {
    console.error('Error checking Supabase:', error);
    return res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
} 