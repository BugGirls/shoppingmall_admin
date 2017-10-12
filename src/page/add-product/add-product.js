// 添加或更新商品JS

// 引入页面样式
require('./add-product.css');
// 引入jquery
var $ = require('jquery');
// 引入bootstrap
require('node_modules/bootstrap/dist/js/bootstrap.min.js');
require('node_modules/bootstrap/dist/css/bootstrap.min.css');
// 引入bootstrap-fileinput
require('node_modules/bootstrap-fileinput/css/fileinput.css');
require('node_modules/bootstrap-fileinput/js/fileinput.js');
// 引入富文本编辑器Simditor
var Simditor = require('simditor');
require('node_modules/simditor/styles/simditor.css');
// 引入通用工具类
var _empress = require('util/empress.js');
// 引入品类Service
var _category = require('service/category-service.js');
// 引入商品Service
var _product = require('service/product-service.js');
// 引入渲染模板
var templateIndex = require('./add-product.string');

var productManage = {
	data : {
		mainImage 	: '',// 商品主图地址
		subImages 	: [],// 扩展图片地址
		detail 		: {}// 商品详情信息
	},
	// 页面初始化，需要传入参数，判断是添加或者更新商品信息
	init : function() {
		var _this = this;
		var productId = _empress.getUrlParam('productId');
		this.data.productId = productId;
		this.data.isUpdate = productId === null ? false : true;
		
		if (this.data.isUpdate) {
			// 获取商品详情
			_product.getProductDetail(productId, function(res) {
				_this.data.detail = res;

				// 数据过滤，将subImages转换成数组
				_this.dataFilter(res);
				// 渲染页面
				_this.onRender();
				// 初始化页面
				_this.onLoad();
				// 页面事件的绑定
				_this.bindEvent();
			}, function(errMsg) {
				_empress.errorTips(errMsg);
			});
		} else {
			// 渲染页面
			_this.onRender();
			// 初始化页面
			_this.onLoad();
			// 页面事件的绑定
			_this.bindEvent();
		}
	},
	// 渲染页面
	onRender : function() {
		var _this = this;
		var productHtml = _empress.renderHtml(templateIndex, {
			isUpdate 	: _this.data.isUpdate,// 是否为添加商品信息
			data 		: _this.data.detail,// 商品信息
			subImages 	: _this.data.subImages
		});
		$('.product-div').html(productHtml);
	},
	// 初始化页面
	onLoad : function() {
		var _this = this;

		// 富文本编辑器组件Simditor
		// 使用迭代的方式对每一个textarea进行初始化，否则会报错
		$('#editor').each(function(index, dom) {
			new Simditor({
				textarea:$(dom),
				toolbar: ['bold', 'italic', 'underline', '|', 'ol', 'ul', 'blockquote', 'code', '|', 'link', 'image', '|', 'indent', 'outdent', '|', 'hr', 'table'],	
				upload : {
					url : '/manage/product/rich_text_img_upload.do',
					fileKey : 'upload_file'
				}
			});
		});

		// 加载一级品类
		this.loadStairCategory();
	},
	// 提交按钮的事件绑定
	bindEvent : function() {
		var _this = this;
		
		// 一级品类和二级品类的二级联动
		$('#stairCategory').change(function() {
			var selectStairCategory = $(this).val();
			_this.loadSecondCategory(selectStairCategory);
		});

		// 多个图片上传
		$('#fileupload').on('change', function(e) {
			var imgFile = $(this);
			var imgDiv = $('#previewImg');
			
			var fileList = imgFile.get(0).files;// 获取选取的图片列表
			for (var i = 0; i < fileList.length; i++) {
				imgDiv.append('<div class="image"><a class="deleteImg" id="deleteImg" title="删除"><i class="glyphicon glyphicon-remove"/></a><img id="img' + i + '"/> </div>');
				var imgObj = $('#img' + i);
				if (imgFile.get(0).files && fileList[i]) {
					imgObj.attr('width', '150px');
					imgObj.attr('height', '150px');
					imgObj.attr('src', _this.getObjectURL(fileList[i]));
					
					var formData = new FormData();// 创建FormData对象
					formData.append('file', fileList[i]);

					// 上传图片
					$.ajax({
						url : '/manage/product/upload.do',
						type : 'POST',
						data : formData,
						cache : false,
						contentType : false,
						processData : false,
						success : function(data) {
							if (data.status === 10) {// 用户没有登录，需要强制登录
								_empress.doLogin();
							} else if (data.status !== 0) {// 返回错误数据，提示错误信息
								_empress.errorTips(data.msg);
							} else {// 返回数据正确，将返回的数据进行缓存
								// 如果一次上传多个图片，则会返回多个结果
								_this.data.subImages.push(data.data.uri);
							}
						},
						error : function() {
							_empress.errorTips('图片上传失败，请联系工作人员');
						}
					});
				}
			}
		});

		// 单个图片的删除
		$(document).on('click', '.deleteImg', function() {
			console.log($(this).attr('id'));
			if(window.confirm('确认要删除该图片吗？')){
				var deleteId = $(this).attr('id');
				// 从数组中移除该图片
				_this.data.subImages.splice($.inArray(deleteId, _this.data.subImages), 1);

				// 渲染页面
				_this.onRender();
				// 初始化页面
				_this.onLoad();
				// 页面事件的绑定
				_this.bindEvent();
			}
		});

		// 提交商品信息
		$('#add-update-product').click(function() {
			var receiverInfo 	= _this.getReceiverInfo();// 获取表单信息

			if (!_this.data.isUpdate && receiverInfo.status) {// 添加收货地址且表单验证通过
				// 添加商品信息
				_product.addProduct(receiverInfo.data, function(res) {
					_empress.successTips(res);
					window.location.href = './index.html';
				}, function(errMsg) {
					_empress.errorTips(errMsg);
				});
			} else if (_this.data.isUpdate && receiverInfo.status) {// 修改收货地址且表单验证通过
				// 更新商品信息
				_product.updateProduct(receiverInfo.data, function(res) {
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
	// 加载一级品类信息
	loadStairCategory : function() {
		var _this = this;
		var $stairSelect = $('#stairCategory');

		// 获取一级品类信息列表
		_category.getStairCategory(function(res) {
			// 填充一级品类下拉框
			$stairSelect.html(_this.attachStairOption(res));

			// 如果是更新商品，并且有品类id，则获取父品类id，做一级品类的回填
			if (_this.data.isUpdate && _this.data.detail.categoryId) {
				// 获取父分类
				_category.getParentCategoryId(_this.data.detail.categoryId, function(res) {
					// 回填一级品类
					$stairSelect.val(res);
					// 加载二级品类信息
					_this.loadSecondCategory(res);
				}, function(errMsg) {
					_empress.errorTips(errMsg);
				});
			}
		}, function(errMsg) {
			_empress.errorTips(errMsg);
		});
	},
	// 加载二级品类信息
	loadSecondCategory : function(categoryId) {
		var _this = this;
		var $secondSelect = $('#secondCategory');

		// 获取二级品类信息列表
		_category.getSecondCategory(categoryId, function(res) {
			// 填充二级品类下拉框
			$secondSelect.html(_this.attachStairOption(res));

			// 如果是更新商品，并且有品类信息，做二级品类信息的回填
			if (_this.data.isUpdate && _this.data.detail.categoryId) {
				// 回填二级品类
				$secondSelect.val(_this.data.detail.categoryId);
			}
		}, function(errMsg) {
			_empress.errorTips(errMsg);
		});
	},
	// 填充品类下拉框
	attachStairOption : function(categoryList) {
		var html = '<option value="">请选择</option>';
		for (var i = 0, length = categoryList.length; i < length; i++) {
			html += '<option value="' + categoryList[i].id + '">' + categoryList[i].name + '</option>';
		}
		return html;
	},
	// 获取表单信息，并作表单的验证
	getReceiverInfo : function() {
		var receiverInfo = {};// 存放获取的表单信息
		var	result = {
				status : false
			};// 返回信息

		// 如果是更新操作，则设置需要更新商品的id
		if (this.data.isUpdate) {
			receiverInfo.id = this.data.productId;
		}

		// 获取表单信息并存入receiverInfo中
		receiverInfo.name 			= $.trim($('#name').val());
		receiverInfo.subtitle 		= $.trim($('#subtitle').val());
		receiverInfo.stairCategory 	= $('#stairCategory').val();
		receiverInfo.categoryId 	= $('#secondCategory').val();
		receiverInfo.price 			= $.trim($('#price').val());
		receiverInfo.stock 			= $.trim($('#stock').val());
		receiverInfo.detail 		= $.trim($('#editor').val());
		receiverInfo.mainImage 		= this.data.subImages[0];
		var tempImage = '';
		for (var i = 0, length = this.data.subImages.length; i < length; i++) {
			tempImage += this.data.subImages[i];
			if (this.data.subImages.length - 1 !== i) {
				tempImage += ',';
			}
		}
		receiverInfo.subImages 		= tempImage;

		if (!_empress.validate(receiverInfo.name, 'require')) {
			result.msg = '请输入商品名称';
			return result;
		} else if (!_empress.validate(receiverInfo.subtitle, 'require')) {
			result.msg = '请输入商品描述';
			return result;
		} else if (!_empress.validate(receiverInfo.price, 'require')) {
			result.msg = '请输入商品价格';
			return result;
		} else if (!_empress.validate(receiverInfo.stock, 'require')) {
			result.msg = '请输入商品库存';
			return result;
		} else if (receiverInfo.categoryId === null) {
			result.msg = '请选择二级品类';
			return result;
		} else if (!_empress.validate(receiverInfo.mainImage, 'require') || !_empress.validate(receiverInfo.subImages, 'require')) {
			result.msg = '请添加商品图片';
			return result;
		} else if (!_empress.validate(receiverInfo.detail, 'require')) {
			result.msg = '请填写商品详情';
			return result;
		}
		result.status = true;
		result.msg = '验证通过';
		result.data = receiverInfo;
		
		return result;
	},
	// 数据匹配
	dataFilter : function(detail) {
		this.data.subImages = detail.subImages.split(',');
	},
	// 获取不同浏览器下的图片路径
	getObjectURL : function(file) {
		var url = null ;
		if (window.createObjectURL!=undefined) { // basic
			url = window.createObjectURL(file) ;
		} else if (window.URL!=undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file) ;
		} else if (window.webkitURL!=undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file) ;
		}
	return url ;
	}
};

$(function() {
	productManage.init();
});