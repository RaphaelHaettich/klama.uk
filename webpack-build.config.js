const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const Dotenv = require("dotenv-webpack");

process.traceDeprecation = true; //https://github.com/webpack/loader-utils/issues/56

const context = __dirname;

module.exports = {
	context,

	entry: [path.join(context, "src/index.jsx")],

	output: {
		path: path.join(context, "build/"),
		filename: "bundle.js",
		publicPath: "/"
	},

	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new ExtractTextPlugin("styles.css"),
		new Dotenv({
			path: "./.env", // Path to .env file (this is the default)
			safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe),
			systemvars: true
		})
	],

	resolve: {
		modules: [
			path.resolve(context, "src"),
			path.resolve(context, "node_modules")
		],
		extensions: [".js", ".jsx", ".css", ".scss"]
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				include: [path.resolve(context, "src")],

				use: [
					{
						loader: "babel-loader",
						options: {
							presets: [
								[
									"env",
									{
										targets: {
											browsers: ["> 1%", "last 2 major versions", "IE 10"]
										}
									}
								],
								"react"
							],
							plugins: [
								"transform-object-rest-spread",
								"transform-class-properties",
								"transform-decorators-legacy",
								"babel-plugin-styled-components"
							]
						}
					}
				]
			},
			{
				test: /\.css$/,
				include: [
					path.resolve(context, "src"),
					path.resolve(context, "node_modules")
				],

				use: ExtractTextPlugin.extract({
					fallback: ["style-loader"],
					use: [
						"css-loader",
						{ loader: "postcss-loader", options: { sourceMap: false } }
					]
				})
			},
			{
				test: /\.scss$/,
				include: [
					path.resolve(context, "src"),
					path.resolve(context, "node_modules")
				],

				use: ExtractTextPlugin.extract({
					fallback: ["style-loader"],
					use: [
						"css-loader",
						{ loader: "postcss-loader", options: { sourceMap: false } },
						"resolve-url-loader",
						"sass-loader"
					]
				})
			},
			{
				test: /\.woff2?$/,
				loader: "file-loader"
			}
		]
	}
};
