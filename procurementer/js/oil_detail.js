var clickType = 0;
var buAddressId = get_localStorage("buAddressId");
var oilNum = 0;
var maxOilNum = 0;

$(function () {
    // 加载资源列表数据
    
    loadResourceData(buildCondData());
	
    if (null != buAddressId && buAddressId != '') {
        $(".click_arive").show();
    }

    $('#exampleModalCenter').on('show.bs.modal', function (event) {
        $("#oilNum").val(oilNum);
        if (clickType == 2) {
            $("#purchaseNow").show();
            $("#addShoppingTips").hide();
        } else {
            $("#purchaseNow").hide();
            $("#addShoppingTips").show();
        }
    });
	$(".top_icon").click(function(){
		sessionStorage.setItem('refresh', 'true');
	})
    //手输的吨数发生变化
    $('#oilNum').on('input propertychange', function () {
        var _this = $(this);
        var count = _this.val();
        if (oilNum > maxOilNum) {
            _this.val(0);
            toast("库存不足！！！");
        } else if (count < oilNum) {
            _this.val(oilNum);
            toast("不能低于当前吨数！！！")
        } else if (count > maxOilNum) {
            _this.val(maxOilNum);
            toast("不能大于当前吨数！！！")
        }

    });
    //加
    $("#addNum").click(function () {
        var num = parseInt($("#oilNum").val());
        if (num < maxOilNum) {
            $("#oilNum").val(num+1);
        } else {
            toast("不能大于当前吨数！！！")
        }
    });
    //减
    $("#deleteNum").click(function () {
        var num = parseInt($("#oilNum").val());
        if (num > oilNum) {
            $("#oilNum").val(num-1);
        } else {
            toast("不能低于当前吨数！！！")
        }
    });

    $(".add_buy").click(function () {
        clickType = 1;
    });

    $(".now_buy").click(function () {
        clickType = 2;
    });



});

// 构造查询条件数据
function buildCondData() {
    var cond = {};
    cond["oiOilId"] = get_localStorage("oiOilId");
    // cond["oiOilId"] = "bef5ce4caa0611e9aec5d8c4979bc84b";
    cond["osOilstoreId"] = get_localStorage("osOilstoreId");
    // cond["osOilstoreId"] = "0d45935163b64985805a39f2d3a695dd";
    cond["buAddressId"] = buAddressId;
    return cond;
}
// 加载资源列表数据
function loadResourceData(conditionData) {
    // ajax加载账户表格数据
    ajaxRequest(api + "t/os/oilstore/getOilSupermarketDetail",
        conditionData, false,
        function (result) {
            var arr = result.data;
            console.log(arr)
            $(".terminalName").text(arr.name);
            $(".surplus").text("库存量"+arr.tOiOil.surplus+"吨");
            $(".buy_rate").text(arr.repeatPurRate+"%");
            $("#detailsAddress").text(arr.detailsAddress);
            $("#recentDealCount").text(arr.recentDealCount + "单");
            $("#recentPutInCount").text(arr.recentPutInCount+"吨");
            $("#perCapitaCount").text(arr.perCapitaCount+"吨");
            $(".unit_tranPrice").text(arr.tranUnitPrice+"元/公里 /吨");
            $("#addressName").text(arr.addressName);
            save_localStorage("buAddressName", arr.addressName);
            $("#distance").text(arr.distance+"km");
            /*var price = parseInt(arr.distance)*parseInt(arr.tranUnitPrice);
            var price = operation.numMultiply(arr.distance, arr.tranUnitPrice)
            $(".unit_num").text(price+"元/吨");*/
            var oilType = '';
            maxOilNum = arr.tOiOil.surplus;
            if (arr.tOiOil.type == 0) {
                oilType = '汽油';
            } else {
                oilType = '柴油';
            }
            $("#oilPrice").html(buildTableBody(arr.tSuOilprices));
            if (arr.tSuOilparams.length > 0) {
                $("#oilType").text(oilType + getOilGrade(arr.tSuOilparams[0].oilGrade) + arr.tOiOil.no +"#");
                getOilParams(arr.tSuOilparams[0]);
            } else {
                $("#oilType").text(oilType + arr.tOiOil.no +"#");
            }

            //立即支付
            $("#purchaseNow").click(function () {
                var num = $("#oilNum").val();
                num = $.trim(num);
                if (!num || num.length == 0|| num == 0) {
                    toast("请选择数量！");
                    return;
                } else if (num > maxOilNum) {
                    toast("库存不足！！！");
                    return;
                } else {
                    save_localStorage("num", parseInt(num));
                    var oilPrice = 0;
                    var no = arr.tOiOil.no;
                    var startVolume = 0;
                    $.each(arr.tSuOilprices, function (index, value) {
                        if (value.startVolume <= num && (oilPrice == 0 || (value.startVolume <= num && value.startVolume > startVolume))){
                            console.log(value.startVolume +":" +num);
                            oilPrice = value.oilPrice;
                            startVolume = value.startVolume;
                        }
                    });
                    if (oilPrice == 0) {
                        toast('您选择的吨数未达到最低出售要求！！！');
                        return;
                    }
                    var oilDepot = [{
                        "boOilList":[
                            {
                                "oiOilId": get_localStorage("oiOilId"),
                                "oilPrice": oilPrice,
                                "count": num,
                                "no": no
                            }
                        ],
                        "name":arr.name,
                        "url": arr.logoUrl,
                        "osOilStoreId":arr.osOilstoreId
                    }];
                    save_localStorage("oilDepot", oilDepot);
                    window.location.href = 'comfirm_orders.html?_r=' + Math.random();
                }
            });

            //加入购物车
            $("#addShoppingTips").click(function () {
                var num = $("#oilNum").val();
                num = $.trim(num);
                if (!num || num.length == 0 || num == 0) {
                    toast("请选择数量！");
                    return;
                } else if (num > maxOilNum) {
                    toast("库存不足！！！");
                    return;
                } else {
                    var url = re_url(methods.addCartInfo);
                    var data = {
                        "osOilStoreId":arr.osOilstoreId,
                        "oiOilId":get_localStorage("oiOilId"),
                        "count":num
                    };
                    var success = function(response) {
                        window.location.href = 'shopping_cart.html?_r=' + Math.random();
                    };
                    util.post_ajax(url, data, success);
                }
            });

        }, "get");
}

