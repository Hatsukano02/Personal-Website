# Phase 2.1 - Strapi 内容类型配置文档

## 配置概览

**Strapi 版本**: 5.20.0  
**数据库**: PostgreSQL 15.12  
**管理界面**: http://localhost:8080/admin (SSH 隧道)  
**开发模式**: 使用 `npm run develop`

## 内容类型创建进度

### 已完成 (8/8)

#### 1. Social Link - 社交链接

- **状态**: 已创建并测试
- **数据条数**: 3 条 (GitHub, Gmail, LinkedIn)
- **API 端点**: `/api/social-links`

**字段结构 (已创建)**:

```yaml
Collection Type: social-link
Display Name: Social Link

Fields:
  platform:
    type: Text (Short text)
    required: true
    unique: true
    description: 社交平台名称

  display_name:
    type: Text (Short text)
    required: true
    description: 显示的名称

  url:
    type: Text (Short text)
    required: true
    validation: URL格式
    description: 社交媒体链接地址

  platform_icon:
    type: Text (Short text)
    required: true
    description: 图标标识符 (如 fa-github)

  is_active:
    type: Boolean
    default: true
    description: 是否启用显示

  display_order:
    type: Number (Integer)
    required: true
    default: 0
    description: 显示顺序
```

**测试数据**:

```yaml
1. GitHub:
  platform: "GitHub"
  display_name: "Hatsukano02"
  url: "https://github.com/Hatsukano02"
  platform_icon: "fa-github"
  is_active: true
  display_order: 1

2. Gmail:
  platform: "Gmail"
  display_name: "Contact Me"
  url: "mailto:manunkindlee@gmail.com"
  platform_icon: "fa-envelope"
  is_active: true
  display_order: 3

3. LinkedIn:
  platform: "LinkedIn"
  display_name: "Li Xiang"
  url: "https://www.linkedin.com/in/xiang-li-fa8027..."
  platform_icon: "fa-linkedin"
  is_active: true
  display_order: 2
```

#### 2. Tag - 标签系统

- **状态**: 已创建
- **API 端点**: `/api/tags`

**字段结构 (已创建)**:

```yaml
Collection Type: tag
Display Name: Tag

Fields:
  name:
    type: Text (Short text)
    required: true
    unique: true
    description: 标签名称

  slug:
    type: UID
    target_field: name
    required: true
    description: URL标识

  color:
    type: Text (Short text)
    required: false
    description: 标签颜色 (hex code)

  description:
    type: Text (Long text)
    required: false
    description: 标签描述
```

#### 3. Blog Post - 博客文章

- **状态**: 已创建 (包含 Tag 关系)
- **API 端点**: `/api/blog-posts`

**字段结构 (已创建)**:

```yaml
Collection Type: blog-post
Display Name: Blog Post

Fields:
  title:
    type: Text (Short text)
    required: true
    description: 文章标题

  slug:
    type: UID
    target_field: title
    required: true
    description: URL友好标识

  content:
    type: Rich Text (Markdown)
    required: true
    description: 文章内容

  excerpt:
    type: Text (Long text)
    required: false
    description: 文章摘要

  featured_image:
    type: Media (Single media)
    allowed_types: ["images"]
    required: false
    description: 特色图片

  featured_video:
    type: Media (Single media)
    allowed_types: ["videos"]
    required: false
    description: 演示视频

  featured_audio:
    type: Media (Single media)
    allowed_types: ["audios"]
    required: false
    description: 背景音频

  reading_time:
    type: Number (Integer)
    required: false
    description: 预估阅读时间(分钟)

  is_published:
    type: Boolean
    default: false
    description: 发布状态

  publish_date:
    type: Date & Time
    required: false
    description: 发布时间

  view_count:
    type: Number (Integer)
    default: 0
    description: 浏览量

  tags:
    type: Relation
    target: tag
    relation: Many to Many
    description: 文章标签
```

#### 4. Photo - 摄影作品管理

- **状态**: 已创建并配置关系
- **API 端点**: `/api/photos`

**字段结构 (已创建)**:

```yaml
Collection Type: photo
Display Name: Photo

Fields:
  title:
    type: Text (Short text)
    required: true
    description: 照片标题

  slug:
    type: UID
    target_field: title
    required: true
    description: URL标识

  description:
    type: Text (Long text)
    required: false
    description: 照片描述

  image:
    type: Media (Single media)
    allowed_types: ["images"]
    required: true
    description: 照片文件 (仅限图片格式)

  category:
    type: Enumeration
    values:
      ["Portrait", "Landscape", "Street", "Architecture", "Nature", "Other"]
    required: true
    description: 照片分类

  camera_model:
    type: Text (Short text)
    required: false
    description: 相机型号

  lens_model:
    type: Text (Short text)
    required: false
    description: 镜头型号

  aperture:
    type: Text (Short text)
    required: false
    description: 光圈值 (如 f/2.8)

  shutter_speed:
    type: Text (Short text)
    required: false
    description: 快门速度 (如 1/200s)

  iso:
    type: Number (Integer)
    required: false
    description: ISO值

  focal_length:
    type: Text (Short text)
    required: false
    description: 焦距 (如 85mm)

  location:
    type: Text (Short text)
    required: false
    description: 拍摄地点

  taken_at:
    type: Date & Time
    required: false
    description: 拍摄时间

  is_hdr:
    type: Boolean
    default: false
    description: 是否HDR

  color_space:
    type: Enumeration
    values: ["sRGB", "Adobe_RGB", "ProPhoto_RGB", "DCI_P3"]
    default: "sRGB"
    description: 色彩空间

  is_featured:
    type: Boolean
    default: false
    description: 是否精选

  display_order:
    type: Number (Integer)
    required: true
    default: 0
    description: 显示顺序

  covered_albums:
    type: Relation
    target: photo-album
    relation: Many to Many
    description: 所属相册 (自动生成)

  albums:
    type: Relation
    target: photo-album
    relation: Many to Many
    description: 相册关系 (自动生成)
```

#### 5. Photo Album - 相册管理

- **状态**: 已创建并配置关系
- **API 端点**: `/api/photo-albums`

**字段结构 (已创建)**:

```yaml
Collection Type: photo-album
Display Name: Photo Album

Fields:
  album_name:
    type: Text (Short text)
    required: true
    description: 相册名称

  slug:
    type: UID
    target_field: album_name
    required: true
    description: URL标识

  description:
    type: Text (Long text)
    required: false
    description: 相册描述

  cover_photo:
    type: Relation
    target: photo
    relation: Many to One
    required: false
    description: 封面照片 (一个相册一张封面)

  album_type:
    type: Enumeration
    values: ["Travel", "Portrait", "Street", "Commercial", "Personal", "Other"]
    required: false
    description: 相册类型

  location:
    type: Text (Short text)
    required: false
    description: 拍摄地点

  shoot_date:
    type: Date
    required: false
    description: 拍摄日期

  is_featured:
    type: Boolean
    default: false
    description: 是否精选相册

  is_private:
    type: Boolean
    default: false
    description: 是否私密相册

  display_order:
    type: Number (Integer)
    required: true
    default: 0
    description: 显示顺序

  photos:
    type: Relation
    target: photo
    relation: Many to Many
    field_name: albums
    description: 相册中的照片
```

** 关系验证通过**：

- Photo Album 中有 `photos` 字段 (Many to Many)
- Photo Album 中有 `cover_photo` 字段 (Many to One)
- Photo 中自动生成 `photo_albums` 字段 (Many to Many)
- Photo 中自动生成 `albums` 字段 (Many to Many)

#### 6. Project - 技术项目展示

- **状态**: 已创建
- **API 端点**: `/api/projects`

**字段结构 (已创建)**:

```yaml
Collection Type: project
Display Name: Project

Fields:
  title:
    type: Text (Short text)
    required: true
    description: 项目名称

  slug:
    type: UID
    target_field: title
    required: true
    description: URL标识

  description:
    type: Text (Long text)
    required: true
    description: 项目描述

  content:
    type: Rich Text (Blocks)
    required: false
    description: 详细介绍

  featured_image:
    type: Media (Single media)
    allowed_types: ["images"]
    required: false
    description: 项目截图

  featured_video:
    type: Media (Single media)
    allowed_types: ["videos"]
    required: false
    description: 演示视频

  featured_audio:
    type: Media (Single media)
    allowed_types: ["audios"]
    required: false
    description: 介绍音频

  tech_stack:
    type: JSON
    required: false
    description: 技术栈数组

  project_url:
    type: Text (Short text)
    validation: URL
    required: false
    description: 项目链接

  github_url:
    type: Text (Short text)
    validation: URL
    required: false
    description: GitHub链接

  project_status:
    type: Enumeration
    values: ["In_Progress", "Completed", "Paused"]
    default: "In_Progress"
    description: 项目状态

  display_order:
    type: Number (Integer)
    required: true
    default: 0
    description: 显示顺序

  is_featured:
    type: Boolean
    default: false
    description: 是否精选
```

