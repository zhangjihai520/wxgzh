var csServiceId = get_localStorage('csServiceId');
var deleteCsSvcImageIdList = '';
var deleteCsSvcQuaIdList = '';
$(function () {
    //返回
    $(".break").click(function () {
        go_page("homePage.html")
    });
    getCsLabelList();
    //提交
    submitCs("#add", methods.uploadCarDealService);
    submitCs("#update", methods.updateCsService);
    initCropper($('#tailoringImg'),$('#chooseImg'));
});

//修改进来
function updateSetData() {
    var url = re_url(methods.getCsServiceDetail);
    var data = {
        "csServiceId":csServiceId
    };
    var success = function(response) {
        if(response['code'] == RETCODE_SUCCESS) {
            var data = response['data'];
            $("input[name='csServiceId']").val(csServiceId);
            $("input[name='storeName']").val(data.storeName);
            $(".checke_address").val(data.addressName);
            // $("select[name='bdDistrictId']").val();
            save_localStorage("bdDistrictId", data.bdDistrictId);
            $("input[name='storeAddress']").val(data.storeAddress);
            $("input[name='storeContact']").val(data.storeContact);
            $("input[name='storeTel']").val(data.storeTel);
            $('#'+data.csLabelId).parent().find('.checkServiceType').removeClass('checkServiceType');
            $('#'+data.csLabelId).addClass('checkServiceType');
            $("textarea[name='serviceDesc']").val(data.serviceDesc);
            $("input[name='serviceUrl']").val(data.serviceUrl);
            var csSvcQuaList = '';
            $.each(data.csSvcQuaList, function (index, value) {
                csSvcQuaList += '<div class="relevantQualifications deleteCsSvcQuaIdList quSvcImageDiv tailorPhoto" id="'+ value.csSvcQualId +'"><img class="selectImage" src="' + value.imageUrl + '"><input type="file" class="file" name="quSvcImages"></div>';
            });
            $(".addImg").before($(csSvcQuaList));
            var csSvcImageList = '';
            $.each(data.csSvcImageList, function (index, value) {
                csSvcImageList += '<div class="relevantQualifications csSvcImageDiv" id="'+ value.csSvcImageId +'"><img class="selectImage" src="'+ value.imageUrl +'"><input type="text" class="file csSvcImageFile" name="csSvcImages"></div>';
            });
            $(".addServiceImg").before($(csSvcImageList));
            // $('#province').val(data.bdProvinceId);
            // getCity(data.bdProvinceId, function () {
            //     $('#city').val(data.bdCityId);
            // });
            // getDistrict(data.bdCityId, function () {
            //     $('#district').val(data.bdDistrictId);
            // });
        }
    }
    util.get_ajax(url, data, success);
}

