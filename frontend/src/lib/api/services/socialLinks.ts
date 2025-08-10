// Social Links API 服务
// 基于 phase_2_1_config.md 中已有的 3 条测试数据

import { apiClient } from '../client';
import type {
  SocialLink,
  StrapiResponse,
  StrapiCollectionResponse,
  QueryParams,
} from '../../../types/api';

// Social Links 服务类
class SocialLinksService {
  private readonly endpoint = '/social-links';

  /**
   * 获取所有社交链接
   * @param params 查询参数
   */
  async getAll(params?: QueryParams): Promise<StrapiCollectionResponse<SocialLink>> {
    const queryParams = this.buildQueryParams(params);
    return apiClient.get<StrapiCollectionResponse<SocialLink>>(
      `${this.endpoint}${queryParams}`
    );
  }

  /**
   * 获取单个社交链接
   * @param id 链接ID
   * @param params 查询参数
   */
  async getById(id: number, params?: QueryParams): Promise<StrapiResponse<SocialLink>> {
    const queryParams = this.buildQueryParams(params);
    return apiClient.get<StrapiResponse<SocialLink>>(
      `${this.endpoint}/${id}${queryParams}`
    );
  }

  /**
   * 获取激活的社交链接（按显示顺序排序）
   */
  async getActive(): Promise<StrapiCollectionResponse<SocialLink>> {
    return this.getAll({
      filters: {
        is_active: true,
      },
      sort: ['display_order:asc'],
    });
  }

  /**
   * 根据平台名称获取社交链接
   * @param platform 平台名称
   */
  async getByPlatform(platform: string): Promise<StrapiCollectionResponse<SocialLink>> {
    return this.getAll({
      filters: {
        platform: {
          $eqi: platform, // 不区分大小写匹配
        },
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
        // 嵌套对象（如 { platform: { $eqi: 'github' } }）
        this.buildFilterParams(searchParams, value as Record<string, unknown>, `${prefix}[${key}]`);
      } else {
        // 基础值
        searchParams.set(`${prefix}[${key}]`, String(value));
      }
    });
  }
}

// 导出服务实例
export const socialLinksService = new SocialLinksService();

// 导出类型（用于其他模块）
export type { SocialLink };