/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'plus.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable React Strict Mode for better development practices
  reactStrictMode: true,
  // Enable static exports for static site generation
  output: 'standalone',
  // Enable SWC minification
  swcMinify: true,
  // Enable webpack5 with Turbopack
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    return config;
  },
  // Enable source maps in production for better debugging
  productionBrowserSourceMaps: true,
  // Configure build output directory
  distDir: '.next',
  // Enable compression for better performance
  compress: true,
  // Configure page extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  // Configure TypeScript
  typescript: {
    // Enable TypeScript type checking during build
    ignoreBuildErrors: false,
  },
  // Configure ESLint
  eslint: {
    // Run ESLint during builds
    ignoreDuringBuilds: false,
  },
}

// For production builds, use the standalone output
if (process.env.NODE_ENV === 'production') {
  nextConfig.output = 'standalone';
}

module.exports = nextConfig
