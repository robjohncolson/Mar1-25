# AP Statistics Hub v3.0.0 - "ExamVault"

## Release Highlights

We're excited to announce the release of AP Statistics Hub v3.0.0 "ExamVault", which transforms the platform into a comprehensive repository of AP Statistics exam resources spanning multiple years. This major update expands our content library to include complete 2018 and 2019 AP Statistics exams alongside the existing 2017 materials.

### New Features

- **Multi-Year Exam Support**: Added complete support for 2018 and 2019 AP Statistics exams
- **Year Selection Interface**: New intuitive UI for selecting which exam year to explore
- **Expanded FRQ Content**: Free Response Questions from 2018 and 2019 exams integrated into their relevant unit directories
- **Expanded MCQ Navigation**: Multiple Choice Questions from all three exam years (2017-2019) now available
- **Consistent Navigation Experience**: Maintained year context throughout the navigation flow
- **Enhanced UI**: Improved styling and user experience across exam navigation pages
- **User Authentication**: Added Supabase integration for user accounts and progress tracking
- **Pixel Avatar System**: Unique user avatars that grow in resolution as users progress
- **Progress Tracking**: Star system for marking completed content and tracking progress

### Content Additions

- Added complete 2018 AP Statistics exam materials:
  - Multiple Choice Questions with answers
  - Free Response Questions with scoring guidelines
  - Scoring worksheet and reference materials

- Added complete 2019 AP Statistics exam materials:
  - Multiple Choice Questions with answers
  - Free Response Questions with scoring guidelines
  - Scoring worksheet and reference materials

### Technical Improvements

- Integrated Supabase for authentication and data storage
- Implemented magic link authentication (email-based, no passwords)
- Added user profiles with customizable pixel avatars
- Created a progress tracking system with completion markers
- Refactored content API to support multiple exam years
- Enhanced navigation system to maintain year context between pages
- Improved conditional rendering for content availability
- Updated QR code generation to include year parameters

### Documentation

- Added FRQ mapping document to track which units each FRQ relates to
- Updated directory structure to organize exam content by year
- Created comprehensive release notes

## Getting Started

To explore the ExamVault:

1. Navigate to the Exam Navigation page
2. Select your desired exam year (2017, 2018, or 2019)
3. Choose between Multiple Choice Questions or Free Response Questions
4. Explore questions and their connections to specific AP Statistics units and topics

To use the new user features:

1. Sign in with your email (magic link authentication)
2. Create and customize your pixel avatar
3. Mark content as completed to earn stars and unlock higher resolution avatars
4. Track your progress through the AP Statistics curriculum

## Future Plans

- **Real-time Interaction**: Adding Railway integration for user-to-user interaction
- **Study Rooms**: Creating virtual spaces for collaborative learning
- **Additional Exam Years**: Integration of more recent exam years as they become available
- **Enhanced Analytics**: More detailed progress tracking and performance insights

---

We'd like to thank all contributors and users who have provided feedback to help make AP Statistics Hub a more comprehensive resource for AP Statistics students and teachers.

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