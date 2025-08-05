"use client";

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
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* 主标题 - 无卡片效果 */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-light-text-primary dark:text-dark-text-primary">
            Hi, it&apos;s Li here!
          </h1>

          <p className="text-lg md:text-xl mb-8 text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            CS Major | Photography Learner | PC & Console Gamer
          </p>

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
      </div>
    </section>
  );
}
