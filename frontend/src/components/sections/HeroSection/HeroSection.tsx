"use client";
import Image from "next/image";

interface HeroSectionProps {
  id: string;
}

export default function HeroSection({ id }: HeroSectionProps) {
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
                className="font-extrabold text-light-text-primary dark:text-dark-text-primary"
                style={{
                  fontSize: "clamp(2.5rem, 10vw, 6.5rem)",
                  lineHeight: "clamp(2.4rem, 9vw, 6.2rem)", // 稍微加大但不过大
                  margin: 0,
                  textAlign: "left",
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
                className="text-light-text-secondary dark:text-dark-text-secondary"
                style={{
                  fontSize: "clamp(0.7rem, 2.2vw, 1.4rem)",
                  lineHeight: "clamp(1rem, 3.3vw, 2.1rem)",
                  margin: 0,
                  textAlign: "left",
                }}
              >
                CS Major <br />
                Photography Learner <br />
                PC & Console Gamer
              </p>
            </div>

            {/* 图片容器 - 右侧，作为对齐基准 */}
            <div
              className="relative flex-shrink-0"
              style={{
                width: "clamp(14rem, 35vw, 35rem)",
                height: "clamp(14rem, 35vw, 35rem)",
              }}
            >
              <Image
                src="/my-notion-face-transparent.png"
                alt="Li's Avatar"
                fill
                className="object-contain"
                priority
              />
            </div>
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
