const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    require('autoprefixer'),
    purgecss({
      content: ['./src/**/*.html', './src/**/*.js'],
      safelist: ['safe-class'], // Add any classes you want to keep
    }),
  ],
};


