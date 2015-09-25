function ValidForm() {
    var _this;
    var oldval, inputval;
    var toAllow = true;

    if (!$("input[name=chekAgree]").is(":checked")) {
        alert("请仔细阅读注册协议并勾选同意复选框");
        return false;
    }

    $("input[type=text][type=password]").each(function () {
        _this = $(this);
        oldval = _this.val();
        _this.triggerHandler("focus");
        inputval = _this.val();
        if ($.trim(inputval).length == 0) {
            _this.triggerHandler("blur");
            toAllow = false;
            alert(oldval);
            return false;
        }
    });
    return toAllow;
}
$(function () {
    $("input[name=txtUserEmail]").CheckInput({ tip: "请输Email地址" });
    $("input[name=txtUserName]").CheckInput({ tip: "请设置用户名" });
    $("input[name=txtPassword]").CheckInput({ tip: "" });
    $("input[name=txtConfirmPassword]").CheckInput({ tip: "" });
    $("input[name=txtVerifycode]").CheckInput({ tip: "验证码" });
});