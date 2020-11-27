function getToOrderDetail(){
	var url =re_url(methods.getToOrderDetail);
	var data={
		toOrderId:get_localStorage("order_id")
	}
	var success=function(response){
		console.log(response.code)
		if(response.code==RETCODE_SUCCESS){
			 console.log(response.data);
			var datas =response.data;
			$(".order_status").text(order_status(datas));
			$(".order_no").text(datas.orderNo);
			$(".b_name").text(datas.beginContacts);
			$(".b_phoe").text(datas.beginPhone);
			$(".b_site").text(datas.beginDetailAddress);
			$(".e_name").text(datas.endContacts);
			$(".e_phoe").text(datas.endPhone);
			$(".e_site").text(datas.endDetailAddress);
			$(".trans_pay").text(datas.amount+"元");
			$(".b_time").text(timestampDay(datas.pickTime));
			$(".e_time").text(timestampDay(datas.arriveTime));
			$.each(datas.tToOilList,function(i,v){
				$(".goods_box").append(goods_item(v))
			});
			$(".creat_time").text(timestampDay(datas.createTime))
		}else{toast(response.message)}
	};
	util.get_ajax(url,data,success);
}
getToOrderDetail();
function order_status(data) {//订单状态
	var status = "";
	if(data.status == "1") {
		return status = "未接单"
	} else if(data.status == "0") {
		return status = "已取消"
	} else if(data.status == "2") {
		return status = "已接单"
	}
}
function goods_item(data){
	var goods_item="";
	goods_item+='<div class="col-3">';
	goods_item+='<p>'+data.commodity+"#"+'</p>';
	goods_item+='<p>'+data.count+'吨'+'</p>';
	goods_item+='</div>';
	return goods_item;
}
