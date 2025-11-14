/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#ffffff',
        'foreground': 'black',
        'russian-violet-2': '#240046ff',
        'persian-indigo': '#3c096cff',
        'tekhelet': '#5a189aff',
        'french-violet': '#7b2cbfff',
        'amethyst': '#9d4eddff',
        'heliotrope': '#c77dffff',
        'mauve': '#e0aaffff',
      },
    },
  },
  plugins: [],
}