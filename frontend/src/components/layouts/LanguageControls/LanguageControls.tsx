"use client";

import { useState, useEffect, useRef } from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { LanguageControlsProps, LanguageOption, Language } from "./LanguageControls.types";

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "zh", label: "中文", shortLabel: "中" },
  { value: "en", label: "English", shortLabel: "En" },
];

const LanguageControls = ({ className }: LanguageControlsProps) => {
  const [language, setLanguage] = useState<Language>("zh");
  const [scale, setScale] = useState(1);
  const [hoveredOptionIndex, setHoveredOptionIndex] = useState<number | null>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentScaleRef = useRef(1);
  const targetScaleRef = useRef(1);

  // 处理语言切换
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // TODO: 这里可以添加国际化逻辑
    console.log("Language changed to:", newLanguage);
  };

  // 鼠标位置响应效果 - 与主题切换控件保持一致
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

      // 椭圆形检测区域 - 与主题切换控件一致
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
        // 最大放大 12% - 与主题切换控件一致
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

  return (
    <div className={cn("fixed top-4 left-4 z-50", className)}>
      <div
        ref={controlsRef}
        className={cn(
          "bg-light-background-secondary/80 dark:bg-dark-background-secondary/80",
          "backdrop-blur-md",
          "border border-light-border-default dark:border-transparent",
          "dark:shadow-[inset_0_0_0_1px_rgba(248,250,252,0.15),0_10px_15px_-3px_rgba(0,0,0,0.25),0_4px_6px_-2px_rgba(0,0,0,0.15)]",
          "rounded-full p-1.5",
          "shadow-lg dark:shadow-dark-shadow",
          "flex items-center gap-1"
        )}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        {LANGUAGE_OPTIONS.map((option, index) => {
          const isActive = language === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handleLanguageChange(option.value)}
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
              aria-label={`Switch to ${option.label}`}
            >
              <span
                className="text-xs font-medium"
                style={{
                  transform:
                    hoveredOptionIndex === index ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
              >
                {option.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageControls;