import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@acme/ui', '@prisma/client'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "martxmart.com",
      },
    ],
    localPatterns: [
      {
        pathname: "/logo.png",
      },
      {
        pathname: "/logo.png",
        search: "?height=*&width=*",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  // Remove serverRuntimeConfig as it's not supported in Next.js 16
  // serverRuntimeConfig: {
  //   apiTimeout: 3000,
  // },
  // Remove webpack config for Turbopack compatibility
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     config.externals.push('@prisma/client');
  //   }
  //   return config;
  // },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
