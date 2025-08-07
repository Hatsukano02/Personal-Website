# API 集成层设计文档

## 1. 概述

### 1.1 目标
建立一个健壮、可维护、类型安全的 API 集成层，连接 Next.js 15 前端和 Strapi 5.19.0 CMS 后端。

### 1.2 实际技术栈
- **前端**: Next.js 15.4.3 + React 19.1.0 + TypeScript 5
- **后端**: Strapi 5.19.0 + PostgreSQL 15.13
- **状态管理**: Zustand 5.0.6 + TanStack Query 5.83.0
- **HTTP客户端**: Axios 1.11.0
- **缓存**: Redis 8.0.3 (生产环境)

### 1.3 核心原则
- **类型安全**: 基于 Strapi 5.19.0 实际 API 结构的完整 TypeScript 类型覆盖
- **错误处理**: 适合个人网站场景的错误处理和恢复机制
- **性能优化**: TanStack Query 智能缓存和请求去重
- **开发体验**: 清晰的 API 和调试支持
- **环境一致性**: 开发/生产环境配置统一管理

## 2. 架构设计

### 2.1 分层架构

```
┌─────────────────────────────────────────────┐
│           UI Components (页面/组件)           │
├─────────────────────────────────────────────┤
│          Custom Hooks (useAPI)              │
├─────────────────────────────────────────────┤
│         React Query (缓存层)                 │
├─────────────────────────────────────────────┤
│       API Services (业务逻辑)               │
├─────────────────────────────────────────────┤
│        API Client (Axios实例)               │
├─────────────────────────────────────────────┤
│         Strapi REST API                     │
└─────────────────────────────────────────────┘
```

### 2.2 目录结构

```
src/
├── lib/
│   ├── api/
│   │   ├── client.ts          # Axios 客户端配置
│   │   ├── services/          # API 服务层
│   │   │   ├── projects.ts    # 项目相关 API
│   │   │   ├── blog.ts        # 博客相关 API
│   │   │   ├── photos.ts      # 摄影相关 API
│   │   │   ├── music.ts       # 音乐相关 API
│   │   │   ├── movies.ts      # 电影相关 API
│   │   │   ├── media.ts       # 媒体相关 API
│   │   │   ├── links.ts       # 链接相关 API
│   │   │   └── contact.ts     # 联系相关 API
│   │   └── utils/             # API 工具函数
│   │       ├── errors.ts      # 错误处理
│   │       ├── transform.ts   # 数据转换
│   │       └── validators.ts  # 数据验证
│   └── hooks/                 # 自定义 Hooks
│       ├── api/              # API 相关 Hooks
│       │   ├── useProjects.ts
│       │   ├── useBlog.ts
│       │   └── ...
│       └── index.ts          # 导出入口
└── types/
    ├── api/                  # API 类型定义
    │   ├── common.ts         # 通用类型
    │   ├── strapi.ts         # Strapi 响应类型
    │   ├── models.ts         # 数据模型
    │   └── index.ts          # 类型导出
    └── index.ts

```

## 3. API 客户端设计

### 3.1 基础配置

**文件**: `src/lib/api/client.ts`

#### 功能要求
- 基础 URL 配置（开发/生产环境）
- 请求/响应拦截器
- 认证 token 管理
- 超时设置
- 错误统一处理

#### 环境变量

**开发环境** (`.env.local`)
```env
# Strapi API 配置
NEXT_PUBLIC_API_URL=http://localhost:1337/api
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# 图片和媒体文件
NEXT_PUBLIC_UPLOADS_URL=http://localhost:1337/uploads
```

**生产环境** (通过 Nginx 代理)
```env
# 使用相对路径，通过 Nginx 代理到 Strapi
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_STRAPI_URL=
NEXT_PUBLIC_UPLOADS_URL=/uploads
```

### 3.2 请求拦截器

- 添加认证 token（如果存在）
- 添加语言头（i18n 支持）
- 请求日志（开发环境）

### 3.3 响应拦截器

- 数据提取（解包 Strapi 响应格式）
- 错误转换（统一错误格式）
- 响应日志（开发环境）

## 4. 类型系统设计

### 4.1 Strapi 5.19.0 响应类型

**文件**: `src/types/api/strapi.ts`

