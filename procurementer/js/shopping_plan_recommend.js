var dataArray = [];
var payType = 1;
getPlanRecommend();
$(document).on("click", ".laydate-icon", function() {
	var str_id = $(this).attr("id");
	$(this).parent().next().find(".lay_end").val("");
	laydate.render({
		elem: '#' + str_id,
		showBottom: false,
		trigger: 'click',
		theme: 'molv',
		min: +2,
		max:'2090-10-1',
		show:true
	});
})

$(document).on("click",".lay_end",function(){
	var str_id = $(this).attr("id");
	var dates= $(this).parent().prev().find(".laydate-icon").val();
	if(dates==""){
		toast("请先选择开始时间")
		return;
	}
	var min_day =getDay(dates,0);
	var max_day=getDay(dates,2);
	laydate.render({
		elem: '#' + str_id,
		showBottom: false,
		trigger: 'click',
		theme: 'molv',
		min: min_day,
		max:max_day,
		show:true
	});
	console.log(dates)
})


function getPlanRecommend() {
	var selectId = localStorage.getItem("selectPlanId");
	var url = re_url(methods.buyOilRecommend);
	var data = {
		bpPlanId: selectId
	};
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			$(".box_ull").hide();
			var obj = response["data"];
			console.log(obj)
			if(!isEmptyObject(obj)) {
				var str_transType = obj["transType"] == 1 ? '上门自提' : '物流配送';
				
				$(".physical_type").val(str_transType);
				var listArr = [];
				listArr = obj["orderList"];
				console.log(listArr)
				if(listArr.length > 0) {
					dataArray = listArr;
					$(".recommend_box").html(upDataHtml(listArr));
				}
			} else {
				toast("没有推荐计划");
				$(".container").hide();
				$(".box_ull").show();
			}
		}
	}
	util.get_ajax(url, data, success);
}

function isEmptyObject(obj) {
	for(var key in obj) {
		return false;
	}
	return true;
}

function upDataHtml(list) {
	if(list.length > 0) {
		var htmlStr = '';
		$.each(list, function(index, item) {
			htmlStr += '<div class="row m-0 shadow-sm bg-white wite_bg mt-2 recommend_item pb-2">';
			htmlStr += '<div class="col-12 row p-0 m-0">';
			htmlStr += '<div class="row col-12">';
			htmlStr += '<p class="col-2 tag text-center">' + (index + 1) + '</p>';
			htmlStr += '</div>';
			if(item["transType"]==0){
				htmlStr += '<div class="col-12 row color-6 font_2 mt-2">';
				htmlStr += '<span class=" px-1 py-1 fa fa-map-marker"></span>'
				htmlStr += '<span class="col-3 px-0 font_2 font_color">收货地址：</span>';
				htmlStr += '<span class="col-8 px-0 rec_name black" id="' + item["buAddressId"] + '">' + item["buyDetailAddress"] + '</span>';
				htmlStr += '</div>';
			};
			
			htmlStr += '<div class="col-12 mt-2 py-1 font_1 px-0">';
			htmlStr += '<span class="fa fa-circle px-1 "></span>';
			htmlStr += '<span class="color-6 font_color">油品详情</span>';
			htmlStr += '</div>';
			htmlStr += '<div class="col-12 row m-0 p-0 mt-2 py-1">';
			var arr = item["buyOilList"];
			$.each(arr, function(index, obj) {
				htmlStr += '<div class="col-3 goods_item text-center border-right">';
				htmlStr += '<p class="goods_name font_4 font_weight orange">' + obj["no"] + '#' + '</p>';
				htmlStr += '<p class="goods_no font_1 mt-1"><span class="g_no">' + Number(obj["count"]) + '</span>吨</p>';
				htmlStr += '</div>';
			});
			htmlStr += '</div>';
			htmlStr += '<div class="col-12 row color-6 font_2 mt-3">';
			htmlStr += '<span class=" px-1 py-1 fa fa-map-marker"></span>';
			htmlStr += '<span class="col-3 px-0 font_color">油库地址：</span>';
			htmlStr += '<span class="col-8 px-0 site_name black">' + item["storeDetailsAddress"] + '</span>';
			htmlStr += '</div>';
			htmlStr += '<div class="col-12 mt-2 py-1 font_1 px-0">';
			htmlStr += '<span class="fa fa-circle px-1 "></span>';
			htmlStr += '<span class="color-6 font_color">总费用：</span>';
			htmlStr += '<span class="total_money font_5">' + item["totalPrice"] + '元</span>';
			if(item["transType"]==0){
				htmlStr += '<span class="detail_money font_2 font_color">(商品：<span class="goods font_1">' + item["oilPrice"] + '元</span>+物流<span class="physical font_1">' + item["transPrice"] + '元</span>)</span>';
			}else{
				htmlStr +="";
			}
			
			htmlStr += '</div>';
			htmlStr += '<div class="col-12 row mt-2 choose_time px-0 m-0">';
			htmlStr += '<span class=" font_1 pr-0 pl-1" style="line-height: 1.6rem;">';
			if(item["transType"]==0){
				htmlStr += "到货开始时间：";
			}else{
				htmlStr += "提货开始时间：";
			}
			htmlStr +='</span>';
			htmlStr += '<input readonly class="col-6 drop_time laydate-icon font_1 form-control pl-0" type="text" id="layDate_item' + index + '" placeholder="请选择时间">';
			htmlStr += '<span class=" fa fa-calendar time_icon"></span>';
			htmlStr += '</div>';
			htmlStr += '<div class="col-12 row mt-2 choose_time px-0 m-0">';
			htmlStr += '<span class=" font_1 pr-0 pl-1" style="line-height: 1.6rem;">';
			if(item["transType"]==0){
				htmlStr += "到货结束时间：";
			}else{
				htmlStr += "提货结束时间：";
			}
			htmlStr +='</span>';
			htmlStr += '<input readonly class="col-6 drop_time lay_end form-control font_1 pl-0" id="lay_endTime' + index + '" type="text" placeholder="请选择时间">';
			htmlStr += '<span class=" fa fa-calendar time_icon"></span>';
			htmlStr += '</div>';
			htmlStr +='</div></div>';
		});
		return htmlStr;
	}
}
//下单
$(".click_btn").click(function() {
	var layDate_list = $(".recommend_box").find(".laydate-icon");
	$.each(layDate_list, function(index, obj) {
		if(strIsNULL($(this).val())) {
			toast('请选择正确时间');
			return false;
		}
		if(index == layDate_list.length - 1) {
			//下单
			creatOrder();
		}
	})
})

