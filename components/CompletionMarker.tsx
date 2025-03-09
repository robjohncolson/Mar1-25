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
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if Supabase is available
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      if (!supabase || typeof supabase.from !== 'function') {
        setIsSupabaseAvailable(false);
      }
    } catch (error) {
      console.error('Error checking Supabase availability:', error);
      setIsSupabaseAvailable(false);
    }
  }, [isMounted]);

  // Check if content is completed on mount
  useEffect(() => {
    if (!isMounted) return;
    
    const checkCompletion = async () => {
      if (!user || !isSupabaseAvailable) {
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
        console.error('Error checking completion status:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    
    if (user) {
      checkCompletion();
    } else {
      setIsInitialized(true);
    }
  }, [user, contentId, isSupabaseAvailable, isMounted]);

  const handleToggle = async () => {
    if (!user || isLoading || !isSupabaseAvailable) return;
    
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

  // During SSR/SSG, return null
  if (!isMounted) {
    return null;
  }

  if (!user || !isInitialized || !isSupabaseAvailable) {
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