```typescript
// ⚠️ 修正: 基于 Strapi 5.x 官方文档的实际响应结构
// Strapi 单个资源响应 (修正版)
interface StrapiResponse<T> {
  data: T & StrapiEntity;
  meta: Record<string, any>;
}

// Strapi 集合响应 (修正版)
interface StrapiCollectionResponse<T> {
  data: Array<T & StrapiEntity>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// ⚠️ 修正: Strapi 5.x 实体基础字段 (基于官方文档)
interface StrapiEntity {
  id: number; // 仍然存在，用于向后兼容
  documentId: string; // Strapi 5.x 的主要标识符
  createdAt: string; // ISO 8601 格式
  updatedAt: string; // ISO 8601 格式
  publishedAt?: string; // 仅在内容类型启用draft & publish时存在
  locale?: string; // 仅在启用i18n时存在
  localizations?: StrapiEntity[]; // 仅在启用i18n时存在
}

// 文件上传类型 (基于实际 PluginUploadFile)
interface StrapiFile {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, any>;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}
```

### 4.2 业务数据模型类型

**文件**: `src/types/api/models.ts`

> **重要**: 以下类型定义基于 `phase_2_1_config.md` 中已实际创建完成的 8 个 Strapi 内容类型，所有 API 端点都已可用。

```typescript
// 1. 博客文章 (API: /api/blog-posts)
interface BlogPost {
  title: string;
  slug: string; // UID, target_field: title
  content: string; // Rich Text (Markdown)
  excerpt?: string; // Long text
  featured_image?: StrapiFile; // Single media, images only
  featured_video?: StrapiFile; // Single media, videos only  
  featured_audio?: StrapiFile; // Single media, audios only
  reading_time?: number; // Integer, minutes
  is_published: boolean; // default: false
  publish_date?: string; // Date & Time
  view_count?: number; // Integer, default: 0
  tags?: Tag[]; // Many to Many relation
}

// 2. 技术项目 (API: /api/projects)
interface Project {
  title: string;
  slug: string; // UID, target_field: title
  description: string; // Long text, required
  content?: string; // Rich Text (Blocks)
  featured_image?: StrapiFile; // Single media, images only
  featured_video?: StrapiFile; // Single media, videos only
  featured_audio?: StrapiFile; // Single media, audios only
  tech_stack?: string[]; // JSON array
  project_url?: string; // URL validation
  github_url?: string; // URL validation
  project_status: 'In_Progress' | 'Completed' | 'Paused'; // default: In_Progress
  display_order: number; // Integer, required, default: 0
  is_featured: boolean; // default: false
}

// 3. 摄影作品 (API: /api/photos)
interface Photo {
  title: string; // required
  slug: string; // UID, target_field: title
  description?: string; // Long text
  image: StrapiFile; // Single media, images only, required
  category: 'Portrait' | 'Landscape' | 'Street' | 'Architecture' | 'Nature' | 'Other'; // required
  camera_model?: string;
  lens_model?: string;
  aperture?: string; // e.g., f/2.8
  shutter_speed?: string; // e.g., 1/200s
  iso?: number; // Integer
  focal_length?: string; // e.g., 85mm
  location?: string;
  taken_at?: string; // Date & Time
  is_hdr: boolean; // default: false
  color_space: 'sRGB' | 'Adobe_RGB' | 'ProPhoto_RGB' | 'DCI_P3'; // default: sRGB
  is_featured: boolean; // default: false
  display_order: number; // Integer, required, default: 0
  covered_albums?: PhotoAlbum[]; // Many to Many, auto-generated
  albums?: PhotoAlbum[]; // Many to Many, auto-generated
}

// 4. 音乐专辑 (API: /api/albums)
interface Album {
  title: string; // required
  artist: string; // required
  cover_image?: StrapiFile; // Single media, images only
  cover_video?: StrapiFile; // Single media, videos only
  release_year?: number; // Integer
  genre?: string;
  personal_rating?: number; // Decimal, 0-10 range
  review?: string; // Rich Text (Blocks)
  spotify_url?: string; // URL validation
  apple_music_url?: string; // URL validation
  favorite_track?: string;
  listen_date?: string; // Date
  is_favorite: boolean; // default: false
  display_order: number; // Integer, required, default: 0
}

// 5. 影视作品 (API: /api/media-works)
interface MediaWork {
  title: string; // 中文标题, required
  original_title?: string; // 原版标题
  poster_image?: StrapiFile; // Single media, images only
  trailer_video?: StrapiFile; // Single media, videos only
  soundtrack_audio?: StrapiFile; // Single media, audios only
  type: 'Movie' | 'Series' | 'Documentary' | 'Animation'; // required
  release_year?: number; // Integer
  director?: string; // 导演/监督
  genre?: string[]; // JSON array, 类型标签
  personal_rating?: number; // Decimal, 0-10 range
  review?: string; // Rich Text (Blocks)
  watch_date?: string; // Date
  watch_platform?: string;
  trailer_url?: string; // URL validation
  imdb_url?: string; // URL validation
  douban_url?: string; // URL validation
  bangumi_url?: string; // URL validation, 动画专用
  is_favorite: boolean; // default: false
  watch_status: 'Watched' | 'Watching' | 'Plan_to_Watch'; // default: Plan_to_Watch
  display_order: number; // Integer, required, default: 0
}

// 6. 摄影作品集 (API: /api/photo-albums)
interface PhotoAlbum {
  album_name: string; // required
  slug: string; // UID, target_field: album_name
  description?: string; // Long text
  cover_photo?: Photo; // Many to One relation
  album_type?: 'Travel' | 'Portrait' | 'Street' | 'Commercial' | 'Personal' | 'Other';
  location?: string;
  shoot_date?: string; // Date
  is_featured: boolean; // default: false
  is_private: boolean; // default: false
  display_order: number; // Integer, required, default: 0
  photos?: Photo[]; // Many to Many relation
}

// 7. 社交链接 (API: /api/social-links) - 已有测试数据
interface SocialLink {
  platform: string; // required, unique, 社交平台名称
  display_name: string; // required, 显示的名称
  url: string; // required, URL格式验证
  platform_icon: string; // required, 图标标识符
  is_active: boolean; // default: true
  display_order: number; // Integer, required, default: 0
}

// 8. 标签系统 (API: /api/tags)
interface Tag {
  name: string; // required, unique
  slug: string; // UID, target_field: name
  color?: string; // hex code
  description?: string; // Long text
}

// 枚举值国际化映射
const ENUM_MAPS = {
  projectStatus: {
    In_Progress: '进行中',
    Completed: '已完成', 
    Paused: '暂停'
  },
  photoCategory: {
    Portrait: '人像',
    Landscape: '风景',
    Street: '街拍',
    Architecture: '建筑',
    Nature: '自然',
    Other: '其他'
  },
  colorSpace: {
    sRGB: 'sRGB',
    Adobe_RGB: 'Adobe RGB',
    ProPhoto_RGB: 'ProPhoto RGB',
    DCI_P3: 'DCI-P3'
  },
  mediaWorkType: {
    Movie: '电影',
    Series: '电视剧',
    Documentary: '纪录片',
    Animation: '动画'
  },
  watchStatus: {
    Watched: '已观看',
    Watching: '观看中',
    Plan_to_Rate: '计划观看'
  }
} as const;
```

