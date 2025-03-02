# AP Statistics Hub

A mobile-friendly web application that serves as a front end for a GitHub repository containing AP Statistics resources. The app dynamically fetches the repository's directory structure and file URLs, ensuring it always reflects the current state of the repository.

## Features

- Browse AP Statistics resources organized by units and quizzes
- Download PDF resources (tests, scoring guidelines)
- Copy AI tutor prompts to clipboard
- Open grok.com with a single click to paste prompts and upload PDFs
- QR codes for easy mobile access to units and quizzes
- Responsive design for mobile devices

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- GitHub API (via Octokit)
- QR Code generation
- Vercel for deployment

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with your GitHub token and repository information:
   ```
   NEXT_PUBLIC_GITHUB_TOKEN=your_github_token_here
   NEXT_PUBLIC_GITHUB_OWNER=OWNER_NAME
   NEXT_PUBLIC_GITHUB_REPO=REPO_NAME
   ```
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This application is configured for deployment on Vercel. Connect your GitHub repository to Vercel and set the environment variables in the Vercel dashboard.

## License

MIT 