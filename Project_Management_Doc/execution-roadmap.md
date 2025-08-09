# 架构执行方案

## 项目全局概览

### 目标定位
- 创建高性能个人品牌网站
- 展示技术能力、设计审美、摄影作品
- 支持博客写作和作品管理
- 完全数据自主控制

### 技术选型确认
- **前端**: Next.js 15.4.3 + TypeScript 5 + Tailwind CSS 4
- **后端**: Strapi 5.20.0 自托管 + Node.js 22.17.1 (已部署)
- **数据库**: PostgreSQL 15.12 + Redis 8.0.3 (PostgreSQL已部署)
- **动画**: GSAP 3.13.0 + Framer Motion 12.23.7
- **部署**: 搬瓦工VPS (172.96.193.211) + Nginx 1.20.1+ + PM2 6.0.8 (已配置)
- **域名**: hatsukano.com (Cloudflare DNS管理) (已配置)

## 开发阶段规划

### Phase 1: 基础架构搭建 (Phase 1.1 & 1.2已完成)
**核心目标**: 建立开发环境和基础框架

#### 1.1 环境准备
- [x] VPS服务器购买和基础配置
  - 搬瓦工VPS KIVM2-40G 已配置完成
  - IP: 172.96.193.211, OS: Rocky Linux 9
- [x] 域名注册和DNS解析设置
  - hatsukano.com 域名已注册(Cloudflare)
  - DNS解析服务已配置
- [x] SSL证书申请和配置
  - Cloudflare SSL/TLS 自动管理已启用
- [x] 服务器安全配置(防火墙、SSH密钥)
  - SSH密钥认证已配置
  - 防火墙规则已设置

#### 1.2 后端基础设施
- [x] PostgreSQL数据库安装和配置
  - PostgreSQL 15.12 已安装并运行
  - 数据库 personal_site 已创建，用户 deploy 已配置
  - 端口 5432 正常监听
- [x] Strapi CMS部署和初始配置
  - Strapi 5.20.0 已安装并正常运行
  - 管理员账户已创建 (manunkindlee@gmail.com)
  - 数据库连接正常，API端点响应正常
  - 管理界面完全可访问 (开发模式)
  - 环境问题已解决: PM2错误进程清理完成
- [x] Nginx反向代理配置
  - Nginx 已安装并运行
  - 配置文件存在 (/etc/nginx/sites-available/personal-site)
  - 端口 80 正常监听
- [x] PM2进程管理配置
  - PM2 6.0.8 已安装
  - ecosystem.config.js 生产配置已优化
  - 内存限制: Strapi 400M, Next.js 300M
  - Strapi进程已启动并稳定运行
- [x] 文件上传和存储目录设置
  - 防火墙已配置端口 1337(Strapi), 3000(Next.js)
  - 项目目录结构已建立

#### 1.3 前端项目初始化
- [ ] Next.js项目创建和配置
- [ ] TypeScript配置优化
- [ ] Tailwind CSS配置和主题设置
- [ ] 项目目录结构建立
- [ ] 基础组件库搭建

#### 1.4 开发工具配置
- [ ] Cursor AI项目配置
- [ ] ESLint和Prettier设置
- [ ] Git仓库初始化
- [ ] 开发环境变量配置

### Phase 2: 内容管理系统搭建 (100%完成 - 2025-08-08 最终验证)
**核心目标**: 完成CMS配置和数据模型设计

**🎉 重大里程碑**: Strapi 5.x后端环境完全修复并100%可用，前端开发所有条件满足。

**🔥 关键成就**: 
- **问题完全解决**: 系统性排查并修复所有404和API错误
- **架构升级**: 成功迁移到Strapi 5.x最新版本
- **API全面可用**: 8个端点全部正常响应，无404错误
- **配置标准化**: Document Service API、环境变量、中间件等完全符合Strapi 5.x标准
- **问题排查文档**: 建立完整的20项troubleshooting清单供后续参考

#### 2.1 Strapi内容类型设计 - 已完成
- **环境状态**: Strapi管理界面完全可访问
- **完成状态**: 8/8 内容类型全部创建完成
- **API端点**: 全部可用并经过验证

