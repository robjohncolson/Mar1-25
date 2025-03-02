import Link from 'next/link';
import { FaVideo, FaGamepad, FaGraduationCap, FaExternalLinkAlt } from 'react-icons/fa';
import { Quiz } from '@/utils/contentApi';
import { useRouter } from 'next/router';

interface MultimediaResourceCardProps {
  quiz: Quiz;
  unitPath: string;
}

export default function MultimediaResourceCard({ quiz, unitPath }: MultimediaResourceCardProps) {
  const router = useRouter();
  const { from, id } = router.query;
  
  // Construct the query string to preserve navigation context
  const queryString = from === 'mcq' && id ? `?from=mcq&id=${id}&t=${Date.now()}` : '';
  
  // Skip rendering if there are no multimedia resources
  if (!quiz.resources || 
      (!quiz.resources.videos || quiz.resources.videos.length === 0) && 
      (!quiz.resources.practice || quiz.resources.practice.length === 0) && 
      (!quiz.resources.other || quiz.resources.other.length === 0)) {
    return null;
  }
  
  // Count resources
  const videoCount = quiz.resources.videos?.length || 0;
  const practiceCount = quiz.resources.practice?.length || 0;
  const otherCount = quiz.resources.other?.length || 0;
  
  return (
    <Link href={`/quiz/${quiz.path}${queryString}`}>
      <a className="block mb-4">
        <div className="mac-window p-4 hover:bg-mac-light transition-colors duration-300 cursor-pointer border-l-4 border-green-500">
          <div className="flex items-center">
            <FaVideo className="text-green-500 text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-semibold">{quiz.name}</h2>
              <p className="text-sm text-gray-600 mb-2">Multimedia & Interactive Resources</p>
              <div className="text-mac-dark mt-1 flex flex-wrap gap-2">
                {videoCount > 0 && (
                  <span className="flex items-center">
                    <FaVideo className="mr-1" /> {videoCount} videos
                  </span>
                )}
                {practiceCount > 0 && (
                  <span className="flex items-center ml-2">
                    <FaGamepad className="mr-1" /> {practiceCount} practice
                  </span>
                )}
                {otherCount > 0 && (
                  <span className="flex items-center ml-2">
                    <FaExternalLinkAlt className="mr-1" /> {otherCount} resources
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