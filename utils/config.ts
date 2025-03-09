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
};

export default config; 