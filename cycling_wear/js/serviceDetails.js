$(function () {
    //编辑
    page_change(".disclaimer", 'uploading.html');
    setCss();
    setData();
});

//赋值
function setData() {
    var url = re_url(methods.getCsServiceDetail);
    var data = {
        "csServiceId":get_localStorage('csServiceId')
    };
    var success = function(response) {
        if(response['code'] == RETCODE_SUCCESS) {
            var data = response['data'];
            var carousel = '';
            var csSvcImageList = '';
            $.each(data.csSvcImageList, function (index, value) {
                carousel += '<div><img src="'+ value.imageUrl +'"></div>';
                csSvcImageList += '<div class="relevantQualifications"><img src="'+ value.imageUrl +'"></div>';
            });
            $('#slider-example').html(carousel);
            $('#photoServer').html(csSvcImageList);
            $('#storeName').text(data.storeName);
            $('#detailAddr').text(data.detailAddr);
            $('#storeContact').text(data.storeContact);
            $('#storeTel').text(data.storeTel);
            $('#labelName').text(data.labelName);
            $('#serviceDesc').text(data.serviceDesc);
            $('#serverName').text(data.serverName);
            $('#serviceUrl').text(data.serviceUrl);
            var csSvcQuaList = '';
            $.each(data.csSvcQuaList, function (index, value) {
                csSvcQuaList += '<div class="relevantQualifications"><img src="'+ value.imageUrl +'"></div>';
            });
            if (data.serviceDesc.length <= 20) {
                $(".unfold").hide();
            }
            $('#csSvcQuaList').html(csSvcQuaList);
            if (data.csSvcImageList.length == 1) {
                $('#slider-example').find("img").css('height', 'auto').css('width', '100%');
            }
            $('#slider-example').sliderInit({
                'navigation': 'hover',
                'indicator': 'always',
                'speed': 500,    //速度
                'delay': 5000,    //延迟
                'transition': 'slide',
                'loop': true,
                'group': 1
            });
        }
    };
    util.get_ajax(url, data, success);
}

function setCss() {
    $('.unfold').click(function () {
        var parent = $(this).parent().parent();
        parent.prev().removeClass('more_than_omit');
        parent.hide();
        parent.next().show()
    });
    $('.packUp').click(function () {
        var parent = $(this).parent().parent();
        parent.prev().prev().addClass('more_than_omit');
        parent.hide();
        parent.prev().show()
    });
}