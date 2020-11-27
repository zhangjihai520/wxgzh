var type = get_localStorage("order_type");
var arr = [];
$(function() {
	var pages = save_localStorage("pages", "1");
	var page = get_localStorage("pages");
	var status = save_localStorage("orderStatus", "");
	save_localStorage("comfirm_order", "1");
	pullOnLoad(page);
	getOrderStatusCount(type);
	var height_1 = $(".title_contanier").height();
	var height_2 = $(".nav_contanier").height();
	var height = height_1 + height_2;
	$("#wrapper").css("top", height + 15);
	$("#wrapper").css("bottom", 5);
	save_localStorage("isStop", "true");
	remove_localStorage("order_id");

	$(".nav_item").click(function() {
		myscroll.refresh();
		var pages = save_localStorage("pages", "1");
		var page = get_localStorage("pages");
		var status = save_localStorage("orderStatus", $(this).attr("id"));
		$(".nav_item").removeClass("orange");
		$(this).addClass("orange");
		$(".order_box").html("");
		$(".pull-loading").html("上拉加载");
		$(".pull-loading").removeClass("loading");
		save_localStorage("isStop", "true");
		orderList(page)
		$('#scroller').css('transform', 'translate3d(0px, 0px, 0px)');
	});

	var myscroll = new iScroll("wrapper", {
		onScrollMove: function() { //拉动时
			//上拉加载
			if(get_localStorage("isStop") == "false") {
				return;
			}
			if(this.y < this.maxScrollY) {
				$(".pull-loading").html("释放加载");
				$(".pull-loading").addClass("loading");
				myscroll.refresh()
			} else {
				$(".pull-loading").html("上拉加载");
				$(".pull-loading").removeClass("loading");
			};
			 removc_click()
		},
		onScrollEnd: function() { //拉动结束时
			myscroll.refresh();
			 add_clikc()
			if(get_localStorage("isStop") == "false") {
				pages = save_localStorage("pages", "1");
				return;
			}
			//上拉加载
			if($(".pull-loading").hasClass('loading') && get_localStorage("isStop") == "true") {
				$(".pull-loading").html("加载中...");
				var page = get_localStorage("pages");
				page++;
				pullOnLoad(page);
				save_localStorage("pages", page);
//				console.log(page)
			};

		}
	});

});

function pullOnLoad(pages) {
	setTimeout(function() {
		orderList(pages)
	}, 1000);
}

function orderList(page) {
	var url = re_url(methods.orderList);
	var data = {
		page: page,
		size: 5,
		status: get_localStorage("orderStatus"),
		type: get_localStorage("order_type")
	};
//	console.log(data)
	var success = function(response) {
		console.log(response.data);
		if(response.code == RETCODE_SUCCESS) {
			var item_nums = response.data;
			var datas = response.data.list;
			if(get_localStorage("pages")=="1"){
				$(".order_box").html("");
			}
			if(datas == "") {
				$(".pull-loading").html("已经到底了...");
//				toast("已经到底了....");
				save_localStorage("isStop", "false");
				return;
			};
			$(".order_box").append(order_list(datas));
			$(".buy_agin").click(function() {
				save_localStorage("boOrderId", $(this).attr("id"))
				$.each(datas, function(i, v) {
					if(v.boOrderId == get_localStorage("boOrderId")) {
						buy_again(v)
					}
				})
			});
			$(".cancel_btn").click(function() {
				var type = $(this).attr("datatype");
				save_localStorage("datatype", type);
				if(get_localStorage("datatype") == 1) {
					$(".cancel_sign").text("该订单为推荐订单并且有多单，是否取消");

				} else {
					$(".cancel_sign").text("是否确认取消订单")
				}
			})
		}
	}
	util.get_ajax(url, data, success);
}

function order_list(body_data) {
	var order_list = "";
	$.each(body_data, function(index, value) {
		order_list += order_item(value);
	});
	return order_list;
}

