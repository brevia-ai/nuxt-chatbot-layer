const colors = require('tailwindcss/colors');

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: colors.sky[700],
        secondary: colors.slate[700],
        danger: colors.pink[900],
      },
      height: {
        dynamic: 'calc(100dvh - var(--header-height) - var(--input-height))',
      },
    },
  },
};
