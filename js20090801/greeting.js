function ValiDateSenderEmail() {
    if ($.trim($("#hfID").val()) == "") {
        if (!ValiDate()) {
            return false;
        }
        if ($.trim($("#txtEmail").val()) == "") {
            alert("请输入Email！");
            return false;
        }
        if (!ValiDateEmail($.trim($("#txtEmail").val()))) {
            alert("Email地址不正确！");
            return false;
        }
    }
    else {
        if ($.trim($("#txtEmail").val()) == "") {
            alert("请输入Email！");
            return false;
        }
        if (!ValiDateEmail($.trim($("#txtEmail").val()))) {
            alert("Email地址不正确！");
            return false;
        }
        return true;
    }
}

function ValiDateEmail() {
    var reg = /^((\w+\+*\-*)+\.?)+@((\w+\+*\-*)+\.?)*[\w-]+\.[a-z]{2,6}$/i;
    if (reg.test($("#txtEmail").val())) {
        return true;
    } else {
        return false;
    }
}

function ValiDate() {
    if ($.trim($("#txtSender").val()) == "") {
        alert("请输入您的名字！"); return false;
    }
    if (TxtLength($.trim($("#txtSender").val())) > 16) {
        alert("“您的名字”字数超过了限制，只能输入8个中文或16个英文");
        return false;
    }
    if ($.trim($("#txtRecipient").val()) == "") {
        alert("请输入TA的名字！"); return false;
    }
    if (TxtLength($.trim($("#txtRecipient").val())) > 16) {
        alert("“TA的名字”字数超过了限制，只能输入8个中文或16个英文");
        return false;
    }
    if ($.trim($("#txtRelation").val()) == "") {
        alert("请输入您是TA的！"); return false;
    }
    if (TxtLength($.trim($("#txtRelation").val())) > 16) {
        alert("“您是TA的”字数超过了限制，只能输入8个中文或16个英文");
        return false;
    }
    if ($.trim($("#txtContent").text()) == "(字数不超过40中文,80个英文)") {
        alert("请输入您想和TA说的话！"); return false;
    }
    if (TxtLength($.trim($("#txtContent").val())) > 80) {
        alert("“您想和TA说的话”字数超过了限制，只能输入40个中文或80个英文");
        return false;
    }
    return true;
}
function ValidateText(t) {
    var txtName = $.trim($(t).val()); if (!ValidateTextLength(txtName)) {
        $(t).val($(t).attr("oldtxt"));
    } $(t).attr("oldtxt", txtName);
} //验证标签名 
function ValidateTextLength(txtName) {
    var regEng = new RegExp("[^\\u4e00-\\u9fa5]", "g");
    var regCn = new RegExp("[\\u4e00-\\u9fa5]", "g");
    var nicknamelength = 0; var res;
    while ((res = regEng.exec(txtName)) != null)
        nicknamelength++;
    while ((res = regCn.exec(txtName)) != null)
        nicknamelength += 2;
    if (nicknamelength <= 16) {
        return true; //正确
    }
    else {
        return false; //长度不对
    }
}

function TxtLength(txtName) {
    var regEng = new RegExp("[^\\u4e00-\\u9fa5]", "g");
    var regCn = new RegExp("[\\u4e00-\\u9fa5]", "g");
    var nicknamelength = 0; var res;
    while ((res = regEng.exec(txtName)) != null)
        nicknamelength++;
    while ((res = regCn.exec(txtName)) != null)
        nicknamelength += 2;
    return nicknamelength;
}

function CopyUrl() {
    if ($.trim($("#txtUrl").val()) == "") {
        alert("你还没有生成祝福页面吧，请先生成！");
        return;
    }
    if ($.browser.msie) {
        var text = $("#txtUrl").val();
        clipboardData.setData('text', text);
    } else {
        alert("抱歉！由于您的浏览器不支持，请直接复制文本框中链接地址。"); return false;
    }
} 