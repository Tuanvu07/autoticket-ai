/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Prevents ESLint warnings/errors from failing the Vercel production build.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Prevents TS type errors from failing the Vercel production build.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