function submitCs(object, url) {
    $(object).click(function () {
        var boo = null == csServiceId || csServiceId == '';
        var storeName = $("input[name='storeName']").val();
        // var bdDistrictId  = $("select[name='bdDistrictId']").val();
        var bdDistrictId  = get_localStorage("bdDistrictId");
        var storeAddress = $("input[name='storeAddress']").val();
        var storeContact = $("input[name='storeContact']").val();
        var storeTel = $("input[name='storeTel']").val();
        var csLabelId = $(".checkServiceType").attr('id');
        var serviceDesc = $("textarea[name='serviceDesc']").val();
        var serviceUrl = $("input[name='serviceUrl']").val();
        if (boo) {
            $("input[name='quSvcImages']").each(function(){
                if (null == $(this).val() || $(this).val() == '') {
                    $(this).parent().remove();
                }
            });
            var quSvcImages = $("input[name='quSvcImages']");
            $(".csSvcImageFile").each(function(){
                if (null == $(this).val() || $(this).val() == '') {
                    $(this).parent().remove();
                }
            });
        }
        var csSvcImages = $(".csSvcImageFile");
        if (null == storeName || storeName == '') {
            toast('请输入服务名称');
        } else if (null == bdDistrictId || bdDistrictId == '') {
            toast('请选择省市区');
        } else if (null == storeAddress || storeAddress == '') {
            toast('请输入详细地址');
        } else if (null == storeContact || storeContact == '') {
            toast('请输入联系人');
        } else if (null == storeTel || storeTel == '') {
            toast('请输入联系电话');
        } else if (null == serviceDesc || serviceDesc == '') {
            toast('请输入服务简介');
        } else if (null == serviceUrl || serviceUrl == '') {
            toast('请输入服务网址');
        } else {
            var bu = true;
            if (boo) {
                if (quSvcImages.length == 0) {
                    toast('请选择相关资质图片');
                    bu =false;
                } else if (csSvcImages.length == 0) {
                    toast('请选择服务图片');
                    bu =false;
                }
            }
            if (bu) {
                $("input[name='bdDistrictId']").val(bdDistrictId);
                $("input[name='csLabelId']").val(csLabelId);
                $("input[name='deleteCsSvcImageIdList']").val(deleteCsSvcImageIdList);
                $("input[name='deleteCsSvcQuaIdList']").val(deleteCsSvcQuaIdList);
                var formDate = new FormData($("#dealService")[0]);
                console.log(formDate);
                ajaxRequestForm(api + url, formDate, function (result) {
                    // toast('添加成功');
                    //页面返回后确认刷新
                    sessionStorage.setItem('refresh', 'true');
                    page_back();
                });
            }
        }
    });

}

/**
 * @param file: 上传的图片
 * @param objCompressed：压缩后的图片规格
 * @param objDiv：容器或回调函数
 */
function photoCompress(file, objCompressed, callback) {
    var ready = new FileReader();
    ready.readAsDataURL(file);
    ready.onload = function() {
        var fileResult = this.result;
        canvasDataURL(fileResult, objCompressed, callback)
    }
}

function canvasDataURL(path, objCompressed, callback) {
    var img = new Image();
    img.src = path;
    img.onload = function() {
        var that = this;
        //默认压缩后图片规格
        var quality = 0.5;
        var w = that.width;
        var h = that.height;
        var scale = w / h;
        //实际要求
        w = objCompressed.width || w;
        h = objCompressed.height || (w / scale);
        if(objCompressed.quality && objCompressed.quality > 0 && objCompressed.quality <= 1) {
            quality = objCompressed.quality;
        }
        //生成canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        var base64 = canvas.toDataURL('image/jpeg', quality);
        // 回调函数返回base64的值
        callback(base64);
    }

}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while(n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {
        type: mime
    });
}

//获取标签列表
function getCsLabelList() {
    var url = re_url(methods.getCsLabelList);
    var data = {};
    var success = function(response) {
        if(response['code'] == RETCODE_SUCCESS) {
            var val = response['data'];
            var src = '';
            $.each(val, function (index, value) {
                if (index == 0) {
                    src += '<div class="serviceType font_3 text-center checkServiceType pt-1 pb-1" id="'+ value.csLabelId +'">'+ value.name +'</div>';
                } else {
                    src += '<div class="serviceType font_3 text-center pt-1 pb-1" id="'+ value.csLabelId +'">' + value.name + '</div>';
                }
            });
            $("#labelList").html(src);
            if (null != csServiceId && csServiceId != '') {
                $("#add").hide();
                $("#update").show();
                updateSetData();
            }
        }
    };
    util.get_ajax(url, data, success);
}

//添加图片
$(document).on('click', '.addImg', function () {
    $(this).before($('<div class="relevantQualifications quSvcImageDiv" style="display: none"><img class="selectImage" src=""><input type="file" class="file" name="quSvcImages"></div>'));
    $(this).prev().children('input').click();
});

//添加图片
$(document).on('click', '.addServiceImg', function () {
    $(this).before($('<div class="relevantQualifications tailorPhotoRemove" style="display: none"><img class="selectImage" src=""><input type="text" class="file csSvcImageFile" name="csSvcImages"></div>'));
    $(this).prev().children('input').click();
});

