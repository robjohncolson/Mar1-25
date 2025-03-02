import { FaSpinner } from 'react-icons/fa';

interface LoadingIndicatorProps {
  message?: string;
}

export default function LoadingIndicator({ message = 'Loading...' }: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="mac-window p-4 flex flex-col items-center">
        <FaSpinner className="animate-spin text-mac-black text-3xl mb-3" />
        <p className="text-mac-black">{message}</p>
      </div>
    </div>
  );
} 