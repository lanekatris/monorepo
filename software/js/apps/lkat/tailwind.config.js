const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'pages/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, 'components/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
  safelist: ['text-red-500', 'text-green-500'],
};
