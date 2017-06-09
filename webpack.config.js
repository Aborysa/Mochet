const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const CLIENT_SRC = path.resolve(__dirname,'./app/src');

const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
  disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: [path.join(CLIENT_SRC,'./index.jsx')],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  resolve: {
    modules: [
      CLIENT_SRC,
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?[a-z0-9=&.]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {loader: 'css-loader'},
            {loader: 'sass-loader',options:{
              includePaths: [path.join(CLIENT_SRC,'./assets'),'node_modules/compass-mixins/lib']
            }}
          ],
          fallback: 'style-loader'
        })
      }
    ],
  },
  plugins: [
    /*new HtmlWebpackPlugin({
      template: 'app/index.html',
    }),*/
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => (
        module.context && module.context.indexOf('node_modules') !== -1
      ),
    }),
    extractSass,
  ],
};