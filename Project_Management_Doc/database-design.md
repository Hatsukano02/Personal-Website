# 数据库设计方案

## 数据库技术选型
- **主数据库**: PostgreSQL 15+
- **缓存数据库**: Redis 7+ (可选)
- **搜索引擎**: PostgreSQL Full-text Search
- **备份策略**: pg_dump + 增量备份
- **连接池**: PgBouncer

## 核心表结构设计

### 基础配置表
```sql
-- 站点配置
site_configs
├── id (PRIMARY KEY)
├── key (唯一键名)
├── value (JSON格式值)
├── type (配置类型)
├── created_at / updated_at

-- 用户管理(Strapi内置)
up_users
├── id, username, email
├── confirmed, blocked
├── role (关联roles表)
├── created_at / updated_at
```

### 内容管理表

#### 博客文章系统
```sql
-- 文章主表
blog_posts
├── id (PRIMARY KEY)
├── title (文章标题)
├── slug (URL友好标识)
├── content (Rich Text内容)
├── excerpt (摘要)
├── featured_image (关联files表)
├── reading_time (预估阅读时间)
├── is_published (发布状态)
├── published_at (发布时间)
├── view_count (浏览量)
├── created_at / updated_at

-- 标签系统
tags
├── id (PRIMARY KEY)
├── name (标签名称)
├── slug (URL标识)
├── color (标签颜色)
├── description (标签描述)
├── created_at / updated_at

-- 文章标签关联(多对多)
blog_posts_tags_links
├── blog_post_id (外键)
├── tag_id (外键)
```

#### 项目展示系统
```sql
-- 项目主表
projects
├── id (PRIMARY KEY)
├── title (项目名称)
├── slug (URL标识)
├── description (项目描述)
├── content (详细介绍)
├── featured_image (关联files表)
├── tech_stack (JSON数组-技术栈)
├── project_url (项目链接)
├── github_url (GitHub链接)
├── status (进行中/已完成/暂停)
├── display_order (显示顺序)
├── is_featured (是否精选)
├── created_at / updated_at

-- 项目截图/媒体
project_media
├── id (PRIMARY KEY)
├── project_id (外键关联projects)
├── file_id (关联files表)
├── media_type (image/video)
├── display_order (显示顺序)
├── caption (媒体说明)
```

#### 摄影作品系统
```sql
-- 摄影作品主表
photos
├── id (PRIMARY KEY)
├── title (照片标题)
├── description (照片描述)
├── image_id (关联files表)
├── category (分类: portrait/landscape/street等)
├── camera_model (相机型号)
├── lens_model (镜头型号)
├── aperture (光圈值)
├── shutter_speed (快门速度)
├── iso (ISO值)
├── focal_length (焦距)
├── location (拍摄地点)
├── taken_at (拍摄时间)
├── is_hdr (是否HDR)
├── color_space (色彩空间)
├── is_featured (是否精选)
├── display_order (显示顺序)
├── created_at / updated_at

-- 摄影作品集
photo_albums
├── id (PRIMARY KEY)
├── name (作品集名称)
├── description (作品集介绍)
├── cover_photo_id (封面照片)
├── display_order (显示顺序)
├── created_at / updated_at

-- 照片作品集关联
photo_albums_photos_links
├── photo_album_id (外键)
├── photo_id (外键)
├── display_order (在作品集中的顺序)
```

#### 音乐专辑系统
```sql
-- 音乐专辑表
music_albums
├── id (PRIMARY KEY)
├── title (专辑名称)
├── artist (艺术家)
├── cover_id (关联files表-专辑封面)
├── release_year (发行年份)
├── genre (音乐类型)
├── personal_rating (个人评分 0-10)
├── review (个人评价 Rich Text)
├── spotify_url (Spotify链接)
├── apple_music_url (Apple Music链接)
├── favorite_track (最喜欢的单曲)
├── listen_date (听歌日期)
├── is_favorite (是否收藏)
├── display_order (显示顺序)
├── created_at / updated_at

-- 专辑单曲列表(可选扩展)
album_tracks
├── id (PRIMARY KEY)
├── album_id (外键关联music_albums)
├── track_number (曲目编号)
├── title (歌曲名称)
├── duration (时长秒数)
├── is_favorite (是否最爱)
```

