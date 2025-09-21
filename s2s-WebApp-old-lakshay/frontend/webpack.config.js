const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const path = require('path')
const webpack = require('webpack')

require('dotenv').config()

module.exports = async (env, options) => {
  const isDevelopment = options.mode === 'development'

  const config = {
    mode: isDevelopment ? 'development' : 'production',
    entry: {
      vendor: ['react', 'react-dom'],
      main: ['./src/index.tsx'],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    resolve: {
      alias: {
        synth: path.resolve(__dirname, './../packages/synth/'),
        authorization: path.resolve(__dirname, './../packages/authorization/'),
      },
      extensions: ['.ts', '.tsx', '.js'],
      extensionAlias: {
        '.js': ['.js', '.ts'],
        '.cjs': ['.cjs', '.cts'],
        '.mjs': ['.mjs', '.mts'],
      },
      fallback: {
        crypto: false,
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        url: require.resolve('url'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
        },
        {
          test: /\.(s*)css$/,
          exclude: /node_modules/,
          use: [
            { loader: MiniCssExtractPlugin.loader, options: { publicPath: './public/' } },
            { loader: 'css-loader' },
            { loader: 'postcss-loader' },
          ],
        },
        {
          test: /\.(png|jpe?g|webp|gif|svg|woff|woff2|ttf|eot|ico)$/,
          use: { loader: 'file-loader' },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/template/index.ejs',
        chunks: ['main', 'vendor', 'polyfills'],
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: 'public' }],
      }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
    ],
    devServer: {
      historyApiFallback: true,
      static: {
        directory: path.join(__dirname, 'public'),
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
      port: 3030,
      compress: true,
    },
    optimization: { runtimeChunk: 'single' },
    devtool: isDevelopment ? 'inline-source-map' : 'source-map',
  }

  if (isDevelopment) {
    config.optimization.minimizer = [new TerserWebpackPlugin()]
  } else {
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 50000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
            return `npm.${packageName.replace('@', '')}`
          },
        },
      },
    }
    config.plugins.push(
      new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
      new CompressionPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: /\.(js|css|html|svg)$/,
        compressionOptions: {
          level: 11,
        },
        threshold: 10240,
        minRatio: 0.8,
      }),
    )
  }

  return config
}
