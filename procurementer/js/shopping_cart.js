$(document).ready(function(){
	getShoppingCartList();
	//跳转下单
	// page_change(".close_account","comfirm_orders.html");
});


function getShoppingCartList(){
	var url = re_url(methods.post_getCartList);
	var data = {
	
	};
	var success = function(response) {
		var data = response['data'];
		$("#shoppingComment").html(buildTableBody(data));
		setCss();

		//获取订单内容
		$(".close_account").click(function () {
			if (parseFloat($('.total_money').text()) > 0) {
				var depot = $("#shoppingComment").find('.shop_goods');
				var oilDepot = [];
				$.each(depot, function () {
					var oil = $(this).find(".oilComment");
					var boOilList = [];
					var boo = false;
					$.each(oil, function () {
						if ($(this).find('.product-em').hasClass("product-xz")) {
							var count = $(this).find('.product-num')[0].value;
							var boOil = {
								"oiOilId": $(this).find('.oiOilId').val(),
								"oilPrice": $(this).find('.unitPrice').val(),
								"count": count,
								"no": $(this).find('.oilNo').val()
							};
							boOilList.push(boOil);
							boo = true;
						}
					});
					if (boo) {
						var oilStore = {
							"boOilList":boOilList,
							"name": $(this).find('.oilName').text(),
							"url": $(this).find('img').attr('src'),
							"osOilStoreId": $(this).attr('id')
						};
						oilDepot.push(oilStore);
					}
				});
				save_localStorage("oilDepot", oilDepot);
				// console.log(oilDepot);
				save_localStorage("sourceStatus", 1);
				var url = re_url(methods.judgementStock);
				var data = oilDepot;
				var success = function(response) {
					window.location.href = 'comfirm_orders.html?_r=' + Math.random();
				};
				util.post_ajax(url, data, success)
			} else {
				toast('未选择商品！！！');
			}
		});

		//删除购物车
		$("#deleteCar").on('click', function () {
			var car = $("#shoppingComment").find('.oilComment');
			var buCartList = [];
			$.each(car, function () {
				if ($(this).find('.product-em').hasClass("product-xz")) {
					buCartList.push($(this).attr('id'));
				}
			});
			if (buCartList.length > 0) {
				var url = re_url(methods.deleteCart);
				var data = buCartList;
				var success = function(response) {
					toast('删除成功！！！');
					getShoppingCartList();
				};
				util.post_ajax(url, data, success)
			} else {
				toast('未选择购物车商品！！！');
			}
		});

	};
	util.post_ajax(url, data, success)
}

// 构造资源表格body内容
function buildTableBody(tData) {
	var tableBody = "";
	$.each(tData, function (index, val) {
		tableBody += '<div class="col-12 mt-2 shop_goods" id="' + val.osOilstoreId + '">';
		tableBody += '<div class="form-row">';
		tableBody += '<div class="col-12 mt-2 pb-2 product_area">';
		tableBody += '<div class="form-row">';
		tableBody += '<div class="col-2 pl-0"><p class="product-ckb"><em class="product-em check1"></em></p></div>';
		tableBody += '<div class="col-8 px-0"><span class="px-1 oilName">'+ val.name +'</span></div>';
		tableBody += '<div class="col-2 city">'+ val.cityName +'</div></div></div></div>';
		tableBody += '<div class="product">';
		tableBody += buildTableOil(val.tBuCarts);
		tableBody += '</div></div>';
	});
	return tableBody;
}

