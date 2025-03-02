import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import LoadingIndicator from '@/components/LoadingIndicator';
import { getFileContent } from '@/utils/contentApi';
import { FaArrowLeft, FaRobot } from 'react-icons/fa';
import Link from 'next/link';

export default function PromptPage() {
  const router = useRouter();
  const { path } = router.query;
  
  const [promptContent, setPromptContent] = useState<string>('');
  const [promptPath, setPromptPath] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPromptContent() {
      if (!path) return;
      
      try {
        // Convert path array to string with slashes
        const fullPath = Array.isArray(path) ? path.join('/') : path;
        setPromptPath(fullPath);
        const content = await getFileContent(fullPath);
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
            <a className="mac-button inline-flex items-center">
              <FaArrowLeft className="mr-2" /> Back to Home
            </a>
          </Link>
        </div>
        
        <div className="mac-window p-4 mb-6">
          <h1 className="text-2xl font-bold mb-0 flex items-center mac-header p-2">
            <FaRobot className="mr-2 text-mac-white" /> <span className="text-mac-white">{filename}</span>
          </h1>
        </div>
        
        {loading ? (
          <LoadingIndicator message="Loading prompt content..." />
        ) : error ? (
          <div className="mac-window p-4 border-mac-border text-mac-black">
            {error}
          </div>
        ) : (
          <div className="mac-window p-4">
            <div className="whitespace-pre-wrap font-mac">
              {promptContent}
            </div>
          </div>
        )}
        
        {!loading && !error && (
          <div className="mac-window p-4 mt-8">
            <QRCodeGenerator url={`/prompt/${promptPath}`} title={filename} />
          </div>
        )}
      </div>
    </Layout>
  );
} 