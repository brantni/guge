const merge = require('webpack-merge');
const path = require('path');
const webpack = require("webpack");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common.js');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = merge.smart(common, {
    devtool: "cheap-module-source-map",
    output: {
        filename: '[name].[chunkhash].js',//添加md5后缀，以缓存(无法和dev-server共存)
        path: path.resolve(__dirname, 'dist/script')
    },
    module:{
        rules:[
            {
                test: /\.scss$/,
                //将css提取成单独的文件，可以并行加载
                use: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
                  use: ['css-loader?minimize', 'sass-loader','autoprefixer-loader']
                })
            },
            {
    　　　　　　test: /\.(png|svg|jpg|gif)$/,
    　　　　　　loader: 'url-loader?limit=8192&name=../images/[hash:8].[name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        // 在dist下自动生成index.html，并自动引用打包后的js
        new HtmlWebpackPlugin({     
            template:'src/template/index.html',//以baby.html为模板，路径相对于项目根目录
            filename:'../index.html',//自动生成的文件名，路径相对于输出目录（dist）
            chunks:['common','index']      //需要插入到html文件中的脚本，脚本名称可从entry中选择
        }),
        new HtmlWebpackPlugin({     
            template:'src/template/product.html',
            filename:'../product.html',
            chunks:['common','product']
        }),
        new HtmlWebpackPlugin({     
            template:'src/template/forum.html',
            filename:'../forum.html',
            chunks:['common','forum']
        }),
        new HtmlWebpackPlugin({     
            template:'src/template/aboutus.html',
            filename:'../aboutus.html',
            chunks:['common','aboutus']
        }),
        new UglifyJSPlugin(),
        // 打包前先清空打包文件
        new CleanWebpackPlugin(
            ['dist'],
            {
                root: __dirname,       　//根目录
                verbose:  true,        　//开启在控制台输出信息
                dry:      false        　//启用删除文件
            }
        ),
        new webpack.HashedModuleIdsPlugin(),//使module id不依赖模块顺序
        new ExtractTextPlugin('[name].[contenthash:8].css'),
        new ManifestPlugin()//生成映射的json文件
        // new ExtractTextPlugin('[name].[contenthash:8].scss')
    ]
});