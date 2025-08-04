"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { cn } from "@/lib/utils/cn";
import type { NavigationItem, FloatingNavProps } from "./FloatingNav.types";

const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "hero", label: "Home", sectionId: "hero", icon: Home, isVisible: true },
  {
    id: "about",
    label: "About",
    sectionId: "about",
    icon: User,
    isVisible: true,
  },
  {
    id: "projects",
    label: "Projects",
    sectionId: "projects",
    icon: Code,
    isVisible: true,
  },
  {
    id: "photography",
    label: "Photos",
    sectionId: "photography",
    icon: Camera,
    isVisible: true,
  },
  {
    id: "blog",
    label: "Blog",
    sectionId: "blog",
    icon: PenTool,
    isVisible: true,
  },
  {
    id: "music",
    label: "Music",
    sectionId: "music",
    icon: Music,
    isVisible: true,
  },
  {
    id: "movies",
    label: "Movies",
    sectionId: "movies",
    icon: Film,
    isVisible: true,
  },
  {
    id: "media",
    label: "Media",
    sectionId: "media",
    icon: Folder,
    isVisible: true,
  },
  {
    id: "links",
    label: "Links",
    sectionId: "links",
    icon: Link,
    isVisible: true,
  },
  {
    id: "contact",
    label: "Contact",
    sectionId: "contact",
    icon: Mail,
    isVisible: true,
  },
];

const VISIBLE_ITEMS_COUNT = 5;
const CENTER_INDEX = 2; // 第3个位置（0-based索引）

