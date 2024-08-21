const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const JavaScriptObfuscator = require('javascript-obfuscator');

module.exports = {
  mode: 'production', // Set to 'development' for development mode
  entry: './assets/js/main.js', // Path to your main JavaScript file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean the output directory before emit
    assetModuleFilename: 'assets/[name][ext]', // Handle asset file names
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Path to your HTML file
      filename: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyCSS: true,
        minifyJS: true,
      }, // Minify HTML
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css', // Output CSS filenames with content hash
    }),
    new CleanWebpackPlugin(), // Clean the output directory before emit
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS into separate files
          'css-loader', // Handle CSS imports
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext][query]', // Specify output directory for images
        },
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], // Transpile modern JavaScript
          },
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(), // Minimize CSS
      new TerserPlugin({ // Minimize JavaScript
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      {
        apply: (compiler) => {
          compiler.hooks.compilation.tap('ObfuscatePlugin', (compilation) => {
            compilation.hooks.processAssets.tapAsync(
              {
                name: 'ObfuscatePlugin',
                stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
              },
              (assets, callback) => {
                const bundlePath = path.resolve(__dirname, 'dist/bundle.js');
                // Only obfuscate if bundle.js exists
                if (fs.existsSync(bundlePath)) {
                  fs.readFile(bundlePath, 'utf8', (err, bundleContent) => {
                    if (err) return callback(err);
                    const obfuscatedContent = JavaScriptObfuscator.obfuscate(bundleContent, {
                      compact: true,
                      controlFlowFlattening: true,
                    }).getObfuscatedCode();
                    fs.writeFile(bundlePath, obfuscatedContent, (err) => {
                      if (err) return callback(err);
                      callback();
                    });
                  });
                } else {
                  callback();
                }
              }
            );
          });
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'], // Resolve .js files
  },
};
