import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import PDFCard from '@/components/PDFCard';
import PromptCard from '@/components/PromptCard';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import LoadingIndicator from '@/components/LoadingIndicator';
import { getDirectoryContents, getFileContent, PDF, Prompt, Image } from '@/utils/contentApi';
import { FaArrowLeft, FaImage, FaFilePdf, FaRobot, FaExternalLinkAlt } from 'react-icons/fa';
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

  const fetchQuizContents = useCallback(async (fullPath: string) => {
    try {
      const contents = await getDirectoryContents(fullPath);
      
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
    } catch (err) {
      console.error('Error fetching quiz contents:', err);
      setError('Failed to load quiz contents. Please try again later.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (path && Array.isArray(path)) {
      const fullPath = path.join('/');
      setQuizPath(fullPath);
      
      // Extract unit path and quiz name
      const pathParts = path.slice();
      const quizDirName = pathParts.pop() || '';
      
      // Format quiz name
      let formattedQuizName = quizDirName;
      if (formattedQuizName.includes('{') && formattedQuizName.includes('}')) {
        // Handle cases like 1-{7,8} to display as "Quiz 1-7,8"
        formattedQuizName = formattedQuizName.replace('{', '').replace('}', '');
      }
      
      setQuizName(`Quiz ${formattedQuizName}`);
      
      // Extract unit path
      const unitPathParts = pathParts.slice();
      setUnitPath(unitPathParts.join('/'));
      
      fetchQuizContents(fullPath);
    }
  }, [path, fetchQuizContents]);

  if (!path) {
    return null;
  }

  return (
    <Layout title={`${quizName} - AP Statistics Hub`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href={unitPath ? `/unit/${unitPath.split('/')[0]}` : '/'}>
            <a className="mac-button inline-flex items-center">
              <FaArrowLeft className="mr-2" /> Back to Unit
            </a>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">{quizName}</h1>
        
        {loading ? (
          <LoadingIndicator message="Loading quiz contents..." />
        ) : error ? (
          <div className="mac-window p-4 border-mac-border text-mac-black">
            {error}
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