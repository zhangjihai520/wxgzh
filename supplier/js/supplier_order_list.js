$(function() {
//	remove_localStorage("totalCount");
	remove_localStorage("boOrderId");
	var height_1 = $(".header").height();
	$("#wrapper").css("top", height_1 + 15);
	var currentPage = 1;
	var currentSiz = 4; //每次加载4条
	pullOnLoad(currentPage, currentSiz);
	var myscroll = new iScroll("wrapper", {
		onScrollMove: function() { //拉动时
			myscroll.refresh();
			//上拉加载
			if($(".pull-loading").html()=="暂无更多数据"){
				return;
			}
			//上拉加载
			if(this.y < this.maxScrollY) {
				$(".pull-loading").html("释放加载");
				$(".pull-loading").addClass("loading");
			} else {
				$(".pull-loading").html("上拉加载");
				$(".pull-loading").removeClass("loading");
			}
		},
		onScrollEnd: function() { //拉动结束时
			if($(".pull-loading").html()=="暂无更多数据"){
				return;
			}
			//上拉加载
			if($(".pull-loading").hasClass('loading')&&$(".pull-loading").html()=="释放加载") {
				currentPage++;
				$(".pull-loading").html("加载中...");
				pullOnLoad(currentPage, currentSiz);
			}
		},
	});
})

//上拉加载函数,ajax
function pullOnLoad(currentPage, currentSiz) {
	setTimeout(function() {
		getListData(currentPage, currentSiz);
	}, 1000);
}

function getListData(page, size) {
	var url = re_url(methods.getSupplierOrderList);
	var data = {
		page: page,
		size: size
	};
	var success = function(response) {
		if(response.code == 200) {
			var obj = response["data"];
//			console.log(obj)
			dataArray = obj["list"];
			if(obj["list"].length == 0 ) {
				$(".pull-loading").html("暂无更多数据");
				
			};
			var datas =response.data.list;
			$.each(datas, function(i, v) {
				$(".pull-loading").show();
				$(".order_body").append(updataHtml(v));
			});
			$(".ok_btn").click(function() {
				var str_orderId = $(this).parents(".order_item").attr("id");
				save_localStorage("boOrderId", str_orderId)
			})
			$(".changeBtn").click(function(){
				$(".realy_price").val("");
				$(".new_price").val("");
				var orderId = $(this).attr("id");
				save_localStorage("boOrderId", orderId);
				$(".realy_price").val($(this).attr("data-price"))
			});
			$(".supOrderBtn").click(function(){
				var orderId = $(this).attr("id");
				save_localStorage("boOrderId", orderId);
				
			})
		}
	}
	util.get_ajax(url, data, success)
};

$(".true_btn").click(function() { //确认出货
	outStock()
})

function outStock() {
	var url = re_url(methods.supplierOrderOutStock);
	var data = {
		"boOrderId": get_localStorage("boOrderId"),
	};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			alert("出货成功！");
			window.location.reload();
		}
	}
	util.post_ajax(url, data, success)
}

