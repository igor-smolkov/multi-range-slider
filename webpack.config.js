const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

const isDev = process.env.NODE_ENV === 'development';

const pluginName = 'jquery.my-jquery-slider';
const entryPoint = 'main.ts';
const mainPage = 'pages/main-demo/index.pug';
const fontsDir = 'assets/fonts';
const faviconsDir = 'assets/favicons';
const pagesDir = 'pages';
const pagesNames = ['simple-demo'];

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
  devServer: {
    port: 4400,
    hot: true,
    open: true,
  },
  devtool: isDev ? 'source-map' : false,

  context: path.resolve(__dirname, 'src'),

  entry: {
    main: `./${entryPoint}`,
    [`${pluginName}/${pluginName}`]: `./${pluginName}/${pluginName}`,
    'simple-demo': `./${pagesDir}/simple-demo/init.ts`,
  },
  output: {
    library: 'myJQuerySlider',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
    filename: filename('js'),
  },

  plugins: [
    new LiveReloadPlugin({ appendScriptTag: true }),
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
