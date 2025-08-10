"use client";

import { useState } from "react";
import { Chatbot } from "../../ui";

interface AboutSectionProps {
  id: string;
}

export default function AboutSection({ id }: AboutSectionProps) {
  const [titleMoved, setTitleMoved] = useState(false);

  const handleTitleMove = (shouldMove: boolean) => {
    console.log("Title move triggered:", shouldMove); // 调试日志
    setTitleMoved(shouldMove);
  };
  return (
    <section
      id={id}
      className="relative min-h-screen flex items-center justify-center bg-light-background-primary dark:bg-dark-background-primary"
    >
      {/* 微妙的渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-bl from-light-background-secondary via-light-background-tertiary to-light-background-primary dark:from-dark-background-secondary dark:via-dark-background-tertiary dark:to-dark-background-primary opacity-60"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* 主标题 */}
        <div
          className={`text-center ${
            titleMoved ? "title-moved" : "title-initial"
          }`}
          style={{
            marginBottom: titleMoved ? "1.5rem" : "3rem", // 24px vs 48px
            transform: titleMoved ? "translateY(-64px)" : "translateY(0px)",
            transition: "all 1000ms cubic-bezier(0.23, 1, 0.32, 1)",
            willChange: "transform, margin-bottom", // 优化动画性能
          }}
        >
          <h2 className="text-4xl font-bold mb-6 text-light-text-primary dark:text-dark-text-primary">
            About Me
          </h2>
        </div>

        {/* 直接使用Chatbot组件，不要任何外框 */}
        <Chatbot
          ephemeralMode={true}
          showSendButton={true}
          maxTurns={3}
          onTitleMove={handleTitleMove}
        />
      </div>
    </section>
  );
}
