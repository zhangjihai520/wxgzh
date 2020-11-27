$(function() {
	if(get_localStorage("form_info") !=null){
		
		var form_info =get_localStorage("form_info");
		form_info =JSON.parse(form_info);
		$('.user_name').val(form_info.sign_name);
		$('.password').val(form_info.passWord);
		$("#contact_tel").val(form_info.tel_phone);
		$('.sign_code').val(form_info.sign_code);
		for(var i=0;i<$(".supplier-box").length;i++){
			$(".supplier-box").eq(i).removeClass("choose_active");
			if(get_localStorage("login_stutas")==$(".supplier-box").eq(i).attr("id")){
				$(".supplier-box").eq(i).addClass("choose_active")
			}
		}
	}else{
		$(".form-control").val("");
		save_localStorage("login_stutas", "1");
		save_localStorage("line_status", "supplier");
		save_localStorage("href", "supplier/supplier_list.html");
	}
	$(".supplier-box").on('click', function() {
		var id = $(this).attr("id");
		var line_status = $(this).attr("data-status");
		save_localStorage("login_stutas", id)
		$(".supplier-box").removeClass("choose_active");
		$(this).addClass("choose_active");
		save_localStorage("href", $(this).attr("data-href"));
		save_localStorage("line_status", line_status);
	});
	console.log(get_localStorage("form_info"))
})

$(".sign").on('click', function() {
	var sing_btn = $("input[type='checkbox']").is(':checked')
	var sign_name = $('.user_name').val();
	var passWord = $('.password').val();
	var tel_phone = $("#contact_tel").val();
	var sign_code = $('.sign_code').val();
	var login_stutas = get_localStorage("login_stutas");
	if(sign_name == "" || sign_code == "" || passWord == "" || tel_phone == "") {
		toast("请将信息填写完整");
		return;
	};
	if(d.test(passWord) == false) {
		toast("密码格式不正确");
		return;
	};
	if(sign_name.length < 4) {
		toast("账号格式不正确，请重新输入！");
		return;
	}
	if(sing_btn == false) {
		toast("请阅读信息");
		return;
	}
	var data = {
		code: get_localStorage('this_code'),
		name: sign_name,
		password: md5(passWord),
		phoneNumber: tel_phone,
		smsVcode: sign_code,
		status: login_stutas
	}
	console.log(data)
	var url = re_url(methods.accountRegister);
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			alert("恭喜您，注册成功");
			var obj = response["data"];
			var token = obj["token"];
			setToken(token);
			set_cookie("name", name);
			set_cookie("password", passWord);
			set_cookie("login_stutas", login_stutas);
			set_cookie("href", get_localStorage("href"));
			set_cookie("line_status", get_localStorage("line_status"));
			remove_localStorage("form_info");
			window.location.href = get_localStorage("href") + '?_r=' + Math.random();
		} else {
			toast(response.message)
		}
	};
	util.get_ajax(url, data, success);
});
$(".warn").on("click",function(){
	var form_info ={
		sign_name :$('.user_name').val(),
		passWord  :$('.password').val(),
		tel_phone :$('#contact_tel').val(),
		sign_code :$('.sign_code').val()
	}
	form_info =JSON.stringify(form_info)
	save_localStorage("form_info",form_info);
	window.location.href="text_state/account_security.html"+ '?_r=' + Math.random();
});
