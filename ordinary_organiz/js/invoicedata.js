$(function () {
  var money =get_localStorage("savePrice");
 	$('.text2').text(money);
 	getInvocetpltInfo();
 	$("#buttonstyle").click(function(){
 		 applyInvoice()
 	})
});

function getInvocetpltInfo(){//获取信息
	var url =re_url(methods.getCpInvoceTpltInfo);
	var data={
		cpInvoiceTpltId:get_localStorage("buInvoiceTpltId"),
	}
	var success =function(response){
		if(response.code==RETCODE_SUCCESS){
			var datas =response.data;
			console.log(datas)
			if(datas==""){
				toast("无数据");
				return;
			};
			$(".invoiceTitle").val(datas.invoiceTitle);
			$(".uscc").val(datas.uscc);
			$(".phoneNumber").val(datas.phoneNumber);
			$(".email").val(datas.email);
			
		}
	};
	util.get_ajax(url,data,success)
};

function applyInvoice(){//申请开票
	if($(".content_name").val()==""){
		toast("请输入收件姓名");
		return
	};
	if($(".phoneNumber").val()==""){
		toast("请输入短信接收电话");
		return
	};
	if($(".email").val()==""){
		toast("请输入邮箱地址");
		return
	};
	
	if(mail.test($(".email").val())==false){
		toast("邮箱格式错误");
		return
	}
	if(mobilePtn.test($(".phoneNumber").val())==false){
		toast("电话号码格式错误");
		return
	}
	var url =re_url(methods.applyInvoice);
	var data={
		"amount":get_localStorage("savePrice"),
		"cpInvoiceTpltId":get_localStorage("buInvoiceTpltId")
	};
	var success=function(response){
		if(response.code==RETCODE_SUCCESS){
			alert("申请成功");
			page_back();
			sessionStorage.setItem('refresh', 'true');
		}else{
           	  	toast(response.message);
        	 }
	};
	util.post_ajax(url,data,success)
}
