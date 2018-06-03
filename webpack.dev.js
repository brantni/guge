const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = merge.smart(common, {
    devtool: "cheap-module-eval-source-map",
    output: {
        publicPath: "http://localhost:8080/dist/",//不加域名就会去找node服务器的目录，无法启用模块热加载
    },
    //webpack-dev-server
    devServer: {
        // port: 8080,
        headers: { "Access-Control-Allow-Origin": "*" }﻿//需要找webpack-dev-server的目录，必须跨域
        // host: '127.0.0.1',
        // disableHostCheck: true
        // inline: true
        // contentBase: './dist',
        // hot: true           //启用 webpack 的模块热替换特性，如已在package.json中配置过，则此处不用配置
    },
    module:{
        rules:[
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader?sourceMap', 'sass-loader','autoprefixer-loader' ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        })
    ]
 });