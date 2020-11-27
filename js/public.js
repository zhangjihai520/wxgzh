document.documentElement.style.fontSize = innerWidth / 18 + 'px';
//body_height();
onresize = function() {
	document.documentElement.style.fontSize = innerWidth / 18 + 'px';
	console.log('1rem=' + innerWidth / 18);
}

function body_height() { //input框弹出重置高度
	var h = window.innerHeight;

	function handler() {
		$('body').height(h);
	}
	var myInput = document.getElementsByTagName("input")
	for(var i = 0; i < myInput.length; i++) {
		myInput[i].addEventListener('focus', handler, false);
	}
}

function page_change(obj, url) { //页面跳转特殊处理清除微信页面缓存
	$(obj).on('click', function() {
		window.location.href = url + '?_r=' + Math.random();
	})
}

function page_changes(obj, url, dataUrl) { //页面跳转特殊处理清除微信页面缓存
	$(document).on('click', obj, function() {
		window.location.href = url + '?_r=' + Math.random() + dataUrl;
	})
}

function page_back() {
	window.history.back();
}

function go_page(url) {
	window.location.href = url + '?_r=' + Math.random()
}

function clearNoNum(obj) { //只允许输入数字并且只保留小数点2位
	obj.value = obj.value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符   
	obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
	obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数   
	if(obj.value.indexOf(".") < 0 && obj.value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
		obj.value = parseFloat(obj.value);
	}
}

function Number_num(obj) { //只能输入数字
	obj.value = obj.value.replace(/[^\d]/g, "");
}

function number_eng(obj) {
	obj.value = obj.value.replace(/[^\w\.\/]/ig, '');
	if(obj.value.length > 20) {
		obj.value = obj.value.slice(0, 20)
	}
}

function number_all(obj) { //允许输入正负数保留小数点后俩位
	obj.value = obj.value.replace(/[^\-?\d.]/g, "");
	obj.value = obj.value.replace(/\.{2,}/g, ".");
	obj.value = obj.value.replace(/\-{2,}/g, "-");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
	if(obj.value.indexOf(".") < 0 && obj.value != "" && obj.value.indexOf("-") < 0) { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
		obj.value = parseFloat(obj.value);
	}
}

function set_disabled(dom) { //设置disabled
	$(dom).attr("disabled", "disabled");
}

function remove_disabled(dom) { //删除disabled
	$(dom).removeAttr("disabled");
}

function UserAuthLevel() { //用户等级规则
	var url = re_url(methods.getUserAuthLevel);
	var data = {

	};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			if(datas.authLevel == "0") {
				if(datas.status == "2") {
					alert("您还尚未认证，请去认证");
					window.location.href = "org_account.html" + '?_r=' + Math.random();
				} else if(datas.status == "3") {
					alert("您已提交资料，正在认证中");
					window.location.href = "org_account.html" + '?_r=' + Math.random();
				} else if(datas.status == "-1") {
					alert("资料认证失败，请重新认证");
					window.location.href = "org_account.html" + '?_r=' + Math.random();
				}
			}
		}
	}
	util.get_ajax(url, data, success);
}

// ajax请求模板函数
function ajaxRequestForm(reqUrl, reqData, successCallback) {
	$.ajax({
		type: "post",
		url: reqUrl,
		data: reqData,
		dataType: "json",
		contentType: false,
		processData: false,
		beforeSend: function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader("token", getToken());
		},
		success: function(data) {
			var result = data;
			if(result["code"] == RETCODE_SUCCESS) {
				if(successCallback) {
					successCallback(result);
				}
			} else if(result["code"] == RETCODE_TOKEN_INVALID) {
				gotoLogin();
			} else {
				// toastr.warning(result["message"]);
				toast(result["message"]);
			}
		},
		error: function(error) {
			toast(error);
		}
	});
}

// 重定向到登录页
function gotoLogin() {
	removeToken();
	$(top.location).attr('href', 'login.html');
}

