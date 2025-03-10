import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaArrowLeft, FaBookOpen, FaLayerGroup, FaExternalLinkAlt, FaStar } from 'react-icons/fa';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import CompletionMarker from '@/components/CompletionMarker';
import { useAuth } from '@/contexts/AuthContext';
import { markContentAsCompleted, updateAvatarState } from '@/utils/supabaseClient';
import PixelAvatar from '@/components/PixelAvatar';

// FRQ locations mapping based on the provided data
const frqLocations: Record<string, Record<string, { unit: string; sections: string[] }>> = {
  '2017': {
    "1": { unit: "unit1", sections: ["1-3"] },
    "2": { unit: "unit7", sections: ["7-{3,4}", "7-{5,6}"] },
    "3": { unit: "unit4", sections: ["4-{4,5}", "4-{7,8}"] },
    "4": { unit: "unit7", sections: ["7-{1,2}"] },
    "5": { unit: "unit5", sections: ["5-{5,6}"] },
    "6": { unit: "unit7", sections: ["7-{5,6}"] },
  },
  '2018': {
    "1": { unit: "unit1", sections: [] },
    "2": { unit: "unit3", sections: [] },
    "3": { unit: "unit3", sections: [] },
    "4": { unit: "unit7", sections: [] },
    "5": { unit: "unit2", sections: [] },
    "6": { unit: "unit8", sections: [] },
  },
  '2019': {
    "1": { unit: "unit1", sections: [] },
    "2": { unit: "unit5", sections: [] },
    "3": { unit: "unit1", sections: [] },
    "4": { unit: "unit3", sections: [] },
    "5": { unit: "unit7", sections: [] },
    "6": { unit: "unit8", sections: [] },
  }
};

export default function FRQDetail() {
  const router = useRouter();
  const { id, year = '2017' } = router.query;
  const [frqNumber, setFrqNumber] = useState<string | null>(null);
  const [frqData, setFrqData] = useState<{ unit: string; sections: string[] } | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2017');
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [completionSuccess, setCompletionSuccess] = useState(false);
  const { user, profile, refreshProfile } = useAuth();

  useEffect(() => {
    if (id && typeof id === 'string' && year && typeof year === 'string') {
      setFrqNumber(id);
      setSelectedYear(year);
      setFrqData(frqLocations[year]?.[id] || null);
    }
  }, [id, year]);

  // Generate a pastel color for this FRQ
  const getFrqColor = (num: number) => {
    const hueStep = 360 / 6;
    const hue = (num - 1) * hueStep;
    return `hsl(${hue}, 70%, 80%)`;
  };

  // Function to handle direct navigation to quiz content
  const navigateToQuiz = (section: string) => {
    if (frqData) {
      // Store the FRQ number and year in sessionStorage for back navigation
      sessionStorage.setItem('lastFrqNumber', frqNumber || '');
      sessionStorage.setItem('lastFrqYear', selectedYear);
      
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

  // Function to handle marking content as completed
  const handleMarkComplete = async () => {
    if (!user || !frqNumber || isMarkingComplete) return;
    
    const contentId = `frq-${selectedYear}-${frqNumber}`;
    setIsMarkingComplete(true);
    
    try {
      // Mark the content as completed
      await markContentAsCompleted(user.id, contentId);
      
      // Update the avatar state based on the new star count
      await updateAvatarState(user.id);
      
      // Refresh the profile to get the updated data
      await refreshProfile();
      
      setCompletionSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setCompletionSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error marking content as completed:', error);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  return (
    <Layout title={`AP Statistics Hub - ${selectedYear} FRQ #${frqNumber || ''}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mac-window p-4 mb-6">
          <div className="flex justify-between items-center mac-header p-2"
            style={{ backgroundColor: frqNumber ? getFrqColor(parseInt(frqNumber)) : '#000' }}>
            <h1 className="text-3xl font-bold mb-0 flex items-center">
              <span className="text-black">{selectedYear} Free Response Question #{frqNumber}</span>
            </h1>
            <CompletionMarker contentId={`frq-${selectedYear}-${frqNumber}`} />
          </div>
          <div className="mt-4 flex justify-between items-center">
            <Link href={`/frq-navigation?year=${selectedYear}`}>
              <a className="mac-button inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Back to FRQ Navigation
              </a>
            </Link>
            
            {user && (
              <button
                onClick={handleMarkComplete}
                disabled={isMarkingComplete}
                className={`mac-button inline-flex items-center ${
                  completionSuccess ? 'bg-green-500 text-white' : ''
                }`}
              >
                <FaStar className="mr-2" />
                {isMarkingComplete 
                  ? 'Marking...' 
                  : completionSuccess 
                    ? 'Completed!' 
                    : 'Mark Complete'}
              </button>
            )}
          </div>
          
          {user && profile && completionSuccess && profile.avatar_data && (
            <div className="mt-4 p-3 bg-green-100 rounded flex items-center">
              <div className="mr-3">
                <PixelAvatar 
                  avatarData={profile.avatar_data} 
                  size={40} 
                />
              </div>
              <div>
                <p className="text-green-800 font-medium">
                  Great job! You've earned a gold star for completing this content.
                </p>
                <p className="text-green-700 text-sm">
                  You now have {profile.stars_count} star{profile.stars_count !== 1 ? 's' : ''}.
                  {profile.stars_count >= 9 
                    ? ' Your avatar has reached 3x3 resolution!' 
                    : profile.stars_count >= 4 
                      ? ' Your avatar has reached 4x4 resolution!' 
                      : profile.stars_count >= 1 
                        ? ' Your avatar is now customizable!' 
                        : ''}
                </p>
              </div>
            </div>
          )}
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
                This free response question is associated with the following unit{frqData.sections.length > 0 ? ' and sections' : ''}.
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
                
                {frqData.sections.length > 0 && (
                  <div className="mac-window p-4 flex flex-col items-center">
                    <div className="mac-header p-2 w-full mb-4">
                      <h3 className="text-lg font-bold text-mac-white flex items-center">
                        <FaBookOpen className="mr-2" /> Specific Sections
                      </h3>
                    </div>
                    <p className="mb-6 text-center">
                      Jump directly to the specific sections covering this content.
                    </p>
                    <div className="space-y-3 w-full">
                      {frqData.sections.map((section, index) => (
                        <button
                          key={index}
                          onClick={() => navigateToQuiz(section)}
                          className="mac-button text-lg py-2 px-6 w-full text-center whitespace-normal h-auto min-h-[48px] flex items-center justify-center"
                        >
                          Go to Section {section}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mac-window p-4 mt-8">
              <QRCodeGenerator url={`/frq-detail/${frqNumber}?year=${selectedYear}`} title={`${selectedYear} FRQ #${frqNumber}`} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
} 