import { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import UnitCard from '@/components/UnitCard';
import HowToUse from '@/components/HowToUse';
import { getAllUnits, getAPExamContent, getKnowledgeTree, Unit } from '@/utils/contentApi';
import { FaSpinner, FaFileAlt, FaTree, FaBookOpen, FaImage } from 'react-icons/fa';
import Link from 'next/link';

export default function Home() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [apExam, setAPExam] = useState<{
    pdfs: { name: string; path: string; download_url: string }[];
    prompts: { name: string; path: string; content: string }[];
    images: { name: string; path: string; download_url: string }[];
  } | null>(null);
  const [knowledgeTree, setKnowledgeTree] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [unitsData, apExamData, knowledgeTreeData] = await Promise.all([
        getAllUnits(),
        getAPExamContent(),
        getKnowledgeTree()
      ]);
      
      setUnits(unitsData);
      setAPExam(apExamData);
      setKnowledgeTree(knowledgeTreeData);
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
    <Layout title="AP Statistics Hub - Home">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AP Statistics Resources</h1>
        
        <HowToUse />
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-blue-600 text-4xl" />
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            {/* AP Exam Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FaFileAlt className="mr-2" /> 2017 AP Exam
              </h2>
              {apExam && (
                <div className="bg-white shadow-md rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {apExam.pdfs.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">PDFs</h3>
                        <ul className="space-y-2">
                          {apExam.pdfs.map((pdf) => (
                            <li key={pdf.path}>
                              <a 
                                href={pdf.download_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center"
                              >
                                <FaFileAlt className="mr-2" /> {pdf.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {apExam.prompts.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Prompts</h3>
                        <ul className="space-y-2">
                          {apExam.prompts.map((prompt) => (
                            <li key={prompt.path}>
                              <Link href={`/prompt/${encodeURIComponent(prompt.path)}`}>
                                <a className="text-blue-600 hover:underline flex items-center">
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
                      <h3 className="font-semibold mb-2">Images</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {apExam.images.map((image) => (
                          <div key={image.path} className="border rounded p-2">
                            <a 
                              href={image.download_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <img 
                                src={image.download_url} 
                                alt={image.name} 
                                className="w-full h-auto"
                              />
                              <p className="text-sm text-center mt-1 truncate">{image.name}</p>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Knowledge Tree Section */}
            {knowledgeTree && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <FaTree className="mr-2" /> Knowledge Tree
                </h2>
                <div className="bg-white shadow-md rounded-lg p-4">
                  <Link href="/knowledge-tree">
                    <a className="text-blue-600 hover:underline flex items-center">
                      <FaTree className="mr-2" /> View AP Statistics Knowledge Tree
                    </a>
                  </Link>
                </div>
              </div>
            )}
            
            {/* Units Section */}
            <h2 className="text-2xl font-bold mb-4">Units</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {units.map((unit) => (
                <UnitCard key={unit.path} unit={unit} />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
} 