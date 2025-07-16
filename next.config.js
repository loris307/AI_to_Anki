/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: 'standalone',
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://ai-to-anki.vercel.app' : '',
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  // Exclude Supabase functions from the build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  experimental: {
    outputFileTracingExcludes: {
      '*': ['./supabase/**/*'],
    },
  },
};

module.exports = nextConfig;