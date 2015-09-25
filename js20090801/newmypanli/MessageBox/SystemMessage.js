//构造列表页面方法
var buildlist = function (i, jq) {
    //用户优惠券列表，d是总数，是当前页列表
    var couponList = { d: 0, l: [] };
    //优惠券列表表格对象
    var listHtml = $("#messageList");
    $.ajax({
        type: "POST",
        url: "/App_Services/wsMessage.asmx/GetSystemMessage",
        cache: false,
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"type":"' + $("#ajaxPager").data("type") + '","searchKey":"' + $("#ajaxPager").data("key") + '","pages":' + i + '}',
        timeout: 15000,
        beforeSend: function () { $("#load").show(); $("#messageList").hide(); $("#noneList").hide(); $("#ajaxPager").hide(); },
        error: function () { alert("网络错误请重新再试") },
        success: function (r) {
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
            //用户没有短消息
            if (couponList.l.length <= 0) {
                $("#messageList").hide();
                $("#load").hide();
                $("#noneContent").html(" 您的短信箱中目前没有系统短信！");
                if ($("#ajaxPager").data("type") == "CouponNotification") $("#noneContent").html("您的短信箱中目前没有优惠券短信！");
                if ($("#ajaxPager").data("type") == "OtherNotification") $("#noneContent").html("您的短信箱中目前没有系统短信！");
                if ($("#ajaxPager").data("type") == "ShoppingGroupNotification") $("#noneContent").html("您的短信箱中目前没有团购通知短信！");
                $("#noneList").show();
                return;
            }
            if (couponList.l.length > 0) {
                $("#messageList").show();
                var t = $("#messageList");
                t.empty();
                $.each(couponList.l, function (index, item) {
                    var cssClass = "message"; //得到短消息的图标
                    var isBlod = "no_c"; //是否为粗体
                    var showLine = "";
                    var content = "";
                    var title = "";
                    var delString = '<a onClick="DelMessage(' + item.n + ',' + item.r + ')" style="display:none;cursor:pointer;" id="a' + item.n + '">删除</a> ';
                    if (item.r == "true") {
                        cssClass = "already";
                        isBlod = "";
                    }
                    switch (item.m) {
                        case "CouponNotification":
                            content = item.c;
                            cssClass = cssClass + "_yf"; //优惠券短信
                            if (item.t == "激活优惠券") {
                                showLine = "<a onClick=\"clickMessageLink('_yf','" + item.n + "')\"  href=\"/mypanli/coupon/active.aspx\" style=\"cursor:pointer\">立即查收&raquo;</a>";
                            }
                            else if (item.t == "paypal活动优惠券") {
                                showLine = "<a onClick=\"clickMessageLink('_yf','" + item.n + "')\" href=\"/mypanli/Coupon/\"  style=\"cursor:pointer\">查看详情&raquo;</a>";
                            }
                            else {
                                //showLine = "<a onClick=\"clickMessageLink('_yf','" + item.n + "')\" href=\"/mypanli/Coupon/\"  style=\"cursor:pointer\">立即查收&raquo;</a>";
                                // Tom 2013-03-28 改
                                showLine = "<a onClick=\"clickMessageLinkByTom('_yf','" + item.n + "','/mypanli/Coupon/')\" href=\"javascript:void(0);\"  style=\"cursor:pointer\">立即查收&raquo;</a>";
                            }
                            title = "优惠券短信";
                            break;
                        case "LocalRechargeNotification":
                            content = item.c;
                            cssClass = cssClass + "_xt"; //充值短信
                            if (item.t == "充值成功") {
                                showLine = "<a onClick=\"clickMessageLink('_xt','" + item.n + "')\"  href=\"/mypanli/Account/RmbAccount.aspx\" style=\"cursor:pointer\">立即查收&raquo;</a>";
                            }
                            else if (item.t == "充值未到账") {
                                showLine = "<a onClick=\"clickMessageLink('_xt','" + item.n + "')\" style=\"cursor:pointer\"> 我知道了&raquo;</a>";
                            }
                            title = "充值短信";
                            break;
                        case "Notice":

                            cssClass = cssClass + "_xt"; //系统通知
                            if (item.r == "true") {
                                content = "<a onClick=\"$('.duanxin').show();$('.dx_nr').html('<h1>" + item.t + "</h1>" + item.c + "');Panli.Overlay.open()\" style=\"cursor:pointer\" >" + item.t + "</a>";
                                showLine = "<a onClick=\"$('.duanxin').show();$('.dx_nr').html('<h1>" + item.t + "</h1>" + item.c + "');Panli.Overlay.open()\" style=\"cursor:pointer\" >查看详情&raquo;</a>";
                            }
                            else {
                                content = "<a onClick=\"clickNoticeLink('_xt','" + item.n + "');$('.duanxin').show();$('.dx_nr').html('<h1>" + item.t + "</h1>" + item.c + "');Panli.Overlay.open()\" style=\"cursor:pointer\" >" + item.t + "</a>";
                                showLine = "<a onClick=\"clickNoticeLink('_xt','" + item.n + "');$('.duanxin').show();$('.dx_nr').html('<h1>" + item.t + "</h1>" + item.c + "');Panli.Overlay.open()\" style=\"cursor:pointer\" >查看详情&raquo;</a>";
                            }
                            delString = '<a onClick="DelNotice(' + item.n + ',' + item.r + ')" style="display:none;cursor:pointer;" id="a' + item.n + '">删除</a> ';
                            title = "系统通知";
                            break;
                        case "OtherNotification":

                            cssClass = cssClass + "_xt"; //系统通知
                            if (item.r == "true") {
                                content = "<a onClick=\"$('.duanxin').show();$('.dx_nr').html('<h1>" + item.t + "</h1>" + item.c + "');Panli.Overlay.open()\" style=\"cursor:pointer\" >" + item.t + "</a>";
                                showLine = "<a onClick=\"$('.duanxin').show();$('.dx_nr').html('<h1>" + item.t + "</h1>" + item.c + "');Panli.Overlay.open()\" style=\"cursor:pointer\" >查看详情&raquo;</a>";
                            }
                            else {
                                content = "<a onClick=\"clickMessageLink('_xt','" + item.n + "');$('.duanxin').show();$('.dx_nr').html('<h1>" + item.t + "</h1>" + item.c + "');Panli.Overlay.open()\" style=\"cursor:pointer\" >" + item.t + "</a>";
                                showLine = "<a onClick=\"clickMessageLink('_xt','" + item.n + "');$('.duanxin').show();$('.dx_nr').html('<h1>" + item.t + "</h1>" + item.c + "');Panli.Overlay.open()\" style=\"cursor:pointer\" >查看详情&raquo;</a>";
                            }
                            title = "系统通知";
                            break;
                        case "ShoppingGroupNotification":
                            content = item.c;
                            cssClass = cssClass + "_tuan"; //团购通知
                            if (item.r == "true")
                                showLine = "";
                            else
                                showLine = "<a onClick=\"clickMessageLink('_tuan','" + item.n + "');$(this).hide();\" style=\"cursor:pointer\">我知道了</a>";
                            title = "团购通知";
                            break;
//                        case "ShoppingGroupGift"://未确认名字的礼品信息
//                            content = item.c;
//                            cssClass = cssClass + "_gift"; //团购通知
//                            if (item.r == "true")
//                                showLine = "";
//                            else
//                                showLine = "<a onClick=\"clickMessageLink('_gift','" + item.n + "');$(this).hide();\" style=\"cursor:pointer\">我知道了</a>";
//                            title = "团购通知";
//                            break;
                        case "":
                            pm = null;
                            break;
                    }
                    t.append("<li id=\"l" + item.n + "\" onmousemove=\"$('#a" + item.n + "').show();\" onmouseout=\"$('#a" + item.n + "').hide();\"><div class=\"" + cssClass + "\" title=\"" + title + "\"></div><div class=\"mail\"><h1 class=\"" + isBlod + "\">" + content + "</h1>" + showLine + "</div><div class=\"fasong\"><p>" + item.d + "</p>" + delString + "</div></li>")
                });
                t.show();
                $("#load").hide();
                $("#noneList").hide();

            }
        }
    });
}
$(function () {
    $("#ajaxPager").data("type", "");
    $("#ajaxPager").data("key", "");
    buildlist(1, $("#ajaxPager"));

});
function setCount() {
    if (sysCount > 1) {
        sysCount--;
        $(".info li").eq(0).html("系统短信：<a href=\"/mypanli/MessageBox/SystemMessage.aspx\">" + sysCount + "条新</a><span>[系统短信由系统自动发送，您可以在此进行查看。]</span>");
        $(".xz span").html("(" + sysCount + ")");
        $("#Gobal_LoginInfo span").html("(" + sysCount + ")");

    }
    else {
        $(".info li").eq(0).html("系统短信：0条新<span>[系统短信由系统自动发送，您可以在此进行查看。]");
        $(".xz span").hide();
        $("#Gobal_LoginInfo span").hide();
    }
}
//点击改变短信息状态
function clickMessageLink(type, id) {
    $.ajax({
        type: "POST",
        url: "/App_Services/wsMessage.asmx/SetRedMessage",
        cache: false,
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"messageId":' + id + '}',
        timeout: 15000,
        error: function (a, b, c) { alert("网络错误请重新再试") },
        success: function (r) {
            if (r.d == "success") {
                if ($("#l" + id + " div").eq(0).attr("class").indexOf("already") < 0) {
                    setCount();
                }
                $.each($("#l" + id + " div"), function (index, item) {
                    if (index == 0)
                        $(this).attr("class", "already" + type);
                    if (index == 1)
                        $(this).find("h1").attr("class", "");
                }
                            )

            }
            else
                alert("网络错误请重新再试");
        }
    }
                    );

}
//点击改变短信息状态 Tom 2013-03-28
function clickMessageLinkByTom(type, id, url) {
    $.ajax({
        type: "POST",
        url: "/App_Services/wsMessage.asmx/SetRedMessage",
        cache: false,
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"messageId":' + id + '}',
        timeout: 15000,
        error: function (a, b, c) { alert("网络错误请重新再试") },
        success: function (r) {
            if (r.d == "success") {
                window.location.href = url;
            }
            else {
                alert("网络错误请重新再试");
            }
        }
    });
}
//设置公告为已读
function clickNoticeLink(type, id) {
    $.ajax({
        type: "POST",
        url: "/App_Services/wsMessage.asmx/SetNoticeRed",
        cache: false,
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"noticeId":' + id + '}',
        timeout: 15000,
        error: function (a, b, c) { alert("网络错误请重新再试") },
        success: function (r) {
            if (r.d == "success") {
                if ($("#l" + id + " div").eq(0).attr("class").indexOf("already") < 0) {
                    setCount();
                }
                $.each($("#l" + id + " div"), function (index, item) {
                    if (index == 0)
                        $(this).attr("class", "already" + type);
                    if (index == 1)
                        $(this).find("h1").attr("class", "");
                }
                            )

            }
            else
                alert("网络错误请重新再试");
        }
    }
                    );

}
function ChangeTypeClass(dom) {
    $(dom).parent("li").nextAll("li").attr("class", "");
    $(dom).parent("li").prevAll("li").attr("class", "")
    $(dom).parent("li").attr("class", "c_on")
}