### 4.3 API 输入输出类型

```typescript
// 查询参数类型
interface StrapiQueryParams {
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  sort?: string | string[];
  filters?: Record<string, any>;
  populate?: string | string[] | Record<string, any>;
  fields?: string[];
  locale?: string;
}

// 创建/更新输入类型示例
type CreateBlogPostInput = Omit<BlogPost, keyof StrapiEntity>;
type UpdateBlogPostInput = Partial<CreateBlogPostInput>;

// API 响应包装类型
type BlogPostResponse = StrapiResponse<BlogPost>;
type BlogPostListResponse = StrapiCollectionResponse<BlogPost>;
```

### 4.3 通用类型

**文件**: `src/types/api/common.ts`

- API 错误类型
- 分页参数类型
- 排序参数类型
- 过滤参数类型

## 5. API 服务层设计

### 5.1 实际 API 端点映射

基于 phase_2_1_config.md 中已完成的 8 个内容类型：

```typescript
// API 端点映射
const API_ENDPOINTS = {
  socialLinks: '/api/social-links',    // 社交链接 (已有测试数据)
  tags: '/api/tags',                  // 标签系统
  blogPosts: '/api/blog-posts',       // 博客文章
  photos: '/api/photos',              // 摄影作品
  photoAlbums: '/api/photo-albums',   // 摄影作品集
  projects: '/api/projects',          // 技术项目
  albums: '/api/albums',              // 音乐专辑
  mediaWorks: '/api/media-works',     // 影视作品
} as const;
```