#### 影视作品系统
```sql
-- 电影电视剧表
movies_shows
├── id (PRIMARY KEY)
├── title (中文标题)
├── original_title (原版标题)
├── poster_id (关联files表-海报)
├── type (类型: Movie/Series/Documentary/Animation)
├── release_year (发行年份)
├── director (导演)
├── genre (JSON数组-类型标签)
├── personal_rating (个人评分 0-10)
├── review (个人评价 Rich Text)
├── watch_date (观看日期)
├── watch_platform (观看平台)
├── trailer_url (预告片链接)
├── imdb_url (IMDB链接)
├── douban_url (豆瓣链接)
├── is_favorite (是否收藏)
├── watch_status (Watched/Watching/Plan to Watch)
├── display_order (显示顺序)
├── created_at / updated_at
```

#### 媒体文件系统
```sql
-- 视频音频作品
media_works
├── id (PRIMARY KEY)
├── title (作品标题)
├── description (作品描述)
├── media_type (video/audio)
├── file_id (关联files表)
├── thumbnail_id (缩略图文件)
├── duration (时长秒数)
├── file_size (文件大小)
├── format (文件格式)
├── category (分类标签)
├── is_featured (是否精选)
├── display_order (显示顺序)
├── created_at / updated_at
```

### 系统支持表

#### 文件管理系统
```sql
-- 文件上传表(Strapi内置优化)
files
├── id (PRIMARY KEY)
├── name (文件名)
├── alternative_text (替代文本)
├── caption (图片说明)
├── width / height (图片尺寸)
├── formats (JSON-多尺寸格式)
├── hash (文件哈希)
├── ext (文件扩展名)
├── mime (MIME类型)
├── size (文件大小KB)
├── url (访问URL)
├── provider (存储提供商)
├── provider_metadata (存储元数据)
├── created_at / updated_at

-- 文件处理记录
file_processing_logs
├── id (PRIMARY KEY)
├── file_id (关联files表)
├── operation (处理操作类型)
├── status (处理状态)
├── result_data (处理结果JSON)
├── error_message (错误信息)
├── processed_at (处理时间)
```

#### 社交链接管理
```sql
-- 社交媒体链接
social_links
├── id (PRIMARY KEY)
├── platform (平台名称)
├── platform_icon (图标标识)
├── url (链接地址)
├── display_name (显示名称)
├── is_active (是否启用)
├── display_order (显示顺序)
├── created_at / updated_at
```

## 索引设计策略

### 主要索引
```sql
-- 性能关键索引
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at DESC) WHERE is_published = true;
CREATE INDEX idx_photos_category ON photos(category);
CREATE INDEX idx_photos_featured ON photos(is_featured, display_order);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_files_mime ON files(mime);

-- 搜索索引
CREATE INDEX idx_blog_posts_search ON blog_posts USING gin(to_tsvector('english', title || ' ' || content));
CREATE INDEX idx_projects_search ON projects USING gin(to_tsvector('english', title || ' ' || description));
```

### 复合索引
```sql
-- 复合查询优化
CREATE INDEX idx_photos_category_order ON photos(category, display_order);
CREATE INDEX idx_albums_rating ON music_albums(personal_rating DESC, listen_date DESC);
CREATE INDEX idx_movies_type_rating ON movies_shows(type, personal_rating DESC);
```

## 数据约束设计

### 字段约束
- 必填字段的NOT NULL约束
- 评分字段的范围约束(0-10)
- 邮箱格式的CHECK约束
- URL格式的验证约束

### 外键约束
- 级联删除策略设计
- 软删除vs硬删除选择
- 引用完整性保证

## 数据迁移策略

### 版本控制
- Schema版本管理
- 数据迁移脚本
- 回滚策略设计
- 环境间数据同步

### 备份恢复
- 定时全量备份
- 增量备份策略
- 测试环境数据恢复
- 灾难恢复预案

## 性能优化设计

### 查询优化
- 慢查询监控
- 查询计划分析
- 分页查询优化
- 缓存策略设计

### 存储优化
- 表分区策略(按时间)
- 历史数据归档
- 大文件存储优化
- 磁盘空间管理

## 安全性设计

### 数据保护
- 敏感数据加密
- 访问权限控制
- 审计日志记录
- 数据脱敏策略

### 连接安全
- SSL连接强制
- 连接池配置
- IP白名单限制
- 防暴力破解机制

## 监控指标

### 性能监控
- 连接数监控
- 查询响应时间
- 磁盘使用率
- 内存使用情况

### 业务监控
- 内容增长趋势
- 访问热点分析
- 用户行为统计
- 系统健康度检查

## 扩展性考虑

### 水平扩展
- 读写分离准备
- 分库分表策略
- 缓存层设计
- 分布式架构准备

### 功能扩展
- 评论系统预留
- 点赞收藏功能
- 统计分析扩展
- 第三方集成接口