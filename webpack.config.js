const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

//определение режима сборки
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

//имена файлов
const entryPoint = 'main.ts';
const mainPage = 'index.pug';
const indexPage = 'index.html';

//сборка имен
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

module.exports = {
  context: path.resolve(__dirname, 'src'), //папка исходников

  entry: `./${entryPoint}`,

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      }
    ],
  },

  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },

  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },

  devServer: {
    port: 4200,
    hot: isDev,
    open: true
  },

  devtool: isDev ? 'source-map' : false,

  plugins: [
    new HtmlWebpackPlugin({
      template: `./${mainPage}`,
      filename: indexPage,
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
  ],
};