'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

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
    queryFn: () => apiClient.get('/blog-posts'),
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
    queryFn: () => apiClient.get('/projects'),
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
    queryFn: () => apiClient.get('/photos'),
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
    queryFn: () => apiClient.get('/albums'),
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
    queryFn: () => apiClient.get('/movies'),
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
    queryFn: () => apiClient.get('/music'),
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
    queryFn: () => apiClient.get('/media'),
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
    queryFn: () => apiClient.get('/social-links'),
    staleTime: options.staleTime || 5 * 60 * 1000,
    gcTime: options.cacheTime || 10 * 60 * 1000,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    enabled: options.enabled ?? true
  })
}