**已创建的内容类型**：
  - [x] **Social Link** - 社交链接 (API: `/api/social-links`)
    - 3条测试数据已添加 (GitHub, Gmail, LinkedIn)
    - 字段：platform, display_name, url, platform_icon, is_active, display_order
  - [x] **Tag** - 标签系统 (API: `/api/tags`)
    - 字段：name, slug, color, description
    - 为Blog Post提供标签关系支持
  - [x] **Blog Post** - 博客文章 (API: `/api/blog-posts`)
    - 字段：title, slug, content, excerpt, 媒体字段, reading_time, 发布控制
    - 关系：Many-to-Many with Tag
  - [x] **Photo** - 摄影作品 (API: `/api/photos`)
    - 完整EXIF信息：camera_model, lens_model, aperture, shutter_speed, iso等
    - 专业字段：HDR支持, 色彩空间, 拍摄信息
    - 关系：Many-to-Many with Photo Album
  - [x] **Photo Album** - 相册管理 (API: `/api/photo-albums`)
    - 相册组织：album_name, description, album_type
    - 关系配置：cover_photo (Many-to-One), photos (Many-to-Many)
  - [x] **Project** - 技术项目 (API: `/api/projects`)
    - 技术展示：tech_stack (JSON), project_url, github_url
    - 项目管理：project_status, 媒体支持, is_featured
  - [x] **Album** - 音乐专辑 (API: `/api/albums`)
    - 音乐信息：title, artist, genre, release_year
    - 个人收藏：personal_rating, review, favorite_track
    - 流媒体链接：spotify_url, apple_music_url
  - [x] **Media Work** - 影视作品 (API: `/api/media-works`)
    - 影视信息：title, original_title, type, director, genre
    - 评价系统：personal_rating, review, watch_status
    - 外部链接：imdb_url, douban_url, bangumi_url

#### 2.2 关系和权限配置 - 已完成
- [x] 内容类型之间关系建立
  - Blog Post ↔ Tag (Many-to-Many)
  - Photo ↔ Photo Album (Many-to-Many)
  - Photo Album → Photo (cover_photo, Many-to-One)
- [x] 用户角色和权限设置
  - Public角色：8个内容类型只读权限 (find, findOne)
  - Authenticated角色：完整CRUD权限 (create, find, findOne, update, delete)
- [x] API访问权限配置
  - **生产服务器测试通过**: 172.96.193.211:1337
  - Public API端点全部可访问 (200 OK)
  - 权限限制验证通过 (POST请求403 Forbidden)
- [x] 文件上传权限和限制
  - Public角色：可访问Media Library (find)
  - Authenticated角色：完整文件管理权限 (upload, destroy)
  - Upload API测试通过

#### 2.3 系统性问题排查和修复 - 100%完成 (2025-08-08)
- [x] **关键问题诊断和解决**
  - **404问题完全解决**: 系统性修复路由注册失败问题
  - **Strapi 5.x配置标准化**: 20项troubleshooting清单全部完成
  - **环境变量修复**: APP_KEYS格式修正为4个密钥标准
  - **中间件配置修复**: 转换为纯字符串数组格式
  - **Document Service API迁移**: 2个控制器从Entity Service迁移完成
  - **字段类型兼容性**: 解决JSON字段populate错误
  - **插件配置优化**: Users-Permissions的allowedFields配置
- [x] **最终API状态验证**
  - **全部8个API端点正常**: social-links, albums, blog-posts, media-works, photos, photo-albums, tags, projects
  - **响应格式标准**: 符合Strapi 5.x官方格式 `{"data":[],"meta":{"pagination":...}}`
  - **错误完全消除**: 无404、400、500等错误
- [x] **技术文档完善**
  - **troubleshooting清单**: 20项系统性排查项目记录
  - **Strapi 5.x规范总结**: populate字段类型限制、Document Service API使用等
  - **问题解决案例**: 详细的错误分析和修复过程记录
- [x] **开发环境稳定性**
  - **启动流程标准化**: npm run develop正常启动
  - **配置一致性**: src和dist目录同步
  - **开发工具就绪**: TypeScript编译、ESLint通过
