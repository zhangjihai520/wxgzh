var counts = 60;
/*$(document).ready(function() {
	markes();
	$(".supplier-box").on('click', function() {
		var id = $(this).attr("id");
		save_localStorage("login_stutas", id)
		$(".supplier-box").removeClass("choose_active");
		$(this).addClass("choose_active");
	});
});
*/
/*function markes() { //上次标注
	var length = $(".supplier-box").length;
	for(var i = 0; i < length; i++) {
		if($(".supplier-box").eq(i).attr("id") == get_localStorage("login_stutas")) {
			$(".supplier-box").removeClass("choose_active");
			$(".supplier-box").eq(i).addClass("choose_active")
		}
	}
}*/

function settime(val) {
	var sign_name = $('.user_tel').val();
	if(sign_name == "") {
		toast("电话号码不能为空！");
		return;
	}
	if(mobilePtn.test(sign_name) == false) {
		toast("请正确填写电话号码");
		return;
	}
	if(counts == 0) {
		$(val).removeAttr("disabled")
		$(val).text("获取验证码")
		counts = 60;
		return;
	} else {
		$(val).attr("disabled", "disabled");
		$(val).text("重新发送（" + counts + "）");
		counts--;
	}
	clearTimeout(get);
	var get = setTimeout(function() {
		settime(val);
	}, 1000);
}

$(".get_code").on('click', function() {
	settime(this);
	var sign_name = $('.user_tel').val();
	if(sign_name == "" || mobilePtn.test(sign_name) == false) {
		return;
	}
	var url = re_url(methods.sendSms);
	var data = {
		phoneNumber: sign_name
	};
	console.log(data)
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			toast("验证码发送成功")
		} else {
			toast(response.message)
		}
	};
	util.get_ajax(url, data, success);
});
$(".change_passowrd").on('click', function() {
	var name = $('.user_name').val();
	var phoneNumber = $(".user_tel").val();
	var smsVcode = $('.sign_code').val();
	var passWord = $('#new_password').val();
	var password_agin = $("#db_newPassword").val();
//	var login_stutas = get_localStorage("login_stutas");
	if(name == "" || smsVcode == "" || passWord == "" || phoneNumber == "" || password_agin == "") {
		toast("请将信息填写完整");
		return;
	};
	if(d.test(passWord) == false) {
		toast("密码格式不正确");
		return;
	};
	if(name.length<4){
		toast("账号格式不正确，请重新输入！");
		return;
	}
	if(passWord != password_agin) {
		toast("俩次密码不一致");
		return;
	}
	var data = {
		code: "1",
		name: name,
		password: md5(passWord),
		phoneNumber: phoneNumber,
		smsVcode: smsVcode,
//		status: login_stutas
	}
	console.log(data)
	var url = re_url(methods.forgetPassword);
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			alert("恭喜您，密码修改成功");
			set_cookie("name", name);
			set_cookie("password", passWord);
//			set_cookie("login_stutas", login_stutas);
//			set_cookie("href", get_localStorage("href"));
			window.location.href = "login.html" + '?_r=' + Math.random();
		} else {
			toast(response.message)
		}
	};
	util.get_ajax(url, data, success);
})