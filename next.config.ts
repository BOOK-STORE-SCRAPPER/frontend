import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    unoptimized: true, // Disable image optimization for development
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**', // Allow images from backend media folder
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**', // Also allow 127.0.0.1
      },
      {
        protocol: 'https',
        hostname: 'books.toscrape.com',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
