var Paizhao = function () {
    var activityId = Common.getUrlParam('activityId');
    var activityModelId = Common.getUrlParam('modelId');
    var admin = Common.getUrlParam('admin');
    //var userInfo = Common.userInfo();
    var userInfo =  {
        'userId': '11111',
        'smokeNumber':'222222222'
    }
    var nameArr = [];
    var xhr;
    var fileCount = 1
    var photoCompress = function (file,w,objDiv){
        var ready=new FileReader();
        /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
        ready.readAsDataURL(file);
        ready.onload=function(){
            var re=this.result;
            canvasDataURL(re,w,objDiv)
        }
    }
    /**
     * 将以base64的图片url数据转换为Blob
     * @param urlData
     *            用url方式表示的base64图片数据
     */
    var canvasDataURL = function (path, obj, callback){
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
    }

    //上传前loading
    function uploadStart(evt){
        $("body").mLoading('show');
    }
    //上传成功响应
    function uploadComplete(evt) {
        //服务端接收完文件返回的结果
        if(userInfo != "") {
            window.zhuge.track('拍照闪退测试-照片成功', {
                '用户标识ID': userInfo.userId,
                '烟证号': userInfo.smokeNumber
            })
        }
        $("body").mLoading("hide");
        var data = JSON.parse(evt.target.responseText);
        alert(data.errmsg == 'ok'? '上传成功':data.errmsg);
        location.reload();
    }
    //上传失败
    function uploadFailed(evt) {
        alert(evt.data);
        if(userInfo != "") {
            window.zhuge.track('拍照闪退测试-上传失败', {
                '用户标识ID': userInfo.userId,
                '烟证号': userInfo.smokeNumber,
                '错误原因': evt.data
            })
        }
    }
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    return {
        init : function(){
            if(admin != undefined && admin != 'undefined' && admin != "" && admin === '12' ){
                $('.newFile').removeAttr('capture').removeAttr('accept')

            }else{
                $('.newFile').attr({"capture":"camera","accept":"image/*"})
            }
            //Common.init();
            Paizhao.initData();
            Paizhao.eventInfo();

        },
        eventInfo : function () {
            Paizhao.inputChange();
            //加载
            $('#Loader').mLoading({
                text:"",//加载文字，默认值：加载中...
                icon:"",//加载图标，默认值：一个小型的base64的gif图片
                html:false,//设置加载内容是否是html格式，默认值是false
                content:"",//忽略icon和text的值，直接在加载框中显示此值
                mask:true//是否显示遮罩效果，默认显示
            });
            $("#upload").on('click',function () {
                Paizhao.uploadFile()
            })
        },
        inputChange: function () {
            /*
           三个参数
           file：一个是文件(类型是图片格式)，
           w：一个是文件压缩的后宽度，宽度越小，字节越小
           objDiv：一个是容器或者回调函数
           photoCompress()
            */
            $('.newFile').change(function(){
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
                    if($('.grid li').length <= fileCount){
                        $("body").mLoading('show');
                        photoCompress(_this[0].files[0], {
                            quality: 0.2
                        }, function(base64Codes){
                            console.log(i)
                            //console.log(base64Codes);
                            //console.log("压缩后：" + base.length / 1024 + " " + base);
                            $.ajax({
                                type: "post",
                                url: Common.hostUrl()+'picresource/pic_activity/upload_picture_to',
                                data:'file='+Common.urlEncode(base64Codes),
                                dataType: "JSON",
                                ContentType:'form-data',
                                success: function (res) {

                                    _this.parent().attr('class','li').append('<img src="'+ imgFile +'" />');
                                    var info = res.data;
                                    nameArr.push(info);
                                    if($('.grid li img').length < fileCount){
                                        if(admin != undefined && admin != 'undefined' && admin != "" && admin === '12' ){
                                            $('.grid').append('<li class="btn"><input type="file" class="newFile" name="file" size="100"/></li>')
                                        }else{
                                            $('.grid').append('<li class="btn"><input type="file" class="newFile" name="file" accept="image/*" capture="camera" size="100"/></li>')
                                        }

                                        Paizhao.inputChange()
                                    }
                                    $("body").mLoading('hide');
                                },
                                error: function (err) {
                                    $("body").mLoading('hide');
                                    alert("上传失败,请重新上传");
                                    console.log('请求失败')
                                }
                            })
                        });
                    }
                };

                //正式读取文件
                reader.readAsDataURL(file);
                $("#upload").removeAttr("disabled");
            })
        },

        //初始化请求
        initData : function(){
            $.ajax({
                type: "get",

                //url: Common.hostUrl()+"picresource/picActivity/Posted_Activity?id="+activityId+"",
                url: Common.hostUrl()+"picresource/pic_activity/pic_number?activityId="+activityId+"&activityModelId="+activityModelId,
          // http://192.168.1.126:51901/picresource/pic_activity/pic_number?activityId=78&&activityModelId=783
                dataType: "JSON",
                success: function (res) {
                    var info = res.data;
                    if(info != undefined){
                        fileCount = parseInt(info.data);
                    }
                },
                error: function (err) {
                    console.log('请求失败')
                }
            })
        },
        //上传文件方法
        uploadFile : function () {
            // if($('.grid li.li').length >= fileCount){
                $("body").mLoading('show');
                if(userInfo != ""){
                    window.zhuge.track('拍照闪退测试-点击上传照片',{
                        '用户标识ID': userInfo.userId,
                        '烟证号': userInfo.smokeNumber
                    })
                }

                var activityId = GetQueryString('activityId')
                //var fileObj = document.getElementById("file").files[0]; // js 获取文件对象

                //console.log(fileObj)


                var fileName = nameArr.join(',')
                $.ajax({
                    type: "get",
                    url: Common.hostUrl()+'picresource/pic_activity/upload_picture_three?fileNames='+ fileName +'&activityId='+activityId+'&activityImageId='+activityModelId,
                    dataType: "JSON",
                    ContentType:'form-data',
                    success: function (res) {
                        $("body").mLoading('hide');
                        alert("上传成功。");
                        window.location.reload();
                    },
                    error: function (err) {
                        $("body").mLoading('hide');
                        console.log('请求失败')
                    }
                })
                // var url = Common.hostUrl()+"picresource/pic_activity/upload_picture"; // 接收上传文件的后台地
                // var form = new FormData(); // FormData 对象
                // $('.newFile').each(function (i,temp) {
                //     photoCompress(temp.files[0], {
                //         quality: 0.2
                //     }, function(base64Codes){
                //         console.log(i)
                //         //console.log(base64Codes);
                //         fileArr.push(base64Codes)
                //         //console.log("压缩后：" + base.length / 1024 + " " + base);
                //         if(fileArr.length === fileCount){
                //             // form.append("file",fileArr); // 文件对象
                //             // form.append('time',new Date());
                //             // form.append('activityId',activityId)
                //             // xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
                //             // xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
                //             // xhr.onloadstart=uploadStart;  //请求开始
                //             // xhr.onload = uploadComplete; //请求完成
                //             // xhr.onerror =  uploadFailed; //请求失败
                //             // //xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
                //             // xhr.send(form); //开始上传，发送form数据
                //
                //         }
                //     });
                // })
            // }else{
            //     alert('上传照片不足，请继续上传')
            // }

        }
    }
}();