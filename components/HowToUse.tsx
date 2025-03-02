import { FaInfoCircle, FaClipboard, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';

export default function HowToUse() {
  return (
    <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaInfoCircle className="mr-2 text-blue-600 dark:text-blue-400" /> How to Use This App
      </h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">1. Navigate the Resources</h3>
          <p>Browse through the units and quizzes to find the AP Statistics resources you need.</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">2. Download PDFs</h3>
          <p className="flex items-start">
            <FaDownload className="mr-2 mt-1 text-blue-600 dark:text-blue-400" /> 
            Click the Download button on any PDF to save it to your device.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">3. Copy AI Tutor Prompts</h3>
          <p className="flex items-start">
            <FaClipboard className="mr-2 mt-1 text-blue-600 dark:text-blue-400" /> 
            Use the "Copy Prompt" button to copy the AI tutor prompt to your clipboard.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">4. Use with Grok.com</h3>
          <p className="flex items-start">
            <FaExternalLinkAlt className="mr-2 mt-1 text-blue-600 dark:text-blue-400" /> 
            Click "Open in Grok" to open grok.com in a new tab. Paste the copied prompt and upload the downloaded PDFs to get AI-assisted tutoring.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">5. Mobile Access with QR Codes</h3>
          <p>Use the QR codes to quickly access specific units or quizzes on your mobile device.</p>
        </div>
      </div>
    </div>
  );
} 