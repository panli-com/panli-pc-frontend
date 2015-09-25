function inputFoucs(dom) { if ($(dom).val() == "请输入Email地址") $(dom).attr("class", "c1_").val(""); }

function emailInputShow(e) {
    $("#changeEmail").show();
    if (e && e.stopPropagation) { e.stopPropagation(); }
    else { window.event.cancelBubble = true; }
}

function changeEmail(e) {
    var email = $("#cemailinput").val();
    var reg = new RegExp("\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");
    if (reg.test($("#cemailinput").val())) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsMember.asmx/ChangeUserEmailLG",
            dataType: "text",
            contentType: "application/json;utf-8",
            data: "{email:'" + email + "'}",
            timeout: 10000,
            beforeSend: function() { $("#cEmail").attr("class", "lv").text("正在修改您的Email，请稍候！"); $("#changeEmailBtn").attr("disabled", "disabled"); },
            error: function() { $("#cEmail").attr("class", "red").text("连接失败！"); $("#changeEmailBtn").removeAttr("disabled"); },
            success: function(res) {
                var rstr = eval("(" + res + ")").d;
                if (rstr == "error") { window.location = "/"; return; }
                if (rstr == "noUser") { $("#cEmail").attr("class", "red").text("邮件修改失败！"); }
                if (rstr == "success") { $("#cEmail").attr("class", "lv").text("已成功修改您的Email并发送新的激活邮件，请注意查收！"); }
                if (rstr = "fail") { $("#cEmail").attr("class", "red").text("修改邮箱成功，但是激活邮件发送失败，请确定您的邮箱可用，或尝试重新发送邮件！"); }
                $("#changeEmailBtn").removeAttr("disabled");
            }
        });
    }
    else {
        $("#cEmail").attr("class", "red").text("您输入的Email地址不正确");
    }
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }
    else {
        window.event.cancelBubble = true;
    }
}

function reSendEmail() {
    $.ajax({
        type: "POST",
        url: "/App_Services/wsMember.asmx/SendActivationEmail",
        dataType: "text",
        contentType: "application/json;utf-8",
        data: "{un:'<%=UserName %>'}",
        timeout: 10000,
        error: function() { alert("网络连接失败，请稍后再试！"); },
        success: function(res) { if (eval("(" + res + ")").d == "success") { alert("新的激活邮件已经发送到您的邮箱，请注意查收！"); } else { alert("激活邮件发送失败！"); } }
    });
}

$(document).ready(function() {
    $("#changeEmail").click(function(e) { e.stopPropagation(); });
    $(document).click(function(e) {
        if ($("#changeEmail:hidden").length > 0) {
            if ($.trim($("#cemailinput").val()).length == 0) $("#cemailinput").attr("class", "c1").val("请输入Email地址");
            $("#cEmail").removeAttr("class").text("此邮箱将作为您登录panli的帐号！");
        } $("#changeEmail").hide();
    });
});