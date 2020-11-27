pushHistory();
window.addEventListener("popstate", function(e) {
	window.location.href = '../login.html?_r=' + Math.random();
}, false);
var curren_size = 5;
$(function() {
	var pages = 1;
	remove_localStorage("order_id");
	remove_localStorage("pages");
	var pages = save_localStorage("pages", "1");
	var page = get_localStorage("pages");
	save_localStorage("orderStatus", "1");
	pullOnLoad(page);
	save_localStorage("isStop", "true");

	$(".order_title").on("click", function() {
		myscroll.refresh();
		var pages = save_localStorage("pages", "1");
		var page = get_localStorage("pages");
		$(".order_title").removeClass("orange");
		$(this).addClass("orange");
		$(".order_box").html("");
		$(".pull-loading").html("上拉加载");
		$(".pull-loading").removeClass("loading");
		save_localStorage("isStop", "true");
		if($(this).hasClass("tran_orders")) {
			$(".tran_sign").addClass("border-bottom");
			$(".want_sign").removeClass("border-bottom");
			save_localStorage("orderStatus", "1");
			$(".order_item").remove();
			getCarrierCanRecOrder(page);

		}
		if($(this).hasClass("want_orders")) {
			$(".order_item").remove();
			$(".want_sign").addClass("border-bottom");
			$(".tran_sign").removeClass("border-bottom");
			save_localStorage("orderStatus", "2");
			getDemandOrderList()
		}
		$('#scroller').css('transform', 'translate3d(0px, 0px, 0px)');
	})

	var myscroll = new iScroll("wrapper", {
		onScrollMove: function() { //拉动时

			//上拉加载
			if(get_localStorage("isStop") == "false") {
				return;
			}
			if(this.y < this.maxScrollY) {
				$(".pull-loading").html("释放加载");
				$(".pull-loading").addClass("loading");
				myscroll.refresh();
			} else {
				$(".pull-loading").html("上拉加载");
				$(".pull-loading").removeClass("loading");
			}
			remove_click();
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
				console.log(page)
				if(get_localStorage("orderStatus") == 1) {
					pullOnLoad(page);

				} else {
					want_load(page)
				}
				save_localStorage("pages", page);
			};
		}
	});

});
//上拉加载函数,ajax
function pullOnLoad(pages) {
	setTimeout(function() {
		getCarrierCanRecOrder(pages);
	}, 500);
}

function want_load(pages) {
	setTimeout(function() {
		getDemandOrderList(pages);
	}, 500);
}

function getCarrierCanRecOrder(pages) { //配送单
	var url = re_url(methods.getCarrierCanRecOrder);
	var data = {
		page: pages,
		size: curren_size
	}
	var success = function(response) {
		console.log(response)
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data.list;
			if(get_localStorage("pages") == 1) {
				$(".order_box").html("");
			}
			if(datas == "") {
				$(".pull-loading").html("已经到底了...");
				//				toast("已经到底了....");
				save_localStorage("isStop", "false");
				return;
			};
			$.each(datas, function(i, v) {
				$(".pull-loading").show();
				$(".order_box").append(order_item(v));
			});
			$(".get_order").click(function() {
				var order_id = $(this).attr("id");
				save_localStorage("order_id", order_id);
				carrierRecOrder();
			});
			if(get_localStorage("orderStatus") == 2) {
				$(".order_box").html("");
			}
		}
	}
	util.get_ajax(url, data, success)
}

function getDemandOrderList(pages) { //需求单
	var url = re_url(methods.getDemandOrderList);
	var data = {
		page: pages,
		size: curren_size
	};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data.list;
			console.log(datas)
			if(get_localStorage("pages") == 1) {
				$(".order_box").html("");
			}
			if(datas == "") {
				$(".pull-loading").html("已经到底了...");
				save_localStorage("isStop", "false");
				return;
			};
			$.each(datas, function(i, v) {
				$(".pull-loading").show();
				$(".order_box").append(want_item(v));
			});
			$(".sure_btn").click(function() {
				var order_id = $(this).attr("id");
				save_localStorage("order_id", order_id);

			});
			if(get_localStorage("orderStatus") == 1) {
				$(".order_box").html("");
			}
		};

	};
	util.get_ajax(url, data, success)
}

