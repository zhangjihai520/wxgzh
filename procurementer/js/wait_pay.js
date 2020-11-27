$(function() {
	confirmOrder();
})

function confirmOrder() {
	var url = re_url(methods.confirmOrder);
	var data = {
		boOrderId: get_localStorage("boOrderId")
	}
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			console.log(datas)
			$(".order_box").append(order_html(datas));
			$.each(datas.oilList, function(i, v) {
				$(".goods_info").append(shop_detail(v));
			});
			$(".trans_price").val(datas.cstTransPrice)
			$(".is_show").click(function() {
				cancelToOrder(datas.boOrderId)
			});
			$(".order_sure").click(function() {
				paymented(datas.boOrderId);
			});
			$(".trans_btn").click(function(){
				applyPriceChange(datas.boOrderId);
			});
			if(datas["status"]=="BOS_CONFIRMED"){
				$(".header-title").text("确认中");
				$(".order_sure").text("确认");
				$(".pay_info").hide();
			}else{
				$(".header-title").text("待付款");
				$(".order_sure").text("已付款");
				$(".pay_info").show();
			}
		}

	};
	util.get_ajax(url, data, success)
}

function trans_type(data) { //物流方式
	var trans_type = "";
	if(data.transType == "0") {
		trans_type = "物流配送 " + data.transPrice + "元";
	} else if(data.transType == "1") {
		trans_type = "上门自提";
	};
	return trans_type;
}

function shop_detail(data) { //商品明细
	var shop_detail = "";
	shop_detail += '<div class="form-row">';
	shop_detail += '<span class="oil_name pr-1">' + data.no + '#' + '</span>';
	shop_detail += '<span class="oil_name pr-1">' + data.count + "吨" + '</span>';
	shop_detail += '<span class="oil_price pr-1">' + '金额：' + (Number(data.count) * Number(data.oilPrice)).toFixed(2) + '元' + '</span>';
	shop_detail += '</div>';
	return shop_detail;
}

function cancelToOrder(order_id) { //取消订单
	var url = re_url(methods.cancelOrder);
	var data = {
		boOrderId: order_id
	};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			alert("取消成功");
			window.location.href = 'all_orders.html?_r=' + Math.random();
		};
	}
	util.get_ajax(url, data, success)
}

function paymented(order_id) { //确认支付
	var url = re_url(methods.paymented);
	var data = {
		boOrderId: order_id
	};
	console.log(data)
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			save_localStorage("comfirm_order", "1");
			window.location.href = 'all_orders.html?_r=' + Math.random();
		};
	}
	util.get_ajax(url, data, success)
};

