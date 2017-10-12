// 请求后台-商品

// 引入通用工具类
var _empress = require('util/empress.js');

var _product = {
	// 获取所有商品列表信息
	getProductList : function(listParam, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/product/list.do'),
			data 	: listParam,
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	},
	// 通过关键字查询商品列表信息
	queryProduct : function(listParam, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/product/query.do'),
			data 	: listParam,
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	},
	// 修改商品销售状态
	updateProductSaleStatus : function(data, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/product/update_product_sale_status.do'),
			data 	: data,
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	},
	// 修改商品销售状态
	deleteProduct : function(productId, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/product/delete.do'),
			data 	: {
				productId : productId
			},
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	},
	// 通过商品id获取商品详情
	getProductDetail : function(productId, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/product/get_product_detail.do'),
			data 	: {
				productId : productId
			},
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	},
	// 添加商品信息
	addProduct : function(productInfo, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/product/add.do'),
			data 	: productInfo,
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	},
	// 更新商品信息
	updateProduct : function(productInfo, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/product/add.do'),
			data 	: productInfo,
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	}
};

module.exports = _product;