//去购物车
$("#comeShopping").on('click', function () {
    window.location.href = 'shopping_cart.html?_r=' + Math.random();
});

//油参赋值
function getOilParams(tData) {
    $("#oilSource").text(tData.oilSource);
    $("#oilGrade").text(getOilGrade(tData["oilGrade"]));
    $("#carDensity").text(tData["carDensity"]);
    $("#boilingRange").text(tData["boilingRange"]);
    $("#sulfur").text(tData["sulfur"]);
    $("#arene").text(tData["arene"]);
    $("#alkene").text(tData["alkene"]);
    $("#benzene").text(tData["benzene"]);
    $("#colloid").text(tData["colloid"]);
    $("#color").text(tData["color"]);
}

function getOilGrade(oilGrade) {
    var name = '';
    if (oilGrade == 1) {
        name = "国一";
    } else if (oilGrade == 2) {
        name = "国二";
    } else if (oilGrade == 3) {
        name = "国三";
    } else if (oilGrade == 4) {
        name = "国四";
    } else if (oilGrade == 5) {
        name = "国五";
    } else {
        name = "国六";
    }
    return name;
}

// 构造账户表格body内容
function buildTableBody(tData) {
    var tableBody = "";
    $.each(tData, function (index, val) {
        tableBody += buildTableRow(val);
    });
    return tableBody;
}

// 构造账户表格行内容
function buildTableRow(rowData) {
    var user_row = '<div class="price_item font_1 m-0 p-0 mr-2 mt-2">';
    user_row += '<p class="font_1 my-1"><span class="price">'+ rowData["oilPrice"] +'</span>元/吨</p>';
    user_row += '<p class="font_1 my-1"><span class="">'+ rowData["startVolume"] +'</span>吨起售</p></div>';
    if (oilNum == 0 || rowData["startVolume"] < oilNum) {
        oilNum = rowData["startVolume"];
    }
    return user_row;
}

$("#go_price").on("click",function(){
	if(get_localStorage("osOilstoreId")==null || get_localStorage("oiOilId")==null){
		return;
	}else{
		go_page("trans_price.html")
	}
	
})
// page_change(".modal_btn","comfirm_orders.html");