import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "李翔的个人网站",
    template: "%s | 李翔的个人网站"
  },
  description: "李翔的个人作品集网站 - 展示技术项目、摄影作品、博客文章、音乐和电影收藏",
  keywords: ["李翔", "个人网站", "作品集", "技术", "摄影", "博客", "全栈开发"],
  authors: [{ name: "李翔" }],
  creator: "李翔",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://你的域名.com",
    title: "李翔的个人网站",
    description: "李翔的个人作品集网站 - 展示技术项目、摄影作品、博客文章、音乐和电影收藏",
    siteName: "李翔的个人网站",
  },
  twitter: {
    card: "summary_large_image",
    title: "李翔的个人网站",
    description: "李翔的个人作品集网站 - 展示技术项目、摄影作品、博客文章、音乐和电影收藏",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
