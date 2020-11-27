var totalCount = 0;
var totalPrice = 0;
var totalLogisticsPrice = 0;
var orderList = [];
var buAddressId = get_localStorage("buAddressId");
save_localStorage("paymentType", 0);
var paymentType = 0;
var oneDay = 24 * 3600 * 1000;
save_localStorage("order_type", "1");
$(function() {
	var back_money = getBuPurse();
	$("#re_money").val(back_money + "元")
	setOilDepot();
	setCss();
	$("#logisticsText").val("配送费用0元");
	$("#submit").click(function() {
		submitOrder();
		$(this).attr("disabled", "disabled");
	});
	var paymentTypes = get_localStorage("paymentType");
	if(null != paymentTypes && paymentTypes == 1) {
		paymentType = paymentTypes;
		var item = $("#pay_style").children(".now_check_active_two").find(".item");
		if(!item.hasClass("check_active")) {
			item.addClass("check_active");
			$("#pay_style").children(".now_check_active").find(".item").removeClass("check_active");
			setCss();
		}
	}

	//判断是否有地址
	if(buAddressId != null && buAddressId != "") {
		$("#getAddress").val(get_localStorage("buAddressName"));
	}
	if(null != buAddressId && buAddressId != '' && $("#getAddress").val() != "") {
		getTransPrice();
	}

});

//显示物流费用
function getTransPrice() {
	$.each(orderList, function(index, value) {
		value.buAddressId = buAddressId
	});
	var url = re_url(methods.getTransPriceList);
	var data = orderList;
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			var data = response['data'];
			$.each(data, function(index, value) {
				$("#" + value.osOilstoreId + "").find(".logisticsPrice").text(value.transPrice);
				totalPrice = operation.numAdd(totalPrice, value.transPrice);
				totalLogisticsPrice = operation.numAdd(totalLogisticsPrice, value.transPrice);
			});
			orderList = data;
			var re_money = getBuPurse();
			re_money = Number(re_money);
			var price_true = totalPrice - re_money;
			var new_price = Math.floor(price_true * 100) / 100
			price_true.toFixed(2);
			if(price_true > 0) {
				$("._money").text(new_price);
			} else {
				$("._money").text("0");
			}

			$("#logisticsText").val("配送费用" + totalLogisticsPrice + "元");
			$(".logistics").show();
		}
	}
	util.post_ajax(url, data, success)
}

//提交
function submitOrder() {
	var bol = true;
	var transType = $("#transType").val();
	var paymentType = $("#paymentType").val();
	var reqDeginTime = '';
	reqDeginTime = $("#hello2").val();
	var reqEndTime = $("#hello3").val();
	if(transType == 0) {
		if(buAddressId == null || buAddressId == "" || $("#getAddress").val() == "") {
			toast("请选择配送地址！");
			setTimeout(function() {
				$("#submit").removeAttr("disabled");
			}, 100)
			return;
		}
		if(null == reqDeginTime || reqDeginTime == '') {
			toast("请选择到货开始时间！");
			setTimeout(function() {
				$("#submit").removeAttr("disabled");
			}, 100)
			return;
		};
		if(null == reqEndTime || reqEndTime == '') {
			toast("请选择到货结束时间！");
			setTimeout(function() {
				$("#submit").removeAttr("disabled");
			}, 100)
			return;
		}

	} else {
		if(paymentType == 1) {
			toast("自提不能货到付款！");
			setTimeout(function() {
				$("#submit").removeAttr("disabled");
			}, 100)
			return;
		}

		if(null == reqDeginTime || reqDeginTime == '') {
			toast("请选择提货开始时间！");
			setTimeout(function() {
				$("#submit").removeAttr("disabled");
			}, 100)
			return;
		};
		if(null == reqEndTime || reqEndTime == '') {
			toast("请选择提货结束时间！");
			setTimeout(function() {
				$("#submit").removeAttr("disabled");
			}, 100)
			return;
		}
	}

	$.each(orderList, function(index, value) {
		var _this = $("#" + value.osOilstoreId + "").find(".money");
		var price = 0;
		$.each(_this, function() {
			price +=Math.floor(Number($(this).text())*100)/100;
		});
		value.toltalOilPrice = price;
		value.reqEndTime = reqEndTime;
		value.reqDeginTime = reqDeginTime;
		value.paymentType = get_localStorage("paymentType");
		value.transType = transType;
		var sourceStatus = get_localStorage("sourceStatus")
		if(null != sourceStatus && sourceStatus == 1) {
			value.sourceStatus = sourceStatus;
		}
	});
	setTimeout(function() {
		$("#submit").removeAttr("disabled");
	}, 1000)
	var url = re_url(methods.recomPalceOrder);
	var data = orderList;
//	console.log(data)
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			if(response.data.length == 1) {
				save_localStorage("boOrderId", response.data[0].boOrderId);
				window.location.href = 'wait_pay.html?_r=' + Math.random();
			} else {
				window.location.href = 'all_orders.html?_r=' + Math.random();
			}
		}
	};
	util.post_ajax(url, data, success);
}

