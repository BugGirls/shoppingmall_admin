/**
 * webpack配置文件
 */

var webpack             = require('webpack');
var ExtractTextPlugin 	= require("extract-text-webpack-plugin");
var HtmlWebpackPlugin 	= require('html-webpack-plugin');

// 环境变量配置，dev（开发） / online（线上）
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

// 处理html定义的方法
var getHtmlConfig = function(name, title) {
	return {
		template 	: './src/view/'+ name +'.html',// 所引用的模板
		filename 	: 'view/'+ name +'.html',// 生成的html文件的名称与位置
		favicon 	: './favicon.ico',
		inject 		: true,
		hash 		: true,
		title 		: title,
		chunks 		: ['common', name]
	};
}

// webpack config
var config = {
	entry : {
		'common' 			: ['./src/page/common/index.js'],
		'index' 			: ['./src/page/index/index.js'],
		'login' 			: ['./src/page/login/login.js'],
		'add-product' 		: ['./src/page/add-product/add-product.js'],
		'add-category' 		: ['./src/page/add-category/add-category.js'],
		'children-category' : ['./src/page/children-category/children-category.js'],
		'order-detail' 		: ['./src/page/order-detail/order-detail.js']
	},
	output 	: {
		path 		: './dist',
		filename 	: 'js/[name].js',
		publicPath 	: '/dist'
	},
	module : {
		loaders : [{
			test 	: /\.css$/,
			loader :ExtractTextPlugin.extract({
				fallback 	: 'style-loader',
				use 		: 'css-loader'
			})
		},{
			test 	: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,
			loader 	: 'url-loader?limit=100&name=resources/[name].[ext]'
		},{
			test 	: /\.string$/,
			loader 	: 'html-loader'
		}]
	},
	resolve : {// 配置别名
		alias : {// 配置路径
			node_modules 	: __dirname + '/node_modules',
			util 			: __dirname + '/src/util',
			service 		: __dirname + '/src/service',
			page 			: __dirname + '/src/page',
		}
	},
	plugins : [
		// webpack处理html
		new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
		new HtmlWebpackPlugin(getHtmlConfig('login', '管理员登录')),
		new HtmlWebpackPlugin(getHtmlConfig('add-product', '商品管理')),
		new HtmlWebpackPlugin(getHtmlConfig('add-category', '品类管理')),
		new HtmlWebpackPlugin(getHtmlConfig('children-category', '查看子品类')),
		new HtmlWebpackPlugin(getHtmlConfig('order-detail', '订单详情')),
		// webpack单独打包css
		new ExtractTextPlugin("css/[name].css"),
		// webpack处理公共模块到base.js
		new webpack.optimize.CommonsChunkPlugin({
			name 		: 'common',
			filename 	: 'js/base.js'
		}),
		new webpack.ProvidePlugin({
			'$' 				: 'jquery',
			'jQuery' 			: 'jquery',
			'windows.jQuery' 	: 'jquery'
		})
	],
}

// 如果为dev（开发环境），则使用webpack-dev-server
if(WEBPACK_ENV === 'dev'){// 在common模块中追加一段字符串
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088');
}

module.exports = config;