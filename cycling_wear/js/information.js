$(function () {
    //去服务主页
    page_change("#account", 'homePage.html');

    //设置
    page_change("#setpager",'setuppager.html')

    //企业认证
    page_change("#businessCertification",'certification_office.html');
    //发票信息
    page_change("#invoice",'invoiceList.html');
    //会员体系
    page_change("#membershipsystem",'vip_system.html');
    //优惠活动
    page_change("#activity",'activity.html');
    setData();
});

function setData() {
    var url = re_url(methods.getCSBaseInfo);
    var data = {
    };
    var success = function(response) {
        if(response['code'] == RETCODE_SUCCESS) {
            var data = response['data'];
            save_localStorage('avatarUrl', data.avatarUrl);
            $('.Headportrait').attr('src', data.avatarUrl);
            data.authStatus = data.authStatus == 0? '未认证 ': data.authStatus == 1?'已认证 ':
                data.authStatus == 2?'资料审核中':'审核不通过';
            $('#authStatus').text(data.authStatus);
            $('#name').text(data.name);
            $('.text3').text(data.phoneNumber);
            $('.text2').text(data.level+'级会员');
        }
    };
    util.get_ajax(url, data, success);
}
