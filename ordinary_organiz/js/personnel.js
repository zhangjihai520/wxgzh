var selectDelOrgId = ''; //删除权限组选中id
var detailMemberId = ''; //详情人员id
var detailOrgId =    ''; //详情权限组id
var currentType =     1; //当前显示类型 1：所有人员  2：权限组
$(function () {
    //去账单主页
    page_change("#account", 'account.html');
    //去我的主页
    page_change("#information", 'information.html');
	getGroupList();
    setCss();
});

function setCss() {
    //添加显示
    $("#add").click(function () {
        $("#addJurisdiction .single").val('');
        $("#addJurisdiction .everyday").val('');
        $("#addJurisdiction .monthly").val('');
       $("#addJurisdiction").show();
    });
    $("#jurisdictionConfirmAdd").click(function () {
        var single = $("#addJurisdiction .single").val();
        single = $.trim(single);
        var everyday = $("#addJurisdiction .everyday").val();
        everyday = $.trim(everyday);
        var monthly = $("#addJurisdiction .monthly").val();
        monthly = $.trim(monthly);
		var str_title = $("#addJurisdiction .setName").val();
		str_title = $.trim(str_title);
        if (!single || single.length == 0 || single <= 0) {
            toast('请输入正确的最高单笔消费！！！')
        } else if (!everyday || everyday.length == 0 || everyday <= 0) {
            toast('请输入正确的最高单日限额！！！')
        } else if (!monthly || monthly.length == 0 || monthly <= 0) {
            toast('请输入正确的最高每月限额！！！')
        }else if (!str_title || str_title.length == 0 || str_title <= 0) {
            toast('请输入组名！！！')
        } else {
            if (parseInt(single) > parseInt(everyday) || parseInt(everyday) > parseInt(monthly)) {
                toast('最高每月限额>=最高单日限额>=最高单笔消费！！！')
            } else {
                requestAddGroup(everyday,monthly,single,str_title);
            }
        }
    });

	//权限组菜单选择
	$(".jurisdictionMenu").click(function () {
		$(this).parent().find(".checkMenu").removeClass('checkMenu');
		$(this).addClass("checkMenu");
		//判断是所有人员还是权限组 1：所有人员 2：权限组
		if ($(this).hasClass("allPerson")) {
			save_localStorage("jurisdictionStatus", 1);
			currentType = 1;
		} else {
			currentType = 2;
			save_localStorage("jurisdictionStatus", 2);
		}
		getGroupList();
	});

    //添加用户
    page_change(".addPerson", 'addPerson.html');
}
//编辑组
$(document).on("click",'.more', function(){
    window.location.href = "jurisdictionEdit.html";
});

//切换隐藏状态
$(document).on("click",'.first-title', function(){
    $(this).parents(".personDetailsTip").find(".myicon").toggle();
    $(this).parents(".personDetailsTip").next().toggle();
});
//人员详情确定修改
$(document).on("click",".personnelDetailsConfirm",function(){
	//判断是否修改所在权限组
	var options = $(".addRole option:selected");
	var orgId = options.attr("id"); //拿到选中项的值
	if(orgId == detailOrgId){
		$(".popup").hide();
		return;
	}else{
		//移动到选择的权限组
		var list = [{acOrgMemberId:detailMemberId}];
		requestMoveToOtherGroup(orgId,list)
	}
})
//删除人员
$(document).on("click",".delete_people",function(){
	$(".jurisdictionComment").text('确定删除该人员?');
	$(".jurisdictionDeleteConfirm").removeClass('cancel');
	$(".jurisdictionDeleteConfirm").attr('id', 'delete_people_ok');
	$("#deleteJurisdiction").show();
})
//确定删除人员
$(document).on('click', "#delete_people_ok", function () {
    requestDelPeople(detailMemberId);
});
//删除权限组
$(document).on("click",'.deletePerson', function(){
	selectDelOrgId = $(this).parents(".marginTopTwenty").attr("id");
    if (parseInt($(this).parent().find('.setNum').text()) > 0) {
        $(".jurisdictionComment").text('该权限组有人员，请先移至其他权限组');
        $(".jurisdictionDeleteConfirm").addClass('cancel');
    } else {
        $(".jurisdictionComment").text('确定删除该权限组?');
        $(".jurisdictionDeleteConfirm").removeClass('cancel');
        $(".jurisdictionDeleteConfirm").attr('id', 'jurisdictionDelete');
    }
    $("#deleteJurisdiction").show();
});
//确定删除权限组
$(document).on('click', "#jurisdictionDelete", function () {
    requestDelGroup(selectDelOrgId);
});
//取消弹窗
$(document).on('click', ".cancel", function () {
    $(".popup").hide();
});

