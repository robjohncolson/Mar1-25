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

  // Check if content is completed on mount
  useEffect(() => {
    const checkCompletion = async () => {
      if (!user) return;
      
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
        console.error('Error checking completion status:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    
    if (user) {
      checkCompletion();
    }
  }, [user, contentId]);

  const handleToggle = async () => {
    if (!user || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await toggleCompletion(user.id, contentId);
      
      if (result) {
        setIsCompleted(result.status === 'completed');
        refreshProfile();
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !isInitialized) {
    return null;
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`transition-all duration-300 ${className}`}
      aria-label={isCompleted ? "Mark as incomplete" : "Mark as completed"}
      title={isCompleted ? "Mark as incomplete" : "Mark as completed"}
    >
      <FaStar 
        className={`text-2xl ${isCompleted ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-500`} 
      />
    </button>
  );
} 