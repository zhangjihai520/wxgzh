var noArr = []; //油枪数组
var imgArr = []; //图片数组
var gunLen; //初始长度
var imgLen;
var gunIdArr = []; //油枪id数组
var imgIdArr=[];//图片id数组
var len1;
var len2;
$(function() {
	getOnSiteDetail(function(gun,img) {
		gunLen = gun;
		len1=gun;
		imgLen =img;
		len2=img;
		return gunLen,imgLen;
	});
})

function getOnSiteDetail(callback) {
	var url = re_url(methods.getOnSiteDetail);
	var data = {
		onSiteId: get_localStorage("onSiteId")
	}
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			console.log(datas)
			show_info(datas);
			$(".phoneNumber").val(datas.phoneNumber);
			$.each(datas.tOnSiteGuns, function(i, v) {
				var html = '<text class="col-2 oil_gun p-1 ml-1 mb-1" id="' + v.onSiteGunId + '" onclick="delGun(this)">' + v.gunNo + "号油枪" + '</text>';
				$(".addBox").prepend(html);
			})
			$.each(datas.tOnSiteImages, function(i, v) {
				var picHtml = "<div class='imageDiv' id='"+v.onSiteImageId+"'> <img  src='" + v.imageUrl + "'/> </div>";
				$(".imgBox").append(picHtml);
			});
			var gunLen = datas.tOnSiteGuns.length;
			var imgLen =datas.tOnSiteImages.length;
			callback(gunLen,imgLen)
		}
	}
	util.get_ajax(url, data, success)
}

function updateOnSite() {
	var url = re_url(methods.updateOnSite);
	var data = get_data();
	console.log(data)
	var success = function(response) {
		console.log(response)
		if(response.code == RETCODE_SUCCESS) {
			alert("修改成功");
			page_back();
			sessionStorage.setItem('refresh', 'true');
			remove_localStorage("map_type");
			$(".add_btn").removeAttr("disabled");
		} else {
			toast(response.message);
			$(".add_btn").removeAttr("disabled");
		}
	}
	util.post_ajax(url, data, success)
}
$(".add_btn").click(function() { //修改
	$(this).attr("disabled", "disabled");
	updateOnSite();
})

function get_data() {
	var code = {};
	var name = $(".name").val();
	name = $.trim(name);
	if(name == "") {
		toast("加油站名称不能为空");
		return;
	};
	var phoneNumber =$(".phoneNumber").val();
	if(phoneNumber == "") {
		toast("电话号码不能为空");
		setTimeout(function() {
			$(".add_btn").removeAttr("disabled")
		}, 100)
		return;
	};
	if(mobilePtn.test(phoneNumber) == false) {
		$(".phoneNumber").focus();
		toast("电话号码格式不正确");
		return;
	}
	var checke_address = $(".checke_address").val();
	checke_address = $.trim(checke_address);
	if(checke_address == "") {
		$(".checke_address").val("");
		toast("选择加油站地区");
		return;
	};

	if(get_localStorage('lngX') == undefined || get_localStorage('latY') == undefined || $(".place_site").val() == "") {
		toast('请选择加油站经纬度');
		return;
	};
	var address = $(".checke_detail").val();
	address = $.trim(address);
	if(address == "") {
		toast("输入详细地址(街道/门牌号)");
		return;
	};
	var info_select = $(".custom-select").children('option:selected').val();
	if(info_select == "") {
		toast('请选择加油站类型');
		return;
	};
	if(noArr.length < 1 && gunIdArr.length==len1) {
		toast('请添加加油枪');
		setTimeout(function() {
			$(".add_btn").removeAttr("disabled")
		}, 100)
		return;
	}
	if(imgArr.length < 1 && imgIdArr.length==len2) {
		toast('请添加加站图片');
		setTimeout(function() {
			$(".add_btn").removeAttr("disabled")
		}, 100)
		return;
	}
	
	code["name"] = name;
	code["address"] = address;
	code["latitude"] = get_localStorage('latY');
	code["longitude"] = get_localStorage('lngX');
	code["type"] = info_select;
	code["bdDistrictId"] = get_localStorage("bdDistrictId");
	code["onSiteId"] = get_localStorage("onSiteId");
	code["stringTOnSiteGuns"] = noArr;
	code["stringImageList"] = imgArr;
	code["phoneNumber"]=phoneNumber;
	code["tOnSiteGuns"]=gunIdArr;
	code["tOnSiteImages"]=imgIdArr
	return code;
}

