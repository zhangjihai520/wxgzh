$(function () {
	remove_localStorage("buInvoiceTpltId");
    //去账单主页
    page_change("#account", 'account.html');
    //去人员主页
    page_change("#personnel", 'personnel.html');
    //设置
    page_change("#setpager",'setuppager.html')
    //企业认证
    page_change("#businessCertification",'certification_office.html');
    //发票信息
    page_change("#invoice",'please_invoiceList.html');
    //会员体系
    page_change("#membershipsystem",'vip_system.html');
    //优惠活动
    page_change("#activity",'activity.html');
	getInfo();
	

});
function getInfo(){
	var url = re_url(methods.getCpAccountBaseInfo);
	var data = [];
	var success = function(response) {
		var info = response["data"];
		// console.log(info)
		$("#carNum").text(info["accountCount"]);
		$("#addOilDay").text(info["recentAddOilPrice"]);
		$(".Headportrait").attr("src",info["avatarUrl"]);
		$(".name").text(info["name"]);
		$(".phone").text(info["phoneNumber"]);
		$("#user_img").attr("src",info.avatarUrl);
		save_localStorage("avatarUrl",info.avatarUrl)
		var levels = info["level"];
		if(levels == 0){
			$(".viplevel").text("普通会员");
		}else{
			$(".viplevel").text(levels+'级会员');
		}
		var status = info["authStatus"];
		if(status == 0){
			$(".status").text("未认证");
		}else if(status == 1){
			$(".status").text("已认证");
		}else if(status == 2){
			$(".status").text("资料审核中");
		}else if(status == -1){
			$(".status").text("未通过");
		}else{
			$(".status").text("");
		}
	}
	util.get_ajax(url, data, success)
}
