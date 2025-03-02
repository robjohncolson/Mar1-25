import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import PDFCard from '@/components/PDFCard';
import PromptCard from '@/components/PromptCard';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import LoadingIndicator from '@/components/LoadingIndicator';
import { getDirectoryContents, getFileContent, PDF, Prompt, Image } from '@/utils/contentApi';
import { FaArrowLeft, FaImage, FaFilePdf, FaRobot, FaExternalLinkAlt, FaListOl } from 'react-icons/fa';
import Link from 'next/link';

export default function QuizPage() {
  const router = useRouter();
  const { path } = router.query;
  
  const [quizPath, setQuizPath] = useState('');
  const [quizName, setQuizName] = useState('');
  const [unitPath, setUnitPath] = useState('');
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fromMcq, setFromMcq] = useState(false);
  const [mcqNumber, setMcqNumber] = useState<string | null>(null);

  const fetchQuizContents = useCallback(async (fullPath: string) => {
    try {
      // Try to fetch with the original path first
      let contents;
      try {
        contents = await getDirectoryContents(fullPath);
      } catch (error) {
        // If the original path fails, try to convert between formats and retry
        let altPath = fullPath;
        
        // Check for and fix double curly braces first
        if (fullPath.includes('{{')) {
          altPath = fullPath.replace(/\{\{(\d+(?:,\d+)+)\}\}/g, '{$1}');
          console.log('Fixed double curly braces:', altPath);
        }
        // If path contains commas without braces, convert to braced format
        else if (fullPath.includes(',') && !fullPath.includes('{')) {
          // Extract the section part (e.g., "5-7,8")
          const sectionMatch = fullPath.match(/(\d+-\d+(?:,\d+)+)/);
          if (sectionMatch && sectionMatch[1]) {
            const section = sectionMatch[1];
            const [prefix, values] = section.split('-');
            const bracedSection = `${prefix}-{${values}}`;
            altPath = fullPath.replace(section, bracedSection);
            console.log('Added curly braces:', altPath);
          }
        } 
        // If path contains braces, try without braces
        else if (fullPath.includes('{')) {
          altPath = fullPath.replace(/\{(\d+(?:,\d+)+)\}/g, '$1');
          console.log('Removed curly braces:', altPath);
        }
        
        // Try with the alternative path if it's different
        if (altPath !== fullPath) {
          try {
            contents = await getDirectoryContents(altPath);
            console.log('Successfully loaded with alternative path:', altPath);
          } catch (altError) {
            console.error('Alternative path also failed:', altError);
            throw new Error(`Content not found. Tried paths: ${fullPath} and ${altPath}`);
          }
        } else {
          // If no alternative path was generated, rethrow the original error
          throw error;
        }
      }
      
      // Filter PDFs
      const pdfFiles = contents
        .filter((item) => item.type === 'file' && item.name.toLowerCase().endsWith('.pdf'))
        .map((pdf) => ({
          name: pdf.name,
          path: pdf.path,
          download_url: pdf.download_url || '',
        }));
      
      setPdfs(pdfFiles);
      
      // Filter prompt files
      const promptFiles = contents.filter(
        (item) => item.type === 'file' && item.name.toLowerCase().includes('prompt')
      );
      
      const promptsData: Prompt[] = [];
      
      for (const promptFile of promptFiles) {
        const content = await getFileContent(promptFile.path);
        promptsData.push({
          name: promptFile.name,
          path: promptFile.path,
          content,
        });
      }
      
      setPrompts(promptsData);
      
      // Filter image files
      const imageFiles = contents
        .filter((item) => item.type === 'file' && /\.(png|jpg|jpeg|gif)$/i.test(item.name))
        .map((img) => ({
          name: img.name,
          path: img.path,
          download_url: img.download_url || '',
        }));
      
      setImages(imageFiles);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching quiz contents:', err);
      setError(`Failed to load quiz contents: ${err.message || 'Unknown error'}`);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (path && Array.isArray(path)) {
      const fullPath = path.join('/');
      setQuizPath(fullPath);
      
      // Extract quiz name from path (e.g., "unit1/1-6" -> "Quiz 1-6")
      // Updated regex to handle both formats: "1-6" and "1-{7,8}"
      const quizMatch = fullPath.match(/(\d+-(?:\d+|\{\d+(?:,\d+)+\}))/i);
      if (quizMatch && quizMatch[1]) {
        // Format the display name to be user-friendly
        let displayName = quizMatch[1];
        // If it has curly braces, format it nicely
        if (displayName.includes('{')) {
          displayName = displayName.replace(/\{(\d+(?:,\d+)+)\}/g, '$1');
        }
        setQuizName(`Quiz ${displayName}`);
      } else {
        setQuizName(fullPath);
      }
      
      // Extract unit path for back navigation
      const unitMatch = fullPath.match(/(unit\d+)/i);
      if (unitMatch && unitMatch[1]) {
        setUnitPath(unitMatch[1]);
      }
      
      fetchQuizContents(fullPath);
    }

    // Check sessionStorage for MCQ number
    if (typeof window !== 'undefined') {
      const lastMcqNumber = sessionStorage.getItem('lastMcqNumber');
      if (lastMcqNumber) {
        setFromMcq(true);
        setMcqNumber(lastMcqNumber);
      }
    }
  }, [path, fetchQuizContents]);

  // Function to handle back navigation
  const handleBackNavigation = () => {
    if (fromMcq && mcqNumber) {
      // Clear the sessionStorage when navigating back
      sessionStorage.removeItem('lastMcqNumber');
      router.push(`/mcq-detail/${mcqNumber}`);
    } else {
      router.push(`/unit/${unitPath}`);
    }
  };

  if (!path) {
    return null;
  }

  return (
    <Layout title={`${quizName} - AP Statistics Hub`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={handleBackNavigation}
            className="mac-button inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" /> 
            {fromMcq && mcqNumber ? `Back to MCQ #${mcqNumber}` : 'Back to Unit'}
          </button>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">{quizName}</h1>
        
        {loading ? (
          <LoadingIndicator message="Loading quiz contents..." />
        ) : error ? (
          <div className="mac-window p-4 border-mac-border text-mac-black">
            <div className="mac-header p-2 mb-4">
              <h2 className="text-xl font-bold text-mac-white">Error Loading Content</h2>
            </div>
            <p className="mb-4">{error}</p>
            <p className="mb-4">This could be due to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>The content for this section is not yet available</li>
              <li>There was a problem with the URL format</li>
              <li>The server is temporarily unavailable</li>
            </ul>
            <div className="mt-4">
              <Link href={`/unit/${unitPath}`}>
                <a className="mac-button inline-flex items-center">
                  <FaArrowLeft className="mr-2" /> Return to Unit Page
                </a>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {images.length > 0 && (
              <div className="mac-window p-4 mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center mac-header p-2">
                  <FaImage className="mr-2 text-mac-white" /> <span className="text-mac-white">Images</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.path} className="mac-window p-2">
                      <div className="relative">
                        <img 
                          src={image.download_url} 
                          alt={image.name} 
                          className="w-full h-auto border border-mac-border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/filemissing.png'; // Use the file missing graphic
                          }}
                        />
                        <p className="text-sm text-center mt-1 truncate">{image.name}</p>
                        <div className="mt-2 flex justify-center">
                          <a 
                            href={image.download_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mac-button text-xs"
                          >
                            <FaExternalLinkAlt className="mr-1 inline-block" /> View Full Size
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {pdfs.length > 0 && (
              <div className="mac-window p-4 mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center mac-header p-2">
                  <FaFilePdf className="mr-2 text-mac-white" /> <span className="text-mac-white">PDF Resources</span>
                </h2>
                <div className="space-y-3">
                  {pdfs.map((pdf) => (
                    <PDFCard key={pdf.path} pdf={pdf} />
                  ))}
                </div>
              </div>
            )}
            
            {prompts.length > 0 && (
              <div className="mac-window p-4 mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center mac-header p-2">
                  <FaRobot className="mr-2 text-mac-white" /> <span className="text-mac-white">AI Tutor Prompts</span>
                </h2>
                <div className="space-y-6">
                  {prompts.map((prompt) => (
                    <PromptCard key={prompt.path} prompt={prompt} />
                  ))}
                </div>
              </div>
            )}
            
            <div className="mac-window p-4 mt-8">
              <QRCodeGenerator url={`/quiz/${quizPath}`} title={quizName} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
} 