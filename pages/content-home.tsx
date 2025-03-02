import { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import UnitCard from '@/components/UnitCard';
import HowToUse from '@/components/HowToUse';
import LoadingIndicator from '@/components/LoadingIndicator';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { getAllUnits, getAPExamContent, Unit } from '@/utils/contentApi';
import { FaFileAlt, FaBookOpen, FaImage, FaGraduationCap, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function ContentHome() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [apExam, setAPExam] = useState<{
    pdfs: { name: string; path: string; download_url: string }[];
    prompts: { name: string; path: string; content: string }[];
    images: { name: string; path: string; download_url: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [unitsData, apExamData] = await Promise.all([
        getAllUnits(),
        getAPExamContent()
      ]);
      
      setUnits(unitsData);
      setAPExam(apExamData);
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
            <div className="mac-window p-4 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center mac-header p-2">
                <FaFileAlt className="mr-2 text-mac-white" /> <span className="text-mac-white">2017 AP Exam</span>
              </h2>
              {apExam && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {apExam.pdfs.length > 0 && (
                      <div className="mac-window p-3">
                        <h3 className="font-semibold mb-2 mac-header p-1 text-mac-white">PDFs</h3>
                        <ul className="space-y-2">
                          {apExam.pdfs.map((pdf) => (
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
                    
                    {apExam.prompts.length > 0 && (
                      <div className="mac-window p-3">
                        <h3 className="font-semibold mb-2 mac-header p-1 text-mac-white">Prompts</h3>
                        <ul className="space-y-2">
                          {apExam.prompts.map((prompt) => (
                            <li key={prompt.path}>
                              <Link href={`/prompt/${encodeURIComponent(prompt.path)}`}>
                                <a className="mac-button inline-flex items-center w-full">
                                  <FaBookOpen className="mr-2" /> {prompt.name}
                                </a>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {apExam.images.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2 mac-header p-1 text-mac-white">Images</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {apExam.images.map((image) => (
                          <div key={image.path} className="mac-window p-2">
                            <div className="relative">
                              <img 
                                src={image.download_url} 
                                alt={image.name} 
                                className="w-full h-auto border border-mac-border"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src = '/filemissing.png'; // Use the file missing graphic
                                }}
                              />
                              <p className="text-sm text-center mt-1 truncate">{image.name}</p>
                              <div className="mt-2 flex justify-center">
                                <a 
                                  href={image.download_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="mac-button text-xs"
                                >
                                  <FaExternalLinkAlt className="mr-1 inline-block" /> View Full Size
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
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