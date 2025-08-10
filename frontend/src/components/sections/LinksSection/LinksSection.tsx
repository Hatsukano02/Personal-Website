'use client'

import { ExternalLink } from 'lucide-react'
import { SectionWrapper } from '@/components/layouts/SectionWrapper'
import { Typography } from '@/components/ui/Typography'
import { GlassCard } from '@/components/ui/GlassCard'
import { useActiveSocialLinks } from '@/lib/hooks/api/useSocialLinks'
import { useLanguageStore } from '@/stores/languageStore'
import type { SocialLink, StrapiCollectionResponse } from '@/types/api'

// 类型守卫函数
function hasSocialLinksData(data: unknown): data is StrapiCollectionResponse<SocialLink> {
  return Boolean(data && typeof data === 'object' && 'data' in data && Array.isArray((data as { data: unknown }).data))
}

interface LinksSectionProps {
  id: string
}

// 平台图标映射（使用 Lucide 图标或字符串）
const getPlatformIcon = () => {
  // 这里可以根据 platform_icon 字段返回对应的图标
  // 目前先使用通用的外链图标
  return <ExternalLink className="w-5 h-5" />
}

export default function LinksSection({ id }: LinksSectionProps) {
  const { language } = useLanguageStore()
  const { data: socialLinksResponse, isLoading, error } = useActiveSocialLinks()

  const texts = {
    en: {
      title: 'Connect',
      subtitle: 'Find me on these platforms',
      loading: 'Loading social links...',
      error: 'Failed to load social links',
      empty: 'No social links available',
    },
    zh: {
      title: '链接',
      subtitle: '在这些平台找到我',
      loading: '加载社交链接中...',
      error: '加载社交链接失败',
      empty: '暂无社交链接',
    },
  }

  const t = texts[language as keyof typeof texts] || texts.en

  return (
    <SectionWrapper id={id} backgroundVariant="transparent">
      <div className="text-center max-w-4xl mx-auto">
        <Typography variant="h2" className="mb-4 text-light-text-primary dark:text-dark-text-primary">
          {t.title}
        </Typography>
        <Typography variant="body" className="mb-12 text-light-text-secondary dark:text-dark-text-secondary">
          {t.subtitle}
        </Typography>

        {/* 加载状态 */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-light-primary dark:border-dark-primary"></div>
            <span className="ml-3 text-light-text-secondary dark:text-dark-text-secondary">
              {t.loading}
            </span>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="text-center py-12">
            <Typography variant="body" className="text-red-600 dark:text-red-400">
              {t.error}
            </Typography>
            <Typography variant="caption" className="text-light-text-muted dark:text-dark-text-muted mt-2">
              {error.message}
            </Typography>
          </div>
        )}

        {/* 空状态 */}
        {!isLoading && !error && hasSocialLinksData(socialLinksResponse) && socialLinksResponse.data.length === 0 && (
          <div className="text-center py-12">
            <Typography variant="body" className="text-light-text-muted dark:text-dark-text-muted">
              {t.empty}
            </Typography>
          </div>
        )}

        {/* 社交链接列表 */}
        {hasSocialLinksData(socialLinksResponse) && socialLinksResponse.data.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {socialLinksResponse.data.map((link) => (
              <div
                key={link.id}
                className="cursor-pointer group"
                onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
              >
                <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 text-light-primary dark:text-dark-primary group-hover:scale-110 transition-transform duration-300">
                    {getPlatformIcon()}
                  </div>
                  <div className="flex-1 text-left">
                    <Typography 
                      variant="h6" 
                      className="text-light-text-primary dark:text-dark-text-primary font-semibold"
                    >
                      {link.platform}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      className="text-light-text-secondary dark:text-dark-text-secondary"
                    >
                      {link.display_name}
                    </Typography>
                  </div>
                  <ExternalLink className="w-4 h-4 text-light-text-muted dark:text-dark-text-muted group-hover:text-light-primary dark:group-hover:text-dark-primary transition-colors duration-300" />
                </div>
                </GlassCard>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
