function addInvocetplt(){//添加发票
	var url =re_url(methods.addInvocetplt);
	var user_name= $(".user_name").val();
	user_name = $.trim(user_name);
	if(user_name==""){
		toast("请输入公司名称");
		return;
	}
	//统一社会信用代码
	var uscc = $(".uscc").val();
	uscc = $.trim(uscc);
	if(uscc == "" ||social.test(uscc)==false) {
		toast("请输正确入信用代码");
		return;
	}
	
	var address_detail = $(".address_detail").val();
	address_detail = $.trim(address_detail);
	if(address_detail == "") {
		toast("请输入详细地址");
		return;
	};
	var phone_num = $(".phone_num").val();
	phone_num = $.trim(phone_num);
	if(phone_num == "" ||mobilePtn.test(phone_num)==false) {
		toast("请输入正确电话号码");
		return;
	};
	var bankName = $(".bankName").val();
	bankName = $.trim(bankName);
	if(bankName == "") {
		toast("请输入开户银行名称");
		return;
	};
	var bankAccount = $(".bankAccount").val();
	bankAccount = $.trim(bankAccount);
	if(bankAccount == "") {
		toast("请输入对公账户账号");
		return;
	};
	if(bank_code.test(bankAccount) == false) {
		$("#bankAccount").focus();
		toast("请正确输入对公账户账号");
		return;
	}
	var email = $(".email").val();
	email = $.trim(email);
	if(email == "" ||mail.test(email)==false) {
		toast("请输入正确邮箱地址");
		return;
	};
	var data ={
		"invoiceTitle":user_name,
		"uscc":uscc,
		"regAddr":address_detail,
		"phoneNumber":phone_num,
		"bankName":bankName,
		"bankAccount":bankAccount,
		"email":email
	};
	var success =function(response){
		console.log(response);
		if(response.code==RETCODE_SUCCESS){
			alert("添加成功！");
			page_back();
			sessionStorage.setItem('refresh', 'true');
		}
	}
	util.post_ajax(url,data,success);
}


$("#sub_address").click(function() {
	$(this).attr("disabled", "disabled");
	addInvocetplt();
	setTimeout(function() {
		$("#sub_address").removeAttr("disabled")
	}, 500)
})

