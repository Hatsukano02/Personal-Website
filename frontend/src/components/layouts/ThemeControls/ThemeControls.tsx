"use client";

import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ThemeControlsProps, ThemeOption } from "./ThemeControls.types";

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Light", icon: <Sun size={16} /> },
  { value: "dark", label: "Dark", icon: <Moon size={16} /> },
  { value: "auto", label: "Auto", icon: <Monitor size={16} /> },
];

const ThemeControls = ({ className }: ThemeControlsProps) => {
  // 设置合理的默认状态，支持 SSR
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");
  const [scale, setScale] = useState(1);
  const [hoveredOptionIndex, setHoveredOptionIndex] = useState<number | null>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentScaleRef = useRef(1);
  const targetScaleRef = useRef(1);

  // 客户端初始化，但不阻塞渲染
  useEffect(() => {
    // 异步初始化主题，不阻塞渲染
    const initTheme = async () => {
      try {
        // 先从 localStorage 获取，立即更新
        const savedTheme = localStorage.getItem("theme") as
          | "light"
          | "dark"
          | "auto";
        if (savedTheme) {
          setTheme(savedTheme);
        }

        // 尝试连接 ThemeProvider（仅用于获取模块引用）
        try {
          const themeModule = await import(
            "@/components/providers/ThemeProvider"
          );
          console.log("ThemeProvider module loaded", themeModule);
        } catch (themeError) {
          console.warn("Failed to import ThemeProvider:", themeError);
        }
      } catch (error) {
        console.warn("Failed to connect to ThemeProvider:", error);
        // 继续使用 localStorage 状态
      }
    };

    initTheme();
  }, []);

  // 处理主题切换
  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme);

    // 只在客户端执行
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);

      // 手动调用ThemeProvider的方法（如果可用）
      try {
        const globalWindow = window as unknown as {
          __themeProviderSetTheme?: (theme: string) => void;
        };
        if (globalWindow.__themeProviderSetTheme) {
          globalWindow.__themeProviderSetTheme(newTheme);
        }
      } catch (error) {
        console.warn("Failed to use ThemeProvider:", error);
      }

      // 手动更新 HTML 类
      const root = document.documentElement;
      if (newTheme === "auto") {
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        root.classList.toggle("dark", isDark);
      } else {
        root.classList.toggle("dark", newTheme === "dark");
      }
    }
  };

  useEffect(() => {
    // 只在客户端启动鼠标响应
    if (typeof window === "undefined") return;

    let lastX = 0;
    let lastY = 0;

    const updateScale = () => {
      const diff = targetScaleRef.current - currentScaleRef.current;

      if (Math.abs(diff) > 0.001) {
        currentScaleRef.current += diff * 0.2;
        setScale(currentScaleRef.current);
        animationFrameRef.current = requestAnimationFrame(updateScale);
      } else {
        currentScaleRef.current = targetScaleRef.current;
        setScale(targetScaleRef.current);
        animationFrameRef.current = null;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = Math.abs(e.clientX - lastX);
      const deltaY = Math.abs(e.clientY - lastY);

      if (deltaX < 5 && deltaY < 5) return;

      lastX = e.clientX;
      lastY = e.clientY;

      if (!controlsRef.current) return;

      const rect = controlsRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = Math.abs(e.clientX - centerX);
      const distanceY = Math.abs(e.clientY - centerY);

      const maxDistanceX = 200;
      const maxDistanceY = 120;

      const normalizedX = distanceX / maxDistanceX;
      const normalizedY = distanceY / maxDistanceY;
      const ellipseDistance =
        normalizedX * normalizedX + normalizedY * normalizedY;

      if (ellipseDistance < 1) {
        const normalizedDistance = Math.max(
          0,
          Math.min(1, 1 - ellipseDistance)
        );
        const easedDistance =
          normalizedDistance *
          normalizedDistance *
          (3 - 2 * normalizedDistance);
        targetScaleRef.current = 1 + easedDistance * 0.12;
      } else {
        targetScaleRef.current = 1;
      }

      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateScale);
      }
    };

    const handleMouseLeave = () => {
      targetScaleRef.current = 1;
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateScale);
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 直接渲染，不等待客户端挂载

  return (
    <div className={cn("fixed top-4 right-4 z-50", className)}>
      <div
        ref={controlsRef}
        className={cn(
          "bg-light-background-secondary/80 dark:bg-dark-background-secondary/80",
          "backdrop-blur-md border border-light-border-default/20 dark:border-dark-border-default/20",
          "rounded-full shadow-lg p-1.5",
          "flex items-center gap-1"
        )}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        {THEME_OPTIONS.map((option, index) => (
          <button
            key={option.value}
            onClick={() => handleThemeChange(option.value)}
            onMouseEnter={() => setHoveredOptionIndex(index)}
            onMouseLeave={() => setHoveredOptionIndex(null)}
            className={cn(
              "relative flex items-center justify-center w-9 h-9 rounded-full cursor-pointer",
              "hover:bg-light-background-tertiary/50 dark:hover:bg-dark-background-tertiary/50",
              theme === option.value
                ? "text-light-primary dark:text-dark-primary bg-light-primary/10 dark:bg-dark-primary/10"
                : "text-light-text-secondary dark:text-dark-text-secondary"
            )}
            style={{
              transform: hoveredOptionIndex === index ? "scale(1.1)" : "scale(1)",
              transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
            aria-label={`Switch to ${option.label} theme`}
          >
            <span
              style={{
                transform: hoveredOptionIndex === index ? "scale(1.05)" : "scale(1)",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {option.icon}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeControls;
