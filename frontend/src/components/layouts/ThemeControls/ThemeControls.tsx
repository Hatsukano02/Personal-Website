"use client";

import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { ThemeControlsProps, ThemeOption } from "./ThemeControls.types";

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Light", icon: <Sun size={16} /> },
  { value: "dark", label: "Dark", icon: <Moon size={16} /> },
  { value: "auto", label: "Auto", icon: <Monitor size={16} /> },
];

const ThemeControls = ({ className }: ThemeControlsProps) => {
  const { theme, setTheme, effectiveTheme } = useTheme();
  const [scale, setScale] = useState(1);
  const [hoveredOptionIndex, setHoveredOptionIndex] = useState<number | null>(
    null
  );
  const [flashingTheme, setFlashingTheme] = useState<string | null>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentScaleRef = useRef(1);
  const targetScaleRef = useRef(1);

  // 处理主题切换
  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme);

    // 只对dark主题触发闪光动画（月亮图标）
    if (newTheme === "dark") {
      // 清除之前的动画状态，确保不会有重叠
      setFlashingTheme(null);

      // 使用 requestAnimationFrame 确保状态重置后再开始新动画
      requestAnimationFrame(() => {
        setFlashingTheme(newTheme);
        // 2.2秒后清除闪光状态，与CSS动画时间完全匹配
        setTimeout(() => {
          setFlashingTheme(null);
        }, 2200);
      });
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
          "bg-light-background-secondary/80 dark:bg-white/10",
          "backdrop-blur-md",
          "border",
          "rounded-full p-1.5",
          "flex items-center gap-1"
        )}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
          borderColor:
            effectiveTheme === "dark" ? "rgba(255, 255, 255, 0.3)" : "#1F2937",
          boxShadow:
            effectiveTheme === "dark"
              ? "inset 0 0 3px rgba(255, 255, 255, 0.15), 0 10px 15px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -2px rgba(0, 0, 0, 0.15)"
              : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        {THEME_OPTIONS.map((option, index) => {
          const isActive = theme === option.value;
          const isDarkTheme = option.value === "dark";
          const shouldFlash = flashingTheme === option.value && isDarkTheme;

          return (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              onMouseEnter={() => setHoveredOptionIndex(index)}
              onMouseLeave={() => setHoveredOptionIndex(null)}
              className={cn(
                "relative flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-colors duration-200",
                "hover:bg-light-background-tertiary/50 dark:hover:bg-dark-background-tertiary/50",
                isActive
                  ? "text-light-text-primary dark:text-white"
                  : "text-light-text-secondary dark:text-dark-text-secondary"
              )}
              style={{
                transform:
                  hoveredOptionIndex === index ? "scale(1.1)" : "scale(1)",
                transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
              aria-label={`Switch to ${option.label} theme`}
            >
              <span
                className={cn(shouldFlash && "animate-golden-icon-flash")}
                style={{
                  transform:
                    hoveredOptionIndex === index ? "scale(1.05)" : "scale(1)",
                  transition: shouldFlash
                    ? "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                    : "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
              >
                {option.icon}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeControls;
