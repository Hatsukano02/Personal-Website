import { QueryParams, APIResponse, PaginatedResponse, ErrorResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

class StrapiAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'StrapiAPIError';
  }
}

// 构建查询字符串
function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  // 处理 populate 参数
  if (params.populate) {
    if (Array.isArray(params.populate)) {
      params.populate.forEach(field => searchParams.append('populate', field));
    } else {
      searchParams.append('populate', params.populate);
    }
  }

  // 处理 fields 参数
  if (params.fields) {
    if (Array.isArray(params.fields)) {
      params.fields.forEach(field => searchParams.append('fields', field));
    } else {
      searchParams.append('fields', params.fields);
    }
  }

  // 处理 filters 参数
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        // 处理嵌套过滤器，如 filters[title][$contains]=hello
        Object.entries(value).forEach(([operator, operatorValue]) => {
          searchParams.append(`filters[${key}][${operator}]`, String(operatorValue));
        });
      } else {
        searchParams.append(`filters[${key}]`, String(value));
      }
    });
  }

  // 处理 sort 参数
  if (params.sort) {
    if (Array.isArray(params.sort)) {
      params.sort.forEach(field => searchParams.append('sort', field));
    } else {
      searchParams.append('sort', params.sort);
    }
  }

  // 处理 pagination 参数
  if (params.pagination) {
    Object.entries(params.pagination).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(`pagination[${key}]`, String(value));
      }
    });
  }

  // 处理 locale 参数
  if (params.locale) {
    searchParams.append('locale', params.locale);
  }

  return searchParams.toString();
}

// 基础请求函数
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ErrorResponse;
      throw new StrapiAPIError(
        errorData.error?.message || 'API request failed',
        response.status,
        errorData.error?.details
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof StrapiAPIError) {
      throw error;
    }
    
    // 网络错误或其他错误
    throw new StrapiAPIError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// API 客户端类
export class StrapiAPI {
  // 获取单个条目
  static async findOne<T>(
    contentType: string,
    id: string | number,
    params?: QueryParams
  ): Promise<APIResponse<T>> {
    const queryString = params ? `?${buildQueryString(params)}` : '';
    return request<APIResponse<T>>(`/${contentType}/${id}${queryString}`);
  }

  // 获取多个条目
  static async findMany<T>(
    contentType: string,
    params?: QueryParams
  ): Promise<PaginatedResponse<T>> {
    const queryString = params ? `?${buildQueryString(params)}` : '';
    return request<PaginatedResponse<T>>(`/${contentType}${queryString}`);
  }

  // 创建条目
  static async create<T>(
    contentType: string,
    data: Partial<T>
  ): Promise<APIResponse<T>> {
    return request<APIResponse<T>>(`/${contentType}`, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

  // 更新条目
  static async update<T>(
    contentType: string,
    id: string | number,
    data: Partial<T>
  ): Promise<APIResponse<T>> {
    return request<APIResponse<T>>(`/${contentType}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  }

  // 删除条目
  static async delete<T>(
    contentType: string,
    id: string | number
  ): Promise<APIResponse<T>> {
    return request<APIResponse<T>>(`/${contentType}/${id}`, {
      method: 'DELETE',
    });
  }

  // 上传文件
  static async upload(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('files', file);

    return request('/upload', {
      method: 'POST',
      headers: {}, // 不设置 Content-Type，让浏览器自动设置 multipart/form-data
      body: formData,
    });
  }
}

// 导出常用的 API 函数
export const api = StrapiAPI;
export { StrapiAPIError };

// 预定义的查询参数
export const commonPopulates = {
  // 博客文章的常用 populate
  blogPost: ['featuredImage', 'tags', 'category', 'seo.metaImage'],
  
  // 项目的常用 populate
  project: ['featuredImage', 'gallery', 'technologies', 'seo.metaImage'],
  
  // 摄影作品的常用 populate
  photo: ['image', 'tags'],
  
  // 专辑的常用 populate
  album: ['cover'],
  
  // 电影的常用 populate
  movie: ['poster'],
  
  // 媒体的常用 populate
  media: ['file'],
  
  // 站点配置的常用 populate
  siteConfig: ['logo', 'favicon', 'socialLinks', 'navigation', 'seo.metaImage'],
} as const;