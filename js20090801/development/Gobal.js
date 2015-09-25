//获取当前可视高度方法，全局用
function getViewportHeight() { if (window.innerHeight != window.undefined) { return window.innerHeight } if (document.compatMode == "CSS1Compat") { return document.documentElement.clientHeight } if (document.body) { return document.body.clientHeight } return window.undefined }
$(function () {
    window.Panli = {};
    var d = document;
    function InitP2() {
        $("#proAlert").attr("class", "").text("恭喜您！商品信息抓取成功，您可以修改购买数量和填写商品备注！");
        $("#productUrl").val("");
        $("#productName").val("").attr("class", "addpanel_k").removeAttr("disabled").unbind("focus").unbind("blur");
        $("#productPrice").val("").attr("class", "").removeAttr("disabled").unbind("focus").unbind("blur");
        $("#productSendPrice").val("").attr("class", "").unbind("focus");
        $("#productNum").val("1");
        $("#productImg").hide();
        $("#isAuction").hide();
        $("#productImg img").attr("src", "");
        $("#productRemark").attr("class", "addpanel_still").text("请选填颜色、尺寸等要求！");
        $("#successBtn").attr("disabled", "disabled").attr("class", "addpanel_next_no");
        $("#vipPriceS").remove();
    }
    function p3Init() {
        $("#p3_img").attr("src", "http://sf.panli.com/FrontEnd/images20090801/noimg/noimg80.gif");
    }

    //老版本代码，只做历史保留查看用
    //    var AddItemShow = function() {
    //        Panli.Overlay.open();
    //        $(".addpanel_dialog").show();
    //        if ($("#p1 div").length == 0)
    //            $("#p1").load("/AddItemPanel/AddItemPanel1.html", function() { $("#p0").remove(); $("#p1").show(); $("#itemUrl").focus(); });
    //        else $("#itemUrl").focus();
    //        if ($("#p2 div").length == 0)
    //            $("#p2").load("/AddItemPanel/AddItemPanel2.html", function() { $("#p2").hide(); });
    //        if ($("#p3 div").length == 0)
    //            $("#p3").load("/AddItemPanel/AddItemPanel3.html", function() { $("#p3").hide(); });
    //    }

    //    function AddItemShowWithUrl(url) {
    //        Panli.Overlay.open();
    //        $(".addpanel_dialog").show();
    //        if ($("#p1 div").length == 0)
    //            $("#p1").load("/AddItemPanel/AddItemPanel1.html", function() { $("#p0").remove(); $("#p1").show(); $("#itemUrl").val(url).focus(); });
    //        else $("#itemUrl").val(url).focus();
    //        if ($("#p2 div").length == 0)
    //            $("#p2").load("/AddItemPanel/AddItemPanel2.html", function() { $("#p2").hide(); });
    //        if ($("#p3 div").length == 0)
    //            $("#p3").load("/AddItemPanel/AddItemPanel3.html", function() { $("#p3").hide(); });
    //    }

    //    var AddItemClose = function() {
    //        $(".addpanel_dialog").hide();
    //        Panli.Overlay.close();
    //        if ($("#p2 div").length >= 1) {
    //            $("#p2").hide();
    //            InitP2();
    //        }
    //        if ($("#p3 div").length >= 1) {
    //            $("#p3").hide();
    //            p3Init();
    //        }
    //        $(".addpanel_address_").attr("class", "addpanel_address");
    //        $("#itemUrl").removeAttr("disabled").val("");

    //        $("#promptInfo").attr("class", "addpanel_dhk").find("img").remove();
    //        $("#promptInfo p").text("请将您想代购商品的详细页网址粘贴到输入框中提交!");
    //        $("#addpanel_submit").removeAttr("disabled").attr("class", "addpanel_tijiao");

    //        $("#p1").show();
    //    }

    //全局覆盖层
    window.Panli.overlay = {
        dom: jQuery(d.body).append('<div class="Panli_overlay" id="Panli_overlay"></div>').find("#Panli_overlay"),
        open: function () { window.Panli.overlay.dom.height($(d).height()).show(); },
        close: function () { this.dom.hide(); }
    };

    //Panli一键填单
    window.Panli.Crawl = $("#Panli_Crawl");

    window.Panli.Crawl.init = function () {
        InitP2();
    }

    //一键填单显示调用方法
    window.Panli.Crawl.open = function (url) {
        url = url || '';
        window.Panli.overlay.open();
        $(".addpanel_dialog").show();
        if ($("#p1 div").length == 0)
            $("#p1").load("/AddItemPanel/AddItemPanel1.html", function () { $("#p0").remove(); $("#p1").show(); $("#itemUrl").val(url).focus(); });
        else { $("#itemUrl").val(url).focus(); CrawlSubmit(); }
        if ($("#p2 div").length == 0)
            $("#p2").load("/AddItemPanel/AddItemPanel2.html", function () { $("#p2").hide(); });
        if ($("#p3 div").length == 0)
            $("#p3").load("/AddItemPanel/AddItemPanel3.html", function () { $("#p3").hide(); });
    }
    //一键填单隐藏关闭方法
    window.Panli.Crawl.close = function () {
        window.Panli.Crawl.hide();
        window.Panli.overlay.close();
        if ($("#p2 div").length >= 1) {
            $("#p2").hide();
            InitP2();
        }
        if ($("#p3 div").length >= 1) {
            $("#p3").hide();
            p3Init();
        }
        $(".addpanel_address_").attr("class", "addpanel_address");
        $("#itemUrl").removeAttr("disabled").val("");

        $("#promptInfo").attr("class", "addpanel_dhk").find("img").remove();
        $("#promptInfo p").text("请将您想代购商品的详细页网址粘贴到输入框中提交!");
        $("#addpanel_submit").removeAttr("disabled").attr("class", "addpanel_tijiao");

        $("#p1").show();
    }
    window.Panli.Crawl.toggle = function () { if ($(".addpanel_dialog:visible").length > 0) window.Panli.Crawl.close(); else window.Panli.Crawl.open(); }

    //兼容一键填单书签工具
    window.Panli_Tool = window.Panli.Crawl;


    //IE6下滚动跟随
    if (typeof document.body.style.maxHeight == "undefined") {
        window.Panli.Crawl.css("position", "absolute").css("margin-top", "0px");
        var divY = (getViewportHeight() - window.Panli.Crawl.outerHeight()) / 2;
        window.Panli.Crawl.css("top", (divY + document.documentElement.scrollTop).toString());
        $(window).scroll(function () { window.Panli.Crawl.css("top", divY + document.documentElement.scrollTop + ""); });
    }

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

    var CrawlClick2 = function () {
        if (validateUrl()) {
            self.location.href = "/mypanli/SelfPurchase/Order.aspx?szURL=" + url;
        }
        return false;
    }

    //一键填单点击事件
    var CrawlClick = function () {
        if (validateUrl()) {
            $("#CrawlUrl").val('');
            window.Panli.Crawl.open(url);
        }
        return false;
    }
    //一键填单回车事件绑定
    $("#CrawlUrl").keydown(function (e) { if (e.keyCode == 13) { CrawlClick(); return false; } });
    //一键填单点击事件绑定
    $("#PanliCrawlBtn").click(CrawlClick);
    $(".diygo").click(CrawlClick2);

    //一键填单层关闭按钮
    $("#closeBtn").click(function () { window.Panli.Crawl.close(); });


    //加载用户登录信息
    window.Panli.RefleshLoginInfo = function (isCallback) {
        $.getJSON("/App_Scripts/JSData/UserLoginInfo.ashx?u=" + window.location.href + "&r=" + new Date(), function (d) { $("#Gobal_LoginInfo").html(d.s); $("#Gobal_Shoppingcart").html("购物车<span>(" + d.p + ")</span>"); });
        if (isCallback) {
            try {
                LoginCallback();
            } catch (e) { }
        }
    }
    window.Panli.RefleshLoginInfo(false);
    //快速登陆面板
    window.Panli.LoginPanel = {
        d: {}, //dialog对象
        t: {}, //标题栏，包含关闭按钮
        f: {}, //iframe对象       
        init: function () {
            window.Panli.LoginPanel.d = $('<div style="width:555px;height:454px;position:fixed;margin:-227px 0 0 -227px;background:#ffa500;top:50%;left:50%;overflow:hidden;z-index:1000000;display:none;"></div>');
            window.Panli.LoginPanel.t = $('<div style="background:url(http://sf.panli.com/FrontEnd/images20090801/AddItemPanel/yj.gif) no-repeat left top;margin -2px 0 0;position:relative;height:32px;"><h2 style="color:#FFF;font-size:14px;font-weight:100;float:left;line-height:32px;margin:0 0 0 10px;display:inline;">' + '登录' + '</h2><a onclick="window.Panli.LoginPanel.toggle()" title="关闭" style="margin:10px 10px 0px 0px;display:inline;width:21px;background:url(http://sf.panli.com/FrontEnd/images20090801/AddItemPanel/close.gif) no-repeat 0px -14px;float:right;height:14px;cursor:pointer;"></a></div>');
            window.Panli.LoginPanel.f = $('<iframe style="width:535px;height:411px;margin:0 0 0 10px" border="0" allowtransparency="true" scrolling="no" frameBorder="0" src="http://passport.panli.com/UI/QuickLogin.aspx?ReturnUrl=' + encodeURI(document.location.href) + '"></iframe>');

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
            window.Panli.overlay.open();
            if ($('div', window.Panli.LoginPanel.d).length <= 0)
                window.Panli.LoginPanel.init();
            try {
                window.Panli.LoginPanel.f.src = 'http://passport.panli.com/UI/QuickLogin.aspx?ReturnUrl=' + encodeURI(document.location.href);
            } catch (e) { }
            window.Panli.LoginPanel.d.show();
        },
        close: function () {
            window.Panli.LoginPanel.d.hide();
            window.Panli.overlay.close();
        },
        toggle: function () { $(":visible", window.Panli.LoginPanel.d).length > 0 ? window.Panli.LoginPanel.close() : window.Panli.LoginPanel.open(); }
    }

    //快速登陆方法
    window.Panli.Login = function () {
        window.Panli.LoginPanel.toggle();
    }

    //Message层
    window.Panli.Message = {
        Panel: {},
        init: function () {
            window.Panli.Message.Panel = $('<div class="Operation_cg"> </div>');
            jQuery(d.body).append(window.Panli.Message.Panel);
        },
        show: function (mess) {
            if (!window.Panli.Message.Panel.text)
                window.Panli.Message.init();
            window.Panli.Message.Panel.text(mess).stop(true, true).show();
            window.Panli.Message.Panel.fadeOut(2500);
        }
    }

    //免邮商家层切换
    $('#FreeSiteBtn,#FreeSitePanel').hover(function () { $('#FreeSiteBtn').addClass('mysj_on'); $('#FreeSitePanel').show(); }, function () { $('#FreeSiteBtn').removeClass('mysj_on'); $('#FreeSitePanel').hide(); });

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
    } else {
        $("#Default").addClass("xt");
    }
    if (url.indexOf("/special/") > 0) { $('#special').addClass('orange'); }
    else if (url.indexOf("/discount/") > 0) { $('#discount').addClass('orange'); }
    else if (url.indexOf("/free_postage/") > 0) { $('#free_postage').addClass('orange'); }

    //非法一键填单图片
    var ttt = $('<img src="/close.gif" />');
    $("body").append(ttt);

    //常用工具
    $("#Panli_Tools,#Panli_ToolsList").hover(function () { $("#Panli_ToolsList").show(); }, function () { $("#Panli_ToolsList").hide(); });

    //页面底部时钟
    var btime = new Date(parseInt($('#Beijing_Time').val()));
    btime.setMinutes(btime.getMinutes() + btime.getTimezoneOffset());
    setInterval(function () {
        btime.setSeconds(btime.getSeconds() + 1);
        $('#BeijingDate').html('北京时间：' + btime.getFullYear() + '-' + (btime.getMonth() < 9 ? '0' : '') + (btime.getMonth() + 1) + '-' + (btime.getDate() < 9 ? '0' : '') + btime.getDate());
        $('#BeijingTime').html('<span>' + btime.getHours() + '</span><b></b><span>' + (btime.getMinutes() < 10 ? '0' : '') + btime.getMinutes() + '</span><b></b><span>' + (btime.getSeconds() < 10 ? '0' : '') + btime.getSeconds() + '</span>');
    }, 1000);

});
