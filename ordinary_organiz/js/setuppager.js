$(function () {
    setCss();
    page_change("#updatePass","updatepassword.html");
	page_change("#buttonstyle","../login.html");
	page_change("#brief-introduction","http://www.youone.cn/app-res/appWeb/instructions/aboutUs/index.html");
	page_change("#user-agreement","http://www.youone.cn/app-res/appWeb/readAndInstructions/userAgreement/index.html");
	$("#buttonstyle").click(function(){
        removeToken();
	});
    $('#avatarImage').click(function () {
       $(this).next().click(); 
    });
    
    $(".top_icon").click(function(){
    	page_back();
    	sessionStorage.setItem('refresh', 'true');
    })
});
/**
 * 显示选择图片路径
 */
$(document).on('change', ".file", function () {
    var objUrl = getObjectURL(this.files[0]);
    if (objUrl) {
        // 在这里修改图片的地址属性
        var _this = $(this);
        pictureUpload(_this, objUrl);
    }
});
//上传头像
function pictureUpload(_this, objUrl) {
    var file =document.getElementsByClassName("file")[0].files[0];
    var form = new FormData();
    form.append("avatarImage",file);
    ajaxRequestForm(api + methods.pictureUpload, form, function (result) {
        _this.prev().prop("src",objUrl);
    });
}

function setCss() {
    $('.Headportrait').css('height', $('.Headportrait').width());
    $('#avatarImage').prop('src', get_localStorage('avatarUrl'));
        //返回
        $(".break").click(function () {
            page_back();
        });


    var expanded = "true";
    $("#aboutus").click(function () {
        var aboutusicon = $("#aboutusicon");
        if (expanded == "true") {
            aboutusicon.addClass("fa-rotate-90");
        } else {
            aboutusicon.removeClass("fa-rotate-90");
        }
        expanded = $(this).attr("aria-expanded");
    });
}

