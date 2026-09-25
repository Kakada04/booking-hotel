import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.101.164",
    "192.168.101.164:3000",
    "192.168.101.*",
    "192.168.*",
    "localhost:3000",
    "localhost",
  ],
};

export default nextConfig;

