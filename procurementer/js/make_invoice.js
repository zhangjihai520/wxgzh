$(function(){
	confirmOrder();
	 getInvocetpltInfo();
})
function confirmOrder() {
	var url = re_url(methods.confirmOrder);
	var data = {
		boOrderId: get_localStorage("boOrderId")
	}
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			console.log(response);
			var datas = response.data;
			$(".order_no").text(datas.orderNo);
			$(".arrive_site").text(datas.tBuAddress.addressName);
			$(".creat_time").text(timestampToTime(datas.createTime));
			$(".arrive_time").text(timestampDay(datas.reqEndTime));
			$(".total_money").text(datas.totalPrice + "元");
			$.each(datas.oilList, function(i, v) {
				$(".goods_info").append(shop_detail(v));
			});
		}
	};
	util.get_ajax(url, data, success)
}


function shop_detail(data){//商品明细
	var shop_detail="";
	shop_detail+='<div class="form-row">';
	shop_detail+='<span class="oil_name pr-1">'+data.no+'#'+'</span>';
	shop_detail+='<span class="oil_name pr-1">'+data.count+"吨"+'</span>';
	shop_detail+='<span class="oil_price pr-1">'+'金额：'+(Number(data.count)*Number(data.oilPrice)).toFixed(2)+'元'+'</span>';
	shop_detail+='</div>';
	return shop_detail;
}

function getInvocetpltInfo(){//获取信息
	var url =re_url(methods.getInvocetpltInfo);
	var data={
		buInvoiceTpltId:get_localStorage("buInvoiceTpltId"),
	}
	var success =function(response){
		if(response.code==RETCODE_SUCCESS){
			var datas =response.data;
			console.log(datas)
			$(".company_name").text(datas.invoiceTitle);
			$(".uscc").text(datas.uscc);
			$(".email").val(datas.email);
			$(".phone_num").val(datas.phoneNumber);
		}
	};
	util.get_ajax(url,data,success)
}

function addInvoice(){//申请开票
	var email=$(".email").val().trim();
	var phone_num =$(".phone_num").val().trim();
	var user_name =$(".user_name").val().trim();
	if(email=="" || phone_num=="" || user_name==""){
		toast("请将信息填写完整");
		return;
	}
	if(mobilePtn.test(phone_num)==false){
		toast("请正确填写电话号码");
		return;
	}
	if(mail.test(email)==false){
		toast("请正确填写邮箱地址");
		return;
	}
	var url =re_url(methods.addInvoice);
	var data ={
		boOrderId:get_localStorage("boOrderId"),
		buInvoiceTpltId:get_localStorage("buInvoiceTpltId")
	};
	var success =function(response){
		if(response.code==RETCODE_SUCCESS){
			alert("开票成功");
			remove_localStorage("buInvoiceTpltId");
			window.location.href= 'all_orders.html' + '?_r=' + Math.random();
		}
	}
	util.get_ajax(url,data,success)
}

$(".make_invoice").click(function(){
	addInvoice();
})
