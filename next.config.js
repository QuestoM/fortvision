/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack
  experimental: {
    turbo: false
  },
  images: {
    domains: ['i.imgur.com'],
  },
  // Expose environment variables to the client
  env: {
    NEXT_PUBLIC_FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  }
};

module.exports = nextConfig;