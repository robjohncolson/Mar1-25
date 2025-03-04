import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaArrowLeft, FaPencilAlt, FaLayerGroup } from 'react-icons/fa';
import QRCodeGenerator from '@/components/QRCodeGenerator';

// FRQ locations mapping based on the provided data
const frqPrimaryLocations: Record<number, { path: string; displayText: string }> = {
  1: { path: "/unit/unit1/1-3", displayText: "Unit 1, Section 1-3" },
  2: { path: "/unit/unit7/7-{3,4}", displayText: "Unit 7, Sections 7-3,4" },
  3: { path: "/unit/unit4/4-{4,5}", displayText: "Unit 4, Sections 4-4,5" },
  4: { path: "/unit/unit7/7-{1,2}", displayText: "Unit 7, Sections 7-1,2" },
  5: { path: "/unit/unit5/5-{5,6}", displayText: "Unit 5, Sections 5-5,6" },
  6: { path: "/unit/unit7/7-{5,6}", displayText: "Unit 7, Sections 7-5,6" },
};

// Generate softer pastel colors
const generatePastelColors = (count: number) => {
  return [
    'rgb(255, 223, 223)', // Soft red
    'rgb(255, 250, 205)', // Soft yellow
    'rgb(220, 255, 220)', // Soft green
    'rgb(211, 247, 255)', // Soft blue
    'rgb(230, 220, 255)', // Soft purple
    'rgb(255, 228, 225)', // Soft pink
  ];
};

const pastelColors = generatePastelColors(6);

export default function FRQNavigation() {
  const [hoveredFrq, setHoveredFrq] = useState<number | null>(null);

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

        {/* Tooltip for displaying location */}
        {hoveredFrq && (
          <div className="mac-window p-2 mb-4 text-center">
            <p>FRQ #{hoveredFrq} relates to: {frqPrimaryLocations[hoveredFrq].displayText}</p>
          </div>
        )}

        {/* 2017 AP Exam FRQs */}
        <div className="mac-window p-4 mb-8">
          <div className="mac-header p-2 mb-4">
            <h2 className="text-xl font-bold text-mac-white flex items-center">
              <FaLayerGroup className="mr-2" /> 2017 AP Statistics Exam FRQs
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {[1, 2, 3, 4, 5, 6].map((frqNumber) => (
              <Link key={frqNumber} href={`/frq-detail/${frqNumber}`}>
                <a 
                  className="mac-window p-6 text-center hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 min-h-[160px] flex flex-col justify-center items-center"
                  style={{ 
                    backgroundColor: pastelColors[frqNumber - 1],
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    boxShadow: hoveredFrq === frqNumber ? '0 8px 16px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={() => setHoveredFrq(frqNumber)}
                  onMouseLeave={() => setHoveredFrq(null)}
                >
                  <h3 className="text-2xl font-bold mb-3" style={{ color: 'rgba(0,0,0,0.8)' }}>FRQ #{frqNumber}</h3>
                  <p className="text-sm" style={{ color: 'rgba(0,0,0,0.6)' }}>Click to view details</p>
                </a>
              </Link>
            ))}
          </div>
        </div>

        <div className="mac-window p-4 mt-8">
          <QRCodeGenerator url="/frq-navigation" title="FRQ Navigation" />
        </div>
      </div>
    </Layout>
  );
} 