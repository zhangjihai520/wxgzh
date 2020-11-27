$(function () {
    //返回
    $(".break").click(function () {
        go_page("homePage.html")
    });
    document.body.onmousedown = Mouse.mousedown;
    document.body.onmouseup = Mouse.mouseup;
});

var page = 1;
var size = 10;

//获取选择的车服商详情id
$(document).on('click', '.serviceList', function () {
    save_localStorage('csServiceId', $(this).attr('id'));
});

function setList() {
    var url = re_url(methods.getCsServiceList);
    var data = {
        "page":page,
        "size":size
    };
    var success = function(response) {
        if(response['code'] == RETCODE_SUCCESS) {
            var data = response['data'];
            $("#getmore").hide();
            var src = '';
            $.each(data.list, function (index, value) {
                src += '<div class="form-row borderBottom mt-2 serviceList" id="'+ value.csServiceId +'">';
                src += '<div class="col-4 serviceLogoDiv mb-2" style="background: url('+ value.imageUrl +') no-repeat;">';
                src += '</div>';
                src += '<div class="col-7 ml-2">';
                src += '<div class="form-row">';
                src += '<div class="col-12 font_6 more_than_omit storeName">'+ value.storeName +'</div>';
                src += '<div class="col-12 font_3 mt-2 more_than_omit" style="color: #616161">'+ value.detailAddr +'</div>';
                src += '<div class="col-12 font_3 mt-3"><span class="serviceType pt-1 pb-1">'+ value.labelName +'</span></div>';
                src += '</div></div></div>';
            });
            $('.serviceComment').append(src);
            if (data.list.length == size) {
                off_on = true;
            } else {
                off_on = false;
            }
            //去详情
            // page_change(".serviceList", 'serviceDetails.html');
        }
    };
    util.get_ajax(url, data, success);
}

var timeout = undefined;
var startTime = 0;
var endTime = 0;
var csServiceId;

// web端适用(长按与点击)
$(document).delegate('.serviceList', 'mousedown', function (event) {
    var _this = $(this);
    startTime = new Date().getTime();
    timeout = setTimeout(function() { // 长按
        csServiceId = _this.attr('id');
        var storeName = _this.find('.storeName').text();
        $("#delete-role-name").html(storeName);
        if (!slides) {
            $('#delete-role-dialog').modal('show');
            // $('#delete-role-dialog').modal('hide');
        }
    }, 400);
});
$(document).delegate('.serviceList', 'mouseup', function (event) {
    endTime = new Date().getTime();
    clearTimeout(timeout);
    if ((endTime - startTime) < 400) { // 单击
        window.location.href = 'serviceDetails.html?_r=' + Math.random();
    }
});

var startx, starty;
var slides = false;

//手指接触屏幕
document.addEventListener("touchstart", function(e){
    startx = e.touches[0].pageX;
    // starty = e.touches[0].pageY;
}, false);

//手指离开屏幕
document.addEventListener("touchend", function(e) {
    var endx, endy;
    endx = e.changedTouches[0].pageX;
    // endy = e.changedTouches[0].pageY;
    if (endx != startx) {
        slides = true;
    }
}, false);

var Mouse = {
    x: 0,
    y: 0,
    mousedown: function (event) {
        Mouse.y = event.clientY;
        Mouse.x = event.clientX;
    },
    mouseup: function (event) {
        if (event.clientX != Mouse.x || event.clientY != Mouse.y) {
            // console.log('slide');
            // alert('slide')
        } else {
            // console.log('click');
            // alert('click')
        }
    }
};

// phone端适用
$(document).delegate('.serviceList', 'touchstart', function (event) {
    var _this = $(this);
    startTime = new Date().getTime();
    timeout = setTimeout(function() { // 长按
        csServiceId = _this.attr('id');
        var storeName = _this.find('.storeName').text();
        $("#delete-role-name").html(storeName);
        if (!slides) {
            $('#delete-role-dialog').modal('show');
            // $('#delete-role-dialog').modal('hide');
        }
    }, 400);
});

//删除服务
$(document).on('click', '#sure-delete-role', function () {
    var url = re_url(methods.deleteCsService);
    var data = {
        "csServiceId":csServiceId
    };
    var success = function(response) {
        if(response['code'] == RETCODE_SUCCESS) {
            $('.serviceComment').html('');
            $('#delete-role-dialog').modal('hide');
            page = 1;
            setList();
            toast('删除成功！！！');
        }else{
        	toast(response.message)
        }
    };
    util.post_ajax(url, data, success);
});

//--------------上拉加载更多---------------
var off_on = true, //分页开关
    timers = null; //定时器
var p = 0, t = 0;
//加载数据
var LoadingDataFn = function () {
    if (off_on) {
        $("#getmore").show();
        setList();
    }
};

//初始化， 第一次加载
$(document).ready(function () {
    LoadingDataFn()
});

$(window).scroll(function () {
    //当时滚动条离底部60px时开始加载下一页的内容
    p = $(this).scrollTop();

    if (t <= p) {//下滚
        //
        if (($(window).height() + $(window).scrollTop() + 60) >= $(document).height()) {
            clearTimeout(timers);
            timers = setTimeout(function () {
                page++;
                // console.log("第" + page + "页");
                LoadingDataFn()
            }, 300);
        }
    } else {//上滚
        //
    }
    setTimeout(function () { t = p; }, 0);
});