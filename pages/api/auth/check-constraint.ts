import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Generate a test ID
    const testId = uuidv4();
    
    // Try to insert a record with a random ID
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: testId,
        username: `test_${Date.now()}`,
        display_name: 'Test User',
        avatar_data: {
          resolution: 2,
          colors: ['#3498db'],
          last_edited: new Date().toISOString()
        },
        stars_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    // Check if there's a foreign key constraint error
    if (error && error.message.includes('foreign key constraint')) {
      return res.status(200).json({
        constraintExists: true,
        error: error.message,
        instructions: [
          "1. Go to your Supabase dashboard",
          "2. Open the SQL Editor",
          "3. Run the following SQL:",
          "ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;",
          "4. Then try again"
        ]
      });
    }
    
    // If there's no error or a different error, the constraint doesn't exist or has been removed
    return res.status(200).json({
      constraintExists: false,
      message: error ? 'Error, but not a constraint error' : 'No constraint exists',
      error: error ? error.message : null
    });
  } catch (error: any) {
    console.error('Error checking constraint:', error);
    return res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
} 