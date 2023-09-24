/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    // Your Next.js configuration options here
    webpack: (config) => {
      if (process.env.NODE_ENV === 'development') {
        // Disable specific warnings and errors in the development build
        config.performance.hints = false;
      }
      return config;
    },
  }