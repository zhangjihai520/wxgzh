function getBuyerSiteList(){//
	var url = re_url(methods.getBuyerSiteList);
	var data={};
	var success =function(response){
		if(response.code == RETCODE_SUCCESS) {
			var datas =response.data;
			if(datas==""){
				toast("您还未添加加油站，请前往添加");
				clearTimeout(timer);
			var timer =	setTimeout(function(){
					page_back()
				},1000);
				return;
			}
			console.log(datas)
			var oil_list =document.getElementById("accordionExample")
			$.each(datas, function(i,v) {
				var oil_item =document.createElement("div");
				oil_item.className="card border-0";
				oil_item.innerHTML =station_info(v)
				oil_list.appendChild(oil_item);
			});
			$(".oil_site").click(function(){
				var oil_id =$(this).attr("id");
				save_localStorage("onSiteId",oil_id);
				get_price(oil_id);
			})
			
			
		}
	}
	util.get_ajax(url, data, success)
}
 getBuyerSiteList();
 
 function station_info(data){
 	var station_infos ="";
 	station_infos+='<div class="row card-header wite_bg border-0  px-0" id="'+data.onSiteId+'">';
 	station_infos+='<div class="col-8 font_4 font_weight">'+sense_oilType(data.type)+"-"+data.name+'</div>';
 	station_infos+='<div class="col-4 font_1" data-toggle="collapse" data-target="#collapseOne'+data.onSiteId+'" aria-expanded="ture" aria-controls="collapseOne">';
 	station_infos+='<p class="border orange text-center oil_site" id="'+data.onSiteId+'">';
 	station_infos+='<span>'+'价格详情'+'</span>';
 	station_infos+='<span class="fa fa-angle-down">'+""+'</span>';
 	station_infos+='</p></div>';
 	station_infos+='<p class="col-12 text-muted font_1">'+data.detailAddress+'</p>';
 	station_infos+='</div>';
 	station_infos+='<div id="collapseOne'+data.onSiteId+'" class="row collapse" aria-labelledby="'+data.onSiteId+'" data-parent="#accordionExample">';
	station_infos+='<div class="card-body  col-12 p-0 m-0">';
	station_infos+='<div class="row">';
	station_infos+='<form class="col-10 offset-1 form_box pb-1">';
	
	station_infos+='</form>';
	station_infos+='<p class="offset-5 font_1 col-2  p-0 my-1 change_price">'+'确认修改'+'</p>';
	station_infos+='</div></div></div>';
 	return station_infos;
 }
function sense_oilType(data){
	var oil_type="";
	if(data=="0"){
		oil_type="UE自营";
		return oil_type
	};
	if(data=="1"){
		oil_type="中石油";
		return oil_type
	};
	if(data=="2"){
		oil_type="中石化";
		return oil_type
	};
	if(data=="3"){
		oil_type="中海油";
		return oil_type
	};
	if(data=="4"){
		oil_type="民营";
		return oil_type
	};
}

function oil_price(data){
	var oil_price ="";
	oil_price+='<div class="input-group input-group-sm border-bottom">';
	oil_price+='<div class="input-group-prepend">';
	oil_price+='<span class="input-group-text  icon collapse_color font_weight">'+data.no+"#"+'</span>';
	oil_price+='</div>';
	if(data.amount=="0"){
		oil_price+='<input type="text" class="form-control collapse_color text-center price_input" value=""  placeholder="请输入金额"  id="'+data.oiOilId+'">';
	}else{
		oil_price+='<input type="text" class="form-control collapse_color text-center price_input" value="'+data.amount+'"  placeholder="请输入金额，单位(元)"  id="'+data.oiOilId+'">';
	}
	oil_price+='<div class="input-group-prepend icon_box font_1">';
	oil_price+='<span class="input-group-text icon collapse_color del_icon font_1 px-0" >'+"单位（元/升）"+'</span>';
	oil_price+='</div>';
	oil_price+='<div class="input-group-prepend icon_box">';
	oil_price+='<span class="input-group-text icon collapse_color del_icon" >'+'&times;'+'</span>';
	oil_price+='</div></div>';
	return oil_price;
}

function get_price(id){//获取加油站油价列表
	var url =re_url(methods.getSiteOilPriceList);
	var data={
		onSiteId:id
	}
	var success =function(reponse){
		if(reponse.code==RETCODE_SUCCESS){
			var datas =reponse.data;
			// console.log(datas)
			var price_box =""
			
			$.each(datas, function(i,v) {
				price_box+=oil_price(v);
			});
			$(".form_box").html("");
			$(".form_box").append(price_box);
			oil_arr=[];
			
				$(".del_icon").click(function(){
					$(this).parent().siblings(".price_input").val("");
					$(this).parent().siblings(".price_input").change();
				});
				$('.price_input').on("keyup",function(){
					clearNoNum(this)
				});
				$(".change_price").click(function(){
					updateSiteOilPrice(get_localStorage("oil_arr"));
				});
				$('.price_input').on("change",function(){
				console.log($(this).val())
					var obj = new Object;
						if($(this).val()==""){
							obj.amount = 0
						}else{
							obj.amount=$(this).val();
						}
						obj.oiOilId=$(this).attr("id");
						obj.onSiteId=get_localStorage("onSiteId");
						if($(this).attr("id")==""){
							return;
						}else{
							oil_arr.push(obj);
						}
						save_localStorage("oil_arr",oil_arr);
				});
			
		}
	}
	util.get_ajax(url,data,success);
}


function updateSiteOilPrice(objs){
	var url=re_url(methods.updateSiteOilPrice);
	var data ={"priceList":JSON.parse(objs)}
	var success =function(response){
		if(response.code==RETCODE_SUCCESS){
			toast("修改成功");
			clearTimeout(timer);
			var timer =setTimeout(function(){
				window.location.reload();
			},1000)
		}
	};
	util.post_ajax(url,data,success);
}

