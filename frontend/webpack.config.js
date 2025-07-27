const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    mode: 'development',
    devServer: {            
            compress: true,
            port: 8080,            
        },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: "templates", to: "templates" },
                { from: "styles", to: "styles" },
                { from: "static/fonts", to: "fonts" },
                { from: "static/images", to: "images" },
            ],
        }),
    ],
};