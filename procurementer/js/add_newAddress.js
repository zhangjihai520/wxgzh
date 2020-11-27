var isDefAddress = 0;
function submitAddress(name,phone,addressId,addDetail){
	var url = re_url(methods.addBuyerAddress);
	var data = {
		bdDistrictId:addressId,
		contactName:name,
		contactPhone:phone,
		detailAddress:addDetail,
		isDefault:isDefAddress
	};
	var success = function(response) {
		if(response['code'] == RETCODE_SUCCESS) {
			var obj = response["data"];
			alert('添加成功');
			page_back();
			sessionStorage.setItem('refresh', 'true');
		}
	}
	util.post_ajax(url, data, success)
}
$("#sub_address").click(function(){
	var str_name = $(".user_name").val();
	var str_phone = $(".phone_num").val();
	var str_address = $(".checke_address").val();
	var str_addressId = '';
	if(!strIsNULL(str_address)){
		str_addressId = get_localStorage('bdDistrictId');
	}
	var str_addressDetail = $(".address_detail").val();
	if(strIsNULL(str_name)||
	   strIsNULL(str_phone)||
	   strIsNULL(str_addressDetail)||
	   strIsNULL(str_address)){
		   alert('请将信息填写完整');
		   return false;
	   }
	if(mobilePtn.test(str_phone) == false){
		toast("电话号码格式不正确");
		return false;
	}
	$(this).attr("disabled", "disabled");
	submitAddress(str_name,str_phone,str_addressId,str_addressDetail);
	setTimeout(function() {
		$(".report_data").removeAttr("disabled")
	}, 500)
})
$("#customSwitch1").click(function(){
	isDefAddress = $(this).is(':checked')?1:0;
})
