pushHistory();
window.addEventListener("popstate", function(e) {
	window.location.href = '../login.html?_r=' + Math.random();
}, false);
var currentPage = 1;
var currentSize = 8;
getDataList(currentPage,currentSize);
function getDataList(page,size){
	var url = re_url(methods.getSuSupplierOilDepotList);
	var data = {
		page: page,
		size: size
	};
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			var data = response["data"];
			if(data["list"].length>0){
				updataHtml(data["list"]);
				$(".list_null").hide();
			}else{
				$(".list_null").show();
			}
		} else {
			toast(response.message);
		}
	}
	util.get_ajax(url, data, success)
}
function updataHtml(list){
	var root = $(".oil_box");
	var htmlStr = '';
	$.each(list,function(index,item){
		htmlStr += '<div class="row py-3 border-bottom oil_box_item" id="'+item["osOilstoreId"]+'">';
		htmlStr += '<p class="col-12 font_4 font_weight oil_store_name">'+item["name"]+'</p>';
		htmlStr += '<p class="col-12 font_1 mt-2 text-muted oil_store_add">'+item["detailsAddress"]+'</p>';
		htmlStr += '</div>';
	})
	root.html(htmlStr);
}
$(document).on("click",".oil_box_item",function(){
	var oilStoreName = $(this).find(".oil_store_name").text();
	var oilStoreId = $(this).attr("id");
	save_localStorage("oilStoreName",oilStoreName);
	save_localStorage("oilStoreId",oilStoreId)
	window.location.href = "supplier_oil_choose.html";
})