import { Octokit } from 'octokit';

// Initialize Octokit without a token (sufficient for public repos)
const octokit = new Octokit();

// GitHub repository information
const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || 'OWNER_NAME';
const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'REPO_NAME';

// Types for GitHub API responses
export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url: string | null;
  content?: string;
}

export interface Unit {
  name: string;
  path: string;
  quizzes: Quiz[];
}

export interface Quiz {
  name: string;
  path: string;
  pdfs: PDF[];
  prompts: Prompt[];
}

export interface PDF {
  name: string;
  path: string;
  download_url: string;
}

export interface Prompt {
  name: string;
  path: string;
  content: string;
}

// Function to get repository contents
export async function getRepoContents(path = ''): Promise<GitHubFile[]> {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path,
    });

    return response.data as GitHubFile[];
  } catch (error) {
    console.error('Error fetching repo contents:', error);
    return [];
  }
}

// Function to get file content
export async function getFileContent(path: string): Promise<string> {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path,
    });

    // GitHub API returns content as base64 encoded
    const content = Buffer.from(response.data.content, 'base64').toString();
    return content;
  } catch (error) {
    console.error('Error fetching file content:', error);
    return '';
  }
}

// Function to get all units
export async function getAllUnits(): Promise<Unit[]> {
  const contents = await getRepoContents();
  
  // Filter for directories that match unit pattern (1-9)
  const unitDirs = contents.filter(
    (item) => item.type === 'dir' && /^[1-9]$/.test(item.name)
  );
  
  // Sort units numerically
  unitDirs.sort((a, b) => parseInt(a.name) - parseInt(b.name));
  
  const units: Unit[] = [];
  
  for (const unitDir of unitDirs) {
    const quizzes = await getQuizzesForUnit(unitDir.path);
    units.push({
      name: `Unit ${unitDir.name}`,
      path: unitDir.path,
      quizzes,
    });
  }
  
  return units;
}

// Function to get quizzes for a unit
export async function getQuizzesForUnit(unitPath: string): Promise<Quiz[]> {
  const contents = await getRepoContents(unitPath);
  
  // Filter for directories that match quiz pattern (e.g., 1-2, 1-3)
  const quizDirs = contents.filter(
    (item) => item.type === 'dir' && /^\d+-\d+$/.test(item.name)
  );
  
  // Sort quizzes by their numeric values
  quizDirs.sort((a, b) => {
    const [aUnit, aQuiz] = a.name.split('-').map(Number);
    const [bUnit, bQuiz] = b.name.split('-').map(Number);
    
    if (aUnit !== bUnit) return aUnit - bUnit;
    return aQuiz - bQuiz;
  });
  
  const quizzes: Quiz[] = [];
  
  for (const quizDir of quizDirs) {
    const quizContents = await getRepoContents(quizDir.path);
    
    // Filter PDFs and prompt text files
    const pdfs = quizContents
      .filter((item) => item.type === 'file' && item.name.toLowerCase().endsWith('.pdf'))
      .map((pdf) => ({
        name: pdf.name,
        path: pdf.path,
        download_url: pdf.download_url || '',
      }));
    
    const promptFiles = quizContents.filter(
      (item) => item.type === 'file' && item.name.toLowerCase().endsWith('.txt')
    );
    
    const prompts: Prompt[] = [];
    
    for (const promptFile of promptFiles) {
      const content = await getFileContent(promptFile.path);
      prompts.push({
        name: promptFile.name,
        path: promptFile.path,
        content,
      });
    }
    
    quizzes.push({
      name: `Quiz ${quizDir.name}`,
      path: quizDir.path,
      pdfs,
      prompts,
    });
  }
  
  return quizzes;
} 