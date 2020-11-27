$(function() {
	var height_1 = $(".head_box").height();
	var height_2 = $(".nav_box").height();
	var height = height_1 + height_2;
	$("#wrapper").css("top", height + 5);
	$("#wrapper").css("bottom", 0);
	$("#subscript").click(function() {
		$("#dateNow").click();
	});
	page_change(".go_form","reportForms.html");
	page_change("#recharge","recharge.html");
	
	new Rolldate({
		el: '#dateNow',
		format: 'YYYY-MM',
		beginYear: 2000,
		endYear: 2100,
		init: function() {},
		moveEnd: function(scroll) {},
		confirm: function(date) {
			save_time(date);
			var pages = save_localStorage("pages", "1");
			save_localStorage("isStop", "true");
			var page = get_localStorage("pages");
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
	var pages = save_localStorage("pages", "1");
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
				save_localStorage("pages", page)
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
	month = parseInt(month);
	save_localStorage("years", year);
	save_localStorage("months", month);
	$(".form_list").html("");
	var pages = 1;
	get_recharge(pages);
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

function get_recharge(pages) { //获取列表
	var url = re_url(methods.getPurseBalanceInfo);
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
			$('.save_mone').text(datas.totalSaveMoney + "元");
			$('.use_money').text(datas.totalPayMoney + "元");
			if(List == "") {
				$(".pull-loading").html("无更多数据...");
				save_localStorage("isStop", "false");
				return;
			}
			
			$.each(List, function(i, v) {
				$(".form_list").append(creat_html(v))
			});
			
			
		}
	}
	util.get_ajax(url, data, success)
};

function creat_html(data) {
	var html = "";
	if(data.billType == 1) {
		html += '<li class="col-12 mt-2 border-bottom pb-2">';
		html += '<div class="form-row ">';
		html += '<div class="col-12">';
		html += '<div class="form-row font_1">';
		html += '<p class="col-8 font_2 font_weight">' + "充值" + '</p>';
		html += '<p class="col-4 text-right text-muted">' + timestampToTime(data.createTime) + '</p>';
		html += '</div></div>';
		html += '<div class="col-12">';
		html += '<div class="form-row font_1">';
		html += '<p class="col-12 font_4 text-right text-danger font_weight">' + "+" + data.payAmount + '</p>';
		html += '</div></div>';
		html += '</li>';
		return html;
	}
	if(data.billType == 0){
		html += '<li class="col-12 mt-2 border-bottom pb-2">';
		html += '<div class="form-row ">';
		html += '<div class="col-12">';
		html += '<div class="form-row font_1">';
		html += '<p class="col-8 font_2 font_weight">' + data.name+ '</p>';
		html += '<p class="col-4 text-right text-muted">' + timestampToTime(data.createTime) + '</p>';
		html += '</div></div>';
		html += '<div class="col-12">';
		html += '<div class="form-row font_1">';
		html +='<div class="col-9  font_2 font_weight">';
		html +='<p class="font_1 text-muted">';
		html +='<span>'+data.no+"#"+'</span>';
		html +='<span>'+data.count+"L"+'</span>';
		html +='</p></div>';
		html += '<p class="col-3 font_4 text-right text-danger font_weight">' + "-" + data.payAmount + '</p>';
		html += '</div></div>';
		html += '</li>';
		return html;
	}

}