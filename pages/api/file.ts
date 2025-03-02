import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: filePath } = req.query;
  
  if (!filePath || typeof filePath !== 'string') {
    return res.status(400).json({ error: 'File path is required' });
  }
  
  try {
    const fullPath = path.join(process.cwd(), 'content', filePath);
    
    // Check if file exists
    const stats = await stat(fullPath);
    if (!stats.isFile()) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Get file extension
    const ext = path.extname(fullPath).toLowerCase();
    
    // Set content type based on file extension
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.txt') {
      contentType = 'text/plain';
    }
    
    // Read file
    const fileData = await readFile(fullPath);
    
    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${path.basename(fullPath)}"`);
    
    // Send file
    res.status(200).send(fileData);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Failed to serve file' });
  }
} 