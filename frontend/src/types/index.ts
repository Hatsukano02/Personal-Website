// 基础内容类型接口
export interface ContentBase {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale?: string;
}

// 媒体文件接口
export interface MediaItem {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
}

export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

// 博客文章类型
export interface BlogPost extends ContentBase {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: MediaItem;
  tags?: Tag[];
  category?: Category;
  author?: string;
  readTime?: number;
  seo?: SEOData;
}

// 项目展示类型
export interface Project extends ContentBase {
  title: string;
  slug: string;
  description: string;
  content?: string;
  featuredImage?: MediaItem;
  gallery?: MediaItem[];
  technologies?: Technology[];
  liveUrl?: string;
  githubUrl?: string;
  status: 'active' | 'archived' | 'coming-soon';
  featured: boolean;
  seo?: SEOData;
}

// 摄影作品类型
export interface Photo extends ContentBase {
  title: string;
  description?: string;
  image: MediaItem;
  camera?: string;
  lens?: string;
  settings?: {
    aperture?: string;
    shutter?: string;
    iso?: string;
    focalLength?: string;
  };
  location?: string;
  takenAt?: string;
  tags?: Tag[];
  featured: boolean;
}

// 音乐专辑类型
export interface Album extends ContentBase {
  title: string;
  artist: string;
  cover?: MediaItem;
  releaseYear: number;
  genre?: string;
  rating?: number;
  review?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  favorite: boolean;
}

// 影视作品类型
export interface Movie extends ContentBase {
  title: string;
  originalTitle?: string;
  poster?: MediaItem;
  director: string;
  year: number;
  genre?: string;
  duration?: number;
  rating?: number;
  review?: string;
  imdbUrl?: string;
  doubanUrl?: string;
  favorite: boolean;
  type: 'movie' | 'tv-series' | 'documentary';
}

// 媒体文件类型
export interface Media extends ContentBase {
  title: string;
  description?: string;
  file: MediaItem;
  type: 'video' | 'audio' | 'document';
  category?: string;
  duration?: number;
  featured: boolean;
}

// 社交链接类型
export interface SocialLink extends ContentBase {
  platform: string;
  url: string;
  username?: string;
  icon?: string;
  order: number;
  active: boolean;
}

// 标签类型
export interface Tag extends ContentBase {
  name: string;
  slug: string;
  color?: string;
  description?: string;
}

// 分类类型
export interface Category extends ContentBase {
  name: string;
  slug: string;
  description?: string;
  parent?: Category;
}

// 技术栈类型
export interface Technology extends ContentBase {
  name: string;
  slug: string;
  icon?: MediaItem;
  color?: string;
  category: 'frontend' | 'backend' | 'database' | 'tool' | 'language' | 'framework';
  proficiency: 1 | 2 | 3 | 4 | 5;
}

// SEO数据类型
export interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  metaImage?: MediaItem;
  preventIndexing?: boolean;
}

// API响应类型
export interface APIResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// 分页响应类型
export interface PaginatedResponse<T> extends APIResponse<T[]> {
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// 错误响应类型
export interface ErrorResponse {
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// 查询参数类型
export interface QueryParams {
  populate?: string | string[];
  fields?: string | string[];
  filters?: Record<string, unknown>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  locale?: string;
}

// 站点配置类型
export interface SiteConfig extends ContentBase {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logo?: MediaItem;
  favicon?: MediaItem;
  socialLinks?: SocialLink[];
  navigation?: NavigationItem[];
  footer?: {
    copyright: string;
    links?: NavigationItem[];
  };
  seo?: SEOData;
}

// 导航项类型
export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavigationItem[];
  order: number;
  active: boolean;
}