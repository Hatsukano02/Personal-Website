# Phase 3.1 - 项目结构和布局架构配置文档

## Phase 概览

**当前阶段**: Phase 3.1 - 项目结构和布局架构  
**开始时间**: 2025-01-28  
**预估完成**: 2025-01-30  
**开发环境**: macOS + Cursor + Claude Code

### 核心目标

建立 Next.js 15 前端项目的完整架构，实现主页布局组件和导航系统，为后续开发提供坚实基础。

### 前置条件验证

- **后端 API**: 8 个内容类型 API 全部可用
- **测试数据**: 核心内容类型已有示例数据
- **文件服务**: 图片上传和访问功能正常
- **服务器**: 172.96.193.211 生产环境稳定

## 确定的技术架构

### 核心技术栈

```json
{
  "framework": "Next.js 15 (App Router)",
  "language": "TypeScript 5+",
  "styling": "Tailwind CSS 4.1.11 + CSS Modules",
  "state": "Zustand + React Query",
  "animation": "GSAP + Framer Motion",
  "ui": "Atomic Design Pattern"
}
```

### 项目结构标准

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (home)/            # 主页路由组
│   │   │   └── page.tsx       # 分段滚动主页
│   │   ├── blog/              # 博客页面
│   │   │   ├── page.tsx       # 博客列表
│   │   │   └── [slug]/        # 文章详情
│   │   ├── projects/          # 项目展示
│   │   │   ├── page.tsx       # 项目列表
│   │   │   └── [slug]/        # 项目详情
│   │   ├── photography/       # 摄影作品
│   │   │   ├── page.tsx       # 作品集
│   │   │   └── [album]/       # 相册详情
│   │   ├── globals.css        # 全局样式
│   │   ├── layout.tsx         # 根布局
│   │   └── api/               # API路由 (如需要)
│   ├── components/
│   │   ├── ui/                # Atomic - 基础UI组件
│   │   │   ├── Button/        # 按钮组件
│   │   │   ├── Typography/    # 文字组件
│   │   │   ├── Card/          # 卡片组件
│   │   │   └── ...
│   │   ├── sections/          # Organism - 页面区块
│   │   │   ├── HeroSection/   # 开场动画区域
│   │   │   ├── AboutSection/  # 个人简介
│   │   │   ├── ProjectsSection/ # 项目展示
│   │   │   ├── PhotoSection/  # 摄影作品
│   │   │   ├── BlogSection/   # 博客预览
│   │   │   ├── MusicSection/  # 音乐专辑
│   │   │   ├── MoviesSection/ # 影视作品
│   │   │   ├── MediaSection/  # 视频音频
│   │   │   ├── LinksSection/  # 社交链接
│   │   │   └── ContactSection/ # 联系方式
│   │   ├── layouts/           # Template - 布局组件
│   │   │   ├── FloatingNav/   # 浮动导航组件
│   │   │   ├── Footer/        # 页脚
│   │   │   ├── ThemeControls/ # 主题控制组件
│   │   │   └── PageWrapper/   # 页面包装器
│   │   └── animations/        # 动画组件
│   │       ├── ScrollTrigger/ # GSAP滚动触发
│   │       ├── PageTransition/ # 页面切换
│   │       └── LoadingSpinner/ # 加载动画
│   ├── lib/
│   │   ├── api/               # API客户端
│   │   │   ├── client.ts      # Axios/Fetch配置
│   │   │   ├── endpoints.ts   # API端点定义
│   │   │   └── types.ts       # API响应类型
│   │   ├── utils/             # 工具函数
│   │   │   ├── cn.ts          # className合并
│   │   │   ├── format.ts      # 格式化函数
│   │   │   └── constants.ts   # 常量定义
│   │   └── hooks/             # 自定义Hooks
│   │       ├── useTheme.ts    # 主题切换
│   │       ├── useScroll.ts   # 滚动检测
│   │       └── useAPI.ts      # API数据获取
│   ├── stores/                # 状态管理
│   │   ├── themeStore.ts      # 主题状态
│   │   ├── navigationStore.ts # 导航状态
│   │   └── index.ts           # Store导出
│   ├── styles/                # 样式文件
│   │   ├── globals.css        # 全局CSS
│   │   ├── components.css     # 组件样式
│   │   └── animations.css     # 动画样式
│   └── types/                 # TypeScript类型
│       ├── api.ts             # API类型定义
│       ├── content.ts         # 内容类型
│       └── global.ts          # 全局类型
├── public/                    # 静态资源
│   ├── images/                # 图片资源
│   ├── icons/                 # 图标文件
│   └── favicon.ico            # 网站图标
├── package.json               # 依赖配置
├── tailwind.config.js         # Tailwind配置
├── tsconfig.json              # TypeScript配置
└── next.config.js             # Next.js配置
```

## 设计系统规范

### 色彩配置

基于用户提供的设计参考，定义完整的色彩系统：

```typescript
// 色彩系统配置
interface ColorSystem {
  light: {
    primary: "#087E8B"; // Teal (主色)
    secondary: "#C7FFDA"; // Tea Green (辅助色)
    accent: "#0A2342"; // Oxford Blue (强调色)
    background: {
      primary: "#FFFFFF"; // 主背景
      secondary: "#F8FAFC"; // 次级背景
      tertiary: "#F1F5F9"; // 三级背景
    };
    text: {
      primary: "#1E293B"; // 主文字
      secondary: "#64748B"; // 次级文字
      muted: "#94A3B8"; // 弱化文字
    };
    border: {
      default: "#E2E8F0"; // 默认边框
      muted: "#F1F5F9"; // 弱化边框
    };
  };
  dark: {
    primary: "#4a8c8c"; // Flounce (主色)
    secondary: "#fab062"; // Sandy Brown (辅助色)
    accent: "#011126"; // Stellar Green (强调色)
    background: {
      primary: "#0F1419"; // 主背景
      secondary: "#1A1F2E"; // 次级背景
      tertiary: "#252A3A"; // 三级背景
    };
    text: {
      primary: "#F1F5F9"; // 主文字
      secondary: "#CBD5E1"; // 次级文字
      muted: "#94A3B8"; // 弱化文字
    };
    border: {
      default: "#334155"; // 默认边框
      muted: "#1E293B"; // 弱化边框
    };
  };
}