//点击替换图片
$(document).on('click', '.selectImage', function () {
    if ($(this).parent().hasClass('quSvcImageDiv')) {
        $(this).next('input').click();
    } else {
        $(this).parent().addClass('tailorCsSvcPhoto');
        $(".tailoring-container").toggle();
    }
});

/**
 * 显示选择图片路径
 */
$(document).on('change', "input[name='quSvcImages']", function () {
    var _this = this;
    var objUrl = getObjectURL(this.files[0]);
    if (objUrl) {
        // 在这里修改图片的地址属性
        $(this).prev().prop("src",objUrl);
        $(this).parent().show();
        if ($(this).parent().hasClass('tailorPhoto')) {
            console.log($(this).parent().attr('id'));
            if (deleteCsSvcQuaIdList == '') {
                deleteCsSvcQuaIdList = $(this).parent().attr('id');
            } else {
                deleteCsSvcQuaIdList += ','+ $(this).parent().attr('id');
            }
            $(this).parent().removeClass("tailorPhoto");
        }
    }
});

/**
 * 显示选择图片路径
 */
// $(document).on('change', "input[name='csSvcImages']", function () {
//     var _this = $(this);
//     var objUrl = getObjectURL(this.files[0]);
//
//     if (objUrl) {
//         // 在这里修改图片的地址属性
//         $(this).prev().prop("src",objUrl);
//         $(this).parent().show();
//         $("<img/>").attr("src", objUrl).load(function() {
//             /*
//               如果要获取图片的真实的宽度和高度有三点必须注意
//               1、需要创建一个image对象：如这里的$("<img/>")
//               2、指定图片的src路径
//               3、一定要在图片加载完成后执行如.load()函数里执行
//              */
//             var realWidth = this.width;
//             var realHeight = this.height;
//             //如果真实的宽度大于浏览器的宽度就按照100%显示
//             console.log(realWidth+":"+realHeight);
//             var width = operation.numDivide(realWidth, realHeight);
//             if (width < 1.5 || width > 2) {
//                 _this.parents('.relevantQualifications').remove();
//                 toast('您选择的图片不符合要求！！！')
//             }
//         });
//     }
// });

//选中服务类型
$(document).on('click', '.serviceType', function () {
   $(this).parent().find('.checkServiceType').removeClass('checkServiceType');
   $(this).addClass('checkServiceType');
});

function getProvinces() {
    $("select[name='city']").focus(function () {
        var _this = $(this);
        var  bdProvinceId = _this.parent().prev().children("select").val();
        if (bdProvinceId == "") {
            _this.html('<option value="">请选择</option>')
            toast("请先选择省份！");
        } else {
            getCity(bdProvinceId, function () {

            });
        }
    });
    $("select[name='bdDistrictId']").focus(function () {
        var _this = $(this);
        var  bdCityId = _this.parent().prev().children("select").val();
        if (bdCityId == "") {
            _this.html('<option value="">请选择</option>')
            toast("请先选择城市！");
        } else {
            getDistrict(bdCityId, function () {

            });
        }
    });
}

//获取省
function getProvince() {
    buildSelectorContent(methods.getProvinceList,
        {},
        true,
        "bdProvinceId",
        "provinceName",
        ["#province"],null, false);
}

//获取城市
function getCity(bdProvinceId, suc) {
    buildSelectorContentCity(methods.getCityList,
        {"bdProvinceId":bdProvinceId},
        true,
        "bdCityId",
        "name",
        ["#city"],null, false, suc);
}

//获取区
function getDistrict(bdCityId, suc) {
    buildSelectorContentCity(methods.list,
        {"bdCityId":bdCityId},
        true,
        "bdDistrictId",
        "name",
        ["#district"],null, false, suc);
}

