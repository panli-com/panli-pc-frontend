document.domain = "panli.com";

var saveData = [],datetimes,getDate = function (fun) {
    if (typeof fun === 'function')
        if (datetimes) {
            fun(datetimes);
        } else {
            saveData.push(fun);
        }
    }


$(function () {
    Panli.Overlay.init();
    Panli.Crawl.init({
        SnatchServiceUrl: '/App_Services/wsAddItem.asmx/GetItemSnapshot',
        AddProductUrl: '/App_Services/wsAddItem.asmx/AddToShoppingCart'
    });

    //兼容一键填单书签工具
    window.Panli_Tool = window.Panli.Crawl;


    //以下部分非全局JS，母版页上一键填单JS功能
    $("#CrawlUrl").focus(function () {
        if ($("#CrawlUrl").val() == "http://" || $("#CrawlUrl").hasClass("fast_wz_")) {
            $("#CrawlUrl").css('backgroundImage', 'none').val('');
        }
        $("#CrawlUrl").removeClass("fast_wz_");
    })
    .blur(function () {
        if ($.trim($("#CrawlUrl").val()).length <= 0) {
            $("#CrawlUrl").css('backgroundImage', 'url(http://sf.panli.com/FrontEnd/images20090801/Gobal/topbottonbg.gif)').val("http://");
        }
    });
    //验证一键填单输入
    var validateUrl = function () {
        if ($("#CrawlUrl").hasClass("fast_wz_"))
            return false;
        var url = $.trim($("#CrawlUrl").val());
        if (url.length <= 0 || url == 'http://') {
            $("#CrawlUrl").addClass("fast_wz_").val("请您输入商品链接地址！");
            $("#CrawlUrl").css('backgroundImage', 'none');
            return false;
        }
        var reg = new RegExp("http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?");
        if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0)
            url = "http://" + url;
        if (!reg.test(url)) {
            $("#CrawlUrl").addClass("fast_wz_").val("您输入的链接地址不正确，请核实后再填写！");
            $("#CrawlUrl").css('backgroundImage', 'none');
            return false;
        }
        return true;
    }
    //一键填单回车事件绑定
    $("#CrawlUrl").keydown(function (e) { if (e.keyCode == 13) { isCrawl(); return false; } });
    var isCrawl = function () {//判断是代购或自助购
        if (validateUrl()) {
            var url = $.trim($("#CrawlUrl").val());
            //            $("#CrawlUrl").css('backgroundImage', 'url(http://sf.panli.com/FrontEnd/images20090801/Gobal/topbottonbg.gif)').val("http://");
            //            $('.fast_daigouButton a.on').index() == 0 ? //判断是代购或自助购
            //             window.Panli.Crawl.open(url) : self.location.href = "/mypanli/SelfPurchase/Order.aspx?szURL=" + encodeURIComponent(url);
            var rel = /&#/gi; //特殊地址报错
            url = url.replace(rel, '&');
            if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0)
                url = "http://" + url;
            $('.fast_daigouButton a.on').index() == 0 ? //判断是代购或自助购
            window.location.href = "/Crawler.aspx?purl=" + encodeURIComponent(url) : self.location.href = "/mypanli/SelfPurchase/Order.aspx?szURL=" + encodeURIComponent(url);
        }
    }
    $("#PanliCrawlBtn").click(isCrawl); //点击代购触发事件;

    $(".fast_daigouButton a").click(function () {
        $(this).addClass('on').siblings('.on').removeClass('on');
        $('#PanliCrawlBtn').text($(this).index() == 0 ? "我要代购" : "我要转运");
    }); //代购与自助购切换
    $(".TopCartoon").hover(function () { $(this).find('em').show(); }, function () { $(this).find('em').hide(); }); //二维码隐藏与显示

    //一键填单层关闭按钮
    $("#closeBtn").click(function () { window.Panli.Crawl.close(); });


    //加载用户登录信息

    window.Panli.RefleshLoginInfo = function (isCallback) {
        $.getJSON("/App_Scripts/JSData/UserLoginInfo.ashx?u=" + window.location.href + "&r=" + new Date().getTime(), function (d) { $("#Gobal_LoginInfo").html(d.s); $("#Gobal_Shoppingcart").html("购物车<span>(" + d.p + ")</span><em></em>"); });
        if (isCallback) {
            try {
                LoginCallback();
            } catch (e) { }
        }

        try {
            getLogin();//获取首页用户信息
        } catch (e) { };
    }
    window.Panli.RefleshLoginInfo(false);

    //快速登陆面板
    window.Panli.LoginPanel = {
        d: {}, //dialog对象
        t: {}, //标题栏，包含关闭按钮
        f: {}, //iframe对象
        url: {}, //URL      
        init: function () {
            window.Panli.LoginPanel.d = $('<div style="width:555px;height:454px;position:fixed;margin:-227px 0 0 -227px;background:#ffa500;top:50%;left:50%;overflow:hidden;z-index:1000000;display:none;"></div>');
            window.Panli.LoginPanel.t = $('<div style="background:url(http://sf.panli.com/FrontEnd/images20090801/AddItemPanel/yj.gif) no-repeat left top;margin -2px 0 0;position:relative;height:32px;"><h2 style="color:#FFF;font-size:14px;font-weight:100;float:left;line-height:32px;margin:0 0 0 10px;display:inline;">' + '登录' + '</h2><a onclick="window.Panli.LoginPanel.toggle()" title="关闭" style="margin:10px 10px 0px 0px;display:inline;width:21px;background:url(http://sf.panli.com/FrontEnd/images20090801/AddItemPanel/close.gif) no-repeat 0px -14px;float:right;height:14px;cursor:pointer;"></a></div>');
            window.Panli.LoginPanel.f = $('<iframe style="width:535px;height:411px;margin:0 0 0 10px" border="0" allowtransparency="true" scrolling="no" frameBorder="0" src="http://passport.panli.com/UI/QuickLogin.aspx?ReturnUrl=' + encodeURI(window.Panli.LoginPanel.url) + '"></iframe>');

            window.Panli.LoginPanel.d.append(window.Panli.LoginPanel.t);
            window.Panli.LoginPanel.d.append(window.Panli.LoginPanel.f);
            $('body').append(window.Panli.LoginPanel.d);
            if (typeof document.body.style.maxHeight == "undefined") {
                window.Panli.LoginPanel.d.css('position', 'absolute');
                window.Panli.LoginPanel.d.css('margin-top', '0px');
                window.Panli.LoginPanel.d.css("top", (divY + document.documentElement.scrollTop).toString());
                $(window).scroll(function () { window.Panli.LoginPanel.d.css("top", divY + document.documentElement.scrollTop + ""); });
            }
        },
        open: function () {
            Panli.Overlay.open();
            if ($('div', window.Panli.LoginPanel.d).length <= 0)
                window.Panli.LoginPanel.init();
            try {
                window.Panli.LoginPanel.f.src = 'http://passport.panli.com/UI/QuickLogin.aspx?ReturnUrl=' + encodeURI(window.Panli.LoginPanel.url);
            } catch (e) { }
            window.Panli.LoginPanel.d.show();
        },
        close: function () {
            window.Panli.LoginPanel.d.hide();
            Panli.Overlay.close();
        },
        toggle: function () { $(":visible", window.Panli.LoginPanel.d).length > 0 ? window.Panli.LoginPanel.close() : window.Panli.LoginPanel.open(); }
    }

    //快速登陆方法
    window.Panli.Login = function (tempURL) {
        window.Panli.LoginPanel.url = document.location.href;
        try {
            if (typeof (tempURL) != "undefined" && tempURL != null && tempURL != "" && tempURL.length > 0) {
                window.Panli.LoginPanel.url = tempURL;
            }
        } catch (e) { window.Panli.LoginPanel.url = document.location.href; }
        window.Panli.LoginPanel.toggle();
    }

    //免邮商家层切换
    $('#FreeSiteBtn,#FreeSitePanel').hover(function () { $('#FreeSiteBtn').addClass('mysj_on'); $('#FreeSitePanel').show(); }, function () { $('#FreeSiteBtn').removeClass('mysj_on'); $('#FreeSitePanel').hide(); });
    $('#Gobal_Shoppingcart,#Gobal_BiyProductCount').hover(function () { $('#Gobal_Shoppingcart').addClass('mysj_on'); $('#Gobal_BiyProductCount').show(); }, function () { $('#Gobal_Shoppingcart').removeClass('mysj_on'); $('#Gobal_BiyProductCount').hide(); });

    //标签高亮
    var url = window.location.href;
    url = url.toLowerCase();
    if (url.indexOf("panli.com/see/") > 0) {
        $("#see").addClass("xt");
    } else if (url.indexOf("panli.com/panlirecommend/") > 0) {
        $("#PanliRecommend").addClass("xt");
    } else if (url.indexOf("panli.com/piece/") > 0) {
        $("#Piece").addClass("xt").next("b").remove();
    } else if (url.indexOf("panli.com/grouppurchasing/") > 0) {
        $("#GroupPurchasing").addClass("xt").children("b").remove();
    } else if (url.indexOf("panli.com/cowry/") > 0) {
        $("#cowry").addClass("xt").children("b").remove();
    } else if (url.indexOf("panli.com/vip/") > 0) {
        $("#vip").addClass("xt").children("b").remove();
    }
    else if (url.indexOf("panli.com/information") > 0) {
        $("#panliStory").addClass("xt");
    }
    else {
        $("#Default").addClass("xt");
    }
    if (url.indexOf("/special/") > 0) { $('#special').addClass('orange'); }
    else if (url.indexOf("/discount/") > 0) { $('#discount').addClass('orange'); }
    else if (url.indexOf("/free_postage/") > 0) { $('#free_postage').addClass('orange'); }

    //非法一键填单图片
    var ttt = $('<img src="/close.gif" />');
    $("body").append(ttt);

    //常用工具
    $("#Panli_Tools").hover(function () { $("#Panli_ToolsList").show(); }, function () { $("#Panli_ToolsList").hide(); });
   

    //页面底部时钟
    var btime = new Date(parseInt($('#Beijing_Time').val()));
    btime.setMinutes(btime.getMinutes() + btime.getTimezoneOffset());
    setInterval(function () {
        btime.setSeconds(btime.getSeconds() + 1);
        $('#BeijingDate').html('北京时间：' + btime.getFullYear() + '-' + (btime.getMonth() < 9 ? '0' : '') + (btime.getMonth() + 1) + '-' + (btime.getDate() < 9 ? '0' : '') + btime.getDate());
        $('#BeijingTime').html('<span>' + btime.getHours() + '</span><b></b><span>' + (btime.getMinutes() < 10 ? '0' : '') + btime.getMinutes() + '</span><b></b><span>' + (btime.getSeconds() < 10 ? '0' : '') + btime.getSeconds() + '</span>');
    }, 1000);

    $("body").click(function () { $("#weixinCode").hide(); })
    $('#weixin').bind("click", function (e) { $("#weixinCode").show(); e.stopPropagation(); })


});