function show_info(data) {
	if(get_localStorage("station_name") == null) {
		$(".name").val(data.name);
	} else {
		$(".name").val(get_localStorage("station_name"))
	}

	if(get_localStorage("map_type") == "1" || get_localStorage("map_type") == null) {
		$(".place_site").val("经度：" + data.longitude + '  ' + "纬度：" +data.latitude );
		$(".checke_address").val(data.detailAddress);
		$(".checke_detail").val(data.address);
		save_localStorage("bdDistrictId", data.bdDistrictId);
		save_localStorage("lngX", data.longitude);
		save_localStorage("latY", data.latitude);
	} else {
		$(".checke_address").val(get_localStorage("provinces") + get_localStorage("city") + get_localStorage("area"));
		$(".place_site").val('经度:' + get_localStorage('lngX') + '  ' + '纬度:' + get_localStorage('latY'));
		$(".checke_detail").val(get_localStorage("map_detail"));
	}

	var select_obj = $(".custom-select").children('option')
	for(var i = 0; i < select_obj.length; i++) {
		if(select_obj[i].value == data.type) {
			select_obj[i].selected = true
		}
	}
}

$(".name").blur(function() {
	save_localStorage("station_name", $(this).val())
})

$(".top_icon").on("click", function() {
	remove_localStorage("map_type");
	page_back();
})

/*加油枪*/
var n = 0;

function addGun(obj) {
	var oilLength =$(".oil_gun").length; 
	if(oilLength==0){
		gunLen=0;
	}
	$(".addBox").prepend(gunHtml(gunLen + 1));
	var obj = new Object;
	obj.gunNo = gunLen + 1;
	noArr.push(obj);
	gunLen = gunLen + 1;
//	console.log(noArr)
	return gunLen, noArr;
}

function gunHtml(num) {
	var html = '<text class="col-2 oil_gun p-1 ml-1 mb-1" onclick="delGun(this)" data-num="' + num + '">' + num + "号油枪" + '</text>';
	return html;
}

function delGun(obj) {
	var id = $(obj).attr("id"),
		num = $(obj).attr("data-num"),
		arr = []
	$(obj).remove();
	var obj = new Object;
	if(id) {
		obj.onSiteGunId = id;
		gunIdArr.push(obj)
	} else {
		obj.gunNo =num;
		for(var i=0;i<noArr.length;i++){
			if(noArr[i].gunNo==num){
				var index =noArr.indexOf(noArr[i]);
				noArr.splice(index, 1); 
			}
		}
	}
	return gunIdArr, noArr
}

$(".text-detail").click(function() {
	$("#fileInput").click()
})
$(".file").change(function() {
	//获取选择图片的对象
	var docObj = $(this)[0];
	var picDiv = $(this).parents(".picDiv");
	var fileList = docObj.files;
	//循环遍历
	for(var i = 0; i < fileList.length; i++) {
		//动态添加html元素
		var picHtml = "<div class='imageDiv'> <img id='img" + fileList[i].name + "' /> </div>";
		$(".imgBox").append(picHtml);
		//获取图片imgi的对象
		var imgObjPreview = document.getElementById("img" + fileList[i].name);
		if(fileList && fileList[i]) {
			//图片属性
			imgObjPreview.style.display = 'inline-block';
			imgObjPreview.style.width = '100%';
			imgObjPreview.style.height = '100%';
			//			imgArr.push(docObj.files[i]);
			//IE以外浏览器
			imgObjPreview.src = window.URL.createObjectURL(docObj.files[i]); //获取上传图片文件的物理路径;
			photoCompress(docObj.files[i], {
				quality: 0.1
			}, function(base64) {
				imgArr.push(base64);
				console.log(imgArr);
			})
		}
	}
	return imgArr;
});
$(".picDiv").on("click", ".imageDiv", function() {
	var imgId =$(this).attr("id");
	var obj = new Object;
	if(imgId){
		obj.onSiteImageId=imgId;
		imgIdArr.push(obj);
		imgLen =imgLen-1;
	}else{
		var index = $(this).index();
		imgArr.splice(index-imgLen, 1);
		$("#fileInput").val("");
	}
	$(this).remove();
return imgLen,imgIdArr,imgArr;
})