// 渐变配置
interface GradientConfig {
  background: {
    light: "linear-gradient(135deg, #C7FFDA 0%, #087E8B 50%, #0A2342 100%)";
    dark: "linear-gradient(135deg, #011126 0%, #4a8c8c 50%, #fab062 100%)";
  };
  glass: {
    light: "rgba(255, 255, 255, 0.1)";
    dark: "rgba(0, 0, 0, 0.1)";
  };
  noise: {
    opacity: 0.03;
    size: "200px 200px";
  };
}
```

### 布局设计方案

#### 浮动导航架构（已实现）

现代胶囊式设计，带鼠标位置响应的智能缩放效果：

```typescript
interface FloatingNavConfig {
  style: {
    shape: "pill"; // 胶囊形状
    radius: "9999px"; // 完全圆角
    height: "auto"; // 自适应高度
    padding: "8px 16px"; // 内边距
    backdrop: "blur(12px)"; // 毛玻璃效果
    background: "rgba(theme.colors.background.secondary, 0.8)";
    border: "1px solid rgba(theme.colors.border.default, 0.2)";
    shadow: "0 8px 32px rgba(0, 0, 0, 0.12)";
  };
  positioning: {
    desktop: {
      position: "fixed";
      bottom: "32px";
      left: "50%";
      transform: "translateX(-50%) scale(1-1.15)"; // 鼠标响应缩放
      zIndex: 50;
    };
    mobile: {
      position: "fixed";
      bottom: "16px";
      left: "16px";
      right: "16px";
      transform: "none";
    };
  };
  navigation: [
    { id: "hero"; label: "Home"; icon: "Home" },
    { id: "about"; label: "About"; icon: "User" },
    { id: "projects"; label: "Projects"; icon: "Code" },
    { id: "photography"; label: "Photos"; icon: "Camera" },
    { id: "blog"; label: "Blog"; icon: "PenTool" },
    { id: "music"; label: "Music"; icon: "Music" },
    { id: "movies"; label: "Movies"; icon: "Film" },
    { id: "media"; label: "Media"; icon: "Folder" },
    { id: "links"; label: "Links"; icon: "Link" },
    { id: "contact"; label: "Contact"; icon: "Mail" }
  ];
  interactions: {
    mouseProximity: {
      type: "elliptical"; // 椭圆形响应区域
      rangeX: 350; // 水平350px
      rangeY: 150; // 垂直150px
      maxScale: 1.15; // 最大放大15%
      easing: "cubic-out"; // 三次贝塞尔缓动
      leaveDelay: 500; // 离开延迟500ms
    };
    itemScaling: {
      algorithm: "cosine"; // 余弦函数缩放
      fontWeight: [400, 700]; // 字重范围
      fontWidth: [85, 100]; // 字宽范围
      fontSize: [14, 18]; // 字号范围
    };
    scrollBehavior: {
      visibleCount: 5; // 桌面端显示5个
      centerIndex: 2; // 居中第3个
      wheelNavigation: true; // 支持滚轮切换
      keyboardNavigation: true; // 支持键盘方向键
    };
  };
}
```

#### 主题切换控件（已实现）

胶囊按钮组设计，带鼠标位置响应的智能缩放：

```typescript
interface ThemeControlsConfig {
  positioning: {
    desktop: {
      position: "fixed";
      top: "16px";
      right: "16px";
      zIndex: 50;
    };
    mobile: {
      position: "fixed";
      top: "16px";
      right: "16px";
    };
  };
  style: {
    width: "auto"; // 自适应宽度
    height: "auto"; // 自适应高度
    padding: "6px"; // 内边距
    gap: "4px"; // 按钮间距
    background: "rgba(theme.colors.background.secondary, 0.8)";
    backdropFilter: "blur(12px)"; // 毛玻璃效果
    border: "1px solid rgba(theme.colors.border.default, 0.2)";
    borderRadius: "9999px"; // 完全圆角
    buttons: [
      { mode: "light"; icon: "Sun"; size: 16 },
      { mode: "auto"; icon: "Monitor"; size: 16 },
      { mode: "dark"; icon: "Moon"; size: 16 }
    ];
  };
  interactions: {
    mouseProximity: {
      type: "elliptical"; // 椭圆形响应区域
      rangeX: 200; // 水平200px
      rangeY: 120; // 垂直120px
      maxScale: 1.12; // 最大放大12%
      easing: "cubic-out"; // 三次贝塞尔缓动
      leaveDelay: 500; // 离开延迟500ms
    };
    buttonStyle: {
      size: "36px"; // 按钮尺寸
      transition: "all 300ms ease"; // 平滑过渡
      hover: "bg-tertiary/50"; // 悬停背景
      active: "text-primary bg-primary/10"; // 激活状态
    };
  };
  logic: {
    priority: "user manual selection > system preference";
    storage: "localStorage with key 'theme'";
    systemDetection: 'window.matchMedia("(prefers-color-scheme: dark)")';
    htmlClass: "dark" | "light"; // HTML根元素类名
  };
}
```

### 分段滚动系统

10 个全屏 Section 的配置：

```typescript
interface ScrollingSectionConfig {
  container: {
    height: "100vh";
    overflowY: "scroll";
    scrollSnapType: "y mandatory";
    scrollBehavior: "smooth";
  };
  sections: [
    {
      id: "hero";
      component: "HeroSection";
      height: "100vh";
      snapAlign: "start";
      background: "gradient with noise texture";
      animation: "typewriter + fade-in sequence";
    },
    {
      id: "about";
      component: "AboutSection";
      height: "100vh";
      snapAlign: "start";
      layout: "split left-text right-image";
      animation: "slide-in from left/right";
    },
    {
      id: "projects";
      component: "ProjectsSection";
      height: "100vh";
      snapAlign: "start";
      layout: "masonry grid with hover effects";
      animation: "staggered card reveals";
    },
    {
      id: "photography";
      component: "PhotoSection";
      height: "100vh";
      snapAlign: "start";
      layout: "justified gallery layout";
      animation: "lightbox and parallax effects";
    },
    {
      id: "blog";
      component: "BlogSection";
      height: "100vh";
      snapAlign: "start";
      layout: "featured article + recent posts";
      animation: "reading progress indicators";
    },
    {
      id: "music";
      component: "MusicSection";
      height: "100vh";
      snapAlign: "start";
      layout: "album covers with audio preview";
      animation: "vinyl record rotation effects";
    },
    {
      id: "movies";
      component: "MoviesSection";
      height: "100vh";
      snapAlign: "start";
      layout: "movie poster grid";
      animation: "poster flip and rating animations";
    },
    {
      id: "media";
      component: "MediaSection";
      height: "100vh";
      snapAlign: "start";
      layout: "video gallery with thumbnails";
      animation: "video preview on hover";
    },
    {
      id: "links";
      component: "LinksSection";
      height: "100vh";
      snapAlign: "start";
      layout: "social media cards";
      animation: "floating and pulse effects";
    },
    {
      id: "contact";
      component: "ContactSection";
      height: "100vh";
      snapAlign: "start";
      layout: "contact form with info cards";
      animation: "form field focus animations";
    }
  ];
  scrollDetection: {
    throttle: "16ms";
    threshold: "50vh";
    updateNavigation: "highlight active section in nav";
  };
}
```

## 技术实现规范

### 动画和交互系统

#### GSAP 动画配置

```typescript
interface GSAPAnimationConfig {
  scrollTrigger: {
    trigger: "section";
    start: "top 80%";
    end: "bottom 20%";
    scrub: false;
    markers: false; // 生产环境关闭
    onEnter: "animation.play()";
    onLeave: "animation.reverse()";
    refreshPriority: 1;
  };
  timeline: {
    defaults: {
      duration: 0.6;
      ease: "power2.out";
    };
    stagger: 0.1;
  };
  performance: {
    force3D: true;
    willChange: "transform, opacity";
    backfaceVisibility: "hidden";
  };
}
```

#### Framer Motion 配置

```typescript
interface FramerMotionConfig {
  layoutAnimations: {
    type: "spring";
    stiffness: 400;
    damping: 30;
  };
  pageTransitions: {
    initial: { opacity: 0; y: 20 };
    animate: { opacity: 1; y: 0 };
    exit: { opacity: 0; y: -20 };
    transition: { duration: 0.3; ease: "easeInOut" };
  };
  hoverEffects: {
    whileHover: { scale: 1.05 };
    whileTap: { scale: 0.95 };
    transition: { type: "spring"; stiffness: 400; damping: 17 };
  };
}
```

### 性能优化配置

#### 毛玻璃效果优化

```css
/* 高性能毛玻璃实现 */
.glass-effect {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(var(--glass-bg), 0.1);
  border: 1px solid rgba(var(--glass-border), 0.2);

  /* 性能优化 */
  will-change: transform;
  transform: translateZ(0);

  /* 降级支持 */
  @supports not (backdrop-filter: blur()) {
    background: rgba(var(--glass-bg), 0.9);
  }
}

/* 噪点纹理 */
.noise-texture::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgICAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsUm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgc2VlZD0iMSIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNSIvPgo8L3N2Zz4=");
  pointer-events: none;
}
```

#### 响应式断点

```typescript
interface ResponsiveConfig {
  breakpoints: {
    xs: "320px"; // 小手机
    sm: "640px"; // 大手机
    md: "768px"; // 平板
    lg: "1024px"; // 小桌面
    xl: "1280px"; // 大桌面
    "2xl": "1536px"; // 超大桌面
  };
  containers: {
    xs: "100%";
    sm: "640px";
    md: "768px";
    lg: "1024px";
    xl: "1280px";
    "2xl": "1536px";
  };
}
```

## Phase 3.1 详细任务清单

### 任务 1: Next.js 项目初始化 (优先级: 高)

**目标**: 建立完整的项目基础架构

#### 1.1 项目创建和配置

```bash
# 项目创建命令
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 进入项目目录
cd frontend

# 验证基础配置
npm run dev
```

**配置检查清单**:

- [ ] Next.js 15.4.3 安装成功
- [ ] TypeScript 配置正确
- [ ] ESLint 规则设置
- [ ] Tailwind CSS 集成
- [ ] App Router 结构
- [ ] src 目录结构
- [ ] 路径别名配置

#### 1.2 依赖包安装

```json
{
  "dependencies": {
    "next": "15.4.3",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "typescript": "^5",
    "tailwindcss": "4.1.11",
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.10",
    "zustand": "5.0.6",
    "@tanstack/react-query": "5.83.0",
    "gsap": "3.13.0",
    "framer-motion": "12.23.7",
    "axios": "^1.6.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "15.4.3",
    "autoprefixer": "^10.0.1",
    "postcss": "^8"
  }
}
```

#### 1.3 配置文件详细设置

**next.config.js 配置**:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "172.96.193.211",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;
```

