import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 实验性功能
  experimental: {
    // 优化打包体积
    optimizePackageImports: ["@tanstack/react-query", "framer-motion", "gsap"],
  },

  // 图片优化配置
  images: {
    // 允许的图片域名（后续根据实际需求添加）
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "你的域名.com",
        pathname: "/uploads/**",
      },
    ],
    // 图片格式优化
    formats: ["image/webp", "image/avif"],
    // 设备尺寸
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 图片尺寸
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // API路由重写（代理到Strapi）
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:1337/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://localhost:1337/uploads/:path*",
      },
    ];
  },

  // 压缩配置
  compress: true,

  // 输出模式
  output: "standalone",

  // 环境变量
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337",
    NEXT_PUBLIC_APP_NAME: "李翔的个人网站",
  },

  // TypeScript配置
  typescript: {
    // 在生产构建时检查类型错误
    ignoreBuildErrors: false,
  },

  // ESLint配置
  eslint: {
    // 在生产构建时检查ESLint错误
    ignoreDuringBuilds: false,
  },

  // 页面扩展名
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  // 重定向配置（可选）
  async redirects() {
    return [
      // 示例：重定向旧路径到新路径
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },

  // 头部配置
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      // 静态资源缓存
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
