$(function() {
	save_localStorage("isStop", "true");
	getBuyerSiteList();
	get_current();
	var height_1 = $(".topBox").height();
	var height_2 = $(".containerBox").height();
	var height = height_1 + height_2;
	$("#wrapper").css("top", height + 15);
	$("#wrapper").css("bottom", 5);
	var page = 1;
	pullOnLoad(page);
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
				save_localStorage("pages", "1");
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
})

function get_current() { //获取当前日期01
	var dates = new Date();
	dates.setTime(dates.getTime());
	var eMon = dates.getMonth() + 1;
	eMon = eMon < 10 ? "0" + eMon : eMon
	var eDay = dates.getDate();
	eDay = eDay < 10 ? "0" + eDay : eDay
	var endDate = dates.getFullYear() + "-" + eMon + "-" + eDay;
	$("#date-group2-2").text(endDate);
	save_localStorage("endYear", dates.getFullYear());
	save_localStorage("endDay", dates.getDate());
	save_localStorage("endMonth", (dates.getMonth() + 1));
	var oneDay = 24 * 3600 * 1000;
	var star_Date = new Date(dates -= oneDay * 30);
	star_Date.setTime(star_Date.getTime());
	var sMon = star_Date.getMonth() + 1;
	sMon = sMon < 10 ? "0" + sMon : sMon
	var sDay = star_Date.getDate();
	sDay = sDay < 10 ? "0" + sDay : sDay
	var starDate = star_Date.getFullYear() + "-" + sMon + "-" + sDay;
	$("#date-group2-1").text(starDate);
	save_localStorage("startYear", star_Date.getFullYear());
	save_localStorage("startMonth", (star_Date.getMonth() + 1));
	save_localStorage("startDay", star_Date.getDate());	
	setTimeout(function(){
		chartInfo();
	},500)
};
//上拉加载函数,ajax
function pullOnLoad(pages) {
	setTimeout(function() {
		formInfo(pages);
	}, 1000);
}

function formInfo(page) { //获取加油站统计信息
	var url = re_url(methods.getOnSiteRepotrFromInfoList);
	var data = {
		onSiteId: get_localStorage("onSiteId"),
		startDay: get_localStorage("startDay"),
		startMonth: get_localStorage("startMonth"),
		startYear: get_localStorage("startYear"),
		endDay: get_localStorage("endDay"),
		endMonth: get_localStorage("endMonth"),
		endYear: get_localStorage("endYear"),
		page: page,
		size: 10
	};
	var success = function(response) {
		console.log(response)
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			if(datas.list == "") {
				$(".pull-loading").html("无更多数据...");
				save_localStorage("isStop", "false");
				return;
			}
			$.each(datas.list, function(i, v) {
				$(".order_box").append(infoItem(v))
			})
			console.log(response.data);
		}
	};
	util.get_ajax(url, data, success)
}

function chartInfo() { //图表信息
	var url = re_url(methods.getOnSiteRepotrFromInfo);
	var data = {
		onSiteId: get_localStorage("onSiteId"),
		startDay: get_localStorage("startDay"),
		startMonth: get_localStorage("startMonth"),
		startYear: get_localStorage("startYear"),
		endDay: get_localStorage("endDay"),
		endMonth: get_localStorage("endMonth"),
		endYear: get_localStorage("endYear"),
	};
	var success = function(response) {
		//		console.log(response)
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			if(datas == "") {
				toast("数据为空");
				return;
			}
			var sYear = get_localStorage("startYear");
			var sMon = get_localStorage("startMonth");
			var sDay = get_localStorage("startDay");
			var sDate = (sYear + '-' + sMon + '-' + sDay);
			var eDate = (get_localStorage("endYear") + '-' + get_localStorage("endMonth") + '-' + get_localStorage("endDay"))
			//			console.log(response.data);
			var length = (getDaysBetween(sDate, eDate));
			var base = +new Date(sYear, sMon, sDay);
			var oneDay = 24 * 3600 * 1000;
			var date = [];
			var dataList = [];
			for(var i = 0; i < length + 1; i++) {
				var now = new Date(base += oneDay);
				date.push(datas[i].time);
				dataList.push(datas[i].totalAmount);
			};
			fo_echarts(date, dataList)
		}
	};
	util.get_ajax(url, data, success)
}

function getDaysBetween(dateString1, dateString2) { //获取时间差距
	var startDate = Date.parse(dateString1);
	var endDate = Date.parse(dateString2);
	var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
	return days;
}

