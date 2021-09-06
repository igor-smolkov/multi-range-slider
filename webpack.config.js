const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// определение режима сборки
const isDev = process.env.NODE_ENV === 'development';

// имена файлов
const pluginName = 'jquery.my-jquery-slider';
const entryPoint = 'main.ts';
const mainPage = 'index.pug';
const indexPage = 'index.html';
const fontsDir = 'fonts';

// сборка имен
const filename = (ext) => `[name].${ext}`;

module.exports = {
  mode: isDev ? 'development' : 'production',
  devServer: {
    port: 4200,
    hot: true,
    open: true,
  },
  devtool: isDev ? 'source-map' : false,

  context: path.resolve(__dirname, 'src'), // папка исходников

  entry: {
    main: `./${entryPoint}`,
    [`${pluginName}`]: `./${pluginName}/${pluginName}`,
  },
  output: {
    library: 'myJQuerySlider',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
    filename: filename('js'),
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: `./${mainPage}`,
      filename: indexPage,
    }),
    new CleanWebpackPlugin(),
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
      {
        test: /\.(ttf|woff|otf|eot|svg|woff2)$/,
        loader: 'file-loader',
        options: {
          name: `${fontsDir}/${filename('[ext]')}`,
        },
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
