$(function() {
    //用户优惠券列表，d是总数，是当前页列表
    var couponList = { d: 0, l: [] };
    //优惠券列表表格对象
    var listHtml = $("#userCouponList");
    //构造列表页面方法
    var buildlist = function(i, jq) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsCouponManage.asmx/GetUserUnactivatedCoupon",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"pages":' + i + '}',
            timeout: 15000,
            beforeSend: function() { $("#userCouponList").hide(); $("#loading").show(); },
            error: function() { },
            success: function(r) {
                var temp = eval("(" + r.d + ")");
                //如果列表项总数发生变化重构分页器
                if (couponList.n != temp.n) {
                    jq.AjaxPager({
                        sum_items: temp.n,
                        current_page: i,
                        items_per_page: 10,
                        callback: buildlist
                    });
                }
                //构造列表
                couponList = temp;
                //用户没有优惠券
                if (couponList.n <= 0) {
                    $("#loading").hide();
                    $("#userCouponListPanel").hide();
                    $("#noneList").show();
                    return;
                }
                if (couponList.l.length > 0) {
                    $("#noneList").hide();
                    $("#userCouponListPanel").show();
                    var t = $("#userCouponList");
                    t.empty();
                    $.each(couponList.l, function(index, item) {
                        var inputString = ""
                        if (item.f == 0) {
                            inputString = '<input name="" type="button" value="马上激活" onclick="ActivateCoupon(\'' + item.n + '\',\'' + item.t + '\',false)" />';
                        }
                        else { 
                            inputString = '已过激活期！'
                        }
                        t.append('<tr><td class="w1" id=\"' + item.n + '\"><img src="http://sf.panli.com/FrontEnd/images20090801/newmypanli/score/q' + item.m + '.jpg" alt="' + item.m + '元优惠券" /></td><td class="w2">' + item.n + '</td><td class="w3">' + item.d + '</td><td class="w4">' + item.m + '元</td><td class="w5">' + inputString + '</td></tr>');
                    });
                    $("#loading").hide();
                    t.show();
                }
            }
        });
    }
    buildlist(1, $("#ajaxPager"))
});
//激活优惠券方法
function ActivateCoupon(code,source,isClick) {
    var tcode = "\"" + code + "\"";
    $.ajax({
        type: "POST",
        url: "/App_Services/wsCouponManage.asmx/ActivateCoupon",
        cache: false,
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"code":' + tcode + '}',
        timeout: 15000,
        error: function(d) { $("#showContent").html("您输入的号码为无效号码，请输入正确的优惠券号码。"); },
        success: function(r) {
            if (isClick)
                ClickToActivate(r.d,source, code); //是在输入框点击时候的激活
            else
                ShowActivate(r.d,source,code); //是在优惠券列表点击激活
        }
    }
              );
}
function ShowActivate(message, source, code) {
    if (message == "Success") {
        ShowSuccess(source,code)
    }
    else {
        alert("兑换失败！");
    }
}

function ClickToActivate(message, source, code) {
    switch (message) {
        case "Error":
            $("#showContent").html("您输入的号码为无效号码，请输入正确的优惠券号码。");
            break;
        case "Success":
            ShowSuccess(source,code)
        case "Expired":
            $("#showContent").html("该电子优惠券已过激活期！");
            break;
        case "Nonexistent":
            $("#showContent").html("该电子优惠券不存在。");
            break;
        case "Activated":
            $("#showContent").html("该电子优惠券已激活。");
            break;
        case "Forbidden":
            $("#showContent").html("该电子优惠券只能是指定的账户激活及使用。如有问题，可与客服联系。");
            break;
        default:
            alert("网络错误请稍后再试！");
            break;
    }
}
//点击激活按钮方法
function Click() {
    $("#showContent").show();
    var code = $.trim($("#clickcode").val());
    var reg = new RegExp("^([A-Za-z0-9]{5})-([A-Za-z0-9]{5})-([A-Za-z0-9]{5})-([A-Za-z0-9]{5})-([A-Za-z0-9]{5})$"); //满足格式XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX
    if (code == "") {
        $("#showContent").html("请输入电子优惠券的号码。");
    }
    else if (reg.test(code)) {
        ActivateCoupon(code, true)
    }
    else {
        $("#showContent").html("您输入的号码为无效号码，请输入正确的优惠券号码。");
    }
}
//激活成功后显示
function ShowSuccess(source, code) {
    $("#showContent").html("");
    $("#loading").hide();
    $(".shuru").hide();
    $("#userCouponListPanel").hide();
    $("#userCouponList").hide();
    $("#ajaxPager").hide();
    $("#noneList").hide();
    var list = new Array(); //建立时间对象数组
    list = $("#BeijingDate").html().replace("北京时间：", "").split('-');//得到当前的时间
    var myDate = new Date();
    myDate.setFullYear(list[0], list[1], list[2]); //设置当前时间
    if (source == "活动抽奖")
        myDate.setMonth(myDate.getMonth() + 1); //设置过期时间 = 当前时间+1个自然月
    else
        myDate.setMonth(myDate.getMonth() + 2); //设置过期时间 = 当前时间+2个自然月
    $(".succeed").append('<h2> 恭喜！您的电子优惠券已成功激活！</h2><span>本次激活的电子优惠券号码为' + code + '，有效期至' + myDate.getFullYear() + "-" + myDate.getMonth() + "-" + myDate.getDate() + ' ' + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds() + '！</span><div class="jxl"><h3>接下来您是不是要：</h3><p><a href="/mypanli/Coupon/">查看我的优惠券</a><i>或者</i><a href="/mypanli/Coupon/Active.aspx">继续激活优惠券</a></p></div>').show();
}

$(document).ready(function() {
    $("#clickcode").keydown(function(e) {
        if (e.keyCode == 13) {
            Click();
            return false;
        }
    });
    $("#clickcode").keyup(
       function(){ if ($.trim($("#clickcode").val()) == "") {
        $("#showContent").hide();
    }
    }
    );
    $("#clickcode").focus(
          function(){ if ($.trim($("#clickcode").val()) == "") {
    $("#showContent").hide();
    }
    }
    );
    $("#clickcode").blur(
        function() {
            if ($.trim($("#clickcode").val()) == "") {
                $("#showContent").hide();
            }
        }
    );
});
