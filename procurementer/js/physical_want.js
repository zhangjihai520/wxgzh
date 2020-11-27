$(function() {
	get_site();
	remove_localStorage("page_style");
	remove_localStorage("order_info");
	
});
save_localStorage("pyscial_price","false")
$(document).on("click", ".add_oil", function() {
	 $(".fontIcon").hide();
	 save_localStorage("pyscial_price","false");
	if($("#begin").val() == "" || $(".b_siteId").text() == "") {
		toast("请选择填写起始地址")
		return;
	};
	if($("#end").val() == "" || $(".e_siteId").text() == "") {
		toast("请选择填写终点地址")
		return;
	};
	$(".account_box").show();
	var item_content = oil_item();
	$(".oil_box").append(item_content);
	$(".oil_num").on("input", function() {
		
		phsical_price(get_cond());
		
	})
//	phsical_price(get_cond())
})
var switchs =true;
$(document).on("click",".compile",function(e){
	 $(".fontIcon").toggle();
	
})
$(document).on("click", ".add", function() { //加1
	var num = parseInt($(this).parent().prev(".oil_num").val());
	console.log(num)
	$(this).parent().prev(".oil_num").val(num + 1);
	phsical_price(get_cond())
});
$(document).on("click", ".lose", function() {
	var num = parseInt($(this).parent().next(".oil_num").val());
	if(num > 0) {
		$(this).parent().next(".oil_num").val(num - 1);
	}
	phsical_price(get_cond())
})
$(document).on("click", ".fontIcon", function() {
	 save_localStorage("pyscial_price","false");
	$(this).parent().parent().remove();
	phsical_price(get_cond());
	if($(".oil_num").length==0){
		$(".account_box").hide();
	}
})



function oil_item() {
	var oil_item = "";
	oil_item += '<div class="form-row font_2 text-center mt-2 item_box">';
	oil_item += '<div class="col-1 pr-0 pt-2" >';
	oil_item += '<span class=" wite_bg fa fa-minus-circle text-danger font_4 border-0 fontIcon"></span>';
	oil_item += '</div>';
	oil_item += '<div class="col-5 type_box border-bottom" >';
	oil_item += '<div class="input-group input-group-sm">';
	oil_item += '<input type="text" class="form-control text-center font_weight font_1 oil_type" placeholder="请输入">';
	oil_item += '</div></div>';
	oil_item += '<div class="col-5 border-bottom">';
	oil_item += '<div class="input-group input-group-sm">';
	oil_item += '<div class="input-group-prepend">';
	oil_item += '<span class="input-group-text wite_bg font_5 border-white lose">' + '-' + '</span>';
	oil_item += '</div>';
	oil_item += '<input type="text" class="form-control text-center font_weight font_1 oil_num" value="0" oninput="clearNoNum(this)">';
	oil_item += '<div class="input-group-prepend">';
	oil_item += '<span class="input-group-text wite_bg font_5 border-white add">' + '+' + '</span>';
	oil_item += '</div>';
	oil_item += '</div></div>';
	oil_item += '</div>';
	return oil_item;
}
laydate.render({
	elem: '#hello1',
	showBottom: false,
	trigger: 'click',
	theme: 'molv',
	min: current_day(),
	max: '2900-10-01',
	done: function(value, date) {
		$("#hello2").val("");
		$('.arrive_time').remove();
		$(".e_box").prepend('<input type="text" class="form-control arrive_time" readonly="readonly" placeholder="要求送达时间" id="hello2">')
	}
});
$(document).on("click", "#hello2", function(event) {
	var dates = $("#hello1").val();
	var min_day = getDay(dates, 3);
	var max_day = getDay(dates, 7);
	console.log(getDay(dates, 3))
	if(dates == "") {
		toast("请先选择开始时间");
		return false;
	}
	laydate.render({
		elem: '#hello2',
		showBottom: false,
		trigger: 'click',
		theme: 'molv',
		min: min_day,
		max: max_day,
		show: true
	});
	event.stopPropagation()
})


$(".inputs").click(function() {
	var page_style = $(this).attr("id");
	save_localStorage("page_style", page_style);
	window.location.href = "physical_site.html" + '?_r=' + Math.random();
})

