$(function() {
    //alert(window.parent.document.getElementById('hidOpType').value);
    //window.parent.Hide_HeadImg();
    $('form').attr("enctype", "multipart/form-data").attr("encoding", "multipart/form-data");

    //上传文件超过2兆
    if ($("#hidMsg").val() == "11") {
        $(".xame_zhuyi").show();
    }
    //上传文件成功，延迟弹出成功提示框。
    else if ($("#hidMsg").val() == "10") {
        $('input[type="file"]').attr("disabled", "disabled");
        if (window.parent.document.getElementById('hidOpType').value == "1" || $(window.parent.document).find(".xame_xuanx").find("li").eq(1).is(":hidden")) {
            $("#div_success_headImg").find("p").eq(0).hide();
            $(".xame_wsxx").hide();
        }
        $(window.parent.document).find(".xame_tishik").hide();
        window.parent.document.getElementById('hidHeadImgIsOk').value = "1";
        setTimeout(function() {
            $(".xame_over").show();
            $(".xame_suss").show();
            $(".xame_toux").hide();
        }, 5000);
    }

    UpLoadImg();
});

function UpLoadImg() {
    $('input[type="file"]').change(function() {
        var img_types = ['jpg', 'jpeg', 'gif', 'png'];
        var value = this.value;
        if ($.inArray(value.substring(value.lastIndexOf('.') + 1).toLowerCase(), img_types) != -1) {
            document.forms[0].submit();
        } else {
            alert('文件格式不正确，请选择有效的图片类型');
            $("#xame_hd").focus();
            return false;
        }
    });
}
function ParentsLocation(url) {
    window.parent.CloseDiv_ImproveUser();
    window.parent.location.href = url;
}