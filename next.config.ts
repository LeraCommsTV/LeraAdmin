/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // This disables ESLint during build
    ignoreDuringBuilds: true,
  },
  typescript:{
    ignoreBuildErrors:true,
  },
  swcMinify: true
};

module.exports = nextConfig;