// 订单列表JS

// 引入页面样式
require('./order-list.css');
// 引入jquery
var $ = require('jquery');
// 引入bootstrap
require('node_modules/bootstrap/dist/js/bootstrap.min.js');
require('node_modules/bootstrap/dist/css/bootstrap.min.css');
// 引入通用工具类
var _empress = require('util/empress.js');
// 引入订单Service
var _order = require('service/order-service.js');
// 引入渲染模板
var templateIndex = require('./order-list.string');

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
	// 初始化订单信息列表
	onLoad : function() {
		this.loadList();
	},
	// 加载list数据
	loadList : function() {
		var listParam 	= this.data.listParam;
		var _this	 	= this;

		// 获取订单信息列表
		_order.getOrderList(listParam, function(res){
			// 渲染html
			_this.renderIndexHtml(templateIndex, res);
		}, function(errMsg) {
			$('.order-list').html(errMsg);
		});
	},
	// 页面事件的绑定
	bindEvent : function() {
		var _this = this;
		var listParam = _this.data.listParam;

		// 查询按钮的点击事件
		$(document).on('click', '#query-order-btn', function() {
			var type = $('#query-type-order').val();// 获取查询关键字类型
			var keyword = $.trim($('#keyword-order').val());// 获取查询关键字

			// 参数填充，设置需要查询的参数
			if (type === 'orderNo') {// 通过订单编号orderNo进行查询
				listParam.orderNo = keyword;
				if (!keyword) {
					delete listParam.orderNo;
				}
			}

			// 参数校验，当输入了orderNo时，验证输入的是否为数字
			var validateMessage = _this.validateParam(listParam);
			if (validateMessage.status) {
				_this.queryKeyword(listParam);
			} else {
				$('.order-list').html(validateMessage.msg);
			}
		});

		// 查看订单详情的点击事件
		$(document).on('click', '#order-detail-btn', function() {
			var orderNo = $(this).data('order-detail-id');
			window.location.href = './order-detail.html?orderNo=' + orderNo;
		});
	},
	// 通过关键字进行查询
	queryKeyword : function(listParam) {
		var _this = this;
		// 通过关键字查询订单信息列表
		_order.getOrderList(listParam, function(res) {
			// 渲染html
			_this.renderIndexHtml(templateIndex, res);
		}, function(errMsg) {
			$('.order-list').html(errMsg);
		});
	},
	// 渲染html
	renderIndexHtml : function(template, data) {
		var indexHtml = '';

		indexHtml = _empress.renderHtml(template, {
			list 	: data.list,
			isNull 	: data.list.length === 0 ? true : false
		});
		$('.order-list').html(indexHtml);
	},
	// 参数验证
	validateParam : function(param) {
		var result = {
			status 	: false,
			msg 	: ''
		};
		// 如果输入了orderNo，则验证输入的orderNo是否为数字
		if (_empress.validate(param.orderNo, 'require')) {
			if (!_empress.validate(param.orderNo, 'isNumber')) {
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