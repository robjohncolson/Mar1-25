import Head from 'next/head';
import { ReactNode } from 'react';
import Link from 'next/link';
import { FaGithub, FaHome } from 'react-icons/fa';
import SimpleUserMenu from './SimpleUserMenu';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ 
  children, 
  title = 'AP Statistics Hub', 
  description = 'A comprehensive resource for AP Statistics students and teachers'
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-mac">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://apstatshub.vercel.app" />
        <meta property="og:image" content="https://apstatshub.vercel.app/og-image.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://apstatshub.vercel.app/og-image.png" />
      </Head>

      <header className="mac-header">
        <div className="container mx-auto px-4 py-1 flex justify-between items-center">
          <Link href="/">
            <a className="text-xl font-bold flex items-center">
              <FaHome className="mr-2" /> AP Statistics Hub
            </a>
          </Link>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/robjohncolson/Mar1-25" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-mac-white hover:text-gray-200 transition-colors"
              aria-label="GitHub Repository"
            >
              <FaGithub size={20} />
            </a>
            <SimpleUserMenu />
          </div>
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