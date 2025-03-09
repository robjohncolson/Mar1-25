import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get email and password from request body
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    // Create a new user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Return the user data
    return res.status(200).json({ 
      user: {
        id: data.user?.id,
        email: data.user?.email,
        emailConfirmed: !!data.user?.email_confirmed_at
      } 
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
} 