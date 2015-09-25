/*
    Author : yuma 
    DateTime  : 2012-09-20
*/
var gift = {
    modelBtns: {
        1: "http://sf.panli.com/FrontEnd/images20090801/special/20121010/gift/tg_li_40.gif",
        2: "http://sf.panli.com/FrontEnd/images20090801/special/20121010/gift/tg_li_43.gif",
        3: "http://sf.panli.com/FrontEnd/images20090801/special/20121010/gift/tg_li_46.gif"
    },
    exchange: function (event) {
        if (event) {
            var id = event.data.id;
            var group = event.data.group;
            var src = event.data.src;
            var name = event.data.name;
            $.ajax({
                type: "POST",
                url: "/App_Services/wsSpecial.asmx/SpecialGift",
                dataType: "json",
                contentType: "application/json;utf-8",
                data: "{\"id\":\"" + id + "\",\"group\": \"" + group + "\"}",
                timeout: 10000,
                beforeSend: function () { $("#repeattip,#pointtip,#coupontip,#producttip").hide(); },
                complete: function () { },
                error: function () { alert("网络出现出错!"); },
                success: function (res) {
                    if (res.d == "Fail") { alert("领取奖品出现错误!"); return false; }
                    if (res.d == "Limited") { alert("该奖品已经被领取完了!"); return false; }
                    if (res.d == "NoQualify") { alert("对不起，您还没有达到领取奖品的条件!"); return false; }
                    if (res.d == "AlreadyAdded") { gift.showTip(-1, name, src); return false; }
                    if (res.d == "Success") { gift.showTip(id, name, src); return false; }
                    if (res.d == "noLogin") { gift.login(); return false; }
                }
            });
        }
    },
    login: function () {
        window.Panli.Login();
    },
    showTip: function (id, name, src) {
        if (id == -1) {
            $("#repeattip").show();
        }
        else if (id == 8) {
            $("#pointtip").show();
        }
        else if (id == 9) {
            $("#coupontip").show();
        }
        else {
            $("#productimg").attr({ "alt": name, "src": src });
            $("#productname").html("").html(name);
            $("#producttip").show();
        }
        $("div.share_message").show();
        $("div.gl_overlay").show();

    },
    closeTip: function () {
        $("div.share_message").hide();
        $("div.gl_overlay").hide();
        $("div.choujiang_jieguo").hide();
        $("#repeattip,#pointtip,#coupontip,#producttip").hide();
        window.location.href = window.location;
    },
    initBtnsEvent: function () {
        //[1,2,3]  1: 允许， 2：禁止，3：完毕
        var modelOne = $("a[id^=gift]").filter(function () {
            return $(this).attr("state") == 1;
        });
        var modelTwo = $("a[id^=gift]").filter(function () {
            return $(this).attr("state") == 2;
        });
        var modelThree = $("a[id^=gift]").filter(function () {
            return $(this).attr("state") == 3;
        });
        //可以领取的商品需要注册领取的事件
        modelOne.each(function () {
            var _name = $(this).parent().parent().find(".picmark").attr("alt");
            var _src = $(this).parent().parent().find(".picmark").attr("src");
            var _id = $(this).attr("id").split("_")[1];
            var _group = $(this).attr("group");
            $(this).children("img").attr("src", gift.modelBtns[1]);
            $(this).bind("click", { id: _id, group: _group, name: _name, src: _src }, gift.exchange);
            $(this).css("cursor", "pointer");
        });
        //禁止领取的商品需要卸载事件
        modelTwo.each(function () {
            $(this).children("img").attr("src", gift.modelBtns[2]);
            $(this).unbind("click", gift.exchange);
        });
        //领取完了的商品需要卸载事件
        modelThree.each(function () {
            $(this).children("img").attr("src", gift.modelBtns[3]);
            $(this).unbind("click", gift.exchange);
        });
    }
};
$(document).ready(function () {
    gift.initBtnsEvent();
});