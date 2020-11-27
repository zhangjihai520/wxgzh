$(function(){
	getBuyerVipSystem();
})
function getBuyerVipSystem(){
	var url =re_url(methods.getCompanyVipSystem);
	var data={};
	var success =function(response){
		if(response.code==RETCODE_SUCCESS){
			var datas= response.data;
			console.log(datas);
			$(".now_level").text("LV"+datas.level);
			$(".rule_box").html("");
			$(".level_inte").text(datas.cumIncome+"积分"); 
			$.each(datas.levels,function(i,v){
				if(v.level==datas.level){
					
					var pro_w =((Number(v.reqScore)/Number(v.nextLevelBeginScore))*100)
					$(".progress").eq(i).css("width",pro_w+"%");
					
				};
				if(datas.level=="2"){
					$(".vip_status").eq(1).attr("src","../img/vip_2.png")
				}else if(datas.level=="3"){
					$(".vip_status").eq(2).attr("src","../img/vip_3.png")
				};			
				$(".rule_box").append(rule_item(v))
			});
			$(".next_leve").text(datas.nextLevelScore+"积分");
		}
	}
	util.get_ajax(url,data,success)
}


function rule_item(data){
	var rule_item ="";
		rule_item+='<div class="form-row">';
		rule_item+='<p class="col-4 py-2 border-right text-center font_4 text-danger item font_weight borders">'+"Lv"+data.level+'</p>';
		if(data.reqScore==data.nextLevelBeginScore){
			rule_item+='<p class="col-8 py-2 text-center font_5 text-body font_weight item">'+data.reqScore+'-'+'MAX'+"积分"+'</p>';
		}else{
			rule_item+='<p class="col-8 py-2 text-center font_5 text-body font_weight item">'+data.reqScore+'-'+data.nextLevelBeginScore+"积分"+'</p>';
		}
		rule_item+='</div>';
		
		return rule_item
}

