import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    return res.status(200).json({
      session,
      hasSession: !!session,
      user: session?.user || null,
    });
  } catch (error: any) {
    console.error('Error getting session:', error);
    return res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
} 