function order_item(data) {
	var order_item = "";
	var toltalOilPrice =data.toltalOilPrice;
	var payAmount =data.payAmount;
	var sub_money =(operation.numSubtract(toltalOilPrice,payAmount))
//	console.log(sub_money)
	order_item += '<li class="col-12 mt-2">';
	order_item += '<div class="form-row font_2 mt-2">';
	order_item += '<p class="col-8">';
	order_item += '<span >' + '订单信息' + '</span>';
	order_item += Isinvoice(data);
	order_item += '</p>';
	order_item += '<p class="col-4 text-right">';
	order_item += '<span class=" fa fa-circle green_light pr-1">' + '' + '</span>';
	order_item += '<span>' + shop_status(data.status) + '</span> </p>';
	order_item += '</div>';

	order_item += '<div class="form-row font_1 mt-2">';
	order_item += '<div class="col-10">';
	order_item += '<span class="item_name">' + '订单号：' + '</span>';
	order_item += '<span class=" px-0">' + data.orderNo + '</span>';
	order_item += '</div>';
	order_item += '<input class="copy_dom" value="' + data.orderNo + '" >';
	order_item += '<p class="copy col-2  text-right orange"" onclick="copy(this)">' + '复制' + '</p>';
	order_item += '</div>';

	order_item += '<div class="form-row font_2 mt-2">';
	order_item += '<p class="col-12 pr-0">' + data.oilStoreName + "：" + '</p>';
	var oilPriceArray = data["boOilList"];
	for(var k = 0; k < oilPriceArray.length; k++) {
		const oilPrice = oilPriceArray[k];
		order_item += shop_info(oilPrice);
	}
	order_item += '</div>';

	order_item += '<div class="form-row font_1 mt-2">';
	order_item += '<div class="col-12">';
	order_item += '<span class="item_name">' + '配送方式：' + '</span>';
	order_item += '<span>' + physical_type(data) + '</span>';
	order_item += '</div>';
	order_item += '</div>';

	order_item += '<div class="form-row font_1 mt-2">';
	order_item += '<div class="col-12">';
	order_item += '<span class="item_name">' + addtail(data) + '</span>';
	order_item += '<span>' + data.detailAddress + '</span>';
	order_item += '</div>';
	order_item += '</div>';

	order_item += '<div class="form-row font_1 mt-2">';
	order_item += '<div class="col-12">';
	order_item += '<span class="item_name">' + '下单时间：' + '</span>';
	order_item += '<span>' + timestampToTime(data.createTime) + '</span>';
	order_item += '</div>';
	order_item += '</div>';
	
	order_item += '<div class="form-row font_1 mt-2">';
	order_item += '<div class="col-12">';
	order_item += '<span class="item_name">' + '预计开始时间：' + '</span>';
	order_item += '<span>' + timestampDay(data.reqDeginTime) + '</span>';
	order_item += '</div>';
	order_item += '</div>';

	
	order_item += '<div class="form-row font_1 mt-2">';
	order_item += '<div class="col-12">';
	order_item += '<span class="item_name">' + '预计到达时间：' + '</span>';
	order_item += '<span>' + timestampDay(data.reqEndTime) + '</span>';
	order_item += '</div>';
	order_item += '</div>';
	
	order_item += '<div class="form-row font_1 mt-2">';
	order_item += '<div class="col-12">';
	order_item += '<span class="item_name">' + '返现钱包余额扣除：' + '</span>';
	order_item += '<span class=" total_money font_4">' +(operation.numSubtract(sub_money,data.suDeductAmount))+ '元' + '</span>';
	order_item += '</div>';
	order_item += '</div>';
	
	order_item += '<div class="form-row font_1 mt-2">';
	order_item += '<div class="col-12">';
	order_item += '<span class="item_name">' + '总金额：' + '</span>';
	order_item += '<span class=" total_money font_4">' + data.toltalOilPrice + '元' + '</span>';
	order_item += '</div>';
	order_item += '</div>';
	
	order_item += '<div class="form-row font_1 pb-2 mt-2 border-bottom">';
	order_item += '<div class="col-12">';
	order_item += '<span class="item_name">' + '实付金额：' + '</span>';
	order_item += '<span class=" total_money font_4">' + data.payAmount + '元' + '</span>';
	order_item += '</div>';
	order_item += '</div>';

	order_item += '<div class="form-row font_1 pb-2 mt-2">';
	order_item += '<div class="col-3">';
	order_item += db_look_physical(data);
	order_item += '</div>';
	order_item += '<div class="col-9 text-right">';
	order_item += db_buildBtn(data);
	order_item += '</div></div>';

	order_item += '</li>';
	return order_item;
}
function addtail(data){
	var detail="";
	if(data.transType==0){
		detail="到货地址："
	}else{
		detail="上门地址："
	}
	return detail
}

