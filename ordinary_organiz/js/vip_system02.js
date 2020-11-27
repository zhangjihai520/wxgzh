$(function () {
    setCss();
	getVipData();
});
function setCss() {
    //返回
    $(".break").click(function () {
        page_back();
    });
}
function getVipData(){
	var url = re_url(methods.getCompanyVipSystem);
	var data = [];
	var success = function(response) {
		var info = response["data"];
		console.log(response)
		updataVipHtml(info["levels"],info["level"]);
		updataLevel(info);
	}
	util.get_ajax(url, data, success)
}
//更新规则html
function updataVipHtml(list,currentLevel){
	var htmlStr = '';
	$.each(list,function(index,item){
		if(index == list.length-1){
			htmlStr += '<div class="table_radius_bottom_left_right form-row">';
		}else{
			if(index%2 == 1){
				htmlStr += '<div class="table_content form-row" style="background:  #FFDBBF">';
			}else{
				htmlStr += '<div class="table_content form-row" style="background:  #FFD4B2">';
			}
		}
		htmlStr += '<div class="text7" style="width: 30%">LV.'+item["level"]+'</div>';
		htmlStr += '<div class="vLine" ></div>';
		var start_num = item["reqScore"];
		var end_num = item["nextLevelBeginScore"];
		if(start_num == end_num){
			htmlStr += '<div class="text8" style="width: 68%">'+start_num+'-Max积分'+'</div>';
		}else{
			htmlStr += '<div class="text8" style="width: 68%">'+start_num+'-'+end_num+'积分</div>';
		}
		htmlStr += '</div>';
		//进度条
		if(item["level"] == currentLevel){
			var num_progress = item["reqScore"]/item["nextLevelBeginScore"]*100
			if(currentLevel == 1){
				$(".progress_vip1").attr("style","width: "+num_progress+"%");
				$(".progress_vip2").attr("style","width: 0%");
			}else if(currentLevel == 2){
				$(".progress_vip1").attr("style","width: 100%");
				$(".progress_vip2").attr("style","width: "+num_progress+"%");
			}else if(currentLevel == 3){
				$(".progress_vip1").attr("style","width: 100%");
				$(".progress_vip2").attr("style","width: 100%");
			}
		}	
	})
	$(".table_radius_top_left_right").after(htmlStr);
}
//更新会员信息
function updataLevel(info){
	//当前等级
	var num_level = info["level"];
	var str_level = 'LV.'+num_level;
	$(".levelNum").text(str_level);
	//等级积分
	var num_balance = info["balance"];
	$(".user_balance").text(num_balance+'积分')
	//升级还差积分
	var num_nextBalance = info["nextLevelScore"];
	$(".user_nextLevel_balance").text(num_nextBalance+'积分');
	
	//等级图标
	if(num_level == 2){
		$("#vip_2").attr("src","img/vip_2.png");
		if(num_level == 3){
			$("#vip_3").attr("src","img/vip_3.png")
		}
	}
}