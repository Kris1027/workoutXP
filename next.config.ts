import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['fra.cloud.appwrite.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
  },
};

export default nextConfig;
