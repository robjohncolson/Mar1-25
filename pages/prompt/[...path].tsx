import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { getFileContent } from '@/utils/contentApi';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function PromptPage() {
  const router = useRouter();
  const { path } = router.query;
  
  const [promptContent, setPromptContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPromptContent() {
      if (!path) return;
      
      try {
        // Convert path array to string with slashes
        const promptPath = Array.isArray(path) ? path.join('/') : path;
        const content = await getFileContent(promptPath);
        setPromptContent(content);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching prompt content:', err);
        setError('Failed to load prompt content. Please try again later.');
        setLoading(false);
      }
    }

    fetchPromptContent();
  }, [path]);

  // Extract filename from path
  const filename = Array.isArray(path) ? path[path.length - 1] : '';

  return (
    <Layout title={`AP Statistics Hub - ${filename}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <a className="text-blue-600 hover:underline flex items-center">
              <FaArrowLeft className="mr-2" /> Back to Home
            </a>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">{filename}</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-blue-600 text-4xl" />
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="prose prose-lg max-w-none whitespace-pre-wrap">
              {promptContent}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 