//人员详情弹窗
$(document).on('click', ".personnelDetails", function () {
	detailMemberId = $(this).attr("id");
	var name_str = $(this).parents(".personText").find(".person_name").text();
	var phone_str = $(this).parents(".personText").find(".person_name").attr("id");
	var money_str = $(this).parents(".personText").find(".person_money").text();
	var groupId_str = $(this).parents(".marginTopTwenty").attr("id");
	detailOrgId = groupId_str;
	var htmlStr= '<div class="form-row personageItem">';
	htmlStr += '<div class="detailedIcon personageItemIcon"><img src="img/person.png"></div>';
	htmlStr += '<div class="col-9 inputLeft"><input readonly class="form-control personageItemInput pl-0" type="text" value="'+name_str+'"></div>';
	htmlStr += '</div>';
	htmlStr += '<div class="form-row personageItem">';
	htmlStr += '<div class="detailedIcon personageItemIcon"><img src="img/phone.png"></div>';
	htmlStr += '<div class="col-9 inputLeft"><input readonly class="form-control personageItemInput pl-0" value="'+phone_str+'" type="text"></div>';
	htmlStr += '</div>';
	htmlStr += '<div class="form-row personageItem">';
	htmlStr += '<div class="detailedIcon personageItemIcon"><img src="img/permissionsSet.png"></div>';
	htmlStr += '<div class="col-9 inputLeft">';
	htmlStr += '<select class="form-control personageItemInput addRole pl-0">';
	var groupList = [];
	groupList = get_localStorage("groupArray");
	groupList = JSON.parse(groupList);
	console.log(groupList);
	for(var i=0;i<groupList.length;i++){
		var item = groupList[i];
		if(item["acOrgAuthId"] == groupId_str){
			htmlStr += '<option value="" selected id="'+item["acOrgAuthId"]+'">'+item["title"]+'</option>';
		}else{
			htmlStr += '<option value="" id="'+item["acOrgAuthId"]+'">'+item["title"]+'</option>';
		}
	}
	htmlStr += '</select></div>';
	htmlStr += '<div class="col-1 mt-2" style="margin-left: -10vw"><img src="img/right.png"></div>';
	htmlStr += '</div>';
	htmlStr += '<div class="form-row personageItem delete_people">';
	htmlStr += '<div class="col-1 offset-1 personageItemIcon"><img src="img/delete.png"></div>';
	htmlStr += '<div class="col-9 inputLeft"><input readonly class="form-control personageItemInput pl-0" type="text" value="删除"></div>';
	htmlStr += '<div class="col-1 mt-2" style="margin-left: -10vw"><img src="img/right.png"></div>';
	htmlStr += '</div>';

    $("#personnelDetails").find(".personage").html(htmlStr);
	$("#personnelDetails").show();
});
function requestMoveToOtherGroup(acOrgAuthId,memberList){
	var url = re_url(methods.batchUpdateAuthPeopleInfo);
	var data = {
		acOrgAuthId:acOrgAuthId,
		memberList:memberList
	};
	var success = function(response) {
		var info = response["data"];
		//删除权限组成功
		 $(".popup").hide();
		 toast("移动成功");
		 getGroupList();
	}
	util.post_ajax(url, data, success)
}
function requestDelPeople(acOrgMemberId){
	var url = re_url(methods.deletePeopleInfo);
	var data = {
		acOrgMemberId:acOrgMemberId
	};
	var success = function(response) {
		var info = response["data"];
		//删除权限组成功
		 $(".popup").hide();
		 toast("删除成功");
		 getGroupList();
	}
	util.get_ajax(url, data, success)
}
function requestDelGroup(acOrgAuthId){
	var url = re_url(methods.deleteOrgAuth);
	var data = {
		acOrgAuthId:acOrgAuthId
	};
	var success = function(response) {
		var info = response["data"];
		//删除权限组成功
		 $(".popup").hide();
		 toast("删除权限组成功");
		 getGroupList();
	}
	util.get_ajax(url, data, success)
}
function requestAddGroup(dayLimit,monthLimit,singleLimit,title){
	var url = re_url(methods.addOrgAuth);
	var data = {
		dayLimit:dayLimit,
		monthLimit:monthLimit,
		singleLimit:singleLimit,
		title:title
	};
	var success = function(response) {
		var info = response["data"];
		//添加权限组成功
		toast("添加成功")
		$(".popup").hide();
		getGroupList();
	}
	util.get_ajax(url, data, success)
}
function getGroupList(){
	save_localStorage("groupArray",[]);
	var url = re_url(methods.getOrgAuthList);
	var data = [];
	var success = function(response) {
		//获取权限组成功
		var info = response["data"];
		$(".group_listNum").text(info.length);
		updataHtml(info);

		if(currentType == 2){
			$('.jurisdictionMenu').parents('.accessMenu').next().find('.deletePerson').show();
			$('.jurisdictionMenu').parents('.accessMenu').next().find('.more').hide();
		} else {
			$('.jurisdictionMenu').parents('.accessMenu').next().find('.deletePerson').hide();
			$('.jurisdictionMenu').parents('.accessMenu').next().find('.more').show();
		}

		save_localStorage("groupArray",info);
	}
	util.get_ajax(url, data, success)
}
//1:显示所有人员 2显示所有权限组
function updataHtml(list){
	var htmlStr = '';
	if(currentType == 2){
		$.each(list,function(index,item){
			htmlStr += '<div class="form-row marginTopTwenty" id="'+item["acOrgAuthId"]+'">';
			htmlStr += '<div class="col-12 personDetailsTip">';
			htmlStr += '<div class="form-row">';
			htmlStr += '<div class="col-1 first-title laYuiIconTop">';
			htmlStr += '<i class="layui-icon layui-icon-triangle-r myicon"></i>';
			htmlStr += '<i class="layui-icon layui-icon-triangle-d myicon" style="display: none;"></i>';
			htmlStr += '</div>';
			htmlStr += '<div class="col-10 first-title">'+item["title"]+'（<span class="setNum">'+item["memberList"].length+'</span>）</div>';
			htmlStr += '<div class="col-1 more"><img src="img/more.png"></div>';
			htmlStr += '<div class="col-1 deletePerson"><img src="img/delete.png"></div>';
			htmlStr += '</div></div>';

			htmlStr += '<div class="col-12 personDetailsText">';
			htmlStr += '<div class="form-row personTip personText">';
			htmlStr += '<div class="col-4 text-center">用户名</div>';
			htmlStr += '<div class="col-7 text-center">当月加油金额（元）</div>';
			htmlStr += '</div>';

			var memberList = item["memberList"];
			$.each(memberList,function(index2,item2){
				htmlStr += '<div class="form-row personText">';
				htmlStr += '<div class="col-4 text-center person_name" id="'+item2["phoneNumber"]+'">'+item2["nickname"]+'</div>';
				htmlStr += '<div class="col-6 text-center person_money">'+item2["totalPrice"]+'</div>';
				htmlStr += '<div class="col-2 text-right personnelDetails" id="'+item2["acOrgMemberId"]+'">＞</div>';
				htmlStr += '</div>';
			})
			htmlStr += '</div></div>';
		})
	}else if(currentType == 1){
		var allMemberList = [];
		$.each(list,function(index,item){
			var tampList = item["memberList"];
			allMemberList = allMemberList.concat(tampList);
		})

		htmlStr += '<div class="form-row marginTopTwenty" id="00000000000000">';
		htmlStr += '<div class="col-12 personDetailsTip">';
		htmlStr += '<div class="form-row">';
		htmlStr += '<div class="col-1 first-title laYuiIconTop">';
		htmlStr += '<i class="layui-icon layui-icon-triangle-r myicon"></i>';
		htmlStr += '<i class="layui-icon layui-icon-triangle-d myicon" style="display: none;"></i>';
		htmlStr += '</div>';
		htmlStr += '<div class="col-10 first-title">所有人员（<span class="setNum">'+allMemberList.length+'</span>）</div>';
		htmlStr += '<div class="col-1 more"><img src="img/more.png"></div>';
		htmlStr += '<div class="col-1 deletePerson"><img src="img/delete.png"></div>';
		htmlStr += '</div></div>';

		htmlStr += '<div class="col-12 personDetailsText">';
		htmlStr += '<div class="form-row personTip personText">';
		htmlStr += '<div class="col-4 text-center">用户名</div>';
		htmlStr += '<div class="col-7 text-center">当月加油金额（元）</div>';
		htmlStr += '</div>';

		$.each(allMemberList,function(index2,item2){
			htmlStr += '<div class="form-row personText" id="'+item2["acOrgAuthId"]+'">';
			htmlStr += '<div class="col-4 text-center person_name" id="'+item2["phoneNumber"]+'">'+item2["nickname"]+'</div>';
			htmlStr += '<div class="col-6 text-center person_money">'+item2["totalPrice"]+'</div>';
			htmlStr += '<div class="col-2 text-right personnelDetails" id="'+item2["acOrgMemberId"]+'">＞</div>';
			htmlStr += '</div>';
		})
		htmlStr += '</div></div>';
	}
	$(".personDetails").html(htmlStr);
}