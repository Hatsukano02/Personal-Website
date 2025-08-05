import { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Li Xiang - Full Stack Developer',
    template: '%s | Li Xiang'
  },
  description: 'Personal website showcasing projects, photography, and technical insights',
  keywords: ['Full Stack Developer', 'React', 'Next.js', 'TypeScript', 'Photography'],
  authors: [{ name: 'Li Xiang' }],
  creator: 'Li Xiang',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: {
    icon: '/my-notion-face-transparent.png',
    shortcut: '/my-notion-face-transparent.png',
    apple: '/my-notion-face-transparent.png'
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    title: 'Li Xiang - Full Stack Developer',
    description: 'Personal website showcasing projects, photography, and technical insights',
    siteName: 'Li Xiang'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Li Xiang - Full Stack Developer',
    description: 'Personal website showcasing projects, photography, and technical insights'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-light-background-primary dark:bg-dark-background-primary">
        <ThemeProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}