/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
    serverComponentsExternalPackages: ["@prisma/client", ".prisma/client"],
  },
  outputFileTracingIncludes: {
    "*": ["./node_modules/.prisma/client/**"],
  },
};

export default nextConfig;
