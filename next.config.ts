import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.UPLOADTHING_HOSTNAME || '',
        port: '',
      },
    ],
  },
};

export default nextConfig;
