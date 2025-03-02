import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FaGithub, FaHome } from 'react-icons/fa';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'AP Statistics Hub' }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content="AP Statistics Resources Hub" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header className="bg-blue-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold flex items-center">
            <FaHome className="mr-2" /> AP Statistics Hub
          </Link>
          <a 
            href="https://github.com/OWNER_NAME/REPO_NAME" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:text-blue-200"
          >
            <FaGithub className="mr-1" /> GitHub
          </a>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>© {new Date().getFullYear()} AP Statistics Hub</p>
        </div>
      </footer>
    </div>
  );
} 