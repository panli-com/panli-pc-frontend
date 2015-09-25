$(function () {
    var Retrieve_Setup1_Vail = false;
    var regexPwd = new RegExp("^[\\da-zA-Z]{6,20}$");

    var Retrieve_Setup1_VailText = {
        empty: "请输入登录密码",
        error: "登录密码输入有误，请重新输入",
        normal: "请输入您的账号的登录密码"
    };

    if ($("#Retrieve-Setup1").is(":visible")) {
        $("#loginpwd").focus();
    }

    if ($("#Retrieve-Setup2").is(":visible")) {
        $("#newpwd").focus();
    }

    $('#loginpwd').focus(function () {
        $(this).parent().next().find('p').removeClass('red').text('请输入您的账号的登录密码。');
    })


    $("#sendRetrievePayPwd", "#Retrieve-Setup1").click(function () {
        var enablePwd = $('#enablePwd').val();
        var _val = "";
        if (enablePwd) {
            _val = $.trim($("#loginpwd", "#Retrieve-Setup1").val());
            if (_val.length == 0) {
                $("div.a_s_k > p", "#Retrieve-Setup1").addClass("red").html(Retrieve_Setup1_VailText.empty);
                return false;
            };
        }
        $.ajax({
            type: "POST",
            url: "/App_Services/wsAccount.asmx/RetrievePwdSendMail",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{\"logpwd\":\"" + _val + "\"}",
            timeout: 10000,
            beforeSend: function () {
                $("p.a_loding,p.a_red,p.a_lv", "#Retrieve-Setup1").hide();
                $("p.a_loding", "#Retrieve-Setup1").show();
                $("#sendRetrievePayPwd", "#Retrieve-Setup1").attr("disabled", "disabled");
            },
            complete: function () {
                $("#sendRetrievePayPwd", "#Retrieve-Setup1").removeAttr("disabled");
                $("p.a_loding").hide();
            },
            error: function () {
                $("p.a_loding,p.a_red,p.a_lv", "#Retrieve-Setup1").hide();
                $("p.a_red", "#Retrieve-Setup1").show();
            },
            success: function (res) {
                switch (res.d) {
                    case 4:
                    case 2:
                        $("p.a_loding,p.a_red,p.a_lv", "#Retrieve-Setup1").hide();
                        $("p.a_red", "#Retrieve-Setup1").show();
                        break;
                    case 5:
                        $("div.a_s_k > p", "#Retrieve-Setup1").addClass("red").html(Retrieve_Setup1_VailText.error);
                        break;
                    case 3:
                        window.location.href = "http://passport.panli.com/Login.aspx"; break
                    case 1:
                        $("p.a_loding,p.a_red,p.a_lv", "#Retrieve-Setup1").hide();
                        $("p.a_lv", "#Retrieve-Setup1").show();
                        break;
                    default:
                        $("p.a_loding,p.a_red,p.a_lv", "#Retrieve-Setup1").hide();
                        $("p.a_red", "#Retrieve-Setup1").show();
                        break;
                }
            }
        });
    });


    var Retrieve_Setup2_Vail = false;
    $("#confrimpwd,#newpwd", "#Retrieve-Setup2").blur(function (e) {
        Retrieve_Setup2_Vail = false;
        var _this = $(this);
        var _val = $.trim(_this.val());
        var tipdom = _this.parent().next();
        if (_this[0].id == "newpwd") {
            if (regexPwd.test(_val)) {
                $.ajax({
                    type: "POST",
                    url: "/App_Services/wsAccount.asmx/ValidationLoginPwd",
                    dataType: "json",
                    contentType: "application/json;utf-8",
                    data: "{\"pwd\":\"" + _val + "\"}",
                    timeout: 10000,
                    beforeSend: function () { },
                    complete: function () { },
                    error: function () { },
                    success: function (res) {
                        switch (res.d) {
                            case 2:
                                tipdom.children("p").removeClass("red");
                                break;
                            case 1:
                            case 4:
                                tipdom.children("p").addClass("red"); break;
                            case 3:
                                window.location.href = "http://passport.panli.com/Login.aspx"; break
                            default: tipdom.children("p").addClass("red"); break;
                        }
                    }
                });
            }
            else {
                tipdom.children("p").addClass("red");
            }
        }
        else {
            var newpwd = $.trim($("#newpwd", "#Retrieve-Setup2").val());
            if (!newpwd.length > 0) {
                tipdom.children("p").html("再次输入支付密码").addClass("red");
            }
            if (newpwd == _val && newpwd.length > 0 && _val.length > 0) {
                tipdom.children("p").html("再次输入支付密码").removeClass("red");
                Retrieve_Setup2_Vail = true;
            }
            else {
                tipdom.children("p").html("再次输入支付密码").addClass("red");
            }
        }
    });

    $("#resetpwd", "#Retrieve-Setup2").click(function () {
        var newpwdval = $("#newpwd", "#Retrieve-Setup2").val();
        var confrimpwdval = $("#confrimpwd", "#Retrieve-Setup2").val();
        var uniqueid = $("#unique-id").val();
        var newpwdTip = $("#newpwd", "#Retrieve-Setup2").parent().next();
        var confrimpwdTip = $("#confrimpwd", "#Retrieve-Setup2").parent().next();
        if (regexPwd.test(newpwdval)) {
            $.ajax({
                type: "POST",
                url: "/App_Services/wsAccount.asmx/ValidationLoginPwd",
                dataType: "json",
                contentType: "application/json;utf-8",
                data: "{\"pwd\":\"" + newpwdval + "\"}",
                timeout: 10000,
                beforeSend: function () { },
                complete: function () { },
                error: function () { },
                success: function (res) {
                    switch (res.d) {
                        case 2:
                            newpwdTip.children("p").removeClass("red");
                            break;
                        case 1:
                        case 4:
                            newpwdTip.children("p").addClass("red"); break;
                        case 3:
                            window.location.href = "http://passport.panli.com/Login.aspx"; break
                        default: newpwdTip.children("p").addClass("red"); break;
                    }

                    if (!confrimpwdval.length > 0) {
                        confrimpwdTip.children("p").html("再次输入支付密码").addClass("red");
                    }
                    if (newpwdval == confrimpwdval && confrimpwdval.length > 0 && confrimpwdval.length > 0 && res.d == 2) {
                        confrimpwdTip.children("p").html("再次输入支付密码").removeClass("red");
                        $.ajax({
                            type: "POST",
                            url: "/App_Services/wsAccount.asmx/ResetPayPwd",
                            dataType: "json",
                            contentType: "application/json;utf-8",
                            data: "{newpwd:'" + newpwdval + "',confirmpwd:'" + confrimpwdval + "',uniqueId :'" + uniqueid + "'}",
                            timeout: 10000,
                            beforeSend: function () {
                                $("#resetpwd", "#Retrieve-Setup2").attr("disabled", "disabled");
                            },
                            complete: function () {
                                $("#resetpwd", "#Retrieve-Setup2").removeAttr("disabled");
                            },
                            error: function () {
                                alert("网络错误，请重试!");
                            },
                            success: function (res) {
                                $("#Retrieve-Setup2").hide();
                                $("#Retrieve-Setup3").show();
                                switch (res.d) {
                                    case 1:
                                        $("div.fail", "#Retrieve-Setup3").hide();
                                        $("div.succeed", "#Retrieve-Setup3").show();
                                        break;
                                    case 2:
                                        $("div.fail", "#Retrieve-Setup3").show();
                                        $("div.succeed", "#Retrieve-Setup3").hide();
                                        break;
                                    default:
                                        var fail = $("div.fail", "#Retrieve-Setup3");
                                        fail.show();
                                        $("div.succeed", "#Retrieve-Setup3").hide();
                                        break;
                                }
                            }
                        });
                    }
                    else {
                        confrimpwdTip.children("p").html("再次输入支付密码").addClass("red");
                    }
                }
            });
        }
        else {
            newpwdTip.children("p").addClass("red");
        }
    });

    $("#pwdEmpty").click(function () {
        $("#newpwd,#confrimpwd").val("");
        $("#newpwd", "#Retrieve-Setup2").focus();
        Retrieve_Setup2_Vail = false;
    });

    $("#resetSendMail,#resetSendMail2").click(function () {
        $("#Retrieve-Setup3,#Retrieve-Setup2").hide();
        $("#Retrieve-Setup2 input[type=password]").val("");
        $("#Retrieve-Setup1").show();
    });

    $('#newpwd,#confrimpwd').keyup(function (e) {
        if (e.keyCode == 13) {
            $('#resetpwd').click();
            return false;
        }

    });

    $('#loginpwd').keyup(function (e) {
        if (e.keyCode == 13) {
            $('#sendRetrievePayPwd').click();
            return false;
        }
    });
});