#### 7. Album - 音乐专辑收藏

- **状态**: 已创建
- **API 端点**: `/api/albums`

**字段结构 (已创建)**:

```yaml
Collection Type: album
Display Name: Album

Fields:
  title:
    type: Text (Short text)
    required: true
    description: 专辑名称

  artist:
    type: Text (Short text)
    required: true
    description: 艺术家

  cover_image:
    type: Media (Single media)
    allowed_types: ["images"]
    required: false
    description: 专辑封面

  cover_video:
    type: Media (Single media)
    allowed_types: ["videos"]
    required: false
    description: 音乐视频

  release_year:
    type: Number (Integer)
    required: false
    description: 发行年份

  genre:
    type: Text (Short text)
    required: false
    description: 音乐类型

  personal_rating:
    type: Number (Decimal)
    min: 0
    max: 10
    required: false
    description: 个人评分 (0-10)

  review:
    type: Rich Text (Blocks)
    required: false
    description: 个人评价

  spotify_url:
    type: Text (Short text)
    validation: URL
    required: false
    description: Spotify链接

  apple_music_url:
    type: Text (Short text)
    validation: URL
    required: false
    description: Apple Music链接

  favorite_track:
    type: Text (Short text)
    required: false
    description: 最喜欢的单曲

  listen_date:
    type: Date
    required: false
    description: 听歌日期

  is_favorite:
    type: Boolean
    default: false
    description: 是否收藏

  display_order:
    type: Number (Integer)
    required: true
    default: 0
    description: 显示顺序
```

---

## 📝 待创建内容类型详细配置

### 7. Album - 音乐专辑收藏

#### 字段结构

```yaml
Collection Type: album
Display Name: Album

Fields:
  title:
    type: Text (Short text)
    required: true
    description: 专辑名称

  artist:
    type: Text (Short text)
    required: true
    description: 艺术家

  cover_image:
    type: Media (Single media)
    allowed_types: ["images"]
    required: false
    description: 专辑封面

  cover_video:
    type: Media (Single media)
    allowed_types: ["videos"]
    required: false
    description: 音乐视频

  preview_audio:
    type: Media (Single media)
    allowed_types: ["audios"]
    required: false
    description: 试听片段

  release_year:
    type: Number (Integer)
    required: false
    description: 发行年份

  genre:
    type: Text (Short text)
    required: false
    description: 音乐类型

  personal_rating:
    type: Number (Decimal)
    min: 0
    max: 10
    required: false
    description: 个人评分 (0-10)

  review:
    type: Rich Text (Markdown)
    required: false
    description: 个人评价

  spotify_url:
    type: Text (Short text)
    validation: URL
    required: false
    description: Spotify链接

  apple_music_url:
    type: Text (Short text)
    validation: URL
    required: false
    description: Apple Music链接

  favorite_track:
    type: Text (Short text)
    required: false
    description: 最喜欢的单曲

  listen_date:
    type: Date
    required: false
    description: 听歌日期

  is_favorite:
    type: Boolean
    default: false
    description: 是否收藏

  display_order:
    type: Number (Integer)
    required: true
    default: 0
    description: 显示顺序
```

---

### 8. Media Work - 影视动画作品记录

#### 字段结构

