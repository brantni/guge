var path = require('path');
var webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    devtool: "cheap-module-eval-source-map",
    // devtool: "cheap-module-source-map",      //生产环境
    // entry: ['webpack-dev-server/client?http://127.0.0.1:8080',//资源服务器地址
    //         'webpack/hot/dev-server','./src/main.js'
    //         ],
    entry: {
        main:'./src/main.js',
        photomain:'./src/photomain.js',
        babygrowth:'./src/babygrowth.js'
    },
    output: {
        publicPath: "http://localhost:8080/dist/",//不加域名就会去找node服务器的目录，无法启用模块热加载
        // publicPath: "/dist/",
        // filename: 'main.bundle.js',
        filename: '[name].bundle.js',
        // filename: '[name].[chunkhash].js',//添加md5后缀，以缓存(无法和dev-server共存)
        path: path.resolve(__dirname, 'dist')   //文件输出路径
    },
    //webpack-dev-server
    devServer: {
        // port: 8080,
        headers: { "Access-Control-Allow-Origin": "*" }﻿//需要找webpack-dev-server的目录，必须跨域
        // hot: true,
        // inline: true
        // host: '127.0.0.1',
        // disableHostCheck: true
        // inline: true
        // contentBase: './dist',
        // hot: true           //启用 webpack 的模块热替换特性，如已在package.json中配置过，则此处不用配置
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader?sourceMap', 'sass-loader','autoprefixer-loader' ]
            },
            {
              test: /\.js$/,
              exclude: /(node_modules)/,
              use: [{
                loader: 'babel-loader',
                options: {
                  presets: ['es2015', 'react'],
                  plugins: ['syntax-dynamic-import']
                }
              }]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['*','.jsx','.js'],
        alias: {
            'jquery': path.resolve(__dirname, 'lib/jquery/jquery.js')
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            // PubSubEvent: 'pubSubEvent',
            // Util: 'util'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        }),
        new UglifyJSPlugin(),//压缩js
        // 在dist下自动生成index.html，并自动引用打包后的js
        new HtmlWebpackPlugin({     
            template:'baby.html',//以baby.html为模板，路径相对于项目根目录
            filename:'baby.html',//自动生成的文件名，路径相对于输出目录（dist）
            chunks:['main']      //需要插入到html文件中的脚本，脚本名称可从entry中选择
        }),
        new HtmlWebpackPlugin({     
            template:'babygrowth.html',
            filename:'babygrowth.html',
            chunks:['babygrowth']
        }),
        new HtmlWebpackPlugin({     
            template:'photo.html',
            filename:'photo.html',
            chunks:['photomain']
        }),
        new webpack.NamedModulesPlugin(),
        // new webpack.HotModuleReplacementPlugin(),//package.json已配置，则无需在此添加此插件，切记！
        // 打包前先清空打包文件
        new CleanWebpackPlugin(
            ['dist'],
            {
                root: __dirname,       　//根目录
                verbose:  true,        　//开启在控制台输出信息
                dry:      false        　//启用删除文件
            }
        ),
        new ManifestPlugin(),//生成映射的json文件
        new ExtractTextPlugin('[name].[contenthash:8].css')
        // new ExtractTextPlugin({
        //     disable:true
        // })
    ]
 };