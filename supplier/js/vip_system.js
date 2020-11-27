$(function(){
	getBuyerVipSystem();
})
function getBuyerVipSystem(){
	var url =re_url(methods.getSupplierVipSystem);
	var data={};
	var success =function(response){
		if(response.code==RETCODE_SUCCESS){
			var datas= response.data;
			console.log(datas);
			$(".levelNum").text("LV"+datas.level);
			$(".user_balance").text(datas.levelCount+"单"); 
			var types =datas.tMsLevelCfgList[1].reqCycle;
			console.log(types)
			switch(types){
				case 1:
					$(".rule_type").text("天");
					break;
				case 2:
					$(".rule_type").text("周");
					break;
				case 3:
					$(".rule_type").text("月");
					break;
				case 4:
					$(".rule_type").text("年");
					break;
			}
			
			$.each(datas.tMsLevelCfgList,function(i,v){
				if(v.level==datas.level){
					var pro_w =((Number(v.quantity)/Number(v.nextLevelEndNumber))*100)
					$(".progress").eq(i).css("width",pro_w+"%");
				};
				if(v.quantity==v.nextLevelEndNumber){
					$(".item").eq(2).text(v.quantity+'~'+'max')
				}else{
					$(".item").eq(i).text(v.quantity+'~'+v.nextLevelEndNumber)
				}
				
				
				if(datas.level=="2"){
					$(".vip_status").eq(1).attr("src","../img/vip_2.png");
				}else if(datas.level=="3"){
					$(".vip_status").eq(2).attr("src","../img/vip_3.png");
				};	
			});
			$(".next_leve").text(datas.nextLevelCount+"单");
		}
	}
	util.get_ajax(url,data,success)
}
