"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import styles from './TextFloatAnimation.module.css';
import type { 
  TextFloatAnimationProps, 
  PresetConfigs, 
  TextFloatPreset 
} from './TextFloatAnimation.types';

const PRESET_CONFIGS: PresetConfigs = {
  quick: {
    duration: 0.4,
    charDelay: 20,
    distance: 20,
    blurStart: 16,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
  },
  grand: {
    duration: 2.5,
    charDelay: 60,
    distance: 20,
    blurStart: 24,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
  },
  typewriter: {
    duration: 0.4,
    charDelay: 140,
    distance: 20,
    blurStart: 16,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
};

const TextFloatAnimation: React.FC<TextFloatAnimationProps> = ({
  text,
  preset = 'quick',
  className,
  onComplete,
  autoStart = true,
  triggerOnVisible = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const config = PRESET_CONFIGS[preset];
  
  // 设置CSS变量
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.style.setProperty('--duration', `${config.duration}s`);
      container.style.setProperty('--distance', `${config.distance}px`);
      container.style.setProperty('--blur-start', `${config.blurStart}px`);
      container.style.setProperty('--easing', config.easing);
    }
  }, [config]);
  
  // 动画完成回调
  useEffect(() => {
    if (isStarted && onComplete) {
      const totalDuration = (text.length * config.charDelay) + (config.duration * 1000);
      const timer = setTimeout(onComplete, totalDuration);
      return () => clearTimeout(timer);
    }
  }, [isStarted, text.length, config, onComplete]);
  
  // 外部控制触发逻辑
  useEffect(() => {
    if (autoStart && !triggerOnVisible && !isStarted) {
      setIsStarted(true);
    }
  }, [autoStart, triggerOnVisible, isStarted]);

  // 滚动触发逻辑
  useEffect(() => {
    if (!triggerOnVisible || isStarted) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isStarted) {
            setIsStarted(true);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
      }
    );
    
    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, [triggerOnVisible, isStarted]);
  
  // 暴露重播方法
  const replay = () => {
    setIsStarted(false);
    setTimeout(() => {
      setIsStarted(true);
    }, 50);
  };
  
  // 将replay方法暴露给父组件
  useEffect(() => {
    if (containerRef.current) {
      // @ts-ignore - 添加replay方法到元素上供外部调用
      containerRef.current.replay = replay;
    }
  }, []);
  
  // 获取预设样式类名
  const getPresetClassName = (preset: TextFloatPreset): string => {
    const presetMap = {
      quick: styles.presetQuick,
      grand: styles.presetGrand,
      typewriter: styles.presetTypewriter
    };
    return presetMap[preset];
  };
  
  return (
    <div
      ref={containerRef}
      className={cn(
        styles.container,
        getPresetClassName(preset),
        isStarted ? styles.started : styles.notStarted,
        className
      )}
    >
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={cn(
            styles.char,
            char === ' ' ? styles.space : ''
          )}
          style={{ 
            '--delay': `${index * config.charDelay}ms` 
          } as React.CSSProperties}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

export default TextFloatAnimation;