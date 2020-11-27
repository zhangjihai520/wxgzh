$(function() {
	getBuyerVipSystem();
})

function getBuyerVipSystem() {
	var url = re_url(methods.getBuyerVipSystem);
	var data = {};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			var types =datas.tMsLevelCfgList[1].reqCycle;
			console.log(datas);
			$(".levelNum").text("LV" + datas.level);
			$(".user_balance").text(datas.levelCount + rule_type(types));
			$(".back_money").text(datas.balance);
			$(".rule_type").text(rule_type(types));
			
			$.each(datas.tMsLevelCfgList, function(i, v) {
				if(v.level == datas.level) {
					var pro_w = ((Number(datas.levelCount) / Number(datas.levelCount + datas.nextLevelCount)) * 100)
					$(".progress").eq(i).css("width", pro_w + "%");
				};
				$(".item").eq(i).text("连续购油" + v.cycleNumber + rule_type(types))

			});
			if(datas.level == "2") {
				$(".progress").eq(0).css("width", 100 + "%");
				$(".vip_status").eq(1).attr("src", "../img/vip_2.png");
			} else if(datas.level == "3") {
				$(".progress").eq(0).css("width", 100 + "%");
				$(".progress").eq(1).css("width", 100 + "%");
				$(".vip_status").eq(2).attr("src", "../img/vip_3.png");
			} else if(datas.level == "4") {
				$(".progress").eq(0).css("width", 100 + "%");
				$(".progress").eq(1).css("width", 100 + "%");
				$(".progress").eq(2).css("width", 100 + "%");
				$(".vip_status").eq(3).attr("src", "../img/vip_4.png");
			};
			$(".next_leve").text(datas.nextLevelCount + rule_type(types));
		}
	}
	util.get_ajax(url, data, success)
}

function rule_type(data){
	var type ="";
	switch(data){
				case 1:
					type ="天"
					break;
				case 2:
					type ="周"
					break;
				case 3:
					type ="月"
					break;
				case 4:
					type ="年"
					break;
			}
	return type
}
