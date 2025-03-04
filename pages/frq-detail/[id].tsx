import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaArrowLeft, FaBookOpen, FaLayerGroup, FaExternalLinkAlt } from 'react-icons/fa';
import QRCodeGenerator from '@/components/QRCodeGenerator';

// FRQ locations mapping based on the provided data
const frqLocations: Record<string, { unit: string; sections: string[] }> = {
  "1": { unit: "unit1", sections: ["1-3"] },
  "2": { unit: "unit7", sections: ["7-{1,2}"] },
  "3": { unit: "unit3", sections: ["3-{1,2,3}"] },
  "4": { unit: "unit7", sections: ["7-{1,2}"] },
  "5": { unit: "unit5", sections: ["5-{3,4}"] },
  "6": { unit: "unit7", sections: ["7-{5,6}"] },
};

export default function FRQDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [frqNumber, setFrqNumber] = useState<string | null>(null);
  const [frqData, setFrqData] = useState<{ unit: string; sections: string[] } | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      setFrqNumber(id);
      setFrqData(frqLocations[id] || null);
    }
  }, [id]);

  // Generate a pastel color for this FRQ
  const getFrqColor = (num: number) => {
    const hueStep = 360 / 6;
    const hue = (num - 1) * hueStep;
    return `hsl(${hue}, 70%, 80%)`;
  };

  // Function to handle direct navigation to quiz content
  const navigateToQuiz = (section: string) => {
    if (frqData) {
      // Store the FRQ number in sessionStorage for back navigation
      sessionStorage.setItem('lastFrqNumber', frqNumber || '');
      
      // Fix the section format: ensure it has proper curly brace format
      let formattedSection = section;
      
      // Only add curly braces if they don't already exist and there's a comma
      if (section.includes(',') && !section.includes('{')) {
        // Extract the prefix and the comma-separated values
        const [prefix, values] = section.split('-');
        // Format as prefix-{values}
        formattedSection = `${prefix}-{${values}}`;
      }
      
      // Navigate directly to the quiz page with properly formatted section
      router.push(`/quiz/${frqData.unit}/${formattedSection}`);
    }
  };

  return (
    <Layout title={`AP Statistics Hub - FRQ #${frqNumber || ''}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mac-window p-4 mb-6">
          <h1 
            className="text-3xl font-bold mb-0 flex items-center mac-header p-2"
            style={{ backgroundColor: frqNumber ? getFrqColor(parseInt(frqNumber)) : '#000' }}
          >
            <span className="text-black">Free Response Question #{frqNumber}</span>
          </h1>
          <div className="mt-4">
            <Link href="/frq-navigation">
              <a className="mac-button inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Back to FRQ Navigation
              </a>
            </Link>
          </div>
        </div>
        
        {!frqData ? (
          <div className="mac-window p-4">
            <p>Loading FRQ data or FRQ not found...</p>
          </div>
        ) : (
          <>
            <div className="mac-window p-4 mb-8">
              <div className="mac-header p-2 mb-4">
                <h2 className="text-xl font-bold text-mac-white">Navigation Options</h2>
              </div>
              
              <p className="mb-6">
                This free response question is associated with the following unit and sections.
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
                  <Link href={`/unit/${frqData.unit}`}>
                    <a className="mac-button text-lg py-2 px-6 w-full text-center whitespace-normal h-auto min-h-[48px] flex items-center justify-center">
                      Go to Unit {frqData.unit.replace('unit', '')}
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
                    {frqData.sections.map((section) => (
                      <button 
                        key={section} 
                        onClick={() => navigateToQuiz(section)}
                        className="mac-button py-2 px-6 w-full text-center block whitespace-normal h-auto min-h-[48px] flex items-center justify-center"
                      >
                        Go to Section {section} <FaExternalLinkAlt className="ml-1 inline-block flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-gray-600 text-center">
                    Note: Some sections may still be under development. If a section appears empty, 
                    please try another section or return to the unit page.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mac-window p-4 mt-8">
              <QRCodeGenerator url={`/frq-detail/${frqNumber}`} title={`FRQ #${frqNumber}`} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
} 