function Isinvoice(datas) { //判断是否开票
	var invoice_info = "";
	if(datas["status"] == "BOS_FINISH" && datas["invoiceFlag"] == 1) {
		invoice_info += '<span class="font_1 invoice_status">' + '(已开发票)' + '</span>';
	} else if(datas["status"] == "BOS_FINISH" && datas["invoiceFlag"] == 0) {
		invoice_info += '<span class="font_1 invoice_status">' + '(未开发票)' + '</span>';
	} else {
		invoice_info += ""
	}
	return invoice_info;
}

function shop_info(info) { //商品明细
	var shop_info = "";
	shop_info += '<div class="pl-1">';
	shop_info += '<span class=" pr-1">' + info.no + "#" + '</span>';
	shop_info += '<span class=" pr-1">' + info.count + '吨' + '</span>';
	shop_info += '<span>' + '金额: ' + '</span>';
	shop_info += '<span  class="oil_price pr-1">' + (Number(info.oilPrice) * Number(info.count)).toFixed(2) + '元' + '</span>';
	shop_info += '</div>';
	return shop_info
}

function shop_status(data) { //商品状态
	var shop_status = "";
	if(data == "BOS_PENDING_MENTION") {
		shop_status = "待自提";
	} else if(data == "BOS_IN_TRANSIT") {
		shop_status = "运输中";
	} else if(data == "BOS_TOBE_SHIPPED") {
		shop_status = "待发货";
	} else if(data == "BOS_CHERCK_PAY_UNPASS") {
		shop_status = "财务未通过";
	} else if(data == "BOS_CHERCK_PAY") {
		shop_status = "支付审核中";
	} else if(data == "BOS_UNPAYID") {
		shop_status = "未完成";
	} else if(data == "BOS_PAYID") {
		shop_status = "已支付";
	} else if(data == "BOS_FINISH") {
		shop_status = "已完成";
	} else if(data == "BOS_CANCEL") {
		shop_status = "已取消";
	}else if(data=="BOS_CONFIRMED"){
		shop_status = "待确认";
	}
	return shop_status
}

function db_look_physical(datas) { //判断显示查看物流
	var look_phsical = "";
	var look_physicalhtml = '<p class="font_1 go_physical text-center" id="' + datas.boOrderId + '"  onClick=" go_physicalInfo(this)">' + '<span class="fa fa-truck">' + '</span>' + '<span>' + '查看物流' + '</span>' + '</p>';
	if(datas["status"] == "BOS_UNPAYID" && datas["paymentType"] == 1) {
		look_phsical += look_physicalhtml;
	} else if(datas["status"] == "BOS_PAYID" && datas["transType"] == "0") {
		look_phsical += look_physicalhtml;
	} else if(datas["status"] == "BOS_FINISH" && datas["transType"] == "0") {
		look_phsical += look_physicalhtml;
	} else if(datas["status"] == "BOS_IN_TRANSIT") {
		look_phsical += look_physicalhtml;
	} else if(datas["status"] == "BOS_CHERCK_PAY" && datas["paymentType"] == 1) {
		look_phsical += look_physicalhtml;
	} else if(datas["status"] == "BOS_CHERCK_PAY_UNPASS" && datas["paymentType"] == 1) {
		look_phsical += look_physicalhtml;
	}
	return look_phsical;
}

