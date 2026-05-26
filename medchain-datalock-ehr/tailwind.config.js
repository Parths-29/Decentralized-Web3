/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        heading: ['DM Sans', 'sans-serif'],
      },
      colors: {
        black: '#0A0A0B',
        white: '#FAFAF9',
        surface: '#F4F4F2',
        elevated: '#FFFFFF',
        teal: {
          50: '#f0fdfa', // Hover bg
          100: '#ccfbf1', // Badge fill
          400: '#2dd4bf', // Border
          600: '#0d9488', // Primary
          900: '#134e4a', // Text on teal bg
        },
        slate: {
          ...require('tailwindcss/colors').slate,
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      boxShadow: {
        'premium-sm': '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        'premium-md': '0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        'premium-hover': '0 2px 4px rgba(0,0,0,0.04), 0 20px 48px rgba(0,0,0,0.10)',
        'teal-glow': '0 4px 20px rgba(13,148,136, 0.35)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      screens: {
        'md': '768px', // Explicit tablet breakpoint
      }
    },
  },
  plugins: [],
}