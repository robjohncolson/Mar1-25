import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaArrowLeft, FaListOl } from 'react-icons/fa';
import QRCodeGenerator from '@/components/QRCodeGenerator';

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

// MCQ locations mapping based on the provided data
// This maps each MCQ to its primary section location
const mcqPrimaryLocations: Record<string, Record<number, { path: string; displayText: string }>> = {
  '2017': {
    1: { path: "/unit/unit2/2-1", displayText: "Unit 2, Section 2-1" },
    2: { path: "/unit/unit1/1-6", displayText: "Unit 1, Section 1-6" },
    3: { path: "/unit/unit2/2-1", displayText: "Unit 2, Section 2-1" },
    4: { path: "/unit/unit7/7-{1,2}", displayText: "Unit 7, Sections 7-1,2" },
    5: { path: "/unit/unit6/6-{3,4}", displayText: "Unit 6, Sections 6-3,4" },
    6: { path: "/unit/unit1/1-{7,8}", displayText: "Unit 1, Sections 1-7,8" },
    7: { path: "/unit/unit4/4-{4,5}", displayText: "Unit 4, Sections 4-4,5" },
    8: { path: "/unit/unit4/4-{7,8}", displayText: "Unit 4, Sections 4-7,8" },
    9: { path: "/unit/unit1/1-{7,8}", displayText: "Unit 1, Sections 1-7,8" },
    10: { path: "/unit/unit3/3-{1,2,3}", displayText: "Unit 3, Sections 3-1,2,3" },
    11: { path: "/unit/unit7/7-{1,2}", displayText: "Unit 7, Sections 7-1,2" },
    12: { path: "/unit/unit3/3-{1,2,3}", displayText: "Unit 3, Sections 3-1,2,3" },
    13: { path: "/unit/unit1/1-{7,8}", displayText: "Unit 1, Sections 1-7,8" },
    14: { path: "/unit/unit1/1-10", displayText: "Unit 1, Section 1-10" },
    15: { path: "/unit/unit1/1-6", displayText: "Unit 1, Section 1-6" },
    16: { path: "/unit/unit2/2-2", displayText: "Unit 2, Section 2-2" },
    17: { path: "/unit/unit7/7-{3,4}", displayText: "Unit 7, Sections 7-3,4" },
    18: { path: "/unit/unit2/2-4", displayText: "Unit 2, Section 2-4" },
    19: { path: "/unit/unit1/1-10", displayText: "Unit 1, Section 1-10" },
    20: { path: "/unit/unit6/6-{7,8}", displayText: "Unit 6, Sections 6-7,8" },
    21: { path: "/unit/unit5/5-{3,4}", displayText: "Unit 5, Sections 5-3,4" },
    22: { path: "/unit/unit6/6-{5,6}", displayText: "Unit 6, Sections 6-5,6" },
    23: { path: "/unit/unit6/6-{1,2}", displayText: "Unit 6, Sections 6-1,2" },
    24: { path: "/unit/unit3/3-{6,7}", displayText: "Unit 3, Sections 3-6,7" },
    25: { path: "/unit/unit4/4-{7,8}", displayText: "Unit 4, Sections 4-7,8" },
    26: { path: "/unit/unit8/8-{3,4}", displayText: "Unit 8, Sections 8-3,4" },
    27: { path: "/unit/unit9/9-{5,6}", displayText: "Unit 9, Sections 9-5,6" },
    28: { path: "/unit/unit6/6-{1,2}", displayText: "Unit 6, Sections 6-1,2" },
    29: { path: "/unit/unit1/1-{7,8}", displayText: "Unit 1, Sections 1-7,8" },
    30: { path: "/unit/unit5/5-{7,8}", displayText: "Unit 5, Sections 5-7,8" },
    31: { path: "/unit/unit2/2-5", displayText: "Unit 2, Section 2-5" },
    32: { path: "/unit/unit4/4-12", displayText: "Unit 4, Section 4-12" },
    33: { path: "/unit/unit9/9-{1,2}", displayText: "Unit 9, Sections 9-1,2" },
    34: { path: "/unit/unit4/4-{9,10}", displayText: "Unit 4, Sections 4-9,10" },
    35: { path: "/unit/unit3/3-{1,2,3}", displayText: "Unit 3, Sections 3-1,2,3" },
    36: { path: "/unit/unit6/6-{7,8}", displayText: "Unit 6, Sections 6-7,8" },
    37: { path: "/unit/unit3/3-{1,2,3}", displayText: "Unit 3, Sections 3-1,2,3" },
    38: { path: "/unit/unit7/7-{5,6}", displayText: "Unit 7, Sections 7-5,6" },
    39: { path: "/unit/unit6/6-{1,2}", displayText: "Unit 6, Sections 6-1,2" },
    40: { path: "/unit/unit6/6-{5,6}", displayText: "Unit 6, Sections 6-5,6" },
  },
  '2018': {
    1: { path: "/unit/unit1", displayText: "Unit 1" },
    2: { path: "/unit/unit2", displayText: "Unit 2" },
    3: { path: "/unit/unit3", displayText: "Unit 3" },
    4: { path: "/unit/unit4", displayText: "Unit 4" },
    5: { path: "/unit/unit5", displayText: "Unit 5" },
    6: { path: "/unit/unit6", displayText: "Unit 6" },
    7: { path: "/unit/unit7", displayText: "Unit 7" },
    8: { path: "/unit/unit8", displayText: "Unit 8" },
    9: { path: "/unit/unit9", displayText: "Unit 9" },
    10: { path: "/unit/unit1", displayText: "Unit 1" },
    11: { path: "/unit/unit2", displayText: "Unit 2" },
    12: { path: "/unit/unit3", displayText: "Unit 3" },
    13: { path: "/unit/unit4", displayText: "Unit 4" },
    14: { path: "/unit/unit5", displayText: "Unit 5" },
    15: { path: "/unit/unit6", displayText: "Unit 6" },
    16: { path: "/unit/unit7", displayText: "Unit 7" },
    17: { path: "/unit/unit8", displayText: "Unit 8" },
    18: { path: "/unit/unit9", displayText: "Unit 9" },
    19: { path: "/unit/unit1", displayText: "Unit 1" },
    20: { path: "/unit/unit2", displayText: "Unit 2" },
    21: { path: "/unit/unit3", displayText: "Unit 3" },
    22: { path: "/unit/unit4", displayText: "Unit 4" },
    23: { path: "/unit/unit5", displayText: "Unit 5" },
    24: { path: "/unit/unit6", displayText: "Unit 6" },
    25: { path: "/unit/unit7", displayText: "Unit 7" },
    26: { path: "/unit/unit8", displayText: "Unit 8" },
    27: { path: "/unit/unit9", displayText: "Unit 9" },
    28: { path: "/unit/unit1", displayText: "Unit 1" },
    29: { path: "/unit/unit2", displayText: "Unit 2" },
    30: { path: "/unit/unit3", displayText: "Unit 3" },
    31: { path: "/unit/unit4", displayText: "Unit 4" },
    32: { path: "/unit/unit5", displayText: "Unit 5" },
    33: { path: "/unit/unit6", displayText: "Unit 6" },
    34: { path: "/unit/unit7", displayText: "Unit 7" },
    35: { path: "/unit/unit8", displayText: "Unit 8" },
    36: { path: "/unit/unit9", displayText: "Unit 9" },
    37: { path: "/unit/unit1", displayText: "Unit 1" },
    38: { path: "/unit/unit2", displayText: "Unit 2" },
    39: { path: "/unit/unit3", displayText: "Unit 3" },
    40: { path: "/unit/unit4", displayText: "Unit 4" },
  },
  '2019': {
    1: { path: "/unit/unit1", displayText: "Unit 1" },
    2: { path: "/unit/unit2", displayText: "Unit 2" },
    3: { path: "/unit/unit3", displayText: "Unit 3" },
    4: { path: "/unit/unit4", displayText: "Unit 4" },
    5: { path: "/unit/unit5", displayText: "Unit 5" },
    6: { path: "/unit/unit6", displayText: "Unit 6" },
    7: { path: "/unit/unit7", displayText: "Unit 7" },
    8: { path: "/unit/unit8", displayText: "Unit 8" },
    9: { path: "/unit/unit9", displayText: "Unit 9" },
    10: { path: "/unit/unit1", displayText: "Unit 1" },
    11: { path: "/unit/unit2", displayText: "Unit 2" },
    12: { path: "/unit/unit3", displayText: "Unit 3" },
    13: { path: "/unit/unit4", displayText: "Unit 4" },
    14: { path: "/unit/unit5", displayText: "Unit 5" },
    15: { path: "/unit/unit6", displayText: "Unit 6" },
    16: { path: "/unit/unit7", displayText: "Unit 7" },
    17: { path: "/unit/unit8", displayText: "Unit 8" },
    18: { path: "/unit/unit9", displayText: "Unit 9" },
    19: { path: "/unit/unit1", displayText: "Unit 1" },
    20: { path: "/unit/unit2", displayText: "Unit 2" },
    21: { path: "/unit/unit3", displayText: "Unit 3" },
    22: { path: "/unit/unit4", displayText: "Unit 4" },
    23: { path: "/unit/unit5", displayText: "Unit 5" },
    24: { path: "/unit/unit6", displayText: "Unit 6" },
    25: { path: "/unit/unit7", displayText: "Unit 7" },
    26: { path: "/unit/unit8", displayText: "Unit 8" },
    27: { path: "/unit/unit9", displayText: "Unit 9" },
    28: { path: "/unit/unit1", displayText: "Unit 1" },
    29: { path: "/unit/unit2", displayText: "Unit 2" },
    30: { path: "/unit/unit3", displayText: "Unit 3" },
    31: { path: "/unit/unit4", displayText: "Unit 4" },
    32: { path: "/unit/unit5", displayText: "Unit 5" },
    33: { path: "/unit/unit6", displayText: "Unit 6" },
    34: { path: "/unit/unit7", displayText: "Unit 7" },
    35: { path: "/unit/unit8", displayText: "Unit 8" },
    36: { path: "/unit/unit9", displayText: "Unit 9" },
    37: { path: "/unit/unit1", displayText: "Unit 1" },
    38: { path: "/unit/unit2", displayText: "Unit 2" },
    39: { path: "/unit/unit3", displayText: "Unit 3" },
    40: { path: "/unit/unit4", displayText: "Unit 4" },
  }
};

