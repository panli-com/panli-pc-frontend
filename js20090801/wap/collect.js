function ValidForm() {
    var _this;
    var oldval,inputval;
    var toAllow = true;
    $("form input.h").each(function () {
        _this = $(this);
        oldval = _this.val();
        _this.triggerHandler("focus");
        inputval = _this.val();
        if ($.trim(inputval).length == 0) {
            _this.triggerHandler("blur");
            toAllow = false;
            //alert(oldval);
            $("div.ErrorText").text(oldval);
            return false;
        }
    });
    return toAllow;   
}

$(function () {
    $("input[name=txtUserName]").CheckInput({ tip: "请输入注册时填写的用户名/邮箱" });
    $("input[name=txtUserPassword]").CheckInput({ tip: "填写密码" });
    $("input[name=txtVerifycode]").CheckInput({ tip: "验证码" });
    $("input[name=btnRegister]").click(function () {
        location.href = "Register.aspx?code=" + $("#txtCode").val();
    });
});