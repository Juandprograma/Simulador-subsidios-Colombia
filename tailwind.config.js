/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0a',
        'bg-secondary': '#1a1a1a',
        'bg-tertiary': '#2a2a2a',
        'accent-gold': '#d4af37',
        'accent-yellow': '#f4d03f',
        'text-primary': '#ffffff',
        'text-secondary': '#b0b0b0',
        'success': '#10b981',
        'warning': '#f59e0b',
        'danger': '#ef4444',
      },
      maxWidth: {
        'simulador': '800px',
      },
      borderRadius: {
        'simulador': '16px',
      },
      boxShadow: {
        'premium': '0 10px 40px rgba(212, 175, 55, 0.1)',
      },
    },
  },
  plugins: [],
}
