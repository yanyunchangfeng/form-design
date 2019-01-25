var pkg = require("./package.json");
var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  entry: {
    app: path.resolve(__dirname, "examples/src/index.js"),
    // 将 第三方依赖(node_modules中的) 单独打包
    vendor: Object.keys(pkg.dependencies)
  },
  output: {
    path: __dirname + "/build",
    filename: "[name].[chunkhash:8].js"
  },

  resolve: {
    extensions: [".js", ".jsx"]
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              mimetype: "image/png",
              fallback: "responsive-loader"
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|svg|tff|eot)()/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              mimetype: "image/png",
              fallback: "responsive-loader"
            }
          }
        ]
      },
      {
        test: /\.scss|css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    // webpack 内置的 banner-plugin
    new webpack.BannerPlugin("Copyright by wangfupeng1988@github.com."),
    new CleanWebpackPlugin(["build"]),
    // html 模板插件
    new HtmlWebpackPlugin({
      template: __dirname + "/examples/index.html"
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
