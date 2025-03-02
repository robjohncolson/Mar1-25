import Link from 'next/link';
import Layout from '@/components/Layout';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

export default function Custom404() {
  return (
    <Layout title="404 - Page Not Found">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mac-window p-6 text-center">
          <FaExclamationTriangle className="text-mac-black text-6xl mb-6 mx-auto" />
          <h1 className="text-3xl font-bold mb-4 mac-header p-2 text-mac-white">404 - Page Not Found</h1>
          <p className="text-mac-black mb-8 max-w-md">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link href="/">
            <a className="mac-button inline-flex items-center mx-auto">
              <FaHome className="mr-2" /> Return to Home
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
} 