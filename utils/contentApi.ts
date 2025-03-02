// Types for content structure
export interface ContentFile {
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
  images: Image[];
}

export interface PDF {
  name: string;
  path: string;
  download_url: string;
}

export interface Image {
  name: string;
  path: string;
  download_url: string;
}

export interface Prompt {
  name: string;
  path: string;
  content: string;
}

// Simple in-memory cache
const directoryCache: Record<string, { data: ContentFile[], timestamp: number }> = {};
const fileContentCache: Record<string, { content: string, timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to get directory contents
export async function getDirectoryContents(dirPath = ''): Promise<ContentFile[]> {
  // Check cache first
  const cacheKey = dirPath;
  const cachedData = directoryCache[cacheKey];
  const now = Date.now();
  
  if (cachedData && (now - cachedData.timestamp) < CACHE_TTL) {
    return cachedData.data;
  }
  
  try {
    const response = await fetch(`/api/content?path=${encodeURIComponent(dirPath)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch directory contents: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Update cache
    directoryCache[cacheKey] = { data, timestamp: now };
    
    return data;
  } catch (error) {
    console.error('Error fetching directory contents:', error);
    return [];
  }
}

// Function to get file content
export async function getFileContent(filePath: string): Promise<string> {
  // Check cache first
  const cacheKey = filePath;
  const cachedData = fileContentCache[cacheKey];
  const now = Date.now();
  
  if (cachedData && (now - cachedData.timestamp) < CACHE_TTL) {
    return cachedData.content;
  }
  
  try {
    const response = await fetch(`/api/content/file?path=${encodeURIComponent(filePath)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch file content: ${response.statusText}`);
    }
    const content = await response.text();
    
    // Update cache
    fileContentCache[cacheKey] = { content, timestamp: now };
    
    return content;
  } catch (error) {
    console.error('Error fetching file content:', error);
    return '';
  }
}

// Function to get all units
export async function getAllUnits(): Promise<Unit[]> {
  const contents = await getDirectoryContents();
  
  // Filter for directories that match unit pattern (unit1, unit2, etc.)
  const unitDirs = contents.filter(
    (item) => item.type === 'dir' && /^unit\d+$/.test(item.name)
  );
  
  // Sort units numerically
  unitDirs.sort((a, b) => {
    const aNum = parseInt(a.name.replace('unit', ''));
    const bNum = parseInt(b.name.replace('unit', ''));
    return aNum - bNum;
  });
  
  const units: Unit[] = [];
  
  for (const unitDir of unitDirs) {
    const quizzes = await getQuizzesForUnit(unitDir.path);
    units.push({
      name: `Unit ${unitDir.name.replace('unit', '')}`,
      path: unitDir.path,
      quizzes,
    });
  }
  
  return units;
}

// Function to get quizzes for a unit
export async function getQuizzesForUnit(unitPath: string): Promise<Quiz[]> {
  const contents = await getDirectoryContents(unitPath);
  
  // Filter for directories that match quiz pattern (e.g., 1-2, 1-3, 1-{7,8})
  const quizDirs = contents.filter(
    (item) => item.type === 'dir' && /^\d+-\S+$/.test(item.name)
  );
  
  // Sort quizzes by their numeric values
  quizDirs.sort((a, b) => {
    const aMatch = a.name.match(/^(\d+)-/);
    const bMatch = b.name.match(/^(\d+)-/);
    
    if (!aMatch || !bMatch) return 0;
    
    const aNum = parseInt(aMatch[1]);
    const bNum = parseInt(bMatch[1]);
    
    return aNum - bNum;
  });
  
  const quizzes: Quiz[] = [];
  
  // Also check for prompts and PDFs at the unit level
  const unitLevelPDFs = contents
    .filter((item) => item.type === 'file' && item.name.toLowerCase().endsWith('.pdf'))
    .map((pdf) => ({
      name: pdf.name,
      path: pdf.path,
      download_url: pdf.download_url || '',
    }));
  
  const unitLevelPromptFiles = contents.filter(
    (item) => item.type === 'file' && item.name.toLowerCase().includes('prompt')
  );
  
  const unitLevelPrompts: Prompt[] = [];
  
  for (const promptFile of unitLevelPromptFiles) {
    const content = await getFileContent(promptFile.path);
    unitLevelPrompts.push({
      name: promptFile.name,
      path: promptFile.path,
      content,
    });
  }
  
  const unitLevelImages = contents
    .filter((item) => item.type === 'file' && /\.(png|jpg|jpeg|gif)$/i.test(item.name))
    .map((img) => ({
      name: img.name,
      path: img.path,
      download_url: img.download_url || '',
    }));
  
  // Add unit-level resources as a "Unit Overview" quiz
  if (unitLevelPDFs.length > 0 || unitLevelPrompts.length > 0 || unitLevelImages.length > 0) {
    quizzes.push({
      name: 'Unit Overview',
      path: unitPath,
      pdfs: unitLevelPDFs,
      prompts: unitLevelPrompts,
      images: unitLevelImages,
    });
  }
  
  for (const quizDir of quizDirs) {
    const quizContents = await getDirectoryContents(quizDir.path);
    
    // Filter PDFs, prompt files, and images
    const pdfs = quizContents
      .filter((item) => item.type === 'file' && item.name.toLowerCase().endsWith('.pdf'))
      .map((pdf) => ({
        name: pdf.name,
        path: pdf.path,
        download_url: pdf.download_url || '',
      }));
    
    const promptFiles = quizContents.filter(
      (item) => item.type === 'file' && item.name.toLowerCase().includes('prompt')
    );
    
    const images = quizContents
      .filter((item) => item.type === 'file' && /\.(png|jpg|jpeg|gif)$/i.test(item.name))
      .map((img) => ({
        name: img.name,
        path: img.path,
        download_url: img.download_url || '',
      }));
    
    const prompts: Prompt[] = [];
    
    for (const promptFile of promptFiles) {
      const content = await getFileContent(promptFile.path);
      prompts.push({
        name: promptFile.name,
        path: promptFile.path,
        content,
      });
    }
    
    // Format the quiz name to be more readable
    let quizName = quizDir.name;
    if (quizName.includes('{') && quizName.includes('}')) {
      // Handle cases like 1-{7,8} to display as "Quiz 1-7,8"
      quizName = quizName.replace('{', '').replace('}', '');
    }
    
    quizzes.push({
      name: `Quiz ${quizName}`,
      path: quizDir.path,
      pdfs,
      prompts,
      images,
    });
  }
  
  return quizzes;
}

// Function to get the 2017 AP Exam content
export async function getAPExamContent(): Promise<{
  pdfs: PDF[];
  prompts: Prompt[];
  images: Image[];
}> {
  const contents = await getDirectoryContents('2017apexam');
  
  const pdfs = contents
    .filter((item) => item.type === 'file' && item.name.toLowerCase().endsWith('.pdf'))
    .map((pdf) => ({
      name: pdf.name,
      path: pdf.path,
      download_url: pdf.download_url || '',
    }));
  
  const promptFiles = contents.filter(
    (item) => item.type === 'file' && item.name.toLowerCase().includes('prompt')
  );
  
  const images = contents
    .filter((item) => item.type === 'file' && /\.(png|jpg|jpeg|gif)$/i.test(item.name))
    .map((img) => ({
      name: img.name,
      path: img.path,
      download_url: img.download_url || '',
    }));
  
  const prompts: Prompt[] = [];
  
  for (const promptFile of promptFiles) {
    const content = await getFileContent(promptFile.path);
    prompts.push({
      name: promptFile.name,
      path: promptFile.path,
      content,
    });
  }
  
  return { pdfs, prompts, images };
}

// Function to get the knowledge tree content
export async function getKnowledgeTree(): Promise<string> {
  try {
    return await getFileContent('knowledge-tree.txt');
  } catch (error) {
    console.error('Error fetching knowledge tree:', error);
    return '';
  }
} 