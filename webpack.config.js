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
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
};