//弹出框水平垂直居中
(window.onresize = function () {
    var win_height = $(window).height();
    var win_width = $(window).width();
    if (win_width <= 768){
        $(".tailoring-content").css({
            "top": (win_height - $(".tailoring-content").outerHeight())/2,
            "left": 0
        });
    }else{
        $(".tailoring-content").css({
            "top": (win_height - $(".tailoring-content").outerHeight())/2,
            "left": (win_width - $(".tailoring-content").outerWidth())/2
        });
    }
})();

//弹出图片裁剪框
$(document).on("click", '.addServiceImg', function () {
    $(".tailoring-container").toggle();
});
//图像上传
function selectImg(file) {
    if (!file.files || !file.files[0]){
        return;
    }

    var reader = new FileReader();
    reader.onload = function (evt) {
        var replaceSrc = evt.target.result;
        //更换cropper的图片
        $('#tailoringImg').cropper('replace', replaceSrc,false);//默认false，适应高度，不失真
    }
    reader.readAsDataURL(file.files[0]);
}
//cropper图片裁剪
// $('#tailoringImg').cropper({
//     aspectRatio: 16/9,//默认比例
//     preview: '.previewImg',//预览视图
//     guides: false,  //裁剪框的虚线(九宫格)
//     autoCropArea: 0.5,  //0-1之间的数值，定义自动剪裁区域的大小，默认0.8
//     movable: false, //是否允许移动图片
//     dragCrop: true,  //是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
//     movable: true,  //是否允许移动剪裁框
//     resizable: true,  //是否允许改变裁剪框的大小
//     zoomable: false,  //是否允许缩放图片大小
//     mouseWheelZoom: false,  //是否允许通过鼠标滚轮来缩放图片
//     touchDragZoom: true,  //是否允许通过触摸移动来缩放图片
//     rotatable: true,  //是否允许旋转图片
//     crop: function(e) {
//         // 输出结果数据裁剪图像。
//     }
// });
// //旋转
// $(".cropper-rotate-btn").on("click",function () {
//     $('#tailoringImg').cropper("rotate", 45);
// });
// //复位
// $(".cropper-reset-btn").on("click",function () {
//     $('#tailoringImg').cropper("reset");
// });
// //换向
// var flagX = true;
// $(".cropper-scaleX-btn").on("click",function () {
//     if(flagX){
//         $('#tailoringImg').cropper("scaleX", -1);
//         flagX = false;
//     }else{
//         $('#tailoringImg').cropper("scaleX", 1);
//         flagX = true;
//     }
//     flagX != flagX;
// });
//
// //裁剪后的处理
// $(document).on("click", '#sureCut', function () {
//     if ($("#tailoringImg").attr("src") == null ){
//         toast("请选择正常图片");
//         return false;
//     }else{
//         var cas = $('#tailoringImg').cropper('getCroppedCanvas');//获取被裁剪后的canvas
//         var base64url = cas.toDataURL('image/png'); //转换为base64地址形式
//         console.log("压缩前：" + base64url.length);
//         // $("#finalImg").prop("src",base64url);//显示为图片的形式
//         suofang(base64url, 0.8, function (blob, base64) {
//             console.log("压缩后：" + base64.length);
//             if ($('.container').hasClass('tailorPhoto')) {
//                 $(".tailorPhoto").find('img').prop("src",base64url);
//                 $(".tailorPhoto").find('input').val(base64url);
//                 $(".tailorPhoto").removeClass('tailorPhoto');
//             } else {
//                 $("img[class=selectImage]:last").prop("src",base64url);
//                 $("img[class=selectImage]:last").next().val(base64);
//                 $("img[class=selectImage]:last").parent().show().removeClass('tailorPhotoRemove');
//             }
//             //关闭裁剪框
//             $(".tailoring-container").toggle();
//         });
//     }
// });

// ------------------