function creatOrder() {
	// [{
	//  boOilList:[
	// 	 {oiOilId：买的油号id，
	// 	 oilPrice：油单价，
	// 	 count：购买数量
	// 	 },
	//    ],
	//    toltalOilPrice：油总价，
	// reqEndTime：提货结束时间，
	// transPrice：物流价格，
	// buAddressId：收货地址id，
	// transType：物流方式（0：送货 1：自提），
	// osOilstoreId：油库id，
	// totalCount：总吨数，
	// paymentType：结算方式（0：线下汇款 1：货到付款）
	// },
	// ]
	var root = $(".recommend_box");
	var dataList = [];
	$.each(root.find(".recommend_item"), function(index, obj) {
		var item_this = $(this);
		var dic = dataArray[index];
		var str_toltalOilPrice = dic["totalPrice"];
		var str_reqDeginTime = Date.parse(new Date(item_this.find(".laydate-icon").val()));
		var str_reqEndTime = Date.parse(new Date(item_this.find(".lay_end").val()));
		var str_buAddressId = dic["buAddressId"];
		var str_transPrice = dic["transPrice"];
		var num_transType = dic["transType"];
		var str_osOilstoreId = dic["osOilstoreId"];
		//var str_totalCount = dic[""]
		var tampArr = dic["buyOilList"];
		var itemDic = {
			boOilList: tampArr,
			toltalOilPrice: str_toltalOilPrice,
			reqDeginTime:str_reqDeginTime,
			reqEndTime: str_reqEndTime,
			transPrice: str_transPrice,
			buAddressId: str_buAddressId,
			transType: num_transType,
			osOilstoreId: str_osOilstoreId,
			paymentType: payType
		}
		dataList.push(itemDic);
	})
	console.log(dataList)
	var url = re_url(methods.recomPalceOrder);

	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var tampArr = [];
			$.each(response.data, function(index, item) {
				tampArr.push(item["boOrderId"])
			});
			console.log(tampArr);
			//			save_localStorage("boOrderId",tampArr);
			save_localStorage("order_type", "1");
			window.location.href = 'all_orders.html?_r=' + Math.random();
		} else {
			toast(response.message)
		}
		console.log(response)
		//	 	
	}
	util.post_ajax(url, dataList, success);
}
//page_change(".click_btn","comfirm_orders.html")

$(".physical_icon").click(function() {
	$(".physical_icon").removeClass("check_active");
	$(this).addClass("check_active");
	var physical_type = $(this).parent().siblings().find(".physical_style").text();
	$(".physical_type").val(physical_type);
	$("#physcial_type").collapse('toggle');

})
$(".pay_icon").click(function() {
	$(".pay_icon").removeClass("check_active");
	$(this).addClass("check_active");
	var physical_type = $(this).parent().siblings().find(".pay_style").text();
	$(".pay_type").val(physical_type);
	$("#pay_type").collapse('toggle');
	if($(this).attr("id") == 'payType_remittance') {
		payType = 0;
	} else if($(this).attr("id") == 'payType_arrive') {
		payType = 1;
	}
})

$(".physical_box").click(function() {
	$("#pay_type").collapse('hide');
})
$(".pay_box").click(function() {
	$("#physcial_type").collapse('hide');
})