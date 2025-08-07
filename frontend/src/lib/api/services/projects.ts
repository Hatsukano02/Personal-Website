// Projects API 服务
// 处理技术项目相关的API请求

import { apiClient } from '../client';
import type {
  Project,
  StrapiResponse,
  StrapiCollectionResponse,
  QueryParams,
} from '../../../types/api';

// Projects 服务类
class ProjectsService {
  private readonly endpoint = '/projects';

  /**
   * 获取所有项目
   * @param params 查询参数
   */
  async getAll(params?: QueryParams): Promise<StrapiCollectionResponse<Project>> {
    const queryParams = this.buildQueryParams(params);
    return apiClient.get<StrapiCollectionResponse<Project>>(
      `${this.endpoint}${queryParams}`
    );
  }

  /**
   * 获取单个项目
   * @param id 项目ID
   * @param params 查询参数
   */
  async getById(id: number | string, params?: QueryParams): Promise<StrapiResponse<Project>> {
    const queryParams = this.buildQueryParams(params);
    return apiClient.get<StrapiResponse<Project>>(
      `${this.endpoint}/${id}${queryParams}`
    );
  }

  /**
   * 通过slug获取项目
   * @param slug 项目的URL标识
   * @param params 查询参数
   */
  async getBySlug(slug: string, params?: QueryParams): Promise<StrapiCollectionResponse<Project>> {
    const queryParams = this.buildQueryParams({
      ...params,
      filters: {
        ...params?.filters,
        slug: {
          $eq: slug,
        },
      },
    });
    return apiClient.get<StrapiCollectionResponse<Project>>(
      `${this.endpoint}${queryParams}`
    );
  }

  /**
   * 获取精选项目
   */
  async getFeatured(params?: QueryParams): Promise<StrapiCollectionResponse<Project>> {
    return this.getAll({
      ...params,
      filters: {
        ...params?.filters,
        is_featured: true,
      },
      sort: ['display_order:asc'],
      populate: ['featured_image'], // 包含特色图片
    });
  }

  /**
   * 按项目状态获取项目
   * @param status 项目状态
   */
  async getByStatus(
    status: 'In_Progress' | 'Completed' | 'Paused',
    params?: QueryParams
  ): Promise<StrapiCollectionResponse<Project>> {
    return this.getAll({
      ...params,
      filters: {
        ...params?.filters,
        project_status: {
          $eq: status,
        },
      },
      sort: ['display_order:asc'],
    });
  }

  /**
   * 获取已完成的项目
   */
  async getCompleted(params?: QueryParams): Promise<StrapiCollectionResponse<Project>> {
    return this.getByStatus('Completed', params);
  }

  /**
   * 获取进行中的项目
   */
  async getInProgress(params?: QueryParams): Promise<StrapiCollectionResponse<Project>> {
    return this.getByStatus('In_Progress', params);
  }

  /**
   * 搜索项目
   * @param query 搜索关键词
   */
  async search(query: string, params?: QueryParams): Promise<StrapiCollectionResponse<Project>> {
    return this.getAll({
      ...params,
      filters: {
        ...params?.filters,
        $or: [
          {
            title: {
              $containsi: query, // 标题包含关键词（不区分大小写）
            },
          },
          {
            description: {
              $containsi: query, // 描述包含关键词
            },
          },
          {
            tech_stack: {
              $containsi: query, // 技术栈包含关键词
            },
          },
        ],
      },
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
export const projectsService = new ProjectsService();

// 导出类型（用于其他模块）
export type { Project };