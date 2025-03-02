import { FaInfoCircle, FaClipboard, FaDownload, FaExternalLinkAlt, FaQuestionCircle } from 'react-icons/fa';

export default function HowToUse() {
  return (
    <div className="mac-window p-4 mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center mac-header p-2">
        <FaQuestionCircle className="mr-2 text-mac-white" /> <span className="text-mac-white">How to Use This App</span>
      </h2>
      
      <div className="space-y-4 p-2">
        <div className="mac-window p-2">
          <h3 className="text-lg font-semibold mb-2 mac-header p-1 text-mac-white">1. Navigate the Resources</h3>
          <p>Browse through the units and quizzes to find the AP Statistics resources you need.</p>
        </div>
        
        <div className="mac-window p-2">
          <h3 className="text-lg font-semibold mb-2 mac-header p-1 text-mac-white">2. Download PDFs</h3>
          <p className="flex items-start">
            <FaDownload className="mr-2 mt-1 text-mac-black" /> 
            Click the Download button on any PDF to save it to your device.
          </p>
        </div>
        
        <div className="mac-window p-2">
          <h3 className="text-lg font-semibold mb-2 mac-header p-1 text-mac-white">3. Copy AI Tutor Prompts</h3>
          <p className="flex items-start">
            <FaClipboard className="mr-2 mt-1 text-mac-black" /> 
            Use the "Copy Prompt" button to copy the AI tutor prompt to your clipboard.
          </p>
        </div>
        
        <div className="mac-window p-2">
          <h3 className="text-lg font-semibold mb-2 mac-header p-1 text-mac-white">4. Use with Grok.com</h3>
          <p className="flex items-start">
            <FaExternalLinkAlt className="mr-2 mt-1 text-mac-black" /> 
            Click "Open in Grok" to open grok.com in a new tab. Paste the copied prompt and upload the downloaded PDFs to get AI-assisted tutoring.
          </p>
        </div>
        
        <div className="mac-window p-2">
          <h3 className="text-lg font-semibold mb-2 mac-header p-1 text-mac-white">5. Mobile Access with QR Codes</h3>
          <p>Use the QR codes to quickly access specific units or quizzes on your mobile device.</p>
        </div>
      </div>
    </div>
  );
} 