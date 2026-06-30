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
        ufrrj: {
          blue: "#2F5597",
          green: "#009A44",
          yellow: "#F5D547",
          dark: "#17324D",
          light: "#F6F8F4",
          border: "#DDE5D6",
        },
      },
    },
  },
  plugins: [],
}
export default config