import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        salon: {
          50:  '#fff0f3',
          100: '#FF9898',
          200: '#f9a8b8',
          400: '#CF455C',
          600: '#971549',
          900: '#470031',
        },
      },
      ringColor: {
        salon: '#CF455C',
      },
    },
  },
  plugins: [],
}
export default config
