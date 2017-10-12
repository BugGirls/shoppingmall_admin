// 管理员登录JS

// 引入页面样式
require('./login.css');
// 引入通用工具类
var _empress = require('util/empress.js');
// 引入用户Service
var _user = require('service/user-service.js');
// 引入jquery
var $ = require('jquery');
// 引入bootstrap
require('node_modules/bootstrap/dist/js/bootstrap.min.js');
require('node_modules/bootstrap/dist/css/bootstrap.min.css');

var page = {
	init : function() {
		// 页面事件的绑定
		this.bindEvent();
	},
	// 页面事件的绑定
	bindEvent : function() {
		var _this = this;
		// 登录按钮的提交
		$('#submit').on('click', function() {
			_this.submit();
		});
		// 在输入框按下回车时，也提交表单
		$('.form-control').keyup(function(e) {
			if (e.keyCode === 13) {
				_this.submit();
			}
		});
	},
	// 提交表单，在页面中并没有表单，而是使用js伪造一个表单
	submit : function() {
		var formData = {
			username : $.trim($('#username').val()),
            password : $.trim($('#password').val())
		};
		// 表单验证
		var validateResult = this.formValidate(formData);
		if (validateResult.status) {
			_user.login(formData, function(res) {
				formError.hide();
				window.location.href = _empress.getUrlParam('redirect') || './index.html';
			}, function(errMsg) {
				formError.show(errMsg);
			});
		} else {
			formError.show(validateResult.msg);
		}
	},
	// 表单验证
	formValidate : function(formData) {
		var result = {// 定义返回结果
			status 	: false,
			msg 	: ''
		};
		if (!_empress.validate(formData.username, 'require')) {
			result.msg = '请输入用户名';
			return result;
		} else if (!_empress.validate(formData.password, 'require')) {
			result.msg = '请输入密码';
			return result;
		}
		// 验证通过，返回正确结果
		result.status 	= true;
		result.msg 		= '验证通过';
		return result;
	}
};

// 表单里的错误提示
var formError = {
	show : function(errMsg) {
		$('.error-tip').show().text(errMsg);
	},
	hide : function() {
		$('.error-tip').hide().text('');
	}
}

// 页面加载时进行初始化
$(function() {
	page.init();
});