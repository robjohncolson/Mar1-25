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
    <div className="min-h-screen flex flex-col font-mac">
      <Head>
        <title>{title}</title>
        <meta name="description" content="AP Statistics Resources Hub" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header className="mac-header">
        <div className="container mx-auto px-4 py-1 flex justify-between items-center">
          <Link href="/">
            <a className="text-xl font-bold flex items-center">
              <FaHome className="mr-2" /> AP Statistics Hub
            </a>
          </Link>
          <a 
            href="https://github.com/OWNER_NAME/REPO_NAME" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <FaGithub className="mr-1" /> GitHub
          </a>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mac-window p-4">
          {children}
        </div>
      </main>

      <footer className="bg-mac-light py-2 border-t-2 border-mac-border">
        <div className="container mx-auto px-4 text-center text-mac-black">
          <p>© {new Date().getFullYear()} AP Statistics Hub</p>
        </div>
      </footer>
    </div>
  );
} 