"use client";

interface AnimatedGradientBackgroundProps {
  className?: string;
}

export default function AnimatedGradientBackground({ className }: AnimatedGradientBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className || ''}`}>
      {/* 高级渐变背景 - 统一处理日间/夜间模式 */}
      
      {/* 主色调1：蓝紫渐变 */}
      <div 
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-blob"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.15) 25%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.7,
        }}
      />
      
      {/* 主色调2：珊瑚橙 */}
      <div 
        className="absolute -bottom-1/2 -right-1/2 w-[200%] h-[200%] animate-blob animation-delay-2000"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(251, 113, 133, 0.3) 0%, rgba(254, 178, 178, 0.15) 25%, rgba(254, 178, 178, 0.05) 50%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.7,
        }}
      />
      
      {/* 主色调3：青绿 */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] animate-blob animation-delay-4000"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.25) 0%, rgba(52, 211, 153, 0.12) 25%, rgba(52, 211, 153, 0.04) 50%, transparent 70%)',
          filter: 'blur(90px)',
          opacity: 0.6,
        }}
      />
      
      {/* 主色调4：靛蓝 */}
      <div 
        className="absolute -top-1/3 right-1/4 w-[170%] h-[170%] animate-blob animation-delay-6000"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(79, 70, 229, 0.25) 0%, rgba(124, 58, 237, 0.12) 25%, rgba(124, 58, 237, 0.04) 50%, transparent 70%)',
          filter: 'blur(85px)',
          opacity: 0.65,
        }}
      />
      
      {/* 夜间模式降低整体亮度 */}
      <div className="absolute inset-0 bg-black/0 dark:bg-black/40 transition-colors duration-300" />
    </div>
  );
}