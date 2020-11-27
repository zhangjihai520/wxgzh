var currentPage = 1;
var currentSize = 4;
var isLoadAllData = false;
var isEditStatus = false;
var isCheckAll = false;
var dataArray = [];

save_localStorage("isStop", "true");
$(function() {
	var height_1 = $(".header").height();
	var height_2 = $(".add_box").height();
	var height_3 = $(".nav_bottom").height();
	var height = height_1 + height_2;
	$("#wrapper").css("top", height+10);
	$("#wrapper").css("bottom", height_3);
	pullOnLoad(currentPage, currentSize);
	var myscroll = new iScroll('wrapper', {
		onScrollMove: function() { //手动滑动中触发	
			//			myscroll.refresh();
			//上拉加载
			upDataStatus();
			if(get_localStorage("isStop") == "false") {
				//				myscroll.refresh();
				$(".pull-loading").html("暂无更多数据");
				return;
			};
			if(this.y < this.maxScrollY) {
				$(".pull-loading").html("释放加载");
				$(".pull-loading").addClass("loading");
				myscroll.refresh()
			} else {
				$(".pull-loading").html("上拉加载");
				$(".pull-loading").removeClass("loading");
				//				myscroll.refresh();
			};
			if(!isEditStatus) {
				$(".list-group-item").removeAttr("onclick")
			}

		},
		onScrollEnd: function() {
			myscroll.refresh();
			if(!isEditStatus) {
				$(".list-group-item").attr("onclick", "tap_item(this)");
			}
			if(get_localStorage("isStop") == "false") {
				$(".pull-loading").html('暂无更多数据');
				return;
			}
			if($(".pull-loading").hasClass('loading') && get_localStorage("isStop") == "true") {
				currentPage++;
				$(".pull-loading").html("加载中...");
				pullOnLoad(currentPage, currentSize);
			};
			//			myscroll.refresh();
		}

	});
	//	 document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
})

function pullOnLoad(pages, size) {
	setTimeout(function() {
		getPlanList(pages, size)
	}, 500);
}
//获取购油计划列表
function getPlanList(nowPage, currentSize) {
	var url = re_url(methods.getBuyOilPlans);
	var data = {
		page: nowPage,
		size: currentSize
	};
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			var obj = response["data"];
			var tampDataList = obj["list"];
			
			if(tampDataList == "") {
				$(".pull-loading").html("已经到底了...");
				save_localStorage("isStop", "false");
			};
			$.each(tampDataList, function(index, value) {
				$("#dataList").append(updataHtml(value))
			});
			tatus();
		}
	}
	util.get_ajax(url, data, success);
}

//更新界面
function updataHtml(obj) {
	var user_row = '';
	var transType = obj["transType"] == 0 ? '物流' : '自提';
	var oilList = obj["buyOilList"];
	user_row += '<li class="col-12 px-2 shadow-sm bg-white plan_box pb-3 mt-2 border_1 list-group-item" id="' + obj["bpPlanId"] + '" onclick="tap_item(this)">';
	user_row += '<div class="form-row border-bottom py-2 plan_item">';
	user_row += '<p class="product-ckb check_item col-1 px-1" style="display: none;"><em class="product-em product-xz"></em></p>';
	user_row += '<p class="col-6 font_6 font_weight text-left black px-1">' + obj["name"] + '</p>';
	user_row += '<p class="col-5 plan_physical orange text-right">配送:' + transType + '<span class="physical_no">' + obj["addrCount"] + '</span>处</p>';
	user_row += '</div>';
	user_row += '<p class="col-12 mt-3  black font_1 px-0">总数量:</p>';
	user_row += '<div class="form-row mt-3">';
	$.each(oilList, function(index1, obj1) {
		user_row += '<div class="col-3 goods_item text-center">';
		user_row += '<p class="goods_name orange">' + obj1["no"] + '#' + '</p>';
		user_row += '<p class="goods_no mt-1"><span class="g_no">' + obj1["buyTotalCount"] + '</span>吨</p>';
		user_row += '</div>'
	})
	user_row += '</div>'
	user_row += '</li>'
	return user_row;
}
$(".complie").click(function() {
	if($(this).text() == "编辑") {
		$(".product-ckb").show();
		$(".delete_box").show();
		$(".nav_box").hide();
		$(this).text("取消");
		$(".list-group-item").removeAttr("onclick")
	} else if($(this).text() == "取消") {
		$(".product-ckb").hide();
		$(".delete_box").hide();
		$(".nav_box").show();
		$(this).text("编辑");
		$(".list-group-item").attr("onclick", "tap_item(this)");
	}
	isEditStatus = !isEditStatus;
});

function upDataStatus() {
	if(isEditStatus) {
		$(".product-ckb").show();
		$(".delete_box").show();
		$(".nav_box").hide();
		$(".check_all").children("em").addClass("check_icon")
		$(".list-group-item").removeAttr("onclick")

	} else {
		$(".product-ckb").hide();
		$(".delete_box").hide();
		$(".nav_box").show();
		$(".list-group-item").attr("onclick", "tap_item(this)");
	}
	if(!isCheckAll) {
		$(".check_item").children("em").addClass("product-xz");
	} else {
		$(".check_item").children("em").removeClass("product-xz")
	}
}
$(".check_all").click(function() {
	$(this).children("em").toggleClass("check_icon");
	console.log($(this).children("em").hasClass("check_icon"))
	if($(this).children("em").hasClass("check_icon")) {
		$(".check_item").children("em").addClass("product-xz");
	} else {
		$(".check_item").children("em").removeClass("product-xz")
	}
	isCheckAll = !isCheckAll;
});
$(document).on("click", ".check_item", function() {
	var _this = $(this).children("em");
	_this.toggleClass("product-xz");
	console.log($(".product-xz").length == $(".check_item").length)
	if($(".product-xz").length == $(".check_item").length) {
		$(".check_all").children("em").addClass("check_icon")
	} else {
		$(".check_all").children("em").removeClass("check_icon")
	}
})

function tap_item(obj) {
	var planId = $(obj).attr("id");
	localStorage.setItem("selectPlanId", planId);
	window.location.href = "shop_plan_detail.html";
}

$(".delete").click(function() {
	var needDelArray = [];
	var objList = document.getElementsByClassName('list-group-item');
	$.each(objList, function(index, obj) {
		if($(this).find("em").hasClass("product-xz")) {
			var dict = {
				bpPlanId: $(this).attr("id")
			};
			needDelArray.push(dict);
		}
	})
	//	console.log(needDelArray)
	if(needDelArray.length > 0) {
		//删除
		deleteBuyOilPlan(needDelArray);
	}
});

function deleteBuyOilPlan(parmArr) {
	var url = re_url(methods.deletePlans);
	var data = {
		planList: parmArr,
	};
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			currentPage = 1;
			isLoadAllData = false;
			getPlanList(currentPage, currentSize);
			window.location.reload();
		}
	}
	util.post_ajax(url, data, success);
}

function tatus() {
	if($(".list-group-item").length == 0) {
		$(".plan_null").show();
		$(".complie").hide();
		$(".add_box").hide();
		$("#wrapper").hide();
	} else {
		$(".plan_null").hide();
		$(".complie").show();
		$(".add_box").show();
		$("#wrapper").show();
	}
}
page_change(".add_plan", "add_shopping_plan.html");
page_change(".plan_null", "add_shopping_plan.html");