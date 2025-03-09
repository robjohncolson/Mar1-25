/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['raw.githubusercontent.com'],
  },
  // Disable static site generation for pages that use authentication
  // This will make them server-side rendered instead
  experimental: {
    // This is needed to prevent SSG errors with authentication
    appDir: false,
  },
  // Configure which pages should not be statically generated
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    // During development, just use the default
    if (dev) {
      return defaultPathMap;
    }
    
    // In production, exclude auth-related pages from static generation
    const pathMap = { ...defaultPathMap };
    
    // Remove auth-related pages from static generation
    delete pathMap['/profile'];
    delete pathMap['/login'];
    delete pathMap['/auth/callback'];
    
    return pathMap;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 