// Projects API 自定义 Hook

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { projectsService } from '@/lib/api/services/projects';
import { queryKeys } from '@/lib/api/queryKeys';
import { cacheConfig } from '@/lib/api/queryClient';
import type {
  Project,
  StrapiCollectionResponse,
  StrapiResponse,
  QueryParams,
} from '@/types/api';

// Hook 选项接口
interface UseProjectsOptions {
  enabled?: boolean;
  onSuccess?: (data: StrapiCollectionResponse<Project>) => void;
  onError?: (error: Error) => void;
}

interface UseProjectOptions {
  enabled?: boolean;
  onSuccess?: (data: StrapiResponse<Project>) => void;
  onError?: (error: Error) => void;
}

// 获取所有项目
export function useProjects(
  params?: QueryParams,
  options?: UseProjectsOptions
) {
  return useQuery({
    queryKey: queryKeys.projectList(params),
    queryFn: () => projectsService.getAll(params),
    ...cacheConfig.projects,
    enabled: options?.enabled !== false,
  });
}

// 获取精选项目
export function useFeaturedProjects(options?: UseProjectsOptions) {
  return useQuery({
    queryKey: queryKeys.projectsFeatured(),
    queryFn: () => projectsService.getFeatured(),
    ...cacheConfig.projects,
    enabled: options?.enabled !== false,
  });
}

// 获取单个项目
export function useProject(
  id: number | string,
  params?: QueryParams,
  options?: UseProjectOptions
) {
  return useQuery({
    queryKey: queryKeys.projectDetail(id),
    queryFn: () => projectsService.getById(id, params),
    ...cacheConfig.projects,
    enabled: !!id && options?.enabled !== false,
  });
}

// 通过slug获取项目
export function useProjectBySlug(
  slug: string,
  params?: QueryParams,
  options?: UseProjectsOptions
) {
  return useQuery({
    queryKey: queryKeys.projectBySlug(slug),
    queryFn: () => projectsService.getBySlug(slug, params),
    ...cacheConfig.projects,
    enabled: !!slug && options?.enabled !== false,
  });
}

// 获取已完成的项目
export function useCompletedProjects(
  params?: QueryParams,
  options?: UseProjectsOptions
) {
  return useQuery({
    queryKey: ['projects', 'completed', params],
    queryFn: () => projectsService.getCompleted(params),
    ...cacheConfig.projects,
    enabled: options?.enabled !== false,
  });
}

// 获取进行中的项目
export function useInProgressProjects(
  params?: QueryParams,
  options?: UseProjectsOptions
) {
  return useQuery({
    queryKey: ['projects', 'in-progress', params],
    queryFn: () => projectsService.getInProgress(params),
    ...cacheConfig.projects,
    enabled: options?.enabled !== false,
  });
}

// 搜索项目
export function useProjectSearch(
  query: string,
  params?: QueryParams,
  options?: UseProjectsOptions
) {
  return useQuery({
    queryKey: ['projects', 'search', query, params],
    queryFn: () => projectsService.search(query, params),
    ...cacheConfig.projects,
    enabled: !!query && options?.enabled !== false,
  });
}

// 无限滚动加载项目
export function useInfiniteProjects(
  params?: Omit<QueryParams, 'pagination'>,
  options?: UseProjectsOptions
) {
  return useInfiniteQuery({
    queryKey: ['projects', 'infinite', params],
    queryFn: ({ pageParam = 1 }) => 
      projectsService.getAll({
        ...params,
        pagination: {
          page: pageParam,
          pageSize: 10, // 每页10个项目
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pageCount } = lastPage.meta.pagination;
      return page < pageCount ? page + 1 : undefined;
    },
    ...cacheConfig.projects,
    enabled: options?.enabled !== false,
  });
}

// 预加载项目数据（用于性能优化）
export function prefetchFeaturedProjects() {
  return queryKeys.projectsFeatured();
}