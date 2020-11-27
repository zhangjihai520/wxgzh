pushHistory();
window.addEventListener("popstate", function(e) {
	window.location.href = '../login.html?_r=' + Math.random();
}, false);
$(function () {
    //去我的主页
    page_change("#information", 'information.html');
    //去新增
    page_change("#uploading", 'uploading.html');
    $("#uploading").click(function () {
        remove_localStorage('csServiceId');
    });
    //去服务列表
    page_change("#list", 'serviceList.html');
});