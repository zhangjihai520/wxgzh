pushHistory();
window.addEventListener("popstate", function(e) {
	window.location.href = '../login.html?_r=' + Math.random();
}, false);
var price = 0;
var sortByDestinationPrice = 1;
var buAddressId = '';
var height_1 = $(".header").height();
var height_2 = $(".title_box").height();
var height_3 = $(".nav_bottom").height();
var height = height_1 + height_2;
$("#wrapper").css("top", height);
$("#wrapper").css("bottom", height_3);
save_localStorage("isStop", "true");
var page = 1;
var num = 5;
$(function() {
	getOilType();
	$("#addressCheck").click(function() {
		getBuAddress();
	});
	// 加载账户列表数据
	getDate();
	$("#price").click(function() {
		if (null != buAddressId && buAddressId != '') {
			$("#addressCheck").find('img').prop('src', 'img/uncheck.png');
			buAddressId = '';
		}
		if(price == 1) {
			price = 2;
			$("#price").find('img').prop('src', 'img/next.png');
		} else if (price == 0) {
            price = 1;
            $("#price").find('img').prop('src', 'img/getOn.png');
        } else {
			price = 1;
			$("#price").find('img').prop('src', 'img/getOn.png');
		};

		save_localStorage("isStop", "true");
		getDate();
		$('#scroller').css('transform', 'translate3d(0px, 0px, 0px)');
	});

	var myscroll = new iScroll('wrapper', {	
		onScrollMove: function() { //手动滑动中触发			
			if(get_localStorage("isStop") == "false") {
//				myscroll.refresh()
				return;
			};
			if(this.y < this.maxScrollY) {
				if($(".list_group_item").length<num){
					$(".pull-loading").html("已经到底了...");
				}else{
					$(".pull-loading").html("释放加载");
				}
				$(".pull-loading").addClass("loading");
				myscroll.refresh()
			} else {
				if($(".list_group_item").length<num){
					$(".pull-loading").html("已经到底了...");
				}else{
					$(".pull-loading").html("上拉加载");
				}
				$(".pull-loading").removeClass("loading");	
			};
			$(".list_group_item").removeAttr("onclick")
		},		
		onScrollEnd: function() {
			myscroll.refresh();
			$(".list_group_item").attr("onclick","tap_item(this)")
			if(get_localStorage("isStop") == "false") {
				$(".pull-loading").html('已经到底...！');
				return;
			}
			if(this.y == this.maxScrollY) {
				var page = get_localStorage("pages");
				page++;
				save_localStorage("pages", page);
				$("#dataList").append(loadUserData(buildCondData()));
				if(null != buAddressId && buAddressId != '') {
					$('.locatingInformation').show();
					$('#priceTip').show();
					$("#wrapper").css("top", height + $("#priceTip").height());
				} else {
					$('.locatingInformation').hide();
					$("#wrapper").css("top", height - $("#priceTip").height());
					$('#priceTip').hide();
				}
				$(".pull-loading").html('上拉加载更多...');

			};

		}
	});

	$(".sortByDestination").click(function() {
		if(sortByDestinationPrice == 1) {
			sortByDestinationPrice = 2;
			$(".sortByDestination").prop('src', 'img/next.png');
            $(".sortByDestination").next().text("降序");
			$("#addressCheck").find('img').prop('src', 'img/next.png');
		}else {
			sortByDestinationPrice = 1;
			$(".sortByDestination").prop('src', 'img/getOn.png');
            $(".sortByDestination").next().text("升序");
			$("#addressCheck").find('img').prop('src', 'img/getOn.png');
		};
	});


});

$("#search").on('click', function() {
	save_localStorage("isStop", "true");
	getDate();
	$('#scroller').css('transform', 'translate3d(0px, 0px, 0px)');
});

// 加载账户列表数据
function getDate() {
	var pages = save_localStorage("pages", "1");
	var page = get_localStorage("pages");
	$("#dataList").html(loadUserData(buildCondData()));
	$('.logoUrl').css('height', $('.logoUrl').width());
	if(null != buAddressId && buAddressId != '') {
		$('.locatingInformation').show();
		$('#priceTip').show();
		$("#wrapper").css("top", height + $("#priceTip").height());
	} else {
		$('.locatingInformation').hide();
		$("#wrapper").css("top", height - $("#priceTip").height());
		$('#priceTip').hide();
	};
}

//获取地址
function getBuAddress() {
	ajaxRequest(api + "t/bu/address/getBuyerAddressListUnPage",
		null, false,
		function(result) {
			var arr = result.data;
			var typeRow = '';
			$.each(arr, function(index, val) {
				typeRow += getBuAddressRow(val, index);
			});
			$("#buAddress").html(typeRow);
			if (null == buAddressId || buAddressId == "")
				$(':radio[name="exampleRadios"]:first').attr("checked", true);
			else
				$("input[name='exampleRadios'][value='"+buAddressId+"']").prop("checked", "checked");
			$("#buAddress .form-check").click(function() {
				$(this).children('input').attr("checked", true);
			});
			$("#confirmBuAddress").click(function() {
				buAddressId = $(':radio[name="exampleRadios"]:checked').val();
				if (sortByDestinationPrice == 1)
					$("#addressCheck").find('img').prop('src', 'img/getOn.png');
				$("#price").find('img').prop('src', 'img/uncheck.png');
				save_localStorage("isStop", "true");
				getDate();
				$('#scroller').css('transform', 'translate3d(0px, 0px, 0px)');
			});


		}, "get");
}

