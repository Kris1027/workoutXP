import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: (() => {
          if (!process.env.UPLOADTHING_HOSTNAME) {
            throw new Error('Environment variable for host is not set');
          }
          return process.env.UPLOADTHING_HOSTNAME;
        })(),
        port: '',
      },
    ],
  },
};

export default nextConfig;
