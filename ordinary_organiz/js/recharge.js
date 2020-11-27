$(function() {
	getCoPerfectInfo()
	//手输的吨数发生变化
	$('.moneyNum').on('input propertychange', function() {
		var _this = $(this);
		var count = _this.val();
		if(count > 0) {
			$('#affirm').css('background', '#FF660D');

		} else {
			$('#affirm').css('background', '#FFD7B8');
		}
	});
	page_change(".disclaimer", "../text_state/pay_sate.html")
});

/*function wx_getData() {
	var url = re_url(methods.investMoney);
	if(get_localStorage("authStatus_code") != "1") {
		$('#affirm').removeAttr("data-target");
//		return;
	}
	if($('.re_money').val() == '' || $('.re_money').val() == "0") {
		$('#affirm').removeAttr("data-target");
		toast('输入错误信息');
		return;
	}
	if(get_localStorage("authStatus_code") == "1" && $('.re_money').val() != '') {
		$('#affirm').attr("data-target", "#exampleModalCenter");
		var data = {
			amount: $('.re_money').val(),
			payType: "PAY_WEI_XIN"
		}
	};
	var success = function(response) {
		save_localStorage("responseCode", response.code);
		console.log(response.code)
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			save_localStorage('appId', datas.appId);
			save_localStorage('timestamp', datas.timeStamp);
			save_localStorage('nonceStr', datas.nonceStr);
			save_localStorage('signature', datas.signature);
			save_localStorage("paySign", datas.paySign);
			save_localStorage("package", datas.package);
			save_localStorage("signType", datas.signType);
		}
	}
	util.get_ajax(url, data, success)
}*/
function wx_getData() {
	var url = re_url(methods.investMoney);
	if(get_localStorage("authStatus_code") != "1") {
		$('#affirm').removeAttr("data-target");
		//		return;
	}
	if($('.re_money').val() == '' || $('.re_money').val() == "0") {
		$('#affirm').removeAttr("data-target");
		toast('输入错误信息');
		return;
	}
	if(get_localStorage("authStatus_code") == "1" && $('.re_money').val() != '') {
		$('#affirm').attr("data-target", "#exampleModalCenter");
		var data = {
			amount: $('.re_money').val(),
			payType: "PAY_WEI_XIN"
		}
	};
	$.ajax({
		type: "GET",
		url: url,
		dataType: "json",
		data: data,
		contentType: 'application/json',
		beforeSend: function(response) {
			response.setRequestHeader("token", getToken());
		},
		success: function(response) {
			if(response.code == RETCODE_TOKEN_INVALID) {
				console.log(response)
				alert(response.message);
				window.location.href = "../login.html";
				return false;
			} else if(response.code == ACCOUNT_DATA_APPROVAL) {
				toast(response.message)
				return;
			} else if(response.code == ACCOUNT_DATA_NO_PASS) {
				alertCer(response.message);
				return;
			} else if(response.code == ACCOUNT_DATA_NO_IN) {
				alertCer(response.message);
				return;
			} else if(response.code == ACCOUNT_DATA_OILSTATION) {
				alert_oil(response.message)
				return;
			} else if(response.code == RETCODE_FAILED) {
				toast(response.message)
				return;
			} else {
				save_localStorage("responseCode", response.code);
				var datas = response.data;
				save_localStorage('appId', datas.appId);
				save_localStorage('timestamp', datas.timeStamp);
				save_localStorage('nonceStr', datas.nonceStr);
				save_localStorage('signature', datas.signature);
				save_localStorage("paySign", datas.paySign);
				save_localStorage("package", datas.package);
				save_localStorage("signType", datas.signType);
			}
		},
		error: function(error) {
			toast("网络异常")
		}

	});
}

$('.true_btn').on('click', function() {
	if(get_localStorage("responseCode") == "200") {
		wx.config({
			debug: false, // 开启调试模式
			appId: get_localStorage("appId"), // 公众号的唯一标识
			timestamp: get_localStorage("timestamp"), // 生成签名的时间戳
			nonceStr: get_localStorage("nonceStr"), // 生成签名的随机串
			signature: get_localStorage("signature"), // 签名
			jsApiList: ['checkJsApi', 'chooseWXPay'] // 填入需要使用的JS接口列表，这里是先声明我们要用到支付的JS接口
		});
		wx.ready(function(data) {
			wx.chooseWXPay({
				timestamp: get_localStorage("timestamp"), // 支付签名时间戳，
				nonceStr: get_localStorage("nonceStr"), // 支付签名随机串，不长于 32 位
				package: get_localStorage("package"), // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=xxxx）
				signType: get_localStorage("signType"), // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
				paySign: get_localStorage("paySign"), // 支付签名
				success: function(res) {
					// 支付成功后的回调函数
					window.location.href = "account.html" + '?_r=' + Math.random();
					remove_localStorage("responseCode");
				},
				cancel: function(res) {
					//若用户点击取消/返回按钮, 将商品库存返回到库存表中
				},
				err: function(err) {}
			});
			wx.error(function(err) {})
		});
	} else if(get_localStorage("responseCode") == "409") {
		toast("支付成功");
		remove_localStorage("responseCode");
	}
});
$('#affirm').on('click', function() {
	wx_getData();
});
$(".break").click(function() {
	go_page("account.html");
	sessionStorage.setItem('refresh', 'true');
})

function getCoPerfectInfo() { //获取企业认证信息
	var url = re_url(methods.getCpAccountAuthInfo);
	var data = {};
	var success = function(response) {
		if(response["code"] == RETCODE_SUCCESS) {
			var datas = response.data;
			console.log(datas)
			if(datas.authStatus == "1") {
				save_localStorage("authStatus_code", "1")
			} else {
				remove_localStorage("authStatus_code")
			}
		}
	}
	util.get_ajax(url, data, success)
}