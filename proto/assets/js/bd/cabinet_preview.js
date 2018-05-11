var cabinetPreview = function() {
	var activityId = Common.getUrlParam('activityId');
	return {
		init: function() {
            Common.init();
            cabinetPreview.initEvent();
			cabinetPreview.initData();
		},
		initEvent: function () {
			//回到首页
			$(".home").on('click',function () {
				window.location.href = Common.hostUrl('root')+'activity/app-vue/#/mybusiness/rule/'+activityId
            });
			//再次编辑
			$(".edit").on('click',function () {
                window.location.href = Common.hostUrl('root')+"activity/proto/cabinet_make.html?again=1&activityId="+activityId
            })
        },
		//截屏
		screenshot: function() {
			html2canvas(document.querySelector(".preview_box")).then(function(canvas){
				var base64 = Common.urlEncode(canvas.toDataURL("image/png"));
				var data = "file=" + base64 + "&activityId=" + activityId

				$.ajax({
					type: 'POST',
					url: Common.hostUrl() + 'pposm_diy/upload_picture',
					data: data,
					dataType: "JSON",
					success: function(res) {
						if(res.data != undefined && res.data != null) {
							var info = res.data;
							if(info != undefined && info == true) {
								$('.weui-dialog__title').text('发布成功');
							} else {
                                $('.weui-dialog__title').text('发布失败');
								//alert('提交失败')
							}
                            $('body').addClass('vux-modal-open');
                            $('.v-transfer-dom1').show();
						}
					},
					error: function(err) {
						console.log("提交失败")
						console.log(err)
					}
				});
				//document.body.appendChild(canvas)
			});
		},
		//初始化请求
		initData: function() {
			$.ajax({
				type: 'GET',
				url: Common.hostUrl() + 'pposm_diy/echo?activityId=' + activityId,
				dataType: "JSON",
				success: function(res) {
//				  	var res = {
//							  "data": {
//							    "id": null,
//							    "doactVersion": 0,
//							    "createDate": 1523794754368,
//							    "modifyDate": 1523794754368,
//							    "sortSeq": 999,
//							    "joiningTogetherPicture": "<div class=\"a1 demarcation block ui-draggable\"></div>         <div class=\"a1 demarcation_l block ui-draggable\"></div>         <div class=\"a1 demarcation_t block ui-draggable\"></div>         <div class=\"a1 demarcation_r block ui-draggable\"></div>         <div class=\"a1 demarcation_d block ui-draggable\"></div> \t\t<!--<div class=\"fl ui-widget-header\">-->             <!--<div>div</div>-->         <!--</div>--> \t\t<!--<div class=\"fr ui-widget-header\">-->             <!--<div>123</div>-->         <!--</div>--> \t<div class=\"ui-widget-content draggable block red_1_3x2 ui-draggable ui-draggable-dragging a1\" style=\"position: absolute; width: 36.5132px; height: 54.0584px; z-index: 12; left: 88.0313px; top: 120.25px;\"></div><div class=\"ui-widget-content draggable block red_6x2 ui-draggable ui-draggable-dragging a1\" style=\"position: absolute; width: 179px; height: 54.0584px; z-index: 12; left: 194.5px; top: 101.25px;\"></div>",
//							    "note": "留言"
//							  },
//							  "errcode": 1,
//							  "errmsg": "ok",
//							  "msgid": null
//							}

					
					if(res.data != undefined && res.data != null) {
						var info = res.data;
						$(".work_area").html('<img src="'+info.imgTo.replace('www.','wx.')+'" />')
						$(".describe_box p").html(info.note)
						$(".demarcation_t,.demarcation_r,.demarcation_d,.demarcation_l").remove();
					}else{
                        self.location = 'cabinet_make.html?activityId='+activityId;
					}
				},
				error: function(err) {
					console.log("请求失败")
					console.log(err)
				}
			});
		},

	}
}()