```yaml
Collection Type: media-work
Display Name: Media Work

Fields:
  title:
    type: Text (Short text)
    required: true
    description: 中文标题

  original_title:
    type: Text (Short text)
    required: false
    description: 原版标题

  poster_image:
    type: Media (Single media)
    allowed_types: ["images"]
    required: false
    description: 海报封面

  trailer_video:
    type: Media (Single media)
    allowed_types: ["videos"]
    required: false
    description: 预告片

  soundtrack_audio:
    type: Media (Single media)
    allowed_types: ["audios"]
    required: false
    description: 原声音乐

  type:
    type: Enumeration
    values: ["Movie", "Series", "Documentary", "Animation"]
    required: true
    description: 内容类型 (电影/剧集/纪录片/动画)

  release_year:
    type: Number (Integer)
    required: false
    description: 发行年份

  director:
    type: Text (Short text)
    required: false
    description: 导演/监督

  genre:
    type: JSON
    required: false
    description: 类型标签数组

  personal_rating:
    type: Number (Decimal)
    min: 0
    max: 10
    required: false
    description: 个人评分 (0-10)

  review:
    type: Rich Text (Blocks)
    required: false
    description: 个人评价

  watch_date:
    type: Date
    required: false
    description: 观看日期

  watch_platform:
    type: Text (Short text)
    required: false
    description: 观看平台

  trailer_url:
    type: Text (Short text)
    validation: URL
    required: false
    description: 预告片链接

  imdb_url:
    type: Text (Short text)
    validation: URL
    required: false
    description: IMDB链接

  douban_url:
    type: Text (Short text)
    validation: URL
    required: false
    description: 豆瓣链接

  bangumi_url:
    type: Text (Short text)
    validation: URL
    required: false
    description: Bangumi链接 (动画专用)

  is_favorite:
    type: Boolean
    default: false
    description: 是否收藏

  watch_status:
    type: Enumeration
    values: ["Watched", "Watching", "Plan_to_Watch"]
    default: "Plan_to_Watch"
    description: 观看状态

  display_order:
    type: Number (Integer)
    required: true
    default: 0
    description: 显示顺序
```

---

## 🚀 创建执行计划

### 创建顺序完成

```
1.  Social Link (已完成)
2.  Tag (已完成)
3.  Blog Post (已完成，包含Tag关系)
4.  Photo (已完成，关系配置正确)
5.  Photo Album (已完成，关系配置正确)
6.  Project (已完成，技术展示)
7.  Album (已完成，音乐收藏)
8.  Media Work (已完成，影视动画作品)
```

### 🎉 Phase 2.1 成就解锁

- **8 个内容类型全部完成**
- **关系字段配置无误**
- **API 端点全部可用**
- **为前端开发做好准备**

### 每个类型的测试数据

创建完每个内容类型后，建议添加 2-3 条测试数据来验证字段配置。

### 📊 摄影功能架构优势

**Photo Album + Photo 双层架构**：

- **专业级组织**: 模拟真实摄影师作品管理方式
- **灵活展示**: 相册列表 → 相册详情 → 单张照片的层次化浏览
- **多对多关系**: 一张照片可属于多个相册（如同一张风景照可以在"旅行"和"精选"相册中）
- **独立元数据**: 相册级别的描述、拍摄信息、封面设置等
- **SEO 友好**: 相册和照片都有独立的 URL 和元数据

## 🔧 操作注意事项

### Strapi 5.x 特殊配置

1. **UID 字段**: 需要指定 target_field
2. **关系字段**: 在 Relations 标签页配置
3. **媒体字段**: 可以限制文件类型
4. **枚举字段**: 在 Advanced Settings 中添加选项

### 字段类型对应

- **Text (Short text)**: 短文本，适合标题、链接
- **Text (Long text)**: 长文本，适合描述
- **Rich Text (Markdown)**: 富文本，适合文章内容
- **Media**: 文件上传，分离字段方案（images, videos, audios）
- **Number**: 数字，可设置范围
- **Boolean**: 布尔值，可设置默认值
- **Date & Time**: 日期时间
- **JSON**: 存储复杂数据结构
- **Enumeration**: 枚举选择
- **UID**: 唯一标识符

### ⚠️ 系统保留字段（不能使用）

- `id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `published_at`, `status`
- **替代方案**:
  - 使用 `publish_date` 替代 `published_at`
  - 使用 `project_status` 替代 `status`
- **枚举值规范**: 使用英文值，避免空格和特殊字符，前端映射显示本地化文本

### 📁 媒体字段配置说明

**分离字段方案** - 语义清晰，管理便捷：

- **图片字段** (`featured_image`, `cover_image`, `poster_image`): 仅限图片 `['images']`
- **视频字段** (`featured_video`, `trailer_video`): 仅限视频 `['videos']`
- **音频字段** (`featured_audio`, `preview_audio`, `soundtrack_audio`): 仅限音频 `['audios']`
- **专用字段** (`Photo.image`): 摄影作品专用图片字段

### 🌐 枚举字段国际化建议

**数据库存储英文值，前端显示中文**：

```javascript
// 项目状态映射
const projectStatusMap = {
  In_Progress: "进行中",
  Completed: "已完成",
  Paused: "暂停",
};

