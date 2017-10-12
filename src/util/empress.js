/**
 * 通用JS工具类
 */

// 引入hogan
var hogan = require('hogan.js');

var conf = {
	serverHost : ''
};

var _empress = {
	// Ajax请求后台
	request : function(param) {
		// 缓存_empress对象
		var _this = this;
		$.ajax({
			type 		: param.method 	|| 'post',
			url 		: param.url 	|| '',
			dataType 	: param.type 	|| 'json',
			data 		: param.data 	|| '',
			success 	: function(result) {
				if (0 === result.status) {// 请求成功
					// 如果传入的param参数中success为一个function，则将result参数进行回调
					typeof param.success === 'function' && param.success(result.data, result.msg);
				} else if (10 === result.status) {// 没有登录状态，需要强制登录
					_this.doLogin();
				} else if (1 === result.status) {// 请求数据错误
					typeof param.error === 'function' && param.error(result.msg);
				}
			},
			error 		: function(err) {
				typeof param.error === 'function' && param.error(err.statusText);
			}
		})
	},
	// 获取服务器URL地址
	getServerUrl : function(path) {
		return conf.serverHost + path;
	},
	// 获取URL参数
	getUrlParam : function(name) {
		// happymmall.com/product/list.do?keyword=123&page=1
		// 通过以上URL，获取keyword参数，设计思想：
		// 1、过滤'?'以前的数据
		// 2、通过'&'符号分割后面的参数，分割后的参数形式为key=value的形式
		// 3、通过name匹配key，得到value
		
		// 实现：
		// 定义一个正则表达式
		// (^|&)：以空或&开头
		// ([^&]*)：如果不是&符号则一直匹配，一直匹配多个字符
		// (&|$)：以&或字符串的末尾来结束
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
		// window.location.search：获取URL中'?'以前的数据
		// .substr(1)：获取到了'?'以后的数据，不包括'?'
		// .match(reg)：通过正则匹配参数name
		var result = window.location.search.substr(1).match(reg);
		// result[2]：获取匹配的value值
		// result[0]是完整的匹配，接着result[1]是key值，result[2]是value值
		// decodeURIComponent：需要将value值解码，因为在传参的时候有一个编码操作
		return result ? decodeURIComponent(result[2]) : null;
	},
	// 验证方法，包括手机号验证、邮箱验证、非空验证
	// value：验证的参数
	// type：验证的类型（非空、手机号、邮箱）
	validate : function(value, type) {
		var value = $.trim(value);
		// 非空验证
		if ('require' === type) {
			return !!value;// 如果value为空则返回false，否则返回true
		}
		// 手机号验证
		if ('phone' === type) {
			return /^1\d{10}$/.test(value);
		}
		// 邮箱验证
		if ('email' === type) {
			return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
		}
		// 判断是否为数字
		if ('isNumber' === type) {
			return /^[0-9]+.?[0-9]*$/.test(value);
		}
	},
	// 渲染HTML模板，使用hogan
	// 作用：将传入的模板和数据进行拼接
	renderHtml : function(htmlTemplate, data) {
		// 模板的编译
		var compiledTemplate = hogan.compile(htmlTemplate);
		// 模板的渲染
		var result = compiledTemplate.render(data);
		return result;
	},
	// 统一登录处理
	doLogin : function() {
		window.location.href = './login.html?redirect=' + encodeURIComponent(window.location.href);
	},
	// 提示方法，当请求成功或失败时显示提示信息
	successTips : function(msg) {
		alert(msg || '操作成功');
	},
	errorTips : function(msg) {
		alert(msg || '操作失败');
	},
};


module.exports = _empress;