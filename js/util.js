// var api = 'http://a2u3959945.zicp.vip:35220/wxsn-api/';
//var urls = 'http://dev.youone.cn';
//var urls = 'http://www.youone.cn/';
//var api = urls+'wxsn-api/';

// var api ='http://a2u3959945.zicp.vip:35220/wxsn-api/';
var versions = 1.44;
var api = 'http://192.168.0.88:8082/wxsn-api/';
//
// 定义接口响应码 - 成功
var RETCODE_SUCCESS = 200;
// 定义接口响应码 - token失效
var RETCODE_TOKEN_INVALID = 405;

// 定义接口响应码 - 服务器内部错误
var RETCODE_FAILED = 400;

var ACCOUNT_DATA_NO_IN = 401;
//资料待上传

var ACCOUNT_DATA_APPROVAL = 406;
//资料审核中，不能下单
var ACCOUNT_DATA_NO_PASS = 407;
//审核不通过不能下单
var ACCOUNT_DATA_OILSTATION = 408;
//企业已经认证，加油站未认证
var regPos = /^\d+(\.\d+)?$/; //非负浮点数
var mobilePtn = /^1[34578][0-9]{9}$/; //手机正则
var d = /^([\w-_!@#$%^&*]){6,12}$/; //密码正则
var mail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; //邮箱正则
var social = /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/; //社会信用代码
var bank_code = /\d{14,19}/; //银行账号
var Id_code = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/; //身份证正则

function re_url(method) {
	var Url = api + method;
	return Url;
}

function re_url(method) {
	var Url = api + method;
	return Url;
}
var methods = {
	getAppIdAndRedirect: '/common/user/getAppIdAndRedirect', //获取用户code
	login: '/common/user/login', //登入
	accountRegister: '/common/user/accountRegister', //采购商用户注册
	sendSms: '/sms/vcode/sendSms', //短信验证码	
	forgetPassword: '/common/user/forgetPassword', //忘记密码
	getBuyOilPlans: '/t/bp/plan/getBuyOilPlans', //购油计划列表
	addBuyOilPlan: '/t/bp/plan/addBuyOilPlan', //添加购油计划
	post_getCartList: 't/bu/cart/getCartList', //获得购物车列表
	get_getUserInfo: 't/bu/account/getUserInfo', //获取用户账户基本信息
	getProvinceList: 't/bd/province/getProvinceList', //省管理列表
	getCityList: 't/bd/city/getCityList', //市级城市列表
	list: 't/bd/district/list', //区管理列表
	perfectBuyerInfo: '/t/bu/account/perfectBuyerInfo', //资料认证上传
	getCoPerfectInfo: '/t/bu/account/getCoPerfectInfo', //获取企业认证资料信息
	getOilStorePerfectInfo: '/t/bu/account/getOilStorePerfectInfo', //获取加油站认证资料信息
	getBuyerSiteList: '/t/on/site/getBuyerSiteList', //采购商加油站列表
	addOnSite: '/t/on/site/addOnSite', //添加加油站（以下是团油）
	buyerInfoExpand: '/t/bu/account/buyerInfoExpand', //加油站上传资料认证
	getOnSiteDetail: '/t/on/site/getOnSiteDetail', //获取加油站详情
	updateOnSite: '/t/on/site/updateOnSite', //修改加油站
	getDistrictInfo: '/t/bd/district/getDistrictInfo', //获取区id
	deleteOnSite: '/t/on/site/deleteOnSite', //删除加油站
	updateSiteOilPrice: '/t/oi/realprice/updateSiteOilPrice', //修改加油站价格
	getSiteOilPriceList: '/t/oi/realprice/getSiteOilPriceList', //获取加油站油价列表
	getBuyerAddressListUnPage: '/t/bu/address/getBuyerAddressListUnPage', //采购商收货地址列表
	addBuyerAddress: 't/bu/address/addBuyerAddress', //采购商添加收货地址
	updateDefaultAddress: '/t/bu/address/updateDefaultAddress', //修改为默认收货地址
	deleteAddress: 't/bu/address/deleteAddress', //删除收货地址
	getUserAddressDetail: '/t/bu/address/getUserAddressDetail', //获取用户地址信息
	updateBuyerAddress: 't/bu/address/updateBuyerAddress', //修改收货地址
	getInvocetpltList: '/t/bu/invoicetplt/getInvocetpltList', //发票模板列表
	addInvocetplt: '/t/bu/invoicetplt/addInvocetplt', //新增发票
	getInvocetpltInfo: '/t/bu/invoicetplt/getInvocetpltInfo', //获得发票模板信息
	deleteInvocetplt: '/t/bu/invoicetplt/deleteInvocetplt', //删除发票模板
	updateInvoice: '/t/bu/invoicetplt/updateInvoice', //修改发票模板
	orderList: '/t/bo/order/list', //获取订单列表
	selectOilNo: '/sightseer/selectOilNo', //查询所有油型号
	getBuyerAddressListUnPage: '/t/bu/address/getBuyerAddressListUnPage', //采购商收货地址列表(不分页)
	addBuyerAddress: '/t/bu/address/addBuyerAddress', //采购商添加收货地址
	deletePlans: '/t/bp/plan/deletePlans', //删除购油计划
	getBuyOilPlanDetail: '/t/bp/plan/getBuyOilPlanDetail', //购油计划详情 （bpPlanId：买油计划id（String））
	buyOilRecommend: '/t/bp/plan/buyOilRecommend', //买油推荐（bpPlanId：买油计划id（String）））
	getTransPrice: 't/bo/order/getTransPrice', //获取物流费用
	recomPalceOrder: '/t/bo/order/recomPalceOrder', //推荐购油下单
	getTransPriceList: '/t/bo/order/getTransPriceList', //获取多个油库的物流价格
	getOrderStatusCount: '/t/bo/order/getOrderStatusCount', //获取订单数量
	delectOrder: '/t/bo/order/delectOrder', //删除订单
	cancelOrder: '/t/bo/order/cancelOrder', //取消订单
	addCartInfo: '/t/bu/cart/addCartInfo', //添加购物车
	deleteCart: '/t/bu/cart/deleteCart', //添加购物车
	getTwoPlaceTranPrice: '/common/order/getTwoPlaceTranPrice', //获取两地物流费
	addToOrder: '/common/order/addToOrder', //添加物流需求
	getToOrderDetail: '/common/order/getToOrderDetail', //获取物流订单详情
	getToOrderList: '/common/order/getToOrderList', //获取物流订单列表
	deleteToOrder: '/common/order/deleteToOrder', //删除物流订单
	upperOrLowerToOrder:'/common/order/upperOrLowerToOrder',//订单上下架
//	cancelToOrder: '/common/order/cancelToOrder', //取消物流订单
	updateToOrderTranPrice: '/common/order/updateToOrderTranPrice', //修改物单流价
	paymented: '/t/bo/order/paymented', //已打款
	confirmOrder: '/t/bo/order/confirmOrder', //订单详情
	getOrderTranInfo: '/t/bo/transport/getOrderTranInfo', //查询物流信息
	confirmReceipt: '/t/bo/order/confirmReceipt', //采购商确认收货
	getBuyerVipSystem: '/t/bu/account/getBuyerVipSystem', //获取采购商会员体系
	addInvoice: '/t/bu/invoice/addInvoice', //申请开票
	pictureUpload: '/common/user/pictureUpload', //上传用户头像图片
	changePassword: '/common/user/changePassword', //修改密码(登入后修改)
	getMoreConfirmOrder: '/t/bo/order/getMoreConfirmOrder', //多个订单详情
	paymentMoreOrder: '/t/bo/order/paymentMoreOrder', //多个订单待支付
	getOnSiteRepotrFromInfoList: '/t/on/site/getOnSiteRepotrFromInfoList', //加油站报表
	getOnSiteRepotrFromInfo: '/t/on/site/getOnSiteRepotrFromInfo', //图表信息
	judgementStock: '/t/bu/cart/judgementStock', //购物车确定吨数是否大于库存
	getBuPurse:'/t/bo/order/getBuPurse',//返现金额
	applyPriceChange:'/t/bo/order/applyPriceChange',//申请改价

	//供应商接口
	getSuSupplierOilDepotList: '/supplier/getSuSupplierOilDepotList', //供应商油库列表
	getSupplierBaseInfo: '/supplier/getSupplierBaseInfo', //获取供应商基本信息
	getSupplierOrderList: '/supplier/getSupplierOrderList', //获取供应商订单列表
	getSupplierOrderDetail: '/supplier/getSupplierOrderDetail', //获取供应商订单详情
	getSupplierPerfectInfo: '/supplier/getSupplierPerfectInfo', //获取供应商企业认证资料信息
	perfectSupplierInfo: '/supplier/perfectSupplierInfo', //供应商企业认证
	getOilInventory: '/supplier/getOilInventory', //查询油库库存信息
	deteleOilStoresOil: '/supplier/deteleOilStoresOil', //油库删除出售油种类
	addStoreSurplus: '/supplier/addStoreSurplus', //添加油库库存入库信息
	getOilStoresPrices: '/supplier/getOilStoresPrices', //查询油库油价规则
	updateOilStoresOil: '/supplier/updateOilStoresOil', //修改出售油种类
	//supplierShipment:'/supplier/supplierShipment',//供应商订单确定出货
	supplierOrderOutStock: '/supplier/supplierOrderOutStock', //供应商订单确定出货
	getSupplierVipSystem:'/supplier/getSupplierVipSystem',//获取供应商会员体系
	supOrderOffer:'/supplier/supOrderOffer',//供应商订单优惠
	supOrderExamine:'/supplier/supOrderExamine',//供应商订单支付审核
	updateSupReceiptType:'/supplier/updateSupReceiptType',//修改供应商收付款方式
	
	//普通机构接口
	getCpAccountPurseInfo:'/oilorg/account/getCpAccountPurseInfo', //获取用户账户余额信息
	getCpAccountBaseInfo: '/oilorg/account/getCpAccountBaseInfo', //获取团油机构基本信息
	getCompanyVipSystem: '/oilorg/account/getCompanyVipSystem', //获取普通用油机构会员体系
	perfectCpAuthInfo: '/oilorg/account/perfectCpAuthInfo', //用油机构企业信息认证
	getCpAccountAuthInfo: '/oilorg/account/getCpAccountAuthInfo', //查询用油机构认证信息
	getOrgAuthList: '/oilorg/auth/getOrgAuthList', //获取权限组列表
	getOrgAuthPeopleList: '/oilorg/auth/getOrgAuthPeopleList', //获取权限组人员列表
	addOrgAuth: '/oilorg/auth/addOrgAuth', //添加权限组
	addPeopleInfo: '/oilorg/auth/addPeopleInfo', //添加权限组人员
	deleteOrgAuth: '/oilorg/auth/deleteOrgAuth', //删除权限组
	deletePeopleInfo: '/oilorg/auth/deletePeopleInfo', //删除权限组人员
	batchUpdateAuthPeopleInfo: '/oilorg/auth/batchUpdateAuthPeopleInfo', //批量移动人员到别的权限组
	batchDeleteAuthPeopleInfo: '/oilorg/auth/batchDeleteAuthPeopleInfo', //批量删除权限组人员信息 请求数据如[acOrgAuthId(权限组用户id),acOrgAuthId]
	updateOrgAuth: '/oilorg/auth/updateOrgAuth', //更新权限组
	investMoney: '/oilorg/purse/investMoney', //充值
	getPurseBalanceInfo: '/oilorg/purse/getPurseBalanceInfo', //查询余额记录(账单记录)
	getRepotrFromList: '/oilorg/auth/getRepotrFromList', //排行榜列表
	getRepotrFromInfo: '/oilorg/auth/getRepotrFromInfo', //报表统计图信息
	getCpInvoceTpltInfo: '/oilorg/invoice/tplt/getCpInvoceTpltInfo', //获得发票模板信息
	getCpInvoiceTpltList: '/oilorg/invoice/tplt/getCpInvoiceTpltList', //普通机构发票模板列表
	addCpInvoiceTplt: '/oilorg/invoice/tplt/addCpInvoiceTplt', //新增普通机构发票模板
	deleteCpInvoiceTplt: '/oilorg/invoice/tplt/deleteCpInvoiceTplt', //删除发票模板
	updateCpInvoice: '/oilorg/invoice/tplt/updateCpInvoice', //修改发票模板
	getInvestMoneyInfo: '/oilorg/invoice/getInvestMoneyInfo', //查询充值记录
	applyInvoice: '/oilorg/invoice/applyInvoice', //普通机构申请开票

	//车服商接口
	getCsServiceList: '/carDealer/account/getCsServiceList', //获取车服商服务列表
	getCsLabelList: '/carDealer/account/getCsLabelList', //获取标签列表
	uploadCarDealService: '/carDealer/account/uploadCarDealService', //上传车服商服务站点
	updateCsService: '/carDealer/account/updateCsService', //修改车服商服务信息
	getCsServiceDetail: '/carDealer/account/getCsServiceDetail', //获取车服商服务详情
	getCSBaseInfo: '/carDealer/account/getCSBaseInfo', //获取车服商基本信息
	getCSPerfectInfo: '/carDealer/account/getCSPerfectInfo', //获取车服商获取企业认证信息
	perfectCSInfo: '/carDealer/account/perfectCSInfo', //车服商企业认证
	deleteCsService: '/carDealer/account/deleteCsService', //删除车服商信息

	//物流商接口
	getCarrierCanRecOrder: '/tr/account/getCarrierCanRecOrder', //获取物流商可接的订单	
	getCarrierAuthInfo: '/tr/account/getCarrierAuthInfo', //获取物流商认证信息	
	perfectCarrierInfo: '/tr/account/perfectCarrierInfo', //物流商企业认证
	getCarrierCanRecOrderDetail: '/tr/account/getCarrierCanRecOrderDetail', //获取物流商可接的订单详情
	carrierRecOrder: '/tr/account/carrierRecOrder', //物流商接单
	updateBasePrice: '/tr/account/updateBasePrice', //修改基础价格(transPrice:修改的物流价格(BigDecimal))
	carrierRecOrderFinish: '/tr/account/carrierRecOrderFinish', //物流商订单已完成
	getTransAccountBaseInfo: '/tr/account/getTransAccountBaseInfo', //查询物流商账户基信息
	getTranOrderList: '/tr/account/getTranOrderList', //获取物流单列表
	getTrToolList: '/tr/tool/getTrToolList', //获取交通工具车牌号列表
	getTrWorkerList: '/tr/worker/getTrWorkerList', //获取物流商物流人员列表
	configCarrierRecOrder: '/tr/account/configCarrierRecOrder', //配置已接物流单
	getCarrierConfigInfo: '/tr/account/getCarrierConfigInfo', //查询订单配置信息
	signOrder: '/tr/account/signOrder', //物流商签收接口
	carrierRecOrderOutStock: '/tr/account/carrierRecOrderOutStock', //物流商订单出库
	getPlatformTranPrice:'/tr/account/getPlatformTranPrice',//获取运费价
	getDemandOrderList:'/tr/account/getDemandOrderList',//抢单需求单列表
	addFavorites:'/tr/account/addFavorites',//添加收藏夹
	getToOrderDetail:'/tr/account/getToOrderDetail',//抢单需求单订单详情(我的收藏夹订单详情可复用)
	getFavoritesList:'/tr/account/getFavoritesList',//我的需求确认单列表（我的收藏夹）
	//取件
	checkOrderPickupCode:'/t/bo/order/checkOrderPickupCode',//校验提取码
	checkOrderDetailInfo:'/t/bo/order/checkOrderDetailInfo',//校验详情
	
};

// 设置token值
function setToken(tokenValue) {
	localStorage.setItem("token", tokenValue);
}

// 获取token值
function getToken() {
	return localStorage.getItem("token");
}

// 清除token值
function removeToken() {
	localStorage.removeItem("token");
}

// 存储本地全局键值
function save_localStorage(key, value) {
	if(value instanceof Array) {
		localStorage.setItem(key, JSON.stringify(value));
	} else {
		localStorage.setItem(key, value);
	}
}

// 获取本地全局键值
function get_localStorage(key) {
	return localStorage.getItem(key);
}

// 获取本地数组全局键值
function getArrayValueOfKey(key) {
	return JSON.parse(localStorage.getItem(key));
}

// 清除本地全局键值
function remove_localStorage(key) {
	localStorage.removeItem(key);
}

function alertCer(datas) {
	if(confirm(datas)) {
		window.location.href = "../" + get_localStorage("line_status") + "/certification_office.html" + '?_r=' + Math.random();
	}
}

function alert_oil(datas) {
	if(confirm(datas)) {
		window.location.href = "certification_oilstation.html" + '?_r=' + Math.random();
	}
}
var util = {
	get_ajax: function(url, data, success) {
		var _$ = $;
		_$.ajax({
			type: "GET",
			url: url,
			dataType: "json",
			data: data,
			contentType: 'application/json',
			beforeSend: function(response) {
				response.setRequestHeader("token", getToken());
			},
			success: function(response) {
				if(response.code == RETCODE_TOKEN_INVALID) {
					console.log(response)
					alert(response.message);
					window.location.href = "../login.html";
					return false;
				} else if(response.code == ACCOUNT_DATA_APPROVAL) {
					toast(response.message)
					return;
				} else if(response.code == ACCOUNT_DATA_NO_PASS) {
					alertCer(response.message);
					return;
				} else if(response.code == ACCOUNT_DATA_NO_IN) {
					alertCer(response.message);
					return;
				} else if(response.code == ACCOUNT_DATA_OILSTATION) {
					alert_oil(response.message)

				} else if(response.code == RETCODE_FAILED) {
					toast(response.message)
				} else {
					success(response);
				}
			},
			error: function(error) {
//				alert("网络异常")
			}
		});
	},
	post_ajax: function(url, data, success) {
		$.ajax({
			type: "post",
			url: url,
			data: JSON.stringify(data),
			dataType: "json",
			contentType: 'application/json',
			beforeSend: function(response) {
				response.setRequestHeader("token", getToken());
			},
			success: function(response) {
				if(response.code == RETCODE_TOKEN_INVALID) {
					toast(response.message);
					window.location.href = "../login.html";
					return false;
				} else if(response.code == ACCOUNT_DATA_APPROVAL) {
					toast(response.message);
					return;
				} else if(response.code == ACCOUNT_DATA_NO_PASS) {
					alertCer(response.message);
					return;
				} else if(response.code == ACCOUNT_DATA_NO_IN) {
					alertCer(response.message);
					return;
				} else if(response.code == ACCOUNT_DATA_OILSTATION) {
					alert_oil(response.message);
				} else if(response.code == RETCODE_FAILED) {
					toast(response.message);
				} else {
					success(response);
				}
			},
			error: function(error) {
//				toast("网络异常")
			}
		});
	},

}

function timestampDay(timestamp) { //精确到天
	var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	Y = date.getFullYear() + '-';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '';
	return Y + M + D;
}

function timestampToTime(timestamp){ //精确到分
	var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	Y = date.getFullYear() + '-';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + "  ";
	h = date.getHours() + ':';
	m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + '';
	return Y + M + D + h + m
}

function clear_page() {
	setTimeout(function() {
		window.history.go(0);
	}, 500)

}

function init_page() { //页面刷新
	setTimeout(function() {
		window.history.go(0);
	}, 500)
}

function set_cookie(name, value) { //设置cookie
	var days = new Date();
	days.setTime(days.getTime() + 12 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + days.toGMTString();
}

function get_cookie(name) { //获取cookie
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if(arr = document.cookie.match(reg)) {
		return unescape(arr[2]);
	} else {
		return null;
	}
};

function del_cookie(name) { //删除cookie
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = get_cookie(name);
	if(cval != null) {
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
}

//小数运算（精准）
var operation = {
	/*加法函数，返回值：arg1加上arg2的精确结果*/
	numAdd: function(arg1, arg2) {
		var r1, r2, m;
		try {
			r1 = arg1.toString().split(".")[1].length
		} catch(e) {
			r1 = 0
		}
		try {
			r2 = arg2.toString().split(".")[1].length
		} catch(e) {
			r2 = 0
		}
		m = Math.pow(10, Math.max(r1, r2))
		return(arg1 * m + arg2 * m) / m
	},
	/*减法函数, 返回值：arg1减去arg2的精确结果*/
	numSubtract: function(arg1, arg2) {
		var r1, r2, m, n;
		try {
			r1 = arg1.toString().split(".")[1].length
		} catch(e) {
			r1 = 0
		}
		try {
			r2 = arg2.toString().split(".")[1].length
		} catch(e) {
			r2 = 0
		}
		m = Math.pow(10, Math.max(r1, r2));
		//动态控制精度长度
		n = (r1 >= r2) ? r1 : r2;
		return((arg1 * m - arg2 * m) / m).toFixed(n);
	},
	/*乘法函数 返回值：arg1乘以arg2的精确结果*/
	numMultiply: function(arg1, arg2) {
		var m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length
		} catch(e) {}
		try {
			m += s2.split(".")[1].length
		} catch(e) {}
		return(Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)).toFixed(2);
	},
	/*除法函数, 返回值：arg1除以arg2的精确结果*/
	numDivide: function(arg1, arg2) {
		var t1 = 0,
			t2 = 0,
			r1, r2;
		try {
			t1 = arg1.toString().split(".")[1].length
		} catch(e) {}
		try {
			t2 = arg2.toString().split(".")[1].length
		} catch(e) {}
		with(Math) {
			r1 = Number(arg1.toString().replace(".", ""));
			r2 = Number(arg2.toString().replace(".", ""));
			return(r1 / r2) * pow(10, t2 - t1);
		}
	}
}