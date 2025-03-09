// Environment configuration
const config = {
  // Supabase configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://baediugfvcmrckqsdney.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhZWRpdWdmdmNtcmNrcXNkbmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODEzMzIsImV4cCI6MjA1NzA1NzMzMn0.teV3bvVVAjgfY9_imblBmhkCjsgUYvICQLC09mqIpQE',
  },
  
  // Site configuration
  site: {
    // Base URL for the site (used for authentication redirects)
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 
             (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000'),
    
    // Site name
    name: 'AP Statistics Hub',
    
    // Site description
    description: 'A comprehensive resource for AP Statistics students and teachers',
  },
  
  // Feature flags
  features: {
    // Whether authentication is enabled
    authEnabled: true,
  },
  
  // Debug information
  debug: {
    // Whether to show debug information
    enabled: process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_DEBUG === 'true',
    
    // Log level
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
  },
};

// Log configuration in development
if (typeof window !== 'undefined' && (process.env.NODE_ENV !== 'production' || config.debug.enabled)) {
  console.log('Config loaded:', {
    supabaseUrl: config.supabase.url.substring(0, 15) + '...',
    hasSupabaseKey: !!config.supabase.anonKey,
    baseUrl: config.site.baseUrl,
    authEnabled: config.features.authEnabled,
  });
}

export default config; 