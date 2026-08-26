/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NEXT_EXPORT === 'true' ? { output: 'export' } : {}),
  allowedDevOrigins: ['192.168.88.3:3000', '192.168.88.3', 'localhost:3000'],
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
