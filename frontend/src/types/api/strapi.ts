// 基于 Strapi 5.19.0 实际响应结构的类型定义

// Strapi 实体基础字段 (Strapi 5.x)
export interface StrapiEntity {
  id: number;
  documentId: string; // Strapi 5.x 新增
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
  localizations?: StrapiEntity[];
}

// Strapi 单个资源响应
export interface StrapiResponse<T> {
  data: T & StrapiEntity;
  meta: Record<string, unknown>;
}

// Strapi 集合响应
export interface StrapiCollectionResponse<T> {
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

// 文件上传类型 (基于实际 PluginUploadFile)
export interface StrapiFile {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, unknown>;
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

// 查询参数类型
export interface StrapiQueryParams {
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  sort?: string | string[];
  filters?: Record<string, unknown>;
  populate?: string | string[] | Record<string, unknown>;
  fields?: string[];
  locale?: string;
}