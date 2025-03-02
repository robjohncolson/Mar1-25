import Link from 'next/link';
import { FaFileAlt, FaImage, FaBook } from 'react-icons/fa';
import { Quiz } from '@/utils/github';

interface QuizCardProps {
  quiz: Quiz;
  unitPath: string;
}

export default function QuizCard({ quiz, unitPath }: QuizCardProps) {
  return (
    <Link href={`/quiz/${quiz.path}`}>
      <a className="block mb-4">
        <div className="mac-window p-4 hover:bg-mac-light transition-colors duration-300 cursor-pointer">
          <div className="flex items-center">
            <FaFileAlt className="text-mac-black text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-semibold">{quiz.name}</h2>
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