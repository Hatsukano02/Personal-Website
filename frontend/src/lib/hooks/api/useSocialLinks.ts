// Social Links API 自定义 Hook

import { useQuery } from '@tanstack/react-query';
import { socialLinksService } from '@/lib/api/services/socialLinks';
import { queryKeys } from '@/lib/api/queryKeys';
import { cacheConfig } from '@/lib/api/queryClient';
import type {
  QueryParams,
} from '@/types/api';

// Hook 选项接口
interface UseSocialLinksOptions {
  enabled?: boolean;
}

interface UseSocialLinkOptions {
  enabled?: boolean;
}

// 获取所有社交链接
export function useSocialLinks(
  params?: QueryParams,
  options?: UseSocialLinksOptions
) {
  return useQuery({
    queryKey: queryKeys.socialLinksList(params),
    queryFn: () => socialLinksService.getAll(params),
    ...cacheConfig.socialLinks,
    enabled: options?.enabled,
  });
}

// 获取激活的社交链接
export function useActiveSocialLinks(options?: UseSocialLinksOptions) {
  return useQuery({
    queryKey: queryKeys.socialLinksActive(),
    queryFn: () => socialLinksService.getActive(),
    ...cacheConfig.socialLinks,
    enabled: options?.enabled,
  });
}

// 获取单个社交链接
export function useSocialLink(
  id: number,
  params?: QueryParams,
  options?: UseSocialLinkOptions
) {
  return useQuery({
    queryKey: queryKeys.socialLinksDetail(id),
    queryFn: () => socialLinksService.getById(id, params),
    ...cacheConfig.socialLinks,
    enabled: !!id && options?.enabled !== false,
  });
}

// 根据平台获取社交链接
export function useSocialLinksByPlatform(
  platform: string,
  options?: UseSocialLinksOptions
) {
  return useQuery({
    queryKey: queryKeys.socialLinksByPlatform(platform),
    queryFn: () => socialLinksService.getByPlatform(platform),
    ...cacheConfig.socialLinks,
    enabled: !!platform && options?.enabled !== false,
  });
}

// 预加载社交链接（用于性能优化）
export function prefetchActiveSocialLinks() {
  return queryKeys.socialLinksActive();
}