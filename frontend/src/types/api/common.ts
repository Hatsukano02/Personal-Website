// 通用 API 类型定义

import { StrapiEntity } from './strapi';

// API 错误类型
export interface APIErrorDetails {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

// 错误类型枚举
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
}

// 分页参数类型
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  start?: number;
  limit?: number;
}

// 排序参数类型
export type SortParam = string | string[];

// 过滤参数类型
export interface FilterParams {
  [key: string]: unknown;
}

// 查询参数类型
export interface QueryParams {
  pagination?: PaginationParams;
  sort?: SortParam;
  filters?: FilterParams;
  populate?: string | string[] | Record<string, unknown>;
  fields?: string[];
  locale?: string;
}

// 创建/更新输入类型生成器
export type CreateInput<T> = Omit<T, keyof StrapiEntity>;
export type UpdateInput<T> = Partial<CreateInput<T>>;

// API 响应状态
export interface APIStatus {
  loading: boolean;
  error: APIErrorDetails | null;
  success: boolean;
}

// 缓存配置类型
export interface CacheConfig {
  staleTime: number;
  gcTime: number;
}

// API 端点常量
export const API_ENDPOINTS = {
  socialLinks: '/social-links',    // 社交链接 (已有测试数据)
  tags: '/tags',                   // 标签系统
  blogPosts: '/blog-posts',        // 博客文章
  photos: '/photos',               // 摄影作品
  photoAlbums: '/photo-albums',    // 摄影作品集
  projects: '/projects',           // 技术项目
  albums: '/albums',               // 音乐专辑
  mediaWorks: '/media-works',      // 影视作品
} as const;

// API 端点类型
export type APIEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];