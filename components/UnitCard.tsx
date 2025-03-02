import Link from 'next/link';
import { FaFolder } from 'react-icons/fa';
import { Unit } from '@/utils/github';

interface UnitCardProps {
  unit: Unit;
}

export default function UnitCard({ unit }: UnitCardProps) {
  return (
    <Link href={`/unit/${unit.path}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex items-center">
        <FaFolder className="text-blue-500 text-3xl mr-4" />
        <div>
          <h2 className="text-xl font-semibold">{unit.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{unit.quizzes.length} quizzes available</p>
        </div>
      </div>
    </Link>
  );
} 