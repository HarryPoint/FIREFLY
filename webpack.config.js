let path = require('path');
let webpack = require('webpack');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
    // 多页面开发，怎么配置多页面
    entry: {
        index: './src/page/index/index.js',
        activity: './src/page/activity/activity.js'
    },
    // 出口文件
    output: {
        filename: 'js/[name].js',
        path: path.resolve('dist')
    },
    resolve: {
        // 别名
        alias: {},
        // 省略后缀
        extensions: ['.js', '.json', '.css']
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10
                },
                utils: { // 抽离自己写的公共代码，utils这个名字可以随意起
                    chunks: 'initial',
                    name: 'utils',  // 任意命名
                    minSize: 0    // 只要超出0字节就生成一个新包
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(css|less)$/,     // 解析css
                use: ExtractTextWebpackPlugin.extract({
                    use: ['css-loader', 'postcss-loader', 'less-loader'], // 从右向左解析
                    publicPath: '../'
                })
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,    // 小于8k的图片自动转成base64格式，并且不会存在实体图片
                            outputPath: 'images/'   // 图片打包后存放的目录
                        }
                    }
                ]
            },
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader'
            },
            {
                test: /\.(eot|ttf|woff|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/'   // 图片打包后存放的目录
                    }
                }]
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: /src/,          // 只转化src目录下的js
                exclude: /node_modules/  // 排除掉node_modules，优化打包速度
            }
        ]
    },
    plugins: [
        // 热替换，热替换不是刷新
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin('dist'),
        new HtmlWebpackPlugin({
            template: './src/page/index/index.html',
            filename: 'index.html',
            chunks: ['vendor', 'utils', 'index']
        }),
        new HtmlWebpackPlugin({
            template: './src/page/activity/activity.html',
            filename: 'activity.html',
            chunks: ['vendor', 'utils', 'activity']
        }),
        new ExtractTextWebpackPlugin('css/[hash].css')
    ],
    devServer: {
        contentBase: './dist',
        host: 'localhost',      // 默认是localhost
        port: 3000,             // 端口
        open: true,             // 自动打开浏览器
        hot: true               // 开启热更新
    }
}