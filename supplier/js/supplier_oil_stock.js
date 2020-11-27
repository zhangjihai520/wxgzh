$(".header-title").text(get_localStorage("oilStoreName"));
getStockDetail();
function getStockDetail(){
	var url = re_url(methods.getOilInventory);
	var data = {
		osOilstoreId:get_localStorage("oilStoreId")
	};
	var success = function(response) {
		console.log(response)
		if(response['code'] == RETCODE_SUCCESS) {
			var obj = response["data"];
			if(obj==""){
				toast("您没有油入库")
				return;
			}else{
				$(".oil_row").addClass("pb-3");
				updataHtml(obj);
			}
		} else {
			toast(response.message);
		}
	}
	util.get_ajax(url, data, success)
}
$(".sys_inStock").click(function(){
	window.location.href = "supplier_system_stock.html"
})
function updataHtml(list){
	var root = $(".oil_stock_box");
	if(list.length<=0){
		root.remove();
		return;
	}
	var htmlStr = '';
	$.each(list,function(index,item){
		htmlStr += '<div class="form-row mt-2">';
		htmlStr += '<p class="form-control border col-6 font_4 orange font_weight text-center">'+item["no"]+'#</p>';
		htmlStr += '<p class="form-control border col-6 font_4 orange font_weight text-center">'+item["surplus"]+'吨</p>';
		htmlStr += '</div>';
	})
	root.html(htmlStr);
}