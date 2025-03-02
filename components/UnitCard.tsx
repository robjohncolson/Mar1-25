import Link from 'next/link';
import { FaFolder } from 'react-icons/fa';
import { Unit } from '@/utils/github';

interface UnitCardProps {
  unit: Unit;
}

export default function UnitCard({ unit }: UnitCardProps) {
  return (
    <Link href={`/unit/${unit.path}`}>
      <a className="block">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 hover:bg-blue-50 cursor-pointer">
          <div className="flex items-center">
            <FaFolder className="text-blue-500 text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-semibold">{unit.name}</h2>
              <p className="text-gray-600 mt-1">{unit.quizzes.length} quizzes available</p>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
} 