const path = require('path');
const webpack = require('webpack');
const {VueLoaderPlugin} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {UserscriptPlugin} = require('webpack-userscript');

// 生成版本号：格式为 YYYY-MM-DD-HHmmss
const getVersion = () => {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1); // 月份从 0 开始
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());

  return `${year}-${month}-${day}-${hour}${minute}${second}`;
};

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
      {test: /\.vue$/, loader: 'vue-loader'},
      {test: /\.js$/, use: 'babel-loader', exclude: /node_modules/},
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {maxSize: 1000}
        },
        generator: {filename: '[name][ext]'}
      },
      {
        test: /\.worker\.js$/,
        use: 'raw-loader',
        type: 'javascript/auto', // 必须加，不然 webpack 5 有可能警告
      }
    ]
  },

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js',
      '@': path.resolve(__dirname, './src'),
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

  performance: {hints: false},

  plugins: [
    new VueLoaderPlugin(),

    // 合并DefinePlugin，不要写两次
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
    }),

    ...(isProduction ? [] : [
      new HtmlWebpackPlugin({
        template: './index.html',
        scriptLoading: 'defer',
        filename: 'index.html',
        inject: 'body',
        chunks: 'all',
      }),
    ]),
    // 只有生产模式才打油猴脚本
    ...(isProduction ? [new UserscriptPlugin({
      headers: {
        name: '微信读书-WEB端自动阅读插件',
        namespace: 'https://github.com/diduweiwu',
        version: getVersion(),
        license: 'MIT',
        description: '① 打开一本书的微信读书界面,点击界面右中方“读”字按钮，然后修改相应配置，再打开“自动阅读”到开启即可 ② 如果需要后台刷时长，请一定记得开启 **定时翻页** 开关 ③ Edge 浏览器请关闭TAB休眠或者在休眠配置里面排除 https://weread.qq.com',
        author: "纯白约定",
        grant: '纯白约定',
        match: ['https://weread.qq.com/*'],
      },
      metajs: false,
    })] : []),
  ],

  mode: isProduction ? 'production' : 'development',

  optimization: {
    splitChunks: false,
    runtimeChunk: false,
    minimize: false,
    minimizer: [],   // 确保没有插件参与压缩
  },

  devtool: isProduction ? false : 'eval-source-map'
};
