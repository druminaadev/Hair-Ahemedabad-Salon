import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        salon: {
          100: '#FF9898', // light pink
          400: '#CF455C', // rose
          600: '#971549', // deep rose
          900: '#470031', // dark burgundy
        },
      },
    },
  },
  plugins: [],
}
export default config
