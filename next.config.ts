import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ui-avatars fallback
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },

      // backend uploaded images
      {
        protocol: "http",
        hostname: "localhost",
        port: "5678",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
