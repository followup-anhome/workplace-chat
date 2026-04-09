import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLintのバージョン競合によるビルドエラーを回避
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