// 构造账户表格行内容
function getBuAddressRow(rowData, index) {
	var user_row = '<div class="form-check">';
	user_row += '<input class="form-check-input" type="radio" name="exampleRadios" value="' + rowData["buAddressId"] + '">';
	user_row += '<label class="form-check-label" for="exampleRadios1">' + rowData["addressName"] + '</label></div>';
	return user_row;
}
//获取油品
function getOilType() {
	ajaxRequest(api + "sightseer/selectOilNo",
		null, false,
		function(result) {
			var arr = result.data;
			var typeRow = '';
			$.each(arr, function(index, val) {
				typeRow += getOilTypeRow(val, index);
			})
			$("#oiOilComment").html(typeRow);
			$("#oiOil .type_item").click(function() {
				$("p").removeClass("oiOilId type_active");
				$(this).addClass("oiOilId type_active");
				$("#oiOilText").text($(this).text());
				save_localStorage("isStop", "true");
				getDate();
				$('#scroller').css('transform', 'translate3d(0px, 0px, 0px)');
			});
		}, "get");
}

// 构造账户表格行内容
function getOilTypeRow(rowData, index) {
	var user_row = '';
	if(index == 0) {
		$("#oiOilText").text(rowData["no"] + "#");
		user_row += '<p class="col-12 mt-1 type_item type_active oiOilId">' + rowData["no"] + '#</p>';
	} else {
		user_row += '<p class="col-12 mt-1 type_item">' + rowData["no"] + '#</p>';
	}
	user_row += '<input type="hidden" value="' + rowData["oiOilId"] + '">';
	return user_row;
}

// 构造查询条件数据
function buildCondData() {
	var cond = {};
	// // 账户名称
	var name = $("#name").val();
	name = $.trim(name);
	var oiOilId = $(".oiOilId").next().val();
	oiOilId = $.trim(oiOilId);
	var type = $(".oilType").next().val();
	type = $.trim(type);
	cond["buAddressId"] = buAddressId;
	cond["oiOilId"] = oiOilId;
	cond["type"] = type;
	cond["page"] = get_localStorage("pages");
	cond["size"] = num;
	if (null == buAddressId || buAddressId == '') {
		cond["priceSort"] = price;
	} else {
		cond["priceSort"] = sortByDestinationPrice;
	}

	cond["name"] = name;

	return cond;
}

function loadUserData(conditionData) {
	var tableBody = '';
	// ajax加载账户表格数据
	ajaxRequest(api + "t/os/oilstore/getOilSupermarket",
		conditionData, false,
		function(result) {
			var arr = result.data;
			if(arr.list == "") {
				$(".pull-loading").html("已经到底了...");
				save_localStorage("isStop", "false");
				return;
			}
			$('#cartCount').text(arr.cartCount);
			tableBody = buildTableBody(arr);

		}, "get");
	return tableBody;
}

// 构造账户表格body内容
function buildTableBody(tData) {
	var tableBody = "";
	$.each(tData.list, function(index, val) {
		tableBody += buildTableRow(val);
	});
	return tableBody;
}

// 构造账户表格行内容
function buildTableRow(rowData) {
	var user_row = '<li class="col-12 my-1 pb-2 border-2 list_group_item" onclick="tap_item(this)">';
	user_row += '<div class="form-row">';
	user_row += '<input type="hidden" class="osOilstoreId" value="' + rowData["osOilstoreId"] + '">';
	user_row += '<input type="hidden" class="oiOilId" value="' + rowData["oiOilId"] + '">';
	user_row += '<div class=" col-12">';
	user_row += '<div class="form-row">'
	user_row += '<div class="col-2 mt-3 logoUrl">';
	user_row += '<img src="' + rowData["logoUrl"] + '" alt="" class="product_img" /></div>';
	user_row += '<div class="col-10 text-left mt-2 pl-2">';
	user_row += '<p class="station_name">' + rowData["oilStoreName"] + '</p>';
	user_row += '<p class="font_1 mt-0 gray_color">近期成交' + rowData["recentDealCount"] + '吨'+'<span class="orange">'+'（库存量'+rowData["surplus"]+'吨）'+'</span>'+'</p>';
	user_row += '<p class="price mt-1 font_4">' + rowData["minPrice"] + '-' + rowData["maxPrice"] + '元/吨</p>';
	user_row += '<div class="form-row locatingInformation">';
	user_row += '<div class="locationIcon float-left"><img src="img/location.png" width="100%"> </div>';
	user_row += '<div class="col-4 mt-1 float-left"><span class="distance">' + rowData["distance"] + '</span>km</div>';
	user_row += '<div class="col-6 mt-1 float-left"><span class="distancePrice">' + rowData["distancePrice"] + '</span>元/吨</div>';
	user_row += '</div>';
	user_row += '</div>';
	user_row += '<p class="col-12 text-right mt-1 font_1 gray_color">' + rowData["prvinceName"] + rowData["cityName"] + '</p>';
	user_row += '</div></div>';
	user_row += '</div>';
	user_row += '</li>'
	return user_row;
}
$(".form-check").click(function() {
	$(this).attr("id")
});

//选择加油站类型
$("#oilType .product_item").click(function() {
	$("p").removeClass("oilType type_active");
	$(this).addClass("oilType type_active");
	$("#oilTypeText").text($(this).text());
	save_localStorage("isStop", "true");
	getDate();
	$('#scroller').css('transform', 'translate3d(0px, 0px, 0px)');
});
page_change(".add_site", "add_newAddress.html");

function tap_item(obj){
		save_localStorage("oiOilId", $(obj).find(".oiOilId").val());
		save_localStorage("osOilstoreId", $(obj).find(".osOilstoreId").val());
		save_localStorage("buAddressId", buAddressId);
		window.location.href = 'oil_detail.html?_r=' + Math.random();
	}