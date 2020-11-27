pushHistory();
window.addEventListener("popstate", function(e) {
	window.location.href = '../login.html?_r=' + Math.random();
}, false);
$(function () {
    setCss();
    //去充值
    page_change("#rechargeBtn", 'recharge.html');
    //查账单
    page_change(".billingDetails", 'bill.html');
    //去人员主页
    page_change("#personnel", 'personnel.html');
    //去我的主页
    page_change("#information", 'information.html');
	getWalletNum();
});

function setCss() {
    $("#wallet").css('height', $("#wallet").width()*0.42)
}
function getWalletNum(){
	var url = re_url(methods.getCpAccountPurseInfo);
	var data = [];
	var success = function(response) {
		var info = response["data"];
		if (info == undefined){
			$(".balance").text("0.00");
		}else{
			$(".balance").text(info["balance"]);
		}
		
	}
	util.get_ajax(url, data, success)
}
