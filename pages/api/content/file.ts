import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Base content directory - updated to use the existing content in public folder
const CONTENT_DIR = path.join(process.cwd(), 'public', 'content');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const filePath = req.query.path ? String(req.query.path) : '';
    const fullPath = path.join(CONTENT_DIR, filePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Determine content type based on file extension
    const ext = path.extname(fullPath).toLowerCase();
    let contentType = 'text/plain';
    
    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.txt':
        contentType = 'text/plain';
        break;
      case '.md':
        contentType = 'text/markdown';
        break;
      default:
        contentType = 'application/octet-stream';
    }
    
    // For binary files like PDFs and images, stream the file
    if (contentType.startsWith('image/') || contentType === 'application/pdf') {
      const fileStream = fs.createReadStream(fullPath);
      res.setHeader('Content-Type', contentType);
      return fileStream.pipe(res);
    }
    
    // For text files, read and return the content
    const content = await fs.promises.readFile(fullPath, 'utf-8');
    
    if (contentType === 'application/json') {
      return res.status(200).json(JSON.parse(content));
    }
    
    res.setHeader('Content-Type', contentType);
    res.status(200).send(content);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
} 