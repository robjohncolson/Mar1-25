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
    <div className="mac-window p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <FaFileAlt className="text-mac-black mr-2" /> {prompt.name}
        </h3>
        <button
          onClick={copyToClipboard}
          className="mac-button"
        >
          {copied ? (
            <>
              <FaCheck className="mr-2 inline-block" /> Copied!
            </>
          ) : (
            <>
              <FaCopy className="mr-2 inline-block" /> Copy Prompt
            </>
          )}
        </button>
      </div>
      <div className="bg-mac-white border border-mac-border shadow-mac-inset p-4 overflow-auto max-h-64">
        <pre className="whitespace-pre-wrap text-sm">{prompt.content}</pre>
      </div>
      <div className="mt-4">
        <a
          href="https://grok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mac-button inline-block"
        >
          Open in Grok
        </a>
      </div>
    </div>
  );
} 