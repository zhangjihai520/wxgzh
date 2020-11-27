var titleArray = ["中石油", "中石化", "中海油", "民营"];
var pageStatus = 0;

$(document).ready(function() {
	getCoPerfectInfo();
})

$(".report_data").click(function() {
	$(this).attr("disabled", "disabled");
	change_shop();
	setTimeout(function() {
		$(".report_data").removeAttr("disabled")
	}, 2000)
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
			};
			img.src = _URL.createObjectURL(file);
		}
	});
	$(clicked_dom).on('click', function() {
		$(clicked_dom).parent().siblings(".clear_img").hide();
		$(dom).click()
	});
}
choose_img("#idCard_front_img", "#idCard_front_head");
choose_img("#idCard_back_img", "#idCard_back_head");
choose_img("#license_img", "#license_head");
choose_img("#logo_img", "#logo_head");

function clearFnc(){
	clearImg("#idCard_front_img", "#idCard_front_head");
	clearImg("#idCard_back_img", "#idCard_back_head");
	clearImg("#license_img", "#license_head");
	clearImg("#logo_img", "#logo_head");
}

var userType = 0;

function change_shop() {
	//供应商类型
	if(userType == 0) {
		$("#user_type").focus();
		toast("请选择供应商类型");
		return;
	}
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
	//供应商税号
	var userNo = $("#user_no").val();
	userNo = $.trim(userNo);
	if(userNo == "") {
		$("#user_no").focus();
		toast("请输入供应商税号");
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
	//法人姓名
	var legalerName = $("#legaler_name").val();
	legalerName = $.trim(legalerName);
	if(legalerName == "") {
		$("#legaler_name").focus();
		toast("请输入法人姓名");
		return;
	}
	//法人身份证号码
	var legalerCardNo = $("#legaler_card_no").val();
	legalerCardNo = $.trim(legalerCardNo);
	if(legalerCardNo == "") {
		$("#legaler_card_no").focus();
		toast("请输入法人身份证号码");
		return;
	}
	if(Id_code.test(legalerCardNo) == false) {
		$("#legaler_card_no").focus();
		toast("法人身份证号错误");
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
	//开户许可证编号
	var bankCode = $("#bankCode").val();
	bankCode = $.trim(bankCode);
	if(bankCode == "") {
		$("#bankCode").focus();
		toast("请填写开户许可证编号");
		return;
	}
	//开户银行名称
	var bankNode = $("#bankNode").val();
	bankNode = $.trim(bankNode);
	if(bankNode == "") {
		$("#bankNode").focus();
		toast("请填写开户银行名称");
		return;
	}
	//银行账户名称
	var bankUsername = $("#bankUsername").val();
	bankUsername = $.trim(bankUsername);
	if(bankUsername == "") {
		$("#bankUsername").focus();
		toast("请填写银行账户名称");
		return;
	}
	//是否支持自主提款
	var pickUpDirect = get_localStorage("pickUpDirect");
	//银行账号
	var bankAccount = $("#bankAccount").val();
	bankAccount = $.trim(bankAccount);
	if(bankAccount == "" || bank_code.test(bankAccount) == false) {
		$("#bankAccount").focus();
		toast("请正确写银行账号");
		return;
	}
	var licenseImg = document.getElementById("license_img").files[0];
	console.log(licenseImg)
	if(licenseImg == undefined && pageStatus == 0) {
		toast('您未上传营业执照,请上传');
		return
	}
	var idCardFrontImg = document.getElementById("idCard_front_img").files[0];
	if(idCardFrontImg == undefined && pageStatus == 0) {
		toast('您未上传身份证正面,请上传');
		return
	}
	var idCardBackImg = document.getElementById("idCard_back_img").files[0];
	if(idCardBackImg == undefined && pageStatus == 0) {
		toast('您未上传身份证反面,请上传');
		return
	}
	var logoImg = document.getElementById("logo_img").files[0];
	if(logoImg == undefined && pageStatus == 0) {
		toast('您未上传公司logo,请上传');
		return
	}

	var form = new FormData();
	if(licenseImg == undefined || idCardFrontImg == undefined || idCardBackImg == undefined || logoImg == undefined) {
		form.append("type", userType);
		form.append("taxNumber", userNo);
		form.append("name", company_name);
		form.append("uscc", uscc);
		form.append("contact", contact);
		form.append("legalerName", legalerName);
		form.append("legalerNo", legalerCardNo);
		form.append("tel", contact_tel);
		form.append("bdDistrictId", get_localStorage('bdDistrictId'));
		form.append("address", address);
		form.append("bankNode", bankNode);
		form.append("bankPermission", bankCode);
		form.append("bankUsername", bankUsername);
		form.append("pickupDirectReceipt", pickUpDirect);
		form.append("bankAccount", bankAccount);
		form.append("smsVcode", codes);
		if(licenseImg != undefined) {
			photoCompress(licenseImg, {
				quality: 0.1
			}, function(base64) {
				var base64 = dataURLtoFile(base64, "businessLicenceImage.jpg");
				form.append("businessLicenceImage", base64);
			})
		};
		if(idCardFrontImg != undefined) {
			photoCompress(idCardFrontImg, {
				quality: 0.1
			}, function(base641) {
				var base641 = dataURLtoFile(base641, "legalerFrontImage.jpg");
				form.append("legalerFrontImage", base641);
			})
		};
		if(idCardBackImg != undefined) {
			photoCompress(idCardBackImg, {
				quality: 0.1
			}, function(base642) {
				var base642 = dataURLtoFile(base642, "legalerBackImage.jpg");
				form.append("legalerBackImage", base642);
			})
		};
		if(logoImg != undefined) {
			photoCompress(logoImg, {
				quality: 0.1
			}, function(base643) {
				var base643 = dataURLtoFile(base643, "logoImage.jpg");
				form.append("logoImage", base643);
			})
		};
		setTimeout(function() {
			setData(form)
		}, 1000);
	} else {
		photoCompress(licenseImg, {
			quality: 0.1
		}, function(base64) {
			var base64 = dataURLtoFile(base64, "businessLicenceImage.jpg");
			photoCompress(idCardFrontImg, {
				quality: 0.1
			}, function(base641) {
				var base641 = dataURLtoFile(base641, "legalerFrontImage.jpg");
				photoCompress(idCardBackImg, {
					quality: 0.1
				}, function(base642) {
					var base642 = dataURLtoFile(base642, "legalerBackImage.jpg");
					photoCompress(logoImg, {
						quality: 0.1
					}, function(base643) {
						var base643 = dataURLtoFile(base643, "logoImage.jpg");
						form.append("type", userType);
						form.append("taxNumber", userNo);
						form.append("name", company_name);
						form.append("uscc", uscc);
						form.append("contact", contact);
						form.append("legalerName", legalerName);
						form.append("legalerNo", legalerCardNo);
						form.append("tel", contact_tel);
						form.append("bdDistrictId", get_localStorage('bdDistrictId'));
						form.append("address", address);
						form.append("bankNode", bankNode);
						form.append("bankPermission", bankCode);
						form.append("bankUsername", bankUsername);
						form.append("pickupDirectReceipt", pickUpDirect);
						form.append("bankAccount", bankAccount);
						form.append("smsVcode", codes);
						form.append("businessLicenceImage", base64);
						form.append("legalerFrontImage", base641);
						form.append("legalerBackImage", base642);
						form.append("logoImage", base643);
						setData(form);
					})
				});
			})
		});
	}

}

function setData(form) {
	$.ajax({
		url: re_url(methods.perfectSupplierInfo),
		type: "post",
		data: form,
		cache: false,
		contentType: false,
		processData: false,
		beforeSend: function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader("token", getToken());
		},
		success: function(result) {
			console.log(result);
			if(result.code == RETCODE_TOKEN_INVALID) {
				alert(response.message);
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
	var url = re_url(methods.getSupplierPerfectInfo);
	var data = {};
	var success = function(response) {
		if(response["code"] == RETCODE_SUCCESS) {
			var datas = response.data;

			console.log(datas)
			if(datas == undefined) {
				no_server();
				save_localStorage("pickUpDirect", 1);
				clearFnc();
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
				if(datas.pickupDirectReceipt == 0) {
					$(".choose_pay").removeClass("chosePay_active");
					$(".choose_pay").eq(1).addClass("chosePay_active");
					save_localStorage("pickUpDirect", 0);
				} else {
					$(".choose_pay").removeClass("chosePay_active");
					$(".choose_pay").eq(0).addClass("chosePay_active");
					save_localStorage("pickUpDirect", 1);
				};
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
	pageStatus = 1;
	$(".report_data").removeAttr("hidden");
	$(".choose_pay").attr("onclick", "save_pickUp(this)");
	$(".choose_pay").show();
	show_code()
}

function server_success() { //认证成功
	$(".stutas_img").attr("src", "img/aprove_04.png");
	$(".status_text").text("恭喜！认证成功");
	$(".form-control").attr("disabled", "disabled");
	$(".report_data").attr("hidden", "hidden");
	$('input[type="file"]').attr("disabled", "disabled");
	$(".clear_img").hide();
	$(".choose_pay").attr("onclick", "");
	$(".choose_pay").hide();
	$(".chosePay_active").show();
	hide_code();
}

function servered() { //认证审核中
	$(".stutas_img").attr("src", "img/aprove_03.png");
	$(".status_text").text("您已提交资料，正在认证中");
	$(".form-control").attr("disabled", "disabled");
	$('input[type="file"]').attr("disabled", "disabled");
	$(".clear_img").hide();
	$(".report_data").attr("hidden", "hidden");
	$(".choose_pay").attr("onclick", "");
	$(".choose_pay").hide();
	$(".chosePay_active").show();
	hide_code();
}

function no_server() { //未认证
	$(".stutas_img").attr("src", "img/aprove_05.png");
	$(".status_text").text("尚未认证，请认证");
	$(".report_data").removeAttr("hidden");
	$(".form-control").val("");
	$(".choose_pay").attr("onclick", "save_pickUp(this)");
	$(".choose_pay").show();
	show_code();
}

function data_info(data) {
	userType = data.type;
	$("#user_type").val(titleArray[data.type - 1]);
	$("#user_no").val(data.taxNumber);
	$("#company_name").val(data.name);
	$("#uscc").val(data.uscc);
	$("#contact").val(data.contact);
	$("#contact_tel").val(data.tel);
	$("#legaler_name").val(data.legalerName);
	$("#legaler_card_no").val(data.legalerNo);
	$(".checke_address").val(data.provinceName + data.cityName + data.districtName);
	$("#address").val(data.address);
	$("#bankNode").val(data.bankNode);
	$("#bankCode").val(data.bankPermission);
	$("#bankUsername").val(data.bankUsername);
	$("#bankAccount").val(data.bankAccount);
	$("#license_head").attr("src", data.businessLicenceUrl);
	$("#idCard_front_head").attr("src", data.legalerFrontUrl);
	$("#idCard_back_head").attr("src", data.legalerBackUrl);
	$("#logo_head").attr("src", data.logoUrl);
	save_localStorage("bdDistrictId", data.bdDistrictId);
}

$(".idCard_front_clear").on("click", function() {
	$("#idCard_front_head").prop("src", "img/aprove_01.png");
	$("#idCard_front_img").val("");
})
$(".idCard_back_clear").on("click", function() {
	$("#idCard_back_head").prop("src", "img/aprove_01.png");
	$("#idCard_back_img").val("");
})
$(".license_clear").on("click", function() {
	$("#license_head").prop("src", "img/aprove_01.png");
	$("#license_img").val("");
})
$(".logo_clear").on("click", function() {
	$("#logo_head").prop("src", "img/aprove_01.png");
	$("#logo_img").val("");
})

function chooseUserType() {
	$(".am-share-title").text("选择类型");
	$(".am-share").addClass("am-modal-active");
	$("body").append('<div class="sharebg"></div>');
	$(".sharebg").addClass("sharebg-active");
	$(".share_btn").click(function() {
		$(".am-share").removeClass("am-modal-active");
		$(".sharebg-active").removeClass("sharebg-active");
		$(".sharebg").remove();
	})
	var ul_box = document.querySelector('.am-share-sns');
	ul_box.innerHTML = '';
	for(var i = 0; i < 4; i++) {
		var new_element = document.createElement('li');
		new_element.className = 'add_item';
		new_element.textContent = titleArray[i];
		new_element.id = i + 1;
		ul_box.appendChild(new_element)
	}
	$('.add_item').on('click', function(e) {
		userType = $(this).attr('id');
		$('#user_type').val($(this).text());
		$(".am-share").removeClass("am-modal-active");
		$(".sharebg-active").removeClass("sharebg-active");
		$(".sharebg").remove();
	})
};

function show_code() {
	$(".getcode_box").show();
	$(".code_box").show();
}

function hide_code() {
	$(".getcode_box").hide();
	$(".code_box").hide();
}

function save_pickUp(obj) {
	$(".choose_pay").removeClass("chosePay_active");
	$(obj).addClass("chosePay_active");
	save_localStorage("pickUpDirect", $(obj).attr("id"))
}