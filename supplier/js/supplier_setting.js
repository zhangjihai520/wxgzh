$(function() {
	getCoPerfectInfo();
	setCss();
	page_change("#updatePass", "supplier_change_password.html");
	page_change("#buttonstyle", "../login.html");
	page_change("#brief-introduction", "http://www.youone.cn/app-res/appWeb/instructions/aboutUs/index.html");
	page_change("#user-agreement", "http://www.youone.cn/app-res/appWeb/readAndInstructions/userAgreement/index.html");
	$("#buttonstyle").click(function() {
		removeToken();
	});
	$('#avatarImage').click(function() {
		$(this).next().click();
	});
	$(".back").click(function() {
		page_back();
		sessionStorage.setItem('refresh', 'true');
	})
});

/**
 * 显示选择图片路径
 */
$(document).on('change', ".file", function() {
	var objUrl = getObjectURL(this.files[0]);
	if(objUrl) {
		// 在这里修改图片的地址属性
		var _this = $(this);
		pictureUpload(_this, objUrl);
	}
});

//上传头像
function pictureUpload(_this, objUrl) {
	var file = document.getElementsByClassName("file")[0].files[0];
	var form = new FormData();
	form.append("avatarImage", file);
	ajaxRequestForm(api + methods.pictureUpload, form, function(result) {
		_this.prev().prop("src", objUrl);
	});
}

function setCss() {
	$('.Headportrait').css('height', $('.Headportrait').width());
	$('#avatarImage').prop('src', get_localStorage('avatarUrl'));
	//返回
	$(".break").click(function() {
		page_back();
	});
}

$("#aboutusT").click(function() {
	$("#multiCollapseExample1").removeClass("show")
})
$("#aboutus").click(function() {
	$("#multiCollapseExample2").removeClass("show")
});

function updateSupReceiptType(type) { //修改收付款方式
	var url = re_url(methods.updateSupReceiptType);
	var data = {
		"pickupDirectReceipt": type
	}
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			toast("修改成功！");
			setTimeout(function() {
				window.location.reload();
			}, 800)
		}
	};
	util.post_ajax(url, data, success)
}
$(".platform").on("click", function() { //平台代收
	var payType = $(this).attr("id");
	updateSupReceiptType(payType);
	$("#multiCollapseExample2").removeClass("show");
})
$(".gysform").on("click", function() { //供应商直收
	var payType = $(this).attr("id");
	updateSupReceiptType(payType);
	$("#multiCollapseExample2").removeClass("show");
})

function getCoPerfectInfo() { //获取企业认证信息
	var url = re_url(methods.getSupplierPerfectInfo);
	var data = {};
	var success = function(response) {
		if(response["code"] == RETCODE_SUCCESS) {
			var datas = response.data;
			if(datas.pickupDirectReceipt == 0) {
				$(".platform").addClass("orange");
			} else {
				$(".gysform").addClass("orange");
			};

		} else {
			toast(response.message)
		}
	}
	util.get_ajax(url, data, success)
}