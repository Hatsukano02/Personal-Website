import type { Config } from 'tailwindcss'

const config: Config & { safelist?: string[] } = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  safelist: [
    // 确保自定义颜色被包含在构建中
    'bg-light-background-primary',
    'bg-light-background-secondary', 
    'bg-light-background-tertiary',
    'bg-dark-background-primary',
    'bg-dark-background-secondary',
    'bg-dark-background-tertiary',
    'text-light-text-primary',
    'text-light-text-secondary',
    'text-light-text-muted',
    'text-dark-text-primary',
    'text-dark-text-secondary', 
    'text-dark-text-muted',
    'border-light-border-default',
    'border-light-border-muted',
    'border-dark-border-default',
    'border-dark-border-muted'
  ],
  theme: {
    extend: {
      colors: {
        'light-primary': '#087E8B',
        'light-secondary': '#C7FFDA', 
        'light-accent': '#0A2342',
        'light-background-primary': '#FEFEFE',
        'light-background-secondary': '#F9FAFB',
        'light-background-tertiary': '#F3F4F6',
        'light-text-primary': '#1F2937',
        'light-text-secondary': '#4B5563',
        'light-text-muted': '#6B7280',
        'light-border-default': '#1F2937',    // 日间模式：深色边框
        'light-border-muted': '#374151',
        
        'dark-primary': '#4a8c8c',
        'dark-secondary': '#fab062',
        'dark-accent': '#011126', 
        'dark-background-primary': '#1C1C1E',
        'dark-background-secondary': '#2C2C2E',
        'dark-background-tertiary': '#3A3A3C',
        'dark-text-primary': '#F8FAFC',
        'dark-text-secondary': '#CBD5E1',
        'dark-text-muted': '#94A3B8',
        'dark-border-default': '#F8FAFC',     // 夜间模式：白色边框
        'dark-border-muted': '#E2E8F0',
        
        // 特殊效果颜色
        'old-gold': '#d9b70d'
      },
      fontFamily: {
        'sans': ['SourceHanSans-VF', 'PingFang SC', 'system-ui', 'sans-serif'],
        'serif': ['SourceHanSerif-VF', 'PingFang SC', 'serif'],
        'playful': ['SourceHanSans-VF', 'sans-serif'],
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