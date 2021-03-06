/**
 * Webpack shared config
 * The shared loaders, plugins, and processing that all our "apps" should use for dev.
 */

// Library Imports
const path = require('path');
const webpack = require('webpack');

// Loaders
const autoprefixer = require('autoprefixer');
const sassExportData = require('@theme-tools/sass-export-data')({
  name: 'export_data',
  path: path.resolve(__dirname, 'source/_data/'),
});

// Plugins
const StyleLintPlugin = require('stylelint-webpack-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

// Custom Imports
const { PATH_SOURCE } = require('./config');

// Helps us track down deprecation during development
// process.traceDeprecation = true;

module.exports = {
  mode: 'development',
  // See webpack.[app].dev.js for entry points
  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.resolve(__dirname, 'dist/assets/'),
    publicPath: '/assets/',
  },
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 2 },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              ident: 'postcss',
              plugins: () => [autoprefixer()],
            },
          },
          { loader: 'resolve-url-loader' },
          {
            loader: 'sass-loader',
            options: { sourceMap: true, functions: sassExportData },
          },
        ],
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        },
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
      // Pattern Lab assets on the dependency chain
      {
        test: /\.(twig|yml|md)$/,
        loader: 'file-loader',
        options: {
          emitFile: false,
        },
      },
      // Used by Pattern Lab app to import all demo folder twig files
      {
        test: /\.(glob)$/,
        loader: 'glob-loader',
      },
    ],
  },
  plugins: [
    // Provides "global" vars mapped to an actual dependency. Allows e.g. jQuery plugins to assume
    // that `window.jquery` is available
    new webpack.ProvidePlugin({
      // Bootstrap is dependant on jQuery and Popper
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
    }),
    // Yell at us while writing Sass
    new StyleLintPlugin(),
    new SVGSpritemapPlugin({
      src: path.resolve(
        __dirname,
        PATH_SOURCE,
        '_patterns/01-atoms/svgicon/svg/**/*.svg'
      ),
      styles: path.resolve(
        __dirname,
        PATH_SOURCE,
        '_patterns/01-atoms/svgicon/scss/_icons-generated.scss'
      ),
      svg4everybody: true,
    }),
  ],
  // Shorthand to import modules, i.e. `import thing from 'atoms/thing'`
  resolve: {
    alias: {
      protons: path.resolve(__dirname, PATH_SOURCE, '_patterns/00-protons/'),
      atoms: path.resolve(__dirname, PATH_SOURCE, '_patterns/01-atoms/'),
      molecules: path.resolve(
        __dirname,
        PATH_SOURCE,
        '_patterns/02-molecules/'
      ),
      organisms: path.resolve(
        __dirname,
        PATH_SOURCE,
        '_patterns/03-organisms/'
      ),
      templates: path.resolve(
        __dirname,
        PATH_SOURCE,
        '_patterns/04-templates/'
      ),
      pages: path.resolve(__dirname, PATH_SOURCE, '_patterns/05-pages/'),
    },
  },
};
