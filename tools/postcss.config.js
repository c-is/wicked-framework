module.exports = () => ({
  plugins: [
    require('precss')(),
    require('postcss-center')(),
    require('postcss-functions')({
        functions: {
          grid: ($width, $columns, $margin) => ($width / $columns) - ($margin * 2),
          'strip-units': $value => $value / (($value * 0) + 1),
        },
    }),
    require('postcss-size')(),
    require('postcss-conditionals')(),
    require('postcss-cssnext')({
        autoprefixer: {
          browsers: ['last 2 version', 'ie 9', 'ios 6', 'android 4'],
        },
        core: false,
        features: { rem: false },
    }),
    require('lost')(),
    require('rucksack-css')({
        autoprefixer: false,
    }),
    require('css-mqpacker')(),
    require('cssnano')({
        autoprefixer: false,
    }),
  ],
});
