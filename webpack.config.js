var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
		"shmile-ui": './ui/shmile'
	},
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
		publicPath: "/assets/"
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
	  new ExtractTextPlugin("[name].css")
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: [ 'babel' ],
      exclude: /node_modules/,
      include: __dirname
    }, {
      test: /\.css?$/,
			loader: ExtractTextPlugin.extract("style-loader", "css-loader"),
      include: __dirname
    }]
  }
}

