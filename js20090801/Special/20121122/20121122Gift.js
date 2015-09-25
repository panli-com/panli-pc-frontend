/*
    Author      : yuma 
    DateTime    : 2012-11-20
    Description : 圣诞团购活动领取赠品页面所需要js  
*/
$(document).ready(function () {
    //初始化注册领取事件
    ChristmasGift.InitBtnEvent();
});

var ChristmasGift = {
    modelBtns: {
        "Normal": "http://sf.panli.com/FrontEnd/images20090801/Special/20121122/merry_pic_25.gif", //正常领取图标
        "Limited": "http://sf.panli.com/FrontEnd/images20090801/Special/20121122/merry_pic_28.gif" //今日已领取完图标
    },
    Login: function () {
        window.Panli.Login();
    },
    ReceiveFun: function (ages) {
        if (ages) {
            //获取当前选择的赠品编号
            var _GiftId = ages.data.GiftId;
            $.ajax({
                type: "POST",
                url: "/App_Services/wsSpecial.asmx/ChristmasGroup",
                dataType: "json",
                contentType: "application/json;utf-8",
                data: "{\"GiftId\":\"" + _GiftId + "\"}",
                timeout: 10000,
                beforeSend: function () { },
                complete: function () { },
                error: function () { alert("网络出现出错!"); },
                success: function (res) {
                    if (res.d == "Error") { alert("领取奖品出现错误!"); return false; }
                    if (res.d == "noLogin") { ChristmasGift.Login(); return false; }
                    if (res.d == "AlreadyAdded") { alert("您今天已经领取过礼物了，明天参与团购还可以再来领喔！"); return false; }
                    if (res.d == "Limited") { alert("对不起，当日的发送的赠品已经领取完了"); window.location.href = window.location.href; }
                    if (res.d == "NoQualify") { ChristmasGift.ShowTip(res.d); return false; }
                    if (res.d == "Success") { ChristmasGift.ShowTip(res.d); return false; }
                    if (res.d == "noRange") { alert("对不起，不在圣诞月活动的时间范围不能领取"); return false; }
                }
            });
        }
    },
    ShowTip: function (type) {
        $("div.gl_overlay,div.share_message").show();
        if (type == "NoQualify") {
            $("#SuccessDiv").hide();
            $("#NoQualifyDiv").show();
        }
        if (type == "Success") {
            $("#SuccessDiv").show();
            $("#NoQualifyDiv").hide();
        }
    },
    CloseTip: function () {
        $("div.gl_overlay,div.share_message").hide();
        $("#Success,#NoQualifyDiv").hide();
        window.location.href = window.location.href;
        return false;
    },
    InitBtnEvent: function () {
        //获取所有正常的赠品按钮相对对象
        var Normal = $("a[id^=GiftBtn]").filter(function () {
            return $(this).attr("state") == 1;
        });
        //获取所有的已领取赠品按钮的相对对象
        var Limited = $("a[id]^=GiftBtn").filter(function () {
            return $(this).attr("state") == 2;
        });
        //为正常的赠品注册点击事件
        Normal.each(function () {
            var NormalGift = $(this); //获取当前的jquery对象
            var _Id = NormalGift.attr("gift");
            NormalGift.css("cursor", "pointer");
            NormalGift.bind("click", { GiftId: _Id }, ChristmasGift.ReceiveFun);
            NormalGift.children("img").attr("src", ChristmasGift.modelBtns["Normal"]);
        });
        //为已领取的赠品移除事件
        Limited.each(function () {
            var LimitedGift = $(this);
            var _Id = LimitedGift.attr("gift");
            LimitedGift.unbind("click", { GiftId: _Id }, ChristmasGift.ReceiveFun);
            LimitedGift.children("img").attr("src", ChristmasGift.modelBtns["Limited"]);
        });
    }
};