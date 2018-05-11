
var Common = function(){
	var config = {
	  //hostUrl : "//192.168.1.100:51901/",                            //本地测试
	  //hostUrl : "//ecp.zuodiangongke.com/",     //60.205.138.98 测试服务器地址
	  //hostUrl : "tmautobot.nongtuitui.cn",          //239测试服务器
	  //hostUrl : "http://wx.ecp-pm.com/",
	  hostUrl : "http://new1.dongfengenglish.com/",
	  //hostUrl : "//localhost:7878/",
	  //hostUrl:'//192.168.1.105:51901/',
	  //hostUrl : "http://192.168.1.126:51901/",
	  //hostUrl : "http://60.205.138.98:51901/",
	  version : "v0.6.1.2",
	  commonParams: {},
	  options: {},
	  //接口请求状态
		ERROK: 1,
		NOREGISTER: -1,
		NORLOGIN: -2,                   //请在微信中登陆
		NOSHOP: -3,
		NOBINDING: -4,                  //账号未注册
		NOEXAMINEETC: -5,               //等待审核
		NOEXAMINEERR: -6,               //审核失败
		NOTEMPINFO: -7                  //填写店铺信息
	}
	return {
		init : function(){
            /*-------------------开始：禁止在微信中分享、转发、收藏 ------------------------*/
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', Common.onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', Common.onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', Common.onBridgeReady);
                }
            } else {
                Common.onBridgeReady();
            }
            /*-------------------结束：禁止在微信中分享、转发、收藏 ------------------------*/
		},
        userInfo : function () {
            var josn = ""
                $.ajax({
                type: 'GET',
                url: Common.hostUrl() + 'track/user_info',
                dataType: "JSON",
                async: false,
                success: function(res) {
                    var info = res.data;
                    if (info != undefined && info.status != undefined) {
                        Common.isLogin(res.errcode,  info.status)
                    } else {
                        Common.isLogin(res.errcode)
                    }
                    josn = info;
                    if (info != undefined && info.userId != undefined) {
                        window.zhuge.identify(res.data.userId, {
                            // 'name': res.data.data.shopName,
                            '用户标识ID': res.data.userId
                            // '用户名': res.data.data.userName,
                            // '当前会员等级': res.data.data.memberLevelRoleName,
                            // '当前积分': res.data.data.score,
                            // '城市': res.data.data.cityName
                            // '烟证号': res.data.data.smokeNumber
                        })
                    }
                },
                error: function(err) {
                    console.log("请求失败")
                    console.log(err)
                    return "";
                }
            });
		    return josn
        },
        //取消微信分享
        onBridgeReady : function () {
            WeixinJSBridge.call('hideOptionMenu');
        },
		 /*
	     * 数据请求地址
	     *调用方法：Common.hostUrl()
	     *
	     * */
	    hostUrl : function(root){
	       if(config.hostUrl.indexOf('192.168.') == -1 && config.hostUrl.indexOf('60.205') == -1 && root != 'root' && root != 'itme'){

	         return config.hostUrl+'api/v1/we_chat/mp/';
	       }else if(root === 'root'){
	         return config.hostUrl;
	       }else if(root === 'itme'){
	         return config.hostUrl +'activity/app-vue/';
	       }else{
	         return config.hostUrl;
	       }
	    },
	    /*
	     * 获取url中的参数
	     *调用方法：Common.getUrlParam()
	     *
	     * */
        getUrlParam : function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        },
        /*
	     * 清楚文本空格
	     * 参数 str: 要去空格的字符串    is_global：是否清楚全部空格（g表示全部）
	     *调用方法：Common.trim()
	     *
	     * */
        trim : function (str,is_global){
		   var result;
		   result = str.replace(/(^\s+)|(\s+$)/g,"");
		   if(is_global.toLowerCase()=="g")
		   {
		    result = result.replace(/\s/g,"");
		    }
		   return result;
		},
		urlEncode: function(sStr) {
			return sStr.replace(/\+/g, '%2B').replace(/\"/g,'%22').replace(/\'/g, '%27').replace(/\//g,'%2F');
		},
        /*
         * 判断请求状态
         * 参数： errcod: 接口请求返回errcod状态  status:用户状态  href:链接地址，默认当前页面地址
         * 调用方法：Common.isLogin(errcod,status,链接地址)
         * 备注: errcode 是必填项
         * */
        isLogin : function(errcode,status, hrefUrl){
            if(hrefUrl != undefined && hrefUrl != null){
                var tempHref = hrefUrl;
            }else{
                var tempHref =  location.href;
            }
            var hrefStr = tempHref.toString();
            hrefStr = hrefStr.replace('#','%23');
            var hash = window.location.hash;
            if (errcode === config.NOBINDING) {
                if(hash.indexOf("#/bound") != -1 || hash.indexOf("#/mobilelogin") != -1 || hash.indexOf("#/register") != -1){}else{
                    if(hash.indexOf('/ecp-item/#/register?invite') != -1){
                        location.href = config.hostUrl+'activity/app-vue/#/register'
                        return false
                    }else{
                        location.href = config.hostUrl+'activity/app-vue/#/mobilelogin'
                        return false
                    }
                }
            } else if (errcode === config.NOREGISTER) {
                location.href = config.hostUrl+'activity/app-vue/#/register'
            } else if (errcode === config.NORLOGIN) {
                location.href = config.hostUrl + 'api/v1/we_chat/mp/oauth2?redirect=' + hrefStr
            } else if (errcode === config.NOSHOP) {
                location.href = config.hostUrl+'activity/app-vue/#/mobilelogin'
            } else if (errcode === config.NOEXAMINEETC || status === 'WAIT') {
                location.href = config.hostUrl+'activity/app-vue/#/auditing'
            } else if (errcode === config.NOEXAMINEERR || status === 'WAITPHOTO') {
                if(hash.indexOf('#/shopInfo') != -1){
                    return false
                }else{
                    location.href = config.hostUrl+'activity/app-vue/#/auditFailed'
                }
            } else if (errcode === config.NOTEMPINFO) {
                location.href = config.hostUrl+'activity/app-vue/#/shopInfo?s=ok'
            }

            if(status != undefined){
                if(status != 'WAIT' && status != 'WAITPHOTO'){
                    if('满足条件')
                        if(hash.indexOf("#/bound") != -1 || hash.indexOf("#/mobilelogin") != -1 || hash.indexOf("#/register") != -1 || hash.indexOf("#/auditFailed") != -1 || hash.indexOf("#/shopInfo") != -1 || hash.indexOf("#/auditing") != -1 ){
                            if(hash.indexOf("#/shopInfo") != -1 && status == "WAITPHOTO"){

                            }else{
                                location.href = config.hostUrl
                            }

                        }
                }
            }
        },

	}
}();