// ajax请求模板函数
function ajaxRequest(reqUrl, reqData, traditionalFlag, successCallback, reqType) {
	$.ajax({
		type: reqType,
		url: reqUrl,
		data: reqData,
		// 同步方式（便于赋值）
		async: false,
		dataType: "json",
		traditional: traditionalFlag,
		beforeSend: function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader("token", getToken());
		},
		success: function(data) {
			var result = data;
			if(result["code"] == RETCODE_SUCCESS) {
				if(successCallback) {
					successCallback(result);
				}
			} else if(result["code"] == RETCODE_TOKEN_INVALID) {
				toast(data.message)
				//				gotoLogin();
			} else if(result["code"] == ACCOUNT_DATA_NO_IN || result["code"] == ACCOUNT_DATA_APPROVAL ||
				result["code"] == ACCOUNT_DATA_NO_PASS || result["code"] == ACCOUNT_DATA_OILSTATION) {
				if(confirm(data.message)) {
					window.location.href = "certification_office.html" + '?_r=' + Math.random();
				}
			} else {
				toast(result["message"]);
			}
		},
		error: function(error) {
			toast(error);
		}
	});
}

function strIsNULL(str) {
	return(str == '' || str == null);
}

/*new_js*/
function change_eyes(inputs, eyes) { //密码眼睛
	if($(eyes).hasClass("fa-eye-slash")) {
		$(inputs).attr("type", "text");
		$(eyes).removeClass("fa-eye-slash");
		$(eyes).addClass("fa-eye");
		return;
	} else {
		$(inputs).attr("type", "password");
		$(eyes).removeClass("fa-eye");
		$(eyes).addClass("fa-eye-slash");
		return;
	}
}

function clear_input(inputValue) { //清除input中的value值
	$(inputValue).val("")
}

function toast(obj) { //toast底部弹出
	$(".toast_text").text(obj)
	$('.toast').toast('show');
}

/*底部弹出地址选择*/
function init_address() { //获取省份列表
	var ul_box = document.querySelector('.am-share-sns');
	ul_box.innerHTML = '';
	var url = re_url(methods.getProvinceList);
	var data = {};
	var success = function(response) {
		console.log(response)
		if(response['code'] == RETCODE_SUCCESS) {
			var datas = response.data;
			for(var i = 0; i < datas.length; i++) {
				var new_element = document.createElement('li');
				new_element.className = 'add_item';
				new_element.textContent = datas[i].provinceName;
				new_element.id = datas[i].bdProvinceId;
				ul_box.appendChild(new_element)
			}
		} else {
			toast(response.message)
		}
		save_provincesId();

	}
	util.get_ajax(url, data, success);

}

function save_provincesId() { //省份Id
	$('.add_item').on('click', function(e) {
		var data_id = $(this).attr('id');
		save_localStorage('provinces', $(this).text())
		get_city(data_id);
	})
}

function get_city(data) { //获取城市列表
	var ul_box = document.querySelector('.am-share-sns');
	ul_box.innerHTML = '';
	var url = re_url(methods.getCityList);
	var data = {
		bdProvinceId: data
	};
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			var datas = response.data;
			for(var i = 0; i < datas.length; i++) {
				var new_element = document.createElement('li');
				new_element.className = 'add_city';
				new_element.textContent = datas[i].name;
				new_element.id = datas[i].bdCityId;
				ul_box.appendChild(new_element)
			}
		}
		save_cityId()
	}
	util.get_ajax(url, data, success);
}

function save_cityId() { //城市Id
	$('.add_city').on('click', function(e) {
		var data_id = $(this).attr('id');
		save_localStorage('city', $(this).text())
		get_area(data_id)
	})
}

function get_area(data) { //获取区列表
	var ul_box = document.querySelector('.am-share-sns');
	ul_box.innerHTML = '';
	var url = re_url(methods.list);
	var data = {
		bdCityId: data
	};
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			var datas = response.data;
			console.log(datas)
			for(var i = 0; i < datas.length; i++) {
				var new_element = document.createElement('li');
				new_element.className = 'add_erea';
				new_element.textContent = datas[i].name;
				new_element.id = datas[i].bdDistrictId;
				ul_box.appendChild(new_element)
			}
		}
		save_ereaId()
	}
	util.get_ajax(url, data, success);
}

