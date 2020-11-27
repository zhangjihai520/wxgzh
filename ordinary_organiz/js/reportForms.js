$(function() {
	save_localStorage("isStop", "true");
	var height = $(".title_contanier").height();
	var height_1 = $(".title").height();
	$("#wrapper").css("top", height+height_1);
	//返回
	$(".break").click(function() {
		page_back();
	});
	setCss();
	var pages = 1;
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
				pages = 1;
				return;
			}
			//上拉加载
			if($(".pull-loading").hasClass('loading') && get_localStorage("isStop") == "true") {
				$(".pull-loading").html("加载中...");
				var page = get_localStorage("pages");
				page++;
				pullOnLoad(page);
				save_localStorage("pages", page)
				console.log(pages)
			};
		}
	});
});
$("#subscript").click(function() {
	$("#dateNow").click();
});
new Rolldate({
	el: '#dateNow',
	format: 'YYYY-MM',
	beginYear: 2000,
	endYear: 2100,
	init: function() {

	},
	moveEnd: function(scroll) {

	},
	confirm: function(date) {
		$(".form_box").html("");
		var dates = date;
		save_time(dates);
		var pages = save_localStorage("pages", "1");
		save_localStorage("isStop", "true");
		var page = get_localStorage("pages");
		reportInform();
		$(".form_box").html("");
		getRepotrFromList(page);
		$('#scroller').css('transform', 'translate3d(0px, 0px, 0px)');
	},
	cancel: function() {}
});

function setCss() {
	save_localStorage("searchType", 1); //默认是1
	get_current();
	$(".uncheckStatement").click(function() {
		$(this).parent().find(".checkStatement").removeClass("checkStatement");
		$(this).addClass("checkStatement");
		if($(this).hasClass("disburse")) {
			$(".total_title").text("本月支出");
			$("#storedOrExpend").text("支出排行榜");
			save_localStorage("searchType", 1); //储存本地键值，判断是支出还是储值
		} else {
			$(".total_title").text("本月储值");
			$("#storedOrExpend").text("储值记录");
			save_localStorage("searchType", 2);
		};
		if($(this).hasClass('checkStatement')) {
			save_localStorage('searchType', $(this).attr('id'));
			get_current();
		};
	});
}
function get_current() { //获取当前日期01
	var dates = new Date;
	var year = dates.getFullYear();
	var month = dates.getMonth() + 1;
	month = (month < 10 ? "0" + month : month);
	var mydate = (year.toString() + '-' + month.toString());
	$('#dateNow').text(mydate);
	save_localStorage('years', year);
	save_localStorage('months', dates.getMonth() + 1);
	save_localStorage("isStop", "true");
	var pages = save_localStorage("pages", "1");
	var page = get_localStorage("pages")
	reportInform();
	$(".form_box").html("");
	getRepotrFromList(page)
}

function save_time(dates) {
	var new_dates = dates.replace(/-/g, '/');
	var new_dt=new_dates+'/01';
	var crrent_date = new Date(new_dt);
	var year = crrent_date.getFullYear();
	var month = crrent_date.getMonth() + 1;
	save_localStorage('years', year);
	save_localStorage('months', month);
}

function reportInform() { //报表
	var url = re_url(methods.getRepotrFromInfo);
	var data = {
		month: get_localStorage("months"),
		year: get_localStorage("years"),
		searchType: get_localStorage('searchType'),
	};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data.monthList;
			var month_arr = [];
			var totalCount_arr = [];
			for(var i = 0; i < datas.length; i++) {
				month_arr.push(datas[i].month + '月');
				totalCount_arr.push(datas[i].totalAmount);
				$('.fo_pay_num').text(datas[i].totalCount);
				$('.money').text("￥"+datas[i].totalAmount)
			}
			fo_echarts(month_arr, totalCount_arr);
		} else {
			toast(response.message)
		}
	}
	util.get_ajax(url, data, success)
}

function fo_echarts(data1, data2) { //图表
	var fo_echarts = document.getElementById('histogram');
	mychart = echarts.init(fo_echarts);
	var app = {};
	option = null;
	var option = {
		title: {
			subtext: '支出对比',
			subtextStyle: {

			},
			textStyle: {
				color: '#7EB1FC',
				fontSize: 12,
			}
		},
		color: ['#7EB1FC'],
		textStyle: {

		},
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			data: data1,
			axisTick: {
				alignWithLabel: true
			},
			axisLabel: { //x轴上的样式设置

				textStyle: {

				}
			}
		}],
		yAxis: [{
			type: 'value',
			axisLabel: { //Y轴上的样式设置

				textStyle: {

				}
			}
		}],
		series: [{
			name: '总金额:',
			type: 'bar',
			barWidth: '30%',
			data: data2,
			itemStyle: {
				normal: {
					label: { //显示数据
						show: true,
						position: 'top',
						textStyle: {
							color: '#7EB1FC'
						}
					}
				}
			}
		}]

	};
	mychart.setOption(option);
}



function getRepotrFromList(pages) { //下滑排行榜
	var url = re_url(methods.getRepotrFromList);
	var data = {
		month: get_localStorage("months"),
		year: get_localStorage("years"),
		searchType: get_localStorage('searchType'),
		page: pages,
		size: 10
	}
	console.log(data)
	var success = function(response) {
		console.log(response)
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data.list;
			if(datas == "") {
				$(".pull-loading").html("已经到底了...");
				save_localStorage("isStop", "false");
				return
			}
			console.log(datas);

			for(var i = 0; i < datas.length; i++) {
				$(".form_box").append(list_item(datas[i], i+1))
			};
		} else {
			toast(response.message)
		}
	}
	util.get_ajax(url, data, success)
}
//上拉加载函数,ajax
function pullOnLoad(pages) {
	setTimeout(function() {
		getRepotrFromList(pages);
	}, 1000);
};

function list_item(data, i) {
	var item = "";
	item += '<li class="col-12">';
	item += '<div class="form-row randing">';
	item += us_sea(data);
	item += '</li>';
	return item
}

function us_sea(datas) { //判断是支出
	var infos = ""
	if(get_localStorage('searchType') == "1") {
		infos +='<div class="col-8 ">';
		infos +='<span class="rankingSize ml-1">' + datas.nickname + '</span>'
		infos += '</div>';
		infos += '<div class="col-4 text-right orange">';
		if(datas.totalAmount==0 || datas.totalAmount==""){
			infos += '';
		}else{
			infos += '<span>' + '-' + datas.totalAmount + '</span>';
		}
		infos += '</div>';
	} else if(get_localStorage('searchType') == "2") {
		infos +='<div class="col-8 ">';
		infos +='<span class="rankingSize ml-1">' + datas.name + '</span>'
		infos += '</div>';
		infos += '<div class="col-4 text-right orange">';
		infos += '<span>' + '￥' + datas.amount + '</span>';
		infos += '</div>';
	}
	return infos;
}