function buildTableOil(tData) {
	var tableBody = "";
	$.each(tData, function (index, val) {
		if (val.type == 0) {
			val.type = '汽油';
		} else {
			val.type = '柴油';
		}
		if (val.oilGrade == 1) {
			val.oilGrade = '国一';
		} else if (val.oilGrade == 2) {
			val.oilGrade = '国二';
		} else if (val.oilGrade == 3) {
			val.oilGrade = '国三';
		} else if (val.oilGrade == 4) {
			val.oilGrade = '国四';
		} else if (val.oilGrade == 5) {
			val.oilGrade = '国五';
		} else if (val.oilGrade == 6) {
			val.oilGrade = '国六';
		} else {
			val.oilGrade = '';
		}
		tableBody += '<div class="form-row oilComment" id="'+ val.buCartId +'">';
		tableBody += '<div class="product-box row mt-3 m-0 p-0 col-12 pb-2">';
		tableBody += '<p class="product-ckb mt-3 col-1 p-0">';
		tableBody += '<em class="product-em check2"></em></p>';
		tableBody += '<div class="product-sx col-3 pr-0">';
		tableBody += '<img src="'+ val.logoUrl +'" class="rounded-circle product_img" /></div>';
		tableBody += '<div class="col-7 p-0">';
		tableBody += '<p class="slogan black">'+ val.type + val.oilGrade + val.no +'#</p>';
		tableBody += '<p class="slogan black oil_name">库存<span class="oilCount maxCount">'+ val.surplus +'</span>吨</p>';
		tableBody += '<ul class="col-12 py-2 row px-0" >';
		var oilPrice = 0;
		$.each(val.tSuOilpriceList, function (index1, value) {
			if (index1 == 0) {
				tableBody += '<li class="col-12 pl-2 pr-0 m-0 oil_name p_item">起售<span class="startVolume  minimumTonnage">'+ value.startVolume +'</span>吨 '
					+ '<span class="oilPrice">'+ value.oilPrice +'</span>元/吨</li>';
			} else {
				tableBody += '<li class="col-12 pl-2 pr-0 m-0 black p_item">>=<span class="startVolume">'+ value.startVolume+'</span>吨 '
					+ '<span class="oilPrice">'+ value.oilPrice +'</span>元/吨</li>';
			}
			if (oilPrice == 0 || (parseInt(val.count) >= parseInt(value.startVolume) && parseFloat(value.oilPrice) < oilPrice)) {
				oilPrice = parseFloat(value.oilPrice);
			}
		});

		tableBody += '</ul>';
		// tableBody += '<p class="col-12 p-0 m-0  pre_price">【VIP2优惠价】立减60元</p>';
		tableBody += '</div>';
		tableBody += '</div>';
		tableBody += '<div class="col-12 m-2 p-0 row buyOil">';

		tableBody += '<input type="hidden" value="'+ oilPrice +'" class="unitPrice">';
		tableBody += '<input type="hidden" value="'+ val.no +'" class="oilNo">';
		tableBody += '<input type="hidden" value="'+ val.oiOilId +'" class="oiOilId">';
		tableBody += '<span class="product-price col-5 text-right orange">¥&thinsp;<span class="price">'+ oilPrice*val.count +'</span></span>';
		tableBody += '<div class="product-amount input-group offset-1 col-6 p-0">';
		tableBody += '<div class="product_gw">';
		tableBody += '<button class="product-jian">-</button>';
		tableBody += '<input type="text" class="product-num text-right" value="'+ val.count +'" oninput = "value=value.replace(/[^\\d]/g,\'\')">';
		tableBody += '<span class="cost">吨</span>';
		tableBody += '<button class="product-add px-1">+</button></div>';
		tableBody += '<input type="hidden" value="'+ val.surplus +'">';
		tableBody += '<input type="hidden" value="'+ val.tSuOilpriceList[0].startVolume +'">';
		tableBody += '</div></div></div>';
	});
	return tableBody;
}

function setCss() {

	//手输的吨数发生变化
	$('.product-num').on('input propertychange', function () {
		var _this = $(this);
		var count = _this.val();
		// var minCount = parseInt(_this.parents('.product').find('.minimumTonnage').text());
		// var maxCount = parseInt(_this.parents('.product').find('.maxCount').text());
        var maxCount = parseInt(_this.parent().next().val());
        var minCount = parseInt(_this.parent().next().next().val());
		// console.log(minCount+":"+maxCount+":"+count);
		if (maxCount < minCount) {
            count = 0;
            _this.val(0);
			toast("库存不足！！！")
		} else if (count < minCount) {
			count = minCount;
            _this.val(minCount);
			toast("不能低于当前吨数！！！")
		} else if (count > maxCount) {
            count = maxCount;
            _this.val(maxCount);
			toast("不能大于当前吨数！！！")
		}
		checkPrice(_this, count);
	});

	$(".custom-control-input").click(function() {
		console.log($(this).prop("checked"))
	});
	$(".getBack").click(function(){
		window.location.href = "purchasing.html";
	});
	$(".edit").click(function(){
		if($(".edit").text() == "编辑"){
			$(".edit").text("取消");
			$(".account_box").hide();
			$(".delete_box").show();
		}else{
			$(".edit").text("编辑");
			$(".account_box").show();
			$(".delete_box").hide();
		}
	});

	$(".check").click(function(){
		var _this = $(this);
		_this.toggleClass("product-xz");
		if(_this.hasClass("product-xz")) {
			$(".check1").addClass("product-xz");
			$(".check2").addClass("product-xz");
		} else {
			$(".check1").removeClass("product-xz");
			$(".check2").removeClass("product-xz");
		}
		TotalPrice();
	});
	$(".check1").click(function(){
		var _this = $(this);
		if(_this.hasClass("product-xz")) {
			_this.parents(".shop_goods").find(".product-em").removeClass("product-xz")
		} else {
			_this.parents(".shop_goods").find(".product-em").addClass("product-xz");
		}
		IsSelectAll();
		TotalPrice();
	});
	$(".check2").click(function(){
		var _this = $(this);
		_this.toggleClass("product-xz");
		// var objs = _this.parents(".shop_goods").find(".check2");
		var lengths = _this.parents(".shop_goods").find(".check2").length;
		_this.parents(".shop_goods").find(".check2").each( function(index,value) {
			var obj = $(this);
			if(!obj.hasClass("product-xz")){
				_this.parents(".shop_goods").find(".check1").removeClass("product-xz");
				return false;
			}
			if(index == lengths-1){
				_this.parents(".shop_goods").find(".check1").addClass("product-xz");
			}
		});
		IsSelectAll();
		TotalPrice();
	});

	//加的效果
	$(".product-add").click(function() {
		var _this = $(this);
		var n = _this.prev().prev().val();
		var num = parseInt(n) + 1;
        var minCount = parseInt(_this.parents('.product').find('.minimumTonnage').text());
        var maxCount = parseInt(_this.parents('.product').find('.maxCount').text());
        if (num < minCount || num > maxCount) {
			toast("不能大于当前吨数！！！")
            return true;
        }
		_this.prev().prev().val(num);
		checkPrice(_this.prev().prev(), num);
	});
//减的效果
	$(".product-jian").click(function() {
		var n = $(this).next().val();
		var num = parseInt(n) - 1;
        var minCount = parseInt($(this).parents('.product').find('.minimumTonnage').text());
        var maxCount = parseInt($(this).parents('.product').find('.maxCount').text());
        if (num < minCount || num > maxCount) {
			toast("不能低于当前吨数！！！")
            return true;
        }
		$(this).next().val(num);
		checkPrice($(this).next(), num);
	});
//全选产品
	$(".product-al").click(function() {
		var fxk = $(".product-em");
		var qx = $(".product-all em");
		qx.toggleClass("product-all-on");
		if($(this).find(".product-all em").is(".product-all-on")) {
			fxk.addClass("product-xz");
		} else {
			fxk.removeClass("product-xz");
		}
		TotalPrice();
		shuliang()
	});

//删除产品
	$(".product-del").click(function() {
		if(confirm("您确定要删除当前商品？")) {
			$(this).closest(".product-box").remove();
		}
		TotalPrice();
	});

}

