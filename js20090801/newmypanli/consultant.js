var default_xiangqing = "请在此填写需要咨询的内容";
$(function() {
    $(".tijiao").find("input[type='button']").click(function() {
        if ($.trim($("#txtXiangQing").val()) == "" || $("#txtXiangQing").val() == default_xiangqing) {
            $("#txtXiangQing").removeClass("a_hui").removeClass("a_red");
            $("#txtXiangQing").addClass("a_red");
            return false;
        }
        if (!CheckEmail($("#txtEmail").val()) || $("#txtEmail").val() == "") {
            $(".c_youx .red").show().html("您输入的E-mail地址格式不正确！");
            return false;
        }
        $.ajax({
            type: "POST",
            url: "/App_Services/wsConsultant.asmx/AddConsultant",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"xiangqing":"' + $("#txtXiangQing").val() + '","email":"' + $("#txtEmail").val() + '","picture":"' + $("#imageUrls").val() + '"}',
            timeout: 15000,
            error: function() { alert("网络错误请重新再试"); },
            success: function(r) {
                if (r.d == "1") {
                    $("#div_Success_consultant_Email").html($("#txtEmail").val());
                    $("#div_main_consultant").hide();
                    $("#div_Success_consultant").show();
                }
                else {
                    alert("网络错误,请重新再试!");
                }
            }
        });
    });

    $("#txtXiangQing").focus(function() {
        if ($("#txtXiangQing").val() == default_xiangqing) {
            $("#txtXiangQing").val("");
        }
        $("#txtXiangQing").removeClass("a_hui").removeClass("a_red");
    });
    $("#txtXiangQing").blur(function() {
        if ($("#txtXiangQing").val() == "") {
            $("#txtXiangQing").val(default_xiangqing);
            $("#txtXiangQing").addClass("a_hui");
        }
    });

    $("#txtEmail").blur(function() {
        if (!CheckEmail($("#txtEmail").val())) {
            $(".c_youx .red").show().html("您输入的E-mail地址格式不正确！");
        }
        else {
            $(".c_youx .red").hide();
        }
    });


    $("#txtXiangQing").keyup(function() {
        CheckXiangQingLength();
    });
});


function CheckEmail(str) {
    var Regex = /^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/;
    return Regex.test(str);
}


function CodeLength(str) {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}

function CheckXiangQingLength() {
    while (true) {
        if (CodeLength($("#txtXiangQing").val()) > 1000) {
            $("#txtXiangQing").val($("#txtXiangQing").val().substring(0, ($("#txtXiangQing").val().length - 1)));
        } else {
            break;
        }
    }
}