var begin_info =[];
var end_info =[];
$(".click_btn").click(function(){
	var obj =new Object;
	if($(".contant_name").val()==""){
		toast("请输入联系人");
		return;
	};
	if($(".contant_phone").val()==""){
		toast("请输入电话号码");
		return
	};
	if(mobilePtn.test($(".contant_phone").val())==false){
		toast("电话号码格式不正确");
		return;
	};
	if($(".checke_address")==""){
		toast("请选择地址");
		return;
	}
	if($(".detail_site")==""){
		toast("请输入详细地址");
		return;
	}
	obj.contant_name=$(".contant_name").val();
	obj.contant_phone=$(".contant_phone").val();
	obj.contant_site=$(".checke_address").val();
	obj.detail_site=$(".detail_site").val();
	obj.addressId =get_localStorage("bdDistrictId");
	if(get_localStorage("page_style")=="begin"){
		begin_info.push(obj);
		save_localStorage("begin_info",begin_info);
		
	}else{
		end_info.push(obj);
		save_localStorage("end_info",end_info);
	}
	window.location.href ="physical_want.html"+ '?_r=' + Math.random();
})

