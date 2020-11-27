$(function(){
	getTransAccountBaseInfo();
	var width =$(".img_box").width();
	$(".img_box").css("height",width);
	
});
function getTransAccountBaseInfo() {
	var url = re_url(methods.getTransAccountBaseInfo);
	var data ={};
	var success =function(response){
		console.log(response)
		if(response.code==RETCODE_SUCCESS){
			var datas =response.data;
			$(".rounded-circle").attr("src",datas.avatarUrl);
			$(".user_name").text(datas.name);
			$(".user_accoun").text(datas.phoneNumber);
			$(".all_num").text(datas.recentOrderRecCount);
			$(".trans_money").text(datas.recentTranPrice);
			$(".lose_money").text(datas.unPayPrice);
			if(datas.authStatus=="0"){
				$(".approve").text("未认证");
			}else if(datas.authStatus=="1"){
				$(".approve").text("已认证");
			}else if(datas.authStatus=="2"){
				$(".approve").text("资料审核中");
			}else if(datas.authStatus=="-1"){
				$(".approve").text("审核不通过");
			}else{
				$(".approve").text("");
			}
			save_localStorage("avatarUrl",datas.avatarUrl)
		}
	}
	util.get_ajax(url,data,success)
}
