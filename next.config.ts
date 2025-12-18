import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'books.toscrape.com',
        pathname: '/media/**',
      },
      // Allow images from backend deployment URLs (Railway, Render, Fly.io)
      {
        protocol: 'https',
        hostname: '*.railway.app',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '*.render.com',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '*.fly.dev',
        pathname: '/media/**',
      },
      // Allow any HTTPS backend for flexibility (you can restrict this later)
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
