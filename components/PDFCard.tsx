import { FaFilePdf, FaDownload } from 'react-icons/fa';
import { PDF } from '@/utils/github';

interface PDFCardProps {
  pdf: PDF;
}

export default function PDFCard({ pdf }: PDFCardProps) {
  return (
    <div className="mac-window p-4 flex justify-between items-center mb-3">
      <div className="flex items-center">
        <FaFilePdf className="text-mac-black text-2xl mr-3" />
        <span className="font-medium">{pdf.name}</span>
      </div>
      <a 
        href={pdf.download_url} 
        download
        className="mac-button"
      >
        <FaDownload className="mr-2 inline-block" /> Download
      </a>
    </div>
  );
} 