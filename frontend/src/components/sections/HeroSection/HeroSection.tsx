"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";

interface HeroSectionProps {
  id: string;
}

export default function HeroSection({ id }: HeroSectionProps) {
  const [clickCount, setClickCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInFourthSequence, setIsInFourthSequence] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { effectiveTheme } = useTheme();

  const handleImageClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      // 让计数器正常递增，重置逻辑交给onAnimationComplete处理
      return newCount;
    });
  };

  const handleMouseLeave = () => {
    console.log("🐭 Mouse Leave - Setting isHovered to false");
    setIsHovered(false);
    // 如果不在第四次序列中，设置延迟重置
    if (!isInFourthSequence && clickCount > 0) {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 1000);
    }
  };

  const handleMouseEnter = () => {
    console.log("🐭 Mouse Enter - Setting isHovered to true");
    setIsHovered(true);
    // 鼠标进入时清除重置定时器
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  };

  // 调试状态变化
  useEffect(() => {
    console.log("🔍 State Update:", {
      isHovered,
      clickCount,
      isInFourthSequence,
    });
  }, [isHovered, clickCount, isInFourthSequence]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);
  return (
    <section
      id={id}
      className="relative min-h-screen flex items-center justify-center bg-light-background-primary dark:bg-dark-background-primary"
    >
      {/* 内容区域 - 整体居中布局 */}
      <div className="relative z-10 h-screen flex items-center justify-center">
        {/* 主容器 - 文字+图片整体容器，应用边缘控制 */}
        <div
          className="relative flex items-center justify-center"
          style={{
            padding: "clamp(3rem, 12vw, 12rem)",
            width: "100%",
            maxWidth: "100vw",
          }}
        >
          {/* 内容容器 - 文字和图片的组合 */}
          <div
            className="flex items-end"
            style={{ gap: "clamp(2rem, 8vw, 6rem)" }}
          >
            {/* 文字内容 - 左侧 */}
            <div
              className="flex flex-col justify-end"
              style={{
                height: "clamp(14rem, 35vw, 35rem)",
                width: "clamp(20rem, 50vw, 40rem)",
                transform: "translateY(clamp(-1rem, -3vw, -2rem))",
              }}
            >
              {/* 主标题 */}
              <h1
                className="font-sans text-light-text-primary dark:text-dark-text-primary"
                style={{
                  fontSize: "clamp(2.5rem, 10vw, 6.5rem)",
                  lineHeight: "clamp(2.4rem, 9vw, 6.2rem)", // 稍微加大但不过大
                  margin: 0,
                  textAlign: "left",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontVariationSettings: '"wght" 700',
                }}
              >
                Hi
                <br />
                it&apos;s Li here.
              </h1>

              {/* 主副标题间距 - 间距缩小一半 */}
              <div style={{ marginTop: "clamp(0.25rem, 1vw, 0.75rem)" }}></div>

              {/* 副标题 */}
              <p
                className="font-sans text-light-text-secondary dark:text-dark-text-secondary"
                style={{
                  fontSize: "clamp(0.7rem, 2.2vw, 1.4rem)",
                  lineHeight: "clamp(1rem, 3.3vw, 2.1rem)",
                  margin: 0,
                  textAlign: "left",
                  fontFamily: "var(--font-sans)",
                }}
              >
                CS Major <br />
                Photography Learner <br />
                PC & Console Gamer
              </p>
            </div>

            {/* 图片容器 - 右侧，作为对齐基准 */}
            <motion.div
              ref={imageRef}
              className="relative flex-shrink-0 cursor-pointer"
              style={
                {
                  width: "clamp(14rem, 35vw, 35rem)",
                  height: "clamp(14rem, 35vw, 35rem)",
                  "--shadow-opacity": isHovered ? "0.45" : "0",
                  filter: effectiveTheme === 'dark' 
                    ? `drop-shadow(0 20px 40px rgba(255, 255, 255, var(--shadow-opacity, 0)))`
                    : `drop-shadow(0 20px 40px rgba(0, 0, 0, var(--shadow-opacity, 0)))`,
                  transition:
                    "filter 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                } as any
              }
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{
                scale: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.6,
                },
              }}
              whileTap={{
                scale: 0.95,
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleImageClick}
            >
              {/* 点击动画层 - 独立的motion.div用于旋转动画 */}
              <motion.div
                className="w-full h-full"
                animate={{
                  rotate:
                    clickCount === 1
                      ? [0, -3, 3, -2, 2, 0]
                      : clickCount === 2
                      ? [0, -5, 5, -4, 4, -2, 2, 0]
                      : clickCount === 3
                      ? [0, -8, 8, -6, 6, -4, 4, -2, 2, 0]
                      : clickCount === 4
                      ? [0, 360, 375, 0]
                      : 0,
                }}
                transition={{
                  duration: clickCount === 4 ? 3.0 : clickCount * 0.2 + 0.4,
                  ease: clickCount === 4 ? [0.25, 0.1, 0.25, 1] : "easeInOut",
                  times: clickCount === 4 ? [0, 0.4, 0.55, 1] : undefined,
                }}
                onAnimationComplete={() => {
                  if (clickCount === 4) {
                    setIsInFourthSequence(true);
                    // 第四次动画完成后，等待1秒后重置点击计数
                    setTimeout(() => {
                      setClickCount(0);
                      setIsInFourthSequence(false);
                    }, 1000);
                  }
                }}
              >
                <Image
                  src="/my-notion-face-transparent.png"
                  alt="Li's Avatar"
                  fill
                  sizes="(max-width: 768px) 50vw, 35vw"
                  className="object-contain"
                  priority
                  quality={100}
                  style={{
                    imageRendering: "crisp-edges",
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* 滚动指示器 - 纯文字提示，位置更靠近导航栏 */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 inline-flex flex-col items-center animate-fade-in-out">
          <span className="text-sm mb-2 text-light-text-muted dark:text-dark-text-muted">
            Scroll down to explore
          </span>
          <div className="w-5 h-5 text-light-text-muted dark:text-dark-text-muted animate-bounce">
            ↓
          </div>
        </div>
      </div>
    </section>
  );
}
