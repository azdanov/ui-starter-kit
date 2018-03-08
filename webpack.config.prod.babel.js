import path from 'path';
import glob from 'glob';
import webpack from 'webpack';
import PurifyCSSPlugin from 'purifycss-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src', 'scripts', 'index.js'),
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: ['css-hot-loader'].concat(
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  minimize: true,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
          }),
        ),
      },
    ],
  },
  devServer: {
    contentBase: './dist',
    hot: true,
    open: true,
  },
  plugins: [
    new UglifyJsPlugin({
      parallel: true,
      cache: true,
      sourceMap: true,
    }),
    new ExtractTextPlugin('[name].css'),
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'dist/*.html')),
      minimize: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['index'],
      template: path.resolve(__dirname, 'src', 'index.html'),
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
