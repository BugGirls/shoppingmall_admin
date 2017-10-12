// 首页JS

// 引入页面样式
require('./index.css');
// 引入jquery
var $ = require('jquery');
// 引入bootstrap
require('node_modules/bootstrap/dist/js/bootstrap.min.js');
require('node_modules/bootstrap/dist/css/bootstrap.min.css');
// 引入通用工具类
var _empress = require('util/empress.js');
// 引入商品Service
var _product = require('service/product-service.js');
// 引入渲染模板
var templateIndex = require('./index.string');
// 引入商品添加Chunk
var addProduct = require('../add-product/add-product.js');
// 引入品类Chunk
var category = require('../category/category.js');
// 引入订单Chunk
var order = require('../order-list/order-list.js');

var page = {
	data : {
		listParam : {
			pageNum 	: _empress.getUrlParam('pagenum') 		|| 1,
			pageSize 	: _empress.getUrlParam('pagenum') 		|| 10,
		}
	},
	// 初始化页面
	init : function() {
		this.onLoad();
		this.bindEvent();
	},
	// 初始化商品信息列表
	onLoad : function() {
		this.loadList();
	},
	// 加载list数据
	loadList : function() {
		var listParam 	= this.data.listParam;
		var _this	 	= this;

		// 获取商品信息列表
		_product.getProductList(listParam, function(res){
			// 渲染html
			_this.renderIndexHtml(templateIndex, res);
		}, function(errMsg) {
			$('.product-list').html(errMsg);
		});
	},
	// 页面事件的绑定
	bindEvent : function() {
		var _this = this;
		var listParam = _this.data.listParam;

		// 查询按钮的点击事件
		$(document).on('click', '#query-product-btn', function() {
			var type = $('#query-type').val();// 获取查询关键字类型
			var keyword = $.trim($('#keyword').val());// 获取查询关键字

			// 参数填充，设置需要查询的参数
			if (type === 'id') {// 通过商品id进行查询
				listParam.productId = keyword;
				if (!keyword) {
					delete listParam.productId;
				}
				delete listParam.productName;
			} else if (type === 'name') {// 通过商品名称进行查询
				listParam.productName = keyword;
				if (!keyword) {
					delete listParam.productName;
				}
				delete listParam.productId;
			}

			// 参数校验，当输入了productId时，验证输入的是否为数字
			var validateMessage = _this.validateParam(listParam);
			if (validateMessage.status) {
				_this.queryKeyword(listParam);
			} else {
				$('.product-list').html(validateMessage.msg);
			}
		});
		// 下架/上架按钮的点击事件
		$(document).on('click', '#sold-btn', function() {
			var param = {
				productId 	: $(this).data('product-id'),
				status 		: $(this).data('product-status')
			};
			if (window.confirm('确认要修改该商品的销售状态吗？')) {
				_product.updateProductSaleStatus(param, function(res) {
					_this.queryKeyword(listParam);
				}, function(errMsg) {
				});
			}
		});
		// 删除按钮的点击事件
		$(document).on('click', '#product-delete-btn', function() {
			var productId = $(this).data('product-id');
			if (window.confirm('确认要删除该商品吗？')) {
				_product.deleteProduct(productId, function(res, msg) {
					_empress.successTips(msg);
					_this.queryKeyword(listParam);
				}, function(errMsg) {
					_empress.errorTips(errMsg);
				});
			}
		});
		// 添加商品按钮的点击事件
		$(document).on('click', '#add-product-btn', function() {
			window.location.href = './add-product.html';
		});
		// 修改按钮的点击事件
		$(document).on('click', '#product-update-btn', function() {
			var productId = $(this).data('product-id');
			window.location.href = './add-product.html?productId=' + productId;
		});
	},
	// 通过关键字进行查询
	queryKeyword : function(listParam) {
		var _this = this;
		// 通过关键字查询商品信息列表
		_product.queryProduct(listParam, function(res) {
			// 渲染html
			_this.renderIndexHtml(templateIndex, res);
		}, function(errMsg) {
			$('.product-list').html(errMsg);
		});
	},
	// 渲染html
	renderIndexHtml : function(template, data) {
		var indexHtml = '';

		// 循环获取每个商品的状态，为每个商品添加一个属性state，用于判断是否为在售状态
		// 如果status=1，即在售状态，则设置state为true，否则设置为false
		for (var i = 0, iLength = data.list.length; i < iLength; i++) {
			if (data.list[i].status === 1) {
				data.list[i].state = true;
			} else {
				data.list[i].state = false;
			}
		}

		indexHtml = _empress.renderHtml(template, {
			list 	: data.list,
			isNull 	: data.list.length === 0 ? true : false
		});
		$('.product-list').html(indexHtml);
	},
	// 参数验证
	validateParam : function(param) {
		var result = {
			status 	: false,
			msg 	: ''
		};
		// 如果输入了productId，则验证输入的productId是否为数字
		if (_empress.validate(param.productId, 'require')) {
			if (!_empress.validate(param.productId, 'isNumber')) {
				result.msg = '请输入数字';
				return result;
			}
		}
		result.status = true;
		result.msg = '验证通过';
		return result;
	}
};

// 页面加载时进行初始化
$(function() {
	page.init();
});