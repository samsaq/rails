/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        neue: ['Neue Hass Grotesk Display', 'sans-serif'],
        futura: ['Futura', 'sans-serif'],
        epoca: ['Epoca Pro Medium Italic', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        night: {
          ...require('daisyui/src/theming/themes')['[data-theme=night]'],
          '--rounded-box': '0rem',
          '--rounded-btn': '0rem',
          '--rounded-badge': '0rem',
          '--tab-radius': '0rem',
        },
      },
    ],
  },
};
