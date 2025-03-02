import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Base content directory - updated to use the existing content in public folder
const CONTENT_DIR = path.join(process.cwd(), 'public', 'content');

// Cache duration in seconds (1 day for static files)
const CACHE_DURATION = 60 * 60 * 24;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const filePath = req.query.path ? String(req.query.path) : '';
    const fullPath = path.join(CONTENT_DIR, filePath);
    
    console.log(`Attempting to serve file: ${fullPath}`);
    
    // Check if content directory exists
    if (!fs.existsSync(CONTENT_DIR)) {
      console.error(`Content directory does not exist: ${CONTENT_DIR}`);
      return res.status(500).json({ error: 'Content directory not found' });
    }
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`);
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Check if it's a file
    const stats = fs.statSync(fullPath);
    if (!stats.isFile()) {
      console.error(`Not a file: ${fullPath}`);
      return res.status(400).json({ error: 'Not a file' });
    }
    
    // Get file name for Content-Disposition header
    const fileName = path.basename(fullPath);
    
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
    
    console.log(`Serving file: ${fullPath} with content type: ${contentType}`);
    
    // Set cache headers - longer cache for static files
    res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`);
    
    // For binary files like PDFs and images, read as buffer
    if (contentType.startsWith('image/') || contentType === 'application/pdf') {
      try {
        // Read file as buffer for binary files
        const fileBuffer = await fs.promises.readFile(fullPath);
        
        // Set appropriate headers
        res.setHeader('Content-Type', contentType);
        
        // For PDFs, set Content-Disposition to attachment to force download if requested
        if (contentType === 'application/pdf' && req.query.download === 'true') {
          res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        }
        
        // Send the file
        return res.send(fileBuffer);
      } catch (readError) {
        console.error(`Error reading file: ${fullPath}`, readError);
        return res.status(500).json({ error: 'Failed to read file' });
      }
    }
    
    // For text files, read and return the content
    try {
      const content = await fs.promises.readFile(fullPath, 'utf-8');
      
      if (contentType === 'application/json') {
        return res.status(200).json(JSON.parse(content));
      }
      
      res.setHeader('Content-Type', contentType);
      return res.status(200).send(content);
    } catch (readError) {
      console.error(`Error reading text file: ${fullPath}`, readError);
      return res.status(500).json({ error: 'Failed to read file' });
    }
  } catch (error) {
    console.error('Error in file API handler:', error);
    return res.status(500).json({ error: 'Failed to serve file' });
  }
} 