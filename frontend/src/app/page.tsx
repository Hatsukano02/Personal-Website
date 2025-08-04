'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  PhotoSection,
  BlogSection,
  MusicSection,
  MoviesSection,
  MediaSection,
  LinksSection,
  ContactSection
} from '@/components/sections'
import { FloatingNav } from '@/components/layouts/FloatingNav'
import { ThemeControls } from '@/components/layouts/ThemeControls'
import { useNavigationStore } from '@/stores/navigationStore'
import { useScroll } from '@/lib/hooks/useScroll'

// 注册GSAP插件
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { setActiveSection, updateNavVisibility } = useNavigationStore()
  const { scrollY, scrollDirection } = useScroll({
    sections: ['hero', 'about', 'projects', 'photography', 'blog', 'music', 'movies', 'media', 'links', 'contact']
  })

  // 更新导航可见性
  useEffect(() => {
    updateNavVisibility(scrollY, scrollDirection)
  }, [scrollY, scrollDirection, updateNavVisibility])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // GSAP ScrollTrigger 初始化 - 检测活跃section
    const sections = ['hero', 'about', 'projects', 'photography', 'blog', 'music', 'movies', 'media', 'links', 'contact']
    
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (element) {
        ScrollTrigger.create({
          trigger: element,
          start: 'top center',
          end: 'bottom center',
          onToggle: self => {
            if (self.isActive) {
              setActiveSection(sectionId)
            }
          }
        })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [setActiveSection])

  return (
    <main 
      ref={containerRef}
      className="relative"
    >
      {/* 分段内容 */}
      <HeroSection id="hero" />
      <AboutSection id="about" />
      <ProjectsSection id="projects" />
      <PhotoSection id="photography" />
      <BlogSection id="blog" />
      <MusicSection id="music" />
      <MoviesSection id="movies" />
      <MediaSection id="media" />
      <LinksSection id="links" />
      <ContactSection id="contact" />
      
      {/* 浮动导航 */}
      <FloatingNav />
      
      {/* 主题控制 */}
      <ThemeControls />
    </main>
  )
}