function updataHtml(item) {
	var htmlStr = '';
	var oilPrice =item["oilPrice"];
	var suDeductAmount= item["suDeductAmount"]
	/*var oilPrice =Number(item["oilPrice"])*100;
	var suDeductAmount= Number(item["suDeductAmount"])*100*/
	var str_transType = item["transType"] == 0 ? '物流配送' : '上门自提';
	htmlStr += '<li class="col-12 order_item" id="' + item["boOrderId"] + '">';
	htmlStr += '<div class="form-row font_1 py-2 border-bottom">';
	htmlStr += '<p class="col-12"><span class=" fa fa-circle icons icon_1 pr-1"></span> 订单号:' + item["orderNo"] + '</p>';
	htmlStr += '</div>';
	htmlStr += '<div class="form-row font_1 mt-2">';
	htmlStr += '<p class="col-2 pr-0"><span class=" fa fa-circle icons icon_2 pr-1"></span>配送:</p>';
	htmlStr += '<p class="col-10 pl-0">' + str_transType + '</p>';
	htmlStr += '</div>';
	htmlStr += '<div class="form-row font_1 pl-2 ">';
	if(item.status=="BOS_FINISH"){
		htmlStr +="";
	}else{
		htmlStr += '<span class="pr-1 orange pl-1 font_1">订单状态：</span>';
		htmlStr += '<span class="orange font_1">' + status(item)+ '</p>';
	}
	htmlStr += '</div>';
	htmlStr += '<div class="form-row font_1 mt-2">';
	htmlStr += '<p class="col-3 pr-0"><span class=" fa fa-circle icons icon_3 pr-1"></span>总金额：</p>';
	htmlStr += '<p class="col-9 pl-0 all_money">' + oilPrice + '元</p>';
	htmlStr += '</div>';
	htmlStr += '<div class="form-row font_1 mt-2">';
	htmlStr += '<p class="col-3 pr-0"><span class=" fa fa-circle icons icon_3 pr-1"></span>实收金额：</p>';
	htmlStr += '<p class="col-9 pl-0 all_money">' + operation.numSubtract(oilPrice,suDeductAmount) + '元</p>';
	htmlStr += '</div>';
	htmlStr += '<div class="form-row font_2 mt-2">';
	htmlStr += '<p class="col-3 pr-0 "><span class=" fa fa-circle icon_4 icons pr-1"></span>油品明细: </p>';
	htmlStr += '<div class="col-12">';
	htmlStr += '<div class="form-row">';
	$.each(item["oilList"], function(i, item2) {
		htmlStr += '<div class="col-3">';
		htmlStr += '<div class="form-row border-right text-center mt-2">';
		htmlStr += '<p class="col-12 pt-1">' + item2["no"] + '#</p>';
		htmlStr += '<p class="col-12 py-1">' + item2["count"] + '吨</p>';
		htmlStr += '</div></div>';
	});
	htmlStr += '</div></div></div>';

	htmlStr += '<div class="form-row font_1 mt-2">';
	htmlStr += '<span class="pl-1"><span class=" fa fa-circle icons icon_5 pr-1"></span>司机信息：</span>';
	htmlStr += '<span class="pr-1">' + worker(item)+ '</span>';
	htmlStr += '<span>' + item["phoneNumber"] + '</span>';
	htmlStr += '<span class="pl-1">' + item["toolCode"] + '</span>';
	htmlStr += '</div>';
	
	htmlStr += '<div class="form-row font_1 mt-2">';
	htmlStr += '<span class="pl-1"><span class=" fa fa-circle icons icon_5 pr-1"></span>油库名称：</span>';
	htmlStr += '<span class="pr-1">' + item.tOsOilstore.name+ '</span>';
	htmlStr += '</div>';

	htmlStr += '<div class="form-row font_1 mt-2">';
	htmlStr +='<span class=" fa fa-circle icons icon_5 pr-1"></span>';
	htmlStr +='<span>';
	htmlStr +=item["transType"] == 0 ? '到货开始时间：' : '提货开始时间：';
	htmlStr +='</span>';
	htmlStr += '<sapn class=" pl-0">' + timestampDay(item["reqBeginTime"]) + '</span>';
	htmlStr += '</div>';
	htmlStr += '<div class="form-row font_1 py-1 ">';

	htmlStr +='<span class=" fa fa-circle icons icon_6 pr-1"></span>';
	htmlStr +='<span>';
	htmlStr +=item["transType"] == 0 ? '到货结束时间：' : '提货结束时间：';
	htmlStr +='</span>';
	htmlStr += '<span class="pl-0">' + timestampDay(item["reqEndTime"]) + '</span>';
	htmlStr += '</div>';
	
	
	
	htmlStr += '<div class="form-row font_1 pb-1">';
	htmlStr +='<span class=" fa fa-circle icons icon_5 pr-1"></span>';
	htmlStr +='<span class="font_1">'+'公司名称：'+'</span>';
	htmlStr +='<span class="font_1">'+item.tBuBuyer.name+'</span>';
	htmlStr +='</div>';
	htmlStr += '<div class="form-row py-2">';
	if(item["status"]=="BOS_CHERCK_PAY" && item["receiptMode"]==1){
		htmlStr += '<button class="col-3 btn  blue_bg font_3 offset-2 wite click_btn  new_btn supOrderBtn"  data-toggle="modal" data-target="#supOrderExamine" id="'+item["boOrderId"]+'" orderStatus="'+item.status+'">财务确认</button>';
	};
	if(item["status"]=="BOS_UNPAYID" ){
		htmlStr += '<button class="col-3 btn yellow_bg font_3 ml-1 wite click_btn  new_btn changeBtn" data-toggle="modal"  data-target="#change_price"  data-price="'+item["oilPrice"]+'" id="' + item["boOrderId"] + '">优惠改价</button>';
	};
	
	if(item["transType"] == 1 && item["pucodeChecked"] == 1 && item["status"] !="BOS_FINISH") {
		
		htmlStr += '<button class="col-3 btn orange_bg ml-1 font_3  wite click_btn ok_btn new_btn" data-toggle="modal"  data-target="#show_order">确定出货</button>';
	};
		
	htmlStr += '</div>'	
	htmlStr += '</li>';
	return htmlStr;
}