### 5.2 服务模块规范

个人网站只需读取操作，每个服务模块包含：
- `getAll`: 获取列表（支持分页、过滤、排序）
- `getById`: 获取单个资源
- `getBySlug`: 通过 slug 获取资源（适用于 Blog/Photo/Project）

### 5.2 查询参数设计

```typescript
interface QueryParams {
  page?: number;
  pageSize?: number;
  sort?: string[];
  filters?: Record<string, any>;
  populate?: string | string[];
}
```

### 5.3 错误处理策略

- 网络错误：自动重试
- 认证错误：跳转登录
- 验证错误：显示表单错误
- 服务器错误：显示友好提示

## 6. TanStack Query 集成

### 6.1 查询配置

**全局配置** (`src/lib/api/queryClient.ts`):
```typescript
import { QueryClient } from '@tanstack/react-query';

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
```

### 6.2 查询键规范

```typescript
// 查询键工厂 (src/lib/api/queryKeys.ts)
export const queryKeys = {
  // 博客相关
  blogs: ['blogs'] as const,
  blogList: (params?: StrapiQueryParams) => ['blogs', 'list', params] as const,
  blogDetail: (id: string | number) => ['blogs', 'detail', id] as const,
  blogBySlug: (slug: string) => ['blogs', 'slug', slug] as const,
  
  // 项目相关
  projects: ['projects'] as const,
  projectList: (params?: StrapiQueryParams) => ['projects', 'list', params] as const,
  projectDetail: (id: string | number) => ['projects', 'detail', id] as const,
  
  // 摄影相关
  photos: ['photos'] as const,
  photoList: (params?: StrapiQueryParams) => ['photos', 'list', params] as const,
  photosByCategory: (category: string) => ['photos', 'category', category] as const,
  
  // 音乐相关
  music: ['music'] as const,
  musicList: (params?: StrapiQueryParams) => ['music', 'list', params] as const,
  favoriteAlbums: () => ['music', 'favorites'] as const,
  
  // 影视相关
  movies: ['movies'] as const,
  movieList: (params?: StrapiQueryParams) => ['movies', 'list', params] as const,
  moviesByType: (type: string) => ['movies', 'type', type] as const,
  
  // 媒体和链接
  media: ['media'] as const,
  socialLinks: ['social-links'] as const,
} as const;
```

### 6.3 缓存策略

针对个人网站特点的优化缓存策略:

- **博客文章列表**: 5分钟更新（内容可能更新）
- **博客文章详情**: 30分钟更新（内容相对稳定）
- **项目展示**: 1小时更新（更新频率低）
- **摄影作品**: 1小时更新（相对静态）
- **音乐/电影收藏**: 6小时更新（个人收藏更新频率低）
- **社交链接**: 24小时更新（基本不变）

```typescript
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
} as const;
```

## 7. Hooks 设计规范

### 7.1 基础 Hook 模板

```typescript
interface UseResourceOptions {
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseResourceResult<T> {
  data?: T;
  error?: Error;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}
```

### 7.2 分页 Hook 设计

```typescript
interface UsePaginatedResourceOptions {
  page: number;
  pageSize: number;
  filters?: Record<string, any>;
  sort?: string[];
}
```

### 7.3 无限滚动 Hook 设计

适用于摄影作品、博客文章等需要无限加载的场景。

## 8. 数据转换规范

### 8.1 日期处理
- 统一转换为 Date 对象
- 时区处理（UTC -> 本地）

### 8.2 图片 URL 处理
- 相对路径转绝对路径
- 缩略图 URL 生成

### 8.3 Markdown 处理
- 博客内容预处理
- 代码高亮支持

## 9. 错误处理设计

### 9.1 针对个人网站的错误分类

```typescript
// 错误类型定义 (src/lib/api/errors.ts)
class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// 错误类型枚举
enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR', 
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
}
```

### 9.2 个人网站错误恢复策略

**简化的错误处理逻辑**（移除不适用的认证跳转等）:

