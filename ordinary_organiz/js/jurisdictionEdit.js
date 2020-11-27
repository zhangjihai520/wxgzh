var editingOrgDic = {};
var selectMoveOrgId = '';
$(function () {
    //返回
    $(".break").click(function () {
        page_back();
    });
    setCss();	
	getGroupList();
});
function setCss() {
    //删除
    $("#delete").click(function () {
        var person = $(document).find('.jurisdictionClick');
        if (person.length > 0) {
			var person_check = 0
			$.each(person,function(index,item){
				if($(this).hasClass("itemCheckButton")){
					person_check += 1;
				}
			})
            if(person_check>0){
				$("#deletePerson").show();
			}else{
				toast('请选择删除用户！！！');
			}
        } else {
            toast('请选择删除用户！！！');
        }
    });
    //确认删除
	$(".delete_members").click(function(){
		var deleteList = [];
		var person = $(document).find('.jurisdictionClick');
		$.each(person,function(index,item){
			if($(this).hasClass("itemCheckButton")){
				deleteList.push($(this).attr("id"));
			}
		})
		requestDeleteMembers(deleteList);
	})
    //移动
    $("#moveTo").click(function () {
        var person = $(document).find('.jurisdictionClick');
        if (person.length > 0) {
			var orgList = JSON.parse(get_localStorage("groupArray"));
			var htmlStr = '';
			$.each(orgList,function(index,item){
				htmlStr += '<div class="col-11 ml-3 mt-3 font_7 personageItem" id="'+item["acOrgAuthId"]+'">'+item["title"]+' ('+item["userCount"]+')</div>';
			})
			$(".all_groups").html(htmlStr);
			$("#personnelDetails").show();
        } else {
            toast('请选择移动用户！！！');
        }
    });

    $("#jurisdictionConfirmEdit").click(function () {
        var single = $("#editJurisdiction .single").val();
        single = $.trim(single);
		console.log(single);
        var everyday = $("#editJurisdiction .everyday").val();
        everyday = $.trim(everyday);
        var monthly = $("#editJurisdiction .monthly").val();
        monthly = $.trim(monthly);
		var str_title = $("#editJurisdiction .setName").val();
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
                //提交
				var parmDict = {
					acOrgAuthId:editingOrgDic["acOrgAuthId"],
					singleLimit:single,
					dayLimit:everyday,
					monthLimit:monthly,
					title:str_title
				};
                requestUpdataOrgInfo(parmDict);
            }
        }
    });

}

//点击选中
$(document).on('click', ".checkButton", function () {
    //是否选中
    if (!$(this).hasClass('jurisdictionClick')) {
        $(this).addClass("jurisdictionClick");
        $(this).children('img').prop('src', 'img/check.png');
        if ($(this).hasClass('groupCheckButton')) {
            $.each($(this).parents('.group').next().find('.itemCheckButton'), function () {
                $(this).addClass("jurisdictionClick");
                $(this).children('img').prop('src', 'img/check.png')
            })
        } else if ($(this).hasClass('itemCheckButton')) {
            var boo = true;
            $.each($(this).parents('.itemComment').find('.itemCheckButton'), function () {
               if (!$(this).hasClass('jurisdictionClick')) {
                   boo = false;
                   return;
               }
            });
            var groupCheckButton = $(this).parents('.itemComment').prev().find(".groupCheckButton");
            if (boo) {
                groupCheckButton.addClass("jurisdictionClick");
                groupCheckButton.children('img').prop('src', 'img/check.png');
            } else {
                groupCheckButton.removeClass("jurisdictionClick");
                groupCheckButton.children('img').prop('src', 'img/uncheck.png');
            }
        }
    } else {
        $(this).removeClass("jurisdictionClick");
        $(this).children('img').prop('src', 'img/uncheck.png');
        if ($(this).hasClass('groupCheckButton')) {
            $.each($(this).parents('.group').next().find('.itemCheckButton'), function () {
                $(this).removeClass("jurisdictionClick");
                $(this).children('img').prop('src', 'img/uncheck.png')
            })
        } else if ($(this).hasClass('itemCheckButton')) {
            var groupCheckButton = $(this).parents('.itemComment').prev().find(".groupCheckButton");
            groupCheckButton.removeClass("jurisdictionClick");
            groupCheckButton.children('img').prop('src', 'img/uncheck.png');
        }
    }
    getCheckButton();
});

//点击权限组显示成员
$(document).on('click', ".groupComment", function () {
    $(this).parents(".group").next().toggle();
});

//全选
$(document).on('click', '.disclaimer', function () {
   $.each($(document).find('.checkButton'), function () {
       $(this).children('img').prop('src', 'img/check.png');
       $(this).addClass("jurisdictionClick");
   });
    getCheckButton();
});

