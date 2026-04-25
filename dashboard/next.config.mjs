/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  outputFileTracingIncludes: {
    "**": ["./node_modules/.prisma/client/**"],
  },
};

export default nextConfig;
