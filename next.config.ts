/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['jayupkcmarphlgviqkbf.supabase.co'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

module.exports = nextConfig;
