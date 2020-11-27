$(function(){
	localStorage.clear();
//	get_code();
	save_localStorage("login_stutas", "1");
	save_localStorage("line_status","supplier");
	save_localStorage("href", "supplier/supplier_list.html");
	$(".supplier-box").on('click', function(){
		var id = $(this).attr("id");
		var line_status =$(this).attr("data-status");
		save_localStorage("login_stutas", id);
		save_localStorage("line_status", line_status);
		$(".supplier-box").removeClass("choose_active");
		$(this).addClass("choose_active");
		console.log($(this).attr("data-href"))
		save_localStorage("href",$(this).attr("data-href"));
	});
	login();
})


function markes(){//上次登录标注
	var length =$(".supplier-box").length;
	for(var i=0;i<length;i++){
		if($(".supplier-box").eq(i).attr("id")==get_localStorage("login_stutas")){
			$(".supplier-box").removeClass("choose_active");
			$(".supplier-box").eq(i).addClass("choose_active")
		}
	}
}
function login() { //登入密码
	if(get_cookie("name")!=null || get_cookie("password") !=null ||get_cookie("login_stutas") !=null ||get_cookie("href") !=null ||get_cookie("line_status") !==null){
		$('.user_name').val(get_cookie("name"));
		$('#login_password').val(get_cookie("password"));
		save_localStorage("login_stutas",get_cookie("login_stutas"));		
		save_localStorage("href",get_cookie("href"));
		save_localStorage("line_status",get_cookie("line_status"));
		markes();
	}else{
		$('.user_name').val("");
		$('.password').val("");
		del_cookie("name");
		del_cookie("password");
		del_cookie("login_stutas");
		del_cookie("href");
		del_cookie("line_status");
	}
	$('.login').on('click', function(e) {
		var name = $('.user_name').val();
		var passWord = $('#login_password').val();
		var login_stutas = get_localStorage("login_stutas");
		if(name == "") {
			toast("账号不能为空");
			return;
		}
		if(name.length < 3) {
			toast("账号错误，请重新填写");
			return;
		}
		if(passWord == "") {
			toast("密码能为空！");
			return;
		};
		var url = re_url(methods.login);
		var data = {
			"name": name,
			"password": md5(passWord),
			"code": get_localStorage('this_code'),
			"status": login_stutas,
		};
		var success = function(response) {
			console.log(response)
			if(localStorage.getItem('token')) {
				removeToken();
			};
			if(response['code'] == RETCODE_SUCCESS) {
				var datas = response.data;
				console.log(datas);
				var obj = response["data"];
				var token = obj["token"];
				setToken(token);
				window.location.href =get_localStorage("href") + '?_r=' + Math.random();
				set_cookie("name", name);
				set_cookie("password", passWord);
				set_cookie("login_stutas",login_stutas);
				set_cookie("href",get_localStorage("href"));
				set_cookie("line_status",get_localStorage("line_status"));
			} else {
				toast(response.message);
			}
		}
		util.post_ajax(url, data, success)
	})
}

function get_code() {
	var url = re_url(methods.getAppIdAndRedirect);
	var code = GetQueryString("code");
	var data = {

	};
	var success = function(response) {
		var datas = response.data;
		var appId = datas.appId;
		var redirectUri = datas.redirectUri
		if(code == null) {
			window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + redirectUri + "&response_type=code&scope=snsapi_userinfo#wechat_redirect"
		} else {
			if(get_localStorage('this_code')) {
				remove_localStorage('this_code')
			};
			save_localStorage('this_code', code)
		}
	};

	util.get_ajax(url, data, success)
}

function GetQueryString(name) { //获取code
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(null != r) {
		return unescape(r[2]);
	}
	return null;
}

