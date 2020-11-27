var height = $(".header").get(0).offsetHeight;
$("#wrapper").css("top", height);
save_localStorage("isStop", "true");
$(function() {
	var pages = 1;
	remove_localStorage("order_id");
	pullOnLoad();
	var myscroll = new iScroll("wrapper", {
		onScrollMove: function() { //拉动时
			if(get_localStorage("isStop") == "false") {
				$(".pull-loading").html("暂无更多数据");
				return;
			}
			//上拉加载
			if(this.y < this.maxScrollY) {
				$(".pull-loading").html("释放加载");
				$(".pull-loading").addClass("loading");
				myscroll.refresh()
			} else {
				$(".pull-loading").html("上拉加载");
				$(".pull-loading").removeClass("loading");
			}
//			remove_click();
			console.log("aaa")
		},
		onScrollEnd: function() { //拉动结束时
			myscroll.refresh();
			console.log("vvv")
//			add_click();
			//上拉加载
			if(get_localStorage("isStop") == "false") {
				$(".pull-loading").html('暂无更多数据');
				return;
			}
			if($(".pull-loading").hasClass('loading') && get_localStorage("isStop") == "true") {
				$(".pull-loading").html("加载中...");
				pages++;
				pullOnLoad(pages);
			};
		}
	});

});

function pullOnLoad(pages) {
	setTimeout(function() {
		getToOrderList(pages);
	}, 1000);
}

function getToOrderList(pages) {
	var url = re_url(methods.getToOrderList);
	var data = {
		page: pages,
		size: 4
	};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			//			console.log(response.data.list);
			var datas = response.data.list;
			if(datas == "") {
				$(".pull-loading").html("暂无更多数据");
				save_localStorage("isStop", "false");
				return
			}
			$.each(datas, function(i, v) {
				$(".pull-loading").show();
				$(".order_box").append(order_item(v))
			});
		}
	}
	util.get_ajax(url, data, success)
}

function order_detail(obj) {//详情
	var order_id = $(obj).attr("id");
	save_localStorage("order_id", order_id);
	window.location.href = "physical_order_detail.html" + '?_r=' + Math.random();
}

function delte_order(obj) {//删除
	var order_id = $(obj).attr("id");
	save_localStorage("order_id", order_id);
}

function get_way(obj) {//上下架
	var order_id = $(obj).attr("id");
	var type = $(obj).attr("data_status");
	save_localStorage("order_id", order_id);
	save_localStorage("data_status", type);
}

function trans_order(obj){//修改
	var order_id = $(obj).attr("id");
	save_localStorage("order_id", order_id);
	$(".trans_price").val($(obj).attr("data-price"))
}



function order_item(data) {
	var order_item = "";
	order_item += '<li class="form-row wite_bg px-1 mt-2 border_3 border">';
	order_item += '<div class="col-6">';
	order_item += '<span class="font_4 pr-1">' + '物流配送' + '</span>';
	order_item += '<span class="orange_bg font_1 wite border_1 px-1 text-center">' + order_status(data) + '</span>';
	order_item += '</div>';
	order_item += '<div class="col-6 text-right">';
	order_item += '<span class="font_1 border border_1 text-danger text-center px-1 order_detail" id="' + data.toOrderId + '" onclick="order_detail(this)">' + '详情' + '</span>';
	order_item += '</div>';
	order_item += '<div class="col-12 font_1 text-black-50 border-bottom pb-2">';
	order_item += '<span>' + '订单号：' + '</span>';
	order_item += '<span>' + data.orderNo + '</span>';
	order_item += '</div>';
	order_item += '<div class="col-12 mt-2">';
	order_item += '<span class="font_6">' + data.endContacts + '</span>';
	order_item += '<span class="font_6">' + data.endPhone + '</span>';
	order_item += '<span class="font_3 text-black-50">' + '收' + '</span>';
	order_item += '</div>';
	order_item += '<div class="col-12 font_1 text-black-50 border-bottom pb-2">';
	order_item += '<p>' + data.endDetailAddress + '</p>';
	order_item += '</div>';
	order_item += '<div class="col-12 py-2">';
	order_item += '<div class="form-row font_1 text-black-50">';
	order_item += '<p class="col-4 ">' + timestampDay(data.createTime) + '</p>';
	order_item += '<p class="col-2 border text-center border_3 mx-1 delte_order" id="' + data.toOrderId + '" data-toggle="modal" data-target="#delte_modal" onclick="delte_order(this)">' + "删除" + '</p>';
	if(data.status == 0) {
		order_item += '<p class="col-2 border text-center border_3 mr-1 border_orange put_away orange" id="' + data.toOrderId + '" data_status="1" data-toggle="modal" data-target="#put_away" onclick="get_way(this)">' + "上架" + '</p>'
	} else {
		//		order_item += '<p class="col-2 border text-center border_3 mr-1 cancel_order" id="' + data.toOrderId + '" data-toggle="modal" data-target="#cancel_model">' + "取消" + '</p>';
		order_item += '<p class="col-2 border text-center border_3 mr-1 border_orange down_away orange" id="' + data.toOrderId + '" data_status="2" data-toggle="modal" data-target="#dowm_away" onclick="get_way(this)">' + "下架" + '</p>'
	}

	order_item += change_btn(data);
	order_item += '</div></div>';
	order_item += '</li>';
	return order_item;
}

