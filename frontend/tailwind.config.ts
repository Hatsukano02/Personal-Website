import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          primary: '#087E8B',
          secondary: '#C7FFDA',
          accent: '#0A2342',
          background: {
            primary: '#FEFEFE',      // 几乎白色但不是纯白
            secondary: '#F9FAFB',    // 极浅灰
            tertiary: '#F3F4F6'      // 浅灰
          },
          text: {
            primary: '#1F2937',      // 深灰而非纯黑
            secondary: '#94A3B8',    // 更淡的次要文本色
            muted: '#9CA3AF'
          },
          border: {
            DEFAULT: '#E5E7EB',
            muted: '#F3F4F6'
          }
        },
        dark: {
          primary: '#4a8c8c',
          secondary: '#fab062',
          accent: '#011126',
          background: {
            primary: '#0F172A',      // 深蓝灰而非纯黑
            secondary: '#1E293B',    // 稍浅的深蓝灰
            tertiary: '#334155'      // 中等深度蓝灰
          },
          text: {
            primary: '#F8FAFC',      // 几乎白色但不是纯白
            secondary: '#94A3B8',    // 更淡的次要文本色，与浅色模式统一
            muted: '#64748B'
          },
          border: {
            DEFAULT: '#475569',
            muted: '#334155'
          }
        }
      },
      fontFamily: {
        'sans': ['SourceHanSans-VF', 'PingFang SC', 'system-ui', 'sans-serif'],
        'serif': ['SourceHanSerif-VF', 'PingFang SC', 'serif'],
        'playful': ['AlimamaFangYuanTiVF', 'SourceHanSans-VF', 'sans-serif'],
        'variable': ['SourceHanSans-VF', 'Inter-Variable', 'system-ui', 'sans-serif']
      },
      fontWeight: {
        'variable-light': '300',
        'variable-normal': '400',
        'variable-medium': '500',
        'variable-semibold': '600',
        'variable-bold': '700'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      height: {
        'screen-dynamic': '100dvh'
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      backdropBlur: {
        'xs': '2px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}

export default config