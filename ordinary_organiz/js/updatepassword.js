$(function () {
    changePassword()
});

function changePassword() {
    $("#buttonstyle").click(function () {
        var oldpassword = $("#oldPassword").val();
        var newPassword = $("#newPassword").val();
        var newPasswords = $("#newPasswords").val();
        if (null == oldpassword || oldpassword == '') {
            toast('请输入原密码');
        } else if (null == newPassword || newPassword == '') {
            toast('请输入新密码');
        } else if (newPassword != newPasswords) {
            toast('两次输入不一致');
        } else {
            console.log(oldpassword);
            var url = re_url(methods.changePassword);
            var data = {
                "oldPassword":md5(oldpassword),
                "newPassword":md5(newPassword)
            };
            var success = function(response) {
                if(response['code'] == RETCODE_SUCCESS) {
                    toast('修改成功！！！');
                    setTimeout(function(){
                        page_back();
                        },800);
                }
            };
            util.post_ajax(url, data, success);
        }
    });
}

