import Link from 'next/link';
import { FaFolder } from 'react-icons/fa';
import { Unit } from '@/utils/github';

interface UnitCardProps {
  unit: Unit;
}

export default function UnitCard({ unit }: UnitCardProps) {
  return (
    <Link href={`/unit/${unit.path}`}>
      <a className="block mb-4">
        <div className="mac-window p-4 hover:bg-mac-light transition-colors duration-300 cursor-pointer">
          <div className="flex items-center">
            <FaFolder className="text-mac-black text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-semibold">{unit.name}</h2>
              <p className="text-mac-dark mt-1">{unit.quizzes.length} quizzes available</p>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
} 