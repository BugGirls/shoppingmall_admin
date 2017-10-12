// 品类管理JS

// 引入页面样式
require('./category.css');
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
var templateIndex = require('./category.string');

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
	// 初始化品类信息列表
	onLoad : function() {
		this.loadList();
	},
	// 加载list数据
	loadList : function() {
		var listParam 	= this.data.listParam;
		var _this	 	= this;

		// 获取一级品类信息列表
		_category.getStairCategory(function(res){
			// 渲染html
			_this.renderIndexHtml(templateIndex, res);
		}, function(errMsg) {
			$('.category-list').html(errMsg);
		});
	},
	// 渲染html
	renderIndexHtml : function(template, data) {
		var indexHtml = _empress.renderHtml(template, {
			list : data
		});
		$('.category-list').html(indexHtml);
	},
	// 页面事件的绑定
	bindEvent : function() {
		var _this = this;
		var listParam = _this.data.listParam;
		
		// 添加品类按钮的点击事件
		$(document).on('click', '#add-category-btn', function() {
			window.location.href = './add-category.html';
		});
		// 修改按钮的点击事件
		$(document).on('click', '#category-update-btn', function() {
			var categoryId = $(this).data('category-id');
			window.location.href = './add-category.html?categoryId=' + categoryId;
		});
		// 查看子品类的点击事件
		$(document).on('click', '#category-children-btn', function() {
			var categoryId = $(this).data('category-id');
			window.location.href = './children-category.html?categoryId=' + categoryId;
		});
	}
};

// 页面加载时进行初始化
$(function() {
	page.init();
});