var isDefAddress;
getUserAddressDetail();
$("#sub_address").click(function(){
	updateBuyerAddress()
})

function getUserAddressDetail(){//获取地址信息
	var url =re_url(methods.getUserAddressDetail);
	var data={
		buAddressId:get_localStorage("buAddressId")
	}
	var success =function(response){
		if(response.code==RETCODE_SUCCESS){
			var datas =response.data;
			save_localStorage("bdDistrictId",datas.bdDistrictId);
			get_info(datas)
		}
	}
	util.get_ajax(url,data,success)
}

function get_info(data){
	$('.user_name').val(data.contactName);
	$(".phone_num").val(data.contactPhone);
	if(data.provinceName==data.cityName){
		$(".checke_address").val(data.provinceName+data.districtName);
	}else{
		$(".checke_address").val(data.provinceName+data.cityName+data.districtName);
	};
	$(".address_detail").val(data.detailAddress);
	if(data.isDefault==0){
		$("#customSwitch1").prop("checked",false);
		save_localStorage("isDefault",data.isDefault);
	}else{
		$("#customSwitch1").prop("checked",true);
		save_localStorage("isDefault",data.isDefault);
	}
	
}

$("#customSwitch1").click(function(){
		isDefAddress = $(this).is(':checked')?1:0;
		save_localStorage("isDefault",isDefAddress);
	});
	
function updateBuyerAddress(){
	var url =re_url(methods.updateBuyerAddress);
	var data=get_code();
	var success =function(response){
		if(response.code==RETCODE_SUCCESS){
			alert("修改成功");
			page_back();
			sessionStorage.setItem('refresh', 'true');
		}
	}
	util.post_ajax(url,data,success)
}

function get_code(){
	var  code ={};
	var user_name =$('.user_name').val();
	if(user_name==""){
		toast("请输入联系人姓名");
		return;
	};
	var phone_num =$(".phone_num").val();
	if(phone_num==""){
		toast("请输入电话号码");
		return;
	};
	if(mobilePtn.test(phone_num)==false){
		toast("请正确填写电话号码");
		return;
	};
	var checke_address= $(".checke_address").val();
	if(checke_address==""){
		toast("请选择收货地址");
		return;
	};
	var address_detail= $(".address_detail").val();
	if(address_detail==""){
		toast("请输入详细地址");
		return;
	}
	
	code["contactName"]=user_name;
	code["contactPhone"]=phone_num;
	code["detailAddress"]=address_detail;
	code["bdDistrictId"] =get_localStorage("bdDistrictId");
	code["buAddressId"] =get_localStorage("buAddressId");
	code["isDefault"] =get_localStorage("isDefault");
	return code;
}
