/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/**/*.html', 
    './src/**/*.{js,jsx,ts,tsx}', 
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFA500', 
        'primary-hover': '#ff7b00',
        gray: {
          DEFAULT: '#333333', 
          light: '#f4f4f4', 
        },
      },
      fontSize: {
        base: '1rem', 
        lg: '1.25rem', 
        xl: '1.5rem', 
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'], 
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
};
