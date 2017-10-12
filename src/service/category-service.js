// 请求后台-品类

// 引入通用工具类
var _empress = require('util/empress.js');

var _category = {
	// 获取一级品类信息列表
	getStairCategory : function(resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/category/get_children_parallel_category.do'),
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	},
	// 获取二级品类信息列表
	getSecondCategory : function(categoryId, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/category/get_children_parallel_category.do'),
			data 	: {
    			categoryId : categoryId
			},
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	},
	// 获取父分类id
	getParentCategoryId : function(categoryId, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/category/get_parent_category_id.do'),
			data 	: {
    			categoryId : categoryId
			},
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	},
	// 添加品类信息
	addCategory : function(categoryInfo, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/category/add_category.do'),
			data 	: categoryInfo,
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	},
	// 通过品类id获取品类详情
	categoryDetail : function(categoryId, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/category/category_detail.do'),
			data 	: {
				categoryId : categoryId
			},
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	},
	// 通过品类id获取品类详情
	updateCategory : function(categoryInfo, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/category/update_category.do'),
			data 	: categoryInfo,
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	}
};

module.exports = _category;