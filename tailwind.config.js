/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./project.html",
    "./app.js",
    "./app.min.js",
    "./analytics.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81'
        },
        accent: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE'
        },
        emerald: {
          50: '#ECFDF5',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857'
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A'
        },
        dark: {
          900: '#030712',
          800: '#0c1322',
          700: '#111827',
          600: '#1f2937',
          500: '#374151'
        }
      },
      spacing: {
        '13': '3.25rem',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'emerald': '0 12px 28px -6px rgba(16, 185, 129, 0.28)',
        'brand': '0 12px 28px -6px rgba(79, 70, 229, 0.28)',
      },
      transitionDelay: {
        '250': '250ms',
      },
      scale: {
        '102': '1.02',
      },
      opacity: {
        '88': '0.88',
        '92': '0.92',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards'
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        }
      }
    }
  },
  plugins: [],
}
