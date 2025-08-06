/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1D4ED8", // Blue
        secondary: "#F9FAFB", // Light background
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        // NEW: Keyframes for horizontal infinite scroll
        'scroll-x': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        // NEW: Animation utility class for the scroll loop
        'scroll-x': 'scroll-x 30s linear infinite',
      },
    },
  },
    
  plugins: [
    require('@tailwindcss/line-clamp'),
    // NEW: Plugin to allow `hover:pause-animation` class
    function ({ addUtilities }) {
      const newUtilities = {
        '.pause-animation': {
          'animation-play-state': 'paused',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  // NEW: Plugin to hide the scrollbar
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* For Webkit-based browsers (Chrome, Safari) */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          /* For Firefox */
          'scrollbar-width': 'none',
          /* For Internet Explorer and Edge */
          '-ms-overflow-style': 'none',
        },
      });
    },
  ],
}