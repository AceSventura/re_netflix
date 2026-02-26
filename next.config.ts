/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.nflxso.net', // Accetta tutti i sottodomini di Netflix
      },
      {
        protocol: 'https',
        hostname: 'assets.nflxext.com', // Per sfondo
      },
    ],
  },
};

export default nextConfig;