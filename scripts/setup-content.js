const fs = require('fs');
const path = require('path');

// Base content directory
const CONTENT_DIR = path.join(process.cwd(), 'public', 'content');

// Sample structure for testing
const SAMPLE_STRUCTURE = {
  'unit1': {
    '1-1': {
      'sample.pdf': 'This is a sample PDF content',
      'prompt.txt': 'This is a sample prompt for Quiz 1-1',
      'image.png': 'This would be binary data in a real image'
    }
  },
  '2017apexam': {
    'sample.pdf': 'This is a sample AP Exam PDF',
    'prompt.txt': 'This is a sample AP Exam prompt'
  }
};

// Function to create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  } else {
    console.log(`Directory already exists: ${dirPath}`);
  }
}

// Function to create a sample file
function createSampleFile(filePath, content) {
  console.log(`Creating sample file: ${filePath}`);
  fs.writeFileSync(filePath, content);
}

// Main function to set up content directory
function setupContentDirectory() {
  console.log('Setting up content directory structure...');
  
  // Ensure base content directory exists
  ensureDirectoryExists(CONTENT_DIR);
  
  // Create sample structure
  for (const [unitName, unitContent] of Object.entries(SAMPLE_STRUCTURE)) {
    const unitPath = path.join(CONTENT_DIR, unitName);
    ensureDirectoryExists(unitPath);
    
    for (const [itemName, itemContent] of Object.entries(unitContent)) {
      const itemPath = path.join(unitPath, itemName);
      
      if (typeof itemContent === 'object') {
        // This is a subdirectory
        ensureDirectoryExists(itemPath);
        
        // Create files in the subdirectory
        for (const [fileName, fileContent] of Object.entries(itemContent)) {
          const filePath = path.join(itemPath, fileName);
          createSampleFile(filePath, fileContent);
        }
      } else {
        // This is a file
        createSampleFile(itemPath, itemContent);
      }
    }
  }
  
  console.log('Content directory setup complete!');
}

// Run the setup
setupContentDirectory(); 