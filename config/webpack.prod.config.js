const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  // Don't attempt to continue if there are any errors.
  bail: true,
  entry: [
    // TODO: add polyfill
    // TODO: add vendor chunk
    './src/index.jsx',
  ],
  output: {
    path: './build',
    filename: 'scripts.min.js',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                minimize: true,
                localIdentName: '[name]__[local]_[hash:base64:2]',
                // That many loaders after the css-loader are used to import
                // resources.
                importLoaders: 1,
              },
            },
            { loader: 'postcss-loader' },
          ],
        }),
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
      {
        exclude: [
          /\.jsx?$/,
          /\.css$/,
          /\.json$/,
        ],
        use: 'url-loader',
        query: {
          limit: 10000,
          name: 'build/static/media/[name]_[hash:8].[ext]',
        },
      },
    ],
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          cssImport(),
          cssNext(),
        ],
      },
    }),
    new ExtractTextPlugin('styles.min.css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // Ensure the builds are consistent if source hasn't changed.
    new webpack.optimize.OccurrenceOrderPlugin(),
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        screw_ie8: true,
        comments: false,
      },
    }),
  ],
};
