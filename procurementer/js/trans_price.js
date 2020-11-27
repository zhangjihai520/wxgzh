$(function(){
	 trans_price()
})

function trans_price(){
	var url =api + "t/os/oilstore/getOilSupermarketDetail";
	var data={
		oiOilId:get_localStorage("oiOilId"),
		osOilstoreId:get_localStorage("osOilstoreId"),
		buAddressId:get_localStorage("buAddressId")
	}
	var success =function(response){
		if(response.code==RETCODE_SUCCESS){
			var datas =response.data
			console.log(datas);
			$(".begin").text(datas.tranStartPrice+"元");
			$(".price_box").html("");
			$.each(datas.transPriceVOs,function(i,v){
				$(".price_box").append(price_list(v))
			})
		}
	}
	util.get_ajax(url,data,success)
}

function price_list(data){
	let price_list ="";
	price_list+='<p class="font_2 col-10 offset-1 text-danger mt-3">';
	price_list+='<span>'+data.distance+"公里以下："+'</span>';
	price_list+='<span>'+data.distancePrice+"元/公里"+'</span>';
	price_list+='</p>';
	return price_list;
	
}
