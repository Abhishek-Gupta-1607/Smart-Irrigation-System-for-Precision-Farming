/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        agri: {
          dark: '#0f172a',
          card: '#1e293b',
          primary: '#10b981', // emerald-500
          secondary: '#3b82f6', // blue-500
          accent: '#8b5cf6', // violet-500
          warning: '#f59e0b',
          danger: '#ef4444',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
