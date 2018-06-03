var path = require('path');
var webpack = require("webpack");
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    // entry: ['webpack-dev-server/client?http://127.0.0.1:8080',//资源服务器地址
    //         'webpack/hot/dev-server','./src/main.js'
    //         ],
    entry: {
        index:'./src/js/index.js',
        product:'./src/js/product.js',
        aboutus:'./src/js/aboutus.js',
        forum:'./src/js/forum.js'
    },
    output: {
        // publicPath: "/dist/",
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')   //文件输出路径
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                // exclude: /(node_modules)/,
                include: path.resolve(__dirname, "src"),
                use: ['cache-loader',{
                    loader: 'babel-loader',
                    options: {
                      presets: ['es2015'],
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
        extensions: ['*','.js']
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common' // 指定公共 bundle 的名称。
        }),
        new webpack.NamedModulesPlugin()
        // new webpack.HotModuleReplacementPlugin(),//package.json已配置，则无需在此添加此插件，切记！
    ]
 };