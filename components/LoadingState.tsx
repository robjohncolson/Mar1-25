import { FaSpinner } from 'react-icons/fa';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <FaSpinner className="animate-spin text-blue-600 text-4xl mb-4" />
      <p className="text-gray-600 dark:text-gray-300">{message}</p>
    </div>
  );
} 