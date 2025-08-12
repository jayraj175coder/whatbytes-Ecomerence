/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'plus.unsplash.com'],
  },
  // Enable React Strict Mode for better development practices
  reactStrictMode: true,
  // Enable webpack5 with Turbopack
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    return config;
  },
}

module.exports = nextConfig
