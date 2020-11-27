$(function() {
	remove_localStorage("orderStatus");
	save_localStorage("get_orderStatus", "true");
	save_localStorage("isStop", "true");
	//	var pages = 1;
	var pages = save_localStorage("pages", "1");
	var page = get_localStorage("pages");
	var status = save_localStorage("orderStatus", "OUT_OF_WAIT");
	remove_localStorage("order_id");
	pullOnLoad(page, status);
	$(".title_item").click(function() {
		$(".order_box").html("");
		var pages = save_localStorage("pages", "1");
		var page = get_localStorage("pages");
		var status = save_localStorage("orderStatus", $(this).attr("id"));
		$(".title_item").removeClass("orange");
		$(this).addClass("orange");
		$(".pull-loading").html("上拉加载");
		$(".pull-loading").removeClass("loading");
		save_localStorage("isStop", "true");
		getTranOrderList(page, status);
		$('#scroller').css('transform', 'translate3d(0px, 0px, 0px)');
	});

	var myscroll = new iScroll("wrapper", {
		onScrollMove: function() { //拉动时

			//上拉加载
			if(get_localStorage("isStop") == "false") {
				pages = save_localStorage("pages", "1");
				return;
			}
			if(this.y < this.maxScrollY) {
				$(".pull-loading").html("释放加载");
				$(".pull-loading").addClass("loading");
				myscroll.refresh();
			} else {
				$(".pull-loading").html("上拉加载");
				$(".pull-loading").removeClass("loading");
			};
			remove_click()
		},
		onScrollEnd: function() { //拉动结束时
			myscroll.refresh();
			add_click();
			if(get_localStorage("isStop") == "false") {
				pages = save_localStorage("pages", "1");
				return;
			}
			//上拉加载
			if($(".pull-loading").hasClass('loading') && get_localStorage("isStop") == "true") {
				$(".pull-loading").html("加载中...");
				var page = get_localStorage("pages");
				page++;
				pullOnLoad(page, status);
				save_localStorage("pages", page);
			};

		}
	});

});
//上拉加载函数,ajax
function pullOnLoad(pages, status) {
	setTimeout(function() {
		getTranOrderList(pages, status);
	}, 1000);
}

function getTranOrderList(pages, status) { //物流单列表
	var url = re_url(methods.getTranOrderList);
	var data = {
		page: pages,
		size: 6,
		status: get_localStorage("orderStatus"),
	};
	console.log(data);
	var success = function(response) {
		console.log(response)
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data.list;
			if(get_localStorage("pages") == "1") {
				$(".order_box").html("");
			}
			if(datas == "") {
				$(".pull-loading").html("已经到底了...");
				//				toast("已经到底了....");
				save_localStorage("isStop", "false");
				return
			};
			$.each(datas, function(i, v) {
				$(".pull-loading").show();
				$(".order_box").append(order_item(v));
			});

			$(".set_order").click(function() {
				var car_type = "0";
				var transportId = $(this).attr("id");
				save_localStorage("transportId", transportId);
				$("#select_car").html("");
				$("#select_car").append(car_types());
				getTrToolList(car_type);
				getTrWorkerList();
			});
			$("#set_orders").click(function() {
				configCarrierRecOrder()
			});

			$(".get_order").click(function() {
				var transportId = $(this).attr("id");
				save_localStorage("transportId", transportId);
			});

			$(".sign_order").click(function() {
				var transportId = $(this).attr("id");
				save_localStorage("transportId", transportId);
			});

		}
	}
	util.get_ajax(url, data, success)
}

function order_detail(obj) {
	var order_id = $(obj).attr("id");
	var transportId = $(obj).attr("dataId");
	save_localStorage("transportId", transportId);
	save_localStorage("order_id", order_id);
	go_page('logistics_order_detail.html');
}

function order_item(data) {
	var order_item = "";
	order_item += ' <li class="col-12 order_item px-1 mt-2">';
	order_item += '<div class="form-row font_2 mt-2">';
	order_item += '<p class="col-12">';
	order_item += '<span class=" fa fa-circle icons icon_1 pr-1">' + '</span>';
	order_item += '<span class="text-muted">' + "订单号:" + '</span>';
	order_item += '<span class="pl-1">' + data.orderNo + '</span>';
	order_item += '</p>';
	//	order_item += '<p class="col-2 border rounded-pill font_0 ml-2 text-muted" hidden>' + "去开票" + '</p>';
	order_item += '</div>';
	order_item += '<div class="form-row font_2 mt-2">';
	order_item += '<p class="col-12">';
	order_item += '<span class=" fa fa-circle icons icon_2 pr-1">' + '</span>';
	order_item += '<span class="text-muted">' + "要求送达时间:" + '</span>';
	order_item += '<span class="pl-1">' + timestampDay(data.reqEndTime) + '</span>';
	order_item += '</p>';
	order_item += '</div>';
	order_item += '<div class="form-row font_2 mt-2">';
	order_item += '<p class="col-12 pl-0">';
	order_item += '<span class="  iconfont iconqidian font_6 icon_3">' + '</span>';
	order_item += '<span class=" pl-0">' + data.tOsOilstore.detailsAddress + '</span>';
	order_item += '</p>';
	order_item += '</div>';
	order_item += '<div class="form-row font_2 mt-2">';
	order_item += '<p class="col-12 pl-0">';
	order_item += '<span class=" iconfont iconqidian font_6 icon_4">' + '</span>';
	order_item += '<span class=" pl-0">' + data.tBuAddress.addressName + '</span>';
	order_item += '</p>';
	order_item += '</div>';
	order_item += '<div class="form-row font_2 py-2 border-bottom">';
	order_item += '<p class="col-12 pr-0">';
	order_item += '<span class="fa fa-circle icons icon_5 pr-1">' + '</span>';
	order_item += '<span class="text-muted">' + '物流费：' + '</span>';
	order_item += '<span class=" pl-0 tran_money font_3 trans_price">' + data.carrierTransPrice + '元' + '</span>';
	order_item += '</p>';
	order_item += '</div>';
	order_item += '<div class="form-row font_2 py-2">';
	order_item += '<button class="btn orange border rounded-pill col-4 btn-sm offset-1 order_detail" id="' + data.boOrderId +
		'" dataId="' + data.boTransportId + '" onclick="order_detail(this)">' + '详情' + '</button>';
	order_item += creat_btn(data);
	order_item += '</div></li>';
	return order_item;
}

