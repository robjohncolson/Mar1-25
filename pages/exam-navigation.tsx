import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaArrowLeft, FaClipboardCheck, FaListOl, FaPencilAlt, FaCalendarAlt } from 'react-icons/fa';
import QRCodeGenerator from '@/components/QRCodeGenerator';

export default function ExamNavigation() {
  const [selectedYear, setSelectedYear] = useState('2017');
  const examYears = ['2017', '2018', '2019'];

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
            <h2 className="text-xl font-bold text-mac-white flex items-center">
              <FaCalendarAlt className="mr-2" /> Select Exam Year
            </h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            {examYears.map((year) => (
              <button
                key={year}
                className={`mac-button text-lg py-2 px-6 w-full text-center ${
                  selectedYear === year ? 'bg-blue-500 text-white' : ''
                }`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mac-window p-4 mb-8">
          <div className="mac-header p-2 mb-4">
            <h2 className="text-xl font-bold text-mac-white">Choose Question Type</h2>
          </div>
          
          <p className="mb-6">
            The AP Statistics Exam consists of 40 Multiple Choice Questions (MCQs) and 6 Free Response Questions (FRQs).
            Select which type of questions you'd like to explore from the {selectedYear} exam:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="mac-window p-4 flex flex-col items-center">
              <div className="mac-header p-2 w-full mb-4">
                <h3 className="text-lg font-bold text-mac-white flex items-center">
                  <FaListOl className="mr-2" /> Multiple Choice Questions
                </h3>
              </div>
              <p className="mb-6 text-center">
                Navigate through the 40 multiple choice questions from the {selectedYear} AP Statistics Exam.
              </p>
              <Link href={`/mcq-navigation?year=${selectedYear}`}>
                <a className="mac-button text-lg py-2 px-6 w-full text-center whitespace-normal h-auto min-h-[48px] flex items-center justify-center">
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
                Navigate through the 6 free response questions from the {selectedYear} AP Statistics Exam.
              </p>
              <div className="w-full">
                <Link href={`/frq-navigation?year=${selectedYear}`}>
                  <a className="mac-button text-lg py-2 px-6 w-full text-center whitespace-normal h-auto min-h-[48px] flex items-center justify-center">
                    Explore FRQs
                  </a>
                </Link>
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