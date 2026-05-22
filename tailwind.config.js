/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0f2b4c",
          light: "#1a3f6e",
          dark: "#091e35",
        },
        gold: {
          DEFAULT: "#c9a227",
          light: "#e8c04a",
          dark: "#a07d12",
        },
        cream: "#f5f3ee",
        forest: "#1e6b52",
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
