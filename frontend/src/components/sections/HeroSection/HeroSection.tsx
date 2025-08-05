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
      {/* 内容区域 */}
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-12 md:gap-0">
          {/* 左侧文字内容 */}
          <div className="flex-1 w-full md:w-auto text-left md:pr-12">
            {/* 主标题 - Hi 后换行，字号大但不过分夸张，间距规范 */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-3 md:mb-5 text-light-text-primary dark:text-dark-text-primary leading-tight md:leading-[1.08]">
              Hi
              <br />
              it&apos;s Li here.
            </h1>
            {/* 副标题与主标题间距更紧凑，副标题行距舒适 */}
            <p className="text-lg md:text-xl mb-3 md:mb-4 text-light-text-secondary dark:text-dark-text-secondary max-w-xl leading-relaxed md:leading-loose">
              CS Major <br />
              Photography Learner <br />
              PC & Console Gamer
            </p>
          </div>

          {/* 右侧头像图片，垂直居中，响应式宽高 */}
          <div className="flex-1 flex justify-center items-center w-full md:w-auto">
            <div className="relative w-56 h-56 md:w-[700px] md:h-[700px]">
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