```typescript
// 错误处理配置
const errorHandlers = {
  // 网络错误：显示友好提示和重试选项
  networkError: (error: Error) => ({
    title: '网络连接问题',
    message: '请检查网络连接后重试',
    actions: ['重试', '稍后再试'],
  }),
  
  // 404错误：显示内容不存在
  notFound: () => ({
    title: '内容不存在',
    message: '您访问的内容可能已被删除或移动',
    actions: ['返回首页'],
  }),
  
  // 服务器错误：显示缓存数据或占位内容
  serverError: () => ({
    title: '服务暂时不可用',
    message: '正在努力修复中，请稍后再试',
    actions: ['重试'],
    fallback: 'cached', // 显示缓存数据
  }),
  
  // 默认错误处理
  default: () => ({
    title: '出现了一些问题',
    message: '请稍后重试或联系站长',
    actions: ['重试'],
  }),
};
```

### 9.3 优雅降级策略

```typescript
// 内容加载失败时的降级显示
const fallbackStrategies = {
  // 博客列表加载失败：显示占位卡片
  blogList: () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => <BlogCardSkeleton key={i} />)}
    </div>
  ),
  
  // 项目展示加载失败：显示基本信息
  projectList: () => (
    <div className="text-center text-gray-500">
      <p>项目内容暂时无法加载</p>
      <p>您可以通过 GitHub 查看我的开源项目</p>
    </div>
  ),
  
  // 图片加载失败：显示占位图
  imageError: (alt?: string) => (
    <div className="bg-gray-200 flex items-center justify-center">
      <span className="text-gray-500">{alt || '图片加载失败'}</span>
    </div>
  ),
};
```

## 10. 性能优化策略

### 10.1 请求优化
- 并行请求合并
- 请求去重
- 预加载关键数据

### 10.2 缓存优化
- 乐观更新
- 后台数据同步
- 缓存预热

### 10.3 数据优化
- 分页加载
- 懒加载图片
- 按需加载字段（populate）

## 11. 开发工具支持

### 11.1 调试工具
- React Query Devtools
- 网络请求日志
- 错误边界组件

### 11.2 测试支持
- Mock API 客户端
- 测试数据工厂
- 请求拦截器

## 12. 安全考虑

### 12.1 个人网站安全策略

**⚠️ 修正: 基于Strapi 5.x Users & Permissions插件的安全模型**:

```typescript
// API 客户端安全配置 (修正版)
const securityConfig = {
  // HTTPS 强制（生产环境）
  httpsOnly: process.env.NODE_ENV === 'production',
  
  // ⚠️ 修正: Strapi 5.x不需要API密钥，通过Public角色权限控制
  // 删除: apiKey: process.env.NEXT_PUBLIC_STRAPI_API_KEY,
  
  // 请求头安全
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  
  // ⚠️ 修正: Strapi 5.x CORS配置通过中间件处理
  withCredentials: false,
};

// ⚠️ 新增: Strapi 5.x权限配置要求
const STRAPI_PERMISSIONS_REQUIREMENTS = {
  // Users & Permissions插件中的Public角色需要配置:
  publicRole: {
    // 对每个Content Type需要在Public角色中启用以下权限:
    permissions: [
      'find', // 获取列表
      'findOne', // 获取单个资源
    ],
    // 注意: Strapi 5.x中不再有APPLICATION部分，直接在角色权限中配置
  },
};
```

### 12.2 数据安全

```typescript
// 内容安全处理
const sanitizeContent = (content: string): string => {
  // 对于个人网站，内容由站长控制，但仍需基础防护
  return content
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // 移除script标签
    .replace(/javascript:/gi, '') // 移除javascript:协议
    .trim();
};

// URL 安全验证
const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};
```

### 12.3 环境安全

```typescript
// 环境变量安全管理
const getApiConfig = () => {
  const isDev = process.env.NODE_ENV === 'development';
  
  return {
    baseURL: isDev 
      ? process.env.NEXT_PUBLIC_API_URL 
      : '/api', // 生产环境使用相对路径
    timeout: 10000, // 10秒超时
    
    // 开发环境允许详细错误信息
    includeErrorDetails: isDev,
  };
};
```

## 13. 迁移和版本管理

### 13.1 API 版本
- 版本头支持
- 向后兼容策略

### 13.2 数据迁移
- 字段映射
- 默认值处理

## 14. 监控和日志

### 14.1 性能监控
- API 响应时间
- 缓存命中率
- 错误率统计

### 14.2 日志记录
- 请求日志
- 错误日志
- 用户行为日志

## 15. 实施计划（基于实际项目状态）

### 阶段 1：基础架构实现 🔥 **立即执行**

> **⚠️ 修正状态**: Strapi 内容类型已全部完成 (8/8)，但存在配置问题！

