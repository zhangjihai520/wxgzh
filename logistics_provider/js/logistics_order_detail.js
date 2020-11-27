$(function() {
	getOrderDetail();
	if(get_localStorage("transportId") == null) {
		return;
	} else {
		getCarrierConfigInfo()
	}
})

function getOrderDetail() {
	var url = re_url(methods.getCarrierCanRecOrderDetail);
	var data = {
		boOrderId: get_localStorage("order_id")
	};
	var success = function(response) {
		console.log(response);
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			console.log(get_localStorage("get_orderStatus"))
			if(get_localStorage("get_orderStatus") == "true") {
				$(".click_btn").hide();
				$(".trans_price").text(datas.carrierTransPrice + "元");	
			} else if(get_localStorage("get_orderStatus") == "false") {
				$(".click_btn").show();
				$(".trans_price").text(datas.carrierPrice + "元");
			}
			
			console.log(datas)
			var oil_list = datas.oilList;
			console.log(datas);
			if(datas.configStatus == "1") {
				$(".config_box").show();
			} else if(datas.configStatus == "0") {
				$(".config_box").hide();
			}
			$.each(oil_list, function(i, v) {
				$(".oils_box").append(oils_detail(v));
			});
			$('.get_set').text(datas.tOsOilstore.detailsAddress);
			$(".end_site").text(datas.tBuAddress.addressName);
			$(".distance").text(datas.distance + "km");
			$(".oil_contant_name").text(datas.tOsOilstore.contact);
			$(".oil_contant_phone").text(datas.tOsOilstore.contactNumber);
			$(".end_contant_name").text(datas.tBuAddress.contactName);
			$(".end_contant_phone").text(datas.tBuAddress.contactPhone);
			
		} else {
			alert(response.message);
			go_page("logistics_index.html");
		}
	}
	util.get_ajax(url, data, success)
}

function oils_detail(data) {
	var oils_detail = "";
	oils_detail += '<div class="col-3 text-center border-right">';
	oils_detail += '<p class="orange font_4">' + data.no + '#' + '</p>';
	oils_detail += '<p class="font_1">' + data.count + '吨' + '</p>';
	oils_detail += '</div>';
	return oils_detail;
}

function carrierRecOrder() { //物流商接单
	var url = re_url(methods.carrierRecOrder);
	var data = {
		boOrderId: get_localStorage("order_id"),
		carrierPrice: parseFloat($(".trans_price").text())
	};
	var success = function(response) {
		console.log(response)
		if(response.code == RETCODE_SUCCESS) {
			alert("接单成功");
			page_back();
			remove_localStorage("get_orderStatus");
			sessionStorage.setItem('refresh', 'true');
		} else {
			alert(response.message)
		}
	};
	util.get_ajax(url, data, success)
}

$(".click_btn").click(function() {
	carrierRecOrder()
});

function getCarrierConfigInfo() { //查询配置信息
	var url = re_url(methods.getCarrierConfigInfo);
	var data = {
		boTransportId: get_localStorage("transportId"),
	};
	console.log(data)
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			console.log(datas)
			if(datas.tTrTool == "" || datas.tTrWorker == "") {
				return false;
			}
			if(datas.tTrTool != "") {
				if(datas.tTrTool.toolType == 0) {
					$(".car").text("车")
				} else if(datas.tTrTool.toolType == 1) {
					$(".car").text("船")
				}
				$(".car_code").text(datas.tTrTool.toolCode)
				$(".car_people").text(datas.tTrWorker.name)
			}

		}
	}
	util.get_ajax(url, data, success)
}