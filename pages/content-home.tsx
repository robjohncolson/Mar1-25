import { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import UnitCard from '@/components/UnitCard';
import HowToUse from '@/components/HowToUse';
import LoadingIndicator from '@/components/LoadingIndicator';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { getAllUnits, getAPExamContent, Unit, APExamContent } from '@/utils/contentApi';
import { FaFileAlt, FaBookOpen, FaImage, FaGraduationCap, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function ContentHome() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [apExams, setAPExams] = useState<APExamContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [unitsData, apExamData] = await Promise.all([
        getAllUnits(),
        getAPExamContent()
      ]);
      
      setUnits(unitsData);
      setAPExams(apExamData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load content. Please try again later.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Layout title="AP Statistics Hub - Content Home">
      <div className="max-w-4xl mx-auto">
        <div className="mac-window p-4 mb-6">
          <h1 className="text-3xl font-bold mb-0 flex items-center mac-header p-2">
            <FaGraduationCap className="mr-2 text-mac-white" /> <span className="text-mac-white">AP Statistics Resources</span>
          </h1>
          <div className="mt-4">
            <Link href="/">
              <a className="mac-button inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Back to Main Menu
              </a>
            </Link>
          </div>
        </div>
        
        <HowToUse />
        
        {loading ? (
          <LoadingIndicator message="Loading AP Statistics resources..." />
        ) : error ? (
          <div className="mac-window p-4 border-mac-border text-mac-black">
            {error}
          </div>
        ) : (
          <>
            {/* AP Exam Section */}
            {apExams.map((exam) => (
              <div key={exam.year} className="mac-window p-4 mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center mac-header p-2">
                  <FaFileAlt className="mr-2 text-mac-white" /> <span className="text-mac-white">{exam.year} AP Exam</span>
                </h2>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exam.pdfs.length > 0 && (
                      <div className="mac-window p-3">
                        <h3 className="font-semibold mb-2 mac-header p-1 text-mac-white">PDFs</h3>
                        <ul className="space-y-2">
                          {exam.pdfs.map((pdf) => (
                            <li key={pdf.path}>
                              <a 
                                href={pdf.download_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mac-button inline-flex items-center w-full"
                              >
                                <FaFileAlt className="mr-2" /> {pdf.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {exam.prompts.length > 0 && (
                      <div className="mac-window p-3">
                        <h3 className="font-semibold mb-2 mac-header p-1 text-mac-white">Prompts</h3>
                        <ul className="space-y-2">
                          {exam.prompts.map((prompt) => (
                            <li key={prompt.path}>
                              <a 
                                href={`/quiz/${prompt.path}`}
                                className="mac-button inline-flex items-center w-full"
                              >
                                <FaBookOpen className="mr-2" /> {prompt.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Units Section */}
            <div className="mac-window p-4 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center mac-header p-2">
                <FaBookOpen className="mr-2 text-mac-white" /> <span className="text-mac-white">Units</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {units.map((unit) => (
                  <UnitCard key={unit.path} unit={unit} />
                ))}
              </div>
            </div>
            
            {/* QR Code for Home Page */}
            <div className="mac-window p-4 mt-8">
              <QRCodeGenerator url="/content-home" title="AP Statistics Hub - Content Home" />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
} 