import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#080C0F',
          1: '#0D1318',
          2: '#111820',
          3: '#162030',
        },
        border: {
          DEFAULT: '#1E2D3D',
          2: '#243040',
        },
        green: {
          DEFAULT: '#00E676',
          dim: '#00C853',
        },
        red: {
          trade: '#FF4444',
        },
        amber: {
          trade: '#FFB300',
        },
        blue: {
          trade: '#4FC3F7',
        },
        text: {
          primary: '#E8EDF2',
          secondary: '#8899AA',
          muted: '#4A6070',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
      },
    },
  },
  plugins: [],
}
export default config
