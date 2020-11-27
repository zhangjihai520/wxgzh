$(document).ready(function(){ 
	//执行
	var groupList = [];
	groupList = get_localStorage("groupArray");
	groupList = JSON.parse(groupList);
	var htmlStr = '';
	for(var i=0;i<groupList.length;i++){
		var item = groupList[i];
		htmlStr += '<option value="" id="'+item["acOrgAuthId"]+'">'+item["title"]+'</option>';
	}
	$(".addRole").html(htmlStr);			
});		
$(function () {
    //返回
    $(".break").click(function () {
        page_back();
        sessionStorage.setItem('refresh', 'true');
    });
    addPerson();
});

function addPerson() {
    $("#addPerson").click(function () {
        var single = $(".addName").val();
        single = $.trim(single);
        var account = $(".addAccount").val();
        account = $.trim(account);
        var role = $(".addRole").val();
        role = $.trim(role);
        if (!single || single.length == 0) {
            toast('请输入用户姓名！！！')
        } else if (!account || account.length == 0) {
            toast('请输入用户账户！！！')
        } else {
			var options = $(".addRole option:selected"); 
			var orgId = options.attr("id"); //拿到选中项的值
            requestAddPeople(orgId,single,"e10adc3949ba59abbe56e057f20f883e",account)
        }
    });
}
function requestAddPeople(acOrgAuthId,nickname,password,name){
	var url = re_url(methods.addPeopleInfo);
	var data = {
		acOrgAuthId:acOrgAuthId,
		nickname:nickname,
		password:password,
		name:name
	};
	var success = function(response) {
		var info = response["data"];
		//添加权限组人员成功
		toast("添加成功");
		//清空填写的数据
		$(".addName").val("");
		$(".addAccount").val("");
	}
	util.get_ajax(url, data, success)
}
function requestDelPeople(acOrgMemberId){
	var url = re_url(methods.deletePeopleInfo);
	var data = {
		acOrgMemberId:acOrgMemberId
	};
	var success = function(response) {
		var info = response["data"];
		//删除人员成功
	}
	util.get_ajax(url, data, success)
}