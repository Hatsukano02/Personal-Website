# Phase 3.1 - 项目结构和布局架构配置文档

## Phase 概览

**当前阶段**: Phase 3.1 - 项目结构和布局架构  
**开始时间**: 2025-01-28  
**完成时间**: 2025-08-05 (部分完成)  
**开发环境**: macOS + Cursor + Claude Code

### 核心目标

建立 Next.js 15 前端项目的完整架构，实现主页布局组件和导航系统，为后续开发提供坚实基础。

### 前置条件验证

- ✅ **后端 API**: 8 个内容类型 API 全部可用
- ✅ **测试数据**: 核心内容类型已有示例数据
- ✅ **文件服务**: 图片上传和访问功能正常
- ✅ **服务器**: 172.96.193.211 生产环境稳定

## 实际技术架构

### 核心技术栈（已实现）

```json
{
  "framework": "Next.js 15.4.3 (App Router)",
  "language": "TypeScript 5+",
  "styling": "Tailwind CSS (@tailwindcss/postcss) + CSS Modules",
  "state": "Zustand 5.0.6",
  "animation": "GSAP 3.13.0 + Framer Motion 12.23.7",
  "ui": "Atomic Design Pattern",
  "i18n": "Custom implementation with Zustand",
  "icons": "Lucide React 0.536.0"
}
```

### 实际项目结构

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # 全局样式（包含动画定义）
│   │   ├── layout.tsx         # 根布局（包含所有Provider）
│   │   └── page.tsx           # 主页（10个Section组合）
│   ├── components/
│   │   ├── ui/                # 基础UI组件
│   │   │   ├── Button/        # 按钮组件
│   │   │   ├── Typography/    # 文字组件
│   │   │   ├── Card/          # 卡片组件
│   │   │   ├── GlassCard/     # 玻璃态卡片
│   │   │   └── AnimatedGradientBackground/
│   │   ├── sections/          # 页面区块（10个Section）
│   │   │   ├── HeroSection/   # ✅ 完整实现
│   │   │   ├── AboutSection/  # 基础框架
│   │   │   ├── ProjectsSection/
│   │   │   ├── PhotoSection/
│   │   │   ├── BlogSection/
│   │   │   ├── MusicSection/
│   │   │   ├── MoviesSection/
│   │   │   ├── MediaSection/
│   │   │   ├── LinksSection/
│   │   │   └── ContactSection/
│   │   ├── layouts/           # 布局组件
│   │   │   ├── FloatingNav/   # ✅ 浮动导航（完整实现）
│   │   │   ├── ThemeControls/ # ✅ 主题控制（完整实现）
│   │   │   ├── LanguageControls/ # ✅ 语言切换（完整实现）
│   │   │   ├── PageWrapper/   # 页面包装器
│   │   │   ├── SectionWrapper/# Section包装器
│   │   │   ├── Header/        # 头部组件
│   │   │   └── Footer/        # 页脚组件
│   │   ├── animations/        # 动画组件
│   │   │   ├── ScrollTrigger/ # GSAP滚动触发
│   │   │   ├── PageTransition/# 页面切换
│   │   │   └── LoadingSpinner/# 加载动画
│   │   └── providers/         # Context Providers
│   │       ├── ThemeProvider.tsx    # ✅ 主题管理
│   │       ├── LanguageProvider.tsx # ✅ 语言管理
│   │       └── QueryProvider.tsx    # React Query
│   ├── lib/
│   │   ├── api/               # API客户端
│   │   │   └── client.ts      # Axios配置
│   │   ├── i18n/              # ✅ 国际化
│   │   │   └── translations/  # 中英文翻译文件
│   │   │       ├── en.ts
│   │   │       └── zh.ts
│   │   ├── utils/             # 工具函数
│   │   │   ├── cn.ts          # ✅ className合并
│   │   │   ├── format.ts      # 格式化函数
│   │   │   └── constants.ts   # 常量定义
│   │   └── hooks/             # 自定义Hooks
│   │       ├── useTheme.ts    # 主题切换Hook
│   │       ├── useScroll.ts   # 滚动检测Hook
│   │       └── useAPI.ts      # API数据获取
│   ├── stores/                # ✅ Zustand状态管理
│   │   ├── themeStore.ts      # 主题状态（实际使用Provider）
│   │   ├── navigationStore.ts # 导航状态
│   │   └── languageStore.ts   # ✅ 语言状态
│   └── types/                 # TypeScript类型
│       └── index.ts           # 类型导出
├── public/                    # 静态资源
│   └── my-notion-face-transparent.png # 头像
├── package.json               # 依赖配置
├── tailwind.config.ts         # ✅ Tailwind配置
├── tsconfig.json              # TypeScript配置
└── next.config.js             # Next.js配置
```

## 已实现的核心功能

### 1. 国际化系统 (i18n) ✅

```typescript
// 语言切换存储
const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    { name: "language-storage" }
  )
);

// 支持的功能：
- 中英文切换
- localStorage 持久化
- HTML lang 属性自动更新
- 所有UI文本国际化
```

### 2. 主题系统 ✅

```typescript
// 主题模式
type Theme = "light" | "dark" | "auto";

