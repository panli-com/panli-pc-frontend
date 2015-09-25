// 根据身份证号码生成生日和性别
function showBirthdayandSex(obj) {
    //目前16岁
    var thisdata = new Date(1995, 12, 1);
    var val = obj.value;
    var birthdayValue;
    if (15 == val.length) {// 15位身份证号码
        birthdayValue = val.charAt(6) + val.charAt(7);
        if (parseInt(birthdayValue) < 10) {
            birthdayValue = '20' + birthdayValue;
        } else {
            birthdayValue = '19' + birthdayValue;
        }
        var year = birthdayValue;
        var month = val.charAt(8) + val.charAt(9);
        var day = val.charAt(10) + val.charAt(11);
        birthdayValue = new Date(parseInt(year), parseInt(month), parseInt(day));
        if (birthdayValue > thisdata)
            return false;
        else
            return true;

    }
    if (18 == val.length) {// 18位身份证号码
        var year = val.charAt(6) + val.charAt(7) + val.charAt(8) + val.charAt(9);
        var month = val.charAt(10) + val.charAt(11);
        var day = val.charAt(12) + val.charAt(13);
        var birthdayValue = new Date(parseInt(year), parseInt(month), parseInt(day));
        if (birthdayValue > thisdata)
            return false;
        else
            return true;
    }
}



$(function () {


    $("#IdCard").focus(function () {
        $("#IdCardtiperror").hide();
        $("#IdCardtip").show();
        $(this).removeClass("red");
    }).blur(function () {
        //^\\d{17}(\\d|x)$
        ///(^[1-9]([0-9]{14}|[0-9]{17})$)/;
        //^(\d{14}|\d{17})(\d|[xX])$
        var idcardregex = /^(\d{14}|\d{17})(\d|[xX])$/;
        if ($(this).val() == "") {
            $(this).triggerHandler("focus");
        } else {
            if ($(this).val() != "" && !idcardregex.test($(this).val())) {
                $("#IdCardtiperror").html("请填写您的中国大陆身份证").show();
                $("#IdCardtip").hide();
                $(this).addClass("red");
            } else {
                if (!showBirthdayandSex($(this)[0])) {
                    $("#IdCardtiperror").html("很抱歉，代注册申请需年满16周岁。").show();
                    $("#IdCardtip").hide();
                    $(this).addClass("red");
                }
            }

        }
    });



    $("#UserNmae").focus(function () {
        $("#UserNmaetip").show();
        $("#UserNmaetiperror").hide();
        $(this).removeClass("red");
    }).blur(function () {

        if ($(this).val() == "") {
            $(this).triggerHandler("focus");
        }
        else {
            if ($(this).val().length > 20) {
                $("#UserNmaetip").hide();
                $("#UserNmaetiperror").show();
                $(this).addClass("red");
            }
        }
    });

    $("#AreaName").focus(function () {
        $("#AreaNametip").show();
        $("#AreaNametiperror").hide();
        $(this).removeClass("red");
    }).blur(function () {
        if ($(this).val() == "") {
            $(this).triggerHandler("focus");
        }
        else {
            if ($(this).val().length > 30) {
                $("#AreaNametip").hide();
                $("#AreaNametiperror").show();
                $(this).addClass("red");
            }
        }
    });

    $("#SumbitApply").click(function () {
        if (Validator()) {
            Panli.Overlay.open(); $('#confirmPanel').show();
        }
        return false;
    })

    $("#registerAliBtn").click(function () {

        var IdCard = $("#IdCard").val();
        var UName = $("#UserNmae").val();
        var AName = $("#AreaName").val();

        $.ajax({
            type: "POST",
            url: "/App_Services/wsSelfPurchase.asmx/RegisterAliPay",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"enableTaobao":' + ($("#enableTaobaoAccount")[0].checked ? 1 : 0) + ",IdCard : \"" + IdCard + "\" ,UserName : \"" + UName + "\" , AreaName : \"" + AName + "\"}",
            timeout: 10000,
            beforeSend: function () {
                $("#registerAliBtn").attr("disabled", "disabled");
            }
            , complete: function () {
                $("#registerAliBtn").removeAttr("disabled");
            },
            error: function () {
                alert("网络错误！请稍后重试");
            },
            success: function (a) {
                if (a.d == "success") {
                    $("#applyAlipayPanel").attr("class", "zhuce_succeed").html('<h2>恭喜您！成功提交了代注册申请！</h2><p>我们将在 <span>1</span> 个工作日内为您完成代注册，请耐心等待！</p><p>注册成功后，我们将通过Panli短信、邮件通知您！</p><div class="fanhui"><a href="/">返回Panli首页</a></div>')
            ; Panli.Overlay.close();
                    $("#confirmPanel").hide();
                    return false;
                }
                alert("申请失败，请稍后再试验")
        ; return false;
            }
        })
    ; return false;
    });
});
//验证
function Validator() {
    var IdCard = $("#IdCard");
    var UName = $("#UserNmae");
    var AName = $("#AreaName");
    var idcardregex = /^(\d{14}|\d{17})(\d|[xX])$/;
    //^\\d{17}(\\d|x)$
    ///(^[1-9]([0-9]{14}|[0-9]{17})$)/;
    // var usernameregex = /^[\u4E00-\u9FA5A-Za-z0-9_\ ]{3,15}$/i;
    ///^\d{17}(\d|x)$/i
    if (IdCard.val() == "" || (IdCard.val() != "" && !idcardregex.test(IdCard.val()))) {
        $("#IdCardtiperror").show();
        $("#IdCardtip").hide();
        IdCard.addClass("red");
    } else {
        var idcardregex = /^(\d{14}|\d{17})(\d|[xX])$/;
        if (IdCard.val() == "") {
            IdCard.triggerHandler("focus");
        } else {
            if (IdCard.val() != "" && !idcardregex.test(IdCard.val())) {
                $("#IdCardtiperror").html("请填写您的中国大陆身份证").show();
                $("#IdCardtip").hide();
                IdCard.addClass("red");
            } else {
                if (!showBirthdayandSex(IdCard[0])) {
                    $("#IdCardtiperror").html("很抱歉，代注册申请需年满16周岁。").show();
                    $("#IdCardtip").hide();
                    IdCard.addClass("red");
                }
            }

        }
    }
    if (UName.val() == "" || UName.val().length > 20) {
        $("#UserNmaetip").hide();
        $("#UserNmaetiperror").show();
        UName.addClass("red");
    }
    else {
        $("#UserNmaetip").show();
        $("#UserNmaetiperror").hide();
        UName.removeClass("red");
    }
    if (AName.val() == "" || AName.val().length > 30) {
        $("#AreaNametip").hide();
        $("#AreaNametiperror").show();
        AName.addClass("red");
    }
    else {
        $("#AreaNametip").show();
        $("#AreaNametiperror").hide();
        AName.removeClass("red");
    }
    if ($(".t_jia input.red").length > 0) {
        return false;
    }
    else
        return true;
}


