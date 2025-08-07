import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 环境配置
const getApiConfig = () => {
  const isDev = process.env.NODE_ENV === 'development';
  
  return {
    baseURL: isDev 
      ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api'
      : '/api', // 生产环境使用相对路径
    timeout: 10000, // 10秒超时
    
    // 开发环境允许详细错误信息
    includeErrorDetails: isDev,
  };
};

// API 客户端类
class APIClient {
  private client: AxiosInstance;

  constructor() {
    const config = getApiConfig();
    
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      withCredentials: false, // 个人网站无需认证
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        // 添加语言头（i18n 支持）
        const language = typeof window !== 'undefined' 
          ? localStorage.getItem('language-storage')
          : null;
        
        if (language) {
          try {
            const parsedLanguage = JSON.parse(language);
            config.headers['Accept-Language'] = parsedLanguage.state?.language || 'en';
          } catch {
            config.headers['Accept-Language'] = 'en';
          }
        }

        // 请求日志（开发环境）
        if (process.env.NODE_ENV === 'development') {
          console.log('[API Request]', {
            method: config.method?.toUpperCase(),
            url: config.url,
            params: config.params,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // 响应日志（开发环境）
        if (process.env.NODE_ENV === 'development') {
          console.log('[API Response]', {
            status: response.status,
            url: response.config.url,
            data: response.data,
          });
        }

        // 数据提取（解包 Strapi 响应格式）
        return response;
      },
      (error) => {
        console.error('[API Response Error]', error);
        
        // 错误转换（统一错误格式）
        const apiError = this.transformError(error);
        return Promise.reject(apiError);
      }
    );
  }

  private transformError(error: any): APIError {
    if (error?.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;
      return new APIError(
        data?.error?.message || data?.message || 'API Error',
        status,
        data?.error?.name || 'API_ERROR',
        data?.error?.details || data
      );
    } else if (error?.request) {
      // 请求发送但无响应
      return new APIError(
        'Network Error',
        0,
        'NETWORK_ERROR',
        error.request
      );
    } else {
      // 其他错误
      return new APIError(
        error?.message || 'Unknown Error',
        0,
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  // 基础请求方法
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // 获取完整的 Axios 实例（用于特殊需求）
  getClient(): AxiosInstance {
    return this.client;
  }
}

// API 错误类
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// 导出单例实例
export const apiClient = new APIClient();

// 导出类型
export type { AxiosRequestConfig, AxiosResponse };