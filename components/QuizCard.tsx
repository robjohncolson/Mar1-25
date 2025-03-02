import Link from 'next/link';
import { FaFileAlt } from 'react-icons/fa';
import { Quiz } from '@/utils/github';

interface QuizCardProps {
  quiz: Quiz;
  unitPath: string;
}

export default function QuizCard({ quiz, unitPath }: QuizCardProps) {
  return (
    <Link href={`/quiz/${quiz.path}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex items-center">
        <FaFileAlt className="text-green-500 text-3xl mr-4" />
        <div>
          <h2 className="text-xl font-semibold">{quiz.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {quiz.pdfs.length} PDFs, {quiz.prompts.length} prompts
          </p>
        </div>
      </div>
    </Link>
  );
} 