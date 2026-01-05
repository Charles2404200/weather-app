/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // Frontend will call backend via environment variable (Vercel will set this)
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://weather-app-seven-gamma-92.vercel.app/api/v1',
  },
  async rewrites() {
    // Only rewrite if we're not using an absolute URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://weather-app-seven-gamma-92.vercel.app/api/v1';
    if (backendUrl.startsWith('/')) {
      return [
        {
          source: '/api/v1/:path*',
          destination: `http://127.0.0.1:8000/api/v1/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
