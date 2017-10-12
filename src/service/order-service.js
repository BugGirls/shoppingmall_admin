// 请求后台-订单

// 引入通用工具类
var _empress = require('util/empress.js');

var _order = {
	// 获取订单信息列表
	getOrderList : function(listParam, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/order/order_list.do'),
			data 	: listParam, 
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	},
	// 获取订单信息列表
	getOrderDetail : function(orderNo, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/order/order_detail.do'),
			data 	: {
				orderNo : orderNo
			}, 
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	},
	// 发货
	sendGoods : function(orderNo, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/order/send_goods.do'),
			data 	: {
				orderNo : orderNo
			}, 
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	}
};

module.exports = _order;