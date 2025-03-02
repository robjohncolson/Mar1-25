import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaArrowLeft, FaClipboardCheck, FaListOl, FaPencilAlt } from 'react-icons/fa';
import QRCodeGenerator from '@/components/QRCodeGenerator';

export default function ExamNavigation() {
  return (
    <Layout title="AP Statistics Hub - Exam Navigation">
      <div className="max-w-4xl mx-auto">
        <div className="mac-window p-4 mb-6">
          <h1 className="text-3xl font-bold mb-0 flex items-center mac-header p-2">
            <FaClipboardCheck className="mr-2 text-mac-white" /> 
            <span className="text-mac-white">AP Exam Question Navigation</span>
          </h1>
          <div className="mt-4">
            <Link href="/">
              <a className="mac-button inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Back to Navigation Options
              </a>
            </Link>
          </div>
        </div>
        
        <div className="mac-window p-4 mb-8">
          <div className="mac-header p-2 mb-4">
            <h2 className="text-xl font-bold text-mac-white">Choose Question Type</h2>
          </div>
          
          <p className="mb-6">
            The AP Statistics Exam consists of 40 Multiple Choice Questions (MCQs) and 6 Free Response Questions (FRQs).
            Select which type of questions you'd like to explore:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="mac-window p-4 flex flex-col items-center">
              <div className="mac-header p-2 w-full mb-4">
                <h3 className="text-lg font-bold text-mac-white flex items-center">
                  <FaListOl className="mr-2" /> Multiple Choice Questions
                </h3>
              </div>
              <p className="mb-6 text-center">
                Navigate through the 40 multiple choice questions from the AP Statistics Exam.
              </p>
              <Link href="/mcq-navigation">
                <a className="mac-button text-lg py-2 px-6 w-full text-center">
                  Explore MCQs
                </a>
              </Link>
            </div>
            
            <div className="mac-window p-4 flex flex-col items-center">
              <div className="mac-header p-2 w-full mb-4">
                <h3 className="text-lg font-bold text-mac-white flex items-center">
                  <FaPencilAlt className="mr-2" /> Free Response Questions
                </h3>
              </div>
              <p className="mb-6 text-center">
                Navigate through the 6 free response questions from the AP Statistics Exam.
              </p>
              <div className="w-full">
                <Link href="/frq-navigation">
                  <a className="mac-button text-lg py-2 px-6 w-full text-center opacity-50 cursor-not-allowed" 
                     onClick={(e) => e.preventDefault()}>
                    Explore FRQs (Coming Soon)
                  </a>
                </Link>
                <p className="text-xs text-center mt-2 italic">FRQ content is currently being processed</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mac-window p-4 mt-8">
          <QRCodeGenerator url="/exam-navigation" title="Exam Navigation" />
        </div>
      </div>
    </Layout>
  );
} 