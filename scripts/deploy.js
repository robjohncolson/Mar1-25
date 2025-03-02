const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if content directory exists in the public folder
const contentDir = path.join(process.cwd(), 'public', 'content');
if (!fs.existsSync(contentDir)) {
  console.error('Error: content directory does not exist in public folder!');
  console.log('Please create a public/content directory with your AP Statistics resources');
  process.exit(1);
}

// Check if content directory is empty
const contentFiles = fs.readdirSync(contentDir);
if (contentFiles.length === 0) {
  console.error('Error: public/content directory is empty!');
  console.log('Please add your AP Statistics resources to the public/content directory');
  process.exit(1);
}

console.log('Checking git status...');
try {
  // Check if content directory is tracked by git
  const gitStatus = execSync('git status --porcelain public/content/').toString();
  
  if (gitStatus.length > 0) {
    console.log('Content directory has changes that need to be committed:');
    console.log(gitStatus);
    
    const shouldContinue = process.argv.includes('--force');
    
    if (!shouldContinue) {
      console.log('\nPlease commit these changes before deploying:');
      console.log('git add public/content/');
      console.log('git commit -m "Update content"');
      console.log('\nOr run this script with --force to continue anyway.');
      process.exit(1);
    } else {
      console.log('Continuing with deployment despite uncommitted changes (--force flag used)');
    }
  } else {
    console.log('Content directory is tracked by git and has no uncommitted changes.');
  }
} catch (error) {
  console.error('Error checking git status:', error.message);
  process.exit(1);
}

// Build the application
console.log('\nBuilding the application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build successful!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}

console.log('\nDeployment preparation complete!');
console.log('\nTo deploy to Vercel:');
console.log('1. Push your changes to GitHub:');
console.log('   git push');
console.log('2. Deploy from the Vercel dashboard or run:');
console.log('   vercel --prod');
console.log('\nMake sure your GitHub repository is connected to Vercel.'); 