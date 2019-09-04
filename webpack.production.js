const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const buildDir = 'build/production';

module.exports = {
    mode: 'production',
    entry: {
        app: './src/index.js'
    },
    node: {
        fs: 'empty'
    },
    output: {
        path: path.join(process.cwd(), buildDir),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: path.join(process.cwd(), 'src/'),
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: path.join(process.cwd(), 'src', 'index.html'),
            to: path.join(process.cwd(), buildDir)
        }, {
            from: path.join(process.cwd(), 'src', 'assets'),
            to: './assets',
        }, {
            from: './src/config',
            to: './config'
        }]),
        new webpack.DefinePlugin({
            'typeof CANVAS_RENDERER': JSON.stringify(true),
            'typeof WEBGL_RENDERER': JSON.stringify(true)
        }),
        new UglifyJsPlugin()
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                dependencies: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'all',
                    name: 'dependencies'
                }
            }
        }
    },
    devServer: {
        contentBase: path.join(process.cwd(), buildDir)
    }
};