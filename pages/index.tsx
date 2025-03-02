import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaGraduationCap, FaBookOpen, FaClipboardCheck } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <Layout title="AP Statistics Hub - Welcome">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        <div className="mac-window p-4 mb-6 w-full">
          <h1 className="text-3xl font-bold mb-0 flex items-center mac-header p-2">
            <FaGraduationCap className="mr-2 text-mac-white" /> 
            <span className="text-mac-white">AP Statistics Hub</span>
          </h1>
          
          <div className="p-4 text-center">
            <p className="mb-6 text-lg">
              Welcome to the AP Statistics Hub! Choose how you'd like to navigate the content:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="mac-window p-4 flex flex-col items-center">
                <div className="mac-header p-2 w-full mb-4">
                  <h2 className="text-xl font-bold text-mac-white flex items-center">
                    <FaBookOpen className="mr-2" /> Table of Contents
                  </h2>
                </div>
                <p className="mb-6">
                  Browse all units, sections, and resources organized by topic.
                </p>
                <Link href="/content-home">
                  <a className="mac-button text-lg py-2 px-6 w-full text-center">
                    View Table of Contents
                  </a>
                </Link>
              </div>
              
              <div className="mac-window p-4 flex flex-col items-center">
                <div className="mac-header p-2 w-full mb-4">
                  <h2 className="text-xl font-bold text-mac-white flex items-center">
                    <FaClipboardCheck className="mr-2" /> AP Exam Questions
                  </h2>
                </div>
                <p className="mb-6">
                  Navigate content through AP Exam questions (MCQs and FRQs).
                </p>
                <Link href="/exam-navigation">
                  <a className="mac-button text-lg py-2 px-6 w-full text-center">
                    Explore by Exam Questions
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 