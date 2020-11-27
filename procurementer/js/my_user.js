$(document).ready(function(){
	remove_localStorage("order_type");
	getUserInfo();
	var height =$("user_img").height();
	$(".user_img").css("width",height);
})
$(".click_set").click(function(){
	window.location.href = "setting.html";
})
//企业认证
$(".click_company_cer").click(function(){
	window.location.href = "certification_oilstation.html";
})
//加油站补充认证
$(".click_oilSite_cer").click(function(){
	window.location.href = "certification_office.html";
})
function getUserInfo(){
	var url = re_url(methods.get_getUserInfo);
	var data = {};
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			var obj = response["data"];
			console.log(obj)
			$(".user_name").text(obj["name"]);
			$(".user_level").text(obj["level"]+'级会员');
			$(".user_account").text(obj["phoneNumber"]);
			$(".rounded-circle").attr("src", obj["avatarUrl"]); 
			console.log(obj["avatarUrl"])
			save_localStorage('avatarUrl',obj["avatarUrl"]);
			var status = obj["authStatus"];
			if(status == 0){
				$(".status").text("未认证");
			}else if(status == 1){
				$(".status").text("已认证");
			}else if(status == 2){
				$(".status").text("资料审核中");
			}else if(status == -1){
				$(".status").text("未通过");
			}else{
				$(".status").text("");
			}
		}
	}
	util.get_ajax(url, data, success)
}
$(".orders").click(function(){
	var order_type =$(this).attr("id");
	save_localStorage("order_type",order_type)
})
