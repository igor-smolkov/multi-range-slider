const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// имена файлов
const entryPoint = 'main.ts';
const mainPage = 'index.pug';
const indexPage = 'index.html';

// сборка имен
const filename = (ext) => `[name].${ext}`;

module.exports = {
  mode: 'development',
  devServer: {
    port: 4200,
    hot: true,
    open: true,
  },
  devtool: 'source-map',

  context: path.resolve(__dirname, 'src'), // папка исходников

  entry: `./${entryPoint}`,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: filename('js'),
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: `./${mainPage}`,
      filename: indexPage,
    }),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
