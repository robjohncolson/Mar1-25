import { FaFilePdf, FaDownload, FaEye } from 'react-icons/fa';
import { PDF } from '@/utils/github';

interface PDFCardProps {
  pdf: PDF;
}

export default function PDFCard({ pdf }: PDFCardProps) {
  // Create a download URL with the download parameter
  const downloadUrl = `${pdf.download_url}&download=true`;
  
  return (
    <div className="mac-window p-4 flex justify-between items-center mb-3">
      <div className="flex items-center">
        <FaFilePdf className="text-mac-black text-2xl mr-3" />
        <span className="font-medium">{pdf.name}</span>
      </div>
      <div className="flex space-x-2">
        <a 
          href={pdf.download_url} 
          target="_blank"
          rel="noopener noreferrer"
          className="mac-button"
        >
          <FaEye className="mr-2 inline-block" /> View
        </a>
        <a 
          href={downloadUrl} 
          download={pdf.name}
          className="mac-button"
        >
          <FaDownload className="mr-2 inline-block" /> Download
        </a>
      </div>
    </div>
  );
} 