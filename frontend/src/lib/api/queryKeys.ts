// 查询键工厂
// 统一管理所有 React Query 的查询键

import type { StrapiQueryParams } from '../../types/api';

export const queryKeys = {
  // 社交链接相关
  socialLinks: ['social-links'] as const,
  socialLinksList: (params?: StrapiQueryParams) => ['social-links', 'list', params] as const,
  socialLinksDetail: (id: string | number) => ['social-links', 'detail', id] as const,
  socialLinksActive: () => ['social-links', 'active'] as const,
  socialLinksByPlatform: (platform: string) => ['social-links', 'platform', platform] as const,
  
  // 博客相关
  blogs: ['blogs'] as const,
  blogList: (params?: StrapiQueryParams) => ['blogs', 'list', params] as const,
  blogDetail: (id: string | number) => ['blogs', 'detail', id] as const,
  blogBySlug: (slug: string) => ['blogs', 'slug', slug] as const,
  
  // 项目相关
  projects: ['projects'] as const,
  projectList: (params?: StrapiQueryParams) => ['projects', 'list', params] as const,
  projectDetail: (id: string | number) => ['projects', 'detail', id] as const,
  projectBySlug: (slug: string) => ['projects', 'slug', slug] as const,
  projectsFeatured: () => ['projects', 'featured'] as const,
  
  // 摄影相关
  photos: ['photos'] as const,
  photoList: (params?: StrapiQueryParams) => ['photos', 'list', params] as const,
  photoDetail: (id: string | number) => ['photos', 'detail', id] as const,
  photoBySlug: (slug: string) => ['photos', 'slug', slug] as const,
  photosByCategory: (category: string) => ['photos', 'category', category] as const,
  photosFeatured: () => ['photos', 'featured'] as const,
  
  // 相册相关
  photoAlbums: ['photo-albums'] as const,
  photoAlbumList: (params?: StrapiQueryParams) => ['photo-albums', 'list', params] as const,
  photoAlbumDetail: (id: string | number) => ['photo-albums', 'detail', id] as const,
  photoAlbumBySlug: (slug: string) => ['photo-albums', 'slug', slug] as const,
  photoAlbumsFeatured: () => ['photo-albums', 'featured'] as const,
  
  // 音乐相关
  albums: ['albums'] as const,
  albumList: (params?: StrapiQueryParams) => ['albums', 'list', params] as const,
  albumDetail: (id: string | number) => ['albums', 'detail', id] as const,
  favoriteAlbums: () => ['albums', 'favorites'] as const,
  
  // 影视相关
  mediaWorks: ['media-works'] as const,
  mediaWorkList: (params?: StrapiQueryParams) => ['media-works', 'list', params] as const,
  mediaWorkDetail: (id: string | number) => ['media-works', 'detail', id] as const,
  mediaWorksByType: (type: string) => ['media-works', 'type', type] as const,
  favoriteMediaWorks: () => ['media-works', 'favorites'] as const,
  
  // 标签相关
  tags: ['tags'] as const,
  tagList: (params?: StrapiQueryParams) => ['tags', 'list', params] as const,
  tagDetail: (id: string | number) => ['tags', 'detail', id] as const,
  tagBySlug: (slug: string) => ['tags', 'slug', slug] as const,
} as const;