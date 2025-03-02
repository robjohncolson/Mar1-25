import { FaFilePdf, FaDownload, FaEye } from 'react-icons/fa';
import { PDF } from '@/utils/contentApi';

interface PDFCardProps {
  pdf: PDF;
}

export default function PDFCard({ pdf }: PDFCardProps) {
  // Create a download URL with the download parameter
  const downloadUrl = `${pdf.download_url}${pdf.download_url.includes('?') ? '&' : '?'}download=true`;
  
  return (
    <div className="mac-window p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
      <div className="flex items-center mb-2 sm:mb-0 max-w-full sm:max-w-[60%] overflow-hidden">
        <FaFilePdf className="text-mac-black text-2xl mr-3 flex-shrink-0" />
        <span className="font-medium truncate">{pdf.name}</span>
      </div>
      <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
        <a 
          href={pdf.download_url} 
          target="_blank"
          rel="noopener noreferrer"
          className="mac-button min-w-[100px] text-center"
        >
          <FaEye className="mr-2 inline-block" /> View
        </a>
        <a 
          href={downloadUrl} 
          download={pdf.name}
          className="mac-button min-w-[100px] text-center"
        >
          <FaDownload className="mr-2 inline-block" /> Download
        </a>
      </div>
    </div>
  );
} 