function order_status(data) { //订单状态
	var status = "";
	if(data.status == "1") {
		return status = "已上架"
	} else if(data.status == "0") {
		return status = "已下架"
	}
	/* else if(data.status == "2") {
			return status = "已接单"
		}*/
}

function change_btn(data) { //修改物流价格
	var change_btn = '<p class="col-3 border text-center border_3 green_light border-success trans_order" id="' + data.toOrderId + '" data-price="' + data.amount + '"  data-toggle="modal" data-target="#trans_price" onclick="trans_order(this)">' + "改物流价" + '</p>';
	if(data.status == "1") {
		return change_btn;
	} else if(data.status == "0") {
		return "";
	} else if(data.status == "2") {
		return "";
	}
}

function deleteToOrder() { //删除
	var url = re_url(methods.deleteToOrder);
	var data = {
		toOrderId: get_localStorage("order_id")
	};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			toast("删除成功");
			remove_localStorage("order_id");
			setTimeout(function() {
				window.location.reload();
			}, 500);
		}
	}
	util.get_ajax(url, data, success)
}

function upperOrLowerToOrder() { //下架
	var url = re_url(methods.upperOrLowerToOrder);
	var data = {
		"toOrderId": get_localStorage("order_id"),
		"status": get_localStorage("data_status")
	};
	console.log(data)
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			toast("下架成功");
			remove_localStorage("data_status");
			remove_localStorage("order_id");
			setTimeout(function() {
				window.location.reload();
			}, 500);
		}
	};
	util.post_ajax(url, data, success)
}

function uperOrder() { //上架
	var url = re_url(methods.upperOrLowerToOrder);
	var data = {
		"toOrderId": get_localStorage("order_id"),
		"status": get_localStorage("data_status")
	};
	console.log(data)
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			toast("上架成功");
			remove_localStorage("data_status");
			remove_localStorage("order_id");
			setTimeout(function() {
				window.location.reload();
			}, 500);
		}
	};
	util.post_ajax(url, data, success)
}

function updateToOrderTranPrice(price) { //修改
	var url = re_url(methods.updateToOrderTranPrice);
	var data = {
		toOrderId: get_localStorage("order_id"),
		amount: price
	};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			toast("修改成功");
			remove_localStorage("order_id");
			setTimeout(function() {
				window.location.reload();
			}, 500);
		}
	};
	util.get_ajax(url, data, success)
}

$(".delte_btn").click(function() {
	if(get_localStorage("order_id") == null) {
		return;
	}
	deleteToOrder()
})
$(".down_btn").click(function() { //下架
	if(get_localStorage("order_id") == null || get_localStorage("data_status") == null) {
		return;
	}
	upperOrLowerToOrder()
})
$(".trans_btn").click(function() { //修改
	if(get_localStorage("order_id") == null) {
		return;
	}
	var trans_price = $(".trans_price").val()
	updateToOrderTranPrice(trans_price)
})
$(".put_btn").click(function() { //上架
	if(get_localStorage("order_id") == null || get_localStorage("data_status") == null) {
		return;
	}
	uperOrder()
})
$(".back").click(function() {
	remove_localStorage("begin_info");
	remove_localStorage("end_info");
	remove_localStorage("order_info");
	window.location.href = "physical_want.html" + '?_r=' + Math.random();
});

/*function remove_click() {
	$(".order_detail").removeAttr("onclick");
	$(".delte_order").removeAttr("data-toggle");
	$(".put_away").removeAttr("data-toggle");
	$(".down_away").removeAttr("data-toggle");
	$(".trans_order").removeAttr("data-toggle");
}

function add_click() {
	$(".order_detail").attr("onclick", "order_detail(this)");
	$(".delte_order").attr("data-toggle", "#delte_modal");
	$(".put_away").attr("data-toggle", "#put_away");
	$(".down_away").attr("data-toggle", "#dowm_away");
	$(".trans_order").attr("data-toggle", "#trans_price");
}*/