- [ ] 索引策略实施 (运维优化，可选)
- [ ] 备份策略配置 (运维优化，可选)

**🚀 后端环境完全就绪 - Phase 3 立即启动**
- **✅ 8个内容类型API**: 全部正常工作，无任何404或400错误
- **✅ Strapi 5.x标准化**: Document Service API、配置格式完全合规
- **✅ 开发环境稳定**: 启动流程标准化，编译无错误
- **✅ 技术文档完善**: 20项troubleshooting清单，后续维护有保障
- **✅ 问题解决能力**: 系统性排查方法论建立

### Phase 2.5: RAG聊天机器人系统开发
**核心目标**: 在About页面集成AI驱动的个性化聊天机器人

#### 2.5.1 后端服务开发
- [ ] FastAPI服务器搭建 (v0.115.x)
- [ ] ChromaDB向量数据库配置 (v0.5.x)
- [ ] OpenAI API集成 (GPT-4.1 mini)
- [ ] 文档处理pipeline实现
- [ ] RAG检索增强系统实现
- [ ] API端点开发 (/chat, /health)
- [ ] 限流和会话管理实现

#### 2.5.2 知识库构建
- [ ] Markdown文档撰写 (个人介绍、技能、项目等)
- [ ] 文档分块策略实现 (1500 tokens)
- [ ] 向量化和索引建立
- [ ] 元数据标注系统

#### 2.5.3 前端集成
- [ ] React聊天组件开发
- [ ] WebSocket或轮询机制实现
- [ ] 对话界面UI设计
- [ ] 阅后即焚功能实现
- [ ] 错误处理和加载状态

#### 2.5.4 部署和优化
- [ ] Docker容器化配置
- [ ] VPS资源分配优化
- [ ] 性能监控和日志系统
- [ ] 成本控制和监控

### Phase 3: 前端核心功能开发
**核心目标**: 实现主要页面和基础交互

**前端开发条件完全满足**:
- **✅ 后端API完全可用**: 8个端点经过系统性测试验证
- **✅ Strapi 5.x升级完成**: 最新版本特性和性能优势
- **✅ 错误排查体系**: 完整的问题诊断和解决文档
- **✅ 开发环境稳定**: 无配置冲突，启动流程标准化

#### 3.1 页面布局架构 (部分完成)
- [x] **主布局组件(Layout)** - app/layout.tsx 基础实现
- [x] **导航组件(Navigation)** - FloatingNav 高级导航系统
  - 10个section支持，桌面端显示5个
  - 鼠标位置响应缩放（椭圆形检测区域350x150px）
  - 滚轮和键盘导航支持
  - 余弦函数字体动态缩放
- [x] **页脚组件(Footer)** - 基础结构完成
- [x] **响应式断点处理** - Tailwind基础配置
- [x] **暗色主题支持** - 完整主题切换系统
  - ThemeProvider context管理
  - 三种模式：light/dark/auto
  - localStorage持久化
  - 主题切换控件（内边光效果 + 金色月亮闪光动画）

#### 3.2 主页分段组件
- [ ] Hero Section - 开场动画
- [ ] About Section - 个人简介
- [ ] Projects Section - 项目展示
- [ ] Photography Section - 摄影作品
- [ ] Blog Section - 文章预览
- [ ] Music Section - 专辑展示
- [ ] Movies Section - 影视作品
- [ ] Media Section - 视频音频
- [ ] Links Section - 社交链接
- [ ] Contact Section - 联系方式

#### 3.3 数据获取和状态管理
- [ ] API客户端封装
- [ ] React Query集成
- [ ] Zustand状态管理
- [ ] 错误处理机制
- [ ] 加载状态管理

### Phase 4: 动画效果实现
**核心目标**: 实现丰富的交互动画和视觉效果

#### 4.1 GSAP核心动画
- [ ] ScrollTrigger分段滚动
- [ ] 页面加载动画
- [ ] 元素进入动画
- [ ] 视差滚动效果
- [ ] 文字动画效果

#### 4.2 Framer Motion交互
- [ ] 页面切换动画
- [ ] 鼠标悬停效果
- [ ] 卡片展开动画
- [ ] 手势交互支持
- [ ] 布局动画优化

