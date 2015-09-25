function enter(e) {
    if (e.keyCode == 13) { $("#suggestBtn").click(); return false; }
}
function feedback() {
    var checkCode = $.trim($("#suggestCheck").val());
    var content = HtmlEncode($.trim($("#suggestContent").val()));
    if (content.length <= 0) {
        alert("请输入您的建议");
        return false;
    }
    if (checkCode.length > 0) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsFeedBack.asmx/FeedBack",
            dataType: "text",
            contentType: "application/json;utf-8",
            data: "{content:'" + content + "',checkCode:'" + checkCode + "',type:1}",
            timeout: 10000,
            error: function() { alert("提交信息失败"); },
            success: function(msg) {
                var res = eval("(" + msg + ")").d;
                if (res == "success") {
                    $("#suggestCheck").val(""); $("#suggestContent").val(""); $("#checkCode").click();
                    alert("感谢您提出的宝贵意见！");
                    return false;
                }
                if (res == "fail" || res == "noCheckCode") {
                    $("#checkCode").click();
                    alert("验证码错误");
                    return false;
                }
            }
        });
    } else {
        alert("请输入验证码");
    }
}