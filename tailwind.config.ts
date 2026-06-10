import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        sand: '#f5efe6',
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#b8daff',
          300: '#88c1ff',
          400: '#4ea1ff',
          500: '#1d7cff',
          600: '#175fe0',
          700: '#174db5',
          800: '#163f91',
          900: '#163878'
        }
      },
      boxShadow: {
        soft: '0 20px 60px rgba(17, 24, 39, 0.12)'
      },
      backgroundImage: {
        'dashboard-grid': 'radial-gradient(circle at 1px 1px, rgba(29, 124, 255, 0.16) 1px, transparent 0)'
      }
    }
  },
  plugins: []
};

export default config;
