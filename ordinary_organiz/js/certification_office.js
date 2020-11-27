$(document).ready(function() {
	getCoPerfectInfo();
})

$(".report_data").click(function() {
	$(this).attr("disabled", "disabled");
	change_shop();
	setTimeout(function() {
		$(".report_data").removeAttr("disabled")
	}, 1500)
})

function choose_img(dom, clicked_dom) {
	$(dom).on("change", function() {
		//获取本地图片url地址展示在页面
		var _URL = window.URL || window.webkitURL;
		var file, img;
		if((file = this.files[0])) {
			img = new Image();
			img.onload = function() {
				$(clicked_dom).attr('src', this.src);
				$(clicked_dom).parent().siblings(".clear_img").show()
			};
			img.src = _URL.createObjectURL(file);
		}
	});
	$(clicked_dom).on('click', function() {
//		$(this).attr("src","");
		$(clicked_dom).parent().siblings(".clear_img").hide();
		$(dom).click()
	});
}
choose_img("#previewImg", "#imghead");




function change_shop() {
	//公司名称
	var company_name = $("#company_name").val();
	company_name = $.trim(company_name);
	if(company_name == "") {
		$("#company_name").focus();
		toast("请输入公司名称");
		return;
	}
	//统一社会信用代码
	var uscc = $("#uscc").val();
	uscc = $.trim(uscc);
	if(uscc == "") {
		$("#uscc").focus();
		toast("请输入信用代码");
		return;
	}
	if(social.test(uscc) == false) {
		$("#uscc").focus();
		toast("信用代码格式不正确");
		return;
	}
	//选择地区
	var checke_address = $(".checke_address").val();
	checke_address = $.trim(checke_address);
	if(checke_address == "" || get_localStorage('bdDistrictId') == null) {
		$(".checke_address").focus();
		toast("请选择公司地区");
		return;
	}
	//详细地址
	var address = $("#address").val();
	address = $.trim(address);
	if(address == '') {
		$("#address").focus();
		toast("请填写公司详细地址");
		return;
	}
	//联系人
	var contact = $("#contact").val();
	contact = $.trim(contact);
	if(contact == "") {
		$("#contact").focus();
		toast("请输入联系人姓名");
		return;
	}
	//联系人电话
	var contact_tel = $("#contact_tel").val();
	contact_tel = $.trim(contact_tel);
	if(contact_tel == "") {
		$("#contact_tel").focus();
		toast("请输入联系人电话");
		return;
	}
	if(mobilePtn.test(contact_tel) == false) {
		$("#contact_tel").focus();
		toast("电话号码格式不正确");
		return;
	}
	//验证码
	var codes = $("#code").val();
	codes = $.trim(codes);
	if(codes == "") {
		$("#code").focus();
		toast("请输入验证码");
		return;
	}
	var previewImg = document.getElementById("previewImg").files[0];
	console.log(previewImg)
	var form = new FormData();
	form.append("name", company_name);
	form.append("uscc", uscc);
	form.append("contact", contact);
	form.append("tel", contact_tel);
	form.append("bdDistrictId", get_localStorage('bdDistrictId'));
	form.append("address", address);
	form.append("smsVcode", codes);
	if(previewImg != undefined) {
		photoCompress(previewImg, {
			quality: 0.1
		}, function(base64) {
			var base64 = dataURLtoFile(base64, "businessLicenceImage.jpg");
			form.append("businessLicenceImage", base64);
		})
	}
	setTimeout(function() {
		setData(form)
	}, 1000);
}

function setData(form) {
	$.ajax({
		url: re_url(methods.perfectCpAuthInfo),
		type: "post",
		data: form,
		cache: false,
		contentType: false,
		processData: false,
		beforeSend: function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader("token", getToken());
		},
		success: function(result) {
			if(result.code == RETCODE_TOKEN_INVALID) {
				window.location.href = 'login.html';
				return;
			} else if(result.code == RETCODE_SUCCESS) {
				alert('资料上传成功');
				window.location.reload();
			} else if(result.code == ACCOUNT_DATA_APPROVAL) {
				toast(result.message);
				return;
			} else if(result.code == ACCOUNT_DATA_NO_PASS) {
				toast(result.message);
				return;
			} else if(result.code == RETCODE_FAILED) {
				toast(result.message);
			}
		},
		error: function(error) {
			toast(error.message);
		}
	});
}

function getCoPerfectInfo() { //获取企业认证信息
	var url = re_url(methods.getCpAccountAuthInfo);
	var data = {};
	var success = function(response) {
		if(response["code"] == RETCODE_SUCCESS) {
			var datas = response.data;
			console.log(datas)
			if(datas == undefined) {
				no_server();
				clearImg("#previewImg", "#imghead");
				return false;
			} else if(datas != undefined) {
				if(datas.authStatus == "1") {
					server_success();
					data_info(datas)
				} else if(datas.authStatus == "2") {
					servered();
					data_info(datas);
				} else if(datas.authStatus == "-1") {
					server_false();
					data_info(datas);
				}
			}
		} else {
			toast(response.message)
		}
	}
	util.get_ajax(url, data, success)
}

function server_false() { //认证失败
	$(".stutas_img").attr("src", "img/aprove_02.png");
	$(".status_text").text("抱歉！认证失败");
	$(".report_data").text("重新认证");
	$(".report_data").removeAttr("hidden");
	show_code()
}

function server_success() { //认证成功
	$(".stutas_img").attr("src", "img/aprove_04.png");
	$(".status_text").text("恭喜！认证成功");
	$(".form-control").attr("disabled", "disabled");
	$(".report_data").attr("hidden", "hidden");
	$('input[type="file"]').attr("disabled", "disabled");
	$(".clear_img").hide()
	hide_code()
}

function servered() { //认证审核中
	$(".stutas_img").attr("src", "img/aprove_03.png");
	$(".status_text").text("您已提交资料，正在认证中");
	$(".form-control").attr("disabled", "disabled");
	$('input[type="file"]').attr("disabled", "disabled");
	$(".clear_img").hide();
	$(".report_data").attr("hidden", "hidden");
	hide_code()
}

function no_server() { //未认证
	$(".stutas_img").attr("src", "img/aprove_05.png");
	$(".status_text").text("您还尚未认证，请去认证");
	$(".report_data").removeAttr("hidden");
	$(".form-control").val("");
	show_code()
}

function data_info(data) {
	$("#company_name").val(data.name);
	$("#uscc").val(data.uscc);
	$("#contact").val(data.contact);
	$("#contact_tel").val(data.tel);
	$(".checke_address").val(data.provinceName + data.cityName + data.districtName);
	$("#address").val(data.address);
	$("#imghead").attr("src", data.businessLicenceUrl);
	$("#articleHead").attr("src", data.chemiclaLicenceUrl);
	$("#oilsaleHead").attr("src", data.oilsaleLicenceUrl);
	save_localStorage("bdDistrictId", data.bdDistrictId);
}

$(".clear_preview").on("click", function() {
	$("#imghead").prop("src", "img/aprove_01.png");
	$("#previewImg").val("");
	$(this).hide();
})
function show_code(){
	$(".getcode_box").show();
	$(".code_box").show();
}
function hide_code(){
	$(".getcode_box").hide();
	$(".code_box").hide();
}