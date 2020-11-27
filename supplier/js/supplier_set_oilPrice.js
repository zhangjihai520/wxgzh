getPriceData();
// $(document).on("click",".oil_no_item",function(){
// 	$(".oil_no_item").removeClass("choose_active");
// 	$(this).addClass("choose_active");
// 	$(".oil_type").text($(this).text())
// })
$(".change_price").click(function() {
	// console.log("aqaa")
	$(".form-control").removeAttr("readonly")
});

$(".click_btn").click(function() {
	$(".form-control").attr("readonly", "readonly")
})
//$(".header-title").text(get_localStorage("oilStoreName"));

function getPriceData(){
	var url = re_url(methods.getOilStoresPrices);
	var data = {
		osOilstoreId:get_localStorage("oilStoreId")
	};
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			var obj = response["data"];
			console.log(obj)
			if(obj==""){
				alert("请先去添加库存");
				window.location.href="supplier_oil_choose.html"
			}
			//updataOilNo(obj);
			updataPrice(obj);
		}
	}
	util.get_ajax(url, data, success)
}
function updataOilNo(list){
	var htmlStr = '<div class="row p-3">';
	$.each(list,function(index,item){
		htmlStr += '<div class="col-3 px-2">';
		if(index == 0){
			htmlStr += '<p class="border text-center font_3 font_weight oil_no_item choose_active">'+item["no"]+'#</p>';
		}else{
			htmlStr += '<p class="border text-center font_3 font_weight oil_no_item ">'+item["no"]+'#</p>';
		}
		htmlStr += '</div>';
	})
	htmlStr += '</div>';
	$(".oil_no_box").html(htmlStr);
}
function updataPrice(list,oilId){
	var htmlStr = '<div class="container-fluid wite_bg pt-1 border-bottom px-0">';
	htmlStr += '<div class="top">';
	htmlStr += '<span class=" fa fa-angle-left top_icon pl-2" onclick="page_back()"></span>';;
	htmlStr += '<p class="header-title">'+get_localStorage("oilStoreName")+'</p>';
	htmlStr += '</div></div>';
	$.each(list,function(i,obj){
		htmlStr += '<div class="container mt-2 price_detail_box" id="'+obj["oiOilId"]+'">';
		htmlStr += '<div class="row  mx-0 price_oil_no">';
		htmlStr += '<div class="input-group ">';
		htmlStr += '<div class="input-group-prepend">';
		htmlStr += '<span class="input-group-text border-white font_weight oil_type">'+obj["no"]+'#</span>';
		htmlStr += '</div>';
		htmlStr += '<p class="form-control border-white"></p>';
		htmlStr += '<div class="input-group-prepend">';
		htmlStr += '<span class="input-group-text fa fa-pencil border-white mt-1 change_price" id="'+obj["oiOilId"]+'"></span>';
		htmlStr += '</div></div></div>';
		htmlStr += '<div class="row mx-0 border price_detail_item"  style="border-color: #FFE8D9 !important;">';
		var priceList = obj["tSuOilpriceList"];
		$.each(priceList,function(index,item){
			htmlStr += addPriceHtml(item);
		})
		htmlStr += '<div class="col-12 wite_bg">';
		htmlStr += '<button class="btn btn-sm rounded-pill line_orange click_btn my-3 font_3" hidden="true">确定</button>';
		htmlStr += '</div></div></div>';
	})
	htmlStr += '<div class="toast text-center fixed-bottom" style="" role="alert" aria-live="polite" aria-atomic="true" data-delay="1000">';
	htmlStr += '<div role="alert" aria-live="assertive" class="toast_text " aria-atomic="true"></div>';
	htmlStr += '</div>';
	//$("body").append(htmlStr);
	$("body").html(htmlStr);
}
function addPriceHtml(priceDict){
	var htmlStr = '';
	htmlStr += '<div class="input-group wite_bg p-1 border-bottom" id="'+priceDict["suOilpriceId"]+'" style="border-color: #FFE8D9 !important;">';
	htmlStr += '<div class="input-group-prepend">';
	htmlStr += '<span class="input-group-text style pl-5">&gt;= </span>';
	htmlStr += '</div>';
	htmlStr += '<input type="text" class="form-control style text-left px-0" value="'+priceDict["startVolume"]+'" readonly placeholder="起始吨数">';
	htmlStr += '<input type="text" class="form-control style text-right px-0" value="'+priceDict["oilPrice"]+'" readonly placeholder="油价">';
	htmlStr += '<div class="input-group-prepend textField_item">';
	htmlStr += '<span class="input-group-text style text-right px-0">元/吨</span>';
	if(priceDict["suOilpriceId"] == ""){
		htmlStr += '<span class="input-group-text style px-2 delete_oil_no">&times;</span>';
	}
	htmlStr += '</div></div>';
	return htmlStr
}
$(document).on("change",".click_btn",function(){
	console.log($(this).attr("hidden"));
})
//修改 添加 价格
$(document).on("click",".change_price",function(){
	var _okBtn = $(this).parents(".price_detail_box").find(".click_btn");
	var htmlStr = '<span class="input-group-text style px-2 delete_oil_no">&times;</span>';
	if(_okBtn.attr("hidden")){
		//进入编辑模式 图标变+,显示确定按钮
		$(this).parents(".price_detail_box").find(".textField_item").append(htmlStr);
		_okBtn.attr("hidden",false);
		$(this).removeClass("fa-pencil").addClass("fa-plus-circle");
	}else{
		//添加油价
		var _priceBox = $(this).parents(".price_detail_box").find(".price_detail_item");
		var tampDic = {
			oiOilId:$(this).attr("id"),
			startVolume:'',
			oilPrice:'',
			suOilpriceId:''
		}
		_priceBox.prepend(addPriceHtml(tampDic));
	}
	$(this).parents(".price_detail_box").find("input").attr("readonly",false);
})
//删除价格
$(document).on("click",".delete_oil_no",function(){
	_this = $(this);
	var url = re_url(methods.deteleOilStoresOil);
	var str_priceId = $(this).parents(".border-bottom").attr("id");
	if(strIsNULL(str_priceId)){
		_this.parents(".border-bottom").remove();
		return;
	}
	var data = {
		suOilpriceId:str_priceId
	};
	var success = function(response) {
		var obj = response["data"];
		_this.parents(".border-bottom").remove();
	}
	util.get_ajax(url, data, success);
})
//保存修改
// [
// 	{
// 		suOilpriceId:油价id(新增不传)，,
// 		startVolume：起点量，
// 		oilPrice：油价，
// 		oiOilId：油id，
// 		osOilstoreId:油库id,
// 	},
// ]
$(document).on("click",".click_btn",function(){
	//退出编辑模式
	$(this).attr("hidden",true);
	$(this).parents(".price_detail_box").find("input").attr("readonly",true);
	$(this).parents(".price_detail_box").find(".delete_oil_no").remove();
	$(this).parents(".price_detail_box").find(".change_price").removeClass("fa-plus-circle").addClass("fa-pencil");
	
	var _this = $(this);
	var priceList = $(this).parents(".price_detail_item").find(".border-bottom");
	if(priceList.length<=0){
		return;
	}
	var flag = true;
	var url = re_url(methods.updateOilStoresOil);
	var data = [];
	$.each(priceList,function(i,item){
		var num_oil_count = $(this).find("input.text-left").val();
		var num_oil_price = $(this).find("input.text-right").val();
		var str_oilId     = $(this).parents(".price_detail_box").attr("id");
		var str_storeId   = get_localStorage("oilStoreId");
		var str_priceId   = $(this).attr("id");
		var parmDic = {
			startVolume:num_oil_count,
			oilPrice:num_oil_price,
			oiOilId:str_oilId,
			osOilstoreId:str_storeId,
			suOilpriceId:str_priceId
		}
		
		if(!strIsNULL(num_oil_count) && !strIsNULL(num_oil_price)){
			if(parseFloat(num_oil_count)>=0 && parseFloat(num_oil_price)>=0){
				if(checkRepeat(num_oil_count,data)){
					alert("起始吨数设置重复");
					getPriceData();
					flag = false;
					return;
				};
				data.push(parmDic);
			}else{
				alert("设置的起始吨数和价格要大于0");
				getPriceData();
				flag = false;
				return;
			}	
		}else{
			//过滤掉没设置的
			var itemList = $(this).remove();
		}
	})
	if(flag){
		console.log(data);
		$.ajax({
			type: "POST",
			url: url,
			dataType: "json",
			data: JSON.stringify(data),
			contentType: 'application/json',
			beforeSend: function(response) {
				response.setRequestHeader("token", getToken());
			},
			success: function(response) {
				if(response.code == RETCODE_TOKEN_INVALID) {
					console.log(response)
					alert(response.message);
					window.location.href = "../login.html";
					return false;
				} else if(response.code == ACCOUNT_DATA_APPROVAL) {
					toast(response.message)
					return;
				} else if(response.code == ACCOUNT_DATA_NO_PASS) {
					alertCer(response.message);
					return;
				}else if(response.code == ACCOUNT_DATA_NO_IN) {
					alertCer(response.message);
					return;
				}else if(response.code==ACCOUNT_DATA_OILSTATION){
					alert_oil(response.message)
		
				}else if(response.code==RETCODE_FAILED){
					alert(response.message);
					getPriceData();
				}else{
					//success(response);
				}
			},
			error: function(error) {
				alert("网络异常")
			}
		});
	}
})
function checkRepeat(count,dataList){
	var result = false;
	$.each(dataList,function(index,item){
		if(count == item["startVolume"]){
			result = true;
			return;
		}
	})
	return result;
}
function cleanUnUserData(){
	$.each()
}