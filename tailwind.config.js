/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sidebar: '#171717',
        chat: '#212121',
        border: '#2f2f2f',
        input: '#40414f',
        message: '#343541',
        'message-user': '#444654',
      },
    },
  },
  plugins: [],
}
