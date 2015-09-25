function focusCheck(dom, str) { $(dom).attr("class", "on").next("p").attr("class", "prompt").text(str); }
function success(dom) { $(dom).attr("class", "").next("p").attr("class", "").html('<img src="/images20090801/Register/gou.gif" />'); }

var emailchecked = false;
function emailBlur(dom) {
    var email = $(dom).val();
    if ($.trim(email).length <= 0) { $(dom).attr("class", "").val("").next("p").attr("class", ""); emailchecked = false; }
    else {
        var reg = new RegExp("\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");
        if (reg.test($(dom).val())) {
            $.ajax({
                type: "POST",
                url: "/App_Services/wsMember.asmx/CheckUserByEmail",
                dataType: "text",
                contentType: "application/json;utf-8",
                data: "{email:'" + email.toLowerCase() + "'}",
                timeout: 10000,
                error: function(a, b, c) { emailchecked = true; $(dom).attr("class", "").next("p").attr("class", ""); },
                success: function(msg) {
                    if (eval("(" + msg + ")")["d"]) {
                        $(dom).attr("class", "wrong").next("p").attr("class", "red").text("Email地址已存在");
                        emailchecked = false;
                    }
                    else {
                        success(dom);
                        emailchecked = true;
                    }
                }
            });
        }
        else {
            $(dom).attr("class", "wrong").next("p").attr("class", "red").text("Email格式不正确");
            emailchecked = false;
        }
    }
}

var nicknamechecked = false;
function nicknameblur(dom) {
    var nickname = $.trim($(dom).val());
    if (nickname.length <= 0) { $(dom).attr("class", "").val("").next("p").attr("class", "").text("昵称也可以作为您登录Panli的帐号，大家以后就这样称呼您"); nicknamechecked = false; }
    else {
        var regtest = new RegExp("^([\\u4e00-\\u9fa5]|\\w)*$");
        var regunderline = new RegExp("_");
        if (regtest.test(nickname) && regunderline.exec(nickname) == null) {
            var regEng = new RegExp("\\w", "g");
            var regCn = new RegExp("[\\u4e00-\\u9fa5]", "g");
            var nicknamelength = 0;
            var res;
            while ((res = regEng.exec(nickname)) != null)
                nicknamelength++;
            while ((res = regCn.exec(nickname)) != null)
                nicknamelength += 2;

            if (nicknamelength <= 16 && nicknamelength >= 4) {
                $.ajax({
                    type: "POST",
                    url: "/App_Services/wsMember.asmx/CheckUserByName",
                    dataType: "text",
                    contentType: "application/json;utf-8",
                    data: "{username:'" + nickname.toLowerCase() + "'}",
                    timeout: 10000,
                    error: function() { nicknamechecked = true; $(dom).attr("class", "").next("p").attr("class", ""); },
                    success: function(msg) {
                        if (eval("(" + msg + ")")["d"]) {
                            $(dom).attr("class", "wrong").next("p").attr("class", "red").text("用户名已存在");
                            nicknamechecked = false;
                        }
                        else {
                            success(dom);
                            nicknamechecked = true;
                        }
                    }
                });
            }
            else {
                $(dom).attr("class", "wrong").next("p").attr("class", "red").text("昵称长度必须是2-8个汉字或4-16个字符");
                nicknamechecked = false;
            }
        }
        else {
            $(dom).attr("class", "wrong").next("p").attr("class", "red").text("昵称必须是大小写英文字母、中文、数字组成，长度2-8个汉字或4-16个字符");
            nicknamechecked = false;
        }
    }
}

var passwordchecked = false;
function checkPassword(dom) {
    $("#passPower").hide();
    $(dom).next("p").show();
    var pass = $.trim($(dom).val());
    if (pass.length <= 0) { $(dom).attr("class", "").val("").next("p").attr("class", "").text("请输入您的帐号密码"); passwordchecked = false; }
    else {
        var regtest = new RegExp("^(\\w)*$");
        if (regtest.test(pass)) {
            var regEng = new RegExp("\\w", "g");
            var passLength = 0;
            var res;
            while ((res = regEng.exec(pass)) != null)
                passLength++;

            if (passLength <= 20 && passLength >= 6) {
                success(dom);
                if ($("#regRePassword").val().length > 0) {
                    reCheckPassword("#regRePassword");
                }
                passwordchecked = true;
            }
            else {
                $(dom).attr("class", "wrong").next("p").attr("class", "red").text("密码长度必须是6-20个字符");
                passwordchecked = false;
            }
        }
        else {
            $(dom).attr("class", "wrong").next("p").attr("class", "red").text("密码必须是大小写英文字母、数字组成、长度为6-20个字符");
            passwordchecked = false;
        }
    }
}

