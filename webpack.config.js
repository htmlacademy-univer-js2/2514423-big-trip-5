const CopyPlugin = require('copy-webpack-plugin');
 const HtmlPlugin = require('html-webpack-plugin');
 const path = require('path');

 module.exports = {
   entry: './src/main.js',
   output: {
     filename: 'bundle.[contenthash].js',
     path: path.resolve(__dirname, 'build'),
     clean: true,
   },

 devtool: 'source-map',
 plugins: [
   new CopyPlugin({
     patterns: [
       {
         from: 'public',
         globOptions: {
           ignore: ['**/index.html'],
         },
       },
     ],
   }),
   new HtmlPlugin({
     template: 'public/index.html',
   }),
 ],

 module: {
   rules: [
     {
       test: /\.js$/,
       exclude: /(node_modules)/,
       use: {
         loader: 'babel-loader',
         options: {
           presets: ['@babel/preset-env']
         },
       },
     },
     {
       test: /\.css$/i,
       use: ['style-loader', 'css-loader']
     },
   ],
 },

 }
