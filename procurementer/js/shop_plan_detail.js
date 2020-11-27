 $(document).ready(function(){
 	getPlanDetail();
 })
 function getPlanDetail(){
	 var selectId = localStorage.getItem("selectPlanId");
	 var url = re_url(methods.getBuyOilPlanDetail);
	 var data = {
	 	bpPlanId:selectId
	 };
	 var success = function(response) {
	 	if(response['code'] == RETCODE_SUCCESS) {
	 		var obj = response["data"];
			setTransType(obj["transType"]);
			setNavName(obj["name"]);
			$(".plan_box").html(upDataHtml(obj["buyOilList"]));
	 	}
	 }
	 util.get_ajax(url, data, success);
 }
 function setNavName(name){
	 $(".header-title").text(name);
 }
 function setTransType(type){
	 var str_type = type==0?'物流配送':'自提';
	 $(".physical_type").text(str_type);
 }
 function upDataHtml(list){
	 if(list.length >0){
	 	var htmlStr = '';
	 	$.each(list,function(index,item){
	 		htmlStr += '<div class="row m-0 shadow-sm bg-white wite_bg mt-2 plan_item pb-4">';
	 		htmlStr += '<div class="col-12 row p-0 m-0">';
	 		htmlStr += '<div class="row col-12">';
	 		htmlStr += '<p class="col-2 tag text-center">'+(index+1)+'</p>';
	 		htmlStr += '</div>';
	 		htmlStr += '<div class="col-12 row color-6 mt-3">';
			htmlStr += '<span class="col-4 pr-0 font_2 ">收货地址：</span>';
			htmlStr += '<span class="col-8 px-0 font_2 site_name black">'+item["addressName"]+'</span>';
			htmlStr += '</div>';
			htmlStr += '<div class="col-12 mt-2 py-1 font_1">';
			htmlStr += '<span class="fa fa-circle pr-1"></span>';
			htmlStr += '<span class="color-6">油品详情</span>';
			htmlStr += '</div>';
			htmlStr += '<div class="col-12 row m-0 p-0 mt-2 py-1">';
			var arr = item["buyOilList"];
			$.each(arr,function(index,obj){
				htmlStr += '<div class="col-3 goods_item text-center border-right">';
				htmlStr += '<p class="goods_name font_4 orange">'+obj["no"]+'#'+'</p>';
				htmlStr += '<p class="goods_no font_1 mt-1"><span class="g_no">'+Number(obj["buyTotalCount"])+'</span>吨</p>';
				htmlStr += '</div>';
			});
			htmlStr += '</div></div></div>';
	 	});
	 	return htmlStr;
	 }
	 return false;
 }
