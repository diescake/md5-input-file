var webpack = require('webpack');
var path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

module.exports = (env, argv) => {
  const OUT_PATH = path.join(__dirname, './dist');
  const SRC_PATH = path.join(__dirname, './src');
  const IS_PRODUCTION = argv.mode === 'production';

  return {
    mode: IS_PRODUCTION ? 'production' : 'development',
    context: SRC_PATH,
    entry: {
      app: './index.js'
    },
    output: {
      path: OUT_PATH,
      filename: 'bundle.js',
      chunkFilename: '[chunkhash].js',
      publicPath: '/'
    },
    target: 'web',
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      // Fix webpack's default behavior to not load packages with jsnext:main module
      // (jsnext:main directs not usually distributable es6 format, but es6 sources)
      mainFields: ['module', 'browser', 'main'],
      alias: {
        app: path.resolve(__dirname, `${SRC_PATH}/app/`)
      }
    },
    module: {
      rules: [
        // .ts, .tsx
        {
          test: /\.tsx?$/,
          use: IS_PRODUCTION ? 'ts-loader' : ['babel-loader?plugins=react-hot-loader/babel', 'ts-loader']
        },
        // static assets
        {
          test: /\.(yaml|yml)?$/,
          use: [
            {
              loader: require.resolve('json-loader')
            },
            {
              loader: require.resolve('yaml-loader')
            }
          ]
        },
        { test: /\.html$/, use: 'html-loader' },
        { test: /\.(png|svg)$/, use: 'url-loader?limit=10000' },
        { test: /\.(jpg|gif)$/, use: 'file-loader' }
      ]
    },
    optimization: {
      splitChunks: {
        name: true,
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: -10
          }
        }
      },
      runtimeChunk: true
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
        DEBUG: false
      }),
      new WebpackCleanupPlugin(),
      new HtmlWebpackPlugin({
        template: 'index.html'
      })
    ],
    devServer: {
      contentBase: SRC_PATH,
      hot: true,
      inline: true,
      historyApiFallback: {
        disableDotRule: true
      },
      stats: 'minimal'
    },
    node: {
      fs: 'empty',
      net: 'empty'
    }
  };
};
