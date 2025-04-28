const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { UserscriptPlugin } = require('webpack-userscript');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/main.js',

  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: isProduction ? 'build.user.js' : '[name].[fullhash].js',  // 这里动态切换！
    clean: true,
  },

  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: { maxSize: 1000 }
        },
        generator: { filename: '[name][ext]' }
      }
    ]
  },

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js'
    },
    extensions: ['.js', '.vue', '.json']
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    devMiddleware: {
      publicPath: '/',   // 热更新正确路由
    },
    hot: true,
    open: true
  },

  performance: { hints: false },

  plugins: [
    new VueLoaderPlugin(),

    // 合并DefinePlugin，不要写两次
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
    }),

    // 调试用HTML，只插入我们想要的build.user.js
    new HtmlWebpackPlugin({
      template: './index.html',
      scriptLoading: 'defer',
      filename: 'index.html',
      inject: 'body',
      chunks: 'all',  // 默认就all，保险起见写一下
    }),

    // 只有生产模式才打油猴脚本
    ...(isProduction ? [new UserscriptPlugin({
      headers: {
        name: '修改为你的插件名称',
        namespace: 'http://tampermonkey.net/',
        version: '1.0.0',
        description: '修改为你的插件描述',
        match: ['https://*/*'],
        grant: 'none'
      },
    })] : []),
  ],

  mode: isProduction ? 'production' : 'development',

  optimization: {
    minimize: false,
    minimizer: [],   // 确保没有插件参与压缩
  },

  devtool: isProduction ? false : 'eval-source-map'
};