//计算选中的数量
function getCheckButton() {
    var totalNum = 0;
    $.each($(document).find('.groupCheckButton'), function () {
       var itemCheckButton = $(this).parents('.group').next().find('.jurisdictionClick');
       // $(this).next().find('span').text('('+ itemCheckButton.length +')');
        totalNum += itemCheckButton.length;
    });
    $(".navigationBarText span").text(totalNum)
}


//取消弹窗
$(document).on('click', ".cancel", function () {
    $(".popup").hide();
});

//选择移动权限组
$(document).on('click', '.personageItem',function () {
	selectMoveOrgId = $(this).attr("id");
    $(this).parent().find('.personageItemCheck').removeClass('personageItemCheck');
    $(this).addClass('personageItemCheck');
});
//确认选择移动权限组
$(document).on("click",".personnelDetailsConfirm",function(){
	if(selectMoveOrgId == ''){
		toast("请选择需要移动到的组");
	}else{
		var list = [];
		var person = $(document).find('.jurisdictionClick');
		$.each(person,function(index,item){
			if($(this).hasClass("itemCheckButton")){
				var dic = {acOrgMemberId:$(this).attr("id")}
				list.push(dic);
			}
		});
		if (list.length == 0) {
			toast("当前还没有选择人员！！！");
			return;
		}
		requestMoveMembers(selectMoveOrgId,list)
	}
})

//编辑权限组
$(document).on('click', '.edit',function () {
	var root = $("#editJurisdiction");
    root.show();
	var list = JSON.parse(get_localStorage("groupArray"));
	editingOrgDic = list[$(this).attr("id")];
	root.find(".setName").val(editingOrgDic["title"]);
	root.find(".single").val(editingOrgDic["singleLimit"]);
	root.find(".everyday").val(editingOrgDic["dayLimit"]);
	root.find(".monthly").val(editingOrgDic["monthLimit"]);
	
});
//获取权限组列表
function updataHtml(list){
	//var orgList = JSON.parse(get_localStorage("groupArray"));
	var htmlStr = '';
	$.each(list,function(index,item){
		htmlStr += '<div class="form-row ">';
		htmlStr += '<div class="col-12 marginTopFifteen group">';
		htmlStr += '<div class="form-row">';
		htmlStr += '<div class="col-1 checkButton groupCheckButton">';
		htmlStr += '<img src="img/uncheck.png">';
		htmlStr += '</div>';
		htmlStr += '<div class="col-9 groupName groupComment">';
		htmlStr += item["title"]+' <span>('+ item["userCount"] +')</span>';
		htmlStr += '</div>';
		htmlStr += '<div class="col-2 text-right edit" id="'+index+'">编辑</div>';
		htmlStr += '</div></div>';
		htmlStr += '<div class="col-12 itemComment">';
		var memberList = item["memberList"];
		$.each(memberList,function(index2,item2){
			htmlStr += '<div class="form-row marginTopFifteen">';
			htmlStr += '<div class="col-1 checkButton itemCheckButton" id="'+item2["acOrgMemberId"]+'">';
			htmlStr += '<img src="img/uncheck.png">';
			htmlStr += '</div>';
			htmlStr += '<div class="col-5 itemName">'+item2["nickname"]+'</div>';
			htmlStr += '<div class="col-5">'+item2["totalPrice"]+'</div>';
			htmlStr += '<div class="col-1">＞</div>';
			htmlStr += '</div>';
		})
		htmlStr += '</div></div>';
	})
	$(".group_items").html(htmlStr);
}
function getGroupList(){
	var url = re_url(methods.getOrgAuthList);
	var data = [];
	var success = function(response) {
		//获取权限组成功
		var info = response["data"];
		updataHtml(info);
		save_localStorage("groupArray",info);
	}
	util.get_ajax(url, data, success)
}
function requestDeleteMembers(memberList){
	var url = re_url(methods.batchDeleteAuthPeopleInfo);
	var data = memberList;
	var success = function(response) {
		//删除成功
		getGroupList();
		toast("删除成功");
	}
	util.post_ajax(url, data, success)
	$(".popup").hide();
}
function requestMoveMembers(acOrgAuthId,memberList){
	var url = re_url(methods.batchUpdateAuthPeopleInfo);
	var data = {
		acOrgAuthId:acOrgAuthId,
		memberList:memberList
	};
	var success = function(response) {
		//移动成功
		getGroupList();
		toast("移动成功");
		$(".navigationBarText span").text(0)
	};
	util.post_ajax(url, data, success)
	$(".popup").hide();
}
function requestUpdataOrgInfo(infoDic){
	var url = re_url(methods.updateOrgAuth);
	var data = infoDic;
	var success = function(response) {
		//成功
		getGroupList();
		toast("更新成功");
	}
	util.post_ajax(url, data, success)
	$(".popup").hide();
}
