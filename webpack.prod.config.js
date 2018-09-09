const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config.js')
const fs = require('fs')

/*
fs.open('./src/config/env.js', 'w', function (err, fd) {
    const buf = 'export default "production";';
    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer){});
});
*/

module.exports = merge(webpackBaseConfig, {
  output: {
    publicPath: './',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].chunk.js'
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: 'vendors.[hash].js'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // 压缩js
    new UglifyJsPlugin(),
    // 复制static目录
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: 'static',
        ignore: ['.*']
      }
    ]),
    /*new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),*/
    // 生成入口页面
    new HtmlWebpackPlugin({
      filename: './index_prod.html',
      template: './src/template/index.ejs',
      inject: false
    }),
    // 编译前清空dist目录
    new CleanWebpackPlugin(['dist'])
  ]
})