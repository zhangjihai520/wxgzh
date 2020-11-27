$(function() {
	$(".click_btn").click(function() {
		checkOrderPickupCode();
		$(this).attr("disabled","disabled");
	})
})

function checkOrderPickupCode() {
	var url = re_url(methods.checkOrderPickupCode);
	var pickCode = $(".pikCode").val();
	if(pickCode == "") {
		toast("验证码不能为空");
		seTime()
		return;
	}
	var data = {
		pickupCode: pickCode
	}
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
		console.log(response)
		if(response.code == RETCODE_TOKEN_INVALID) {
			alert(response.message);
			window.location.href = "../login.html";
			return false;
		} else if(response.code == ACCOUNT_DATA_APPROVAL) {
			toast(response.message);
			seTime()
			
			return;
		} else if(response.code == ACCOUNT_DATA_NO_PASS) {
			alertCer(response.message);
			seTime()
			return;
		} else if(response.code == ACCOUNT_DATA_NO_IN) {
			alertCer(response.message);
			seTime()
			return;
		} else if(response.code == ACCOUNT_DATA_OILSTATION) {
			alert_oil(response.message)
			seTime()
		} else if(response.code == RETCODE_FAILED) {
			toast(response.message)
			seTime()
		} else if(response.code == RETCODE_SUCCESS){
			var datas = response.data;
			save_localStorage("boOrderId", datas.boOrderId);
			window.location.href = "pick_detail.html";
		}else if(response.code==410){
			$(".click").click();
			var datas =response.data;
			$(".get_before").show();
			$(".get_later").hide();
			$(".warn_sigin").text(get_days(datas));
			$(".times").text(timestampDay(datas.reqBeginTime)+' 至 '+timestampDay(datas.reqEndTime));
			seTime()
		}else if(response.code==411){
			$(".click").click();
			var datas =response.data;
			$(".get_before").hide();
			$(".get_later").show();
			seTime()
		}
	},
	error: function(error) {
		alert("网络异常");
		seTime()
	}
});

}

function get_days(data){
	var b_time =Number((new Date()).getTime());
	var e_time =Number(data.reqBeginTime);
	var more_time =(e_time-b_time)/(24*60*60*1000)
	more_time =Math.ceil(more_time);
	return more_time
}

function seTime(){
	setTimeout(function(){
				$(".click_btn").removeAttr("disabled")
			},500)
}
