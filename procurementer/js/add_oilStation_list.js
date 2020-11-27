$(document).ready(function(){
	remove_localStorage("bdDistrictId");
	remove_localStorage("provinces");
	remove_localStorage("city");
	remove_localStorage("area");
	remove_localStorage("latY");
	remove_localStorage("lngX");
	remove_localStorage("station_name");
});
getBuyerSiteList();
function getBuyerSiteList(){
	var url = re_url(methods.getBuyerSiteList);
	var data={};
	var success =function(response){
		if(response.code == RETCODE_SUCCESS) {
			var datas =response.data;
			console.log(datas)
			if(datas==""){
				$(".list_null").show();
				$(".save").hide();
				page_change(".list_null","add_oil_station.html");
			}else{
				$(".list_null").hide();
				$(".save").show();
			}
			var oilStation = station_list(datas);
			$(".oil_list").html(oilStation);
			$(".delete").on("click",function(){
				var id =$(this).attr("id");
				save_localStorage("onSiteId",id);
			});
			$(".true_btn").click(function(){
				deleteOnSite(get_localStorage("onSiteId"));
			})
			$(".change_info").click(function(){
				var onSiteId =$(this).attr("id");
				save_localStorage("onSiteId",onSiteId);
				go_page("change_oil_station.html");
			});
		}
	}
	util.get_ajax(url, data, success)
}

function station_list(body_data){
	var station_list ="";
	$.each(body_data,function(index,value){
		station_list +=station_contant(value);
	});
	return station_list;
}

function station_contant(data){
	var oil_station="";
	 oil_station+='<div class="row col-12 m-0 p-0 py-3  border-bottom">';
	 oil_station+='<p class="col-12 p-0 font_4 black font_weight station_name">'+data.name+'</p>';
	 oil_station+='<p class="col-12 p-0 font_1 station_site mt-2">'+data.detailAddress+'</p>';
	 oil_station+='<div class="col-12 p-0 row font_1 text-center m-0 mt-2 pt-1">';
	 oil_station+='<p class="col-3 orange change_info px-0" id="'+data.onSiteId+'">'+'修改信息'+'</p>';
	 oil_station+='<p class="col-3 px-0 orange offset-1 delete" id="'+data.onSiteId+'" data-toggle="modal" data-target="#exampleModalCenter">'+'删除'+'</p>';
	 oil_station+='</div></div>';
	 return oil_station;	
}


function deleteOnSite(onSiteIds){
	var url =re_url(methods.deleteOnSite);
	var data={
		onSiteId:onSiteIds
	}
	var success = function(response){
		if(response.code == RETCODE_SUCCESS) {
			window.location.reload()
		}
	}
	util.get_ajax(url,data,success)
}