function save_ereaId() { //区域Id
	$('.add_erea').on('click', function(e) {
		var data_id = $(this).attr('id');
		save_localStorage('bdDistrictId', data_id);
		save_localStorage('area', $(this).text())
		$(".am-share").removeClass("am-modal-active");
		if(get_localStorage('provinces') == get_localStorage('city')) {
			$('.checke_address').val(get_localStorage('provinces') + get_localStorage('area'))
		} else {
			$('.checke_address').val(get_localStorage('provinces') + get_localStorage('city') + get_localStorage('area'))
		}
		setTimeout(function() {
			$(".sharebg-active").removeClass("sharebg-active");
			$(".sharebg").remove();
			$(".place_site").val("");
			$(".checke_detail").val("");
		}, 300);

		e.stopPropagation();
	})
}

function toshare() {
	init_address();
	$(".am-share").addClass("am-modal-active");
	$("body").append('<div class="sharebg"></div>');
	$(".sharebg").addClass("sharebg-active");
	$(".share_btn").click(function() {
		$(".am-share").removeClass("am-modal-active");
		setTimeout(function() {
			$(".sharebg-active").removeClass("sharebg-active");
			$(".sharebg").remove();
		}, 300);
	})
};

function down_share() {
	$(".share_btn").click(function() {
		$(".am-share").removeClass("am-modal-active");
		setTimeout(function() {
			$(".sharebg-active").removeClass("sharebg-active");
			$(".sharebg").remove();
		}, 300);
	})
}

//input输入框弹起软键盘的解决方案。
$("input,textarea").on("blur", function() {
	setTimeout(function() {
		window.scrollTo(0, 0);
	}, 100)
}).on('focus', function() {
	var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
	var offsetTop = $(this).offset().top - (clientHeight / 4);
	setTimeout(function() {
		window.scrollTo(0, offsetTop);
	}, 100)
});

//字符串转日期格式，strDate要转为日期格式的字符串
function getDate(strDate) {
	var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
		function(a) {
			return parseInt(a, 10) - 1;
		}).match(/\d+/g) + ')');
	return date;
}

function buildSelectorContentCity(url, postData, isPaging, idFieldName, textFieldName, elementSelectorArr, callback, isPost, suc) {
	// ajax请求选择器数据
	var url = re_url(url);
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var arr;
			if(isPaging) {
				arr = response.data;
			} else {
				arr = response["data"];
			}
			$.each(elementSelectorArr, function(index, elementSelector) {
				$(elementSelector).html("");
				$(elementSelector).html(buildOption(arr));
			});
			if(callback) {
				callback(arr);
			}
			suc();
		}
	};
	if(isPost) {
		util.post_ajax(url, postData, success);
	} else {
		util.get_ajax(url, postData, success);
	}

	// 构造选择器选项内容
	function buildOption(lData) {
		var options = "";
		options += "<option value=''>请选择</option>";
		$.each(lData, function(index, dict) {
			options += "<option value=" + '"' + dict[idFieldName] + '"' + ">";
			options += dict[textFieldName];
			options += "</option>";
		});
		return options;
	}
}

// 构造选择器标签的数据内容
function buildSelectorContent(url, postData, isPaging, idFieldName, textFieldName, elementSelectorArr, callback, isPost) {
	// ajax请求选择器数据
	var url = re_url(url);
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var arr;
			if(isPaging) {
				arr = response.data;
			} else {
				arr = response["data"];
			}
			$.each(elementSelectorArr, function(index, elementSelector) {
				$(elementSelector).html("");
				$(elementSelector).html(buildOption(arr));
			});
			if(callback) {
				callback(arr);
			}
		}
	};
	if(isPost) {
		util.post_ajax(url, postData, success);
	} else {
		util.get_ajax(url, postData, success);
	}

	// 构造选择器选项内容
	function buildOption(lData) {
		var options = "";
		options += "<option value=''>请选择</option>";
		$.each(lData, function(index, dict) {
			options += "<option value=" + '"' + dict[idFieldName] + '"' + ">";
			options += dict[textFieldName];
			options += "</option>";
		});
		return options;
	}

}