function order_detail(obj) { //需求
	var order_id = $(obj).attr("id");
	save_localStorage("order_id", order_id);
	go_page('logisctics_want_detil.html');
}

function pei_detail(obj) {
	var order_id = $(obj).attr("id");
	save_localStorage("order_id", order_id);
	save_localStorage("get_orderStatus", "false");
	remove_localStorage("transportId");
	go_page('logistics_order_detail.html');
}

function order_item(data) { //配送单
	var order_item = "";
	order_item += ' <li class="col-12 order_item px-1 mt-2">';
	order_item += '<div class="form-row font_2 mt-2">';
	order_item += '<p class="col-12">';
	order_item += '<span class=" fa fa-circle icons icon_1 pr-1">' + '</span>';
	order_item += '<span class="text-muted">' + "订单号:" + '</span>';
	order_item += '<span class="pl-1">' + data.orderNo + '</span>';
	order_item += '</p>';
	order_item += '</div>';
	order_item += '<div class="form-row font_2 mt-2">';
	order_item += '<p class="col-12">';
	order_item += '<span class=" fa fa-circle icons icon_2 pr-1">' + '</span>';
	order_item += '<span class="text-muted">' + "要求送达时间:" + '</span>';
	order_item += '<span class="pl-1">' + timestampDay(data.reqEndTime) + '</span>';
	order_item += '</p>';
	order_item += '</div>';
	order_item += '<div class="form-row font_2 mt-1 ">';
	order_item += '<p class="col-12 pl-0">';
	order_item += '<span class=" iconfont iconqidian font_6 icon_3 pr-1 ">' + '</span>';
	order_item += '<span class=" pl-0 adress_site">' + data.tOsOilstore.detailsAddress + '</span>';
	order_item += '</p>';
	order_item += '</div>';
	order_item += '<div class="form-row font_2 mt-1">';
	order_item += '<p class="col-12 pl-0">';
	order_item += '<span class=" iconfont iconzhongdian font_6 icon_4 pr-1">' + '</span>';
	order_item += '<span class="pl-0 adress_site">' + data.tBuAddress.addressName + '</span>';
	order_item += '</p>';
	order_item += '</div>';
	order_item += '<div class="form-row font_2 py-2 border-bottom">';
	order_item += '<p class="col-12 ">';
	order_item += '<span class="fa fa-circle icons icon_5 pr-1">' + '</span>';
	order_item += '<span class="text-muted">' + "物流费：" + '</span>';
	order_item += '<span class=" pl-0 tran_money font_4 trans_price">' + data.carrierPrice + '元' + '</span>';
	order_item += '</p>';
	order_item += '</div>';
	order_item += '<div class="form-row font_2 py-2">';
	order_item += '<button class="btn orange border rounded-pill col-4 btn-sm offset-1 pei_detail" id="' + data.boOrderId + '"  onclick="pei_detail(this)" >' + '详情' + '</button>';
	order_item += '<button class="btn line_orange wite click_btn rounded-pill col-4 btn-sm offset-2 get_order"  data-toggle="modal" data-target="#rob_orders" id="' + data.boOrderId + '">' + '抢单' + '</button>';
	order_item += '</div></li>';
	return order_item;
}