function fo_echarts(date, data) {
	var fo_echarts = document.getElementById('barChart');
	mychart = echarts.init(fo_echarts);
	var app = {};
	option = null;
	var option = {
		tooltip: {
			trigger: 'axis',
			position: function(pt) {
				return [pt[0], '3%'];
			}
		},
		title: {
			left: 'center',
			text: '',
		},
		toolbox: {
			show:false,
			feature: {
				dataZoom: {
					show: false,
					yAxisIndex: 'none'
				},
				restore: {},
				saveAsImage: {}
			}
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: date
		},
		yAxis: {
			type: 'value',
			boundaryGap: [0, '100%']
		},
		dataZoom: [{
			type: 'inside',
			start: 0,
			end: 10
		}, {
			start: 0,
			end: 10,
			handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
			handleSize: '80%',
			handleStyle: {
				color: '#fff',
				shadowBlur: 3,
				shadowColor: 'rgba(0, 0, 0, 0.6)',
				shadowOffsetX: 2,
				shadowOffsetY: 2
			}
		}],
		series: [{
			name: '销售金额',
			type: 'line',
			smooth: true,
			symbol: 'none',
			sampling: 'average',
			itemStyle: {
				color: 'rgb(255, 70, 131)'
			},
			areaStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
					offset: 0,
					color: 'rgb(255, 158, 68)'
				}, {
					offset: 1,
					color: 'rgb(255, 70, 131)'
				}])
			},
			data: data
		}]
	};
	mychart.setOption(option);
}

new Rolldate({
	el: '#date-group2-1',
	format: 'YYYY-MM-DD',
	beginYear: 2000,
	endYear: 2100,
	init: function() {

	},
	moveEnd: function(scroll) {

	},
	confirm: function(date) {
		var dates = new Date();
		var oDate1 = new Date(date);
		if(oDate1.getTime() > dates.getTime()) {
			alert("时间错误，请重新选择");
			window.location.reload();
			return;
		}
		remove_localStorage("endYear", year);
		remove_localStorage("endMonth", month);
		remove_localStorage("endDay", day);
		$("#date-group2-1").text("");
		var new_dates = date.replace(/-/g, '/');
		var crrent_date = new Date(new_dates);
		var year = crrent_date.getFullYear();
		var month = crrent_date.getMonth() + 1;
		var day = crrent_date.getDate();
		save_localStorage("startYear", year);
		save_localStorage("startMonth", month);
		save_localStorage("startDay", day);

	},
})

new Rolldate({
	el: '#date-group2-2',
	format: 'YYYY-MM-DD',
	beginYear: 2000,
	endYear: 2100,
	init: function() {

	},
	moveEnd: function(scroll) {

	},
	confirm: function(date) {
		var dates = new Date();
		var oDate1 = new Date($("#date-group2-1").text());
		var oDate2 = new Date(date);
		if(oDate1.getTime() > oDate2.getTime() || oDate2.getTime() > dates.getTime()) {
			alert("时间选择错误,请重新选择");
			window.location.reload();
			return;
		}else{
			console.log(date)
			var new_dates = date.replace(/-/g, '/');
			var crrent_date = new Date(new_dates);
			
			var year = crrent_date.getFullYear();
			var month = crrent_date.getMonth() + 1;
			var day = crrent_date.getDate();
			console.log(day)
			save_localStorage("endYear", year);
			save_localStorage("endMonth", month);
			save_localStorage("endDay", day);
			var pages = save_localStorage("pages", "1");
			save_localStorage("isStop", "true");
			var page = get_localStorage("pages");
			$(".order_box").html("");
			formInfo(page);
			chartInfo();
		}
		
	}
});

function getBuyerSiteList() { //获取加油站列表
	var url = re_url(methods.getBuyerSiteList);
	var data = {};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			if(datas == "") {
				alert("暂时没有加油站");
				page_back();
				return;
			}
			$(".dropdown-menu").html("");
			$.each(datas, function(i, v) {
				$(".dropdown-menu").append(drowItem(v));
				if(i == 0) {
					$(".dropdown-item").eq(i).addClass("active");
					$("#dropdownMenu2").text($(".dropdown-item").eq(i).text());
					save_localStorage("onSiteId", $(".dropdown-item").eq(i).attr("id"));
				}
			});
			$(".dropdown-item").click(function() {
				var id = $(this).attr("id");
				save_localStorage("onSiteId", id);
				$(".dropdown-item").removeClass("active");
				$(this).addClass("active");
				$("#dropdownMenu2").text($(this).text());
				var pages = save_localStorage("pages", "1");
				save_localStorage("isStop", "true");
				var page = get_localStorage("pages");
				$(".order_box").html("");
				formInfo(page);
				chartInfo();
			})
		}
	}
	util.get_ajax(url, data, success)
}

function drowItem(datas) {
	var item = "";
	item += '<button class="dropdown-item text-center" type="button" id="' + datas.onSiteId + '">' + datas.name + '</button>';
	return item;
};

function infoItem(data) {
	var info = '';
	info += '<li class="form-row text-center">';
	info += '<div class="col-3 body_item">' + data.carCode + '</div>';
	info += '<div class="col-3 body_item">' + timestampDay(data.createTime) + '</div>';
	info += '<div class="col-3 body_item">' + data.no + "#" + '</div>';
	info += '<div class="col-3 body_item">' + data.siteName + '</div>';
	info += '</li>';
	return info;
}