function db_buildBtn(datas) { //判断按钮显示
	//	console.log(datas["paymentType"]);
	var build_btns = "";
	var cancel_btn = '<span class=" border font_1 cancel_btn px-1 mx-1 btns" datatype="' + datas["isRecommendOrder"] + '" id="' + datas["boOrderId"] + '" data-toggle="modal" data-target="#cancel_model" onClick="get_orderId(this)">' + '取消订单' + '</span>';
	var go_pay_btn = '<span class=" border font_1 px-1 mx-1 btns go_pay_btn text-muted" id="' + datas["boOrderId"] + '" onClick="go_pay(this)">' + '去支付' + '</span>';
	var go_sure_btn = '<span class=" border font_1 px-1 mx-1 btns go_sure_btn" id="' + datas["boOrderId"] + '" onClick="go_pay(this)">' + '去确认' + '</span>';
	var dlete_btn = '<span class=" border font_1 px-1 mx-1 btns dlete_btn" id="' + datas["boOrderId"] + '" data-toggle="modal" data-target="#delte_modal" onClick="get_orderId(this)">' + '删除订单' + '</span>';
	var buy_again_btn = '<span class=" border font_1 px-1 mx-1 btns agin_btn buy_agin" id="' + datas["boOrderId"] + '">' + '再次购买' + '</span>';
	var go_invoice = '<span class=" border font_1 px-1 mx-1 btns go_invoice" id="' + datas["boOrderId"] + '" onClick="go_invoice(this)">' + '去开票' + '</span>';
	var change_order = '<span class=" border font_1 px-1 mx-1 btns change_order" id="' + datas["boOrderId"] + '">' + '修改订单' + '</span>';
	if(datas["status"] == "BOS_UNPAYID") {
		build_btns += go_pay_btn;
	};
	if(datas["status"] == "BOS_CHERCK_PAY_UNPASS") {
		build_btns += go_pay_btn;
	};
	if(datas["status"] == "BOS_TOBE_SHIPPED" && datas["paymentType"] == "1") {
		build_btns += cancel_btn;
		//		build_btns += change_order;
	};
	if(datas["status"] == "BOS_UNPAYID" && datas["paymentType"] == "0") {
		build_btns += cancel_btn;
		//		arr.push(datas["boOrderId"]);
	};
	if(datas["status"] == "BOS_CHERCK_PAY_UNPASS" && datas["paymentType"] == "0") {
		build_btns += cancel_btn;
	};
	if(datas["status"] == "BOS_CANCEL") {
		build_btns += dlete_btn;
	};
	if(datas["status"] == "BOS_FINISH") {
		build_btns += buy_again_btn;

	};
	if(datas["status"] == "BOS_FINISH" && datas["invoiceFlag"] == "0") {
		build_btns += go_invoice;
	};
	if(datas["transType"] == "0" && datas["status"] == "BOS_UNPAYID" && datas["paymentType"] == "0") {
		//		build_btns += change_order;
	}
	if(datas["transType"] == "0" && datas["paymentType"] == "0" && datas["status"] == "BOS_CHERCK_PAY") {
		//		build_btns += change_order;
	}
	if(datas["status"]=="BOS_CONFIRMED"){
		build_btns +=go_sure_btn;
	}
	return build_btns;
}

function physical_type(data) { //配送方式
	var physical_type = "";
	if(data.transType == 0) {
		physical_type = "物流配送："+'<span class="text-danger">'+data.transPrice+"元"+'</span>';
	} else {
		physical_type = "上门自提"
	}
	return physical_type
}

function go_physicalInfo(data) { //查看物流
	var orderIds = $(data).attr("id");
	getOrderTranInfo(orderIds);
	save_localStorage("boOrderId", orderIds);
}

function getOrderTranInfo(order_id) {
	var url = re_url(methods.getOrderTranInfo);
	var data = {
		orderId: order_id
	};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			if(response.data.status == "OUT_OF_WAIT") {
				toast("订单正在出库中...");
				return;
			} else {
				window.location.href = 'look_physical.html' + '?_r=' + Math.random();
			}

		}
	}
	util.get_ajax(url, data, success)
}