function creat_btn(datas) {
	var build_btns = "";
	var config_btn = '<button class="btn line_orange wite click_btn rounded-pill col-4 btn-sm offset-2  set_order"  data-toggle="modal" data-target="#rob_orders" id="' +
		datas.boTransportId + '">' + '配置订单' + '</button>';
	var get_orders = '<button class="btn line_orange wite click_btn rounded-pill col-4 btn-sm offset-2 get_order" data-toggle="modal" data-target="#tran_orders"  id="' +
		datas.boTransportId + '">' + '确认出库' + '</button>';
	var sign_btn = '<button class="btn line_orange wite click_btn rounded-pill col-4 btn-sm offset-2 sign_order" data-toggle="modal" data-target="#sign_orders" id="' +
		datas.boTransportId + '">' + '确认签收' + '</button>';
	if(datas.configStatus == "0") {
		build_btns += config_btn;
	};
	if(get_localStorage("orderStatus") == "OUT_OF_WAIT" && datas.configStatus == "1") {
		build_btns += get_orders;
	};
	if(get_localStorage("orderStatus") == "IN_TRAN") {
		build_btns += sign_btn;
	}
	return build_btns;
}

function getTrWorkerList() { //物流人员
	var url = re_url(methods.getTrWorkerList);
	var data = {};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			if(datas == "") {
				toast("没有物流人员");
				return;
			};
			$("#check_worker").html("");
			$.each(datas, function(i, v) {
				$("#check_worker").append(get_worker(v))
			})

		}
	}
	util.get_ajax(url, data, success)
}

function getTrToolList(car_type) { //车辆牌号
	var url = re_url(methods.getTrToolList);
	var data = {
		toolType: car_type
	};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			if(datas == "") {
				alert("没有可供的该种交通工具");
				window.location.reload();
				return;
			};
			$("#check_car").html("");
			$.each(datas, function(i, v) {
				$("#check_car").append(get_car(v))
			})
			console.log(datas)
		}
	}
	util.get_ajax(url, data, success)
}
$("#select_car").change(function() {
	var type = $("#select_car").val();
	getTrToolList(type)
});

function car_types() { //构建车辆选项
	var car_item = "";
	car_item += ' <option value="0">' + "车" + '</option>';
	car_item += ' <option value="1">' + "船" + '</option>';
	return car_item
}

function get_car(data) { //构建车辆牌号选项
	var car_item = "";
	car_item += ' <option value="' + data.trToolId + '">' + data.toolCode + '</option>';
	return car_item
}

function get_worker(data) { //构建人员选项
	var car_item = "";
	car_item += ' <option value="' + data.trWorkerId + '">' + data.name + '</option>';
	return car_item
};

function configCarrierRecOrder() { //物流订单配置
	var url = re_url(methods.configCarrierRecOrder);
	var trToolId = $("#check_car option:selected").val();
	var trWorkerId = $("#check_worker option:selected").val();
	if(trToolId == "" || trWorkerId == "") {
		toast("数据不完整");
		return;
	}
	var data = {
		boTransportId: get_localStorage("transportId"),
		trToolId: trToolId,
		trWorkerId: trWorkerId,
	};
	console.log(data)
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			alert("配置成功");
			window.location.reload();
		} else {
			toast(response.message);
		}
	}
	util.get_ajax(url, data, success)
}

function carrierRecOrderOutStock() { //物流上订单出库
	var url = re_url(methods.carrierRecOrderOutStock);
	var data = {
		boTransportId: get_localStorage("transportId")
	};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			alert("订单进入运输中");
			window.location.reload();
		} else {
			toast(response.message);
		}
	};
	util.get_ajax(url, data, success)
}

function signOrder() { //签收订单
	var url = re_url(methods.signOrder);
	var data = {
		boTransportId: get_localStorage("transportId")
	};
	console.log(data)
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			alert("签收成功");
			window.location.reload();
		} else {
			toast(response.message);
		}
	}
	util.get_ajax(url, data, success)
};
$(".true_tran").click(function() { //确认运输
	carrierRecOrderOutStock();
});
$(".true_sign").click(function() { //签收
	signOrder();
})

function remove_click(){
	$(".order_detail").removeAttr("onclick");
	$(".set_order").removeAttr("data-target");
	$(".get_order").removeAttr("data-target");
	$(".sign_order").removeAttr("data-target");
}

function add_click(){
	$(".order_detail").attr("onclick","order_detail(this)");
	$(".set_order").attr("data-target","#rob_orders");
	$(".get_order").attr("data-target","#tran_orders");
	$(".sign_order").attr("data-target","#sign_orders");
}
