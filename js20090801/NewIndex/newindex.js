// JavaScript Document
var isindex = true;//是否为首页 （客服中心模版页与首页登录信息） 不要删除；

var isIE = !!window.ActiveXObject;
var isIE6 = isIE && !window.XMLHttpRequest;
var i = 0, sp = 0;

var newpanli = {};
$(function () {
    $('#Panli_Customer').remove();

    var urlgg = $('.loginmenu .login .change .gg li').length;
    $('.loginmenu .login .change ul.gg li:last').after("<li>" + $('.loginmenu .login .change ul.gg li:first').html() + "</li>");
    var k = 0;
    newpanli.gg = function gg() {
        k++;
        if (k % urlgg == 1 && k > urlgg) {
            $('.loginmenu .login .change ul.gg').css('marginTop', '0');
            k = 1;
        }
        $('.loginmenu .login .change ul.gg').animate({ marginTop: -k * 27 + "px" }, 300);
    };
    var ggs = setInterval("newpanli.gg()", 5000);
    $('.loginmenu .login .change ul.gg').hover(function () { clearInterval(ggs); },
		                                              function () { ggs = setInterval("newpanli.gg()", 5000); });
    //公告

    $('.help-text ul:eq(0) li:last').css('border', 'none');
    $('.help-text ul:eq(1) li:last').css('border', 'none');

    $('.logins .help-text h3').each(function (i, e) {
        $(this).mouseover(function () {
            $('.logins .help-text h3').removeClass('up');
            $(this).addClass('up');
            $('.logins .help-text ul').css('display', 'none');
            $('.logins .help-text ul:eq(' + i + ')').css('display', 'block');
        });
    }); //banner常见问题和推荐切换

    var hid = $('#hidLevelColor').val();
    $('#vips .in-process-left ul li').hover(function () {
        $(this).css('border-color', hid).find('.p').css('backgroundColor', hid).css('border-color', hid).css('color', '#ffffff').find('a').css('color', 'yellow');
        $(this).find('.bottombgs').css('background', hid);
        $(this).find('.right').css('backgroundColor', hid).attr('id', 'vip-up');
    }, function () {
        $(this).css('border-color', '#e0e0e0').find('.p').css('border-color', '#e0e0e0').css('backgroundColor', '').css('color', '#787879').find('a').css('color', '#71a8cf'); ;
        $(this).find('.bottombgs').css('background', 'url(http://sf.panli.com/FrontEnd/images20090801/newindex/f6.jpg)').css('backgroundRepeat', 'no-repeat');
        $(this).find('.right').css('backgroundColor', '').attr('id', '#');
    }); //vip显示

//    var len = $('.bannerimg li').length;
//    var tex = '';
//    for (var il = 0; il < len; il++) {
//        tex += '<li ';
//        if (il == 0) {
//            tex += 'class="li-up"';
//        }
//        tex += ' >&nbsp;&nbsp;&nbsp;</li> ';
//    }
//    $('.cutd').html(tex);

    $('.in-process-left ul.left li').hover(function () { $(this).css('backgroundColor', '#ffc'); }, function () { $(this).css('backgroundColor', ''); });
    $('.in-process-right ul.in-right-ul li').hover(function () { $(this).css('backgroundColor', '#ffc'); }, function () { $(this).css('backgroundColor', ''); });
    //正在拼高亮显示

    $('#aboutlike .in-process-left .topmenu ul li:eq(0),#aboutlike .in-process-left .topmenu ul li:eq(1)').css('border-color', '#fff');
    $('#aboutlike .in-process-left ul.left2:eq(0)').css('display', 'block');
    $('#aboutlike .in-process-left .topmenu ul li').each(function (i, e) {
        $(this).mouseover(function () {
            $('#aboutlike .in-process-left ul.left2').css('display', 'none');
            $('#aboutlike .in-process-left ul.left2:eq(' + i + ')').css('display', 'block');
            var ab = $('#aboutlike .in-process-left .topmenu ul li');
            ab.css('border-color', '#dddddd');
            $('#aboutlike .in-process-left .topmenu ul li a').removeClass('hover');
            $(this).find('a').addClass('hover');
            $(this).css('border-color', '#fff');
            if (i != (ab.length - 1)) {
                $('#aboutlike .in-process-left .topmenu ul li:eq(' + (i + 1) + ')').css('border-left-color', '#fff');
            }
            $('#aboutlike .in-process-left .topmenu ul li:eq(0)').css('border-color', '#fff');
        });
    }); //亲们喜欢类别切换



    var ulnum = $('.in-process-right ul.in-right-ul').length;
    var nums = parseInt($('.in-process-right .top .num').text());
    $('.in-process-right .in-left').click(function () { newpanli.inleft(true); });
    $('.in-process-right .in-right').click(function () { newpanli.inleft(false); });
    newpanli.text = function (txt) {
        var txts = txt.length;
        if (txts >= 1000) {
            $('#suggestContent').val(txt.substr(0, 1000));
            alert('对不起你的留言超过了限定的字符');
            $('.text').html("1000/1000");
            return false;
        }
        $('.text').html(txts + "/1000");

    }; //留言字数显示(超过1000会截取1000以内的字符)
    newpanli.clicks = function () {
        $('.Track_message').show();
        Panli.Overlay.open();
    };
    newpanli.enter = function (e) {
        if (e.keyCode == 13) {
            $("#suggestBtn").click();
            return false;
        }
        return true;
    };
    newpanli.feedback = function () {
        var checkCode = $.trim($("#suggestCheck").val());
        var content = Panli.htmlEncode($.trim($("#suggestContent").val()));
        if (content.length <= 0) {
            alert("请输入您的建议");
            return false;
        }
        if (checkCode.length > 0) {
            $.ajax({
                type: "POST",
                url: "/App_Services/wsFeedBack.asmx/FeedBack",
                dataType: "text",
                contentType: "application/json;utf-8",
                data: "{content:'" + content + "',checkCode:'" + checkCode + "',type:6}",
                timeout: 10000,
                error: function () { alert("提交信息失败"); },
                success: function (msg) {
                    var res = eval("(" + msg + ")").d;
                    if (res == "success") {
                        $("#suggestCheck").val("");
                        $("#suggestContent").val("");
                        $("#checkCode").click();
                        alert("感谢您提出的宝贵意见！");
                        $('.Track_message').hide(); Panli.Overlay.close();
                        return false;
                    }
                    if (res == "fail" || res == "noCheckCode") {
                        $("#checkCode").click();
                        alert("验证码错误");
                        return false;
                    }
                    if (res == "noLogin") {
                        window.Panli.Login();
                        return false;
                    }
                }
            });
        } else {
            alert("请输入验证码");
        }
    };

    newpanli.so = function (poi) {
        var px1;
        if (typeof poi === "string") {
            px1 = $('#' + poi).offset().top;
        } else {
            px1 = poi;
        }
        $('html,body').animate({ scrollTop: px1 }, 800);
        return false;
    };

    var ileft = setInterval("newpanli.inleft(true)", 10000);
    newpanli.inleft = function (s) {
        if (s) {
            nums++;
            if (nums > ulnum - 1) {
                nums = 1;
            }
        } else {
            nums--;
            if (nums <= 0) {
                nums = 3;
            }
        }
        $('.num').text(nums);
        var text = $('.in-process-right .in-right-ul:eq(' + nums + ')').html();
        $('.in-process-right .in-right-ul:eq(0)').html(text);
        $('.in-process-right .in-right-ul li').hover(function () {
            $(this).find('span a').css('display', 'inline');
            $(this).css('backgroundColor', '#ffc');
        }, function () {
            $(this).find('span a').css('display', 'none');
            $(this).css('backgroundColor', '');
        }); //大家都在买（我要购）显示
    };
    $('.in-process-right .in-right-ul:eq(0)').html($('.in-process-right .in-right-ul:eq(' + nums + ')').html());
    $('.in-process-right .in-right-ul li').hover(function () {
        $(this).find('span a').css('display', 'inline');
        $(this).css('backgroundColor', '#ffc');
    }, function () {
        $(this).find('span a').css('display', 'none');
        $(this).css('backgroundColor', '');
    }); //大家都在买（我要购）显示

    //选择网站入口
    chosseEnter();

});


