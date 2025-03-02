import Link from 'next/link';
import Layout from '@/components/Layout';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

export default function Custom404() {
  return (
    <Layout title="404 - Page Not Found">
      <div className="flex flex-col items-center justify-center py-12">
        <FaExclamationTriangle className="text-yellow-500 text-6xl mb-6" />
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center">
          <FaHome className="mr-2" /> Return to Home
        </Link>
      </div>
    </Layout>
  );
} 