function timesTampToString(timeTamps) {
	var d = new Date(timeTamps); //根据时间戳生成的时间对象
	var date = d.getFullYear() + "/" + d.getMonth() + 1 + "/" + d.getDate();
	return date;
}

function status(data){
	var status ="";
	if(data.status=="BOS_PENDING_MENTION"){
		status="待自提"
	}else if(data.status=="BOS_IN_TRANSIT"){
		status="运输中"
	}else if(data.status=="BOS_TOBE_SHIPPED"){
		status="待发货"
	}else if(data.status=="BOS_CHERCK_PAY_UNPASS"){
		status="支付审核不通过"
	}else if(data.status=="BOS_CHERCK_PAY"){
		status="支付审核"
	}else if(data.status=="BOS_UNPAYID"){
		status="未完成"
	}else if(data.status=="BOS_PAYID"){
		status="已支付"
	}else if(data.status=="BOS_FINISH"){
		status="完成"
	}
	return status
}

function worker(data){
	var worker_name ="";
	if(data.workerName==""){
		worker_name="暂无"
	}else{
		worker_name=data.workerName
	}
	return worker_name
}

$(".change_btn").on("click",function(){
	var new_price =Number($(".new_price").val());
	var realy_price =Number($(".realy_price").val());
	if($(".new_price").val()=="" ||new_price==0 || new_price>realy_price){
		$(this).removeAttr("data-target");
		toast('请输入正确金额');
	}else{
		$(this).attr("data-target","#changePrice_db");
	}
})

$(".changeTrue").on("click",function(){
	var change_price =$(".new_price").val();
	supOrderOffer(change_price);
//	console.log(change_price)
})

function supOrderOffer(change_price){//改价
	var url = re_url(methods.supOrderOffer);
	var data={
		"boOrderId": get_localStorage("boOrderId"),
		"changePrice":change_price
	}

	var success =function(response){
		if(response.code == RETCODE_SUCCESS) {
			toast("改价成功！");
			window.location.reload();
		}
	}
	util.post_ajax(url,data,success)
}

function supOrderExamine(sup_orderStatus){//财务确认
	var url = re_url(methods.supOrderExamine);
	var data={
		"boOrderId": get_localStorage("boOrderId"),
		"status":sup_orderStatus
	};
	var success =function(response){
		if(response.code == RETCODE_SUCCESS) {
			toast("财务确认成功！");
			window.location.reload();
		}
	}
	util.post_ajax(url,data,success)
}

$(".supOrderExamine_ture").on("click",function(){//审核通过
	var orderStatus =$(this).attr("data-status");
	supOrderExamine(orderStatus)
})
$(".supOrderExamine_false").on("click",function(){//审核不通过
	var orderStatus =$(this).attr("data-status");
	supOrderExamine(orderStatus)
})
