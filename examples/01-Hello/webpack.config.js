const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
        use: 'awesome-typescript-loader'
      }
    ]
  },

  devtool: 'cheap-module-source-map',

  devServer: {
    overlay: true,
    stats: 'minimal'
  }
}