function checkPrice(_this, count) {
	if (checkIsSuperInventory(_this)) {
		var startVolume = _this.parents(".buyOil").prev().find('.startVolume');
		var oilPrice = 0;
		$.each(startVolume, function () {
			if (oilPrice == 0 || (parseInt($(this).text()) <= parseInt(count) && parseFloat($(this).next().text()) < oilPrice)) {
				oilPrice = parseFloat($(this).next().text());
			}
		});
		_this.parents(".buyOil").children("input:first-child").val(oilPrice);
		_this.parents(".product-amount").prev().find(".price").text(operation.numMultiply(oilPrice,_this.val()));
		TotalPrice();
	} else {
		toast('库存不足！！！');
	}
}

//判断是否超过库存
function checkIsSuperInventory(_this) {
	var count = _this.parents(".buyOil").prev().find('.oilCount')[0].innerText;
	return  (parseInt(count) - parseInt(_this.val())) >= 0;
}

function choose_all(wrapper, dom) { //全选
    var objs = document.querySelectorAll(dom);
    for(var i = 0; i < objs.length; i++) {
    	if(wrapper.checked == true) {
    		objs[i].checked = true;
    	} else if(wrapper.checked == false) {
    		objs[i].checked = false;
    	}
    }		
}

function IsSelectAll(){
	var lengths =  $(".check1").length;
	$(".check1").each(function(index ,value) {
		var obj = $(this);
		if(!obj.hasClass("product-xz")) {
			$(".check").removeClass("product-xz");
			return false;
		}
		if(index == lengths-1){
			$(".check").addClass("product-xz");
		}	
	})	
}

//计算产品价格
function TotalPrice() {
	//总价
	var total = 0;
	$(".oilComment").each(function() {
		if($(this).find(".check2").hasClass("product-xz")){
			var num = parseFloat($(this).find(".price").text());
			total += num;	
		}
	});
	$("span.total_money").text(total.toFixed(2)); //输出全部总价
}
//获取选择产品数量
function shuliang() {
	$(".product-all-sl").text("");
	var cd = $(".product-xz").length;
	$(".product-all-sl").text(cd);
	
	if(cd > 0) {
		$(".product-all-qx").text("已选");
		$(".all-sl").css("display", "inline-block");
		$(".product-sett").removeClass("product-sett-a");
	} else {
		$(".product-all-qx").text("全选");
		$(".all-sl").css("display", "none");
		$(".product-sett").addClass("product-sett-a");
	}		
}
//购物车空
function koncat() {
	var pic = $(".product-box").length;
	if(pic <= 0) {
		$(".all-price").text("0.00");
		$(".product-all-qx").text("全选");
		$(".all-sl").css("display", "none");
		$(".product-sett").addClass("product-sett-a");
		$(".product-all em").removeClass("product-all-on");
		$(".kon-cat").css("display", "block");
	} else {
		$(".kon-cat").css("display", "none");
	}		
}