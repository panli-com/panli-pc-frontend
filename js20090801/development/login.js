function loginSubmit() {
    var username = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    var checkCode = "";
    if (document.getElementById("loginCode") != null) {
        checkCode = document.getElementById("loginCode").value;
        checkCode.replace(" ", "");
    }
    username.replace(" ", "");
    password.replace(" ", "");
    if (username.length > 0) {
        if (password.length > 0) {
            if (checkCode.length > 3 || document.getElementById("loginCode") == null) {
                document.getElementById("loginForm").submit();
            } else {
                document.getElementById("errorInfo").style.display = "block";
                document.getElementById("errorInfo").innerHTML = "请输入验证码";
                document.getElementById("loginCode").focus();
            }
        }
        else {
            document.getElementById("errorInfo").style.display = "block";
            document.getElementById("errorInfo").innerHTML = "请输入您的密码";
            document.getElementById("password").focus();
        }
    } else {
        document.getElementById("errorInfo").style.display = "block";
        document.getElementById("errorInfo").innerHTML = "请输入您的邮箱或昵称";
        document.getElementById("userName").focus();
    }
}

function EnterSubmit(e) {
    var currKey = 0;
    if (navigator.appName == "Microsoft Internet Explorer")
        currKey = event.keyCode;
    else
        currKey = e.keyCode;
    if (currKey == 13) {
        var dom = e.srcElement || e.currentTarget;
        if (dom == document.getElementById("userName") && document.getElementById("password").value.length <= 0) {
            //document.getElementById("password").focus();
            return false;
        }
        loginSubmit();
    }
}