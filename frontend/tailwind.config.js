/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#b0b0b0',
          300: '#808080',
          400: '#505050',
          500: '#303030',
          600: '#202020',
          700: '#181818',
          800: '#101010',
          900: '#080808',
          950: '#050505',
        },
        accent: {
          DEFAULT: '#C41230',
          light: '#E01A3E',
          dark: '#A00E26',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          border: 'rgba(255,255,255,0.08)',
          hover: 'rgba(255,255,255,0.08)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        'app': '1440px',
      }
    },
  },
  plugins: [],
}
