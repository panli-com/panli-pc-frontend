﻿function getViewportHeight() { if (window.innerHeight != window.undefined) { return window.innerHeight } if (document.compatMode == "CSS1Compat") { return document.documentElement.clientHeight } if (document.body) { return document.body.clientHeight } return window.undefined }
document.domain = "panli.com";
$(function() {
    window.Panli = {};
    $("#hkey").keypress(function(e) {
        if (e.keyCode == 13) {
            $("#hbtn")[0].click(); return false;
        }
    });

    var url = new RegExp(".aspx\\?sc=\\d*").exec(window.location.href);

    $(".left li a[href='/Help/Search" + url + "']").attr("class", "xt");

    //全局遮蔽层
    window.Panli.overlay = {
        dom: $(document.body).append('<div class="Panli_overlay" id="Panli_overlay"></div>').find("#Panli_overlay"),
        open: function() { window.Panli.overlay.dom.height($(document).height()).show(); },
        close: function() { this.dom.hide(); }
    };
    //加载用户登录信息
    window.Panli.RefleshLoginInfo = function(isCallback) {
        if (isCallback) {
            try {
                LoginCallback();
            } catch (e) { }
        }
    }

    //快速登陆面板
    window.Panli.LoginPanel = {
        d: {}, //dialog对象
        t: {}, //标题栏，包含关闭按钮
        f: {}, //iframe对象       
        init: function() {
            this.d = $('<div style="width:555px;height:454px;position:fixed;margin:-227px 0 0 -227px;background:#ffa500;top:50%;left:50%;overflow:hidden;z-index:1000000;display:none;"></div>');
            this.t = $('<div style="background:url(http://sf.panli.com/FrontEnd/images20090801/AddItemPanel/yj.gif) no-repeat left top;margin -2px 0 0;position:relative;height:32px;"><h2 style="color:#FFF;font-size:14px;font-weight:100;float:left;line-height:32px;margin:0 0 0 10px;display:inline;">' + '登录' + '</h2><a onclick="window.Panli.LoginPanel.toggle()" title="关闭" style="margin:10px 10px 0px 0px;display:inline;width:21px;background:url(http://sf.panli.com/FrontEnd/images20090801/AddItemPanel/close.gif) no-repeat 0px -14px;float:right;height:14px;cursor:pointer;"></a></div>');
            this.f = $('<iframe style="width:535px;height:411px;margin:0 0 0 10px" border="0" allowtransparency="true" scrolling="no" frameBorder="0" src="http://passport.panli.com/UI/QuickLogin.aspx?ReturnUrl=' + encodeURI(document.location.href) + '"></iframe>');

            this.d.append(this.t);
            this.d.append(this.f);
            $('body').append(this.d);
            if (typeof document.body.style.maxHeight == "undefined") {
                this.d.css('position', 'absolute');
                this.d.css('margin-top', '0px');
                this.d.css("top", (divY + document.documentElement.scrollTop).toString());
                $(window).scroll(function() { this.d.css("top", divY + document.documentElement.scrollTop + ""); });
            }
        },
        open: function() {
            window.Panli.overlay.open();
            if ($('div', this.d).length <= 0)
                this.init();
            try {
                this.f.src = 'http://passport.panli.com/UI/QuickLogin.aspx?ReturnUrl=' + encodeURI(document.location.href);
            } catch (e) { }
            this.d.show();
        },
        close: function() {
            this.d.hide();
            window.Panli.overlay.close();
        },
        toggle: function() { $(":visible", this.d).length > 0 ? this.close() : this.open(); }
    }

    //快速登陆方法
    window.Panli.Login = function() {
        window.Panli.LoginPanel.toggle();
    }


//Message层
window.Panli.Message = {
    Panel: {},
    init: function() {
        window.Panli.Message.Panel = $('<div class="Operation_cg"> </div>');
        jQuery(d.body).append(window.Panli.Message.Panel);
    },
    show: function(mess) {
        if (!window.Panli.Message.Panel.text)
            window.Panli.Message.init();
        window.Panli.Message.Panel.text(mess).stop(true, true).show();
        window.Panli.Message.Panel.fadeOut(2000);
    }
}
});
function searchHelp() {
    var key = HtmlEncode($("#hkey").val());
    if ($("#hkey").attr("class") == "" || key == "输入您想搜索的帮助关键词，如：什么是代购") {
        alert("请输入您要查找的内容"); return;
    }
    window.location = "/Help/Search.aspx?k=" + encodeURI(key);
}

function toRed() {
    var keywordReturn = $("#hkey").val();
    $(".jieguo ul li").each(function() {
        var str = $(this).find("h1 a").text();
        str = str.replace(new RegExp("(" + keywordReturn + ")", "ig"), "<font color='#FF0000'>$1</font>");
        $(this).find("h1 a").html(str);
    });
}