1. **⚠️ 修正: API 客户端实现和权限配置**
   - ✅ 基于实际 8 个 API 端点配置 Axios
   - 🚨 **优先级1**: 修复CORS中间件配置错误 (移除`enabled: true`)
   - 🚨 **优先级2**: 配置Users & Permissions插件的Public角色权限
   - 🚨 **优先级3**: 验证所有API端点在修复后的实际响应结构
   - 测试现有 Social Links API (已有3条数据)

2. **类型定义完善**
   - 根据实际字段配置更新类型
   - 添加枚举值国际化映射
   - 实现数据转换工具

### 阶段 2：API 集成层实现 ⚡ **高优先级**
1. **API 客户端配置**
   - 基于实际环境配置 Axios 客户端
   - 配置开发/生产环境 URL 策略
   - 实现请求/响应拦截器

2. **核心服务实现**
   - 实现各业务模块的 API 服务
   - 集成 TanStack Query
   - 创建自定义 Hooks

### 阶段 3：集成到现有组件 📝 **中优先级**
1. **Hero Section 数据集成**
   - 替换静态数据为动态 API 数据
   - 集成个人简介信息

2. **其他 Section 实现**
   - 按优先级实现各个 Section 的数据获取
   - 集成到现有的前端架构

### 阶段 4：优化和完善 📈 **低优先级**
1. **性能优化**
   - 缓存策略优化
   - 图片懒加载
   - 代码分割

2. **开发体验优化**
   - 错误边界完善
   - 加载状态优化
   - 开发工具集成

## 16. 🚨 重要修正和问题解决方案 (v3.2)

### 16.1 官方文档核对结果

经过与Strapi 5.x官方文档的系统性核对，发现以下关键问题：

#### 16.1.1 关键发现
- **CORS配置错误**: 后端`middlewares.ts`中的`enabled: true`配置导致Content API无法初始化
- **权限配置遗漏**: 缺少Users & Permissions插件的Public角色权限配置说明
- **响应格式细节**: Relations字段返回count对象而非数组，需要特殊处理
- **媒体文件URL处理**: 需要正确的图片URL构建和CSP策略配置
- **Populate查询规范**: 关联数据查询需要正确的参数格式

#### 16.1.2 已修正问题
1. **✅ CORS中间件配置**: 移除了不兼容的`enabled: true`选项
2. **✅ API路由定义**: 确认手动路由定义方式正确
3. **✅ 类型系统**: 更新了安全策略和权限配置要求
4. **✅ 实施计划**: 调整优先级，优先解决配置问题
5. **✅ 深度技术细节**: 补充了Relations、媒体处理、权限系统等关键实现细节

#### 16.1.3 待解决配置
- **🔴 高优先级**: Users & Permissions插件Public角色权限配置
- **🔴 高优先级**: Relations字段响应格式处理
- **🟡 中优先级**: 媒体文件URL处理和CSP策略
- **🟡 中优先级**: 验证所有API端点在修正后的实际响应
- **🟢 低优先级**: 完善错误处理和缓存策略

### 16.2 关键技术实现细节修正

#### 16.2.1 Relations字段响应格式处理

**⚠️ 重要发现**: Strapi 5.x中Relations字段初始响应为count对象：

```typescript
// Relations字段的实际响应格式
interface RelationFieldResponse {
  my_relations: {
    count: number;
  }
}

// 需要的转换逻辑
const transformRelationsResponse = (data: any) => {
  const transformed = { ...data };
  
  // 识别Relations字段并转换
  Object.keys(transformed).forEach(key => {
    if (transformed[key] && typeof transformed[key] === 'object' && 'count' in transformed[key]) {
      // Relations字段处理：保留count信息，但准备数组结构
      transformed[key] = {
        count: transformed[key].count,
        items: [] // 后续通过populate获取实际数据
      };
    }
  });
  
  return transformed;
};
```

#### 16.2.2 媒体文件URL处理优化

**⚠️ 安全配置**: 需要更新CSP策略支持媒体文件：

```typescript
// middlewares.ts 安全配置更新
const securityConfig = {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'connect-src': ["'self'", 'https:'],
      'img-src': ["'self'", 'data:', 'blob:', process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'],
      'media-src': ["'self'", 'data:', 'blob:', process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'],
      upgradeInsecureRequests: null,
    },
  },
};

// 图片URL处理函数
const buildMediaURL = (file: StrapiFile) => {
  if (!file?.url) return null;
  
  // 如果是完整URL，直接返回
  if (file.url.startsWith('http')) {
    return file.url;
  }
  
  // 构建完整URL
  const baseURL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return `${baseURL}${file.url}`;
};
```

