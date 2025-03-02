import Link from 'next/link';
import Layout from '@/components/Layout';
import { FaExclamationCircle, FaHome } from 'react-icons/fa';

export default function Custom500() {
  return (
    <Layout title="500 - Server Error">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mac-window p-6 text-center">
          <FaExclamationCircle className="text-mac-black text-6xl mb-6 mx-auto" />
          <h1 className="text-3xl font-bold mb-4 mac-header p-2 text-mac-white">500 - Server Error</h1>
          <p className="text-mac-black mb-8 max-w-md">
            Sorry, something went wrong on our server. We're working to fix the issue.
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