import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import QuizCard from '@/components/QuizCard';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { getQuizzesForUnit, Quiz } from '@/utils/contentApi';
import { FaSpinner, FaArrowLeft, FaBook } from 'react-icons/fa';
import Link from 'next/link';

export default function UnitPage() {
  const router = useRouter();
  const { path } = router.query;
  
  const [unitPath, setUnitPath] = useState('');
  const [unitName, setUnitName] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuizzes = useCallback(async (fullPath: string) => {
    try {
      const quizzesData = await getQuizzesForUnit(fullPath);
      setQuizzes(quizzesData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to load quizzes. Please try again later.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (path && Array.isArray(path)) {
      const fullPath = path.join('/');
      setUnitPath(fullPath);
      
      // Extract unit number from path (e.g., "unit1" -> "Unit 1")
      const unitMatch = fullPath.match(/unit(\d+)/i);
      if (unitMatch && unitMatch[1]) {
        setUnitName(`Unit ${unitMatch[1]}`);
      } else {
        setUnitName(fullPath);
      }
      
      fetchQuizzes(fullPath);
    }
  }, [path, fetchQuizzes]);

  if (!path) {
    return null;
  }

  return (
    <Layout title={`${unitName} - AP Statistics Hub`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <a className="mac-button inline-flex items-center">
              <FaArrowLeft className="mr-2" /> Back to Units
            </a>
          </Link>
        </div>
        
        <div className="mac-window p-4 mb-6">
          <h1 className="text-3xl font-bold mb-0 flex items-center mac-header p-2">
            <FaBook className="mr-2 text-mac-white" /> <span className="text-mac-white">{unitName}</span>
          </h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-mac-black text-4xl" />
          </div>
        ) : error ? (
          <div className="mac-window p-4 border-mac-border text-mac-black">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.path} quiz={quiz} unitPath={unitPath} />
              ))}
            </div>
            
            <div className="mac-window p-4 mt-8">
              <QRCodeGenerator url={`/unit/${unitPath}`} title={unitName} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
} 