$(function () {
    setInterval(displayTime, 1000);
});
function displayTime() {
    $.each(limitArr, function (i, d) {
        if (d <= 0) {
            $("#gl" + i).html("已截团");
            $("#group" + i + " .l_right").remove("a");
        }
        else {
            $("#gl" + i).html("剩余<span>" + parseInt(d / 86400) + "</span>天<span>"
                        + parseInt((d % 86400) / 3600) + "</span>小时<span>" + parseInt((d % 3600) / 60)
                        + "</span>分<span>" + parseInt(d % 60) + "</span>秒"); limitArr[i]--;
        }
    });
}

function SetGeli(d) {
    $.ajax({
        type: "POST",
        url: "/App_Services/wsCowry.asmx/AddWellNumber",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"id":' + d + "}",
        timeout: 10000,
        error: function () {
            alert("网络错误，请稍后重试。");
        },
        success: function (f) {
            var e = new Date();

            if (f.d == "Success") {
                window.Panli.Message.show("给栗成功！");
                //$("#gelivibleBtn span").text(parseInt($("#gelivibleBtn span").text()) + 1);
                return;
            }
            if (f.d == "noLogin") {
                window.Panli.Login();
                return;
            }
            if (f.d == "Oneself") {
                alert("不能给栗自己的宝贝！");
                return;
            }
            if (f.d == "Welled") {
                alert("这个商品你已经给栗过了！");
                return;
            }
            if (f.d == "Limit") {
                alert("你今天给栗次数到上限了！");
                return;
            }
            if (f.d == "NotFoundShare") {
                alert("没有找到要给力的宝贝！");
                return;
            }
            if (f.d == "Error") {
                alert("系统错误！");
                return;
            }
        }
    });
    return false;
}

