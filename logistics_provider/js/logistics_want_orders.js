var current_size =4;
$(function(){
	var pages = save_localStorage("pages", "1");
	var page = get_localStorage("pages");
	$(".order_box").html("");
	pullOnLoad(page);
	var height =$(".top_box").height();
	$("#wrapper").css("top", height +10);
	$("#wrapper").css("bottom", 5);
	save_localStorage("isStop", "true");
	var myscroll = new iScroll("wrapper", {
		onScrollMove: function() { //拉动时
			myscroll.refresh();
			//上拉加载
			if(get_localStorage("isStop") == "false") {
				return;
			}
			if(this.y < this.maxScrollY) {
				$(".pull-loading").html("释放加载");
				$(".pull-loading").addClass("loading");
			} else {
				$(".pull-loading").html("上拉加载");
				$(".pull-loading").removeClass("loading");
			};

		},
		onScrollEnd: function() { //拉动结束时
			if(get_localStorage("isStop") == "false") {
				pages = save_localStorage("pages", "1");
				return;
			}
			//上拉加载
			if($(".pull-loading").hasClass('loading') && get_localStorage("isStop") == "true") {
				$(".pull-loading").html("加载中...");
				var page = get_localStorage("pages");
				page++;
				pullOnLoad(page);
				save_localStorage("pages", page);
				console.log(page)
			};

		}
	});
})

function pullOnLoad(pages) {
	setTimeout(function() {
		orderList(pages)
	}, 500);
}

function orderList(page){
	var url =re_url(methods.getFavoritesList);
	var data={
		page:page,
		size:current_size
	};
	var success =function(response){
		if(response.code==RETCODE_SUCCESS){
			console.log(response)
			var List =response.data.list;
			console.log(List);
			if(List == "") {
				$(".pull-loading").html("已经到底了...");
//				toast("已经到底了....");
				save_localStorage("isStop", "false");
				return;
			};
			$.each(List, function(i,v) {
				$(".order_box").append(order_item(v))
			});
			$(".detail_btn").on("click",function(){
				var id =$(this).attr("id");
				save_localStorage("order_id",id)
				go_page("logisctics_want_detil.html")
			})
		}
	};
	util.get_ajax(url,data,success)
}


function order_item(data){
	var order_item="";
	order_item+='<li class="col-12 order_item px-1 border-bottom">';
	order_item+='<div class="form-row font_2 mt-1 mr-1">';
	order_item+='<p class="col-10">';
	order_item+='<span class=" fa fa-circle icons icon_1 pr-1"></span>';
	order_item+='<span class="text-muted">'+"订单号："+'</span>';
	order_item+='<span class="pl-1">'+data.orderNo+'</span>';
	order_item+='</p>';
	order_item+='<p class="col-2 border text-center border_2 font_2 detail_btn" id="'+data.toOrderId+'">'+"详情"+'</p>';
	order_item+='</div>';
	
	order_item+='<div class="form-row font_2 mt-1">';
	order_item+='<p class="col-12">';
	order_item+='<span class=" fa fa-circle icons icon_2 pr-1"></span>';
	order_item+='<span class="text-muted">'+"要求送达时间："+'</span>';
	order_item+='<span class="pl-1">'+timestampDay(data.arriveTime)+'</span>';
	order_item+='</p></div>';
	
	order_item+='<div class="form-row font_2 mt-1">';
	order_item+='<p class="col-12">';
	order_item+='<span class="iconfont iconqidian font_6 icon_3 pr-1"></span>';
	order_item+='<span class="text-muted">'+data.beginDetailAddress+'</span>';
	order_item+='</p></div>';
	
	order_item+='<div class="form-row font_2 mt-1">';
	order_item+='<p class="col-12">';
	order_item+='<span class=" iconfont iconzhongdian font_6 icon_4 pr-1"></span>';
	order_item+='<span class="text-muted">'+data.beginDetailAddress+'</span>';
	order_item+='</p></div>';
	
	order_item+='<div class="font_2 py-2 border-bottom">';
	order_item+='<p class="col-12 px-1">';
	order_item+='<span class="fa fa-circle icons icon_5 pr-1"></span>';
	order_item+='<span class="text-muted">'+"物流费："+'</span>';
	order_item+='<span class=" pl-0 tran_money font_4 trans_price">'+data.amount+"元"+'</span>';
	order_item+='</p></div>';
	order_item+='</li>';
	return order_item
}
