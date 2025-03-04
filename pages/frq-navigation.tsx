import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaArrowLeft, FaPencilAlt, FaLayerGroup } from 'react-icons/fa';
import QRCodeGenerator from '@/components/QRCodeGenerator';

// FRQ locations mapping based on the provided data
const frqPrimaryLocations: Record<number, { path: string; displayText: string }> = {
  1: { path: "/unit/unit2/2-1", displayText: "Unit 2, Section 2-1" },
  2: { path: "/unit/unit8/8-{3,4}", displayText: "Unit 8, Sections 8-3,4" },
  3: { path: "/unit/unit3/3-{1,2,3}", displayText: "Unit 3, Sections 3-1,2,3" },
  4: { path: "/unit/unit8/8-{3,4}", displayText: "Unit 8, Sections 8-3,4" },
  5: { path: "/unit/unit6/6-{3,4}", displayText: "Unit 6, Sections 6-3,4" },
  6: { path: "/unit/unit8/8-{3,4}", displayText: "Unit 8, Sections 8-3,4" },
};

const generatePastelColors = (count: number) => {
  const colors = [];
  const hueStep = 360 / count;
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(${i * hueStep}, 70%, 80%)`);
  }
  return colors;
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((frqNumber) => (
              <Link key={frqNumber} href={`/frq-detail/${frqNumber}`}>
                <a 
                  className="mac-window p-4 text-center hover:shadow-lg transition-shadow duration-200"
                  style={{ backgroundColor: pastelColors[frqNumber - 1] }}
                  onMouseEnter={() => setHoveredFrq(frqNumber)}
                  onMouseLeave={() => setHoveredFrq(null)}
                >
                  <h3 className="text-xl font-bold mb-2">FRQ #{frqNumber}</h3>
                  <p className="text-sm">Click to view details</p>
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