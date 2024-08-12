const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './assets/js/main.js',
    // Removed scrollreveal or other extra entry points as per your comment
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/js/[name].js', // No hash in filenames for simplicity
    clean: true, // Clean the output directory before each build
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
        include: path.resolve(__dirname, 'assets/css'),
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css', // No hash in filenames
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // Optional: Customize Terser options here
      }),
      new CssMinimizerPlugin({
        // Optional: Customize CSS minimizer options here
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  devtool: 'source-map',
};
