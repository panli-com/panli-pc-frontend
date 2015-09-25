document.domain = "panli.com";
var _inputCode = "";
function GetCouponValida() {
    var code = $("#LocalizeText").val();
    var isLogin = $("#Islogin").val();
    if (code.length > 0) {
        _inputCode = code;
        if (isLogin == "1") {
            return true;
        }
        else {
            window.Panli.Login(); return false;
        }
    }
    alert("请输入优惠劵代码！")
    return false;
}
function LoginCallback() {
    $("#LocalizeText").val(_inputCode);
    $("#Islogin").val("1");
}