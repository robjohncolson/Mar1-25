import { createClient } from '@supabase/supabase-js';
import config from './config';

// Use environment variables with fallbacks from config
const supabaseUrl = config.supabase.url;
const supabaseAnonKey = config.supabase.anonKey;

console.log('Initializing Supabase client with:', { 
  url: supabaseUrl.substring(0, 15) + '...',  // Log partial URL for security
  hasKey: !!supabaseAnonKey 
});

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Log session storage information
if (typeof window !== 'undefined') {
  console.log('Local storage keys:', Object.keys(localStorage));
  
  // Check for existing session
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Error getting session:', error);
    } else {
      console.log('Session exists:', !!data.session);
      if (data.session) {
        console.log('User:', data.session.user.email);
        console.log('Session expires:', new Date(data.session.expires_at! * 1000).toLocaleString());
      }
    }
  });
}

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
    
    // If the profile doesn't exist, create a default one
    if (error.code === 'PGRST116') {
      console.log('Profile not found, creating default profile for:', userId);
      
      // Get user metadata to use for display name
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      
      // Create a default display name from email or user metadata
      let displayName = 'User';
      if (user?.email) {
        displayName = user.email.split('@')[0];
      } else if (user?.user_metadata?.display_name) {
        displayName = user.user_metadata.display_name;
      }
      
      const defaultProfile: Omit<Profile, 'id'> = {
        display_name: displayName,
        avatar_data: {
          resolution: 2,
          colors: ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f'],
          last_edited: new Date().toISOString()
        },
        stars_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...defaultProfile })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating default profile:', createError);
        return null;
      }
      
      console.log('Default profile created successfully for:', userId);
      return newProfile as Profile;
    }
    
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

// Helper function to create a user profile if it doesn't exist
export const createUserProfileIfNotExists = async (userId: string, displayName?: string | null) => {
  // Check if profile exists
  const { data: existingProfile, error: checkError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (!checkError && existingProfile) {
    console.log('Profile already exists for:', userId);
    return existingProfile as Profile;
  }
  
  // Get user metadata to use for display name if not provided
  let finalDisplayName: string | null = displayName || null;
  if (!finalDisplayName) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (user?.email) {
      finalDisplayName = user.email.split('@')[0];
    } else if (user?.user_metadata?.display_name) {
      finalDisplayName = user.user_metadata.display_name as string;
    } else {
      finalDisplayName = 'User';
    }
  }
  
  const newProfile: Omit<Profile, 'id'> = {
    display_name: finalDisplayName,
    avatar_data: {
      resolution: 2,
      colors: ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f'],
      last_edited: new Date().toISOString()
    },
    stars_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const { data: createdProfile, error: createError } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...newProfile })
    .select()
    .single();
  
  if (createError) {
    console.error('Error creating profile:', createError);
    return null;
  }
  
  console.log('Profile created successfully for:', userId);
  return createdProfile as Profile;
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
    
    // Update stars count
    if (newStatus === 'completed') {
      await updateStarsCount(userId);
    } else {
      await updateStarsCount(userId);
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