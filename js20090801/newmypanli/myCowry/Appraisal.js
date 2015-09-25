(function () {

    $("#starPanel").data("point", 0);
    var a = $("#cowryID").val();
    function b(c) {
        switch (c) {
            case 0:
                return "(给自己的宝贝评个星级吧！)";
            case 1:
                return "(十分糟糕)";
            case 2:
                return "(不太理想)";
            case 3:
                return "(一般)";
            case 4:
                return "(感觉不错)";
            case 5:
                return "(非常棒)";
        }
    }
    $("#starPanel dd").each(function (c, e) {
        $(e).hover(function () {
            $("#starPanel").attr("class", "xing m" + (c + 1)).next("span").removeClass("hong").text(b(c + 1));
        },
        function () {
            var d = $("#starPanel").data("point");
            $("#starPanel").attr("class", "xing o" + d).next("span").text(b(d));
        }).click(function () {
            $("#starPanel").data("point", c + 1).attr("class", "xing o" + (c + 1)).next("span").text(b(c + 1));
            return false;
        });
    });
    $("#cowryAp").focus(function () {
        $("#ApPromt").removeClass("hong").text("");
        if ($.trim($(this).attr("class")) == "hui") {
            $(this).removeClass("hui").val("");
        }
    }).keyup(function () {
        var c = $.trim($(this).val());
        if (c.length > 1000) {
            $(this).val(c = c.substring(0, 1000));
        }
        $("#apLength").text(c.length + "/1000");
    }).blur(function () {
        if ($.trim($(this).val()).length <= 0) {
            $("#cowryAp").addClass("hui").val("");
        }
    });
    $("#tagsPanel a").click(function () {
        var e = $("#ApTags").val();
        $(this).addClass("tj_on");
        if ($.trim(e).length <= 0) {
            $("#ApTags").val($.trim($(this).text()) + ",");
        } else {
            var d = e.replace(/，/g, ",").split(",");
            var g = "";
            var c = true;
            for (var f = 0; f < d.length; f++) {
                if ($.trim(d[f]) == $(this).text()) {
                    $(this).removeClass("tj_on");
                    c = false;
                    continue;
                }
                if (d[f].length <= 0) {
                    continue;
                }
                g += d[f].replace(",", "") + ",";
            }
            if (c) {
                g += $(this).text() + ",";
            }
            $("#ApTags").val(g);
        }
        return false;
    });
    $("#ApTags").keyup(function () {
        var c = $("#ApTags").val().replace(/，/g, ",").split(",");
        $("#tagsPanel a").removeClass("tj_on");
        $.each(c,
        function (e, d) {
            $("#tagsPanel a").each(function (f, g) {
                if ($(g).text() == $.trim(d)) {
                    $(g).addClass("tj_on");
                }
            });
        });
    }).focus(function () {
        $("#tagsPromt").removeClass("hong").text("添加标签让宝贝更容易被找到，标签之间使用逗号被隔开。");
    });
    $("#ApReset").click(function () {
        $("#starPanel").data("point", 0);
        $("#starPanel").attr("class", "xing").next("span").removeClass("hong").text("(给自己的宝贝评个星级吧！)");
        $("#cowryAp").addClass("hui").val("");
        $("#ApPromt").removeClass("hong").text("");
        $("#ApTags").val("");
        $("#tagsPromt").removeClass("hong").text("添加标签让宝贝更容易被找到，标签之间使用逗号被隔开。");
        return false;
    });
    $("#apSubmit").click(function () {

        if ($("#starPanel").data("point") <= 0) {
            $("#starPanel").next("span").addClass("hong").text("(给自己的宝贝评个星级吧！)");
            return false;
        }
        var f = $.trim($("#cowryAp").val());
        if ($.trim($("#cowryAp").attr("class")) == "hui") {
            $("#ApPromt").addClass("hong").text("请输入对宝贝的评价内容！");
            return false;
        }
        if (f.length > 1000) {
            $("#ApPromt").addClass("hong").text("您写的太多了吧！");
            return false;
        }
        f = f.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
        var d = $.trim($("#ApTags").val().replace(/，/g, ",").replace(/\\/g, "\\\\").replace(/"/g, '\\"'));
        if (d.length <= 0) {
            $("#tagsPromt").addClass("hong").text("为宝贝添加标签，让它更容易被大家找到！");
            return false;
        }
        var c = d.split(",");
        c = $.grep(c,
        function (h, g) {
            return $.trim(h).length > 0;
        });
        if (c.length > 6) {
            $("#tagsPromt").addClass("hong").text("最多添加6个标签");
            return false;
        }
        for (var e = 0; e < c.length; e++) {
            if (c[e].length > 20) {
                $("#tagsPromt").addClass("hong").text("单个标签最长只能20个字符");
                return false;
            }
        }
        $.ajax({
            type: "POST",
            url: "/App_Services/wsCowry.asmx/Appraisal",
            contentType: "application/json;utf-8",
            dataType: "json",
            data: '{"id":' + a + ',"point":' + $("#starPanel").data("point") + ',"content":"' + f + '","tags":"' + d + '"}',
            timeout: 10000,
            error: function () {
                alert("网络错误，请稍后再试");
            },
            success: function (g) {
                var h = $.parseJSON(g.d);
                switch (h.r) {
                    case "Success":
                        window.onbeforeunload = null;
                        $(window).scrollTop(0);
                        /*
                        if (h.count >= 10) //临时活动使用，活动结束可以删除 活动时间：2012-3-22 14:00至2012-4-5 14:00
                        $("#myCowryMain").html('<div class="succeed"><h2>恭喜您！分享宝贝成功！</h2><em>若得到大家的“给栗”，可获得积分奖励呦！<a href="/Help/Detail.aspx?hid=229" target="_blank">了解详情</a></em><div class="ti_shi2"><p><b>温馨提示</b>：在活动指定日期您目前共分享了 <span><b>' + h.count + '</b></span> 个宝贝，恭喜您获得 <span><b>' + 50 + '</b></span> 积分(获得的积分会有10分钟左右的延迟，<a href="/mypanli/ScoreRecords.aspx" target="_self">请注意查收</a>)，继续分享宝贝还可以获得积分，加油哦！<a href="/Special/Special.aspx?sid=236" target="_self">查看活动</a></p></div><a class="cj" href="/mypanli/myCowry/">继续分享宝贝</a><a class="qita" href="/Cowry/">查看大家分享了什么宝贝</a></div>');
                        else if (h.count > 0)
                        $("#myCowryMain").html('<div class="succeed"><h2>恭喜您！分享宝贝成功！</h2><em>若得到大家的“给栗”，可获得积分奖励呦！<a href="/Help/Detail.aspx?hid=229" target="_blank">了解详情</a></em><div class="ti_shi2"><p><b>温馨提示</b>：在活动指定日期您目前共分享了 <span><b>' + h.count + '</b></span> 个宝贝，加油哦！<a href="/Special/Special.aspx?sid=236" target="_self">查看活动</a></p></div><a class="cj" href="/mypanli/myCowry/">继续分享宝贝</a><a class="qita" href="/Cowry/">查看大家分享了什么宝贝</a></div>');
                        */
                        var $bbtip = $('#bbtip1');
                        if (h.note != "0") {

                            var temp_1 = '';
                            temp_1 = $('<div class="succeed"><h2>恭喜您！分享宝贝成功！</h2>' + ($bbtip.size() > 0 ? $bbtip.html() : '') + '<em>若得到大家的“给栗”，可获得番币奖励呦！<a href="http://service.panli.com/Help/Detail/229.html" target="_blank">了解详情</a></em></div>');
                            temp_1.append('' + h.note + '');
                            temp_1.append('<a class="cj" href="/mypanli/myCowry/">继续分享宝贝</a><a class="qita" href="/Cowry/">查看大家分享了什么宝贝</a>' + ($bbtip.size() > 0 ? $('#bbtip2').html() : ''));
                            $('#myCowryMain').empty().append(temp_1);
                        }
                        else {

                            $("#myCowryMain").html('<div class="succeed"><h2>恭喜您！分享宝贝成功！</h2>' + ($bbtip.size() > 0 ? $bbtip.html() : '') + '<em>若得到大家的“给栗”，可获得番币奖励呦！<a href="http://service.panli.com/Help/Detail/229.html" target="_blank">了解详情</a></em><a class="cj" href="/mypanli/myCowry/">继续分享宝贝</a><a class="qita" href="/Cowry/">查看大家分享了什么宝贝</a>' + ($bbtip.size() > 0 ? $('#bbtip2').html() : '') + '</div>');
                        }
                        break;
                    case "NoFound":
                        alert("没有对应的宝贝！");
                        break;
                    case "WrongUser":
                        alert("目前还不能评价别人的宝贝噢！");
                        break;
                    case "AlreadyEvaluation":
                        alert("这件宝贝已经分享过了！");
                        break;
                    case "pointError":
                        alert("您评价的分数有错！");
                        break;
                    case "contentError":
                        alert("您写的评价字数不符合标准！");
                        break;
                    default:
                        alert(h.r);
                        break;
                }
            }
        });
    });
    window.onbeforeunload = function () {
        return "您当前填写的内容将被清空，确定吗？";
    };
})();
function shengdanajax() {
    $.ajax({
        type: "POST",
        url: "/App_Services/wsCirDHL.asmx/GetShengDanShareCountJiFen",
        contentType: "application/json;utf-8",
        dataType: "json",
        timeout: 10000,
        error: function() {
            alert('网络错误，请稍后再试');
        },
        success: function(r) {
            var obj = eval('(' + r.d + ')');
            var sdcount = parseInt(obj.count);
            var sdjifen = parseInt(obj.jifen);
            var shengdanurl = $("#hidshengdanurl").val();
            var jifenurl = $("#hidjifenurl").val();
            if (sdcount < 10) {
                $("#myCowryMain").html('<div class="succeed"><h2>恭喜您！分享宝贝成功！</h2><em>若得到大家的“给栗”，可获得番币奖励呦！<a href="http://service.panli.com/Help/Detail/373.html" target="_blank">了解详情</a></em><div class="ti_shi2"><p><i>好消息</i>：2011年12月7日14:00—12月27日14:00(北京时间)，分享宝贝每满10个，就能获得50番币，<a href="' + shengdanurl + '" target="_blank">查看详情</a>。在指定日期您目前共分享了 <span><b>' + sdcount + '</b></span> 个宝贝，加油哦！</p></div><a class="cj" href="/mypanli/myCowry/">继续分享宝贝</a><a class="qita" href="/Cowry/">查看大家分享了什么宝贝</a></div>');
            } else {
                $("#myCowryMain").html('<div class="succeed"><h2>恭喜您！分享宝贝成功！</h2><em>若得到大家的“给栗”，可获得番币奖励呦！<a href="http://service.panli.com/Help/Detail/373.html" target="_blank">了解详情</a></em><div class="ti_shi2"><p><i>好消息</i>：2011年12月7日14:00—12月27日14:00(北京时间)，分享宝贝每满10个，就能获得50番币，<a href="' + shengdanurl + '" target="_blank">查看详情</a>。在指定日期您目前共分享了 <span><b>' + sdcount + '</b></span> 个宝贝，恭喜您获得 <span><b>' + sdjifen + '</b></span> 番币(获得的番币会有10分钟左右的延迟，<a href="' + jifenurl + '" target="_blank">请注意查收</a>)，继续分享宝贝还可以获得番币，加油哦！</p></div><a class="cj" href="/mypanli/myCowry/">继续分享宝贝</a><a class="qita" href="/Cowry/">查看大家分享了什么宝贝</a></div>');
            }
        }
    });
}