// 请求后台-管理员

// 引入通用工具类
var _empress = require('util/empress.js');

var _admin = {
	// 管理员登录
	login : function(userInfo, resolve, reject) {
		_empress.request({
			url 	: _empress.getServerUrl('/manage/user/login.do'),
			data 	: userInfo,
			method	: 'POST',
			success	: resolve,
			error 	: reject
		});
	},
};

module.exports = _admin;