function setOilDepot() {
	var src = '';
	$.each(getArrayValueOfKey("oilDepot"), function(index, value) {
		totalCount = 0;
		src += '<div class="col-12 border-bottom" id="' + value.osOilStoreId + '">';
		src += '<div class="row wite_bg pt-2">';
		src += '<div class="col-2 pr-2">';
		src += '<img src="' + value.url + '" class="img_logo rounded-circle" alt="" /></div>';
		src += '<p class="col-10 station_name font_5 font_weight">' + value.name + '</p></div>';
		src += '<div class="row oil_list wite_bg pt-2">';
		var boOilList = [];
		var price = 0;
		$.each(value.boOilList, function(index1, item) {
			totalCount = parseInt(totalCount) + parseInt(item.count);
			price = operation.numMultiply(item.count, item.oilPrice);
			totalPrice += parseFloat(price);
			boOilList.push(item);
			src += '<div class="col-12 row p-0 m-0 px-2 pb-1 orange text-right">';
			src += '<p class="col-2 p-0 m-0 oil_no font_weight">' + item.no + '#</p>';
			src += '<p class="col-4 p-0 m-0 oil_num font_weight">' + item.count + '吨</p>';
			src += '<p class="col-6 p-0 m-0 oil_money font_3">金额: <span class="money">' + price + '</span>元</p></div>';
		});
		src += '</div>';
		src += '<div class="row wite_bg pt-2 logistics">';
		src += '<div class="col-12">物流费用：<span class="logisticsPrice">0</span>元</div>';
		src += '</div>';
		src += '</div>';
		var order = {
			"boOilList": boOilList,
			"totalCount": totalCount,
			"osOilstoreId": value.osOilStoreId
		}
		orderList.push(order);
	});
	$("#oilDepot").html(src);
	var re_money = getBuPurse();
	re_money = Number(re_money);
	var price_true = totalPrice - re_money;
	var new_price = Math.floor(price_true * 100) / 100
		price_true.toFixed(2);
	if(price_true > 0) {
		$("._money").text(new_price);
	} else {
		$("._money").text("0");
	}

}

function setCss() {
	var payment = $("#payment").find(".check_active").text();
	$("#paymentText").val(payment);
}

function oil_price() { //重置金额
	var oil_price = 0;
	var count = 0;
	var price = 0;
	var re_money = getBuPurse();
	$.each(getArrayValueOfKey("oilDepot"), function(index, value) {
		$.each(value.boOilList, function(index1, item) {
			totalCount = parseInt(totalCount) + parseInt(item.count);
			price = operation.numMultiply(item.count, item.oilPrice);
			oil_price += parseFloat(price);
		})
	});
	re_money = Number(re_money);
	var price_true = totalPrice - re_money;
	var new_price = Math.floor(price_true * 100) / 100
		new_price.toFixed(2);
	if(price_true < 0) {
		price_true = 0;
	}
	return new_price
}

$(".now_check_active").on("click", function() {
	$(this).find(".item").addClass("check_active");
	$(this).next().find(".item").removeClass("check_active");
	$(this).parent().prev().find(".check_active_value").val(0);
	paymentType = 0;
	setCss();
});

