// 查看子品类JS

// 引入页面样式
require('./children-category.css');
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
var templateIndex = require('./children-category.string');

var page = {
	// 初始化页面
	init : function() {
		this.onLoad();
		this.bindEvent();
	},
	// 初始化品类信息列表
	onLoad : function() {
		this.loadList();
	},
	// 加载list数据
	loadList : function() {
		var _this = this;
		var categoryId = _empress.getUrlParam('categoryId');// 获取品类id

		if (categoryId !== null || categoryId !== '') {
			// 获取子品类信息
			_category.getSecondCategory(categoryId, function(res) {
				_this.renderIndexHtml(templateIndex, res);
			}, function(errMsg) {
				_empress.errorTips(errMsg);
			});
		}
	},
	// 渲染html
	renderIndexHtml : function(template, data) {
		var indexHtml = _empress.renderHtml(template, {
			list : data
		});
		$('.children-category-list').html(indexHtml);
	},
	// 页面事件的绑定
	bindEvent : function() {
		var _this = this;
		
		// 添加品类
		$(document).on('click', '#add-children-category-btn', function() {
			window.location.href = './add-category.html';
		});

		// 更新子品类
		$(document).on('click', '#children-update-btn', function() {
			var children_category_id = $(this).data('children-category-id');
			window.location.href = './add-category.html?categoryId=' + children_category_id;
		});
	}
};

// 页面加载时进行初始化
$(function() {
	page.init();
});