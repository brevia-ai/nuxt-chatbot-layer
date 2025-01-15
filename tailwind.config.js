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
        dynamic: 'calc(80vh - var(--header-height))',
        'dynamic-sm': 'calc(85vh - var(--header-height))',
      },
    },
  },
};
