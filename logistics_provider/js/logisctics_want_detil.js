$(function(){
	getToOrderDetail()
})

function getToOrderDetail(){
	var url =re_url(methods.getToOrderDetail);
	var data={
		toOrderId:get_localStorage("order_id")
	};
	var success= function(response){
		if(response.code==RETCODE_SUCCESS){
			var datas =response.data;
			console.log(datas)
			$(".orderNo").text(datas.orderNo);
			$(".b_name").text(datas.beginContacts);
			$(".b_phone").text(datas.beginPhone);
			$(".b_address").text(datas.beginDetailAddress);
			$(".e_name").text(datas.endContacts);
			$(".e_phone").text(datas.endPhone);
			$(".e_address").text(datas.endDetailAddress);
			$(".amount").text(datas.amount+"元");
			$(".pickTime").text(timestampDay(datas.pickTime));
			$(".arriveTime").text(timestampDay(datas.arriveTime));
			if(datas.tToOilList==""){
				toast("商品详情为空！")
				return;
			}
			$(".oil_box").html("")
			$.each(datas.tToOilList,function(i,v){
				$(".oil_box").append(oil_detail(v))
			});
			$(".createTime").text(timestampToTime(datas.createTime))
		}
	};
	util.get_ajax(url,data,success)
}

function oil_detail(data){
	var oil_item="";
	oil_item+='<div class="col-3 pl-0">';
	oil_item+='<p>'+data.commodity+"#"+'</p>';
	oil_item+='<p>'+data.count+"吨"+'</p>';
	oil_item+='</div>';
	return oil_item
}