//设置心仪商家
function SetXinYiShangJia(temp_shopid) {

    Panli.Overlay.open();
    $('#vipshopslist .p').hide();

    gobalShopID = parseInt(temp_shopid);

    var arr = GetShopClassByShopID(temp_shopid);

    $(".search_overlay").show();
    $("#div_dialog_xinyishangjia").show();
    $("#div_dialog_xinyishangjia .dianpu img").attr("src", arr[1]);
    $("#div_dialog_xinyishangjia .dianpu a").attr("href", arr[0]);
    $("#div_dialog_xinyishangjia .shuoming h3").html("确定要将\"" + arr[2] + "\"设置为心仪商家吗?");
    $("#div_dialog_xinyishangjia .shuoming p").eq(0).find("span").html(arr[3] + "折");

    $("#div_dialog_xinyishangjia_success .chenggong p").eq(0).find("span").html(arr[3] + "折");
    $("#div_dialog_xinyishangjia_success .chenggong h3").html("成功将\"" + arr[2] + "\"设置为心仪商家！");
    $("#div_dialog_xinyishangjia_success .goon a").eq(1).attr("href", arr[0]);
}

function GetShopClassByShopID(shopID) {
    var strArr = [];
    $("#vipshopslist li[name='" + shopID + "']").each(function () {
        strArr.push($(this).find(".vipimg").attr("href")); //url
        strArr.push($(this).find(".vipimg img").attr("src")); //logo
        strArr.push($(this).find(".vipimg img").attr("alt")); //name
        strArr.push($(this).find(".vipimg input[name='lowestDiscount']").val()); //lowest discount

        return false;
    });
    return strArr;
}

//关闭层
$(".search_dialog .search_close a,.search_dialog .queding .see_else,#goonSetXinYiShangJia").live("click", function () {
    $(".search_overlay").hide();
    $("#div_dialog_xinyishangjia,#div_dialog_xinyishangjia_success").hide();
    Panli.Overlay.close();

});

$(".search_dialog .queding .button a").live('click', function () {
    $.ajax({
        type: "POST",
        url: "/App_Services/wsVIP.asmx/AddShop",
        cache: false,
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"shopID":' + gobalShopID + '}',
        timeout: 15000,
        error: function () { alert("网络错误请重新再试"); },
        success: function (rr) {
            var r = $.parseJSON(rr.d);
            if (r.result == "0") {
                $("#div_dialog_xinyishangjia_success .chenggong p").eq(1).html("您还可以将" + r.count + "家折扣商家设置为心仪商家。");
                $("#div_dialog_xinyishangjia").hide();
                $("#div_dialog_xinyishangjia_success").show();
                //SetShopClassByShopID(r.count);
            }
            else if (r.result == "1") {
                alert("您已填加3个店铺");
            }
            else if (r.result == "2") {
                alert("该店铺已填加");
            }
            else if (r.result == "3") {
                alert("您的等级不够");
            }
            else if (r.result == "4") {
                alert("没有找到该店铺");
            }
            else {
                alert("网络错误请重新再试");
            }
        }
    });
});

