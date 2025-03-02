import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaArrowLeft, FaPencilAlt } from 'react-icons/fa';

export default function FRQNavigation() {
  return (
    <Layout title="AP Statistics Hub - FRQ Navigation">
      <div className="max-w-4xl mx-auto">
        <div className="mac-window p-4 mb-6">
          <h1 className="text-3xl font-bold mb-0 flex items-center mac-header p-2">
            <FaPencilAlt className="mr-2 text-mac-white" /> 
            <span className="text-mac-white">Free Response Questions</span>
          </h1>
          <div className="mt-4">
            <Link href="/exam-navigation">
              <a className="mac-button inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Back to Exam Navigation
              </a>
            </Link>
          </div>
        </div>
        
        <div className="mac-window p-4 mb-8">
          <div className="mac-header p-2 mb-4">
            <h2 className="text-xl font-bold text-mac-white">Coming Soon</h2>
          </div>
          
          <div className="p-8 text-center">
            <p className="mb-6 text-lg">
              The Free Response Questions (FRQs) section is currently being developed.
            </p>
            <p className="mb-6">
              Please check back later for access to the 6 FRQs from the AP Statistics Exam.
            </p>
            <div className="mac-window p-4 inline-block">
              <p className="font-bold">FRQ Content Status: In Progress</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 