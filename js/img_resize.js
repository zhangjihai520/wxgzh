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
function clearImg(dom,clicked_dom){
	$(clicked_dom).on('click', function() {
		$(this).attr("src","");
	});
}

