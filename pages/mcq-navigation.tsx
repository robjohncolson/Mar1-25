import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaArrowLeft, FaListOl } from 'react-icons/fa';

// Generate 40 pastel colors for the MCQ buttons
const generatePastelColors = (count: number) => {
  const colors = [];
  const hueStep = 360 / count;
  
  for (let i = 0; i < count; i++) {
    const hue = i * hueStep;
    colors.push(`hsl(${hue}, 70%, 80%)`);
  }
  
  return colors;
};

const pastelColors = generatePastelColors(40);

export default function MCQNavigation() {
  return (
    <Layout title="AP Statistics Hub - MCQ Navigation">
      <div className="max-w-4xl mx-auto">
        <div className="mac-window p-4 mb-6">
          <h1 className="text-3xl font-bold mb-0 flex items-center mac-header p-2">
            <FaListOl className="mr-2 text-mac-white" /> 
            <span className="text-mac-white">Multiple Choice Questions</span>
          </h1>
          <div className="mt-4">
            <Link href="/exam-navigation">
              <a className="mac-button inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Back to Exam Navigation
              </a>
            </Link>
          </div>
        </div>
        
        {/* 2017 AP Exam MCQs */}
        <div className="mac-window p-4 mb-8">
          <div className="mac-header p-2 mb-4">
            <h2 className="text-xl font-bold text-mac-white">2017 AP Statistics Exam</h2>
          </div>
          
          <p className="mb-6">
            Select a Multiple Choice Question (MCQ) from the 2017 AP Statistics Exam:
          </p>
          
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3">
            {Array.from({ length: 40 }, (_, i) => i + 1).map((num) => (
              <Link key={num} href={`/mcq-detail/${num}`}>
                <a 
                  className="mac-button py-3 px-0 flex items-center justify-center font-bold text-black"
                  style={{ backgroundColor: pastelColors[num - 1] }}
                >
                  {num}
                </a>
              </Link>
            ))}
          </div>
        </div>
        
        {/* 2018 AP Exam MCQs (Greyed Out) */}
        <div className="mac-window p-4 mb-8 opacity-50">
          <div className="mac-header p-2 mb-4">
            <h2 className="text-xl font-bold text-mac-white">2018 AP Statistics Exam</h2>
          </div>
          
          <p className="mb-6">
            Content for 2018 AP Statistics Exam is coming soon.
          </p>
          
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3">
            {Array.from({ length: 40 }, (_, i) => i + 1).map((num) => (
              <div 
                key={num}
                className="mac-button py-3 px-0 flex items-center justify-center font-bold cursor-not-allowed"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        
        {/* 2019 AP Exam MCQs (Greyed Out) */}
        <div className="mac-window p-4 mb-8 opacity-50">
          <div className="mac-header p-2 mb-4">
            <h2 className="text-xl font-bold text-mac-white">2019 AP Statistics Exam</h2>
          </div>
          
          <p className="mb-6">
            Content for 2019 AP Statistics Exam is coming soon.
          </p>
          
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3">
            {Array.from({ length: 40 }, (_, i) => i + 1).map((num) => (
              <div 
                key={num}
                className="mac-button py-3 px-0 flex items-center justify-center font-bold cursor-not-allowed"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 