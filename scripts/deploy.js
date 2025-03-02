const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get package version
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const version = packageJson.version;

console.log(`\n🚀 Deploying AP Statistics Hub v${version} to Vercel...\n`);

try {
  // Build the application
  console.log('📦 Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Run linting
  console.log('\n🔍 Running linter checks...');
  execSync('npm run lint', { stdio: 'inherit' });
  
  // Deploy to Vercel
  console.log('\n🌐 Deploying to Vercel...');
  execSync('vercel --prod', { stdio: 'inherit' });
  
  console.log(`\n✅ Successfully deployed AP Statistics Hub v${version} to Vercel!`);
  console.log('\nDeployment URL: https://apstatshub.vercel.app');
  
  // Create a git tag for this release
  console.log(`\n🏷️  Creating git tag for v${version}...`);
  execSync(`git tag -a v${version} -m "Release v${version}"`, { stdio: 'inherit' });
  execSync('git push origin --tags', { stdio: 'inherit' });
  
  console.log(`\n🎉 Release v${version} complete!`);
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
} 