function buy_again(data) { //再次购买
	var oilDepot = [];
	var boOilList = [];
	$.each(data.boOilList, function(i, v) {
		var boOil = {
			"oiOilId": v.oiOilId,
			"oilPrice": v.oilPrice,
			"count": v.count,
			"no": v.no
		};
		boOilList.push(boOil);
	});
	var oilStore = {
		"boOilList": boOilList,
		"name": data.oilStoreName,
		"url": data.logoUrl,
		"osOilStoreId": data.osOilstoreId
	};
	oilDepot.push(oilStore);
	save_localStorage("oilDepot", oilDepot);
	window.location.href = 'comfirm_orders.html' + '?_r=' + Math.random();
}

function go_pay(data) { //去支付
	var boOrderId = $(data).attr('id')
	save_localStorage('boOrderId', boOrderId);
	window.location.href = 'wait_pay.html' + '?_r=' + Math.random();
}

function go_invoice(data) { //去开票
	var boOrderId = $(data).attr('id');
	save_localStorage('boOrderId', boOrderId);
	save_localStorage("pageStyle", "go_invoice");
	window.location.href = 'invoice_list.html' + '?_r=' + Math.random();
}

function copy(obj) { //复制
	$(obj).prev(".copy_dom").select();
	document.execCommand("Copy");
	toast("复制成功");
	$(obj).blur();
}

function change_order(data) {
	var boOrderId = $(data).attr('id');
	save_localStorage('boOrderId', boOrderId);
	window.location.href = 'change_orders.html' + '?_r=' + Math.random();
}

function getOrderStatusCount(data) { //获取订单数量
	var url = re_url(methods.getOrderStatusCount);
	var data = {
		type: data
	};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
//			console.log(datas);
			$(".all_no").text(datas.ALL_COUNT);
			$(".wait_no").text(datas.BOS_TOBE_SHIPPED);
			$(".dont_no").text(datas.BOS_UNPAYID);
			$(".yet_no").text(datas.BOS_PAYID);
			$(".done_no").text(datas.BOS_FINISH);
			$(".physical_no").text(datas.BOS_IN_TRANSIT);
			$(".drop_no").text(datas.BOS_PENDING_MENTION);
			$(".finance_no").text(datas.BOS_CHERCK_PAY_UNPASS);
		}
	}
	util.get_ajax(url, data, success)
};

function del_order() { //删除订单
	var url = re_url(methods.delectOrder);
	var data = {
		boOrderId: get_localStorage('boOrderId')
	};
//	console.log(data);
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			alert('删除成功');
			window.location.reload();
		}
	}
	util.get_ajax(url, data, success)
}

function cancel_order() { //取消订单
	var url = re_url(methods.cancelOrder);
	var data = {
		boOrderId: get_localStorage('boOrderId')
	};
//	console.log(data);
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			alert('取消成功');
			window.location.reload();
		}
	}
	util.get_ajax(url, data, success);
}

function get_orderId(obj) {
	var id = $(obj).attr("id");
	save_localStorage("boOrderId", id);
}

$(".true_btn").click(function() {
	del_order();
});
$(".is_show").click(function() {
	cancel_order();
});

function removc_click(){
	$(".cancel_btn").removeAttr("data-target");
	$(".go_physical").removeAttr("onClick");
	$(".go_pay_btn").removeAttr("onClick");
	$(".go_sure_btn").removeAttr("onClick");
	$(".dlete_btn").removeAttr("data-target");
	$(".agin_btn").removeClass("buy_agin");
	$(".go_invoice").removeAttr("onClick");
}

function add_clikc(){
	$(".cancel_btn").attr("data-target","#cancel_model");
	$(".go_physical").attr("onClick","go_physicalInfo(this)");
	$(".go_pay_btn").attr("onClick","go_pay(this)");
	$(".go_sure_btn").attr("onClick","go_pay(this)");
	$(".dlete_btn").attr("data-target","#delte_modal");
	$(".agin_btn").addClass("buy_agin");
	$(".go_invoice").attr("onClick","go_invoice(this)");
}

