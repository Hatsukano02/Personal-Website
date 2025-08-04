export const API_ENDPOINTS = {
  BLOG_POSTS: '/blog-posts',
  PROJECTS: '/projects',
  PHOTOS: '/photos',
  ALBUMS: '/albums',
  MOVIES: '/movies',
  MUSICS: '/musics',
  MEDIA: '/media',
  SOCIAL_LINKS: '/social-links'
} as const

export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

export const NAVIGATION_SECTIONS = [
  'hero',
  'about', 
  'projects',
  'photography',
  'blog',
  'music',
  'movies',
  'media',
  'links',
  'contact'
] as const