$(".now_check_active_two").on("click", function() {
	$(this).find(".item").addClass("check_active");
	$(this).prev().find(".item").removeClass("check_active");
	$(this).parent().prev().find(".check_active_value").val(1);
	paymentType = 1;
	setCss();
});

//点击物流配送
$("#logisticsRule").on('click', function() {
	$(".logisticsPrice").text("");
	$("#getAddress").val("");
	$(".time_begin").text("到货开始时间：");
	$(".time_title").text("到货结束时间：");
	$("#shippingAddress").show();
	$("#logisticsText").val("配送费用0元");
	$(".logistics").hide();
	$("._money").text(oil_price());
});

//点击自提
$("#doorTo").on("click", function() {
	$("#getAddress").val("");
	$(".logistics").hide();
	$(".time_begin").text("提货开始时间：");
	$(".time_title").text("提货结束时间：");
	$("#shippingAddress").hide();
	$("#paymentType").val(0);
	paymentType = 0;
	var item = $("#pay_style").children(".now_check_active").find(".item");
	if(!item.hasClass("check_active")) {
		item.addClass("check_active");
		$("#pay_style").children(".now_check_active_two").find(".item").removeClass("check_active");
		setCss();
	}
	var logistics = $("#arive_style").find(".check_active").text();
	$("#logisticsText").val(logistics);
	save_localStorage("paymentType", 0);
	$(".logistics").hide();
	$("._money").text(oil_price());
});

$("#pay_bank").on("click", function() { //银行付款
	save_localStorage("paymentType", 0);
	if($("#transType").val() != 0) {
		$(".logistics").hide();
		$("._money").text(oil_price());
	}
})
$("#payOnDelivery").on("click", function() { //货到付款
	if($("#transType").val() != 0) {
		$(".logistics").hide();
		$("._money").text(oil_price());
		$("#logisticsText").val("配送费用0元");
	}
	$("#transType").val(0);
	$(".logistics").show();
	$("#shippingAddress").show();
	var item = $("#arive_style").children(".now_check_active").find(".item");
	save_localStorage("paymentType", 1);
});

$("#getAddress").on('click', function() {
	save_localStorage("addressStatus", 1);
	window.location.href = 'my_address.html?_r=' + Math.random();
});

$(".item").click(function() {
	$("#pay_style").collapse('hide');
	$("#arive_style").collapse('hide');
});
$(".arive_style").click(function() {
	$("#pay_style").collapse('hide');
});
$(".pay_style").click(function() {
	$("#arive_style").collapse('hide')
});

$(document).on("click", "#hello3", function(event) {
	$("#arive_style").collapse('hide');
	$("#pay_style").collapse('hide');
	$(this).unbind();
	var dates = $("#hello2").val();
	var min_day = getDay(dates, 0);
	var max_day = getDay(dates, 2);
	console.log(getDay(dates, 3))
	if(dates == "") {
		toast("请先选择开始时间");
		return false;
	}
	laydate.render({
		elem: '#hello3',
		showBottom: false,
		trigger: 'click',
		theme: 'molv',
		min: min_day,
		max: max_day,
		show: true
	});

})

$("#hello2").click(function() {
	$("#arive_style").collapse('hide');
	$("#pay_style").collapse('hide');
	$(this).unbind();
});
laydate.render({
	elem: '#hello2',
	showBottom: false,
	trigger: 'click',
	theme: 'molv',
	min: current_day(),
	max: '2900-10-01',
	done: function(value, date) {
		$("#hello3").val("");
		$('.demo-input').remove();
		$(".box").html('<input type="text" class="form-control  demo-input font_1 pl-0 pt-1" readonly="readonly" id="hello3" value="" placeholder="点击选择到货时间" style="height: 1.7rem !important;">');
	}
});

function getBuPurse() {
	var tableBody = '';
	// ajax加载账户表格数据
	ajaxRequest(api + "/t/bo/order/getBuPurse",
		'', false,
		function(result) {
			var arr = result.data.balance;
			arr = arr.toFixed(2);
			tableBody = arr;
		}, "get");
	return tableBody;
}