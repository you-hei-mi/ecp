var cabinetMake = function(){
	var activityId = Common.getUrlParam('activityId');
	var isAgain = Common.getUrlParam('again');
	var swiperV = "";
	var submit_post = true;
    //移动记录
    var updateCounterStatus = function ( $event_counter, new_count ) {
        if ( !$event_counter.hasClass( "ui-state-hover" ) ) {
            $event_counter.addClass( "ui-state-hover" )
                .siblings().removeClass( "ui-state-hover" );
        }
        $( "span.count", $event_counter ).text( new_count );
    }
    //碰撞检测
    var impact = function (obj, dobj) {
        console.log(dobj.className)
        var o = {
            x: getDefaultStyle(obj, 'left')+1,
            y: getDefaultStyle(obj, 'top')+1,
            w: getDefaultStyle(obj, 'width')+1,
            h: getDefaultStyle(obj, 'height')+1
        }

        var d = {
            x: getDefaultStyle(dobj, 'left'),
            y: getDefaultStyle(dobj, 'top'),
            w: getDefaultStyle(dobj, 'width'),
            h: getDefaultStyle(dobj, 'height'),
        }
        if (o.x >= d.x && o.x >= d.x + d.w) {
            return false;
        } else if (o.x <= d.x && o.x + o.w <= d.x) {
            return false;
        } else if (o.y >= d.y && o.y >= d.y + d.h) {
            return false;
        } else if (o.y <= o.y && o.y + o.h <= d.y) {
            return false;
        }else{
            return true
        }

    }
    //获取坐标信息
    var getDefaultStyle = function (obj, attribute) {
        return parseInt(obj.currentStyle ? obj.currentStyle[attribute] : document.defaultView.getComputedStyle(obj, false)[attribute]);

    }
    //点击显示
    var clickShow = function () {
        $('.work_area > .ui-widget-content.block').on('click',function(event){
            event.stopPropagation();
            $('.clickCelete').remove()
            $(this).append('<span class="clickCelete" onclick="cabinetMake.clickCelete(this)">X</span>')
        })
    }
    return {
        init : function(){
            Common.init();
            cabinetMake.course();
            cabinetMake.initEvent();
            cabinetMake.draggableGo();
        },
        initEvent : function () {
            //是否显示教程
            console.log()
            if(isAgain == null){
                setTimeout(function () {
                    $('.swiper-container').addClass('course_show');
                },500)
            }
            //选项卡
            $(".button_box > div").click(function() {
                $(this).find('button').addClass('active').parent().siblings().find('button').removeClass('active');
                $('.material_box  li:eq(' + $(this).index() + ')').addClass('active').siblings().removeClass('active');
            });

            //关闭教程
            $(".swiper-container button").on('click',function () {
               $('.swiper-container').removeClass('course_show');
            });
            //打开教程
            $('.other > button').on('click',function(){
                swiperV.init();
                $('.swiper-container').addClass('course_show');
            });

			//消除陈列删除按钮
            $('body').on('click',function(){
                $('.work_area .clickCelete').remove();
            })
            
			//清空烟柜
            $('.other > span').on('click',function(){
                if($(".work_area .ui-widget-content.a1").length > 0){
                    if (confirm("确认要清空烟柜吗？") === true){
                        $('.work_area  .ui-widget-content').remove();
                    }
                }
            })
            
            
            //显示描述
            $(".other .mina").on('click',function(){
            	$('body').addClass('vux-modal-open');
            	$('.v-transfer-dom1').show();
            })
            
            //关闭描述框
            $(".weui-mask").on('click',function(){
            	$('body').removeClass('vux-modal-open');
            	$('.v-transfer-dom1').hide();
            })
        },
        //拖拽
        draggableGo : function(){
            //初始化
            //var Width = Math.round($(".tempW").width());
            var Width = Math.round($(".tempW").width());
            var box_1_w = (Width/0.76)/8;
            var box_1_h = (Width/0.77)/8;
            //$('.make_box .work_area > div').css({"width":Width+'px',"height":Width/0.77+'px'});
            $('.make_box .work_area,.work_area_temp').css({"height":Width/0.77+'px'});
            console.log(Width)
            console.log(box_1_w*1.3)
            console.log(box_1_h*2)
            console.log(box_1_h*4)
            var $start_counter = $( "#event-start" );
            var counts = [ 0, 0, 0 ];


            //起始位置
            var startingGo = "";
            var a1Go = 0;
            var b1Go = 0;
            //素材区
            var zIndex = 10;
            $( ".material_box .block" ).draggable({
                //添加class
                activeClass: "ui-state-highlight",
                //回到拖动起始点
                revert: "invalid",
                //对齐目标
                //snap: true,
                //克隆元素
                //helper:"clone",
                helper:function(event){
                    return $(event.currentTarget.outerHTML);
                },
                //开始
                start: function(event, ui) {
                    startingGo = ui.position;
                    console.log(startingGo)
                    ui.helper.addClass('a1')
                    //$('.work_area').addClass('region');
                    zIndex++
                    // $("div.red_1_3x2.ui-draggable-dragging,div.white_1_3x2.ui-draggable-dragging").css({"width":box_1_w*1.3+"px","height":box_1_h*2+"px","z-index":zIndex});
                    // $("div.red_6x2.ui-draggable-dragging,div.white_6x2.ui-draggable-dragging").css({"width":Width+"px","height":box_1_h*2+"px","z-index":zIndex});
                    // $("div.red_6x4.ui-draggable-dragging,div.white_6x4.ui-draggable-dragging").css({"width":Width+"px","height":box_1_h*4+"px","z-index":zIndex});
                    // $("div.ash_1_9x2.ui-draggable-dragging").css({"width":box_1_w*1.9+"px","height":box_1_h*2+"px","z-index":zIndex});
                    // $("div.ash_3_4x2.ui-draggable-dragging").css({"width":box_1_w*3.4+"px","height":box_1_h*2+"px","z-index":zIndex});
                    // $("div.ash_4x2.ui-draggable-dragging").css({"width":box_1_w*4+"px","height":box_1_h*2+"px","z-index":zIndex});
                    // $("div.ash_6x2.ui-draggable-dragging").css({"width":Width+"px","height":box_1_h*2+"px","z-index":zIndex});

                    $("div.red_1_3x2.ui-draggable-dragging,div.white_1_3x2.ui-draggable-dragging").css({"width":box_1_w*1.3+"px","height":box_1_h*1.8+"px","z-index":zIndex});


                    $("div.red_6x2.ui-draggable-dragging,div.white_6x2.ui-draggable-dragging").css({"width":Width-8+"px","height":box_1_h*1.8+"px","z-index":zIndex});
                    $("div.red_6x4.ui-draggable-dragging,div.white_6x4.ui-draggable-dragging").css({"width":Width-8+"px","height":box_1_h*3.8+"px","z-index":zIndex});

                    $("div.ash_1_9x2.ui-draggable-dragging").css({"width":box_1_w*1.6+"px","height":(box_1_h*1.8)-10+"px","z-index":zIndex});
                    $("div.ash_3_4x2.ui-draggable-dragging").css({"width":box_1_w*3.6+"px","height":(box_1_h*1.8)-10+"px","z-index":zIndex});
                    $("div.ash_4x2.ui-draggable-dragging").css({"width":box_1_w*3.9+"px","height":(box_1_h*1.8)-10+"px","z-index":zIndex});
                    $("div.ash_6x2.ui-draggable-dragging").css({"width":Width-20+"px","height":(box_1_h*1.8)-10+"px","z-index":zIndex});
                    counts[ 0 ]++;
                    updateCounterStatus( $start_counter, counts[ 0 ] );
                },
                //拖拽
                drag: function(event, ui) {
                    //startingGo
                    // if(a1Go === 0){
                    //     startingGo = ui.position;
                    //     a1Go ++
                    // }

                    //animate({left:"-=10px"},'3000')
                    //console.log(event)
                    //console.log(ui)
                    counts[ 1 ]++;
                    //console.log(counts)
                    updateCounterStatus( $start_counter, counts[ 1 ] );
                },
                //结束
                stop: function(event, ui) {

                    a1Go = 0;
                    startingGo = "";
                    //$('.work_area').removeClass('region');
                    console.log("结束")
                    console.log($(this).siblings('.block'))
                    //impact()
                    counts[ 2 ]++;
                    updateCounterStatus( $start_counter, counts[ 2 ] );
                },
            });
            //制作区
            $( ".work_area").droppable({
                // classes: {
                //     "ui-droppable-active": "ui-state-active",
                //     "ui-droppable-hover": "ui-state-hover"
                // },
                //revert: true,
                //抬起事件
                drop: function( event, ui ) {
                    console.log(ui)
                    // console.log(event)
                    // console.log("ui.helper22222222222222222222222222222222")
                    // console.log(ui)
                    // console.log(ui.helper[0].outerHTML)
                    var tempHtml = ui.helper[0].outerHTML

                    if(ui.helper.context == undefined){
                        //判断碰撞检测
                        var isTrue = false;
                        $(".work_area .a1").each(function (i,teap) {
                            console.log(teap)
                            console.log(teap.className.indexOf(' b1'))
                            if(isTrue == false && teap.className.indexOf(' b1') == -1){
                                isTrue = impact(ui.helper[0],teap)
                                if(isTrue === true){
                                    return false
                                }
                            }
                        })
                        if(isTrue){
                            console.log('回到原位1')
                            console.log(startingGo.top)

                            ui.helper.addClass('sham').removeClass('ui-draggable-dragging')
                            $("#recover").append(ui.helper[0].outerHTML);
                            if(startingGo != ""){
                                $("#recover .sham").animate({'left':startingGo.left,'top':startingGo.top,'z-index':'1'},'1000').removeClass('ui-draggable-dragging')
                            }
                            setTimeout(function(){
                                $("#recover").html("")
                            },500)
                            console.log(startingGo.top)
                        }else{
                            $(this).addClass( "ui-state-highlight" ).append(tempHtml);
                            clickShow();
                        }

                        $( ".work_area .block" ).draggable({
                            //回到拖动起始点
                            revert: "invalid",
                            //只在父级内移动
                            containment: "parent",
                            //对齐目标
                            //snap: true,
                            //开始
                            start: function(event, ui) {
                                startingGo = ui.position;
                                console.log(startingGo)
                                console.log('开始2')
                                zIndex++;
                                console.log(ui.helper)
                                ui.helper.addClass('b1').removeClass('a1').css('z-index',zIndex);
                                counts[ 0 ]++;
                                updateCounterStatus( $start_counter, counts[ 0 ] );
                            },
                            //拖拽
                            drag: function(event, ui) {
                                // if(b1Go === 0){
                                //     startingGo = ui.position;
                                //     b1Go ++
                                // }

                                //console.log(event)
                                //console.log(ui)
                                counts[ 1 ]++;
                                //console.log(counts)
                                updateCounterStatus( $start_counter, counts[ 1 ] );
                            },
                            //结束
                            stop: function(event, ui) {
                                ui.helper.addClass('a1').removeClass('b1')
                                b1Go = 0;
                                startingGo = "";

                                console.log("结束")
                                console.log($(this).siblings('.block'))
                                //impact()
                                counts[ 2 ]++;
                                updateCounterStatus( $start_counter, counts[ 2 ] );
                            },
                        });
                    }else{
                        //判断碰撞检测
                        var isTrue = false;
                        $(".work_area .a1").each(function (i,teap) {
                            console.log(teap)
                            console.log(teap.className.indexOf('b1'))
                            if(isTrue === false && teap.className.indexOf(' b1') === -1 && teap.className.indexOf('demarcation_')  === -1){
                                isTrue = impact(ui.helper[0],teap)
                                if(isTrue === true){
                                    return false
                                }
                            }
                        })
                        if(isTrue){
                            ui.helper.addClass('sham').removeClass('ui-draggable-dragging')
                            if(startingGo != ""){
                                ui.helper.animate({'left':startingGo.left,'top':startingGo.top},'1000')
                            }
                        }
                    }
                },
            });
        },
        //删除当前灯箱
        clickCelete : function(t){
        	if (confirm("确认删除当前灯箱吗？") === true){
                $(t).parent().remove();
            }else{
            	$(t).remove();
            }
            return false
            
        },
        //关闭描述框
        describeClose : function(index){
        	var note = Common.trim($('#describe').val(),'g')
    		if(note.length < 4){
    			alert('描述必须4个字以上')
    		}else{
    			$('body').removeClass('vux-modal-open');
            	$('.v-transfer-dom1').hide();
                // if(index === 2){
	        	// 	cabinetMake.preservation();
	        	// }
    		}
        },
        //保存创意
        preservation : function(zData){
        	var note = Common.trim($('#describe').val(),'g');
        	var boxLength = $(".work_area .ui-widget-content.a1").length;
        	if(boxLength < 4){
        		alert('灯箱数量不能少于4')
        		return false
        	}else if(note == ""){
        		$('body').addClass('vux-modal-open');
            	$('.v-transfer-dom1').show();
            	$('.describeCloseBtn').attr('onclick','cabinetMake.describeClose(2)')
        	}else{
        	    if(submit_post === true){
                    $('.demarcation').hide();
                    console.log(document.querySelector(".work_area "))
                    html2canvas(document.querySelector(".work_area ")).then(function(canvas){
                        var base64 = Common.urlEncode(canvas.toDataURL("image/png"));
                        submit_post = false;
                        var code = $('.work_area').html();
                        var data = "file="+base64+"&joining="+code+"&note="+note+"&activityId="+activityId
                        $.ajax({
                            type: 'POST',
                            url: Common.hostUrl()+'pposm_diy/creative',
                            data: data,
                            dataType: "JSON",
                            success: function(res){
                                $('.demarcation').show();
                                submit_post = true;
                                var info = res.data;
                                if(info != undefined && info == true){
                                    self.location = 'cabinet_preview.html?activityId='+activityId;
                                    //window.location.href = ''
                                }else{
                                    alert('提交失败')
                                }
                            },
                            error: function () {
                                $('.demarcation').show();
                                submit_post = true;
                                alert('提交失败')
                            }
                        });
                    })

                }
			}
        },
        course : function () {
            var newSlideSize = function slideSize(){
               // var w = Math.ceil($(".swiper-container").width()/4/*--璋冩暣楂樺害---*/);
                $(".swiper-container,.swiper-wrapper,.swiper-slide").height('100%');
            };
            newSlideSize();
            $(window).resize(function(){
                newSlideSize();
            });

            swiperV = new Swiper('.swiper-container',{
                pagination : '.swiper-pagination',
                prevButton:'.swiper-button-prev',
                nextButton:'.swiper-button-next',
                initialSlide :0,
                // lazyLoading : true,
                // loop:true,
                //effect : 'fade',
                watchSlidesProgress : true,
                // onProgress: function(swiper, progress){
                //     for (var i = 0; i < swiper.slides.length; i++){
                //         var slide = swiper.slides[i];
                //         es = slide.style;
                //         es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'rotate('+360*slide.progress+'deg)';
                //     }
                // },
                onSlideChangeEnd: function(swiper){
                    // var tempSrc = $(".swiper-slide-active").find('img').attr('src');
                    // $(".swiper-slide-active").find('img').attr('src',"");
                    // console.log(tempSrc)
                    // $(".swiper-slide-active").find('img').attr('src',tempSrc);

                }
            });
        }

    }
}();