//删除短消息
function DelMessage(messageId, isRead) {
    if (confirm("您确定要清除这条短信吗？清除后将不可恢复哦！")) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsMessage.asmx/DelSystemMessage",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"messageId":' + messageId + '}',
            timeout: 15000,
            error: function (a, b, c) { alert("网络错误请重新再试") },
            success: function (r) {
                if (r.d == "success") {
                    if ($("#messageList li").length > 1) {
                        if ($("#l" + messageId + " div").eq(0).attr("class").indexOf("already") < 0) {
                            setCount();
                        }
                        $("#l" + messageId + "").remove();
                    }
                    else {
                        buildlist(1, $("#ajaxPager"));
                    }

                }
                else
                    alert("网络错误请重新再试");
            }
        }
                    );
    }
}
//删除公告
function DelNotice(noticeId, isRead) {
    if (confirm("您确定要清除这条短信吗？清除后将不可恢复哦！")) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsMessage.asmx/DelSystemNotice",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"noticeId":' + noticeId + '}',
            timeout: 15000,
            error: function (a, b, c) { alert("网络错误请重新再试") },
            success: function (r) {
                if (r.d == "success") {
                    if ($("#messageList li").length > 1) {
                        if ($("#l" + noticeId + " div").eq(0).attr("class").indexOf("already") < 0) {
                            setCount();
                        }
                        $("#l" + noticeId + "").remove();
                    }
                    else {
                        buildlist(1, $("#ajaxPager"));
                    }
                }
                else
                    alert("网络错误请重新再试");
            }
        }
                    );
    }
}
