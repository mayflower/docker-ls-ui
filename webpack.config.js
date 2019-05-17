'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    entry: './src/ui/index.tsx',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        compress: true,
        port: 9001,
        overlay: true,
        contentBase: path.join(__dirname, 'public'),
    },
    output: {
        filename: './dist/app.js',
    },
    externals: {
        electron: 'require("electron")',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,

                loader: {
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            module: 'commonjs',
                        },
                    },
                },
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$/,
                use: 'file-loader?name=[name].[ext]?[hash]',
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&mimetype=application/fontwoff',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: ['node_modules'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'docker-ls',
            template: './public/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
    ],
};
