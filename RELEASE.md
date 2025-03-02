# AP Statistics Hub Release Guide

This document outlines the process for creating and deploying new releases of the AP Statistics Hub.

## Release Process

### 1. Prepare for Release

Before creating a release, ensure that:

- All features for the release are complete and tested
- All bug fixes have been implemented and tested
- The application runs correctly in development mode
- All linting issues have been resolved

Use the [CHECKLIST.md](CHECKLIST.md) file to verify that everything is ready for release.

### 2. Create a Release

Run the release script to create a new release:

```bash
npm run release
```

This script will:
- Prompt for a new version number (or use the current one)
- Ask for release notes to add to the CHANGELOG
- Update the version in package.json
- Update CHANGELOG.md with the new release notes
- Commit these changes
- Create a git tag for the release

### 3. Push Changes

Push the changes and tags to the repository:

```bash
git push && git push --tags
```

### 4. Deploy to Vercel

Deploy the release to Vercel:

```bash
npm run deploy
```

This script will:
- Build the application
- Run linting checks
- Deploy to Vercel
- Confirm the deployment URL

### 5. Verify the Deployment

After deployment, verify that:

- The application is accessible at the deployment URL
- All features work correctly in production
- No errors appear in the browser console
- The application is responsive on different devices

## Version Numbering

We follow semantic versioning (SemVer) for the AP Statistics Hub:

- **Major version (X.0.0)**: Significant changes that may include breaking changes
- **Minor version (0.X.0)**: New features added in a backward-compatible manner
- **Patch version (0.0.X)**: Backward-compatible bug fixes

## Hotfixes

For urgent fixes to production:

1. Create a branch from the latest release tag:
   ```bash
   git checkout -b hotfix/description v1.0.0
   ```

2. Make the necessary fixes

3. Run the release script with an incremented patch version:
   ```bash
   npm run release
   # Enter version like 1.0.1
   ```

4. Push and deploy as usual 