function passPower(dom) {
    var pass = $(dom).val().toLowerCase();
    var powerRank = 0;
    if (pass.length > 0) {
        $(dom).next("p").hide();
        if (pass.length > 8) powerRank++;
        if (new RegExp("[0-9][a-z]|[a-z][0-9]").test(pass)) powerRank++;
        if (new RegExp("[0-9]+[a-z]+[0-9]+[a-z]|[a-z]+[0-9]+[a-z]+[0-9]").test(pass)) powerRank++;
        switch (powerRank) {
            case 0: $("#passPower").attr("class", "rank").text("安全等级：低"); break;
            case 1: $("#passPower").attr("class", "rank").text("安全等级：低"); break;
            case 2: $("#passPower").attr("class", "rank mid").text("安全等级：中"); break;
            case 3: $("#passPower").attr("class", "rank High").text("安全等级：高"); break;
            default: $("#passPower").attr("class", "rank").text("安全等级：低"); break;
        }
        $("#passPower").css("display", "inline");
    }
    else {
        $("#passPower").hide();
        $(dom).next("p").show();
    }
}

var repasschecked = false;
function reCheckPassword(dom) {
    var rePass = $.trim($(dom).val());
    if (rePass.length <= 0) {
        $(dom).attr("class", "").next("p").attr("class", "").text("请再输入一次您的密码");
    } else {
        if ($.trim($("#regPassword").val()) == rePass) {
            success(dom);
            repasschecked = true;
        }
        else {
            $(dom).attr("class", "wrong").next("p").attr("class", "red").text("两次密码输入不一致，请重新输入");
            repasschecked = false;
        }
    }
}

var checkcodechecked = false;
function checkCode(dom) {
    var checkCode = $.trim($(dom).val()).toLowerCase();
    if (checkCode == "") {
        $(dom).attr("class", "verification").nextAll("p").hide(); checkcodechecked = false;
    }
    else {
        $.ajax({
            type: "POST",
            url: "/ValidateCode.ashx?s=regCode&code=" + checkCode,
            dataType: "text",
            timeout: 10000,
            error: function(a, b, c) { checkcodechecked = true; },
            success: function(msg) {
                if (msg == '0') {
                    checkcodechecked = false;
                    $(dom).attr("class", "verification wrong").nextAll("p").show();
                }
                else {
                    checkcodechecked = true;
                    $(dom).attr("class", "verification").nextAll("p").hide();
                }
            }
        });
    }
}

function regSubmit() {
    if (!checkcodechecked) {
        var checkCode = $.trim($("#regCheckCodeInput").val()).toLowerCase();
        if (checkCode == "") {
            $("#regCheckCodeInput").attr("class", "verification").nextAll("p").show(); checkcodechecked = false;
        }
        else {
            $.ajax({
                type: "POST",
                url: "/ValidateCode.ashx?s=regCode&code=" + checkCode,
                dataType: "text",
                timeout: 5000,
                error: function(a, b, c) { checkcodechecked = true; regSucSubmit(); },
                success: function(msg) {
                    if (msg == '0') {
                        checkcodechecked = false;
                        $("#regCheckCodeInput").attr("class", "verification wrong").nextAll("p").show();
                    }
                    else {
                        checkcodechecked = true;
                        $("#regCheckCodeInput").attr("class", "verification").nextAll("p").hide();
                        regSucSubmit();
                    }
                }
            });
        }
    }
    else { regSucSubmit(); }
}


function regSucSubmit() {
    if ($.trim($("#regEmail").val()).length > 0) {
        if ($.trim($("#regNickName").val()).length > 0) {
            emailBlur($("#regEmail")); nicknameblur($("#regNickName")); checkPassword($("#regPassword")); reCheckPassword($("#regRePassword"));
            if (emailchecked && nicknamechecked && passwordchecked && repasschecked && document.getElementById("regAgree").checked) {
                $("form")[0].submit();
            } else {
                if (!document.getElementById("regAgree").checked)
                    alert("请仔细阅读注册协议并勾选同意复选框");
            }
        } else { $("#regNickName").attr("class", "wrong").next("p").attr("class", "red").text("请输入用户名"); }
    }
    else { $("#regEmail").attr("class", "wrong").next("p").attr("class", "red").text("请输入Email地址"); }
}



$(document).ready(function() {
    document.forms[0].action = window.location;
    $("#regCheckCodeInput").keydown(function(e) {
        if (e.keyCode == 13) regSubmit();
    })
});