import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { toggleCompletion, supabase } from '@/utils/supabaseClient';

type CompletionMarkerProps = {
  contentId: string;
  className?: string;
};

export default function CompletionMarker({ contentId, className = '' }: CompletionMarkerProps) {
  const { user, refreshProfile } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if content is completed on mount
  useEffect(() => {
    if (!isMounted) return;
    
    const checkCompletion = async () => {
      if (!user) {
        setIsInitialized(true);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('completions')
          .select('status')
          .eq('user_id', user.id)
          .eq('content_id', contentId)
          .maybeSingle();
        
        if (error) {
          console.error('Error checking completion status:', error);
        } else {
          setIsCompleted(data?.status === 'completed');
        }
      } catch (error) {
        console.error('Unexpected error checking completion:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    
    checkCompletion();
  }, [user, contentId, isMounted]);
  
  const handleToggle = async () => {
    if (!user || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await toggleCompletion(user.id, contentId);
      
      if (result) {
        setIsCompleted(result.status === 'completed');
        
        // Refresh profile to update stars count
        refreshProfile();
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Don't render anything during SSR
  if (!isMounted) {
    return null;
  }
  
  // Don't render if not logged in or not initialized
  if (!user || !isInitialized) {
    return null;
  }
  
  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`completion-marker ${className} ${
        isCompleted ? 'text-yellow-500' : 'text-gray-400'
      } hover:text-yellow-600 transition-colors focus:outline-none disabled:opacity-50`}
      title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
    >
      <FaStar className={`${isLoading ? 'animate-pulse' : ''}`} />
    </button>
  );
} 