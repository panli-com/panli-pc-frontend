//领取优惠劵
//document.domain = "panli.com";
var AuCoupon = function (_Code) {
    var Code;
    try {
        if (_Code.length > 0) {
            Code = _Code;
            $("#CouponCode").val(_Code);
        }
        else {
            Code = $("#CouponCode").val();
        }
    } catch (e) {
        Code = $("#CouponCode").val();
    }
    if (Code.length > 0) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsFrock.asmx/AuCoupon",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{\"Code\":\"" + Code + "\"}",
            timeout: 10000,
            beforeSend: function () { $("#ReceiveCoupon").unbind("click", AuCoupon); },
            complete: function () { $("#ReceiveCoupon").bind("click", AuCoupon); },
            error: function () { alert("领取优惠劵发生了错误，请重试!"); },
            success: function (res) {
                if (res.d == "success") { alert('恭喜您！成功领取到了20元优惠劵一张，马上去“我的优惠劵”查看。'); window.location.href = "http://www.panli.com/mypanli/Coupon/"; return false; }
                if (res.d == "collected") { alert('您已获得新会员注册送20元优惠券，本活动不再重复领取，祝您购物愉快！'); window.location.href = "http://www.panli.com/mypanli/Coupon/"; return false; }
                if (res.d == "fail") { alert('领取失败！'); return false; }
                if (res.d == "vaildataError") { alert('您输入的优惠劵代码有误，请核实。'); return false; }
                if (res.d == "notInRangn") { alert('优惠劵已领完。'); window.location.href = "http://www.panli.com/"; return false; }
                if (res.d == "notLogin") {
                    alert("请登录或注册后领取！");
                    var PostBackUrl = "http://www.panli.com/Special/20120910/Default.aspx?Icode=" + Code;
                    window.Panli.Login(PostBackUrl);
//                    var fReg = window.frames[0].document.getElementById("gotoreg");
//                    if (typeof (fReg) != 'undefined') {
//                        if (fReg.href) {
//                            alert(fReg.href);
//                            fReg.href = "http://passport.panli.com/Register/Default.aspx?Origin=enjoy";
//                        }

//                    }
                    return false;
                }
                return false;
            }
        });
    } else {
        alert("请输入您的优惠劵代码!");
    }
};
