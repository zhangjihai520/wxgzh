$(function() {
	var height_1 = $(".head_box").height();
	var height_2 = $(".nav_box").height();
	var height = height_1 + height_2;
	var height_3 =$(".nav_bottom").height();
	$("#wrapper").css("top", height + 5);
	
	$("#wrapper").css("bottom", height_3+5);
	$("#subscript").click(function() {
		$("#dateNow").click();
	});
	page_change(".go_invoiceList","invoiceList.html");
	new Rolldate({
		el: '#dateNow',
		format: 'YYYY-MM',
		beginYear: 2000,
		endYear: 2100,
		init: function() {},
		moveEnd: function(scroll) {},
		confirm: function(date) {
			save_time(date);
			var pages =save_localStorage("pages","1");
			save_localStorage("isStop", "true");
			var page=get_localStorage("pages");
			$(".form_list").html("");
			get_recharge(page);
			$('#scroller').css('transform', 'translate3d(0px, 0px, 0px)');
		},
		cancel: function() {
//			console.log('插件运行取消');
		}
	});
	get_current();
	save_localStorage("isStop", "true");
	var pages = save_localStorage("pages","1");
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
				pages = save_localStorage("pages","1");
				return;
			}
			//上拉加载
			if($(".pull-loading").hasClass('loading') && get_localStorage("isStop") == "true") {
				$(".pull-loading").html("加载中...");
				var page =get_localStorage("pages");
				page++;
				pullOnLoad(page);
				save_localStorage("pages",page)
				console.log(page)
			};

		}
	});
});
//上拉加载函数,ajax
function pullOnLoad(pages) {
	setTimeout(function() {
		get_recharge(pages);
	}, 1000);
};

function get_current() { //获取当前日期var dates = new Date;
	var dates = new Date;
	var year = dates.getFullYear();
	var month = dates.getMonth() + 1;
	month = (month < 10 ? "0" + month : month);
	var mydate = (year.toString() + '-' + month.toString());
	$("#dateNow").text(mydate);
	month=parseInt(month);
	save_localStorage("years",year);
	save_localStorage("months",month);
	var pages = save_localStorage("pages", "1");
	var page = get_localStorage("pages");
	$(".form_list").html("");
	 get_recharge(page);
}
function save_time(dates) { //保存时间
	var new_dates = dates.replace(/-/g, '/');
	var new_dt=new_dates+'/01';
	var crrent_date = new Date(new_dt);
	var year = crrent_date.getFullYear();
	var month = crrent_date.getMonth() + 1;
	save_localStorage('years', year);
	save_localStorage('months', month);
}
function get_recharge(pages) {//获取列表
	var url = re_url(methods.getInvestMoneyInfo);
	var data = {
		month: get_localStorage("months"),
		year: get_localStorage("years"),
		page: pages,
		size: 10
	}
	console.log(data)
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			console.log(datas)
			var List = response.data.pageUtils.list;
			$('.save_mone').text(datas.totalSaveMoney+"元");
			$('.use_money').text(datas.totalPayMoney+"元");
			if(List==""){
				$(".pull-loading").html("已经到底了...");
				save_localStorage("isStop", "false");
				return;
			}
			$.each(List,function(i,v){
				$(".form_list").append(creat_html(v))
			});
			$(".go_invoice").click(function(){
				if(get_localStorage("buInvoiceTpltId")==null){
					go_page("invoiceList.html");
					return;
				}else{
					save_localStorage("savePrice",$(this).attr("dataPrice"));
					go_page("invoicedata.html");
				}
			})
			
		} else {
			toast(response.message)
		}
	}
	util.get_ajax(url, data, success)
};
function creat_html(data){
	var html="";
	html+='<li class="col-12 pb-2 mt-1 border-bottom">';
	html+='<div class="form-row ">';
	html+='<div class="col-6">';
	html+='<div class="form-row font_1">';
	html+='<p class="col-12 font_2 font_weight">'+'充值'+'</p>';
	html+='<p class="col-12 mt-1">'+timestampToTime(data.createTime )+'</p>';
	html+='</div></div>';
	html+='<div class="col-6 text-right">';
	html+='<div class="form-row font_1">';
	html+='<p class="col-12  font_2 font_weight">'+"￥"+data.amount+'</p>';
	html+='<p class="col-4 offset-8 border orange border_1  mt-1 go_invoice text-center" dataPrice="'+data.amount+'">'+"去开票"+'</p>';
	html+='</div></div>';
	html+='</li>';
	return html;
}