function get_site() {
	var begin_info = JSON.parse(get_localStorage("begin_info"));
	var end_info = JSON.parse(get_localStorage("end_info"));
	if(begin_info == null) {
		//		toast("请选择填写起始地址");
		return;
	} else {
		$("#begin").val(begin_info[0].contant_site + begin_info[0].detail_site);
		$(".b_name").text(begin_info[0].contant_name);
		$(".b_phone").text(begin_info[0].contant_phone);
		$(".b_siteId").attr("id", begin_info[0].addressId);
		$(".b_siteId").text(begin_info[0].detail_site);

	};
	if(end_info == null) {
		toast("请选择填写终点地址");
		return;
	} else {
		$("#end").val(end_info[0].contant_site + end_info[0].detail_site);
		$(".e_name").text(end_info[0].contant_name);
		$(".e_phone").text(end_info[0].contant_phone);
		$(".e_siteId").attr("id", end_info[0].addressId);
		$(".e_siteId").text(end_info[0].detail_site);
	};
}

function get_cond() { //物流价格所需的数据
	var cond = {};
	var num = 0;
	
	if($("#begin").val() == "" || $(".b_siteId").text() == "") {
		return;
	};
	if($("#end").val() == "" || $(".e_siteId").text() == "") {
		return;
	};
	$.each($(".oil_num"), function(i, v) {
		num += Number(v.value)
	});
	cond["beginDistrictId"] = $(".b_siteId").attr("id");
	cond["beginAddress"] = $(".b_siteId").text();
	cond["endDistrictId"] = $(".e_siteId").attr("id");
	cond["endAddress"] = $(".e_siteId").text();
	cond["totalOilCount"] = num;
	return cond;
}

function phsical_price(datas) { //获取物流价格
	var url = re_url(methods.getTwoPlaceTranPrice);
	var data = datas;
	if(data == undefined) {
		return;
	}
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			$(".tran_money").text(datas.tranPrice);
			 save_localStorage("pyscial_price","true");
		}
	};
	util.post_ajax(url, data, success)
}

function want_data() {
	var want_data = {};
	var num = 0;
	var oil_arr = [];
	if($("#begin").val() == "" || $(".b_siteId").text() == "") {
		return;
	};
	if($("#end").val() == "" || $(".e_siteId").text() == "") {
		return;
	};
	if($(".pick_time").val() == "") {
		toast("请选择取货时间");
		return;
	};
	if($(".arrive_time").val() == "") {
		toast("请选择送达时间");
		return;
	};
	if($(".tran_money").text() == "0" || $(".tran_money").text() == "") {
		toast("请您选择油品数量");
		return;
	};

	$.each($(".oil_num"), function(i, v) {
		num += Number(v.value)
	});
	var pick_time = time_stamp(".pick_time");
	var arrive_time = time_stamp(".arrive_time");

	var len = $(".oil_num").length;
	for(var i = 0; i < len; i++) {
		var oil_type = $(".oil_num").eq(i).parent().parent().prev(".type_box").find(".oil_type").val();
		var count = $(".oil_num").eq(i).val();
		if(oil_type == "" || count == "0") {
			toast("请将信息填写完整")
			return;
		}
		var obj = new Object;
		obj.commodity = oil_type;
		obj.count = count;
		oil_arr.push(obj);
	}

	want_data["beginDistrictId"] = $(".b_siteId").attr("id");
	want_data["beginAddress"] = $(".b_siteId").text();
	want_data["endDistrictId"] = $(".e_siteId").attr("id");
	want_data["endAddress"] = $(".e_siteId").text();
	want_data["totalOilCount"] = num;
	want_data["pickTime"] = pick_time;
	want_data["arriveTime"] = arrive_time;
	want_data["tToOilList"] = oil_arr;
	want_data["beginContacts"] = $(".b_name").text();
	want_data["beginPhone"] = $(".b_phone").text();
	want_data["endContacts"] = $(".e_name").text();
	want_data["endPhone"] = $(".e_phone").text();
	want_data["amount"] = $(".tran_money").text();
	want_data["b_site_detail"] = $("#begin").val();
	want_data["e_site_detail"] = $("#end").val();
	return want_data;
}

$(".place_order").click(function() {
	console.log(want_data())
	if(want_data() == undefined) {
		toast("请将信息填写完整");
	} else{
		if(get_localStorage("pyscial_price")=="true"){
			save_localStorage("order_info", JSON.stringify(want_data()));
			window.location.href = "physical_comfirm.html" + '?_r=' + Math.random();
		}else{
			toast("物流费计算中...")
		}
		
	}

});

function time_stamp(obj) { //将时间转为时间戳
	var _time = $(obj).val();
	var new_dates = _time.replace(/-/g, '/');
	var crrent_date = new Date(new_dates);
	var time_stamp = crrent_date.getTime();
	return time_stamp
};
$(".back").click(function() {
	remove_localStorage("begin_info");
	remove_localStorage("end_info");
	remove_localStorage("order_info");
});


