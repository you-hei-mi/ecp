/* *
* 此方法需要引入jquery
* */

function PaizhaoFn( Config){
    this._init(Config);   //执行方法
}
PaizhaoFn.prototype={
    _init:function(options){
        options = options || {};
        this.uploadingId = '#box' || "#Paizhao",                        //上传ID
        this.activityId = options.activityId || "",						//活动ID
        this.activityModelId = options.activityModelId || "",			//活动模式ID
        this.fileCount = parseInt(options.fileCount) || fileCount,								//拍照数量
        this.uploading = {
            url : options.uploading.url || "",                //上传请求接口
            arguments : options.uploading.arguments || "fike",                //上传请求接口
        };
        this.initHtml();
    },
    initHtml : function () {
        $(this.uploadingId).html("<div id=\"photos_box\">" +
            "    <ul class=\"Pul\">" +
            "        <li class=\"Pli\">" +
            "            <input type=\"file\" class=\"newFile\" name=\"file\" accept=\"image/*\" capture=\"camera\" size=\"100\"/>" +
            "        </li>" +
            "    </ul>" +
            "</div>");
        this.initCss();
        this.inputChange();
    },
    initCss : function () {
        $('#photos_box').css({
            "width": "100%",
            "margin-right": "auto",
            "margin": "0",
            "padding": "0",
            "height": "initial",
        });
        $('#photos_box .Pul').css({
            "margin-left": "5px",
            "margin-top": "10px",
            "overflow": "hidden",
            "margin": "0",
            "padding": "0",
            "border": "none",
            "list-style": "none"
        });
        $('#photos_box .Pli').css({
            "position": "relative",
            "left": "0",
            "top": "0",
            "background-image": "url('http://localhost:63342/proto/assets/img/bd/paizhao/btn.png')",
            "background-size": "100% 100%",
            "background-repeat": "no-repeat",
            "float": "left",
            "width": "100px",
            "height": "100px",
            "text-align": "center",
            "line-height": "50px",
            "z-index": "10",
            "list-style": "none"
        });
        $('#photos_box .newFile').css({
            "position": "absolute",
            "left": "0",
            "top": "0",
            "width": "100%",
            "height": "100%",
            "opacity": "0",
            "-webkit-tap-highlight-color": "rgba(0,0,0,0)",
            "border" : '0'
        });
    },
    inputChange: function () {
        var own = this;
        /*
       三个参数
       file：一个是文件(类型是图片格式)，
       w：一个是文件压缩的后宽度，宽度越小，字节越小
       objDiv：一个是容器或者回调函数
       photoCompress()
        */
        $('#photos_box .newFile').change(function(){
            var _this = $(this)

            //获取文件
            var file = this.files[0];

            //创建读取文件的对象
            var reader = new FileReader();

            //创建文件读取相关的变量
            var imgFile;

            //为文件读取成功设置事件
            reader.onload=function(e) {
                imgFile = e.target.result;
                if($('#photos_box .Pul li').length <= own.fileCount){
                    if(own.uploading.url != ""){
                        own.photoCompress(_this[0].files[0], {
                            quality: 0.2
                        }, function(base64Codes){
                            //console.log(base64Codes);
                            //console.log("压缩后：" + base.length / 1024 + " " + base);
                            $.ajax({
                                type: 'post',
                                url: own.uploading.url,
                                data:own.uploading.arguments +'='+Common.urlEncode(base64Codes),
                                dataType: "JSON",
                                ContentType:'form-data',
                                success: function (res) {
                                    own.uploadingSuccess(res)
                                    _this.parent().attr('class','li').append('<img style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;" src="'+ imgFile +'" />');
                                    if($('#photos_box .Pul li img').length < own.fileCount){
                                        $('#photos_box .Pul').append('<li class="Pli"><input type="file" class="newFile" name="file" accept="image/*" capture="camera" size="100"/></li>')
                                        own.initCss();
                                        own.inputChange()
                                    }
                                },
                                error: function (err) {
                                    own.uploadingError(err)
                                }
                            })
                        });
                    }else{
                        own.uploadingError('url不能为空')
                    }
                }
            };

            //正式读取文件
            reader.readAsDataURL(file);
            $("#upload").removeAttr("disabled");
        });
    },
    photoCompress : function (file,w,objDiv){
        var own = this;
        var ready=new FileReader();
        /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
        ready.readAsDataURL(file);
        ready.onload=function(){
            var re=this.result;
            own.canvasDataURL(re,w,objDiv)
        }
    },
    /**
     * 将以base64的图片url数据转换为Blob
     * @param urlData
     *            用url方式表示的base64图片数据
     */
    canvasDataURL : function (path, obj, callback){
        var img = new Image();
        img.src = path;
        img.onload = function(){
            var that = this;
            // 默认按比例压缩
            var w = that.width,
                h = that.height,
                scale = w / h;
            w = obj.width || w;
            h = obj.height || (w / scale);
            var quality = 0.7;  // 默认图片质量为0.7
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
            // 图像质量
            if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                quality = obj.quality;
            }
            // quality值越小，所绘制出的图像越模糊
            var base64 = canvas.toDataURL('image/jpeg', quality);
            // 回调函数返回base64的值
            callback(base64);
        }
    },
}




