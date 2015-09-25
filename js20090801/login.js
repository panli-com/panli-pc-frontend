function loginSubmit() {
    var t = document.getElementById("userName");
    var p = document.getElementById("password");
    var e = document.getElementById("errorInfo");
    var s = p.value;
    var u = t.value;
    var checkCode = "";
    if (document.getElementById("loginCode") != null) {
        checkCode = document.getElementById("loginCode").value;
        checkCode.replace(" ", "");
    }
    u.replace(" ", "");
    s.replace(" ", "");
    if (u.length > 0) {
        if (s.length > 0) {
            if (checkCode.length > 3 || document.getElementById("loginCode") == null) {
                document.getElementById("loginForm").submit();
            } else {
                e.style.display = "block";
                e.innerHTML = "请输入验证码";
                document.getElementById("loginCode").focus();
            }
        }
        else {
            e.style.display = "block";
            e.innerHTML = "请输入您的密码";
            document.getElementById("password").focus();
        }
    } else {
        e.style.display = "block";
        e.innerHTML = "请输入您的邮箱或昵称";
        t.focus();
    }
}

function EnterSubmit(e) {
    var c = 0;
    if (navigator.appName == "Microsoft Internet Explorer")
        c = event.keyCode;
    else
        c = e.keyCode;
    if (c == 13) {
        var d = e.srcElement || e.currentTarget;
        if (d == document.getElementById("userName") && document.getElementById("password").value.length <= 0)
            return false;
        loginSubmit();
    }
}

$(function () {
    var isCheck = false;
    $('#userName').blur(function () {
        var logName = $.trim($('#userName').val());
        if (logName != '' && !isCheck && $('#checkCodeTr').length <= 0) {
            $.ajax({
                type: "POST",
                url: "/App_Services/wsMember.asmx/CheckUserCookie",
                dataType: "json",
                contentType: "application/json;utf-8",
                data: '{"nickname":"' + logName + '"}',
                timeout: 5000,
                beforeSend: function () {
                    isCheck = true;
                },
                complete: function () {
                    isCheck = false;
                },
                error: function () {
                },
                success: function (r) {
                    if (r.d != 1) {
                        $('#txtTable').append('<tr id="checkCodeTr"><td class="l">验证码</td><td><input onkeydown="EnterSubmit(event)" class="y" name="loginCode" id="loginCode" type="text" onfocus="this.className=\'y on\'" onblur="this.className=\'y\'" maxlength="4" /><img id="loginCheckCode" src="/ValidateCode.ashx?s=loginCode&amp;w=100&amp;h=30&amp;t=0" title="点击图片刷新" alt="验证码" style="vertical-align:middle;cursor:pointer;" onclick="this.src=\'/ValidateCode.ashx?s=loginCode&amp;w=100&amp;h=30&amp;t=\'+Math.random();" border="0"></td></tr>');
                    }
                }
            });
        }
    });
});