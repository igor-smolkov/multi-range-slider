const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// определение режима сборки
const isDev = process.env.NODE_ENV === 'development';

// имена файлов
const pluginName = 'jquery.my-jquery-slider';
const entryPoint = 'main.ts';
const mainPage = 'pages/main-demo/index.pug';
const fontsDir = 'assets/fonts';
const faviconsDir = 'assets/favicons';
const pagesDir = 'pages';
const pagesNames = ['default', 'vertical', 'vertical-full-size', 'horizontal-sliders', 'simple-demo'];

// сборка имен
const filename = (ext) => `[name].${ext}`;

const packHTMLWebpackPlugin = (input, output, chunk) => new HtmlWebpackPlugin({
  template: `./${input}`,
  filename: output,
  minify: {
    collapseWhitespace: !isDev,
  },
  chunks: [chunk],
  favicon: `${faviconsDir}/favicon.ico`,
});

const packHTMLPages = (dir, pages) => pages.map((page) => packHTMLWebpackPlugin(`${dir}/${page}/${page}.pug`, `${dir}/${page}.html`, `${page}`));

module.exports = {
  mode: isDev ? 'development' : 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    port: 4400,
    hot: true,
    open: true,
  },
  devtool: isDev ? 'source-map' : false,

  context: path.resolve(__dirname, 'src'), // папка исходников

  entry: {
    main: `./${entryPoint}`,
    [`${pluginName}/${pluginName}`]: `./${pluginName}/${pluginName}`,
    [`${pagesNames[0]}`]: `./${pagesDir}/${pagesNames[0]}/${pagesNames[0]}.ts`,
    [`${pagesNames[1]}`]: `./${pagesDir}/${pagesNames[1]}/${pagesNames[1]}.ts`,
    [`${pagesNames[2]}`]: `./${pagesDir}/${pagesNames[2]}/${pagesNames[2]}.ts`,
    [`${pagesNames[3]}`]: `./${pagesDir}/${pagesNames[3]}/${pagesNames[3]}.ts`,
    [`${pagesNames[4]}`]: `./${pagesDir}/${pagesNames[4]}/${pagesNames[4]}.ts`,
  },
  output: {
    library: 'myJQuerySlider',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
    filename: filename('js'),
  },

  plugins: [
    packHTMLWebpackPlugin(mainPage, 'index.html', 'main'),
    ...packHTMLPages(pagesDir, pagesNames),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, `src/${faviconsDir}/`), to: faviconsDir }],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.scss/,
        enforce: 'pre',
        loader: 'import-glob-loader',
      },
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
