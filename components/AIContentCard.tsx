import Link from 'next/link';
import { FaFileAlt, FaImage, FaRobot, FaBook } from 'react-icons/fa';
import { Quiz } from '@/utils/contentApi';
import { useRouter } from 'next/router';

interface AIContentCardProps {
  quiz: Quiz;
  unitPath: string;
}

export default function AIContentCard({ quiz, unitPath }: AIContentCardProps) {
  const router = useRouter();
  const { from, id } = router.query;
  
  // Construct the query string to preserve navigation context
  const queryString = from === 'mcq' && id ? `?from=mcq&id=${id}&t=${Date.now()}` : '';
  
  // Skip rendering if there's no AI content
  if (quiz.pdfs.length === 0 && quiz.prompts.length === 0 && quiz.images.length === 0) {
    return null;
  }
  
  return (
    <Link href={`/quiz/${quiz.path}${queryString}`}>
      <a className="block mb-4">
        <div className="mac-window p-4 hover:bg-mac-light transition-colors duration-300 cursor-pointer border-l-4 border-blue-500">
          <div className="flex items-center">
            <FaRobot className="text-blue-500 text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-semibold">{quiz.name}</h2>
              <p className="text-sm text-gray-600 mb-2">AI Content & Study Materials</p>
              <div className="text-mac-dark mt-1 flex flex-wrap gap-2">
                {quiz.pdfs.length > 0 && (
                  <span className="flex items-center">
                    <FaFileAlt className="mr-1" /> {quiz.pdfs.length} PDFs
                  </span>
                )}
                {quiz.prompts.length > 0 && (
                  <span className="flex items-center ml-2">
                    <FaBook className="mr-1" /> {quiz.prompts.length} prompts
                  </span>
                )}
                {quiz.images && quiz.images.length > 0 && (
                  <span className="flex items-center ml-2">
                    <FaImage className="mr-1" /> {quiz.images.length} images
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
} 