// 功能特性：
- 三种模式：明亮/暗黑/跟随系统
- localStorage 持久化
- 系统主题变化监听
- 平滑过渡动画
```

### 3. 浮动导航栏 ✅

```typescript
// 核心特性：
- 10个导航项，桌面端显示5个
- 鼠标位置响应（最大放大15%）
- 椭圆形检测区域（550x150px）
- 余弦函数字体缩放
- 滚轮和键盘导航支持
- 活跃section自动高亮
- 玻璃态效果
```

### 4. Hero Section ✅

```typescript
// 实现功能：
- 响应式布局（clamp函数）
- 头像悬停动画
- 多级点击动画（1-4次）
- 标题渐变动画
- 滚动提示
- 完整国际化
```

### 5. 玻璃态效果优化 ✅

```css
/* 暗色模式统一样式 */
dark:bg-slate-600/80
dark:border-white/70
box-shadow: inset 0 0 3px rgba(255, 255, 255, 0.15)
```

## 实际使用的依赖

### 生产依赖

```json
{
  "@tailwindcss/forms": "^0.5.10",
  "@tailwindcss/typography": "^0.5.16",
  "@tanstack/react-query": "^5.83.0",
  "axios": "^1.11.0",
  "clsx": "^2.1.1",
  "framer-motion": "^12.23.7",
  "gsap": "^3.13.0",
  "lucide-react": "^0.536.0",
  "next": "15.4.3",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "zustand": "^5.0.6"
}
```

### 开发依赖

```json
{
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "@tailwindcss/postcss": "^4",
  "eslint": "^9",
  "eslint-config-next": "15.4.3",
  "typescript": "^5.8.1"
}
```

## 实际的设计系统

### 色彩系统（已实现）

```typescript
// Tailwind配置中的实际颜色
colors: {
  // 日间模式
  'light-primary': '#087E8B',
  'light-secondary': '#C7FFDA',
  'light-accent': '#0A2342',
  'light-background-primary': '#FEFEFE',
  'light-background-secondary': '#F9FAFB',
  'light-background-tertiary': '#F3F4F6',
  'light-text-primary': '#1F2937',
  'light-text-secondary': '#4B5563',
  'light-text-muted': '#6B7280',
  'light-border-default': '#1F2937',
  'light-border-muted': '#374151',
  
  // 夜间模式
  'dark-primary': '#4a8c8c',
  'dark-secondary': '#fab062',
  'dark-accent': '#011126',
  'dark-background-primary': '#1C1C1E',
  'dark-background-secondary': '#2C2C2E',
  'dark-background-tertiary': '#3A3A3C',
  'dark-text-primary': '#F8FAFC',
  'dark-text-secondary': '#CBD5E1',
  'dark-text-muted': '#94A3B8',
  'dark-border-default': '#F8FAFC',
  'dark-border-muted': '#E2E8F0',
  
  // 特殊效果
  'old-gold': '#d9b70d' // 第4次点击动画的金色
}
```

### 字体系统

```typescript
fontFamily: {
  'sans': ['SourceHanSans-VF', 'PingFang SC', 'system-ui', 'sans-serif'],
  'serif': ['SourceHanSerif-VF', 'PingFang SC', 'serif'],
  'playful': ['SourceHanSans-VF', 'sans-serif'],
  'variable': ['SourceHanSans-VF', 'system-ui', 'sans-serif']
}
```

### 响应式断点

```typescript
// Tailwind默认断点
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px'
}
```

## 动画系统

### 已实现的动画

1. **fade-in-out**: 淡入淡出效果
2. **gradient-flow**: 渐变流动效果（Hero标题）
3. **golden-icon-flash**: 金色闪光效果（主题切换）
4. **bounce**: 弹跳效果（滚动提示）

### CSS动画定义

```css
@keyframes fadeInOut {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes gradientFlow {
  /* 渐变动画实现 */
}

@keyframes goldenIconFlash {
  /* 金色闪光动画实现 */
}
```

## 待完成任务

### Phase 3.1 剩余任务

1. **API集成层**
   - [ ] Strapi API客户端配置
   - [ ] 类型定义完善
   - [ ] 错误处理机制

2. **剩余9个Section实现**
   - [ ] AboutSection - 个人简介
   - [ ] ProjectsSection - 项目展示
   - [ ] PhotoSection - 摄影作品
   - [ ] BlogSection - 博客预览
   - [ ] MusicSection - 音乐收藏
   - [ ] MoviesSection - 影视作品
   - [ ] MediaSection - 媒体内容
   - [ ] LinksSection - 社交链接
   - [ ] ContactSection - 联系方式

3. **性能优化**
   - [ ] 图片懒加载
   - [ ] 组件代码分割
   - [ ] 动画性能监控

4. **移动端适配**
   - [ ] 响应式布局完善
   - [ ] 触摸手势支持
   - [ ] 移动端导航优化

## 技术决策记录

### 为什么选择 Zustand 而不是 Redux？
- 更轻量级（bundle size更小）
- API更简单直观
- TypeScript支持更好
- 内置持久化支持

### 为什么自定义 i18n 而不是使用 next-i18n？
- 项目只需要中英文切换
- 减少依赖复杂度
- 更好的性能控制
- 与Zustand无缝集成

### 为什么使用 Tailwind CSS？
- 快速开发
- 一致的设计系统
- 优秀的性能（PurgeCSS）
- 与组件化开发完美配合

## 下一步计划

1. **完成剩余Section开发**（优先级：高）
2. **集成Strapi API**（优先级：高）
3. **添加页面过渡动画**（优先级：中）
4. **性能优化和测试**（优先级：中）
5. **移动端完整适配**（优先级：低）

---

**文档版本**: v2.0  
**最后更新**: 2025-08-05  
**维护人**: Claude (配合用户和 Claude Code)  
**更新内容**: 完整重构文档，清理不符合实际的内容，记录实际实现的功能和架构