function order_html(data) {
	var order_item = "";
	var totalPrice =data.totalPrice;
	var payAmount =data.payAmount;
	var sub_money =(operation.numSubtract(totalPrice,payAmount))
	
	order_item += '<div class="col-12">';
	order_item += '<div class="form-row font_2 pt-2">';
	order_item += '<p class="col-8 font_weight">' + '订单信息' + '</p>';
	order_item += '</div>';

	order_item += '<div class="form-row font_1 mt-2 pt-2">';
	order_item += '<span class="item_name  pr-0">' + '订单号：' + '</span>';
	order_item += '<span class="order_no  pl-0">' + data.orderNo + '</span>';
	order_item += '</div>';

	order_item += '<div class="form-row font_1 mt-2">';
	order_item += '<div class="col-12">';
	order_item += '<div class="form-row">';
	order_item += '<p class="item_name col-3 pr-0">' + '商品明细：' + '</p>';
	order_item += '<div class="goods_info col-9 pl-0">';

	order_item += '</div>';
	order_item += '</div>';

	order_item += '<div class="form-row  font_1 mt-2">';
	order_item += '<span class="item_name  pr-0">' + '配送方式：' + '</span>';
	order_item += '<span class=" pl-0 trans_type">' + trans_type(data) + '</span>';
	order_item += '</div>';

	order_item += '<div class="form-row  font_1 mt-2">';
	order_item += '<span class="item_name  pr-0">' + '返现钱包余额扣除：' + '</span>';
	order_item += '<span class=" pl-0 trans_type">' + (operation.numSubtract(sub_money,data.suDeductAmount)) + "元" + '</span>';
	order_item += '</div>';

	order_item += '<div class="form-row  font_1 mt-2">';
	order_item += '<span class="item_name  pr-0">' + '油库地址：' + '</span>';
	order_item += '<span class=" pl-0 oil_site">' + data.oilStoreDetailAddr + '</span>';
	order_item += '</div>';
	if(data.transType == 1) {
		order_item += "";
	} else {
		order_item += '<div class="form-row  font_1 mt-2">';
		order_item += '<span class="item_name  pr-0">' + '配送地址：' + '</span>';
		order_item += '<span class=" pl-0 arrive_site">' + data.tBuAddress.addressName + '</span>';
		order_item += '</div>';
	}

	order_item += '<div class="form-row  font_1 mt-2">';
	order_item += '<span class="item_name  pr-0">' + '下单时间：' + '</span>';
	order_item += '<span class=" pl-0 creat_time">' + timestampToTime(data.createTime) + '</span>';
	order_item += '</div>';
	order_item += '<div class="form-row  font_1 mt-2">';
	order_item += '<span class="item_name  pr-0">' + '预计开始时间：' + '</span>';
	order_item += '<span class=" pl-0 arrive_time">' + timestampDay(data.reqBeginTime) + '</span>';
	order_item += '</div>';
	order_item += '<div class="form-row  font_1 mt-2">';
	order_item += '<span class="item_name  pr-0">' + '预计到达时间：' + '</span>';
	order_item += '<span class=" pl-0 arrive_time">' + timestampDay(data.reqEndTime) + '</span>';
	order_item += '</div>';

	order_item += '<div class="form-row  font_1 mt-2">';
	order_item += '<span class="item_name">' + '总金额：' + '</span>';
	order_item += '<span class=" pl-0 font_weight font_2 total_money">' + data.totalPrice + "元" + '</span>';
	order_item += '</div>';
	
	order_item += '<div class="form-row  font_1 py-2">';
	order_item += '<span class="item_name">' + '实付金额：' + '</span>';
	order_item += '<span class=" pl-0 font_weight font_2 total_money">' + data.payAmount+ "元" + '</span>';
	order_item += '</div>';
	
	order_item += '<div class="form-row py-2 font_1 border-bottom ">';
	order_item += '<p class="col-7">';
	if(data.transType == "0" ||data.paymentType=="0") {
		order_item += '<span class="tall_phone py-1 px-2 font_5 fa fa-headphones" data-toggle="modal" data-target="#tall_phone"  id="' + data.boOrderId + '"></span>';
//		order_item += '<span class="change_price p-1 ml-1" data-toggle="modal"  data-toggle="modal" data-target="#change_price" id="' + data.boOrderId + '">' + '申请改价' + '</span>';
	}
	order_item += '<span class="delete_btn p-1 ml-1" data-toggle="modal" data-target="#cancel_model" id="' + data.boOrderId + '">' + '取消订单' + '</span>';
	order_item += '</p>';
	order_item += '<p class="col-5 text-right text-danger">' + '请在24小时内付款成功' + '</p>';
	order_item += '</div>';
	
	order_item +='<div class="pay_info" style="display:none">';
	
	order_item += '<div class="form-row font_2 pt-1 mt-2">';
	order_item += '<p class="col-8 font_weight">' + '付款信息' + '</p>';
	order_item += '</div>';

	order_item += '<div class="form-row  font_1 mt-3">';
	order_item += '<span class="item_name pr-0">' + '开户名：' + '</span>';
	order_item += '<span class="  pl-0 buy_name">' + data.ueBankAccountName + '</span>';
	order_item += '</div>';

	order_item += '<div class="form-row  font_1 mt-2">';
	order_item += '<span class="item_name  pr-0">' + '开户行：' + '</span>';
	order_item += '<span class=" pl-0 buy_bank">' + data.ueBankType + '</span>';
	order_item += '</div>';

	order_item += '<div class="form-row  font_1 mt-2">';
	order_item += '<span class="item_name pr-0">' + '账号：' + '</span>';
	order_item += '<span class="pl-0 bank_no">' + data.ueBankAccount + '</span>';
	order_item += '</div>';

	order_item += '<div class="form-row  font_1 mt-2">';
	order_item += '<span class="item_name  pr-0">' + '识别码：' + '</span>';
	order_item += '<span class=" pl-0 buy_uscc">' + data.payCode + '</span>';
	order_item += '<p class="col-12 font_0 orange mt-1">' + '(识别码为审核项，请务必填入备注栏)' + '</p>';
	order_item += '</div>';

	order_item += '<div class="form-row  font_1 py-2">';
	order_item += '<span class="item_name  pr-0">' + '实付金额：' + '</span>';
	order_item += '<span class="  pl-0 font_weight font_2 total_money">' + Number(data.payAmount) + "元" + '</span>';
	order_item += '</div>';
	
	order_item += '</div>';
	
	order_item += '<div class="form-row py-2">';
	if(data.transPrice ==data.cstTransPrice){
		order_item += '<button type="button" class="btn  btn-sm wite col-10 offset-1 line_orange click_btn order_sure" id="' + data.boOrderId + '">' + '确认' + '</button>';
	}
	
	order_item += '</div>';
	
	order_item += '</div>';
	return order_item;
}

function applyPriceChange(borderId) {//申请改价
	let TransPrice = $(".trans_price").val();
	console.log(TransPrice)
	let url = re_url(methods.applyPriceChange);
	var data = {
		"boOrderId": borderId,
		"cstTransPrice": TransPrice
	}
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			go_page("trans_price_comfirm.html");
		}
	};
	util.post_ajax(url, data, success)
}

function re_turn(obj){//返现红包扣除
	var toltal_Price =obj.totalPrice;
	var pay_amount =obj.payAmount;
	var return_price =Number(toltal_Price)-Number(pay_amount);
	return_price =Math.floor(return_price*100)/100
	if(return_price<0){
		return 0
	}else{
		return return_price
	}
}

