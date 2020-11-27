$(document).ready(function() {
	getOilType();
})
//提交
//var planName = 'zxp计划A';
var tType = 1;
var addressList = [];
var oilArray = [];
//var submitAddrList = [];
// 参数addrList格式
// addrList:购油计划地址数组 格式为 [
// 	{
// 		buAddressId：地址id,
// 		addrOilList：[
// 			{
// 				oiOilId:油id；,
// 				count：油数量,
// 			}, 
// 		]
// 	},			
// 	{
// 		buAddressId：地址id；
// 		addrOilList：[
// 			{
// 				oiOilId:油id；,
// 				count：油数量
// 			},
// 		]
// 	},
// ] 
var submitFlag = true; //是否去提交
/*$(".save").click(function(){
	//组装数据
	var addrList = [];
	$.each($(".addr_box").parent().find(".addr_box"),function(index,obj){
		var _this = $(this)
		var arr = creatOilArr(_this);
		if(submitFlag){
			var dict = {
				buAddressId:addressList[index],
				addrOilList:arr
			}
			if(arr.length == 0){
				toast("至少添加一个油号");
				submitFlag = false;
				return;
			}
			addrList.push(dict);
		}else{
			return;
		}
	});
	if(submitFlag){
		if(addrList.length == 0){
			toast("至少添加一个地址");
			return;
		}
		//弹窗输入计划名称
		planName = prompt("请输入计划名称","");
		if(planName == ''){
			toast("计划名不能为空");
			return;
		}else if(planName == null){
			return;
		}
		submitPlan(addrList);
	}
	console.log(addrList);
})*/
$(".save").click(function() {
	//组装数据
	var addrList = [];
	if($(".addr_box").length==0){
		$(this).removeAttr("data-target")
		toast("至少添加一个地址");
		return;
	}
	$.each($(".addr_box").parent().find(".addr_box"), function(index, obj) {
		var _this = $(this)
		var arr = creatOilArr(_this);
		console.log(arr)
		var dict = {
			buAddressId: addressList[index],
			addrOilList: arr
		}
		if($(".oil_box").length==0){
			$(".save").removeAttr("data-target")
			toast("至少添加一个油号");
			return;
		}
		if(arr.length == 0){
			$(".save").removeAttr("data-target")
			return
		}else{
			addrList.push(dict);
		}
	});

	if(addrList!=""){
		$(".save").attr("data-target","#add_planName");
		add_plan(addrList)
	}
	
})
$("#add_planName").on('show.bs.modal',function(){
	setTimeout("$('#plan_name').focus()",500);
})
$(".is_show").on("click",function(){
	var planName =$("#plan_name").val();
	if(planName==""){
		$(this).removeAttr("data-dismiss");
	}else{
		$(this).attr("data-dismiss","modal");
	}
});

function add_plan(list){
	var addrList =list;
	$(".is_show").click(function(){
		var planName =$("#plan_name").val()
		if(planName==""){
			toast("计划名不能为空");
			return
		}else{
			submitPlan(addrList,planName);
		}
		
	})
}


function creatOilArr(obj) {
	var tampArr = [];
	var allOilArr = obj.find(".oil_box");
	$.each(allOilArr, function(index, obj1) {
		var _this = $(this)
		var str_oilId = _this.find(".first_btn").attr("id");
		var str_count = _this.find("input").val();
		if(strIsNULL(str_count)) {
			toast("请输入购油的数量");
			tampArr = [];
			return;
		} else {
			var num_count = parseFloat(_this.find("input").val());
			if(!isContentOilId(str_oilId, num_count, tampArr)) {
				var tampDict = {
					oiOilId: str_oilId,
					count: num_count
				};
				tampArr.push(tampDict);
			}
		}
	})
	return tampArr;
}

function isContentOilId(oilId, count, tampArr) {
	for(var i = 0; i < tampArr.length; i++) {
		var dic = tampArr[i];
		if(oilId == dic["oiOilId"]) {
			dic["count"] += count;
			return true;
		};
	};
	return false;
}

function submitPlan(list,planName) {
	var url = re_url(methods.addBuyOilPlan);
	var data = {
		name: planName,
		transType: tType,
		addrList: list
	};
	console.log(data);
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			var obj = response["data"];
			window.location.href="shopping_plan.html";
		}
	}
	util.post_ajax(url, data, success)
}