//////////////////////////////////////////////搜索开始/////////////////////////////////////////////////////////////////
var txt_search_default_product = "搜商品、查重量、估运费";
var txt_search_default_shop = "搜指定店铺中的商品";
$(function () {
    $('.channel_sou .channel_xl').hover(
        function () {
            $('.channel_sou .channel_list').show();
        },
        function () {
            $('.channel_sou .channel_list').hide();
        }
    );

    $('.channel_sou .channel_list a').click(function () {

        var temp = $.trim($(this).html());
        $(this).html($.trim($(".channel_sou .channel_xz").html()));
        $(".channel_sou .channel_xz").html(temp);

        if ($.trim($("#txt_search_key").val()) == txt_search_default_product) {
            $("#txt_search_key").val(txt_search_default_shop);
        }
        else if ($.trim($("#txt_search_key").val()) == txt_search_default_shop) {
            $("#txt_search_key").val(txt_search_default_product);
        }
        $('.channel_sou .channel_list').hide();
        return false;
    });

    $("#txt_search_key").focus(function () {
        $(".channel_sou .channel_lx").html("");
        $(".channel_sou .channel_lx").hide();
        $(this).removeClass("channel_hui");
        var temp_search_value = $.trim($(this).val());
        if (temp_search_value == txt_search_default_product || temp_search_value == txt_search_default_shop) {
            $(this).val("");
        }
    });

    $("#txt_search_key").blur(function () {
        var temp_search_value = $.trim($(this).val());
        if (temp_search_value == "") {
            $(this).addClass("channel_hui");
            if ($.trim($(".channel_sou .channel_xz").html()) == "商品") {
                $(this).val(txt_search_default_product);
            }
            else {
                $(this).val(txt_search_default_shop);
            }
        }
    });

    $("#btn_search_submit").click(function () {
        SearchTop();
    });

    $("#txt_search_key").keyup(function (e) {
        if (!((e.keyCode >= 65 && e.keyCode <= 105) || (e.keyCode >= 112 && e.keyCode <= 135) || (e.keyCode == 38 || e.keyCode == 32 || e.keyCode == 40 || e.keyCode == 13))) {
            return;
        }
        var timeoutid;
        if (e.keyCode == 13) {
            e.keyCode == 0;
            SearchTop();
            return false;
        }
        else if (e.keyCode == 38) {

        }
        else if (e.keyCode == 40) {

        }
        else if ($.trim($(".channel_sou .channel_xz").html()) == "商品") {
            setTimeout(function () {
                $.ajax({
                    type: "POST",
                    url: "/App_Services/wsSearch.asmx/GetSearchKeyList",
                    cache: false,
                    dataType: "json",
                    contentType: "application/json;utf-8",
                    data: '{"key":"' + $.trim($("#txt_search_key").val()) + '","type":"up"}',
                    timeout: 15000,
                    error: function () { },
                    success: function (r) {
                        if (r != null && r != "" && r.d != null && r.d != "") {
                            $(".channel_sou .channel_lx").show();
                            $(".channel_sou .channel_lx").html(r.d);
                        } else {
                            $(".channel_sou .channel_lx").hide();
                        }
                    }
                });
                clearTimeout(timeoutid);
            }, 30);
        }
    });

    $("#txt_search_key").keydown(function (e) {
        var code = e.keyCode;
        if (!((e.keyCode >= 65 && e.keyCode <= 105) || (e.keyCode >= 112 && e.keyCode <= 135) || (e.keyCode == 38 || e.keyCode == 32 || e.keyCode == 40 || e.keyCode == 13))) {
            return;
        }
        var index = $(".channel_lx .channel_on").length == 0 ? 0 : $(".channel_lx a").index($(".channel_lx .channel_on").eq(0));
        if (code == 38) {//向上
            $(".channel_lx a").removeClass("channel_on");
            if (index == 0) {
                $(".channel_lx a:last").addClass("channel_on");
                $("#txt_search_key").val($(".channel_lx a:last").attr("keyvalue"));
            } else {
                $(".channel_lx a").eq(index - 1).addClass("channel_on");
                $("#txt_search_key").val($(".channel_lx a").eq(index - 1).attr("keyvalue"));
            }
        } else if (code == 40) {//向下
            var backLength = $(".channel_lx .channel_on").length;
            $(".channel_lx a").removeClass("channel_on");
            if (index == $(".channel_lx a").length - 1 || backLength == 0) {
                $(".channel_lx a:first").addClass("channel_on");
                $("#txt_search_key").val($(".channel_lx a:first").attr("keyvalue"));
            } else {
                $(".channel_lx a").eq(index + 1).addClass("channel_on");
                $("#txt_search_key").val($(".channel_lx a").eq(index + 1).attr("keyvalue"));
            }
        }
    });

    $(document).mouseup(function () {
        $(".channel_lx").hide();
    });

    var Request = new Object();
    Request = GetRequest();
    var url_type = Request["type"];
    var url_key = Request["searchKey"];
    if (url_key != null && url_key != "" && url_key.length > 0) {
        $("#txt_search_key").removeClass("channel_hui");
        $("#txt_search_key").val(url_key);
    }
    if (url_type != null && url_type != "" && url_type.length > 0 && url_type == "2") {
        $(".channel_xz").html("店铺");
        $(".channel_list a").html("商品");
    }
});

