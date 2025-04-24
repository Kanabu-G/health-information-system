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
          primary: {
            DEFAULT: '#F59E0B', // Amber-500
            dark: '#D97706',    // Amber-600
            light: '#FBBF24',   // Amber-400
          },
          secondary: {
            DEFAULT: '#1F2937', // Gray-800
            dark: '#111827',    // Gray-900
            light: '#374151',   // Gray-700
          },
          background: {
            DEFAULT: '#111827', // Dark background
            light: '#F9FAFB',   // Light mode background
          },
          text: {
            DEFAULT: '#FFFFFF', // White for dark mode
            dark: '#111827',    // Gray-900 for light mode
            muted: '#D1D5DB',   // Gray-300
            highlight: '#FDE68A', // Amber-200
          }
        },
        fontFamily: {
          sans: ['var(--font-encode-sans)', 'ui-sans-serif', 'system-ui'],
        },
        borderRadius: {
          DEFAULT: '0.5rem',
        },
        boxShadow: {
          'amber-glow': '0 0 5px 2px rgba(245, 158, 11, 0.5)',
        },
      },
    },
    plugins: [require("rippleui")],
  }