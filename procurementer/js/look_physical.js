function getOrderTranInfo(){
	var url =re_url(methods.getOrderTranInfo);
	var data={
		orderId:get_localStorage("boOrderId")
	};
	var success =function(response){
		if(response.code==RETCODE_SUCCESS){
			var datas =response.data;
			var tal_account=0;
			console.log(response);
			if(datas.status=="IN_TRAN"){
				$(".title").text("运输中");
				$(".track_shipflow_item_msg_text").text("运输中");
			}else if(datas.status=="SIGNED" &&datas.orderStatus=="BOS_IN_TRANSIT"){
				$(".title").text("运输中");
				$(".track_shipflow_item_msg_text").text("运输中");
				$(".btn_box").show();
			}else{
				$(".title").text("已签收");
				$(".track_shipflow_item_msg_text").text("已签收");
			}
			$(".track_shipflow_item_msg_time").text(timestampToTime(datas.outTime))
			$(".order_no").text(datas.orderNo);
			$(".money").text(datas.totalPrice+"元");
			$(".payMoney").text(datas.payAmount+"元");
			$(".arrive_time").text(timestampDay(datas.reqEndTime));
			$.each(datas.oilList,function(i,v){
				$(".oil_list").append(oil_list(v));
				tal_account+=Number(v.count);
			});
			$(".num").text(tal_account+"吨");
			$(".trans_name").text(datas.name);
			$(".trans_phone").text(datas.phoneNumber);
		}
	}
	util.get_ajax(url,data,success)
}
getOrderTranInfo();

function oil_list(data){
	var oil_list= "";
	oil_list+='<span class="pr-1">'+data.no+'#'+'</span>';
	return oil_list
}
function confirmReceipt(){
	var url =re_url(methods.confirmReceipt);
	var data ={
		boOrderId:get_localStorage("boOrderId")
	};
	var success =function(response){
		console.log(response)
		if(response.code==RETCODE_SUCCESS){
			alert("签收成功");
			page_back();
			sessionStorage.setItem('refresh', 'true');
		}
	};
	util.get_ajax(url,data,success)
}
$(".click_btn").click(function(){
	confirmReceipt()
})
