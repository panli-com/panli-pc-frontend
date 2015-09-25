$(function() {
    //验证参数
    var paraStr = window.location.toString().split("?").slice(1);
    if (/(email=)/.test(paraStr)) {
        $("#wtype input[type=radio]").eq(1).attr("checked", "checked");
        $("#wdeta").css("display", "block");
        $("#wdeta table").eq(1).css("display", "block");
    }

    //交易信息字体颜色控制
    $(".AbnormalBox textarea:last").focus(function() {
        if (/(最近使用支付宝交易的时间，所购买的物品名称、价格和数量)/.test($(this).val())) {
            $(this).val("");
        }
        $(this).css("color", "");
    });

    $(".AbnormalBox textarea:last").blur(function() {
        if ($(this).val() == "") {
            $(this).css("color", "#999");
            $(this).val("最近使用支付宝交易的时间，所购买的物品名称、价格和数量");
        }
    });

    //问题类型点击
    $("#wtype input[type=radio]").click(function() {
        var index = $("#wtype input[type=radio]").index($(this));
        $("#wdeta").css("display", "block");
        $("#wdeta table").css("display", "none");
        $("#wdeta table").eq(index).css("display", "block");
        csel("");
        $("#wdeta table:eq(0) input[type=checkbox]").each(function() {
            if (this.checked) {
                $("#wpwd").css("display", index == 0 ? "block" : "none");
                return false;
            }
        });
    });

    //点击任意问题描述错误提示消失
    $("#wdeta table:eq(1) input[type=checkbox]").change(function() {
        $("#wdeta table:eq(1) input[type=checkbox]").each(function() {
            if (this.checked) { csel(""); return };
        });
    });

    $("#wpwd .mima tr").css("display", "none");
    //问题描述选项控制
    $("#wdeta table:eq(0) input[type=checkbox]").click(function() {
        $("#wdeta table:eq(0) input[type=checkbox]").each(function() {
            if (this.checked) {
                $("#wpwd").css("display", "block");
                csel("");
                return false;
            } else {
                $("#wpwd").css("display", "none");
            }
        });
        var tf = false;
        var index = $("#wdeta table:eq(0) input[type=checkbox]").index($(this));

        if (index == 0 || index == 1) {
            tf = $("#wdeta table:eq(0) input[type=checkbox]").eq(0).attr("checked") ||
                        $("#wdeta table:eq(0) input[type=checkbox]").eq(1).attr("checked");
            $("#wpwd .mima tr").eq(0).css("display", tf ? "block" : "none");
        } else {
            if (index == 5) {
                $("#wpwd .mima tr").slice(2).css("display", this.checked ? "block" : "none");
            }
            tf = $("#wdeta table:eq(0) input[type=checkbox]").eq(2).attr("checked") ||
                        $("#wdeta table:eq(0) input[type=checkbox]").eq(3).attr("checked") ||
                        $("#wdeta table:eq(0) input[type=checkbox]").eq(4).attr("checked") ||
                        $("#wdeta table:eq(0) input[type=checkbox]").eq(5).attr("checked")
            $("#wpwd .mima tr").eq(1).css("display", tf ? "block" : "none");
        }
    });

    //明文暗码转换
    $("#imp").click(function() {
        var rep = this.checked ? $("<input  class='text' name='' maxlength='20' type='text'/>") : $("<input  class='text' maxlength='20' name='' type='password'/>");
        rep.replaceAll($(".mima input").slice(0, 3));
    });

    //提交信息
    $("#sub").click(function(event) {
        csub() ? "" : event.preventDefault();
    });

    //验证表单 并给出错误信息
    function csub() {
        var index = null;
        $("#wtype input[type=radio]").each(function() {
            if (this.checked) index = $("#wtype input[type=radio]").index($(this));
        });
        if (index == null) {
            csel("请选择您遇到异常问题类型");
            return false;
        }
        //需要发送邮件的文本
        var content = "";
        if (index == 0) {
            var wdeta = "";
            var contentbody = $("#wdeta table:eq(0) input[type=checkbox]:checked");
            var conle = contentbody.length;
            for (var i = 0; i < conle; i++) {
                if (i != conle - 1) {
                    wdeta += $(contentbody[i]).parent().text() + "+";
                } else {
                    wdeta += $(contentbody[i]).parent().text();
                }
            }
            if (wdeta == "") {
                csel("请选择具体问题描述");
                return false;
            }
            var chetm = true;
            $(".AbnormalBox .mima input").each(function() {
                if ($(this).parent().parent().css("display") != "none" && $(this).val() == "") {
                    $(this).addClass("red");
                    $(this).next().text("请输入" + $.trim($(this).parent().prev().text().replace("：", "")));
                    chetm = false;
                }
            });
            if (!chetm) { return false; }
            if (/(最近使用支付宝交易的时间，所购买的物品名称、价格和数量)/.test($(".AbnormalBox textarea:last").val()) && $(".AbnormalBox textarea:last").parent().parent().css("display") != "none") {
                $(".AbnormalBox textarea:last").addClass("red");
                $(".AbnormalBox textarea:last").next().text("请输入交易信息");
                return false;
            }
            content = "<b>问题类型：</b>" + $("#wtype input[type=radio]").eq(index).parent().text() + "<br/>"
                    + "<b>具体问题：</b>" + wdeta + "<br/>";
            $(".AbnormalBox .mima input").eq(0).val() ? content += "<b>淘宝网登录密码：</b>" + repcontent($(".AbnormalBox .mima input").eq(0).val()) + "<br/>" : "";
            $(".AbnormalBox .mima input").eq(1).val() ? content += "<b>支付宝登录密码：</b>" + repcontent($(".AbnormalBox .mima input").eq(1).val()) + "<br/>" : "";
            $(".AbnormalBox .mima input").eq(2).val() ? content += "<b>支付宝支付密码：</b>" + repcontent($(".AbnormalBox .mima input").eq(2).val()) + "<br/>" : "";
            $(".AbnormalBox .mima input").eq(3).val() ? content += "<b>所在国家和城市：</b>" + repcontent($(".AbnormalBox .mima input").eq(3).val()) + "<br/>" : "";
            $("#wdeta table:eq(0) input[type=checkbox]").eq(5).attr("checked") ? content += "<b>交易信息：</b>" + repcontent($(".AbnormalBox textarea:last").val()) + "<br/>" : "";
            content += "<b>联系邮箱：</b>" + repcontent($(".biao:last input[type=text]").val());
        } else if (index == 1) {
            var wdeta = "";
            var contentbody = $("#wdeta table:eq(1) input[type=checkbox]:checked");
            var conle = contentbody.length;
            for (var i = 0; i < conle; i++) {
                if (i != conle - 1) {
                    wdeta += $(contentbody[i]).parent().text() + "+";
                } else {
                    wdeta += $(contentbody[i]).parent().text();
                }
            }
            if (wdeta == "") {
                csel("请选择具体问题描述");
                return false;
            }
            content = "<b>问题类型：</b>" + $("#wtype input[type=radio]").eq(index).parent().text() + "<br/>";
            content += "<b>问题描述：</b>" + wdeta + "<br/>";
            content += "<b>联系邮箱：</b>" + repcontent($(".AbnormalBox .biao:last input[type=text]").val());
        } else if (index == 2) {
            if ($(".AbnormalBox textarea:first").val() == "") {
                csel("请填写具体问题描述");
                $(".AbnormalBox textarea:first").addClass("red");
                return false;
            }
            content = "<b>问题类型：</b>" + $("#wtype input[type=radio]").eq(index).parent().text() + "<br/>";
            content += "<b>问题描述：</b>" + repcontent($(".AbnormalBox textarea:first").val()) + "<br/>";
            content += "<b>联系邮箱：</b>" + repcontent($(".AbnormalBox .biao:last input[type=text]").val());
        }
        if ($(".AbnormalBox .biao:last input[type=text]").val() == "") {
            $(".AbnormalBox .biao:last input[type=text]").next().text("请输入常用邮箱以便告知您问题处理结果");
            $(".AbnormalBox .biao:last input[type=text]").addClass("red");
            return false;
        } else if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($(".AbnormalBox .biao:last input[type=text]").val())) {
            $(".AbnormalBox .biao:last input[type=text]").next().text("请填写正确的邮箱格式");
            $(".AbnormalBox .biao:last input[type=text]").addClass("red");
            return false;
        }
        $("#contentbody").val(content);
        $("#hidnone").val("1");
        return true;
    }

    $(".AbnormalBox .mima input").live("focus", function() {
        $(this).removeClass("red");
        $(this).next().text("");
    });

    $(".AbnormalBox textarea").focus(function() {
        $(this).removeClass("red");
        $(this).next().text("");
        csel("");
    });
    $(".AbnormalBox .biao:last input[type=text]").focus(function() {
        csel("");
        $(this).removeClass("red");
        $(this).next().text("");
    });

    function csel(content) {
        $("#sub").next().text(content);
    }

    function repcontent(content) {
        return content.replace("<", "&lt;").replace(">", "&gt;").replace("/", "&frasl;");
    }
})