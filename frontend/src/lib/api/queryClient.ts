import { QueryClient } from '@tanstack/react-query';

// 创建 QueryClient 实例
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟数据新鲜时间
      gcTime: 10 * 60 * 1000, // 10分钟缓存保留时间 (原 cacheTime)
      retry: 3, // 失败重试3次
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数退避
      refetchOnWindowFocus: false, // 个人网站无需窗口聚焦刷新
    },
    mutations: {
      retry: 1,
    },
  },
});

// 不同类型内容的缓存配置
export const cacheConfig = {
  // 动态内容
  blog: {
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 30 * 60 * 1000, // 30分钟
  },
  
  // 半静态内容  
  projects: {
    staleTime: 60 * 60 * 1000, // 1小时
    gcTime: 2 * 60 * 60 * 1000, // 2小时
  },
  
  // 静态内容
  socialLinks: {
    staleTime: 24 * 60 * 60 * 1000, // 24小时
    gcTime: 48 * 60 * 60 * 1000, // 48小时
  },
  
  // 摄影作品
  photos: {
    staleTime: 60 * 60 * 1000, // 1小时
    gcTime: 2 * 60 * 60 * 1000, // 2小时
  },
  
  // 音乐/电影收藏
  collections: {
    staleTime: 6 * 60 * 60 * 1000, // 6小时
    gcTime: 12 * 60 * 60 * 1000, // 12小时
  },
} as const;