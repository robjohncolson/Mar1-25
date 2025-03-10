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

// Helper function to mark content as completed
export const markContentAsCompleted = async (userId: string, contentId: string) => {
  const { data, error } = await supabase
    .from('completions')
    .upsert({
      user_id: userId,
      content_id: contentId,
      status: 'completed',
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error marking content as completed:', error);
    return null;
  }
  
  // Update stars count after marking as completed
  await updateStarsCount(userId);
  
  return data as Completion;
};

// Helper function to get user's star count
export const getUserStarCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('completions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'completed');
  
  if (error) {
    console.error('Error getting user star count:', error);
    return 0;
  }
  
  return count || 0;
};

// Helper function to update avatar state based on star count
export const updateAvatarState = async (userId: string) => {
  // Get current star count
  const starCount = await getUserStarCount(userId);
  
  // Get current profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('avatar_data')
    .eq('id', userId)
    .single();
  
  if (profileError) {
    console.error('Error getting profile for avatar update:', profileError);
    return null;
  }
  
  let avatarData = profile?.avatar_data || {
    resolution: 1,
    colors: ['#808080'],
    last_edited: null
  };
  
  // Determine avatar size based on star count
  let avatarSize: '1x1' | '4x4' | '3x3' = '1x1';
  let colors: string[] = [];
  
  if (starCount >= 9) {
    avatarSize = '3x3';
    // If current colors array doesn't have 9 elements, create default
    if (!avatarData.colors || avatarData.colors.length !== 9) {
      colors = Array(9).fill('#808080');
    } else {
      colors = avatarData.colors.slice(0, 9);
    }
  } else if (starCount >= 4) {
    avatarSize = '4x4';
    // If current colors array doesn't have 16 elements, create default
    if (!avatarData.colors || avatarData.colors.length !== 16) {
      colors = Array(16).fill('#808080');
    } else {
      colors = avatarData.colors.slice(0, 16);
    }
  } else if (starCount >= 1) {
    avatarSize = '1x1';
    // Keep user-set color if it exists, otherwise use default
    colors = avatarData.colors && avatarData.colors.length > 0 
      ? [avatarData.colors[0]] 
      : ['#808080'];
  } else {
    // 0 stars: gray 1x1 pixel, non-customizable
    avatarSize = '1x1';
    colors = ['#808080'];
  }
  
  // Update avatar data in profile
  const resolution = avatarSize === '1x1' ? 1 : avatarSize === '4x4' ? 4 : 3;
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      avatar_data: {
        resolution,
        colors,
        last_edited: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating avatar state:', error);
    return null;
  }
  
  return data as Profile;
};

// Helper function to set avatar colors
export const setAvatarColors = async (userId: string, colors: string[]) => {
  // Get current profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('avatar_data')
    .eq('id', userId)
    .single();
  
  if (profileError) {
    console.error('Error getting profile for color update:', profileError);
    return null;
  }
  
  const avatarData = profile?.avatar_data || {
    resolution: 1,
    colors: ['#808080'],
    last_edited: null
  };
  
  // Update colors while keeping the same resolution
  const { data, error } = await supabase
    .from('profiles')
    .update({
      avatar_data: {
        ...avatarData,
        colors,
        last_edited: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating avatar colors:', error);
    return null;
  }
  
  return data as Profile;
}; 