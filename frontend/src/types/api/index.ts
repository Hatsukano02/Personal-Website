// API 类型统一导出

// Strapi 核心类型
export type {
  StrapiEntity,
  StrapiResponse,
  StrapiCollectionResponse,
  StrapiFile,
  StrapiQueryParams,
} from './strapi';

// 业务模型类型
export type {
  BlogPost,
  Project,
  Photo,
  Album,
  MediaWork,
  PhotoAlbum,
  SocialLink,
  Tag,
} from './models';

export { ENUM_MAPS } from './models';

// 通用类型
export type {
  APIErrorDetails,
  PaginationParams,
  SortParam,
  FilterParams,
  QueryParams,
  CreateInput,
  UpdateInput,
  APIStatus,
  CacheConfig,
  APIEndpoint,
} from './common';

export { ErrorType, API_ENDPOINTS } from './common';