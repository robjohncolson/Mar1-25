# AP Statistics Hub

A mobile-friendly web application that serves as a front end for AP Statistics resources. The app dynamically loads content from a directory structure, making it easy to adapt for different subjects.

## Latest Release - v2.0.0: "MediaMaster"

This release adds comprehensive multimedia resources:
- Google Drive video links for educational content
- Blooket flashcard games for interactive practice
- Schoology materials integration
- Enhanced content organization and navigation

## Features

- Mobile-friendly interface
- Unit and quiz organization
- PDF resource viewing
- AI tutor prompts
- Knowledge tree visualization
- QR code generation for sharing
- External multimedia resources (videos and practice games)
- Organized content by type (AI vs. multimedia)
- Intuitive navigation between related content

## Development with Cursor and Vercel

### Prerequisites

- [Cursor](https://cursor.sh/) IDE installed
- [Vercel](https://vercel.com/) account
- [GitHub](https://github.com/) account

### Getting Started in Cursor

1. **Clone the repository in Cursor**:
   - Open Cursor
   - Click "Clone Repository" or use the command palette (Cmd/Ctrl+Shift+P)
   - Enter the repository URL

2. **Preview and edit the code**:
   - Browse and edit files directly in Cursor
   - Use Cursor's AI features to help understand and modify the code

3. **Commit your changes**:
   - Use Cursor's Git integration to stage and commit changes
   - Push to your GitHub repository

### Deploying to Vercel

Vercel handles all the build processes automatically, so you don't need to run any local build commands:

1. **Connect your GitHub repository to Vercel**:
   - Go to [Vercel](https://vercel.com) and sign in
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Vercel will automatically detect it as a Next.js project
   - Use the default settings and click "Deploy"

2. **Continuous Deployment**:
   - Once connected, Vercel will automatically deploy when you push changes to GitHub
   - Each commit to your main branch will trigger a new deployment
   - You can also set up preview deployments for pull requests

3. **Your application will be available at the Vercel URL**

## Adapting for Different Subjects

To adapt this application for a different subject (e.g., AP Calculus, AP History):

### 1. Content Structure

The application uses a specific directory structure in `public/content/`:

```
public/content/
├── unit1/
│   ├── 1-1/
│   │   ├── quiz.pdf
│   │   ├── prompt.txt
│   │   └── resources.json
│   ├── 1-2/
│   │   ├── quiz.pdf
│   │   └── prompt.txt
├── unit2/
│   └── ...
```

### 2. Modify Unit Names and Content

1. **Update unit names and sections**:
   - Edit the directory names to match your subject's units
   - For AP Calculus, you might use `unit1` for "Limits and Continuity"
   - For AP History, you might use `unit1` for "Period 1: 1491-1607"

2. **Replace content files**:
   - Replace PDFs with your subject-specific materials
   - Update prompt.txt files with subject-appropriate AI prompts
   - Create resources.json files for your multimedia content

### 3. Resources.json Format

Each section can have a `resources.json` file with this structure:

```json
{
  "videos": [
    {
      "title": "Video Title",
      "type": "google_drive",
      "url": "https://drive.google.com/file/d/example",
      "description": "Description of the video"
    }
  ],
  "practice": [
    {
      "title": "Practice Activity",
      "type": "blooket",
      "url": "https://dashboard.blooket.com/set/example",
      "description": "Description of the practice activity"
    }
  ],
  "other": [
    {
      "title": "Additional Resource",
      "type": "schoology",
      "url": "https://schoology.com/example",
      "description": "Description of the resource"
    }
  ]
}
```

### 4. Update MCQ Content (Optional)

If your subject has MCQs:

1. Update the `mcqLocations` object in `pages/mcq-detail/[id].tsx`
2. Update the `mcqPrimaryLocations` object in `pages/mcq-navigation.tsx`

### 5. Customize Branding

1. Update the title in `Layout.tsx`
2. Modify the color scheme in `tailwind.config.js` if desired
3. Update the README.md with your subject information

## Project Structure

- `pages/`: Next.js pages and API routes
- `components/`: React components
- `utils/`: Utility functions
- `public/content/`: Subject resources (PDFs, prompts, images, resources.json)
- `public/`: Other static assets
- `scripts/`: Deployment and release scripts

## Working Without Administrator Privileges

If you need to work on a Windows laptop without administrator privileges:

1. **Use Vercel's GitHub Integration**:
   - Make all your changes directly on GitHub or through Cursor
   - Let Vercel handle the build and deployment process
   - No local installation required

2. **Use Gitpod or GitHub Codespaces**:
   - These browser-based development environments require no local installation
   - They provide full development capabilities in the browser
   - Can be launched directly from your GitHub repository

3. **Use Replit**:
   - [Replit](https://replit.com/) provides a browser-based development environment
   - Import your GitHub repository and make changes
   - No local installation required

## License

MIT
