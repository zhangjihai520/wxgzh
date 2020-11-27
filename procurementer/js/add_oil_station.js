var noArr = []; //油枪数组
var imgArr = []; //图片数组
$(function() {
	get_lng();
})

function add_station(code) {
	var url = re_url(methods.addOnSite);
	var data = code;
	if(data == undefined) {
		return;
	}
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			alert('添加成功');
			page_back();
			sessionStorage.setItem('refresh', 'true');
			remove_localStorage("addName");
			remove_localStorage("map_type");
		} else {
			toast(response.message);
			$(".add_btn").removeAttr("disabled");
		}
	}
	util.post_ajax(url, data, success)
}

function get_lng() {
	if(get_localStorage("lngX") == null || get_localStorage("latY") == null || get_localStorage("provinces") == null) {
		$(".place_site").val("");
		$(".checke_detail").val("");
	} else {
		$(".checke_address").val(get_localStorage("provinces") + get_localStorage("city") + get_localStorage("area"))
		$(".place_site").val('经度:' + get_localStorage('lngX') + '  ' + '纬度:' + get_localStorage('latY'));
		$(".checke_detail").val(get_localStorage("map_detail"));
		$(".name").val(get_localStorage("addName"));
	}
}

$(".place_site").on("click", function() { //存储名字
	if($(".name").val() != "") {
		save_localStorage("addName", $(".name").val());
	};
	go_page('map.html');
});
$(".top_icon").on("click", function() {
	page_back();
	remove_localStorage("addName");
	remove_localStorage("map_type");
})

function get_data() {
	var code = {};
	var name = $(".name").val();
	name = $.trim(name);
	if(name == "") {
		toast("加油站名称不能为空");
		setTimeout(function() {
			$(".add_btn").removeAttr("disabled")
		}, 100)
		return;
	};
	var phoneNumber = $(".phoneNumber").val();
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
	if(checke_address == "" || get_localStorage('area') == null || get_localStorage("bdDistrictId") == null) {
		$(".checke_address").val("");
		toast("选择加油站地区");
		setTimeout(function() {
			$(".add_btn").removeAttr("disabled")
		}, 100)
		return;
	};
	if(get_localStorage('lngX') == null || get_localStorage('latY') == null) {
		toast('请选择加油站经纬度');
		setTimeout(function() {
			$(".add_btn").removeAttr("disabled")
		}, 100)
		return;
	};
	var address = $(".checke_detail").val();
	address = $.trim(address);
	if(address == "") {
		toast("输入详细地址(街道/门牌号)");
		setTimeout(function() {
			$(".add_btn").removeAttr("disabled")
		}, 100)
		return;
	};
	var info_select = $(".custom-select").children('option:selected').val();
	if(info_select == "") {
		toast('请选择加油站品牌');
		setTimeout(function() {
			$(".add_btn").removeAttr("disabled")
		}, 100)
		return;
	};
	if(noArr.length < 1) {
		toast('请添加加油枪');
		setTimeout(function() {
			$(".add_btn").removeAttr("disabled")
		}, 100)
		return;
	}
	if(imgArr.length < 1) {
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
	code["tOnSiteGuns"] = noArr;
	code["stringImageList"] = imgArr
	code["phoneNumber"] = phoneNumber;
	return code;
}

/*加油枪*/
var n = 0;

function addGun(obj) {
	var len = $(".oil_gun").length;
	$(".addBox").prepend(gunHtml(len + 1));
	var obj = new Object;
	obj.gunNo = len + 1;
	noArr.push(obj);
	console.log(noArr)
	return noArr
}

function gunHtml(num) {
	var html = '<text class="col-2 oil_gun p-1 ml-1 mb-1" onclick="delGun(this)" data-num="' + num + '">' + num + "号油枪" + '</text>';
	return html;
}

function delGun(obj) {
	var num = $(obj).attr("data-num");
	$(obj).remove();
	obj.gunNo = num;
	for(var i = 0; i < noArr.length; i++) {
		if(noArr[i].gunNo == num) {
			var index = noArr.indexOf(noArr[i]);
			noArr.splice(index, 1);
		}
	}
	console.log(noArr)
	return noArr
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
			})
		}
	}
	return imgArr;
});

$(".picDiv").on("click", ".imageDiv", function() {
	var index = $(this).index();
	imgArr.splice(index, 1);
	$(this).remove();
	$("#fileInput").val("");
	return imgArr;
})

$(".add_btn").click(function() {
	$(this).attr("disabled", "disabled");
	add_station(get_data());
	setTimeout(function() {
		$(".add_btn").removeAttr("disabled")
	}, 5000)
});