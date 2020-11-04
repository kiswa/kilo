const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const ROOT = path.resolve(__dirname, 'src')
const DEST = path.resolve(__dirname, 'dist')

module.exports = {
  context: ROOT,

  entry: { main: './main.ts' },

  output: {
    path: DEST,
    filename: '[name].bundle.js'
  },

  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),

    new CopyWebpackPlugin({
      patterns: [{ from: '../assets/', to: DEST + '/assets/' }]
    }),
  ],

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      ROOT,
      'node_modules'
    ]
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        use: 'source-map-loader'
      },

      {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'tslint-loader'
      },

      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: 'ts-loader'
      }
    ]
  },

  optimization: {
    usedExports: true,
  },

  optimization: {
    usedExports: true,
  },

  devtool: 'cheap-module-source-map',

  devServer: {
    overlay: true,
    stats: 'minimal'
  }
}
