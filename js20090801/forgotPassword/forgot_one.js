function psubmit() {
    if ($("input[class*='wrong']").length > 0) return;
    if ($.trim($("#username").val()).length <= 0) { $("#username").attr("class", "wrong"); $("#nameTip").show(); return; }
    if (!codeBlur()) return;
    document.forms[0].submit();
}

function codeBlur() {
    if ($.trim($("#forgotCode").val()).length <= 0) { $("#forgotCode").attr("class", "verification wrong"); $("#checkcodetip").attr("class", "red").text("请输入验证码"); return false; }
    else { $("#forgotCode").attr("class", "verification"); $("#checkcodetip").attr("class", "").text("点击图片刷新验证码"); return true; }
}

function enter(e) {
    if (e.keyCode == 13) {
        psubmit();
        return false;
    }
}
$(function () {
    $('.xiugai input').keyup( function (e) { enter(e); });
})