**tailwind.config.js 配置**:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light: {
          primary: "#087E8B",
          secondary: "#C7FFDA",
          accent: "#0A2342",
          background: {
            primary: "#FFFFFF",
            secondary: "#F8FAFC",
            tertiary: "#F1F5F9",
          },
          text: {
            primary: "#1E293B",
            secondary: "#64748B",
            muted: "#94A3B8",
          },
          border: {
            DEFAULT: "#E2E8F0",
            muted: "#F1F5F9",
          },
        },
        dark: {
          primary: "#4a8c8c",
          secondary: "#fab062",
          accent: "#011126",
          background: {
            primary: "#0F1419",
            secondary: "#1A1F2E",
            tertiary: "#252A3A",
          },
          text: {
            primary: "#F1F5F9",
            secondary: "#CBD5E1",
            muted: "#94A3B8",
          },
          border: {
            DEFAULT: "#334155",
            muted: "#1E293B",
          },
        },
      },
      fontFamily: {
        sans: ["SourceHanSans-VF", "PingFang SC", "system-ui", "sans-serif"],
        serif: ["SourceHanSerif-VF", "PingFang SC", "serif"],
        playful: ["AlimamaFangYuanTiVF", "SourceHanSans-VF", "sans-serif"],
        variable: [
          "SourceHanSans-VF",
          "Inter-Variable",
          "system-ui",
          "sans-serif",
        ],
      },
      fontWeight: {
        "variable-light": "300",
        "variable-normal": "400",
        "variable-medium": "500",
        "variable-semibold": "600",
        "variable-bold": "700",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      height: {
        "screen-dynamic": "100dvh",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.8s ease-out",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};

export default config;
```

**tsconfig.json 配置**:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/types/*": ["./src/types/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**环境变量配置 (.env.local)**:

```bash
# API配置
NEXT_PUBLIC_API_URL=http://172.96.193.211:1337/api
NEXT_PUBLIC_MEDIA_URL=http://172.96.193.211:1337

# 开发配置
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 性能配置
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_ANIMATIONS=true
```

**配置验证清单**:

- [ ] `next.config.js` - 图片域名、输出配置、性能优化
- [ ] `tailwind.config.js` - 完整主题色彩系统、断点、动画配置
- [ ] `tsconfig.json` - 路径映射、编译选项、严格模式
- [ ] `.env.local` - API 端点、开发环境变量

### 任务 2: 基础组件架构 (优先级: 高)

#### 2.1 Atomic 层 - UI 基础组件

**Button 组件架构 (src/components/ui/Button/)**:

```typescript
// Button.types.ts
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

// Button.module.css
.button {
  @apply inline-flex items-center justify-center rounded-full font-medium transition-all duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.primary {
  @apply bg-light-primary text-white hover:bg-light-primary/90;
  @apply dark:bg-dark-primary dark:hover:bg-dark-primary/90;
}

.secondary {
  @apply bg-light-secondary text-light-accent hover:bg-light-secondary/80;
  @apply dark:bg-dark-secondary dark:text-dark-accent dark:hover:bg-dark-secondary/80;
}

.ghost {
  @apply bg-transparent border border-light-border hover:bg-light-background-secondary;
  @apply dark:border-dark-border dark:hover:bg-dark-background-secondary;
}

.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20;
  @apply hover:bg-white/20 dark:bg-black/10 dark:border-black/20 dark:hover:bg-black/20;
}
```

**Typography 组件架构 (src/components/ui/Typography/)**:

```typescript
// Typography.types.ts
export interface TypographyProps {
  variant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "caption"
    | "code";
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

// Typography配置映射
export const typographyConfig = {
  h1: "text-4xl md:text-6xl font-bold tracking-tight",
  h2: "text-3xl md:text-5xl font-bold tracking-tight",
  h3: "text-2xl md:text-4xl font-semibold",
  h4: "text-xl md:text-2xl font-semibold",
  h5: "text-lg md:text-xl font-medium",
  h6: "text-base md:text-lg font-medium",
  body: "text-base leading-relaxed",
  caption: "text-sm text-light-text-muted dark:text-dark-text-muted",
  code: "font-mono text-sm bg-light-background-tertiary dark:bg-dark-background-tertiary px-2 py-1 rounded",
};
```

**Card 组件架构 (src/components/ui/Card/)**:

```typescript
// Card.types.ts
export interface CardProps {
  variant?: 'default' | 'hover' | 'featured' | 'glass'
  children: React.ReactNode
  className?: string
  onClick?: () => void
  isInteractive?: boolean
}

// Card.module.css
.card {
  @apply rounded-xl border transition-all duration-300;
}

.default {
  @apply bg-light-background-primary border-light-border;
  @apply dark:bg-dark-background-primary dark:border-dark-border;
}

.hover {
  @apply hover:shadow-lg hover:scale-[1.02] cursor-pointer;
  @apply hover:border-light-primary/20 dark:hover:border-dark-primary/20;
}

.featured {
  @apply ring-2 ring-light-primary/20 dark:ring-dark-primary/20;
  @apply shadow-xl border-light-primary/30 dark:border-dark-primary/30;
}

.glass {
  @apply bg-white/10 backdrop-blur-xl border-white/20;
  @apply dark:bg-black/10 dark:border-black/20;
}
```

**组件开发清单**:

- [ ] Button 组件 (4 variants + loading state + icons)
- [ ] Typography 组件 (9 variants + responsive sizing)
- [ ] Card 组件 (4 variants + interaction states)
- [ ] Input 组件 (text, email, textarea + validation)
- [ ] Badge 组件 (状态标签 + 颜色 variants)
- [ ] Avatar 组件 (图片 + 首字母 + placeholder)

#### 2.2 Layout 组件系统

**Header 组件架构 (src/components/layouts/Header/)**:

```typescript
// Header.types.ts
export interface HeaderProps {
  variant?: "transparent" | "solid" | "glass";
  showLogo?: boolean;
  navigationItems?: NavigationItem[];
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

// Header样式配置
export const headerVariants = {
  transparent: "bg-transparent",
  solid:
    "bg-light-background-primary dark:bg-dark-background-primary shadow-sm",
  glass:
    "bg-white/10 backdrop-blur-md border-b border-white/20 dark:bg-black/10 dark:border-black/20",
};
```

**Footer 组件架构 (src/components/layouts/Footer/)**:

```typescript
// Footer.types.ts
export interface FooterProps {
  socialLinks?: SocialLink[];
  showCopyright?: boolean;
  customContent?: React.ReactNode;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
  displayName: string;
}
```

**布局组件开发清单**:

- [ ] Header 组件 (3 variants + 响应式导航)
- [ ] Footer 组件 (社交链接 + 版权信息)
- [ ] PageWrapper 组件 (页面容器 + metadata)
- [ ] SectionWrapper 组件 (section 容器 + scroll-snap)

#### 2.3 工具函数和 Hooks 系统

**主题管理 Hook (src/lib/hooks/useTheme.ts)**:

```typescript
export interface ThemeConfig {
  mode: "light" | "dark" | "auto";
  effectiveTheme: "light" | "dark";
  systemPreference: "light" | "dark";
}

export interface UseThemeReturn {
  theme: ThemeConfig;
  setTheme: (mode: "light" | "dark" | "auto") => void;
  toggleTheme: () => void;
  isSystemMode: boolean;
}

// 主题检测和切换逻辑
export const useTheme = (): UseThemeReturn => {
  // 系统主题检测
  // localStorage持久化
  // 主题切换动画
  // 自动模式处理
};
```

**滚动检测 Hook (src/lib/hooks/useScroll.ts)**:

```typescript
export interface ScrollState {
  scrollY: number;
  scrollDirection: "up" | "down";
  activeSection: string;
  isScrolling: boolean;
}

export interface UseScrollOptions {
  throttle?: number;
  threshold?: number;
  sections?: string[];
}

export const useScroll = (options?: UseScrollOptions): ScrollState => {
  // 滚动位置检测
  // 节流处理
  // 方向判断
  // 当前section计算
};
```

**API 数据获取 Hook (src/lib/hooks/useAPI.ts)**:

```typescript
export interface APIHookOptions {
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
  refetchOnWindowFocus?: boolean
}

// 各种API数据获取hooks
export const useBlogPosts = (options?: APIHookOptions) => useQuery(...)
export const useProjects = (options?: APIHookOptions) => useQuery(...)
export const usePhotos = (options?: APIHookOptions) => useQuery(...)
export const useSocialLinks = (options?: APIHookOptions) => useQuery(...)
```

**工具函数系统 (src/lib/utils/)**:

```typescript
// cn.ts - className合并工具
export const cn = (...classes: (string | undefined)[]): string => {
  return clsx(classes.filter(Boolean));
};

// format.ts - 格式化工具
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("zh-CN").format(new Date(date));
};

export const formatReadingTime = (wordCount: number): string => {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} 分钟阅读`;
};

// constants.ts - 常量定义
export const API_ENDPOINTS = {
  BLOG_POSTS: "/blog-posts",
  PROJECTS: "/projects",
  PHOTOS: "/photos",
  SOCIAL_LINKS: "/social-links",
} as const;

export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
```

**API 客户端封装 (src/lib/api/client.ts)**:

```typescript
// API客户端配置
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// 类型安全的API方法
export const api = {
  getBlogPosts: (): Promise<BlogPost[]> =>
    apiClient.get("/blog-posts?populate=*"),
  getProjects: (): Promise<Project[]> => apiClient.get("/projects?populate=*"),
  getPhotos: (): Promise<Photo[]> => apiClient.get("/photos?populate=*"),
  getSocialLinks: (): Promise<SocialLink[]> => apiClient.get("/social-links"),
};
```

**开发工具清单**:

- [ ] useTheme Hook (三模式主题切换 + 持久化)
- [ ] useScroll Hook (滚动检测 + section 定位)
- [ ] useAPI Hooks (8 个内容类型的数据获取)
- [ ] cn 工具函数 (className 合并优化)
- [ ] 格式化工具函数 (日期、时间、数字)
- [ ] API 客户端封装 (类型安全 + 错误处理)

### 任务 3: 主页布局实现 (优先级: 高)

#### 3.1 根布局配置实现

**根布局组件架构 (app/layout.tsx)**:

```typescript
// layout.tsx - 根布局实现
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Li Xiang - Full Stack Developer",
    template: "%s | Li Xiang",
  },
  description:
    "Personal website showcasing projects, photography, and technical insights",
  keywords: [
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Photography",
  ],
  authors: [{ name: "Li Xiang" }],
  creator: "Li Xiang",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    title: "Li Xiang - Full Stack Developer",
    description:
      "Personal website showcasing projects, photography, and technical insights",
    siteName: "Li Xiang",
  },
  twitter: {
    card: "summary_large_image",
    title: "Li Xiang - Full Stack Developer",
    description:
      "Personal website showcasing projects, photography, and technical insights",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-light-background-primary dark:bg-dark-background-primary">
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**全局样式配置 (src/styles/globals.css)**:

```css
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

/* 可变字体加载 */
@font-face {
  font-family: "SourceHanSans-VF";
  src: url("/fonts/SourceHanSans-VF.woff2") format("woff2-variations");
  font-weight: 200 900;
  font-stretch: 75% 125%;
  font-display: swap;
  unicode-range: U+4E00-9FFF, U+3400-4DBF, U+20000-2A6DF, U+2A700-2B73F,
    U+2B740-2B81F, U+2B820-2CEAF, U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC,
    U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
    U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: "SourceHanSerif-VF";
  src: url("/fonts/SourceHanSerif-VF.woff2") format("woff2-variations");
  font-weight: 200 900;
  font-display: swap;
  unicode-range: U+4E00-9FFF, U+3400-4DBF, U+20000-2A6DF, U+2A700-2B73F,
    U+2B740-2B81F, U+2B820-2CEAF, U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC,
    U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
    U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: "AlimamaFangYuanTiVF";
  src: url("/fonts/AlimamaFangYuanTiVF.woff2") format("woff2-variations");
  font-weight: 200 900;
  font-display: swap;
  unicode-range: U+4E00-9FFF, U+3400-4DBF, U+0000-00FF, U+0131, U+0152-0153,
    U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
    U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* CSS变量定义 */
:root {
  /* 字体栈 */
  --font-sans: "SourceHanSans-VF", "PingFang SC", system-ui, sans-serif;
  --font-serif: "SourceHanSerif-VF", "PingFang SC", serif;
  --font-playful: "AlimamaFangYuanTiVF", "SourceHanSans-VF", sans-serif;
  --font-variable: "SourceHanSans-VF", "Inter-Variable", system-ui, sans-serif;

  /* 光标样式 */
  --cursor-default: default;
  --cursor-pointer: pointer;

  /* 动画缓动 */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-md: cubic-bezier(0.4, 0, 0.2, 1); /* Material Design标准 */
}

/* 基础样式重置 */
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
}

body {
  font-family: var(--font-sans);
  font-optical-sizing: auto;
  font-variation-settings: "wght" 400, "wdth" 100;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* 可变字体工具类 */
.font-variable {
  font-family: var(--font-variable);
  font-variation-settings: "wght" var(--font-weight, 400), "wdth" var(--font-width, 100);
}

.font-playful {
  font-family: var(--font-playful);
  font-variation-settings: "wght" var(--font-weight, 400);
}

/* 滚动容器样式 */
.scroll-container {
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

/* Section滚动锚点 */
.scroll-section {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

/* 毛玻璃效果 */
.glass-effect {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .glass-effect {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
}

/* 噪点纹理 */
.noise-texture::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9zdmc+");
  background-size: 200px 200px;
  pointer-events: none;
  z-index: -1;
}

/* 动画性能优化 */
.will-change-transform {
  will-change: transform;
}

.will-change-contents {
  will-change: contents;
}

.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
}

/* 可变字体性能优化 */
.font-variation-optimized {
  font-variation-settings: "wght" var(--font-weight, 400), "wdth" var(--font-width, 100);
  transition: font-variation-settings 0.3s var(--ease-md);
}

/* 减弱动画支持 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .font-variation-optimized {
    transition: none !important;
  }
}
```

**Provider 组件实现**:

```typescript
// src/components/providers/ThemeProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "auto";
type EffectiveTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: EffectiveTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("auto");
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>("light");

  useEffect(() => {
    // 主题初始化和系统监听逻辑
    const stored = localStorage.getItem("theme") as Theme;
    if (stored) setTheme(stored);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "auto") {
        setEffectiveTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    handleChange();

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      <div className={effectiveTheme}>{children}</div>
    </ThemeContext.Provider>
  );
}

// src/components/providers/QueryProvider.tsx
("use client");

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1分钟
            cacheTime: 5 * 60 * 1000, // 5分钟
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

**根布局开发清单**:

- [ ] 根布局组件实现 (metadata + providers)
- [ ] 全局样式配置 (CSS 变量 + 基础样式)
- [ ] Inter 字体变量配置 (性能优化)
- [ ] ThemeProvider 实现 (三模式主题)
- [ ] QueryProvider 配置 (缓存策略)
- [ ] SEO 和元数据配置完整

#### 3.2 主页框架实现

**主页容器架构 (app/(home)/page.tsx)**:

```typescript
// page.tsx - 主页实现
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FloatingNavigation } from "@/components/layouts/FloatingNavigation";
import { ThemeControls } from "@/components/layouts/ThemeControls";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { PhotoSection } from "@/components/sections/PhotoSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { MusicSection } from "@/components/sections/MusicSection";
import { MoviesSection } from "@/components/sections/MoviesSection";
import { MediaSection } from "@/components/sections/MediaSection";
import { LinksSection } from "@/components/sections/LinksSection";
import { ContactSection } from "@/components/sections/ContactSection";

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP ScrollTrigger 初始化
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // 滚动进度处理
        const progress = self.progress;
        // 更新导航状态
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main
      ref={containerRef}
      className="relative h-screen overflow-y-scroll scroll-container"
    >
      {/* 分段内容 */}
      <HeroSection id="hero" />
      <AboutSection id="about" />
      <ProjectsSection id="projects" />
      <PhotoSection id="photography" />
      <BlogSection id="blog" />
      <MusicSection id="music" />
      <MoviesSection id="movies" />
      <MediaSection id="media" />
      <LinksSection id="links" />
      <ContactSection id="contact" />

      {/* 浮动导航 */}
      <FloatingNavigation />

      {/* 主题控制 */}
      <ThemeControls />
    </main>
  );
}
```

**SectionWrapper 通用组件**:

```typescript
// src/components/layouts/SectionWrapper.tsx
interface SectionWrapperProps {
  id: string;
  className?: string;
  children: React.ReactNode;
  backgroundVariant?: "gradient" | "solid" | "transparent";
}

export function SectionWrapper({
  id,
  className,
  children,
  backgroundVariant = "transparent",
}: SectionWrapperProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // GSAP进入动画
    gsap.fromTo(
      section.children,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  const backgroundClasses = {
    gradient:
      "bg-gradient-to-br from-light-background-primary to-light-background-secondary dark:from-dark-background-primary dark:to-dark-background-secondary",
    solid: "bg-light-background-primary dark:bg-dark-background-primary",
    transparent: "bg-transparent",
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "min-h-screen flex items-center justify-center scroll-section relative",
        backgroundClasses[backgroundVariant],
        "noise-texture",
        className
      )}
    >
      <div className="container mx-auto px-4 py-16">{children}</div>
    </section>
  );
}
```

**主页框架开发清单**:

- [ ] 主页容器实现 (GSAP + ScrollTrigger 集成)
- [ ] SectionWrapper 通用组件 (动画 + 背景 variants)
- [ ] 10 个 Section 组件基础框架
- [ ] 滚动容器 CSS 配置 (snap-scroll + 性能优化)
- [ ] GSAP 插件注册和清理逻辑

#### 3.3 HeroSection 核心实现

**HeroSection 组件架构**:

```typescript
// src/components/sections/HeroSection.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { SectionWrapper } from "@/components/layouts/SectionWrapper";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { ChevronDown, Github, Mail } from "lucide-react";

gsap.registerPlugin(TextPlugin);

interface HeroSectionProps {
  id: string;
}

export function HeroSection({ id }: HeroSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    // 标题打字机效果
    tl.fromTo(
      titleRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        text: {
          value: "Hi, I'm Li Xiang",
          delimiter: "",
        },
        ease: "none",
      }
    )
      // 副标题淡入
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.3"
      )
      // CTA按钮
      .fromTo(
        ctaRef.current?.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      )
      // 滚动指示器
      .fromTo(
        scrollIndicatorRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.2"
      );

    // 滚动指示器脉冲动画
    gsap.to(scrollIndicatorRef.current, {
      y: 10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    return () => {
      tl.kill();
    };
  }, []);

  const handleScrollToNext = () => {
    const nextSection = document.getElementById("about");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <SectionWrapper id={id} backgroundVariant="gradient">
      <div className="text-center max-w-4xl mx-auto">
        {/* 主标题 */}
        <Typography
          ref={titleRef}
          variant="h1"
          className="mb-6 text-light-text-primary dark:text-dark-text-primary"
        >
          {/* 打字机效果会填充文本 */}
        </Typography>

        {/* 副标题 */}
        <Typography
          ref={subtitleRef}
          variant="body"
          className="text-xl md:text-2xl mb-12 text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto"
        >
          Full Stack Developer | Photography Enthusiast | Tech Explorer
        </Typography>

        {/* CTA按钮组 */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Github className="w-5 h-5" />}
            onClick={() => window.open("https://github.com", "_blank")}
          >
            View My Work
          </Button>
          <Button
            variant="glass"
            size="lg"
            leftIcon={<Mail className="w-5 h-5" />}
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get In Touch
          </Button>
        </div>

        {/* 滚动指示器 */}
        <div
          ref={scrollIndicatorRef}
          className="cursor-pointer"
          onClick={handleScrollToNext}
        >
          <div className="flex flex-col items-center text-light-text-muted dark:text-dark-text-muted">
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
```

**HeroSection 开发清单**:

- [ ] HeroSection 组件实现 (打字机效果 + 渐进动画)
- [ ] GSAP Timeline 动画序列 (stagger + easing)
- [ ] 响应式布局和文字大小适配
- [ ] CTA 按钮交互 (外链 + 内部导航)
- [ ] 滚动指示器动画 (脉冲 + 点击滚动)
- [ ] 可访问性支持 (键盘导航 + aria 标签)

### 任务 4: 导航和主题系统实现 (优先级: 中)

#### 4.1 FloatingNavigation 滑动导航组件完整实现

**滑动导航组件架构 (src/components/layouts/FloatingNavigation/)**:

```typescript
// FloatingNavigation.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  User,
  Code,
  Camera,
  PenTool,
  Music,
  Film,
  Link,
  Mail,
  Folder,
} from "lucide-react";
import { useScroll } from "@/lib/hooks/useScroll";
import { usePerformanceMonitor } from "@/lib/hooks/usePerformanceMonitor";
import { cn } from "@/lib/utils/cn";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  sectionId: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: "hero",
    label: "Home",
    icon: <Home className="w-4 h-4" />,
    sectionId: "hero",
  },
  {
    id: "about",
    label: "About",
    icon: <User className="w-4 h-4" />,
    sectionId: "about",
  },
  {
    id: "projects",
    label: "Projects",
    icon: <Code className="w-4 h-4" />,
    sectionId: "projects",
  },
  {
    id: "photography",
    label: "Photos",
    icon: <Camera className="w-4 h-4" />,
    sectionId: "photography",
  },
  {
    id: "blog",
    label: "Blog",
    icon: <PenTool className="w-4 h-4" />,
    sectionId: "blog",
  },
  {
    id: "music",
    label: "Music",
    icon: <Music className="w-4 h-4" />,
    sectionId: "music",
  },
  {
    id: "movies",
    label: "Movies",
    icon: <Film className="w-4 h-4" />,
    sectionId: "movies",
  },
  {
    id: "media",
    label: "Media",
    icon: <Folder className="w-4 h-4" />,
    sectionId: "media",
  },
  {
    id: "links",
    label: "Links",
    icon: <Link className="w-4 h-4" />,
    sectionId: "links",
  },
  {
    id: "contact",
    label: "Contact",
    icon: <Mail className="w-4 h-4" />,
    sectionId: "contact",
  },
];

