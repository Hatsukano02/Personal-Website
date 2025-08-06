# Phase 3.1 - 页面布局架构配置文件

## 📅 阶段信息
- **阶段名称**: Phase 3.1 - 页面布局架构
- **开始时间**: 2025-01-23
- **当前状态**: 进行中
- **目标**: 建立前端核心布局组件和响应式架构

## 🚀 本地开发环境配置

### 环境要求
```bash
# Node.js版本
node: v22.17.1
npm: 10.9.2

# 项目路径
项目根目录: /Users/lixiang/Desktop/Develop/PersonalWebsite
前端目录: ./frontend
后端目录: ./backend
```

### 前端项目初始化命令
```bash
# 创建Next.js项目（如果还没创建）
cd /Users/lixiang/Desktop/Develop/PersonalWebsite
npx create-next-app@latest frontend --typescript --tailwind --app

# 进入前端目录
cd frontend

# 安装核心依赖
npm install gsap framer-motion zustand @tanstack/react-query
npm install -D @types/node
```

### 项目结构（前端）
```
frontend/
├── src/
│   ├── app/                    # App Router
│   │   ├── layout.tsx          # ✅ 主布局组件
│   │   ├── page.tsx           # 主页
│   │   └── globals.css        # 全局样式
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx     # 🔄 导航组件
│   │   │   ├── Footer.tsx     # 🔄 页脚组件
│   │   │   └── Navigation.tsx # 🔄 导航栏
│   │   └── ui/
│   │       └── Button.tsx     # 基础组件
│   ├── lib/
│   │   └── utils.ts           # 工具函数
│   └── styles/
│       └── theme.css           # 主题变量
├── public/                     # 静态资源
├── .env.local                  # 本地环境变量
├── next.config.js              # Next.js配置
├── tailwind.config.ts          # Tailwind配置
└── tsconfig.json              # TypeScript配置
```

## 📝 Phase 3.1 任务清单

### 已完成 ✅
- [x] 项目基础结构创建
- [x] TypeScript配置
- [x] Tailwind CSS集成

### 进行中 🔄
- [ ] 主布局组件(Layout)
  - [ ] 基础HTML结构
  - [ ] 全局样式重置
  - [ ] 字体和颜色系统
  - [ ] 容器和间距系统

- [ ] 导航组件(Navigation)
  - [ ] 桌面端导航栏
  - [ ] 移动端汉堡菜单
  - [ ] 滚动时的样式变化
  - [ ] 路由高亮状态

### 待开始 ⏳
- [ ] 页脚组件(Footer)
- [ ] 响应式断点处理
- [ ] 暗色主题支持

## 💻 开发环境变量配置

### .env.local（本地开发）
```env
# API配置
NEXT_PUBLIC_API_URL=http://localhost:1337/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 功能开关
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DARK_MODE=true

# 开发配置
NODE_ENV=development
```

### .env.production（生产环境）
```env
# API配置
NEXT_PUBLIC_API_URL=http://172.96.193.211/