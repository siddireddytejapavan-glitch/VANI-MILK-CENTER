import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dairy: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
        },
        skycream: {
          50: '#f8fafc',
          100: '#f1f5f9',
          cream: '#fffdf7',
          milk: '#ffffff',
          blue: '#0284c7',
          deep: '#0369a1',
        },
      },
    },
  },
  plugins: [],
};
export default config;
