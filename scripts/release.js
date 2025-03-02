const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get current version from package.json
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

console.log(`\n📦 AP Statistics Hub Release Tool`);
console.log(`Current version: ${currentVersion}`);

// Ask for new version
rl.question('\nEnter new version number (leave blank to use current version): ', (newVersion) => {
  newVersion = newVersion.trim() || currentVersion;
  
  // Ask for release notes
  console.log('\nEnter release notes (press Enter twice to finish):');
  let releaseNotes = '';
  let emptyLines = 0;
  
  rl.on('line', (line) => {
    if (line.trim() === '') {
      emptyLines++;
      if (emptyLines === 2) {
        // Two empty lines in a row, finish input
        processRelease(newVersion, releaseNotes);
        return;
      }
    } else {
      emptyLines = 0;
    }
    
    releaseNotes += line + '\n';
  });
});

function processRelease(version, notes) {
  console.log(`\n🚀 Processing release v${version}...`);
  
  try {
    // Update version in package.json
    if (version !== currentVersion) {
      console.log(`\n📝 Updating version in package.json to ${version}...`);
      packageJson.version = version;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    }
    
    // Update CHANGELOG.md
    console.log('\n📝 Updating CHANGELOG.md...');
    const changelogPath = path.join(__dirname, '../CHANGELOG.md');
    const changelog = fs.existsSync(changelogPath) 
      ? fs.readFileSync(changelogPath, 'utf8') 
      : '# Changelog\n\nAll notable changes to the AP Statistics Hub will be documented in this file.\n\n';
    
    const today = new Date().toISOString().split('T')[0];
    const newEntry = `## [${version}] - ${today}\n\n${notes}\n\n`;
    
    // Add new entry after the header
    const updatedChangelog = changelog.replace(
      /# Changelog\n\nAll notable changes to the AP Statistics Hub will be documented in this file.\n\n/,
      `# Changelog\n\nAll notable changes to the AP Statistics Hub will be documented in this file.\n\n${newEntry}`
    );
    
    fs.writeFileSync(changelogPath, updatedChangelog);
    
    // Commit changes
    console.log('\n📝 Committing changes...');
    execSync('git add package.json CHANGELOG.md', { stdio: 'inherit' });
    execSync(`git commit -m "Release v${version}"`, { stdio: 'inherit' });
    
    // Create tag
    console.log(`\n🏷️  Creating git tag for v${version}...`);
    execSync(`git tag -a v${version} -m "Release v${version}"`, { stdio: 'inherit' });
    
    console.log('\n✅ Release preparation complete!');
    console.log('\nNext steps:');
    console.log('1. Push changes and tags:');
    console.log('   git push && git push --tags');
    console.log('2. Deploy to Vercel:');
    console.log('   npm run deploy');
    
    rl.close();
  } catch (error) {
    console.error('\n❌ Release preparation failed:', error.message);
    rl.close();
    process.exit(1);
  }
} 