//根据不同浏览器获取本地图片url
function getObjectURL(file) {
	var url = null;
	// 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
	if(window.createObjectURL != undefined) { // basic
		url = window.createObjectURL(file);
	} else if(window.URL != undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if(window.webkitURL != undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}

$(".physical_want").click(function() { //物流商调转
	window.location.href = "../procurementer/physical_want.html";
})

$(".physical_nav").click(function() {
	if(get_localStorage("line_status") == "procurementer") {
		window.location.href = "purchasing.html"
	} else if(get_localStorage("line_status") == "supplier") {
		window.location.href = "../supplier/supplier_list.html"
	}
});

window.addEventListener('pageshow', function(event) { //返回刷新
	if(event.persisted) { // ios 有效, android 和 pc 每次都是 false
		location.reload();
	} else { // ios 除外
//		console.log(sessionStorage.getItem('refresh'))
		if(sessionStorage.getItem('refresh') === 'true') {
			location.reload();
		}
	}
	sessionStorage.removeItem('refresh');
});

window.alert = function(name){//Javascript中的alert提示框去掉ip地址或域名的提示
    var iframe = document.createElement("IFRAME");
    iframe.style.display="none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    window.frames[0].window.alert(name);
    iframe.parentNode.removeChild(iframe);
};
window.confirm = function (message) {//Javascript中confirm对话框去掉ip地址或域名的提示
        var iframe = document.createElement("IFRAME");
        iframe.style.display = "none";
        iframe.setAttribute("src", 'data:text/plain,');
        document.documentElement.appendChild(iframe);
        var alertFrame = window.frames[0];
        var result = alertFrame.window.confirm(message);
        iframe.parentNode.removeChild(iframe);
        return result;
};
function pushHistory() {//物理返回
	var state = {
		title: "title",
		url: "#"
	};
	window.history.pushState(state, "title", "#");
}

function getDay(dates,day) {//获取几天后
	var today = new Date(dates);
	var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
	today.setTime(targetday_milliseconds); //注意，这行是关键代码
	var tYear = today.getFullYear();
	var tMonth = today.getMonth();
	var tDate = today.getDate();
	tMonth = doHandleMonth(tMonth + 1);
	tDate = doHandleMonth(tDate);
	return tYear + "-" + tMonth + "-" + tDate;
}

function doHandleMonth(month) {
	var m = month;
	if(month.toString().length == 1) {
		m = "0" + month;
	}
	return m;
}
function current_day() {//获取当前时间
	var dates = new Date();
	dates.setTime(dates.getTime()+ 1000 * 60 * 60 * 24 *3);
	var eMon = dates.getMonth() + 1;
	eMon = eMon < 10 ? "0" + eMon : eMon
	var eDay = dates.getDate();
	eDay = eDay < 10 ? "0" + eDay : eDay
	var endDate = dates.getFullYear() + "-" + eMon + "-" + eDay;
	return endDate
}

var counts = 60;
function settime(val) {
	var sign_name = $('#contact_tel').val();
	if(sign_name == "" ){
		toast("电话号码不能为空！");
		$(val).text("获取验证码");
		$(val).removeAttr("disabled");
		return;
	};
	if(mobilePtn.test(sign_name) == false) {
		toast("请正确填写电话号码");
		$(val).text("获取验证码");
		$(val).removeAttr("disabled");
		return;
	};
	if(counts == 0) {
		$(val).removeAttr("disabled");
		$(val).text("获取验证码");
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
	var sign_name = $('#contact_tel').val();
	if(sign_name == "" ) {
		toast("电话号码不能为空");
		$(this).removeAttr("disabled")
		return;
	}
	if(mobilePtn.test(sign_name) == false){
		toast("电话号码格式不正确");
		$(this).removeAttr("disabled");
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

