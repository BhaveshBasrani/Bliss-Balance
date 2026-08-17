/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  experimental: {
    allowedDevOrigins: ['192.168.88.3', '192.168.88.3:3000', 'localhost:3000', '0.0.0.0:3000'],
  },
  reactStrictMode: true,
};

export default nextConfig;