// 桌面端显示配置
const DESKTOP_VISIBLE_COUNT = 5;
const DESKTOP_CENTER_INDEX = 2;

export function FloatingNavigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(true);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);

  const { scrollDirection, scrollY } = useScroll({
    throttle: 16,
    threshold: 100,
  });

  const { fps, isLowPerformance } = usePerformanceMonitor({
    threshold: 30,
    sampleSize: 60,
  });

  // 计算当前显示的导航项目范围
  const getVisibleRange = () => {
    const totalItems = navigationItems.length;
    let startIndex = Math.max(0, activeSectionIndex - DESKTOP_CENTER_INDEX);
    let endIndex = Math.min(totalItems, startIndex + DESKTOP_VISIBLE_COUNT);

    // 边界处理：确保显示项目数量一致
    if (endIndex - startIndex < DESKTOP_VISIBLE_COUNT) {
      startIndex = Math.max(0, endIndex - DESKTOP_VISIBLE_COUNT);
    }

    return { startIndex, endIndex };
  };

  // 计算每个导航项的缩放和字重
  const getItemScale = (index: number, centerIndex: number) => {
    const distanceFromCenter = Math.abs(index - centerIndex);
    const maxDistance = DESKTOP_CENTER_INDEX;

    if (distanceFromCenter > maxDistance)
      return { scale: 0.7, fontWeight: 400, fontSize: 14 };

    // 使用余弦函数实现平滑非线性缩放
    const normalizedDistance = distanceFromCenter / maxDistance;
    const scaleMultiplier = Math.cos((normalizedDistance * Math.PI) / 2);

    return {
      scale: 0.7 + 0.3 * scaleMultiplier, // 0.7-1.0
      fontWeight: isLowPerformance
        ? 500
        : Math.round(400 + 300 * scaleMultiplier), // 400-700
      fontSize: 14 + 4 * scaleMultiplier, // 14-18px
      fontWidth: isLowPerformance ? 100 : Math.round(85 + 15 * scaleMultiplier), // 85-100 (可变字宽)
    };
  };

  // 检测当前活跃section
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems
        .map((item) => document.getElementById(item.sectionId))
        .filter(Boolean);

      const currentSection = sections.find((section) => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        );
      });

      if (currentSection) {
        const newActiveIndex = navigationItems.findIndex(
          (item) => item.sectionId === currentSection.id
        );
        if (newActiveIndex !== -1) {
          setActiveSection(currentSection.id);
          setActiveSectionIndex(newActiveIndex);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初始检测

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 导航可见性控制
  useEffect(() => {
    if (scrollY < 100) {
      setIsVisible(true);
    } else {
      setIsVisible(scrollDirection === "up");
    }
  }, [scrollDirection, scrollY]);

  const handleNavClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const { startIndex, endIndex } = getVisibleRange();
  const visibleItems = navigationItems.slice(startIndex, endIndex);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          ref={navRef}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: isLowPerformance ? 0.2 : undefined,
          }}
          className={cn(
            "fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50",
            "max-md:hidden" // 移动端适配待Phase 3.1.5实现
          )}
        >
          <div
            className={cn(
              "glass-effect rounded-full px-4 py-3",
              "flex items-center justify-center gap-1",
              "shadow-lg border border-white/20 dark:border-black/20",
              "will-change-contents" // 性能优化
            )}
          >
            {visibleItems.map((item, localIndex) => {
              const globalIndex = startIndex + localIndex;
              const centerIndex = activeSectionIndex;
              const isActive = item.sectionId === activeSection;
              const { scale, fontWeight, fontSize, fontWidth } = getItemScale(
                globalIndex,
                centerIndex
              );

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.sectionId)}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2 rounded-full",
                    "transition-colors duration-300",
                    "hover:bg-white/10 dark:hover:bg-black/10",
                    "will-change-transform" // 性能优化
                  )}
                  style={{
                    transform: `scale(${scale})`,
                    fontVariationSettings: isLowPerformance
                      ? `"wght" ${fontWeight}`
                      : `"wght" ${fontWeight}, "wdth" ${fontWidth}`,
                    fontSize: `${fontSize}px`,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  whileHover={{ scale: scale * 1.05 }}
                  whileTap={{ scale: scale * 0.95 }}
                  aria-label={`Navigate to ${item.label} section`}
                >
                  {/* 图标 */}
                  <span
                    className={cn(
                      "transition-colors duration-200 flex-shrink-0",
                      isActive
                        ? "text-light-primary dark:text-dark-primary"
                        : "text-light-text-muted dark:text-dark-text-muted"
                    )}
                  >
                    {item.icon}
                  </span>

                  {/* 标签文字 */}
                  <motion.span
                    className={cn(
                      "font-variable whitespace-nowrap transition-colors duration-200",
                      isActive
                        ? "text-light-text-primary dark:text-dark-text-primary"
                        : "text-light-text-secondary dark:text-dark-text-secondary"
                    )}
                    style={{
                      fontVariationSettings: isLowPerformance
                        ? `"wght" ${fontWeight}`
                        : `"wght" ${fontWeight}, "wdth" ${fontWidth}`,
                    }}
                  >
                    {item.label}
                  </motion.span>

                  {/* 活跃指示器 */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-light-primary/10 dark:bg-dark-primary/10 rounded-full -z-10 border border-light-primary/20 dark:border-dark-primary/20"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        duration: isLowPerformance ? 0.1 : undefined,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* 性能监控指示器 (开发环境) */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute -top-8 left-0 text-xs text-light-text-muted">
              FPS: {fps.toFixed(1)}{" "}
              {isLowPerformance && "(Low Performance Mode)"}
            </div>
          )}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
```

**性能监控 Hook 实现 (src/lib/hooks/usePerformanceMonitor.ts)**:

```typescript
"use client";

import { useState, useEffect, useRef } from "react";

interface PerformanceMonitorOptions {
  threshold: number; // 性能阈值 (fps)
  sampleSize: number; // 采样大小
  interval?: number; // 监控间隔 (ms)
}

interface PerformanceData {
  fps: number;
  isLowPerformance: boolean;
  averageFps: number;
  frameDrops: number;
}

export function usePerformanceMonitor({
  threshold = 30,
  sampleSize = 60,
  interval = 1000,
}: PerformanceMonitorOptions): PerformanceData {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    fps: 60,
    isLowPerformance: false,
    averageFps: 60,
    frameDrops: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const measureFPS = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      frameCountRef.current++;

      // 每秒更新一次FPS
      if (delta >= interval) {
        const currentFps = Math.round((frameCountRef.current * 1000) / delta);

        // 更新FPS历史记录
        fpsHistoryRef.current.push(currentFps);
        if (fpsHistoryRef.current.length > sampleSize) {
          fpsHistoryRef.current.shift();
        }

        // 计算平均FPS
        const averageFps =
          fpsHistoryRef.current.reduce((sum, fps) => sum + fps, 0) /
          fpsHistoryRef.current.length;

        // 计算掉帧次数
        const frameDrops = fpsHistoryRef.current.filter(
          (fps) => fps < threshold
        ).length;

        setPerformanceData({
          fps: currentFps,
          isLowPerformance: currentFps < threshold || averageFps < threshold,
          averageFps: Math.round(averageFps),
          frameDrops,
        });

        // 重置计数器
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(measureFPS);
    };

    // 开始监控
    animationFrameRef.current = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [threshold, sampleSize, interval]);

  return performanceData;
}
```

**滑动导航组件开发清单**:

- [ ] FloatingNavigation 滑动导航组件 (10 个 section + 桌面端 5 个可见)
- [ ] 可变字体缩放系统 (字重 400-700 + 字宽 85-100 + 尺寸 14-18px)
- [ ] 余弦函数非线性缩放算法 (平滑过渡效果)
- [ ] 边界处理逻辑 (第 1 个和第 10 个 section 的留空处理)
- [ ] 性能监控集成 (30fps 阈值 + 低性能模式简化)
- [ ] Material Design 缓动函数 (cubic-bezier(0.4, 0, 0.2, 1))
- [ ] 活跃 section 自动居中 (滚动跟随 + 导航栏滑动)
- [ ] 开发环境性能指示器 (FPS 显示 + 低性能警告)
- [ ] 移动端适配标记 Phase 3.1.5 (3 个可见项 + 响应式布局)

#### 4.2 ThemeControls 主题系统实现

**主题控制组件架构 (src/components/layouts/ThemeControls/)**:

```typescript
// ThemeControls.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/lib/hooks/useTheme";
import { cn } from "@/lib/utils/cn";