// 修改自官方demo的js
var initCropper = function (img, input){
    var $image = img;
    var options = {
        aspectRatio: 1.8, // 纵横比
        viewMode: 2,
        preview: '.img-preview' // 预览图的class名
    };
    $image.cropper(options);
    var $inputImage = input;
    var uploadedImageURL;
    if (URL) {
        // 给input添加监听
        $inputImage.change(function () {
            var files = this.files;
            var file;
            if (!$image.data('cropper')) {
                return;
            }
            if (files && files.length) {
                file = files[0];
                // 判断是否是图像文件
                if (/^image\/\w+$/.test(file.type)) {
                    // 如果URL已存在就先释放
                    if (uploadedImageURL) {
                        URL.revokeObjectURL(uploadedImageURL);
                    }
                    uploadedImageURL = URL.createObjectURL(file);
                    // 销毁cropper后更改src属性再重新创建cropper
                    $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
                    $inputImage.val('');
                } else {
                    window.alert('请选择一个图像文件！');
                }
            }
        });
    } else {
        $inputImage.prop('disabled', true).addClass('disabled');
    }
}
var crop = function(){
    var $image = $('#tailoringImg');
    var $target = $("img[class=selectImage]:last");
    $image.cropper('getCroppedCanvas',{
        width:300, // 裁剪后的长宽
        height:300
    }).toBlob(function(blob){
        // 裁剪后将图片放到指定标签
        blobToDataURI(blob, function (base64) {
            // console.log(base64);
            // console.log("压缩前：" + base64.length);
            suofang(base64, 0.8, function (blobs, base64Url) {
                // console.log("压缩后：" + base64Url.length);
                // base64Url.replace(",",":");
                // console.log(base64Url);
                // $.each(base64Url.split(","), function (index, value) {
                //     console.log(value);
                // });
                if ($('.tailorCsSvcPhoto').length > 0) {
                    var tailorCsSvcPhoto = $(".tailorCsSvcPhoto");
                    tailorCsSvcPhoto.find('img').prop("src",base64Url);
                    tailorCsSvcPhoto.find('input').val(base64Url);
                    if (tailorCsSvcPhoto.hasClass('csSvcImageDiv')) {
                        console.log(tailorCsSvcPhoto.attr('id'));
                        if (deleteCsSvcImageIdList == '') {
                            deleteCsSvcImageIdList = tailorCsSvcPhoto.attr('id');
                        } else {
                            deleteCsSvcImageIdList += ','+ tailorCsSvcPhoto.attr('id');
                        }
                        tailorCsSvcPhoto.removeClass("csSvcImageDiv");
                    }
                    tailorCsSvcPhoto.removeClass('tailorCsSvcPhoto');
                } else {
                    $("img[class=selectImage]:last").prop("src",base64Url);
                    $("img[class=selectImage]:last").next().val(base64Url);
                    $("img[class=selectImage]:last").parent().show().removeClass('tailorPhotoRemove');
                }
            });
        });
        $(".tailoring-container").toggle();
    });
}

//------------------------------

function blobToDataURI(blob, callback) {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function (e) {
        callback(e.target.result);
    }
}

//关闭裁剪框
function closeTailor() {
    $(".tailorPhotoRemove").remove();
    $(".tailorCsSvcPhoto").removeClass("tailorCsSvcPhoto");
    $(".tailoring-container").toggle();
}

var suofang = function(base64, bili, callback) {
    console.log("执行缩放程序,bili=" + bili);
    //处理缩放，转格式
    var _img = new Image();
    _img.src = base64;
    _img.onload = function() {
        var _canvas = document.createElement("canvas");
        var w = this.width / bili;
        var h = this.height / bili;
        _canvas.setAttribute("width", w);
        _canvas.setAttribute("height", h);
        _canvas.getContext("2d").drawImage(this, 0, 0, w, h);
        var base64 = _canvas.toDataURL("image/jpeg");
        _canvas.toBlob(function(blob) {
            // console.log(blob.size);

            if(blob.size > 1024*1024){
                suofang(base64, bili, callback);
            }else{
                callback(blob, base64);
            }
        }, "image/jpeg");
    }
};