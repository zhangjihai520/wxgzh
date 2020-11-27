var oilArray = [];
getOilType();

//获取油品
function getOilType() {
	var url = re_url(methods.selectOilNo);
	var data = {};
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			var obj = response["data"];
			oilArray = obj;
		}
	}
	util.get_ajax(url, data, success)
}
$(".add_stock").click(function() {
	$(".stock_box").addClass("pt-3");
	$(".warn").show();
	var count = $(".stock_box").find(".stock_item").length;
	if(count >= oilArray.length) {
		return;
	}
	var stock_list = stock_item()
	$(".stock_box").append(stock_list);
	$(".dropdown-item").click(function() {
		$(this).siblings().removeClass("orange");
		$(this).addClass("orange");
		$(this).parent().prev(".dropdown-toggle").text($(this).text());
		$(this).parent().prev(".dropdown-toggle").attr("id", $(this).attr("id"));
	});
})

function stock_item() {
	var firstOil = oilArray[0];
	var stock_item = "";
	stock_item += '<div class="row pb-3 stock_item">';
	stock_item += '<div class="btn-group col-5">';
	stock_item += '<button class="btn  btn-sm orange dropdown-toggle border font_5" id="' + firstOil["oiOilId"] + '" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
	stock_item += firstOil["no"] + '#' + '</button>';
	stock_item += '<div class="dropdown-menu font_5" aria-labelledby="dropdownMenu2" style="min-width:80%;">';
	$.each(oilArray, function(index, item) {
		if(index == 0) {
			stock_item += '<button class="dropdown-item text-center border-bottom orange" id="' + item["oiOilId"] + '" type="button">' + item["no"] + '#' + '</button>';
		} else {
			stock_item += '<button class="dropdown-item text-center border-bottom " id="' + item["oiOilId"] + '" type="button">' + item["no"] + '#' + '</button>';
		}
	})
	stock_item += '</div></div>';
	stock_item += '<div class="input-group input-group-sm col-6  offset-1">';
	stock_item += '<input type="text" class="form-control orange border-right-0 border border_4 text-right px-0 oil_count "  onkeyup="number_all(this)" value="" placeholder="请输入数量">';
	stock_item += '<div class="input-group-append">';
	stock_item += '<span class="input-group-text border-left-0 pr-4 orange">' + '吨' + '</span>';
	stock_item += '</div></div>';
	stock_item += '</div>';
	return stock_item;
}
//确定入库
$(".click_btn").click(function() {
	var url = re_url(methods.addStoreSurplus);
	var data = creatData();
	if(data.length == 0) {
		toast("请先选择油品")
		return;
	}
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			//toast("入库成功");
			alert("入库成功");
			page_back();
			sessionStorage.setItem('refresh', 'true');
		}

	}
	util.post_ajax(url, data, success)
})

function creatData() {
	// [
	// 	{
	// 		(必传)油库id（osOilStoreId；
	// 		(必传)成品油id（oiOilId）；
	// 		数量（单位：吨）（surplus）
	// 	},
	// 	{
	// 		(必传)油库id（osOilStoreId；
	// 		(必传)成品油id（oiOilId）；
	// 		数量（单位：吨）（surplus）
	// 	},
	// ]
	var parmData = [];
	var itemList = $(".stock_box").find(".stock_item");
	$.each(itemList, function(index, obj) {
		var str_oilId = $(this).find(".dropdown-toggle").attr("id");
		var str_oilStoreId = get_localStorage("oilStoreId");
		var str_oilCount = $(this).find(".oil_count").val();
		console.log(str_oilCount);
		if(parseFloat(str_oilCount) != 0 && str_oilCount!="" ) {
			var tampDic = {
				osOilStoreId: str_oilStoreId,
				oiOilId: str_oilId,
				surplus: str_oilCount
			}
			parmData.push(tampDic);
		}else{
			toast("请输入数量")
		}
	})
	return parmData;
}