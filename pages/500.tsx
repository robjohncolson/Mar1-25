import Link from 'next/link';
import Layout from '@/components/Layout';
import { FaExclamationCircle, FaHome } from 'react-icons/fa';

export default function Custom500() {
  return (
    <Layout title="500 - Server Error">
      <div className="flex flex-col items-center justify-center py-12">
        <FaExclamationCircle className="text-red-500 text-6xl mb-6" />
        <h1 className="text-4xl font-bold mb-4">500 - Server Error</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
          Sorry, something went wrong on our server. We're working to fix the issue.
        </p>
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center">
          <FaHome className="mr-2" /> Return to Home
        </Link>
      </div>
    </Layout>
  );
} 