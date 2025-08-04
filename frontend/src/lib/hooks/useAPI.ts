'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'

export interface APIHookOptions {
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
  refetchOnWindowFocus?: boolean
}

// Blog Posts Hook
export const useBlogPosts = (options: APIHookOptions = {}) => {
  return useQuery({
    queryKey: ['blogPosts'],
    queryFn: api.getBlogPosts,
    staleTime: options.staleTime || 5 * 60 * 1000, // 5 minutes
    gcTime: options.cacheTime || 10 * 60 * 1000, // 10 minutes (updated from cacheTime)
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    enabled: options.enabled ?? true
  })
}

// Projects Hook
export const useProjects = (options: APIHookOptions = {}) => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
    staleTime: options.staleTime || 5 * 60 * 1000,
    gcTime: options.cacheTime || 10 * 60 * 1000,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    enabled: options.enabled ?? true
  })
}

// Photos Hook
export const usePhotos = (options: APIHookOptions = {}) => {
  return useQuery({
    queryKey: ['photos'],
    queryFn: api.getPhotos,
    staleTime: options.staleTime || 5 * 60 * 1000,
    gcTime: options.cacheTime || 10 * 60 * 1000,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    enabled: options.enabled ?? true
  })
}

// Albums Hook
export const useAlbums = (options: APIHookOptions = {}) => {
  return useQuery({
    queryKey: ['albums'],
    queryFn: api.getAlbums,
    staleTime: options.staleTime || 5 * 60 * 1000,
    gcTime: options.cacheTime || 10 * 60 * 1000,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    enabled: options.enabled ?? true
  })
}

// Movies Hook
export const useMovies = (options: APIHookOptions = {}) => {
  return useQuery({
    queryKey: ['movies'],
    queryFn: api.getMovies,
    staleTime: options.staleTime || 5 * 60 * 1000,
    gcTime: options.cacheTime || 10 * 60 * 1000,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    enabled: options.enabled ?? true
  })
}

// Music Hook
export const useMusic = (options: APIHookOptions = {}) => {
  return useQuery({
    queryKey: ['music'],
    queryFn: api.getMusic,
    staleTime: options.staleTime || 5 * 60 * 1000,
    gcTime: options.cacheTime || 10 * 60 * 1000,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    enabled: options.enabled ?? true
  })
}

// Media Hook
export const useMedia = (options: APIHookOptions = {}) => {
  return useQuery({
    queryKey: ['media'],
    queryFn: api.getMedia,
    staleTime: options.staleTime || 5 * 60 * 1000,
    gcTime: options.cacheTime || 10 * 60 * 1000,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    enabled: options.enabled ?? true
  })
}

// Social Links Hook
export const useSocialLinks = (options: APIHookOptions = {}) => {
  return useQuery({
    queryKey: ['socialLinks'],
    queryFn: api.getSocialLinks,
    staleTime: options.staleTime || 5 * 60 * 1000,
    gcTime: options.cacheTime || 10 * 60 * 1000,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    enabled: options.enabled ?? true
  })
}