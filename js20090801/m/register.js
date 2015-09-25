


function ValidForm() {

    if ($.trim($("input[name=txtUserEmail]").val()) == default_email_tip) {
        $("input[name=txtUserEmail]").val("");
    }
    if ($.trim($("input[name=txtUserName]").val()) == default_uname_tip) {
        $("input[name=txtUserName]").val("");
    }
    if ($.trim($("input[name=txtVerifycode]").val()) == default_verifycode_tip) {
        $("input[name=txtVerifycode]").val("");
    }

    return true;
}
var default_email_tip = "请输Email地址";
var default_uname_tip = "请设置用户名";
var default_verifycode_tip = "验证码";
var default_pwd_tip = "请设置密码";
$(function () {
    if ($.trim($("input[name=txtUserEmail]").val()) == "") {
        $("input[name=txtUserEmail]").val(default_email_tip);
    }
    $("input[name=txtUserEmail]").blur(function () {
        if ($.trim($("input[name=txtUserEmail]").val()) == "") {
            $("input[name=txtUserEmail]").val(default_email_tip);
        }
    }).focus(function () {
        if ($.trim($("input[name=txtUserEmail]").val()) == "" || $.trim($("input[name=txtUserEmail]").val()) == default_email_tip) {
            $("input[name=txtUserEmail]").val("");
        }
    });


    if ($.trim($("input[name=txtUserName]").val()) == "") {
        $("input[name=txtUserName]").val(default_uname_tip);
    }
    $("input[name=txtUserName]").blur(function () {
        if ($.trim($("input[name=txtUserName]").val()) == "") {
            $("input[name=txtUserName]").val(default_uname_tip);
        }
    }).focus(function () {
        if ($.trim($("input[name=txtUserName]").val()) == "" || $.trim($("input[name=txtUserName]").val()) == default_uname_tip) {
            $("input[name=txtUserName]").val("");
        }
    });


    if ($.trim($("input[name=txtVerifycode]").val()) == "") {
        $("input[name=txtVerifycode]").val(default_verifycode_tip);
    }
    $("input[name=txtVerifycode]").blur(function () {
        if ($.trim($("input[name=txtVerifycode]").val()) == "") {
            $("input[name=txtVerifycode]").val(default_verifycode_tip);
        }
    }).focus(function () {
        if ($.trim($("input[name=txtVerifycode]").val()) == "" || $.trim($("input[name=txtVerifycode]").val()) == default_verifycode_tip) {
            $("input[name=txtVerifycode]").val("");
        }
    });


    if ($("#hidPwdType").val() == "1") {
        $("input[name=txtPassword]").show();
        $("input[name=txtPasswordShow]").hide();
        $("input[name=txtPassword]").val($("input[name=txtPasswordShow]").val());
        $("#spanByPwdType").attr("class", "eyes");
    } else {
        $("input[name=txtPassword]").hide();
        $("input[name=txtPasswordShow]").show();
        $("input[name=txtPasswordShow]").val($("input[name=txtPassword]").val());
        $("#spanByPwdType").attr("class", "eyes off");
        $("#hidPwdType").val("2");
    }

    if ($("#hidPwdType").val() == "2" && $.trim($("input[name=txtPasswordShow]").val()) == "") {
        $("input[name=txtPasswordShow]").val(default_pwd_tip);
    }
    $("input[name=txtPasswordShow]").blur(function () {
        if ($.trim($("input[name=txtPasswordShow]").val()) == "") {
            $("input[name=txtPasswordShow]").val(default_pwd_tip);
        }
    }).focus(function () {
        if ($.trim($("input[name=txtPasswordShow]").val()) == "" || $.trim($("input[name=txtPasswordShow]").val()) == default_pwd_tip) {
            $("input[name=txtPasswordShow]").val("");
        }
    });

});

function ChangePwdType() {
    if ($.trim($("#spanByPwdType").attr("class")) == "eyes") {
        $("input[name=txtPassword]").hide();
        $("input[name=txtPasswordShow]").show();
        $("input[name=txtPasswordShow]").val($("input[name=txtPassword]").val());
        $("#hidPwdType").val("2");
        $("#spanByPwdType").attr("class", "eyes off");

        if ($.trim($("input[name=txtPasswordShow]").val()) == "") {
            $("input[name=txtPasswordShow]").val(default_pwd_tip);
        }
    } else {
        $("input[name=txtPassword]").show();
        $("input[name=txtPasswordShow]").hide();
        if ($.trim($("input[name=txtPasswordShow]").val()) != "" && $.trim($("input[name=txtPasswordShow]").val()) != default_pwd_tip) {
            $("input[name=txtPassword]").val($("input[name=txtPasswordShow]").val());
        }
        $("#hidPwdType").val("1");
        $("#spanByPwdType").attr("class", "eyes");
    }
}