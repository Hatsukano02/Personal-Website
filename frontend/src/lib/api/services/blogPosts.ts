// Blog Posts API 服务
// 处理博客文章相关的API请求

import { apiClient } from '../client';
import type {
  BlogPost,
  StrapiResponse,
  StrapiCollectionResponse,
  QueryParams,
} from '../../../types/api';

// Blog Posts 服务类
class BlogPostsService {
  private readonly endpoint = '/blog-posts';

  /**
   * 获取所有博客文章
   * @param params 查询参数
   */
  async getAll(params?: QueryParams): Promise<StrapiCollectionResponse<BlogPost>> {
    const queryParams = this.buildQueryParams(params);
    return apiClient.get<StrapiCollectionResponse<BlogPost>>(
      `${this.endpoint}${queryParams}`
    );
  }

  /**
   * 获取单篇文章
   * @param id 文章ID
   * @param params 查询参数
   */
  async getById(id: number | string, params?: QueryParams): Promise<StrapiResponse<BlogPost>> {
    const queryParams = this.buildQueryParams(params);
    return apiClient.get<StrapiResponse<BlogPost>>(
      `${this.endpoint}/${id}${queryParams}`
    );
  }

  /**
   * 通过slug获取文章
   * @param slug 文章的URL标识
   * @param params 查询参数
   */
  async getBySlug(slug: string, params?: QueryParams): Promise<StrapiCollectionResponse<BlogPost>> {
    const queryParams = this.buildQueryParams({
      ...params,
      filters: {
        ...params?.filters,
        slug: {
          $eq: slug,
        },
      },
      populate: ['tags', 'featured_image'], // 包含标签和特色图片
    });
    return apiClient.get<StrapiCollectionResponse<BlogPost>>(
      `${this.endpoint}${queryParams}`
    );
  }

  /**
   * 获取已发布的文章
   */
  async getPublished(params?: QueryParams): Promise<StrapiCollectionResponse<BlogPost>> {
    return this.getAll({
      ...params,
      filters: {
        ...params?.filters,
        is_published: true,
      },
      sort: ['publish_date:desc', 'createdAt:desc'],
      populate: ['tags', 'featured_image'],
    });
  }

  /**
   * 获取最新文章
   * @param limit 文章数量限制
   */
  async getLatest(limit: number = 5, params?: QueryParams): Promise<StrapiCollectionResponse<BlogPost>> {
    return this.getPublished({
      ...params,
      pagination: {
        pageSize: limit,
        page: 1,
      },
    });
  }

  /**
   * 根据标签获取文章
   * @param tagId 标签ID或slug
   */
  async getByTag(tagId: string | number, params?: QueryParams): Promise<StrapiCollectionResponse<BlogPost>> {
    return this.getAll({
      ...params,
      filters: {
        ...params?.filters,
        tags: {
          $or: [
            { id: { $eq: tagId } },
            { slug: { $eq: tagId } },
          ],
        },
        is_published: true,
      },
      sort: ['publish_date:desc'],
      populate: ['tags', 'featured_image'],
    });
  }

  /**
   * 搜索文章
   * @param query 搜索关键词
   */
  async search(query: string, params?: QueryParams): Promise<StrapiCollectionResponse<BlogPost>> {
    return this.getAll({
      ...params,
      filters: {
        ...params?.filters,
        $and: [
          { is_published: true },
          {
            $or: [
              {
                title: {
                  $containsi: query, // 标题包含关键词
                },
              },
              {
                content: {
                  $containsi: query, // 内容包含关键词
                },
              },
              {
                excerpt: {
                  $containsi: query, // 摘要包含关键词
                },
              },
            ],
          },
        ],
      },
      populate: ['tags', 'featured_image'],
    });
  }

  /**
   * 获取相关文章
   * @param postId 当前文章ID
   * @param limit 相关文章数量
   */
  async getRelated(postId: number | string, limit: number = 3): Promise<StrapiCollectionResponse<BlogPost>> {
    // 首先获取当前文章的标签
    const currentPost = await this.getById(postId, { populate: ['tags'] });
    
    if (!currentPost.data.tags || currentPost.data.tags.length === 0) {
      // 如果没有标签，返回最新文章
      return this.getLatest(limit);
    }

    // 获取具有相同标签的文章
    const tagIds = currentPost.data.tags.map(tag => tag.id);
    
    return this.getAll({
      filters: {
        id: {
          $ne: postId, // 排除当前文章
        },
        tags: {
          id: {
            $in: tagIds, // 包含任一相同标签
          },
        },
        is_published: true,
      },
      pagination: {
        pageSize: limit,
        page: 1,
      },
      sort: ['publish_date:desc'],
      populate: ['tags', 'featured_image'],
    });
  }

  /**
   * 构建查询参数字符串
   * @param params 查询参数对象
   */
  private buildQueryParams(params?: QueryParams): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();

    // 分页参数
    if (params.pagination) {
      if (params.pagination.page) {
        searchParams.set('pagination[page]', params.pagination.page.toString());
      }
      if (params.pagination.pageSize) {
        searchParams.set('pagination[pageSize]', params.pagination.pageSize.toString());
      }
      if (params.pagination.start) {
        searchParams.set('pagination[start]', params.pagination.start.toString());
      }
      if (params.pagination.limit) {
        searchParams.set('pagination[limit]', params.pagination.limit.toString());
      }
    }

    // 排序参数
    if (params.sort) {
      const sortArray = Array.isArray(params.sort) ? params.sort : [params.sort];
      sortArray.forEach((sortItem, index) => {
        searchParams.set(`sort[${index}]`, sortItem);
      });
    }

    // 过滤参数
    if (params.filters) {
      this.buildFilterParams(searchParams, params.filters, 'filters');
    }

    // 关联数据参数
    if (params.populate) {
      if (typeof params.populate === 'string') {
        searchParams.set('populate', params.populate);
      } else if (Array.isArray(params.populate)) {
        params.populate.forEach((popItem, index) => {
          searchParams.set(`populate[${index}]`, popItem);
        });
      } else {
        // 对象形式的 populate 参数
        Object.entries(params.populate).forEach(([key, value]) => {
          searchParams.set(`populate[${key}]`, String(value));
        });
      }
    }

    // 字段参数
    if (params.fields) {
      params.fields.forEach((field, index) => {
        searchParams.set(`fields[${index}]`, field);
      });
    }

    // 语言参数
    if (params.locale) {
      searchParams.set('locale', params.locale);
    }

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * 递归构建过滤器参数
   */
  private buildFilterParams(
    searchParams: URLSearchParams,
    filters: Record<string, unknown>,
    prefix: string
  ): void {
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // 嵌套对象
        this.buildFilterParams(searchParams, value as Record<string, unknown>, `${prefix}[${key}]`);
      } else if (Array.isArray(value)) {
        // 数组
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            this.buildFilterParams(searchParams, item as Record<string, unknown>, `${prefix}[${key}][${index}]`);
          } else {
            searchParams.set(`${prefix}[${key}][${index}]`, String(item));
          }
        });
      } else {
        // 基础值
        searchParams.set(`${prefix}[${key}]`, String(value));
      }
    });
  }
}

// 导出服务实例
export const blogPostsService = new BlogPostsService();

// 导出类型（用于其他模块）
export type { BlogPost };