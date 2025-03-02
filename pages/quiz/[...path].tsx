import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import PDFCard from '@/components/PDFCard';
import PromptCard from '@/components/PromptCard';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { getRepoContents, getFileContent, PDF, Prompt } from '@/utils/github';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function QuizPage() {
  const router = useRouter();
  const { path } = router.query;
  
  const [quizPath, setQuizPath] = useState('');
  const [quizName, setQuizName] = useState('');
  const [unitPath, setUnitPath] = useState('');
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (path && Array.isArray(path)) {
      const fullPath = path.join('/');
      setQuizPath(fullPath);
      
      // Extract unit path and quiz name
      const pathParts = path.slice();
      const quizDirName = pathParts.pop() || '';
      setQuizName(`Quiz ${quizDirName}`);
      setUnitPath(pathParts.join('/'));
      
      async function fetchQuizContents() {
        try {
          const contents = await getRepoContents(fullPath);
          
          // Filter PDFs
          const pdfFiles = contents
            .filter((item) => item.type === 'file' && item.name.toLowerCase().endsWith('.pdf'))
            .map((pdf) => ({
              name: pdf.name,
              path: pdf.path,
              download_url: pdf.download_url || '',
            }));
          
          setPdfs(pdfFiles);
          
          // Filter prompt text files
          const promptFiles = contents.filter(
            (item) => item.type === 'file' && item.name.toLowerCase().endsWith('.txt')
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
          setLoading(false);
        } catch (err) {
          console.error('Error fetching quiz contents:', err);
          setError('Failed to load quiz contents. Please try again later.');
          setLoading(false);
        }
      }

      fetchQuizContents();
    }
  }, [path]);

  if (!path) {
    return null;
  }

  return (
    <Layout title={`${quizName} - AP Statistics Hub`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href={`/unit/${unitPath}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" /> Back to Unit
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">{quizName}</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-blue-600 text-4xl" />
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            {pdfs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">PDF Resources</h2>
                <div className="space-y-3">
                  {pdfs.map((pdf) => (
                    <PDFCard key={pdf.path} pdf={pdf} />
                  ))}
                </div>
              </div>
            )}
            
            {prompts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">AI Tutor Prompts</h2>
                <div className="space-y-6">
                  {prompts.map((prompt) => (
                    <PromptCard key={prompt.path} prompt={prompt} />
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8">
              <QRCodeGenerator url={`/quiz/${quizPath}`} title={quizName} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
} 