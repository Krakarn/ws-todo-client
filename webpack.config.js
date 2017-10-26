const webpack = require('webpack');
const path = require('path');

const cfg = require('./webpack/cfg.json');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: cfg.paths.entry,
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, cfg.paths.dist),
    filename: cfg.paths.outFile
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        test: /\.(css)$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: function() {
              return [
                require('precss'),
                require('autoprefixer'),
              ];
            },
          },
        }],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
    }),
    new HtmlWebpackPlugin(),
  ],
};
