# Changelog

All notable changes to the AP Statistics Hub will be documented in this file.

## [3.0.0] - 2024-06-06 - "ExamVault"

### Added
- Multi-year exam support for 2018 and 2019 AP Statistics exams
- Year selection interface in exam navigation
- User authentication with Supabase
- User profiles with customizable pixel avatars
- Progress tracking with completion markers
- Star system for unlocking higher resolution avatars

### Changed
- Refactored content API to support multiple exam years
- Enhanced navigation to maintain year context
- Improved UI across exam navigation pages

### Fixed
- Type issues in profile handling
- Invalid Next.js configuration options

## [2.2.1] - 2024-03-02

### Added
- Support for external resources in quiz content
- Video embedding capabilities
- Practice resource links

### Changed
- Improved mobile responsiveness
- Enhanced error handling for content loading

### Fixed
- Issue with PDF rendering on certain browsers
- Navigation bugs in unit selection

## [2.0.0] - 2024-02-01 - "MediaMaster"

### Added
- Complete redesign with new UI
- Support for multimedia content
- Interactive quiz navigation
- Unit-based content organization

### Changed
- Migrated to Next.js framework
- Implemented TypeScript for better type safety
- Enhanced content management system

## [1.0.0] - 2024-01-15 - "Foundation"

### Added
- Initial release with basic AP Statistics content
- Support for 2017 AP exam materials
- Simple navigation and content viewing
- Basic responsive design

## [2.2.1] - 2025-03-22

### Added
- "Up to Unit" navigation option on quiz pages when coming from MCQ pages
- Improved navigation flow to allow users to easily access all unit resources

### Changed
- Enhanced quiz page navigation with multiple navigation options
- Better user experience when navigating between MCQs, quizzes, and unit pages

## [2.2.0] - 2025-03-20

### Added
- Separate sections for AI content and multimedia resources on unit pages
- New AIContentCard component with blue accent for study materials
- New MultimediaResourceCard component with green accent for interactive resources
- Visual indicators to distinguish between content types

### Changed
- Reorganized unit page layout to group content by type rather than just by section
- Improved content organization to reduce confusion between overlapping section numbers
- Enhanced visual hierarchy with section headers and color coding

## [2.1.0] - 2025-03-15

### Added
- Support for Schoology links to connect with the official learning management system
- Support for NotebookLM links for interactive learning experiences
- "Additional Resources" section for non-video, non-practice resources
- Real content for Unit 1 and Unit 2 sections with videos and practice materials

### Changed
- Enhanced ExternalResources component to support more resource types
- Improved resource type detection and icon display
- Updated content API to handle optional resource categories

## [2.0.0] - 2025-03-10

### Added
- External resources support for each quiz section
- Google Drive video links for educational content
- YouTube video integration for supplementary learning
- Blooket flashcard game links for interactive practice
- New ExternalResources component for displaying multimedia content
- Sample resources for Unit 3 sections

### Changed
- Enhanced content API to support external resources
- Updated quiz page layout to display external resources
- Improved error handling for resource loading

### Technical
- Added new interfaces for video and practice resources
- Implemented JSON-based resource configuration

## [1.0.0] - 2025-03-02

### Added
- Initial release of AP Statistics Hub
- Mobile-friendly interface with responsive design
- Unit and quiz organization system
- MCQ navigation for 2017 AP Statistics Exam (40 questions)
- QR code generation for all pages for easy sharing
- Error handling for missing content with helpful messages
- Proper URL formatting for section navigation with curly braces

### Fixed
- URL formatting issue with MCQ navigation links
- Button text wrapping issues when zooming in
- Double curly brace problem in section URLs
- Improved error messages for missing content

### Changed
- Updated UI components for better mobile responsiveness
- Enhanced navigation between MCQs and content sections 