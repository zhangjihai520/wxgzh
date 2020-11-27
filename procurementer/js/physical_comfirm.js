function get_orderInfo(){
	var order_info =JSON.parse(get_localStorage("order_info"));
	if(order_info==null){
		return;
	}
	var tToOilList =order_info.tToOilList;
	
	$.each(tToOilList, function(i,v) {
		$(".oil_list").append(oil_list(v))
	});
	save_localStorage("trans_money",order_info.amount);
	$(".trans_pay").text(get_localStorage("trans_money")+"元");
	$(".b_site").text(order_info.b_site_detail);
	$(".e_site").text(order_info.e_site_detail);
	$(".arrive_time").val(timestampDay(order_info.arriveTime));
	$(".trans_money").text(get_localStorage("trans_money"));
	$(".trans_price").val(get_localStorage("trans_money"));
}
get_orderInfo();
function want_data(){
	var want_data={};
	var order_info =JSON.parse(get_localStorage("order_info"));
	want_data["beginDistrictId"] =order_info.beginDistrictId;
	want_data["beginAddress"] =order_info.beginAddress;
	want_data["endDistrictId"] = order_info.endDistrictId;
	want_data["endAddress"] = order_info.endAddress;
	want_data["pickTime"]=order_info.pickTime;
	want_data["arriveTime"]=order_info.arriveTime;
	want_data["tToOilList"]=order_info.tToOilList;
	want_data["beginContacts"]=order_info.beginContacts;
	want_data["beginPhone"]=order_info.beginPhone;
	want_data["endContacts"]=order_info.endContacts;
	want_data["endPhone"]=order_info.endPhone;
	want_data["amount"]=get_localStorage("trans_money");
	return want_data; 
}

function oil_list(data){
	var oil_list ='';
	oil_list+='<div class="col-12 row  orange">';
	oil_list+='<p class="col-6   oil_no font_weight text-right">'+data.commodity+'</p>';
	oil_list+='<p class="col-6   oil_num font_weight text-center">'+data.count+'吨'+'</p>';
	oil_list+='</div>';
	return oil_list;
}
$(".change_btn").click(function(){
	var trans_price =$(".trans_price").val();
	save_localStorage("trans_money",trans_price);
	$(".trans_pay").text(get_localStorage("trans_money")+"元");
	$(".trans_money").text(get_localStorage("trans_money"));
	$(".trans_price").val(get_localStorage("trans_money"));
})



function addToOrder(datas){//物流需求下单
	var url =re_url(methods.addToOrder);
	var data=datas;
	if(data==undefined){
		
		return;
	}
	console.log(data)
	var success =function(response){
		if(response.code==RETCODE_SUCCESS){
			window.location.href ="physical_orders.html"+ '?_r=' + Math.random();
		}
	}
	util.post_ajax(url,data,success)
}

$(".put_order").click(function(){
	addToOrder(want_data());
})
