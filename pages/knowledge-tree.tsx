import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import LoadingIndicator from '@/components/LoadingIndicator';
import { getKnowledgeTree } from '@/utils/contentApi';
import { FaTree, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function KnowledgeTree() {
  const [knowledgeTree, setKnowledgeTree] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchKnowledgeTree() {
      try {
        const content = await getKnowledgeTree();
        setKnowledgeTree(content);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching knowledge tree:', err);
        setError('Failed to load knowledge tree. Please try again later.');
        setLoading(false);
      }
    }

    fetchKnowledgeTree();
  }, []);

  return (
    <Layout title="AP Statistics Hub - Knowledge Tree">
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
            <FaTree className="mr-2 text-mac-white" /> <span className="text-mac-white">AP Statistics Knowledge Tree</span>
          </h1>
        </div>

        {loading ? (
          <LoadingIndicator message="Loading knowledge tree..." />
        ) : error ? (
          <div className="mac-window p-4 border-mac-border text-mac-black">
            {error}
          </div>
        ) : (
          <div className="mac-window p-4">
            <div className="font-mac">
              {knowledgeTree.split('\n').map((line, index) => {
                // Check if line is a heading
                if (line.startsWith('#')) {
                  const match = line.match(/^#+/);
                  if (!match) return <p key={index}>{line}</p>;
                  
                  const level = match[0].length;
                  const text = line.replace(/^#+\s*/, '');
                  
                  if (level === 1) {
                    return <h1 key={index} className="text-2xl font-bold mt-6 mb-4 mac-header p-2 text-mac-white">{text}</h1>;
                  } else if (level === 2) {
                    return <h2 key={index} className="text-xl font-bold mt-5 mb-3 mac-header p-1 text-mac-white">{text}</h2>;
                  } else {
                    return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{text}</h3>;
                  }
                }
                
                // Check if line is a list item
                if (line.match(/^\s*[-•├└│]/) || line.match(/^\s*\d+\./)) {
                  // Determine indentation level
                  const indentMatch = line.match(/^\s*/);
                  const indent = indentMatch ? indentMatch[0].length : 0;
                  const indentClass = `ml-${Math.min(indent * 4, 16)}`;
                  
                  // Format the line
                  let formattedLine = line.trim();
                  
                  // Handle tree-style formatting
                  if (formattedLine.startsWith('├')) {
                    formattedLine = '• ' + formattedLine.substring(1).trim();
                  } else if (formattedLine.startsWith('└')) {
                    formattedLine = '• ' + formattedLine.substring(1).trim();
                  } else if (formattedLine.startsWith('│')) {
                    formattedLine = '| ' + formattedLine.substring(1).trim();
                  } else if (formattedLine.startsWith('-')) {
                    formattedLine = '• ' + formattedLine.substring(1).trim();
                  }
                  
                  return (
                    <div key={index} className={`${indentClass} my-1`}>
                      {formattedLine}
                    </div>
                  );
                }
                
                // Empty lines become spacing
                if (line.trim() === '') {
                  return <div key={index} className="h-4"></div>;
                }
                
                // Regular text
                return <p key={index} className="my-2">{line}</p>;
              })}
            </div>
          </div>
        )}
        
        {!loading && !error && (
          <div className="mac-window p-4 mt-8">
            <QRCodeGenerator url="/knowledge-tree" title="AP Statistics Knowledge Tree" />
          </div>
        )}
      </div>
    </Layout>
  );
} 