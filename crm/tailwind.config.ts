import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const v = (name: string) => `oklch(var(${name}) / <alpha-value>)`

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: v('--background'),
        foreground: v('--foreground'),
        card: { DEFAULT: v('--card'), foreground: v('--foreground') },
        primary: { DEFAULT: v('--primary'), foreground: v('--primary-foreground') },
        accent: { DEFAULT: v('--accent'), foreground: v('--accent-foreground') },
        secondary: { DEFAULT: v('--secondary'), foreground: v('--foreground') },
        muted: { DEFAULT: v('--muted'), foreground: v('--muted-foreground') },
        border: v('--border'),
        ring: v('--ring'),
        success: { DEFAULT: v('--success'), ink: v('--success-ink') },
        warning: { DEFAULT: v('--warning'), ink: v('--warning-ink') },
        info: { DEFAULT: v('--info'), ink: v('--info-ink') },
        destructive: { DEFAULT: v('--destructive'), foreground: v('--primary-foreground') },
        sidebar: {
          DEFAULT: v('--sidebar'),
          foreground: v('--sidebar-foreground'),
          muted: v('--sidebar-muted'),
          accent: v('--sidebar-accent'),
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        lift: 'var(--shadow-lift)',
        glow: 'var(--shadow-glow)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 oklch(var(--primary) / 0.0)' },
          '50%': { boxShadow: 'var(--shadow-glow)' },
        },
      },
      animation: { 'pulse-glow': 'pulse-glow 2.8s ease-in-out infinite' },
    },
  },
  plugins: [animate],
} satisfies Config
