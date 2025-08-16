/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverActions: {
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