// 照片分类映射
const photoCategoryMap = {
  Portrait: "人像",
  Landscape: "风景",
  Street: "街拍",
  Architecture: "建筑",
  Nature: "自然",
  Other: "其他",
};

// 相册类型映射
const albumTypeMap = {
  Travel: "旅行",
  Portrait: "人像",
  Street: "街拍",
  Commercial: "商业",
  Personal: "个人",
  Other: "其他",
};

// 影视类型映射
const mediaWorkTypeMap = {
  Movie: "电影",
  Series: "电视剧",
  Documentary: "纪录片",
  Animation: "动画",
};

// 观看状态映射
const watchStatusMap = {
  Watched: "已观看",
  Watching: "观看中",
  "Plan to Watch": "计划观看",
};

// 色彩空间映射
const colorSpaceMap = {
  sRGB: "sRGB",
  Adobe_RGB: "Adobe RGB",
  ProPhoto_RGB: "ProPhoto RGB",
  DCI_P3: "DCI-P3",
};
```

## 📊 进度跟踪

### Phase 2.1 完成检查清单 - 全部完成！

- [x] Social Link - 内容类型创建
- [x] Social Link - 测试数据添加
- [x] Social Link - API 端点验证
- [x] Tag - 内容类型创建
- [x] Tag - API 端点验证
- [x] Blog Post - 内容类型创建
- [x] Blog Post - Tag 关系配置
- [x] Blog Post - API 端点验证
- [x] Photo - 内容类型创建
- [x] Photo - 字段配置完成
- [x] Photo - 关系字段验证
- [x] Photo Album - 内容类型创建
- [x] Photo Album - Photo 关系配置
- [x] Photo Album - API 端点验证
- [x] Photo Album - 关系验证通过
- [x] Project - 内容类型创建
- [x] Project - 字段配置完成
- [x] Project - API 端点验证
- [x] Album - 内容类型创建
- [x] Album - 字段配置完成
- [x] Album - API 端点验证
- [x] Media Work - 内容类型创建
- [x] Media Work - 字段配置完成
- [x] Media Work - API 端点验证
- [x] **Phase 2.1 - Strapi 内容类型配置 - 完成 🎉**

### 🚀 下一阶段行动计划

1. **Phase 2.2**: API 权限配置和测试数据添加
2. **Phase 2.3**: 文件上传功能测试和优化
3. **Phase 3**: 前端核心功能开发启动
4. **集成开发**: 前后端联调和数据对接
5. **项目里程碑**: Strapi 后端配置完成 ，进入前端开发阶段

### 准备交接给 Claude Code

- 完整的内容类型架构文档
- 8 个 API 端点全部可用
- 关系字段配置验证完成
- 枚举值和字段类型确认
- 为前端开发提供完整的数据结构

---

## 🔗 相关文档引用

- 数据库设计方案: `数据库设计方案.md`
- 后端架构方案: `后端架构方案.md`
- 架构执行方案: `execution-roadmap.md`

---

**最后更新**: 2025-01-28 (v3.0 - Phase 2.1 完成版) 🎉  
**更新内容**:

- **里程碑达成**：Media Work 内容类型创建完成，Phase 2.1 正式完成！
- **进度更新**：8/8 个内容类型全部完成 (Social Link, Tag, Blog Post, Photo, Photo Album, Project, Album, Media Work)
- **枚举值修正**：watch_status 使用'Plan to Watch'而非'Plan_to_Watch'
- **架构完整**：所有内容类型、关系字段、API 端点验证完成
- **准备交接**：完整文档已准备好交接给 Claude Code 进行项目管理
- 🚀 **下一阶段**：Phase 2.2 - API 权限和测试数据配置
- 🚀 **前端开发**：Phase 3 - 前端核心功能开发准备就绪
  **更新人**: Claude (基于用户 Media Work 创建完成确认)
  **重要里程碑**: **Phase 2.1 - Strapi 内容类型配置 - 正式完成！**
