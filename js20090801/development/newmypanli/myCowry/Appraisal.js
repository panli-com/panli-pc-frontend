(function() {
    //初始化分数
    $("#starPanel").data("point", 0);

    var cowryID = $("#cowryID").val();
    function getStr(s) {
        switch (s) {
            case 0: return "(给自己的宝贝评个星级吧！)";
            case 1: return "(十分糟糕)";
            case 2: return "(不太理想)";
            case 3: return "(一般)";
            case 4: return "(感觉不错)";
            case 5: return "(非常棒)";
        }
    }
    //$("#starPanel").data("point", parseInt($("#starPanel").attr('point')));
    //评分五角星鼠标悬停
    $("#starPanel dd").each(function(i, d) {
        $(d).hover(function() {
            $("#starPanel").attr("class", "xing m" + (i + 1)).next("span").removeClass("hong").text(getStr(i + 1));
        }, function() {
            var point = $("#starPanel").data("point");
            $("#starPanel").attr("class", "xing o" + point).next("span").text(getStr(point));
        })
        //鼠标点击
                .click(function() {
                    $("#starPanel").data("point", i + 1).attr("class", "xing o" + (i + 1)).next("span").text(getStr(i + 1));
                    return false;
                });
    });

    //文本框评论获得焦点，失去焦点，以及字数统计方法。
    $("#cowryAp").focus(function() {
        $('#ApPromt').removeClass('hong').text('');
        if ($.trim($(this).attr('class')) == 'hui')
            $(this).removeClass('hui').val('');

    }).keyup(function() {
        var str = $.trim($(this).val());
        if (str.length > 1000) {
            $(this).val(str = str.substring(0, 1000));
        }
        $("#apLength").text(str.length + '/1000');
    }).blur(function() {
        if ($.trim($(this).val()).length <= 0)
            $("#cowryAp").addClass('hui').val('');
    });
    //推荐标签点击事件
    $('#tagsPanel a').click(function() {
        var tagstr = $('#ApTags').val();
        $(this).addClass('tj_on')
        if ($.trim(tagstr).length <= 0) {
            $('#ApTags').val($.trim($(this).text()) + ",");
        } else {
            var tags = tagstr.replace(/，/g, ",").split(',');
            var s = '';
            var isAdd = true;
            for (var i = 0; i < tags.length; i++) {
                if ($.trim(tags[i]) == $(this).text()) {
                    $(this).removeClass('tj_on');
                    isAdd = false;
                    continue;
                }
                if (tags[i].length <= 0) continue;
                s += tags[i].replace(",", "") + ',';
            }
            if (isAdd)
                s += $(this).text() + ",";
            $('#ApTags').val(s);
        }
        return false;
    });
    //标签输入方法
    $('#ApTags').keyup(function() {
        var tags = $('#ApTags').val().replace(/，/g, ",").split(',');
        $('#tagsPanel a').removeClass('tj_on');
        $.each(tags, function(i, tag) {
            $('#tagsPanel a').each(function(i, d) {
                if ($(d).text() == $.trim(tag))
                    $(d).addClass('tj_on');
            });
        });
    })
    .focus(function() {
        $('#tagsPromt').removeClass('hong').text('添加标签让宝贝更容易被找到，标签之间使用逗号被隔开。');
    });

    //重置按钮
    $("#ApReset").click(function() {
        $("#starPanel").data("point", 0);
        $("#starPanel").attr("class", "xing").next("span").removeClass('hong').text('(给自己的宝贝评个星级吧！)'); ;
        $("#cowryAp").addClass('hui').val('');
        $('#ApPromt').removeClass('hong').text('');
        $('#ApTags').val('');
        $('#tagsPromt').removeClass('hong').text('添加标签让宝贝更容易被找到，标签之间使用逗号被隔开。');
        return false;
    });

    //提交评论
    $("#apSubmit").click(function() {
        if ($("#starPanel").data("point") <= 0) {
            $("#starPanel").next("span").addClass("hong").text('(给自己的宝贝评个星级吧！)');
            return false;
        }

        var str = $.trim($("#cowryAp").val());
        if ($.trim($("#cowryAp").attr('class')) == 'hui') {
            $('#ApPromt').addClass('hong').text('请输入对宝贝的评价内容！');
            return false;
        }
        if (str.length > 1000) {
            $('#ApPromt').addClass('hong').text('您写的太多了吧！');
            return false;
        }
        str = str.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");

        var tags = $.trim($('#ApTags').val().replace(/，/g, ",").replace(/\\/g, "\\\\").replace(/"/g, "\\\""));
        if (tags.length <= 0) {
            $('#tagsPromt').addClass('hong').text('为宝贝添加标签，让它更容易被大家找到！');
            return false;
        }
        var taglist = tags.split(',');
        taglist = $.grep(taglist, function(n, i) {
            return $.trim(n).length > 0;
        });
        if (taglist.length > 6) {
            $('#tagsPromt').addClass('hong').text('最多添加6个标签');
            return false;
        }
        for (var i = 0; i < taglist.length; i++) {
            if (taglist[i].length > 20) {
                $('#tagsPromt').addClass('hong').text('单个标签最长只能20个字符');
                return false;
            }
        }
        $.ajax({
            type: "POST",
            url: "/App_Services/wsCowry.asmx/Appraisal",
            contentType: "application/json;utf-8",
            dataType: "json",
            data: '{"id":' + cowryID + ',"point":' + $("#starPanel").data("point") + ',"content":"' + str + '","tags":"' + tags + '"}',
            timeout: 10000,
            error: function() { alert('网络错误，请稍后再试'); },
            success: function(r) {
                var data = $.parseJSON(r.d);

                switch (data.r) {
                    case "Success":
                        window.onbeforeunload = null;
                        //window.location = '/mypanli/myCowry/Lottery.aspx?id=' + data.id;
                        $(window).scrollTop(0);

                        $('#myCowryMain').html('<div class="succeed"><h2>恭喜您！分享宝贝成功！</h2><em>若得到大家的“给栗”，可获得番币奖励呦！<a href="http://service.panli.com/Help/Detail/229.html" target="_blank">了解详情</a></em><a class="cj" href="/mypanli/myCowry/">继续分享宝贝</a><a class="qita" href="/Cowry/">查看大家分享了什么宝贝</a></div>');
//                        $("#exts .GreenMsg").insertAfter(".success em");


                        break;
                    case "NoFound":
                        alert('没有对应的宝贝！');
                        break;
                    case "WrongUser":
                        alert('目前还不能评价别人的宝贝噢！');
                        break;
                    case "AlreadyEvaluation":
                        alert('这件宝贝已经分享过了！'); break;
                    case "pointError":
                        alert('您评价的分数有错！'); break;
                    case "contentError":
                        alert('您写的评价字数不符合标准！'); break;
                    default:
                        alert(data.r);
                        break;
                }
            }
        });
    });
    window.onbeforeunload = function() { return "您当前填写的内容将被清空，确定吗？" };
})();
//2011.12月圣诞调用
function shengdanajax() {
    $.ajax({
        type: "POST",
        url: "/App_Services/wsCirDHL.asmx/GetShengDanShareCountJiFen",
        contentType: "application/json;utf-8",
        dataType: "json",
        timeout: 10000,
        error: function() { alert('网络错误，请稍后再试'); },
        success: function(r) {
            var obj = eval('(' + r.d + ')');
            var sdcount = parseInt(obj.count);
            var sdjifen = parseInt(obj.jifen);

            var shengdanurl = $("#hidshengdanurl").val();
            var jifenurl = $("#hidjifenurl").val();
            
            if (sdcount < 10) {
                $("#myCowryMain").html('<div class="succeed"><h2>恭喜您！分享宝贝成功！</h2><em>若得到大家的“给栗”，可获得番币奖励呦！<a href="http://service.panli.com/Help/Detail/373.html" target="_blank">了解详情</a></em><div class="ti_shi2"><p><i>好消息</i>：2011年12月7日14:00—12月27日14:00(北京时间)，分享宝贝每满10个，就能获得50番币，<a href="' + shengdanurl + '" target="_blank">查看详情</a>。在指定日期您目前共分享了 <span><b>' + sdcount + '</b></span> 个宝贝，加油哦！</p></div><a class="cj" href="/mypanli/myCowry/">继续分享宝贝</a><a class="qita" href="/Cowry/">查看大家分享了什么宝贝</a></div>');
            } else {
                $("#myCowryMain").html('<div class="succeed"><h2>恭喜您！分享宝贝成功！</h2><em>若得到大家的“给栗”，可获得番币奖励呦！<a href="http://service.panli.com/Help/Detail/373.html" target="_blank">了解详情</a></em><div class="ti_shi2"><p><i>好消息</i>：2011年12月7日14:00—12月27日14:00(北京时间)，分享宝贝每满10个，就能获得50番币，<a href="' + shengdanurl + '" target="_blank">查看详情</a>。在指定日期您目前共分享了 <span><b>' + sdcount + '</b></span> 个宝贝，恭喜您获得 <span><b>' + sdjifen + '</b></span> 积分(获得的番币会有10分钟左右的延迟，<a href="' + jifenurl + '" target="_blank">请注意查收</a>)，继续分享宝贝还可以获得番币，加油哦！</p></div><a class="cj" href="/mypanli/myCowry/">继续分享宝贝</a><a class="qita" href="/Cowry/">查看大家分享了什么宝贝</a></div>');
            }

        }
    });
}