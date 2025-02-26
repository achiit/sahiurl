/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Required for static export
  },
  // Add rewrites for API routes in development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://sahiurl.web.app/api/:path*',
      },
    ]
  },
}

export default nextConfig