#### 4.3 性能优化
- [ ] 动画性能监控
- [ ] 移动端动画优化
- [ ] 减弱动画选项支持
- [ ] 内存使用优化

### Phase 5: 内容展示功能完善
**核心目标**: 完善各模块的展示和交互功能

#### 5.1 博客系统
- [ ] 文章列表页面
- [ ] 文章详情页面
- [ ] 标签筛选功能
- [ ] 搜索功能实现
- [ ] 阅读时间估算
- [ ] 相关文章推荐

#### 5.2 作品展示系统
- [ ] 项目详情页面
- [ ] 技术栈标签展示
- [ ] 项目截图轮播
- [ ] 外链跳转处理
- [ ] 项目分类筛选

#### 5.3 摄影作品系统
- [ ] 瀑布流布局
- [ ] 图片懒加载
- [ ] 灯箱查看功能
- [ ] EXIF信息展示
- [ ] 分类筛选功能
- [ ] HDR图片处理

#### 5.4 音乐和影视系统
- [ ] 专辑封面展示
- [ ] 评分和评价系统
- [ ] 外链播放支持
- [ ] 分类筛选功能
- [ ] 收藏标记功能

### Phase 6: 性能优化和SEO
**核心目标**: 优化网站性能和搜索引擎友好性

#### 6.1 性能优化
- [ ] 图片优化和压缩
- [ ] 代码分割优化
- [ ] 缓存策略实施
- [ ] CDN配置优化
- [ ] 核心网页指标优化

#### 6.2 SEO优化
- [ ] 元数据配置
- [ ] 结构化数据标记
- [ ] Sitemap生成
- [ ] 社交媒体优化
- [ ] 搜索引擎提交

#### 6.3 监控和分析
- [ ] 性能监控集成
- [ ] 用户行为分析
- [ ] 错误追踪配置
- [ ] 服务器监控

### Phase 7: 测试和部署优化
**核心目标**: 确保系统稳定性和用户体验

#### 7.1 功能测试
- [ ] 单元测试编写
- [ ] 集成测试设计
- [ ] 端到端测试
- [ ] 性能测试执行
- [ ] 兼容性测试

#### 7.2 部署优化
- [ ] 生产环境配置
- [ ] 自动化部署流程
- [ ] 备份恢复测试
- [ ] 负载测试执行
- [ ] 安全漏洞扫描

#### 7.3 文档完善
- [ ] 部署文档编写
- [ ] 用户使用指南
- [ ] 维护操作手册
- [ ] 故障排除指南

## 并行开发策略

### 前后端协同
- 后端API开发与前端组件开发并行
- Mock数据支持前端独立开发
- API文档实时更新和同步

### 设计与开发协同
- 视觉设计与组件开发并行
- 交互效果与动画实现同步
- 用户体验测试贯穿开发过程

## 风险控制措施

### 技术风险
- 关键技术预研和验证
- 备选方案准备
- 性能瓶颈提前识别
- 第三方依赖版本锁定

### 进度风险
- 核心功能优先开发
- 功能优先级动态调整
- 增量交付策略
- 持续集成保证质量

## 质量保证标准

### 代码质量
- TypeScript类型覆盖率 > 90%
- ESLint规则严格执行
- 代码审查流程建立
- 单元测试覆盖率 > 80%

### 性能标准
- Lighthouse分数 > 90
- 首屏加载时间 < 2秒
- 交互响应时间 < 100ms
- Core Web Vitals优秀评级

### 用户体验标准
- 响应式设计全设备适配
- 无障碍访问支持
- 浏览器兼容性保证
- 离线访问支持(PWA)

## 维护和迭代计划

### 日常维护
- 内容更新工作流
- 性能监控和优化
- 安全补丁及时更新
- 备份策略执行

### 功能迭代
- 用户反馈收集机制
- 功能优先级评估
- 版本发布策略
- A/B测试框架

## 成功指标定义

### 技术指标
- 系统可用性 > 99.5%
- 平均响应时间 < 200ms
- 错误率 < 0.1%
- 部署成功率 100%

### 业务指标
- 页面浏览量增长
- 用户停留时间
- 内容互动率
- 搜索引擎排名