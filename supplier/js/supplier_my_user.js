getMyInfo();
function getMyInfo() {
	var url = re_url(methods.getSupplierBaseInfo);
	var data = {};
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			console.log(response)
			updataHtml(response["data"]);
		} else {
			toast(response.message);
		}
	}
	util.get_ajax(url, data, success)
}

function updataHtml(data) {
	$(".user_name").text(data["name"]);
	$(".user_accoun").text(data["phoneNumber"]);
	$(".rounded-circle").attr("src", data["avatarUrl"]);
	$(".sale_num").text(data["recentBuyerCount"]);
	$(".oil_num").text(data["recentSaleOilCount"]);
	$(".order_num").text(data["recentTotalOrderCount"]);
	$(".no_pay").text(data["unPayPrice"]);
	save_localStorage('avatarUrl', data["avatarUrl"]);
	var status = data["authStatus"];
	if(status == 0) {
		$(".status").text("未认证");
	} else if(status == 1) {
		$(".status").text("已认证");
	} else if(status == 2) {
		$(".status").text("资料审核中");
	} else if(status == -1) {
		$(".status").text("未通过");
	} else {
		$(".status").text("");
	}
}
//点击事件
$(".item_QRcode").click(function() {

})
$(".item_message").click(function() {
	window.location.href = "supplier_invoice_list.html";
})
$(".item_cer").click(function() {
	window.location.href = "certification_office.html";
});

// var canvas;

// 提货二维码modal显示事件
$('#pick-up-qr-code-dialog').on('show.bs.modal', function(event) {
	$("#output").html('');
	var qrcode = $("#output").qrcode(urls+"wxsn-web/wx_ue_organ/get_good_check/check_goods.html");
	// var qrcode= $('#output').qrcode({
	// 	render: 'canvas',
	// 	width: 245,
	// 	height: 245,
	// 	padding: 20,
	// 	text: 'http://www.baidu.com'
	// });
	// canvas=qrcode.find('canvas').get(0);
});

// //下载二维码
// $("#sure-download-qr-code").on("click", function () {
//     // downloadPhoto();
//     document.querySelector("#downPhoto").setAttribute('href', canvas.toDataURL());
//     document.getElementById("downPhoto").click();
// });