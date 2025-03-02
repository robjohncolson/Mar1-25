import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaArrowLeft, FaBookOpen, FaLayerGroup, FaExternalLinkAlt } from 'react-icons/fa';

// MCQ locations mapping based on the provided data
const mcqLocations: Record<string, { unit: string; sections: string[] }> = {
  "1": { unit: "unit2", sections: ["2-1"] },
  "2": { unit: "unit1", sections: ["1-6"] },
  "3": { unit: "unit2", sections: ["2-1"] },
  "4": { unit: "unit7", sections: ["7-{1,2}"] },
  "5": { unit: "unit6", sections: ["6-{3,4}"] },
  "6": { unit: "unit1", sections: ["1-{7,8}"] },
  "7": { unit: "unit4", sections: ["4-{4,5}"] },
  "8": { unit: "unit4", sections: ["4-{7,8}"] },
  "9": { unit: "unit1", sections: ["1-{7,8}"] },
  "10": { unit: "unit3", sections: ["3-{1,2,3}"] },
  "11": { unit: "unit7", sections: ["7-{1,2}"] },
  "12": { unit: "unit3", sections: ["3-{1,2,3}"] },
  "13": { unit: "unit1", sections: ["1-{7,8}"] },
  "14": { unit: "unit1", sections: ["1-10"] },
  "15": { unit: "unit1", sections: ["1-6"] },
  "16": { unit: "unit2", sections: ["2-2"] },
  "17": { unit: "unit7", sections: ["7-{3,4}"] },
  "18": { unit: "unit2", sections: ["2-4"] },
  "19": { unit: "unit1", sections: ["1-10"] },
  "20": { unit: "unit6", sections: ["6-{7,8}"] },
  "21": { unit: "unit5", sections: ["5-{3,4}", "5-{7,8}"] },
  "22": { unit: "unit6", sections: ["6-{5,6}"] },
  "23": { unit: "unit6", sections: ["6-{1,2}"] },
  "24": { unit: "unit3", sections: ["3-{6,7}"] },
  "25": { unit: "unit4", sections: ["4-{7,8}"] },
  "26": { unit: "unit8", sections: ["8-{3,4}"] },
  "27": { unit: "unit9", sections: ["9-{5,6}"] },
  "28": { unit: "unit6", sections: ["6-{1,2}"] },
  "29": { unit: "unit1", sections: ["1-6", "1-{7,8}", "1-9"] },
  "30": { unit: "unit5", sections: ["5-{7,8}"] },
  "31": { unit: "unit2", sections: ["2-5"] },
  "32": { unit: "unit4", sections: ["4-12"] },
  "33": { unit: "unit9", sections: ["9-{1,2}"] },
  "34": { unit: "unit4", sections: ["4-{9,10}"] },
  "35": { unit: "unit3", sections: ["3-{1,2,3}"] },
  "36": { unit: "unit6", sections: ["6-{7,8}"] },
  "37": { unit: "unit3", sections: ["3-{1,2,3}"] },
  "38": { unit: "unit7", sections: ["7-{5,6}"] },
  "39": { unit: "unit6", sections: ["6-{1,2}"] },
  "40": { unit: "unit6", sections: ["6-{5,6}", "6-11"] },
};

export default function MCQDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [mcqNumber, setMcqNumber] = useState<string | null>(null);
  const [mcqData, setMcqData] = useState<{ unit: string; sections: string[] } | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      setMcqNumber(id);
      setMcqData(mcqLocations[id] || null);
    }
  }, [id]);

  // Generate the same pastel color for this MCQ as on the MCQ navigation page
  const getMcqColor = (num: number) => {
    const hueStep = 360 / 40;
    const hue = (num - 1) * hueStep;
    return `hsl(${hue}, 70%, 80%)`;
  };

  // Function to handle direct navigation to quiz content
  const navigateToQuiz = (section: string) => {
    if (mcqData) {
      // Store the MCQ number in sessionStorage for back navigation
      sessionStorage.setItem('lastMcqNumber', mcqNumber || '');
      
      // Fix the section format: replace comma-separated values with proper curly brace format
      let formattedSection = section;
      if (section.includes(',')) {
        // Extract the prefix and the comma-separated values
        const [prefix, values] = section.split('-');
        // Format as prefix-{values}
        formattedSection = `${prefix}-{${values}}`;
      }
      
      // Navigate directly to the quiz page with properly formatted section
      router.push(`/quiz/${mcqData.unit}/${formattedSection}`);
    }
  };

  return (
    <Layout title={`AP Statistics Hub - MCQ #${mcqNumber || ''}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mac-window p-4 mb-6">
          <h1 
            className="text-3xl font-bold mb-0 flex items-center mac-header p-2"
            style={{ backgroundColor: mcqNumber ? getMcqColor(parseInt(mcqNumber)) : '#000' }}
          >
            <span className="text-black">Multiple Choice Question #{mcqNumber}</span>
          </h1>
          <div className="mt-4">
            <Link href="/mcq-navigation">
              <a className="mac-button inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Back to MCQ Navigation
              </a>
            </Link>
          </div>
        </div>
        
        {!mcqData ? (
          <div className="mac-window p-4">
            <p>Loading MCQ data or MCQ not found...</p>
          </div>
        ) : (
          <div className="mac-window p-4 mb-8">
            <div className="mac-header p-2 mb-4">
              <h2 className="text-xl font-bold text-mac-white">Navigation Options</h2>
            </div>
            
            <p className="mb-6">
              This multiple choice question is associated with the following unit and sections.
              Choose how you'd like to explore this content:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="mac-window p-4 flex flex-col items-center">
                <div className="mac-header p-2 w-full mb-4">
                  <h3 className="text-lg font-bold text-mac-white flex items-center">
                    <FaLayerGroup className="mr-2" /> Unit
                  </h3>
                </div>
                <p className="mb-6 text-center">
                  View the entire unit related to this question.
                </p>
                <Link href={`/unit/${mcqData.unit}`}>
                  <a className="mac-button text-lg py-2 px-6 w-full text-center">
                    Go to Unit {mcqData.unit.replace('unit', '')}
                  </a>
                </Link>
              </div>
              
              <div className="mac-window p-4 flex flex-col items-center">
                <div className="mac-header p-2 w-full mb-4">
                  <h3 className="text-lg font-bold text-mac-white flex items-center">
                    <FaBookOpen className="mr-2" /> Sections
                  </h3>
                </div>
                <p className="mb-6 text-center">
                  View specific sections related to this question.
                </p>
                <div className="w-full space-y-2">
                  {mcqData.sections.map((section) => (
                    <button 
                      key={section} 
                      onClick={() => navigateToQuiz(section)}
                      className="mac-button py-2 px-6 w-full text-center block"
                    >
                      Go to Section {section} <FaExternalLinkAlt className="ml-1 inline-block" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 