function GetRequest() {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            try {
                theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            } catch (e) { }
        }
    }
    return theRequest;
}

function channel_lx_over(obj) {
    $(".channel_lx a").removeClass("channel_on");
    $(obj).addClass("channel_on");
}

function channel_lx_click(obj) {
    $("#txt_search_key").val($(obj).attr("keyvalue"));
    SearchTop();
}


function SearchTop() {
    var temp_search_value = $.trim($("#txt_search_key").val());
    if (temp_search_value == txt_search_default_product || temp_search_value == txt_search_default_shop || temp_search_value == "") {
        alert("请输入搜索关键词！");
        $("#txt_search_key").focus();
    }
    else {
        Gobal_Method_AddSearchReocrd(temp_search_value, ($.trim($(".channel_sou .channel_xz").html()) == "商品" ? "1" : "2"), "1");
        var tempUrl = '/search/?searchKey=' + encodeURIComponent(temp_search_value) + "&type=" + ($.trim($(".channel_sou .channel_xz").html()) == "商品" ? "1" : "2");
        window.location.href = tempUrl;
    }
}


function Gobal_Method_AddSearchReocrd(key, type, position) {
    //alert(key + "--" + type + "----" + position);
    $.ajax({
        type: "POST",
        url: "/App_Services/wsSearch.asmx/AddSearchReocrd",
        cache: false,
        async: false,
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"key":"' + $.trim(key) + '","type":"' + type + '","position":"' + position + '"}',
        timeout: 15000,
        error: function () { }, //alert("aaaaaaaaaaaaaa");
        success: function (r) {
        }
    });
}


function Gobal_Method_AddBrowseReocrd(type, position) {
    $.ajax({
        type: "POST",
        url: "/App_Services/wsSearch.asmx/AddBrowseReocrd",
        cache: false,
        async: false,
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"type":"' + type + '","position":"' + position + '"}',
        timeout: 15000,
        error: function () { },
        success: function (r) {
        }
    });
}
//////////////////////////////////////////////搜索结束/////////////////////////////////////////////////////////////////


function shearImg(widths, url) {//传入一个url和高、宽 ,得到一个url裁剪的图片
    return 'http://paypal.panlidns.com/pic.ashx?w=' + widths + '&u=' + encodeURIComponent(url)
}