function chosseEnter() {
    var cname = "ENTrace";
    //var cookiedata = getQueryAllString(cname);
    var chooseSiteEnterToken = jaaulde.utils.cookies.get(cname);

    if (chooseSiteEnterToken != null) {
        var data;
        $("#plsite").click(function () {
            if ($("#RememberMe").is(":checked")) {
                data = 'site=http://www.panli.com&choose=1'; jaaulde.utils.cookies.set(cname, data, { domain: 'panli.com', hoursToLive: 7 * 24 });
            }
            closeChooseEnter();
            return false;
        });
        $("#enplsite").click(function () {
            if ($("#RememberMe").is(":checked")) {
                data = 'site=http://www.panlishop.com&choose=1'; jaaulde.utils.cookies.set(cname, data, { domain: 'panli.com', hoursToLive: 7 * 24 });
            }
            window.location.href = "http://www.panlishop.com?click=enpanliTipslayer0";
            return false;
        });
    }
}

function closeChooseEnter() {
    $("div.ams_zywtz,div.xame_overlay").hide();
}

function getQueryAllString(cname) {
    var arr = document.cookie.match(new RegExp("(^| )" + cname + "=([^;]*)(;|$)"));
    var theRequest = new Object();
    if (arr != null) {
        var url = unescape(arr[2])
        strs = url.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
        return theRequest;
    }
    return theRequest;
}



/*load首页star*/

function loading(para) {
    var oldpara = {
        size: 15,
        length: 5,
        margin: 0.3,
        dom: $('.loginData'),
        speed: 150
    };
    this.para = $.extend(oldpara, para || {});
    this.init();
};
loading.prototype = {
    init: function () {
        var para = this.para, htmllist,
           size = para.size, bsize = size - 2;

        var w = size * (1 + para.margin) * para.length;
        htmllist = '<ul class="jsload" style="position: absolute;width:' + w + 'px;height:' + size + 'px;left:50%;top:50%;margin:' + (-size / 2) + 'px 0 0 ' + (-w / 2) + 'px">';
        for (var i = 0; i < para.length; i++) {
            htmllist += '<li style="float:left; border:solid 1px #ddd; border-radius:50%;background:#fff; display:inline; width:' + bsize + 'px;height:' + bsize + 'px;margin:0 ' + size * (para.margin / 2) + 'px;"></li>'
        }
        htmllist += '</ul>';
        this.htmls = htmllist;

    },
    open: function () {
        var para = this.para;
        para.dom.html(this.htmls);
        this.anmate();
    },
    close: function () {
        var para = this.para;
        para.dom.find('.jsload').remove();
        this.isclose = true;
    },
    anmate: function () {
        var _this = this, para = this.para, i = 0, setTimes;
        function load() {
            para.dom.find('li:eq(' + i + ')').css('background', '#f60').siblings('li').css('background', '#fff');
            i++;
            if (i >= para.length) i = 0;
            if (!_this.isclose)
                setTimes = setTimeout(load, para.speed);
        }
        load();
    }
};


function getLogin() {
    var indexLoad = new loading(); //js load效果
    $.ajax({
        type: "POST",
        url: "/App_Services/wsDefault.asmx/GetUserDetail",
        cache: false,
        dataType: "json",
        contentType: "application/json;utf-8",
        timeout: 15000,
        error: function () { },
        beforeSend: function () { indexLoad.open(); }, //load js 开始
        complete: function () { indexLoad.close() }, //load js 结束
        success: function (r) {
            var d = eval('(' + r.d + ')');
            var htmldata = r.d ? '<div class="login-com"><a class="lo-left" href="/mypanli/OrderCart.aspx" target="_blank">已到Panli(<em>' + d.acceptedPro + '</em>)</a><a href="/mypanli/OrderCart.aspx" target="_blank">我的仓库(<em>' + d.totalPro + '</em>)</a><a class="lo-left" href="/mypanli/OrderList.aspx" target="_blank">待确认收货(<em>' + d.deliveredShip + '</em>)</a><a href="/mypanli/MessageBox/SystemMessage.aspx" target="_blank">未读短信(<em>' + d.unreadMsg + '</em>)</a></div>' :
                                     '<div class="login-dl"><a href="http://passport.panli.com/Register/" target="_blank" class="enroll">免费注册</a><a href="javascript:void(0)" target="_blank" onclick="window.Panli.Login();return false;" class="enter">登录</a></div>';
            $('.logins .loginData').html(htmldata);
        }
    });
 }
/*load首页end*/
