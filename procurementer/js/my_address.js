$(document).ready(function() {
//	remove_localStorage("buAddressId");
	remove_localStorage("isDefault");
	remove_localStorage("bdDistrictId");
	getBuyerAddressList();
	//判断是从哪进来的1是超市下单
	if(get_localStorage("addressStatus") == 1) {
		$(document).on('click', '.checkAddress', function() {
			save_localStorage("buAddressId", $(this).parent().attr('id'));
			save_localStorage("buAddressName", $(this).parent().find(".addressName").text());
			//页面返回后确认刷新
			page_back();
			sessionStorage.setItem('refresh', 'true');
			remove_localStorage("addressStatus");
		});
	}
	$(".top_icon").click(function(){
		remove_localStorage("addressStatus");
		page_back();
		
	})
});

function getBuyerAddressList() { //采购商收货地址列表
	var url = re_url(methods.getBuyerAddressListUnPage);
	var data = {};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			var address_box = document.querySelector(".address_box");
			address_box.innerHTML = "";
			if(datas == "") {
				toast("您目前还没有添加收货地址，请先新建地址");
				$(".warn_top").show()
				return;
			}
			console.log(datas);
			$.each(datas, function(i, v) {
				var list_box = document.createElement("div");
				list_box.className = "row mt-2 pt-2 wite_bg";
				list_box.id = v.buAddressId;
				list_box.innerHTML = get_AddressList(v);
				address_box.appendChild(list_box);
			});
			$(".default_box").click(function() { //修改默认地址
				$(".default_box").children(".default-em").removeClass("default_active");
				$(this).children(".default-em").addClass("default_active");
				var buAddressId = $(this).attr("id");
				$(this).attr("data_id", "1");
				var isDefault = $(this).attr("data_id");
				updateDefaultAddress(buAddressId, isDefault);
			});

			$(".del_box").on("click", function() {
				var buAddressId = $(this).attr("id");
				save_localStorage("buAddressId", buAddressId)
			})
			$(".true_btn").click(function() {
				deleteAddress(get_localStorage("buAddressId"));
			});
			$(".complie_box").on("click", function() {
				var buAddressId = $(this).attr("id");
				save_localStorage("buAddressId", buAddressId);
				go_page("change_adress.html");
			})
		}
	}
	util.get_ajax(url, data, success)
}

function get_AddressList(data) {
	var address_lsit = "";
	address_lsit += '<p class="col-4 name font_2 font_weight pr-1 checkAddress">' + data.contactName + '</p>';
	address_lsit += '<p class="col-8 phone_number font_2 font_weight checkAddress">' + data.contactPhone + '</p>';
	address_lsit += '<p class="col-12 font_1 site mt-2 border-bottom pb-2 checkAddress addressName">' + data.addressName + '</p>';
	address_lsit += '<div class="row col-12 m-0 p-0 pt-1 mt-2 mb-2 pb-1">';
	
	if(get_localStorage("addressStatus") == 1) {
		address_lsit += '<p class="col-6 font_1"  id="' + data.buAddressId + '" data_id="' + data.isDefault + '">';
		address_lsit += "";
	} else {
		if(data.isDefault == "0") {
			address_lsit += '<p class="default_box col-6 font_1"  id="' + data.buAddressId + '" data_id="' + data.isDefault + '">';
			address_lsit += '<span class="default-em  check">' + '' + '</span>';
			address_lsit += '<span class="text">' + '设为默认' + '</span>';
		} else {
			address_lsit += '<p class="default_box col-6 font_1"  id="' + data.buAddressId + '" data_id="' + data.isDefault + '">';
			address_lsit += '<span class="default-em default_active check">' + '' + '</span>';
			address_lsit += '<span class="text">' + '设为默认' + '</span>';
		}
	}
	address_lsit += '</p>';
	address_lsit += '<p class="col-3 font_1 text-right complie_box" id="' + data.buAddressId + '">';
	address_lsit += '<span class=" fa fa-file-pdf-o pr-1">' + '' + '</span>';
	address_lsit += '<span>' + '编辑' + '</span>';
	address_lsit += '</p>';
	address_lsit += '<p class="col-3 font_1 del_box" data-toggle="modal" data-target="#exampleModalCenter" id="' + data.buAddressId + '">';
	address_lsit += '<span class=" fa fa-trash-o pr-1">' + '' + '</span>';
	address_lsit += '<span>' + '删除' + '</span>';
	address_lsit += '</p>';
	address_lsit += '</div>';
	return address_lsit;
}

function updateDefaultAddress(id, isde) {
	var url = re_url(methods.updateDefaultAddress);
	var data = {
		buAddressId: id,
		isDefault: isde
	};
	var success = function(reponse) {
		if(reponse.code == RETCODE_SUCCESS) {
			alert("设置成功");
			window.location.reload();
		}
	};
	util.get_ajax(url, data, success)
}

function deleteAddress(id) {
	var url = re_url(methods.deleteAddress);
	var data = {
		buAddressId: id
	};
	var success = function(reponse) {
		if(reponse.code == RETCODE_SUCCESS) {
			alert("删除成功");
			window.location.reload();
		}
	}
	util.get_ajax(url, data, success)
}
page_change(".add_btn", "add_newAddress.html");