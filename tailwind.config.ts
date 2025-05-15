// tailwind.config.ts or tailwind.config.js
module.exports = {
    darkMode: 'class',
    content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
    theme: {
      extend: {
        colors: {
          brand: {
            DEFAULT: '#eb5424',
            surface: '#0a0a0a',
            card: '#111111',
            accent: '#915eff',
          },
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
      },
    },
  };
  