const pastelColors = generatePastelColors(40);

export default function MCQNavigation() {
  const router = useRouter();
  const [hoveredMcq, setHoveredMcq] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState('2017');

  useEffect(() => {
    const { year } = router.query;
    if (year && typeof year === 'string' && ['2017', '2018', '2019'].includes(year)) {
      setSelectedYear(year);
    }
  }, [router.query]);

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
        
        {/* Year Selection */}
        <div className="mac-window p-4 mb-6">
          <div className="mac-header p-2 mb-4">
            <h2 className="text-xl font-bold text-mac-white">Select Exam Year</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {['2017', '2018', '2019'].map((year) => (
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
        
        {/* Tooltip for displaying location */}
        {hoveredMcq && mcqPrimaryLocations[selectedYear] && mcqPrimaryLocations[selectedYear][hoveredMcq] && (
          <div className="mac-window p-2 mb-4 text-center">
            <p>MCQ #{hoveredMcq} relates to: {mcqPrimaryLocations[selectedYear][hoveredMcq].displayText}</p>
          </div>
        )}
        
        {/* AP Exam MCQs */}
        <div className="mac-window p-4 mb-8">
          <div className="mac-header p-2 mb-4">
            <h2 className="text-xl font-bold text-mac-white">{selectedYear} AP Statistics Exam</h2>
          </div>
          
          <p className="mb-6">
            Click on a question number to view details about that multiple choice question.
            Hover over a question to see which unit and section it relates to.
          </p>
          
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3 p-4">
            {Array.from({ length: 40 }, (_, i) => i + 1).map((mcqNumber) => (
              <Link key={mcqNumber} href={`/mcq-detail/${mcqNumber}?year=${selectedYear}`}>
                <a 
                  className="mac-window p-3 text-center hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center"
                  style={{ 
                    backgroundColor: pastelColors[mcqNumber - 1],
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    boxShadow: hoveredMcq === mcqNumber ? '0 8px 16px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={() => setHoveredMcq(mcqNumber)}
                  onMouseLeave={() => setHoveredMcq(null)}
                >
                  <span className="text-lg font-bold" style={{ color: 'rgba(0,0,0,0.8)' }}>{mcqNumber}</span>
                </a>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mac-window p-4 mt-8">
          <QRCodeGenerator url={`/mcq-navigation?year=${selectedYear}`} title={`${selectedYear} MCQ Navigation`} />
        </div>
      </div>
    </Layout>
  );
} 