import { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import UnitCard from '@/components/UnitCard';
import HowToUse from '@/components/HowToUse';
import { getAllUnits, Unit } from '@/utils/github';
import { FaSpinner } from 'react-icons/fa';

export default function Home() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUnits = useCallback(async () => {
    try {
      const unitsData = await getAllUnits();
      setUnits(unitsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching units:', err);
      setError('Failed to load units. Please try again later.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  return (
    <Layout title="AP Statistics Hub - Home">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AP Statistics Resources</h1>
        
        <HowToUse />
        
        <h2 className="text-2xl font-bold mb-4">Units</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-blue-600 text-4xl" />
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {units.map((unit) => (
              <UnitCard key={unit.path} unit={unit} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
} 