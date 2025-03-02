import { FaFilePdf, FaDownload } from 'react-icons/fa';
import { PDF } from '@/utils/github';

interface PDFCardProps {
  pdf: PDF;
}

export default function PDFCard({ pdf }: PDFCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center">
        <FaFilePdf className="text-red-500 text-2xl mr-3" />
        <span className="font-medium">{pdf.name}</span>
      </div>
      <a 
        href={pdf.download_url} 
        download
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
      >
        <FaDownload className="mr-2" /> Download
      </a>
    </div>
  );
} 