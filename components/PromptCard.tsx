import { useState } from 'react';
import { FaFileAlt, FaCopy, FaCheck } from 'react-icons/fa';
import { Prompt } from '@/utils/github';

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <FaFileAlt className="text-blue-500 mr-2" /> {prompt.name}
        </h3>
        <button
          onClick={copyToClipboard}
          className={`flex items-center py-2 px-4 rounded ${
            copied 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-colors duration-200`}
        >
          {copied ? (
            <>
              <FaCheck className="mr-2" /> Copied!
            </>
          ) : (
            <>
              <FaCopy className="mr-2" /> Copy Prompt
            </>
          )}
        </button>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-auto max-h-64">
        <pre className="whitespace-pre-wrap text-sm">{prompt.content}</pre>
      </div>
      <div className="mt-4">
        <a
          href="https://grok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded inline-flex items-center"
        >
          Open in Grok
        </a>
      </div>
    </div>
  );
} 