function want_item(data) { //需求单
	var want_item = "";
	want_item += ' <li class="col-12 order_item px-1 mt-2">';
	want_item += '<div class="form-row font_2 mt-2">';
	want_item += '<p class="col-12">';
	want_item += '<span class=" fa fa-circle icons icon_1 pr-1">' + '</span>';
	want_item += '<span class="text-muted">' + "订单号:" + '</span>';
	want_item += '<span class="pl-1">' + data.orderNo + '</span>';
	want_item += '</p>';
	want_item += '</div>';
	want_item += '<div class="form-row font_2 mt-2">';
	want_item += '<p class="col-12">';
	want_item += '<span class=" fa fa-circle icons icon_2 pr-1">' + '</span>';
	want_item += '<span class="text-muted">' + "要求送达时间:" + '</span>';
	want_item += '<span class="pl-1">' + timestampDay(data.pickTime) + '</span>';
	want_item += '</p>';
	want_item += '</div>';
	want_item += '<div class="form-row font_2 mt-1 ">';
	want_item += '<p class="col-12 pl-0">';
	want_item += '<span class=" iconfont iconqidian font_6 icon_3 pr-1 ">' + '</span>';
	want_item += '<span class=" pl-0 adress_site">' + data.beginDetailAddress + '</span>';
	want_item += '</p>';
	want_item += '</div>';
	want_item += '<div class="form-row font_2 mt-1">';
	want_item += '<p class="col-12 pl-0">';
	want_item += '<span class=" iconfont iconzhongdian font_6 icon_4 pr-1">' + '</span>';
	want_item += '<span class="pl-0 adress_site">' + data.endDetailAddress + '</span>';
	want_item += '</p>';
	want_item += '</div>';
	want_item += '<div class="form-row font_2 py-2 border-bottom">';
	want_item += '<p class="col-12 ">';
	want_item += '<span class="fa fa-circle icons icon_5 pr-1">' + '</span>';
	want_item += '<span class="text-muted">' + "物流费：" + '</span>';
	want_item += '<span class=" pl-0 tran_money font_4 trans_price">' + data.amount + '元' + '</span>';
	want_item += '</p>';
	want_item += '</div>';
	want_item += '<div class="form-row font_2 py-2">';
	want_item += '<button class="btn orange border rounded-pill col-4 btn-sm offset-1 want_detail" id="' + data.toOrderId + '" onclick ="order_detail(this)" >' + '详情' + '</button>';
	if(data.isFavorite == 0) {
		want_item += '<button class="btn line_orange wite click_btn rounded-pill col-4 btn-sm offset-2 sure_btn"  data-toggle="modal" data-target="#take_orders" id="' + data.toOrderId + '">' + '确认' + '</button>';
	}
	want_item += '</div></li>';
	return want_item
}

function carrierRecOrder() {//物流接单
	var url = re_url(methods.carrierRecOrder);
	var data = {
		boOrderId: get_localStorage("order_id"),
		carrierPrice: parseFloat($(".trans_price").text())
	};
	var success = function(response) {
		console.log(response)
		if(response.code == RETCODE_SUCCESS) {
			$(".img-circle").attr("src", "../img/aprove_04.png");
			$(".false_btn").text("去配置");
			$(".false_btn").click(function() {
				go_page("logistics_physical_orders.html")
			});
			save_localStorage("get_orderStatus", "true");
			//			remove_localStorage("order_id");
		} else {
			$(".img-circle").attr("src", "../img/aprove_02.png");
			$(".false_btn").text("取消");
		}
	};
	util.get_ajax(url, data, success)
}


$(".true_btn").on('click',function(){
	window.location.reload();
})

function addFavorites() {
	var url = re_url(methods.addFavorites);
	var data = {
		"toOrderId": get_localStorage("order_id")
	};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			toast("保留成功");
			remove_localStorage("order_id");
			$(".order_box").html("");
			var pages = save_localStorage("pages", "1");
			var page = get_localStorage("pages");
			want_load(page);
			$('#scroller').css('transform', 'translate3d(0px, 0px, 0px)');
		}
	};
	util.post_ajax(url, data, success)
}

$(".save_btn").on("click", function() {
	if(get_localStorage("order_id") == null) {
		return;
	} else {
		addFavorites();
	}

})

function remove_click(){
	if(get_localStorage("orderStatus")==1){
		$(".pei_detail").removeAttr("onclick");
		$(".get_order").removeAttr("data-target")
	}else{
		$(".want_detail").removeAttr("onclick");
		$(".sure_btn").removeAttr("data-target")
	}
}

function add_click(){
	if(get_localStorage("orderStatus")==1){
		$(".pei_detail").attr("onclick","pei_detail(this)");
		$(".get_order").attr("data-target","#rob_orders")
	}else{
		$(".want_detail").attr("onclick","order_detail(this)");
		$(".sure_btn").attr("data-target","#take_orders")
	}
}