const FloatingNav = ({ className }: FloatingNavProps) => {
  const [activeSection, setActiveSection] = useState("hero");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [scrollOffset, setScrollOffset] = useState(0); // 添加滚动偏移量状态
  const navRef = useRef<HTMLElement>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Intersection Observer 检测活跃section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -80% 0px", // 只有当section在视窗中间20%-80%区域时才被认为是活跃的
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const index = NAVIGATION_ITEMS.findIndex(
            (item) => item.sectionId === sectionId
          );
          if (index !== -1) {
            setActiveSection(sectionId);
            setActiveSectionIndex(index);
          }
        }
      });
    }, observerOptions);

    // 观察所有section
    NAVIGATION_ITEMS.forEach((item) => {
      const section = document.getElementById(item.sectionId);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  // 计算项目样式（基于距离活跃项目的距离）
  const getItemScale = useCallback((itemIndex: number, activeIndex: number) => {
    const distanceFromActive = Math.abs(itemIndex - activeIndex);
    const maxDistance = CENTER_INDEX;

    const normalizedDistance = Math.min(distanceFromActive / maxDistance, 1);
    const cosineScale = (Math.cos(normalizedDistance * Math.PI) + 1) / 2;

    return {
      fontWeight: Math.round(400 + cosineScale * 300),
      fontWidth: Math.round(85 + cosineScale * 15),
      fontSize: Math.round(14 + cosineScale * 4),
    };
  }, []);

  // 计算每个项目的标准宽度
  const ITEM_WIDTH = 120; // 固定每个项目的宽度
  const GAP_SIZE = 8;
  const CONTAINER_WIDTH =
    VISIBLE_ITEMS_COUNT * ITEM_WIDTH + (VISIBLE_ITEMS_COUNT - 1) * GAP_SIZE;

  // 当活跃section变化时，更新滚动偏移量状态
  useEffect(() => {
    const targetOffset =
      (activeSectionIndex - CENTER_INDEX) * (ITEM_WIDTH + GAP_SIZE);
    const totalWidth =
      NAVIGATION_ITEMS.length * (ITEM_WIDTH + GAP_SIZE) - GAP_SIZE;
    const maxOffset = totalWidth - CONTAINER_WIDTH;

    const newOffset = Math.max(0, Math.min(targetOffset, maxOffset));

    // 只有当偏移量真正改变时才更新状态
    if (newOffset !== scrollOffset) {
      setScrollOffset(newOffset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSectionIndex, CONTAINER_WIDTH]);

  // 鼠标位置响应效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!navRef.current) return;

      const rect = navRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = Math.abs(e.clientX - centerX);
      const distanceY = Math.abs(e.clientY - centerY);

      const maxDistanceX = 350;
      const maxDistanceY = 150;

      const normalizedX = distanceX / maxDistanceX;
      const normalizedY = distanceY / maxDistanceY;
      const ellipseDistance =
        normalizedX * normalizedX + normalizedY * normalizedY;
      const isNear = ellipseDistance < 1;

      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }

      if (isNear) {
        const normalizedDistance = Math.max(
          0,
          Math.min(1, 1 - ellipseDistance)
        );
        const easedDistance = 1 - Math.pow(1 - normalizedDistance, 3);
        const targetScale = 1 + easedDistance * 0.15;
        setScale(targetScale);
      } else {
        leaveTimerRef.current = setTimeout(() => {
          setScale(1);
          leaveTimerRef.current = null;
        }, 500);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }
    };
  }, []);

  // 处理滚轮事件 - 修复passive event listener问题
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      const currentIndex = activeSectionIndex;
      let newIndex;

      if (delta > 0 && currentIndex < NAVIGATION_ITEMS.length - 1) {
        newIndex = currentIndex + 1;
      } else if (delta < 0 && currentIndex > 0) {
        newIndex = currentIndex - 1;
      } else {
        return;
      }

      const section = document.getElementById(
        NAVIGATION_ITEMS[newIndex].sectionId
      );
      section?.scrollIntoView({ behavior: "smooth" });
    },
    [activeSectionIndex]
  );

  // 绑定滚轮事件
  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;

    navElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      navElement.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  // 处理键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const direction = e.key === "ArrowLeft" ? -1 : 1;
        const newIndex = activeSectionIndex + direction;

        if (newIndex >= 0 && newIndex < NAVIGATION_ITEMS.length) {
          const targetSection = document.getElementById(
            NAVIGATION_ITEMS[newIndex].sectionId
          );
          targetSection?.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSectionIndex]);

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed bottom-8 left-1/2 z-50",
        "bg-light-background-secondary/80 dark:bg-dark-background-secondary/80",
        "backdrop-blur-md border border-light-border-default/20 dark:border-dark-border-default/20",
        "rounded-full shadow-lg px-4 py-2",
        className
      )}
      style={{
        transform: `translate(-50%, 0) scale(${scale})`,
        transformOrigin: "center bottom",
      }}
    >
      {/* 外层遮罩容器 - 固定宽度，只显示5个项目 */}
      <div
        className="overflow-hidden relative"
        style={{
          width: `${CONTAINER_WIDTH}px`,
        }}
      >
        {/* 内层滑动容器 - 包含所有10个项目 */}
        <div
          className="flex items-center"
          style={{
            gap: `${GAP_SIZE}px`,
            transform: `translateX(-${scrollOffset}px)`,
            transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {NAVIGATION_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.sectionId === activeSection;
            const scale = getItemScale(index, activeSectionIndex);

            return (
              <button
                key={item.id}
                data-active={isActive}
                onClick={() => {
                  const section = document.getElementById(item.sectionId);
                  section?.scrollIntoView({ behavior: "smooth" });
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer group shrink-0",
                  "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110",
                  isActive
                    ? "bg-light-background-tertiary/90 dark:bg-dark-background-tertiary/90"
                    : "hover:bg-light-background-tertiary/70 dark:hover:bg-dark-background-tertiary/70"
                )}
                style={{
                  width: `${ITEM_WIDTH}px`,
                  justifyContent: "center",
                }}
              >
                <Icon
                  size={16}
                  className={cn(
                    "transition-colors duration-200",
                    isActive
                      ? "text-light-text-primary dark:text-dark-text-primary"
                      : "text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary"
                  )}
                />
                <span
                  className={cn(
                    "font-variable transition-all duration-300 ease-out whitespace-nowrap",
                    isActive
                      ? "text-light-text-primary dark:text-dark-text-primary"
                      : "text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary"
                  )}
                  style={{
                    fontSize: `${scale.fontSize}px`,
                    fontVariationSettings: `"wght" ${scale.fontWeight}, "wdth" ${scale.fontWidth}`,
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default FloatingNav;
