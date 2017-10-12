// 添加或更新品类JS

// 引入页面样式
require('./add-category.css');
// 引入jquery
var $ = require('jquery');
// 引入bootstrap
require('node_modules/bootstrap/dist/js/bootstrap.min.js');
require('node_modules/bootstrap/dist/css/bootstrap.min.css');
// 引入通用工具类
var _empress = require('util/empress.js');
// 引入品类Service
var _category = require('service/category-service.js');
// 引入渲染模板
var templateIndex = require('./add-category.string');

var categoryManage = {
	data : {

	},
	// 页面初始化，需要传入参数，判断是添加或者更新品类信息
	init : function() {
		var _this = this;
		var categoryId = _empress.getUrlParam('categoryId');
		this.data.categoryId = categoryId;
		this.data.isUpdate = categoryId === null ? false : true;
		
		if (this.data.isUpdate) {
			_category.categoryDetail(categoryId, function(res) {
				// 数据绑定
				_this.data.detail = res;
				// 加载页面
				_this.onLoad();
				// 页面事件的绑定
				_this.bindEvent();
			}, function(errMsg) {
				_empress.errorTips(errMsg);
			});
		} else {
			// 加载页面
			_this.onLoad();
			// 页面事件的绑定
			_this.bindEvent();
		}
	},
	// 加载页面
	onLoad : function() {
		var _this = this;

		// 渲染页面
		var productHtml = _empress.renderHtml(templateIndex, {
			isUpdate 	: _this.data.isUpdate,// 是否为添加品类信息
			data 		: _this.data.detail,// 品类信息
		});
		$('.category-div').html(productHtml);

		// 加载所属品类
		this.loadCategory();
	},
	// 加载所属品类
	loadCategory : function() {
		var _this = this;
		var $parentCategory = $('#parentCategory');

		// 获取一级品类信息列表
		_category.getStairCategory(function(res) {
			// 填充一级品类下拉框
			$parentCategory.html(_this.attachCategoryOption(res));

			// 如果是更新品类，并且有父品类，则做品类信息的回填
			if (_this.data.isUpdate && _this.data.detail.parentId !== '') {
				$('#parentCategory').val(_this.data.detail.parentId);
			}
		}, function(errMsg) {
			_empress.errorTips(errMsg);
		});
	},
	// 填充品类下拉框
	attachCategoryOption : function(categoryList) {
		var html = '<option value="">请选择</option><option value="0">所有</option>';
		for (var i = 0, length = categoryList.length; i < length; i++) {
			html += '<option value="' + categoryList[i].id + '">' + categoryList[i].name + '</option>';
		}
		return html;
	},
	// 提交按钮的事件绑定
	bindEvent : function() {
		var _this = this;
		
		// 提交品类信息
		$('#add-update-category').click(function() {
			var receiverInfo 	= _this.getReceiverInfo();// 获取表单信息

			if (!_this.data.isUpdate && receiverInfo.status) {// 添加收货地址且表单验证通过
				// 添加品类信息
				_category.addCategory(receiverInfo.data, function(res) {
					_empress.successTips(res);
					window.location.href = './index.html';
				}, function(errMsg) {
					_empress.errorTips(errMsg);
				});
			} else if (_this.data.isUpdate && receiverInfo.status) {// 修改收货地址且表单验证通过
				// 更新商品信息
				_category.updateCategory(receiverInfo.data, function(res) {
					_empress.successTips(res);
					window.location.href = './index.html';
				}, function(errMsg) {
					_empress.errorTips(errMsg);
				});
			} else {// 验证不通过
				_empress.errorTips(receiverInfo.msg || '好像哪里出错了');
			}
		});

	},
	// 获取表单信息，并作表单的验证
	getReceiverInfo : function() {
		var receiverInfo = {};// 存放获取的表单信息
		var	result = {
				status : false
			};// 返回信息

		// 如果是更新操作，则设置需要更新品类的id
		if (this.data.isUpdate) {
			receiverInfo.categoryId = this.data.categoryId;
		}

		// 获取表单信息并存入receiverInfo中
		receiverInfo.parentCategoryId 	= $('#parentCategory').val();
		receiverInfo.categoryName 		= $.trim($('#name').val());

		if (receiverInfo.parentCategoryId === null || receiverInfo.parentCategoryId === '') {
			result.msg = '请选择所属品类';
			return result;
		} else if (!_empress.validate(receiverInfo.categoryName, 'require')) {
			result.msg = '请输入品类名称';
			return result;
		}
		result.status = true;
		result.msg = '验证通过';
		result.data = receiverInfo;
		
		return result;
	}
};

$(function() {
	categoryManage.init();
});