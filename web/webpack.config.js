const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ENV = process.env.NODE_ENV || 'development';

module.exports = {
  entry: `${__dirname}/app/index.js`,

  output: {
    path: `${__dirname}/app/build/`,
    publicPath: __dirname,
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['.jsx', '.js', '.css'],
    alias: {
      style: `${__dirname}/app/style/`,
    },
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: `${__dirname}/node_modules/`,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader',
        }),
      },
    ],
  },

  plugins: ([
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV),
    }),
  ]),

  stats: {
    colors: true,
  },

  devServer: {
    disableHostCheck: true,
  },
};
