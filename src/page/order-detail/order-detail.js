// 订单详情JS

// 引入页面样式
require('./order-detail.css');
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
var templateIndex = require('./order-detail.string');

var page = {
	data : {
		orderNo :  _empress.getUrlParam('orderNo')
	},
	// 初始化页面
	init : function() {
		this.onLoad();
		this.bindEvent();
	},
	// 初始化订单信息列表
	onLoad : function() {
		var _this = this;

		// 获取订单详情
		_order.getOrderDetail(this.data.orderNo, function(res) {
			_this.renderIndexHtml(templateIndex, res);
		}, function(errMsg) {
			_empress.errorTips(errMsg);
		});
	},
	// 页面事件的绑定
	bindEvent : function() {
		var _this = this;
		var orderNo = this.data.orderNo;
		
		// 发货按钮的点击事件
		$(document).on('click', '#send_good', function() {
			_order.sendGoods(orderNo, function(res) {
				_empress.successTips(res);
				window.location.href = './order-detail.html?orderNo=' + orderNo;
			}, function(errMsg) {
				_empress.errorTips(errMsg);
			})
		});
	},
	// 渲染html
	renderIndexHtml : function(template, data) {
		var indexHtml = '';
		indexHtml = _empress.renderHtml(template, {
			detail 			: data,
			shippingDetail 	: data.shippingVo,
			orderItemVoList : data.orderItemVoList,
			pay 			: data.status === 20 ? true : false,// 订单状态是否为已付款
		});
		$('.order-detail-div').html(indexHtml);
	}
};

// 页面加载时进行初始化
$(function() {
	page.init();
});