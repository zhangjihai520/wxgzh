$(function(){
	pick_info();
	page_change(".click_btn","check_goods.html")
})

function pick_info(){
	var url =re_url(methods.checkOrderDetailInfo);
	var data ={
		boOrderId:get_localStorage("boOrderId")
	};
	var success =function(response){
		console.log(response)
		if(response.code==RETCODE_SUCCESS){
			var datas =response.data;
			$(".order_no").text(datas.orderNo)
			$(".oil_info").html("")
			$.each(datas.oilList,function(i,v){
				$(".oil_info").append(oil_detil(v))
			})
			$(".name").text(datas.tBuBuyer.name);
			$(".pick_time").text(timestampToTime(datas.updateTime));
			$(".suplier_name").text(datas.tSuSupplier.name);
			$(".oil_boxName").text(datas.tOsOilstore.name);
		}
	};
	util.get_ajax(url,data,success)
}

function oil_detil(data){
	var oil_info="";
	oil_info+='<p class="col-12">';
	oil_info+='<span class="pr-1">'+data.no+"#"+'</span>';
	oil_info+='<span>'+data.count+"吨"+'</span>';
	oil_info+='</div>';
	return oil_info
}
