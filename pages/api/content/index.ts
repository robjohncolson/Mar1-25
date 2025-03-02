import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Base content directory - updated to use the existing content in public folder
const CONTENT_DIR = path.join(process.cwd(), 'public', 'content');

// Cache duration in seconds (1 hour)
const CACHE_DURATION = 60 * 60;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dirPath = req.query.path ? String(req.query.path) : '';
    const fullPath = path.join(CONTENT_DIR, dirPath);
    
    // Set cache headers
    res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`);
    
    // Check if directory exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Directory not found' });
    }
    
    const items = await fs.promises.readdir(fullPath, { withFileTypes: true });
    
    const contents = items.map(item => {
      const itemPath = path.join(dirPath, item.name);
      const isDirectory = item.isDirectory();
      
      return {
        name: item.name,
        path: itemPath,
        type: isDirectory ? 'dir' : 'file',
        download_url: isDirectory ? null : `/api/content/file?path=${encodeURIComponent(itemPath)}`,
      };
    });
    
    res.status(200).json(contents);
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({ error: 'Failed to read directory' });
  }
} 