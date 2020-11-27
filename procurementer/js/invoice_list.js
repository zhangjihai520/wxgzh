$(document).ready(function(){
	remove_localStorage("buInvoiceTpltId");
	remove_localStorage("oil_arr");
	getInvocetpltList();
})
function getInvocetpltList() {//获取发票列表
	var url = re_url(methods.getInvocetpltList);
	var data = {};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			var datas = response.data;
			// console.log(datas);
			if(datas != "") {
				var invoice_box = document.querySelector(".invoice_box");
				invoice_box.innerHTML = "";
				$.each(datas, function(index, value) {
					var list_item = document.createElement("div");
					list_item.className = 'row  col-12 m-0 p-0 pt-3';
					list_item.innerHTML = invoice_list(value);
					invoice_box.appendChild(list_item)
				});
				$(".del_box").click(function(){
					var id =$(this).attr("id");
					save_localStorage("buInvoiceTpltId",id);
				});
				$(".true_btn").click(function(){
					deleteInvocetplt(get_localStorage("buInvoiceTpltId"));
				});
				$(".complie_box").click(function(){
					var id =$(this).attr("id");
					save_localStorage("buInvoiceTpltId",id);
					go_page("change_invoice.html");
				});
				make_invoice();
			}else{
//				toast("您还没有发票，请您尽快增加发票")
			}

		}
	};
	util.get_ajax(url, data, success)
}
function invoice_list(data) {
	var invoice_list = "";
	invoice_list += '<p class="col-12 m-0 p-0 font_3 invoice_id " id="'+data.buInvoiceTpltId+'">' + data.invoiceTitle + '</p>';
	invoice_list += '<div class="row col-12 m-0 p-0 border-bottom py-2">';
	invoice_list += '<p class="col-3 pl-0 offset-6 font_1 text-right orange complie_box" id="' + data.buInvoiceTpltId + '">';
	invoice_list += '<span class="fa fa-edit pr-1">' + '' + '</span>';
	invoice_list += '<span>' + '编辑' + '</span>';
	invoice_list += '</p>';
	invoice_list += '<p class="col-3 font_1 pr-0 del_box" data-toggle="modal" data-target="#exampleModalCenter" id="' + data.buInvoiceTpltId + '">';
	invoice_list += '<span class="fa fa-trash pr-1">' + '' + '</span>';
	invoice_list += '<span>' + '删除' + '</span>';
	invoice_list += '</p>';
	invoice_list += '</div>';
	return invoice_list;
}

function deleteInvocetplt(id) {//删除发票
	var url = re_url(methods.deleteInvocetplt);
	var data = {
		buInvoiceTpltId:id
	};
	var success = function(response) {
		if(response.code == RETCODE_SUCCESS) {
			alert("删除成功！");
			window.location.reload();
		}
	};
	util.get_ajax(url, data, success)
}

page_change(".add_btn", "add_new_invoice.html");

function make_invoice(){
	if(get_localStorage("pageStyle")=="go_invoice"){
		$(".invoice_id").click(function(){
			if($(this).attr("id")==""){
				return;
			}else{
				save_localStorage("buInvoiceTpltId",$(this).attr("id"));
				remove_localStorage("pageStyle");
				window.location.href= 'make_invoice.html' + '?_r=' + Math.random();
			}
			
		})
	}
}
