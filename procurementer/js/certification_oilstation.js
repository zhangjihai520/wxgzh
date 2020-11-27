$(document).ready(function(){
//	remove_localStorage()
	getOilStorePerfectInfo();
	
})

function getOilStorePerfectInfo(){ //获取企业认证信息
	var url = re_url(methods.getOilStorePerfectInfo);
	var data = {};
	var success = function(response) {
		if(response["code"] == RETCODE_SUCCESS) {
			var datas = response.data;
			console.log(datas)
			if(datas.authStatus=="1" && datas.isOilsite=="0"){
				no_server();
				data_info(datas);
			
			}else if(datas.authStatus=="2"&& datas.isOilsite=="1"){
				servered();
				data_info(datas);
				$("#licencehead").attr("src", datas.oilsaleLicenceUrl);
			}else if(datas.authStatus=="-1"&& datas.isOilsite=="1"){
				server_false();
				data_info(datas);
				$("#licencehead").attr("src", datas.oilsaleLicenceUrl);
			}else if(datas.isOilsite=="1"&& datas.isOilsite=="1"){
				server_success();
				data_info(datas);
				$("#licencehead").attr("src", datas.oilsaleLicenceUrl);
			}
			
		}else if(response["code"] == RETCODE_FAILED){
			toast(response.message);
			setTimeout(function(){
				window.location.href="my_user.html";
			},1000)
		}
	}
	util.get_ajax(url, data, success)
}

function no_server(){ //未认证
	$(".stutas_img").attr("src", "img/aprove_05.png");
	$(".status_text").text("尚未认证，请认证");
	$(".report_data").removeAttr("hidden");
}

function server_false(){//认证失败
	$(".stutas_img").attr("src", "img/aprove_02.png");
	$(".status_text").text("抱歉！认证失败");
	$(".report_data").text("重新认证");
	$(".report_data").removeAttr("hidden");
}

function server_success(){ //认证成功
	$(".stutas_img").attr("src", "img/aprove_04.png");
	$(".status_text").text("恭喜！认证成功");
	$(".report_data").attr("hidden","hidden");
	$('input[type="file"]').attr("disabled", "disabled");
	$(".clear_img").hide();
}

function servered(){ //认证审核中
	$(".stutas_img").attr("src", "img/aprove_03.png");
	$(".status_text").text("您已提交资料，正在认证中");
	$(".report_data").attr("hidden","hidden");
	$('input[type="file"]').attr("disabled", "disabled");
	$(".clear_img").hide();
}
$(".clear_oilsale").on("click", function() {
	$("#licencehead").prop("src","img/aprove_01.png");
	$("#licenceImage").val("");
});
function data_info(data) {
	$("#company_name").val(data.name);
	$("#uscc").val(data.uscc);
	$("#contact").val(data.contact);
	$("#contact_tel").val(data.tel);
	$(".checke_address").val(data.addressName);
	$("#address").val(data.address);
	$("#bankNode").val(data.bankNode);
	$("#bankUsername").val(data.bankUsername);
	$("#bankAccount").val(data.bankAccount);
	$("#imghead").attr("src", data.businessLicenceUrl);
	$("#articleHead").attr("src", data.chemiclaLicenceUrl);
	$("#oilsaleHead").attr("src", data.wholesaleLicenceUrl);
	save_localStorage("bdDistrictId", data.bdDistrictId);
}

$("#licenceImage").on("change", function() {
		//获取本地图片url地址展示在页面
		var _URL = window.URL || window.webkitURL;
		var file, img;
		if((file = this.files[0])) {
			img = new Image();
			img.onload = function() {
				$("#licencehead").attr('src', this.src);
				$("#licencehead").parent().siblings("._clear_img").show()
			};
			img.src = _URL.createObjectURL(file);
		}
	});
	$("#licencehead").on('click', function() {
		$("#licenceImage").click()
	});
	
$(".clear_preview").on("click", function() {//清除
	$("#licencehead").prop("src", "img/aprove_01.png");
	$("#licenceImage").val("");
	$(this).hide();
});

function data_supplement(){//资料补充
	var licenceImage = document.getElementById("licenceImage").files[0];
	if(licenceImage == undefined) {
		alert('请上传照片');
		return;
	}
	var form = new FormData();
		photoCompress(licenceImage, {quality:0.1},function(base641){
			var base641=dataURLtoFile(base641, "oilsaleLicenceImage1.jpg");	
			form.append("oilsaleLicenceImage",base641);
		$.ajax({
			url: re_url(methods.buyerInfoExpand),
			type:"post",
			data:form,
			cache:false,
			contentType:false,
			processData:false,
			beforeSend: function(XMLHttpRequest) {
				XMLHttpRequest.setRequestHeader("token", getToken());
	
			},
			success: function(result) {
				console.log(result);
				if(result.code == RETCODE_TOKEN_INVALID) {
					alert(result.message);
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
	})
}
$(".report_data").click(function() {
	$(this).attr("disabled", "disabled");
	data_supplement();
	setTimeout(function() {
		$(".report_data").removeAttr("disabled")
	}, 1000)
})