function creatAddressList(list) {
	if(list.length > 0 ) {
		var htmlStr = '';
		$.each(list, function(index, item) {
			htmlStr += '<div class="address_item border-bottom pb-2 py-2" data-dismiss="modal" aria-label="Close">';
			htmlStr += '<p class="detail_address font_5" id="' + item["buAddressId"] + '">' + item["addressName"] + '</p>';
			htmlStr += '<p class="contact font_1 text-muted">';
			htmlStr += '<span class="name">' + item["contactName"] + '</span>';
			htmlStr += '<span class="phone px-2">' + item["contactPhone"] + '</span>';
			htmlStr += '</p></div>'
		});
		return htmlStr;
	}
	return false;
}
$(document).on("click", ".address_item", function() {
	var str_address = $(this).find(".detail_address").text();
	var str_name = $(this).find(".name").text();
	var str_phone = $(this).find(".phone").text();
	var str_addId = $(this).find(".detail_address").attr("id");
	//判断是否已经存在地址
	if(!isContentAddrId(str_addId)) {
		chooseAddress(str_address, str_name, str_phone, str_addId);
	}
})

function isContentAddrId(addressId) {
	if($.inArray(addressId, addressList) == -1) {
		return false;
	} else {
		return true;
	}
}

function chooseAddress(addr, name, phone, addId) {
	var htmlStr = '<div class="container wite_bg mt-1 pb-2 addr_box">';
	htmlStr += '<div class="row pt-3 pb-2" id="addr_box_1">';
	htmlStr += '<span class="col-2 fa fa-map-marker orange icon"></span>';
	htmlStr += '<p class="site_name col-7 px-0 font_4 border-right mt-2">' + addr + '</p>';
	htmlStr += '<div class="col-3 text-center orange add_oil">';
	htmlStr += '<span class="fa fa-plus-circle font_5"></span>';
	htmlStr += '<p class="font_1">添加油品</p>';
	htmlStr += '</div></div></div>';
	$(".public_bg").append(htmlStr);
	//添加一个地址
	addressList.push(addId);
}
$(document).on("click", ".add_oil", function() {
	var root = $(this).parents("#addr_box_1");
	var selectOilNum = root.find(".oil_box").length;
	if(selectOilNum < oilArray.length) {
		var htmlStr = '<div class="row oil_box mx-0 mt-2 ">';
		htmlStr += '<div class="dropdown col-5" id="oil_list ">';
		htmlStr += '<button class="btn  border dropdown-toggle first_btn ml-2" type="button" id="bef5ce4caa0611e9aec5d8c4979bc84b" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">92#</button>';
		htmlStr += '<div class="dropdown-menu p-0" aria-labelledby="dropdownMenu2" style="min-width:100%;">'
		$.each(oilArray, function(index, item) {
			htmlStr += '<button class="dropdown-item text-center border-bottom " type="button" id="' + item["oiOilId"] + '">' + item["no"] + '#' + '</button>';
		});
		htmlStr += '</div>';
		htmlStr += '</div>';
		htmlStr += '<input type="text" class="col-5 offset-1 form-control border border_2" placeholder="单位（吨）" onInput="clearNoNum(this)" style="height: 1.5rem;margin-top:3px" />';
		htmlStr += '</div>';
		root.append(htmlStr);
	}
})
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
//获取地址
function getAddressList() {
	var url = re_url(methods.getBuyerAddressListUnPage);
	var data = {};
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			var obj = response["data"];
			$("#address_items").html(creatAddressList(obj));
			for(var i=0;i<obj.length;i++){
				var ids =$(".detail_address").eq(i).attr("id");
				if(isContentAddrId(ids)){
					$(".detail_address").eq(i).parent().hide();
				}
			}
			console.log(obj)
		}
	}
	util.get_ajax(url, data, success)
}

function gg(dom) {
	if($(dom).prop('checked') == true && $(dom).attr("id") == 0) {
		$(".site_title").text("添加自提地址");
		
		//				alert("您选择的是自提")
		tType = 1;
	} else if($(dom).prop('checked') == true && $(dom).attr("id") == 1) {
		//				alert("您选择的是物流")
		$(".site_title").text("添加配送地址");
		tType = 0;
	}
	return;
}
$(document).on("click", ".dropdown-menu .dropdown-item", function() {
	$(this).parent().prev().text($(this).text())
	$(this).parent().prev().removeAttr("id");
	$(this).parent().prev().attr("id", $(this).attr("id"));

})
// $("#address_box_").click(function(){
// 	alert(44);

// })
$('#address_box_').on('show.bs.modal', function(e) {
	getAddressList();
})
// $(".dropdown-menu .dropdown-item").click(function(){

// })
$("#address_new").click(function() {
	window.location.href = "add_newAddress.html";
})
//		$("#customRadio1").prop('checked');