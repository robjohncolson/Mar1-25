import { createClient } from '@supabase/supabase-js';
import config from './config';

// Use environment variables with fallbacks from config
const supabaseUrl = config.supabase.url;
const supabaseAnonKey = config.supabase.anonKey;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for user profiles and completions
export type Profile = {
  id: string;
  display_name: string | null;
  avatar_data: {
    resolution: number;
    colors: string[];
    last_edited: string | null;
  } | null;
  stars_count: number;
  created_at: string;
  updated_at: string;
};

export type Completion = {
  id: string;
  user_id: string;
  content_id: string;
  status: 'completed' | 'in_progress';
  created_at: string;
  updated_at: string;
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to get a user's profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data as Profile;
};

// Helper function to update a user's profile
export const updateUserProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  
  return data as Profile;
};

// Helper function to get a user's completions
export const getUserCompletions = async (userId: string) => {
  const { data, error } = await supabase
    .from('completions')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching completions:', error);
    return [];
  }
  
  return data as Completion[];
};

// Helper function to toggle completion status
export const toggleCompletion = async (userId: string, contentId: string) => {
  // Check if completion already exists
  const { data: existing, error: fetchError } = await supabase
    .from('completions')
    .select('*')
    .eq('user_id', userId)
    .eq('content_id', contentId)
    .maybeSingle();
  
  if (fetchError) {
    console.error('Error checking completion:', fetchError);
    return null;
  }
  
  if (existing) {
    // Toggle between completed and in_progress
    const newStatus = existing.status === 'completed' ? 'in_progress' : 'completed';
    
    const { data, error } = await supabase
      .from('completions')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating completion:', error);
      return null;
    }
    
    return data as Completion;
  } else {
    // Create new completion
    const { data, error } = await supabase
      .from('completions')
      .insert({
        user_id: userId,
        content_id: contentId,
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating completion:', error);
      return null;
    }
    
    // Update stars count
    await updateStarsCount(userId);
    
    return data as Completion;
  }
};

// Helper function to update stars count
export const updateStarsCount = async (userId: string) => {
  // Count completed items
  const { count, error } = await supabase
    .from('completions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'completed');
  
  if (error) {
    console.error('Error counting completions:', error);
    return;
  }
  
  // Update profile with new count
  await supabase
    .from('profiles')
    .update({ 
      stars_count: count || 0,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
}; 