#### 16.2.3 Populate查询规范

**⚠️ 查询参数规范**: Strapi 5.x的populate语法：

```typescript
// 正确的populate查询格式
const queryParams: StrapiQueryParams = {
  populate: {
    // 单个字段
    featured_image: true,
    
    // 多个媒体字段
    featured_image: true,
    featured_video: true,
    
    // 关联字段
    tags: {
      fields: ['name', 'slug'],
    },
    
    // 深层关联
    cover_photo: {
      populate: {
        image: true,
        albums: {
          fields: ['album_name', 'slug']
        }
      }
    }
  },
  
  // 字段选择
  fields: ['title', 'slug', 'description', 'publishedAt'],
  
  // 过滤和排序
  filters: {
    is_active: { $eq: true },
    publishedAt: { $notNull: true }
  },
  
  sort: ['display_order:asc', 'publishedAt:desc']
};
```

### 16.3 权限配置完整指南

#### 16.3.1 Users & Permissions插件配置步骤

**🚨 关键操作**（需要用户在Strapi管理后台执行）：

1. **访问权限设置**:
   - 登录Strapi管理后台
   - 导航至：设置 → 用户和权限 → 角色 → Public

2. **为每个内容类型启用权限**:
   ```
   内容类型: Album (api::album.album)
   ✅ find (获取列表)
   ✅ findOne (获取单个)
   
   内容类型: Blog-post (api::blog-post.blog-post)
   ✅ find
   ✅ findOne
   
   内容类型: Media-work (api::media-work.media-work)
   ✅ find
   ✅ findOne
   
   内容类型: Photo (api::photo.photo)
   ✅ find
   ✅ findOne
   
   内容类型: Photo-album (api::photo-album.photo-album)
   ✅ find
   ✅ findOne
   
   内容类型: Project (api::project.project)
   ✅ find
   ✅ findOne
   
   内容类型: Social-link (api::social-link.social-link)
   ✅ find
   ✅ findOne
   
   内容类型: Tag (api::tag.tag)
   ✅ find
   ✅ findOne
   ```

3. **保存配置**: 点击保存按钮应用权限更改

#### 16.3.2 权限验证方法

```bash
# 测试API端点可访问性
curl -X GET "http://localhost:1337/api/social-links" \
  -H "Content-Type: application/json"

# 预期响应: 200 OK with data
# 错误响应: 403 Forbidden (权限未配置)
```

### 16.4 下一步行动计划

**🚨 立即执行（用户需协助）**:
1. **配置Public角色权限**: 按照16.3.1节步骤配置所有内容类型权限
2. **验证CORS修复**: 重启Strapi服务，确认Content API endpoints (/api/*)可访问
3. **API连接测试**: 使用前端debug工具验证API连接正常
4. **Relations响应格式测试**: 验证包含关联字段的API响应格式

**📋 后续开发**:
5. 🚨 实现基础 API 客户端配置（包含Relations处理）
6. 🚨 创建第一个 API 服务（socialLinks.ts）
7. 🚨 实现媒体文件URL处理工具
8. 📝 集成到现有前端组件

**📚 文档维护**:
- ✅ API集成设计文档已修正关键错误和技术细节
- 📝 根据实际测试结果更新最终配置
- 📝 更新项目进度到 todo.md

---

**文档版本**: v3.2  
**创建日期**: 2025-08-05  
**更新日期**: 2025-08-07  
**维护人**: Claude  
**更新记录**: 
- v1.0: 初始设计文档
- v2.0: 基于实际技术栈和项目状态全面修订
- v3.0: **基于 phase_config_docs 实际数据结构更新**，8 个 Strapi 内容类型已完成，更新 API 端点、字段结构和枚举值映射
- v3.1: **🚨 重要修正**: 基于Strapi 5.x官方文档系统性修正类型定义、响应格式、权限配置和安全策略，修复CORS配置错误和权限设置问题
- v3.2: **🔍 深度技术细节完善**: 补充Relations字段响应格式处理、媒体文件URL构建、Populate查询规范、权限配置完整指南等关键技术实现细节