/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a365d',
          50: '#f0f4fa',
          100: '#dbe5f0',
          200: '#b8cce1',
          300: '#8ba8c9',
          400: '#5d83ad',
          500: '#3d6391',
          600: '#2d4f78',
          700: '#1a365d',
          800: '#142a48',
          900: '#0f1f35',
        },
        secondary: {
          DEFAULT: '#e07b39',
          50: '#fdf5ef',
          100: '#fae6d5',
          200: '#f4cba8',
          300: '#edab74',
          400: '#e8914f',
          500: '#e07b39',
          600: '#c9662b',
          700: '#a85022',
          800: '#873f1e',
          900: '#6d341b',
        },
        light: '#f8fafc',
        dark: '#1e293b',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.06), 0 4px 16px -4px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px -4px rgba(0, 0, 0, 0.06)',
        'elevated': '0 8px 32px -4px rgba(0, 0, 0, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
