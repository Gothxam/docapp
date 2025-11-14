import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow external avatars from ui-avatars.com
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
