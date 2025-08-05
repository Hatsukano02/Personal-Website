'use client'

interface AboutSectionProps {
  id: string
}

export default function AboutSection({ id }: AboutSectionProps) {
  return (
    <section 
      id={id}
      className="relative min-h-screen flex items-center justify-center bg-light-background-secondary dark:bg-dark-background-secondary"
    >
      {/* 微妙的渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-bl from-light-background-secondary via-light-background-tertiary to-light-background-primary dark:from-dark-background-secondary dark:via-dark-background-tertiary dark:to-dark-background-primary opacity-60"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* 主标题 - 无卡片效果 */}
          <h2 className="text-4xl font-bold mb-6 text-light-text-primary dark:text-dark-text-primary">
            About Me
          </h2>
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary leading-relaxed max-w-2xl mx-auto">
            I&apos;m a passionate full-stack developer with expertise in modern web technologies.
            I love creating beautiful, functional applications and exploring new technologies.
          </p>
        </div>
      </div>
    </section>
  )
}