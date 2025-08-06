// 业务数据模型类型定义
// 基于 phase_2_1_config.md 中已实际创建完成的 8 个 Strapi 内容类型

import { StrapiFile } from './strapi';

// 1. 博客文章 (API: /api/blog-posts)
export interface BlogPost {
  title: string;
  slug: string; // UID, target_field: title
  content: string; // Rich Text (Markdown)
  excerpt?: string; // Long text
  featured_image?: StrapiFile; // Single media, images only
  featured_video?: StrapiFile; // Single media, videos only  
  featured_audio?: StrapiFile; // Single media, audios only
  reading_time?: number; // Integer, minutes
  is_published: boolean; // default: false
  publish_date?: string; // Date & Time
  view_count?: number; // Integer, default: 0
  tags?: Tag[]; // Many to Many relation
}

// 2. 技术项目 (API: /api/projects)
export interface Project {
  title: string;
  slug: string; // UID, target_field: title
  description: string; // Long text, required
  content?: string; // Rich Text (Blocks)
  featured_image?: StrapiFile; // Single media, images only
  featured_video?: StrapiFile; // Single media, videos only
  featured_audio?: StrapiFile; // Single media, audios only
  tech_stack?: string[]; // JSON array
  project_url?: string; // URL validation
  github_url?: string; // URL validation
  project_status: 'In_Progress' | 'Completed' | 'Paused'; // default: In_Progress
  display_order: number; // Integer, required, default: 0
  is_featured: boolean; // default: false
}

// 3. 摄影作品 (API: /api/photos)
export interface Photo {
  title: string; // required
  slug: string; // UID, target_field: title
  description?: string; // Long text
  image: StrapiFile; // Single media, images only, required
  category: 'Portrait' | 'Landscape' | 'Street' | 'Architecture' | 'Nature' | 'Other'; // required
  camera_model?: string;
  lens_model?: string;
  aperture?: string; // e.g., f/2.8
  shutter_speed?: string; // e.g., 1/200s
  iso?: number; // Integer
  focal_length?: string; // e.g., 85mm
  location?: string;
  taken_at?: string; // Date & Time
  is_hdr: boolean; // default: false
  color_space: 'sRGB' | 'Adobe_RGB' | 'ProPhoto_RGB' | 'DCI_P3'; // default: sRGB
  is_featured: boolean; // default: false
  display_order: number; // Integer, required, default: 0
  covered_albums?: PhotoAlbum[]; // Many to Many, auto-generated
  albums?: PhotoAlbum[]; // Many to Many, auto-generated
}

// 4. 音乐专辑 (API: /api/albums)
export interface Album {
  title: string; // required
  artist: string; // required
  cover_image?: StrapiFile; // Single media, images only
  cover_video?: StrapiFile; // Single media, videos only
  release_year?: number; // Integer
  genre?: string;
  personal_rating?: number; // Decimal, 0-10 range
  review?: string; // Rich Text (Blocks)
  spotify_url?: string; // URL validation
  apple_music_url?: string; // URL validation
  favorite_track?: string;
  listen_date?: string; // Date
  is_favorite: boolean; // default: false
  display_order: number; // Integer, required, default: 0
}

// 5. 影视作品 (API: /api/media-works)
export interface MediaWork {
  title: string; // 中文标题, required
  original_title?: string; // 原版标题
  poster_image?: StrapiFile; // Single media, images only
  trailer_video?: StrapiFile; // Single media, videos only
  soundtrack_audio?: StrapiFile; // Single media, audios only
  type: 'Movie' | 'Series' | 'Documentary' | 'Animation'; // required
  release_year?: number; // Integer
  director?: string; // 导演/监督
  genre?: string[]; // JSON array, 类型标签
  personal_rating?: number; // Decimal, 0-10 range
  review?: string; // Rich Text (Blocks)
  watch_date?: string; // Date
  watch_platform?: string;
  trailer_url?: string; // URL validation
  imdb_url?: string; // URL validation
  douban_url?: string; // URL validation
  bangumi_url?: string; // URL validation, 动画专用
  is_favorite: boolean; // default: false
  watch_status: 'Watched' | 'Watching' | 'Plan_to_Watch'; // default: Plan_to_Watch
  display_order: number; // Integer, required, default: 0
}

// 6. 摄影作品集 (API: /api/photo-albums)
export interface PhotoAlbum {
  album_name: string; // required
  slug: string; // UID, target_field: album_name
  description?: string; // Long text
  cover_photo?: Photo; // Many to One relation
  album_type?: 'Travel' | 'Portrait' | 'Street' | 'Commercial' | 'Personal' | 'Other';
  location?: string;
  shoot_date?: string; // Date
  is_featured: boolean; // default: false
  is_private: boolean; // default: false
  display_order: number; // Integer, required, default: 0
  photos?: Photo[]; // Many to Many relation
}

// 7. 社交链接 (API: /api/social-links) - 已有测试数据
export interface SocialLink {
  platform: string; // required, unique, 社交平台名称
  display_name: string; // required, 显示的名称
  url: string; // required, URL格式验证
  platform_icon: string; // required, 图标标识符
  is_active: boolean; // default: true
  display_order: number; // Integer, required, default: 0
}

// 8. 标签系统 (API: /api/tags)
export interface Tag {
  name: string; // required, unique
  slug: string; // UID, target_field: name
  color?: string; // hex code
  description?: string; // Long text
}

// 枚举值国际化映射
export const ENUM_MAPS = {
  projectStatus: {
    In_Progress: '进行中',
    Completed: '已完成', 
    Paused: '暂停'
  },
  photoCategory: {
    Portrait: '人像',
    Landscape: '风景',
    Street: '街拍',
    Architecture: '建筑',
    Nature: '自然',
    Other: '其他'
  },
  colorSpace: {
    sRGB: 'sRGB',
    Adobe_RGB: 'Adobe RGB',
    ProPhoto_RGB: 'ProPhoto RGB',
    DCI_P3: 'DCI-P3'
  },
  mediaWorkType: {
    Movie: '电影',
    Series: '电视剧',
    Documentary: '纪录片',
    Animation: '动画'
  },
  watchStatus: {
    Watched: '已观看',
    Watching: '观看中',
    Plan_to_Watch: '计划观看'
  },
  albumType: {
    Travel: '旅行',
    Portrait: '人像',
    Street: '街拍',
    Commercial: '商业',
    Personal: '个人',
    Other: '其他'
  }
} as const;