# AP Statistics Hub

A mobile-friendly web application that serves as a front end for AP Statistics resources. The app dynamically loads content from a local directory structure, making it easy to update and maintain.

## Latest Release - v2.0.0 (March 10, 2025)

This release adds external multimedia resources:
- Google Drive video links for educational content
- YouTube video integration for supplementary learning
- Blooket flashcard game links for interactive practice
- Enhanced content organization and display

See the [CHANGELOG.md](CHANGELOG.md) for detailed release notes.

## Features

- Mobile-friendly interface
- Unit and quiz organization
- PDF resource viewing
- AI tutor prompts
- Knowledge tree visualization
- QR code generation for sharing
- External multimedia resources (videos and practice games)

## Deployment Instructions

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ap-statistics-hub.git
   cd ap-statistics-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure your AP Statistics resources are in the `public/content` directory with this structure:
   ```
   public/content/
   ├── unit1/
   │   ├── 1-2/
   │   │   ├── quiz.pdf
   │   │   └── prompt.txt
   │   └── 1-3/
   │       ├── quiz.pdf
   │       └── prompt.txt
   ├── unit2/
   │   └── ...
   ├── 2017apexam/
   │   ├── exam.pdf
   │   └── prompt.txt
   └── knowledge-tree.txt
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploying to Vercel

1. Push your code to GitHub, including the `public/content` directory:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. Connect your GitHub repository to Vercel:
   - Go to [Vercel](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project settings (use default Next.js settings)
   - Click "Deploy"

3. Your application will be deployed and available at the Vercel URL.

## How It Works

The application uses Next.js API routes to serve content from the `public/content` directory. This approach:

1. Eliminates GitHub API rate limits
2. Provides faster page loads
3. Allows offline functionality during development
4. Reduces dependency on external services

## Directory Structure

- `pages/`: Next.js pages and API routes
- `components/`: React components
- `utils/`: Utility functions
- `public/content/`: AP Statistics resources (PDFs, prompts, images, resources.json)
- `public/`: Other static assets

## External Resources

The application supports external resources for each quiz section. To add external resources:

1. Create a `resources.json` file in the quiz section directory:
   ```
   public/content/unit3/3-1,2,3/resources.json
   ```

2. Use the following format for the resources.json file:
   ```json
   {
     "videos": [
       {
         "title": "Video Title",
         "type": "youtube",
         "url": "https://youtube.com/watch?v=example",
         "description": "Description of the video"
       },
       {
         "title": "Another Video",
         "type": "google_drive",
         "url": "https://drive.google.com/file/d/example",
         "description": "Description of the video"
       }
     ],
     "practice": [
       {
         "title": "Practice Game",
         "type": "blooket",
         "url": "https://play.blooket.com/play?id=example",
         "description": "Description of the practice activity"
       }
     ]
   }
   ```

3. The resources will automatically appear in the quiz page.

## Customization

To customize the application:

1. Update the content in the `public/content` directory
2. Modify the UI components in the `components` directory
3. Adjust the styling using Tailwind CSS classes

## Releases and Deployment

For information about the release process, see [RELEASE.md](RELEASE.md).

To create a new release:

```bash
npm run release
```

To deploy to Vercel:

```bash
npm run deploy
```

## License

MIT 