type ThemeMode = "light" | "dark" | "auto";

interface ThemeOption {
  mode: ThemeMode;
  icon: React.ReactNode;
  label: string;
}

const themeOptions: ThemeOption[] = [
  { mode: "light", icon: <Sun className="w-4 h-4" />, label: "Light" },
  { mode: "dark", icon: <Moon className="w-4 h-4" />, label: "Dark" },
  { mode: "auto", icon: <Monitor className="w-4 h-4" />, label: "Auto" },
];

export function ThemeControls() {
  const { theme, setTheme } = useTheme();
  const [mouseDistance, setMouseDistance] = useState(1000);
  const [isHovered, setIsHovered] = useState(false);

  // 鼠标距离检测
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const controlsElement = document.getElementById("theme-controls");
      if (!controlsElement) return;

      const rect = controlsElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );

      setMouseDistance(distance);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 距离响应透明度
  const getOpacity = () => {
    if (isHovered) return 1;
    const maxDistance = 200;
    const minOpacity = 0.6;
    const opacity = Math.max(
      minOpacity,
      1 - (mouseDistance / maxDistance) * (1 - minOpacity)
    );
    return opacity;
  };

  // 距离响应缩放
  const getScale = () => {
    if (isHovered) return 1;
    const maxDistance = 200;
    const minScale = 0.95;
    const scale = Math.max(
      minScale,
      1 - (mouseDistance / maxDistance) * (1 - minScale)
    );
    return scale;
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
  };

  const currentIndex = themeOptions.findIndex(
    (option) => option.mode === theme
  );

  return (
    <motion.div
      id="theme-controls"
      className={cn(
        "fixed bottom-8 left-8 z-40",
        "max-md:top-4 max-md:right-4 max-md:bottom-auto max-md:left-auto"
      )}
      style={{
        opacity: getOpacity(),
        scale: getScale(),
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3 }}
    >
      <div
        className={cn(
          "glass-effect rounded-full p-1",
          "flex items-center",
          "shadow-lg border border-white/20 dark:border-black/20",
          "w-32 h-10 relative"
        )}
      >
        {/* 滑块背景 */}
        <motion.div
          className="absolute bg-light-primary dark:bg-dark-primary rounded-full h-8 w-8"
          initial={false}
          animate={{
            x: currentIndex * 32 + 4, // 每个选项宽度32px + 间距4px
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />

        {/* 主题选项 */}
        {themeOptions.map((option, index) => (
          <motion.button
            key={option.mode}
            onClick={() => handleThemeChange(option.mode)}
            className={cn(
              "relative z-10 flex items-center justify-center",
              "w-8 h-8 rounded-full transition-colors duration-200",
              "hover:bg-white/10 dark:hover:bg-black/10",
              theme === option.mode
                ? "text-white"
                : "text-light-text-secondary dark:text-dark-text-secondary"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Switch to ${option.label} theme`}
          >
            {option.icon}
          </motion.button>
        ))}
      </div>

      {/* 主题标签提示 */}
      <motion.div
        className={cn(
          "absolute -top-12 left-1/2 transform -translate-x-1/2",
          "bg-light-background-tertiary dark:bg-dark-background-tertiary",
          "text-light-text-primary dark:text-dark-text-primary",
          "px-3 py-1 rounded-md text-sm font-medium",
          "border border-light-border dark:border-dark-border",
          "pointer-events-none"
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 10,
        }}
        transition={{ duration: 0.2 }}
      >
        {themeOptions.find((option) => option.mode === theme)?.label}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-light-background-tertiary dark:border-t-dark-background-tertiary" />
      </motion.div>
    </motion.div>
  );
}
```

**useTheme Hook 完整实现 (src/lib/hooks/useTheme.ts)**:

```typescript
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type ThemeMode = "light" | "dark" | "auto";
type EffectiveTheme = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  effectiveTheme: EffectiveTheme;
  setTheme: (theme: ThemeMode) => void;
  isSystemMode: boolean;
  systemPreference: EffectiveTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>("auto");
  const [systemPreference, setSystemPreference] =
    useState<EffectiveTheme>("light");
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>("light");

  // 系统主题检测
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateSystemPreference = () => {
      const isDark = mediaQuery.matches;
      setSystemPreference(isDark ? "dark" : "light");
    };

    updateSystemPreference();
    mediaQuery.addEventListener("change", updateSystemPreference);

    return () =>
      mediaQuery.removeEventListener("change", updateSystemPreference);
  }, []);

  // 主题初始化
  useEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeMode;
    if (stored && ["light", "dark", "auto"].includes(stored)) {
      setThemeState(stored);
    }
  }, []);

  // 有效主题计算
  useEffect(() => {
    let newEffectiveTheme: EffectiveTheme;

    if (theme === "auto") {
      newEffectiveTheme = systemPreference;
    } else {
      newEffectiveTheme = theme as EffectiveTheme;
    }

    setEffectiveTheme(newEffectiveTheme);

    // 更新DOM类名
    if (newEffectiveTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // 更新meta标签
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute(
        "content",
        newEffectiveTheme === "dark" ? "#0F1419" : "#FFFFFF"
      );
    }
  }, [theme, systemPreference]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const value: ThemeContextType = {
    theme,
    effectiveTheme,
    setTheme,
    isSystemMode: theme === "auto",
    systemPreference,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
```

**主题系统开发清单**:

- [ ] ThemeControls 组件 (胶囊滑块 + 鼠标距离响应)
- [ ] useTheme Hook 完整实现 (三模式 + 系统检测)
- [ ] 主题状态持久化 (localStorage + DOM 同步)
- [ ] 距离响应动画 (透明度 + 缩放效果)
- [ ] 主题切换动画 (滑块移动 + 平滑过渡)
- [ ] 可访问性支持 (aria-label + 键盘导航)

#### 4.3 状态管理和性能优化

**滚动检测 Hook 优化 (src/lib/hooks/useScroll.ts)**:

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";

interface ScrollState {
  scrollY: number;
  scrollDirection: "up" | "down";
  activeSection: string;
  isScrolling: boolean;
}

interface UseScrollOptions {
  throttle?: number;
  threshold?: number;
  sections?: string[];
}

export function useScroll(options: UseScrollOptions = {}): ScrollState {
  const { throttle = 16, threshold = 50, sections = [] } = options;

  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    scrollDirection: "down",
    activeSection: "",
    isScrolling: false,
  });

  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // 清除之前的timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // 设置滚动状态
    setScrollState((prev) => ({
      ...prev,
      scrollY: currentScrollY,
      scrollDirection: currentScrollY > lastScrollY ? "down" : "up",
      isScrolling: true,
    }));

    // 滚动结束检测
    const newTimeout = setTimeout(() => {
      setScrollState((prev) => ({
        ...prev,
        isScrolling: false,
      }));
    }, 150);

    setScrollTimeout(newTimeout);
    setLastScrollY(currentScrollY);
  }, [lastScrollY, scrollTimeout]);

  // 节流处理
  useEffect(() => {
    let ticking = false;

    const throttledHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandler, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledHandler);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [handleScroll, scrollTimeout]);

  return scrollState;
}
```

**导航交互系统开发清单**:

- [ ] useScroll Hook 优化 (节流 + RAF + 被动监听)
- [ ] Section 活跃检测 (Intersection Observer)
- [ ] 平滑滚动实现 (polyfill 兼容)
- [ ] 键盘导航支持 (Tab 键 + 方向键)
- [ ] 移动端手势支持 (触摸滑动)
- [ ] 性能监控 (滚动事件频率控制)

### 任务 5: 状态管理配置 (优先级: 中)

#### 5.1 Zustand 状态管理实现

**导航状态管理 (src/stores/navigationStore.ts)**:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NavigationState {
  activeSection: string;
  isFloatingNavVisible: boolean;
  navItems: NavigationItem[];
  setActiveSection: (section: string) => void;
  toggleNavVisibility: (visible?: boolean) => void;
  updateNavVisibility: (
    scrollY: number,
    scrollDirection: "up" | "down"
  ) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  sectionId: string;
  isVisible: boolean;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      activeSection: "hero",
      isFloatingNavVisible: true,
      navItems: [
        { id: "hero", label: "Home", sectionId: "hero", isVisible: true },
        { id: "about", label: "About", sectionId: "about", isVisible: true },
        {
          id: "projects",
          label: "Projects",
          sectionId: "projects",
          isVisible: true,
        },
        {
          id: "photography",
          label: "Photos",
          sectionId: "photography",
          isVisible: true,
        },
        { id: "blog", label: "Blog", sectionId: "blog", isVisible: true },
        {
          id: "contact",
          label: "Contact",
          sectionId: "contact",
          isVisible: true,
        },
      ],

      setActiveSection: (section: string) => {
        set({ activeSection: section });
      },

      toggleNavVisibility: (visible?: boolean) => {
        set((state) => ({
          isFloatingNavVisible:
            visible !== undefined ? visible : !state.isFloatingNavVisible,
        }));
      },

      updateNavVisibility: (
        scrollY: number,
        scrollDirection: "up" | "down"
      ) => {
        const shouldShow = scrollY < 100 || scrollDirection === "up";
        set({ isFloatingNavVisible: shouldShow });
      },
    }),
    {
      name: "navigation-storage",
      partialize: (state) => ({
        activeSection: state.activeSection,
        navItems: state.navItems,
      }),
    }
  )
);
```

**应用状态管理 (src/stores/appStore.ts)**:

```typescript
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AppState {
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  deviceType: "mobile" | "tablet" | "desktop";

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  setDeviceType: (type: "mobile" | "tablet" | "desktop") => void;
  reset: () => void;
}

const initialState = {
  isLoading: false,
  error: null,
  isInitialized: false,
  deviceType: "desktop" as const,
};

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      ...initialState,

      setLoading: (loading: boolean) => {
        set({ isLoading: loading }, false, "setLoading");
      },

      setError: (error: string | null) => {
        set({ error }, false, "setError");
      },

      setInitialized: (initialized: boolean) => {
        set({ isInitialized: initialized }, false, "setInitialized");
      },

      setDeviceType: (deviceType: "mobile" | "tablet" | "desktop") => {
        set({ deviceType }, false, "setDeviceType");
      },

      reset: () => {
        set(initialState, false, "reset");
      },
    }),
    { name: "app-store" }
  )
);
```

**状态管理开发清单**:

- [ ] navigationStore 实现 (活跃 section + 可见性控制)
- [ ] appStore 实现 (全局状态 + 设备检测)
- [ ] 状态持久化配置 (部分状态 localStorage)
- [ ] DevTools 集成 (开发环境调试)
- [ ] 状态类型定义完整 (TypeScript 严格模式)

#### 5.2 React Query 数据管理

**QueryClient 配置优化 (src/lib/query/queryClient.ts)**:

```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 缓存配置
      staleTime: 5 * 60 * 1000, // 5分钟
      cacheTime: 10 * 60 * 1000, // 10分钟

      // 重试配置
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // 性能配置
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,

      // 错误处理
      useErrorBoundary: (error: any) => error?.status >= 500,
    },
    mutations: {
      retry: 1,
      useErrorBoundary: true,
    },
  },
});

// 查询键工厂
export const queryKeys = {
  all: ["api"] as const,

  blogPosts: () => [...queryKeys.all, "blog-posts"] as const,
  blogPost: (slug: string) => [...queryKeys.blogPosts(), slug] as const,

  projects: () => [...queryKeys.all, "projects"] as const,
  project: (slug: string) => [...queryKeys.projects(), slug] as const,

  photos: () => [...queryKeys.all, "photos"] as const,
  photoAlbums: () => [...queryKeys.all, "photo-albums"] as const,

  socialLinks: () => [...queryKeys.all, "social-links"] as const,
  albums: () => [...queryKeys.all, "albums"] as const,
  mediaWorks: () => [...queryKeys.all, "media-works"] as const,
};
```

**API 数据 Hook 系统 (src/lib/hooks/useAPIData.ts)**:

```typescript
"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/queryClient";
import type {
  BlogPost,
  Project,
  Photo,
  PhotoAlbum,
  SocialLink,
  Album,
  MediaWork,
} from "@/types/api";

// 通用查询配置
interface APIQueryOptions<T>
  extends Omit<UseQueryOptions<T>, "queryKey" | "queryFn"> {
  enabled?: boolean;
}

// 博客文章相关
export const useBlogPosts = (options?: APIQueryOptions<BlogPost[]>) => {
  return useQuery({
    queryKey: queryKeys.blogPosts(),
    queryFn: api.getBlogPosts,
    ...options,
  });
};

export const useBlogPost = (
  slug: string,
  options?: APIQueryOptions<BlogPost>
) => {
  return useQuery({
    queryKey: queryKeys.blogPost(slug),
    queryFn: () => api.getBlogPost(slug),
    enabled: !!slug && options?.enabled !== false,
    ...options,
  });
};

// 项目相关
export const useProjects = (options?: APIQueryOptions<Project[]>) => {
  return useQuery({
    queryKey: queryKeys.projects(),
    queryFn: api.getProjects,
    ...options,
  });
};

export const useProject = (
  slug: string,
  options?: APIQueryOptions<Project>
) => {
  return useQuery({
    queryKey: queryKeys.project(slug),
    queryFn: () => api.getProject(slug),
    enabled: !!slug && options?.enabled !== false,
    ...options,
  });
};

// 摄影相关
export const usePhotos = (options?: APIQueryOptions<Photo[]>) => {
  return useQuery({
    queryKey: queryKeys.photos(),
    queryFn: api.getPhotos,
    ...options,
  });
};

export const usePhotoAlbums = (options?: APIQueryOptions<PhotoAlbum[]>) => {
  return useQuery({
    queryKey: queryKeys.photoAlbums(),
    queryFn: api.getPhotoAlbums,
    ...options,
  });
};

// 社交链接
export const useSocialLinks = (options?: APIQueryOptions<SocialLink[]>) => {
  return useQuery({
    queryKey: queryKeys.socialLinks(),
    queryFn: api.getSocialLinks,
    staleTime: 10 * 60 * 1000, // 社交链接更新频率低，延长缓存
    ...options,
  });
};

// 音乐专辑
export const useAlbums = (options?: APIQueryOptions<Album[]>) => {
  return useQuery({
    queryKey: queryKeys.albums(),
    queryFn: api.getAlbums,
    ...options,
  });
};

// 影视作品
export const useMediaWorks = (options?: APIQueryOptions<MediaWork[]>) => {
  return useQuery({
    queryKey: queryKeys.mediaWorks(),
    queryFn: api.getMediaWorks,
    ...options,
  });
};

// 组合数据Hook - 主页数据预加载
export const useHomePageData = () => {
  const blogPosts = useBlogPosts({
    staleTime: 2 * 60 * 1000, // 主页显示的博客数据缓存时间短一些
  });
  const projects = useProjects();
  const photos = usePhotos();
  const socialLinks = useSocialLinks();

  return {
    blogPosts,
    projects,
    photos,
    socialLinks,
    isLoading:
      blogPosts.isLoading ||
      projects.isLoading ||
      photos.isLoading ||
      socialLinks.isLoading,
    error:
      blogPosts.error || projects.error || photos.error || socialLinks.error,
    isSuccess:
      blogPosts.isSuccess &&
      projects.isSuccess &&
      photos.isSuccess &&
      socialLinks.isSuccess,
  };
};
```

**React Query 开发清单**:

- [ ] QueryClient 高级配置 (缓存策略 + 重试逻辑)
- [ ] 查询键工厂 (类型安全 + 一致性)
- [ ] API 数据 Hook 系统 (8 个内容类型覆盖)
- [ ] 错误处理策略 (Error Boundary 集成)
- [ ] 性能优化配置 (预加载 + 后台更新)
- [ ] 开发工具集成 (React Query DevTools)

## 🧪 开发测试策略

### 本地开发验证清单

**项目启动和基础验证**:

```bash
# 开发服务器启动
npm run dev

# 生产构建测试
npm run build && npm run start

# 代码质量检查
npm run lint
npm run type-check # 如果有的话
```

**核心功能验证清单**:

- [ ] 页面能正常访问 (http://localhost:3000)
- [ ] TypeScript 编译无错误和警告
- [ ] Tailwind CSS 样式正常渲染
- [ ] 浮动导航显示和所有交互正常
- [ ] 主题切换功能完整 (Light/Dark/Auto 三模式)
- [ ] 系统主题跟随功能验证
- [ ] 所有 section 滚动锚点正常工作
- [ ] GSAP 动画效果流畅播放
- [ ] 响应式布局在所有断点正常

**API 集成验证**:

- [ ] 所有 8 个 API 端点数据正常获取
- [ ] 图片资源正常显示 (172.96.193.211:1337)
- [ ] API 错误处理正常工作
- [ ] React Query 缓存策略生效
- [ ] 加载状态和错误状态显示正常

### 组件功能测试清单

**UI 基础组件测试**:

- [ ] Button 组件 - 4 个 variants + 3 个 sizes + loading state
- [ ] Typography 组件 - 9 个 variants + 响应式 sizing
- [ ] Card 组件 - 4 个 variants + hover effects
- [ ] 主题切换时所有组件样式正确适配

**布局组件测试**:

- [ ] FloatingNavigation - section 检测 + 高亮指示
- [ ] ThemeControls - 鼠标距离响应 + 滑块动画
- [ ] SectionWrapper - GSAP 进入动画触发
- [ ] HeroSection - 打字机效果 + CTA 按钮交互

**Hook 系统测试**:

- [ ] useTheme - 三模式切换 + localStorage 持久化
- [ ] useScroll - 滚动检测 + 节流优化
- [ ] useAPI Hooks - 数据获取 + 错误处理
- [ ] Zustand stores - 状态管理 + 持久化

### 响应式和跨设备测试

**断点适配验证**:

```typescript
// 测试断点
const breakpoints = {
  xs: "320px", // iPhone SE
  sm: "640px", // 大手机
  md: "768px", // 平板竖屏
  lg: "1024px", // 平板横屏/小桌面
  xl: "1280px", // 标准桌面
  "2xl": "1536px", // 大屏桌面
};
```

**设备类型测试清单**:

- [ ] 移动端 (320px-767px) - 导航栏全宽 + 主题控制右上角
- [ ] 平板端 (768px-1023px) - 中等尺寸组件适配
- [ ] 桌面端 (1024px-1279px) - 标准布局效果
- [ ] 大屏 (1280px+) - 内容居中 + 最大宽度限制

**浏览器兼容性**:

- [ ] Chrome 最新版
- [ ] Firefox 最新版
- [ ] Safari 最新版 (包括 iOS)
- [ ] Edge 最新版

### 性能测试基准

**Core Web Vitals 目标**:

```typescript
const performanceTargets = {
  FCP: "< 1.5s", // First Contentful Paint
  LCP: "< 2.5s", // Largest Contentful Paint
  FID: "< 100ms", // First Input Delay
  CLS: "< 0.1", // Cumulative Layout Shift
  INP: "< 200ms", // Interaction to Next Paint
};
```

**测试工具和指标**:

- [ ] Lighthouse 性能评分 > 90 分
- [ ] Lighthouse 可访问性评分 > 95 分
- [ ] Lighthouse 最佳实践评分 > 90 分
- [ ] Lighthouse SEO 评分 > 95 分
- [ ] 可变字体加载和渲染性能正常 (无 FOUT/FOIT)
- [ ] 滑动导航缩放动画流畅 (60fps 桌面端)
- [ ] 性能监控系统工作正常 (正确检测低性能环境)
- [ ] 无浏览器控制台错误或警告

## 📊 Phase 3.1 完成标准

### 功能完整性验收标准

**核心架构完成度**:

- [ ] Next.js 15 项目成功创建并运行
- [ ] TypeScript 5+ 配置完整无错误
- [ ] Tailwind CSS 4.1.11 主题系统完整实现
- [ ] App Router 结构正确配置
- [ ] 环境变量和配置文件全部设置

**组件系统完成度**:

- [ ] 6 个 UI 基础组件完整实现 (Button, Typography, Card, Input, Badge, Avatar)
- [ ] 4 个布局组件完整实现 (Header, Footer, PageWrapper, SectionWrapper)
- [ ] 滑动导航组件功能完整 (10 个 section + 桌面端 5 个可见 + 可变字体缩放)
- [ ] 主题控制系统完整 (三模式 + 距离响应 + 持久化)
- [ ] 性能监控系统完整 (30fps 阈值 + 低性能模式自动降级)

**主页框架完成度**:

- [ ] 根布局配置完整 (metadata + providers + 全局样式)
- [ ] 主页分段滚动框架正常工作
- [ ] HeroSection 完整实现 (打字机效果 + 动画序列)
- [ ] 10 个 Section 基础框架创建
- [ ] GSAP + ScrollTrigger 集成正常

**状态管理完成度**:

- [ ] Zustand stores 配置完整 (navigation + app 状态)
- [ ] React Query 配置完整 (缓存策略 + 错误处理)
- [ ] 8 个 API 数据 Hook 正常工作
- [ ] 主题和导航状态持久化正常

### 代码质量验收标准

**TypeScript 标准**:

- [ ] 类型覆盖率 > 95% (严格模式)
- [ ] 所有组件 props 接口完整定义 (包含滑动导航和性能监控类型)
- [ ] API 响应类型完整映射
- [ ] 可变字体相关类型定义完整
- [ ] 性能监控接口类型安全
- [ ] 无 any 类型使用 (除非必要)
- [ ] 泛型和工具类型正确使用

**代码组织标准**:

- [ ] 文件组织结构符合 Atomic Design 原则
- [ ] 命名规范一致性 (camelCase + PascalCase)
- [ ] 导入导出规范统一
- [ ] 注释覆盖关键逻辑和复杂算法
- [ ] ESLint 规则检查 100%通过

**性能标准验收**:

- [ ] 首屏加载时间 < 1.5 秒 (本地开发环境)
- [ ] 页面交互响应 < 100ms
- [ ] 滚动性能流畅 (60fps)
- [ ] 内存使用稳定 (无明显泄漏)
- [ ] 动画帧率稳定 > 55fps

### 用户体验验收标准

**交互体验**:

- [ ] 所有交互元素提供视觉反馈
- [ ] 悬停和点击状态明确
- [ ] 动画过渡自然流畅
- [ ] 加载状态友好提示
- [ ] 错误状态清晰展示

**可访问性标准**:

- [ ] 键盘导航完整支持
- [ ] 屏幕阅读器友好 (aria 标签)
- [ ] 颜色对比度符合 WCAG 标准
- [ ] 焦点指示器清晰可见
- [ ] 减弱动画选项支持

**响应式体验**:

- [ ] 移动端触摸交互友好
- [ ] 平板端布局合理适配
- [ ] 桌面端充分利用空间
- [ ] 跨设备体验一致性

## 🔄 与 Phase 3.2 衔接准备

### 技术债务清理

- [ ] 临时注释和 TODO 清理
- [ ] 未使用导入和变量清理
- [ ] 代码重复提取为共用组件
- [ ] 性能优化点记录和计划

### 文档输出要求

- [ ] 组件使用文档 (Storybook 或 README)
- [ ] API 集成说明文档
- [ ] 环境配置指南
- [ ] 常见问题解答

### Phase 3.2 交接清单

- [ ] 完整的项目结构和组件库
- [ ] 所有核心功能测试通过
- [ ] 性能基线确定
- [ ] 下一阶段开发计划明确

---

**Phase 3.1 验收完成条件**: 上述所有验收标准 100%达成，无阻塞性问题，为 Phase 3.2 (内容展示 section 开发) 提供坚实基础。

## 🔄 与后端集成准备

### API 集成配置

```typescript
// API客户端配置
interface APIConfig {
  baseURL: "http://172.96.193.211:1337/api";
  endpoints: {
    "social-links": "/social-links";
    "blog-posts": "/blog-posts?populate=tags";
    photos: "/photos?populate=albums";
    projects: "/projects";
    albums: "/albums";
    "media-works": "/media-works";
  };
  headers: {
    "Content-Type": "application/json";
  };
}
```

### 数据类型定义

- [ ] 根据 Strapi API 响应定义 TypeScript 接口
- [ ] 图片 URL 处理工具函数
- [ ] API 错误处理类型
- [ ] 分页数据类型

## 🚀 下一阶段准备

### Phase 3.2 准备工作

- [ ] 完整的组件库文档
- [ ] API 集成测试通过
- [ ] 动画效果实现方案
- [ ] 性能优化基线确定

### 交接清单

- [ ] 项目结构文档完整
- [ ] 组件使用说明
- [ ] 开发环境配置指南
- [ ] 调试工具配置

## 📝 会话记录模板

### 任务进度记录

```markdown
日期: [YYYY-MM-DD]
任务: [具体任务名称]
状态: [未开始/进行中/已完成/遇到问题]
详情: [具体完成内容或遇到的问题]
下一步: [下一步行动计划]
```

### 技术决策记录

```markdown
决策: [技术选择]
原因: [选择理由]
替代方案: [其他选项]
影响: [对项目的影响]
```

## 📞 协作信息

### Claude Code 协作要点

- **当前 Phase**: 3.1 - 项目结构和布局架构
- **关键里程碑**: Next.js 项目创建，基础组件完成，主页框架实现
- **技术重点**: App Router 架构，TypeScript 配置，Tailwind 样式系统
- **质量要求**: 响应式设计，类型安全，性能优化

### 开发环境要求

- **Node.js**: v22.17.1 (与服务器保持一致)
- **Package Manager**: npm (推荐) 或 yarn
- **IDE**: Cursor + Claude Code 插件
- **浏览器**: Chrome/Firefox 开发者工具

---

**文档版本**: v1.1  
**最后更新**: 2025-01-28  
**维护人**: Claude (配合用户和 Claude Code)  
**更新内容**: 调整导航方案为浮动导航，完善主题切换为手动+跟随系统双控制
**下次更新**: 根据任务完成进度动态更新

---

## 🎯 立即行动建议

**Phase 3.1 可以立即开始**，建议按以下顺序执行：

1. **优先级 1**: 创建 Next.js 项目并配置基础环境
2. **优先级 2**: 实现 FloatingNav 和主题控制系统
3. **优先级 3**: 建立主页分段滚动框架
4. **优先级 4**: 完成第一个 Hero Section

**预期成果**: 一个可运行的 Next.js 项目，包含浮动导航和完整主题系统，为后续 Section 开发提供基础。
