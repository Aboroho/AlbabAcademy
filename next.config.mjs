// import type { NextConfig } from "next";

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  experimental: {},
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
