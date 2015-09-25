$(function() {

    //宝贝ID
    var cid = $('#CowryId').val();

    //评论列表，n是总数，l是当前页列表
    var commentList = { "n": 0, "l": [] };
    //评论列表表格对象
    var listHtml = $("#userCommentList");
    //构造列表页面方法
    var buildlist = function(i, jq) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsCowry.asmx/GetComment",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"cowryId":' + cid + ',"pageN":' + i + '}',
            timeout: 15000,
            beforeSend: function() { listHtml.hide(); $("#loading").show(); },
            complete: function() { $("#loading").hide(); },
            error: function() { },
            success: function(r) {
                var temp = $.parseJSON(r.d);
                //如果列表项总数发生变化重构分页器
                if (commentList.n != temp.n) {
                    jq.AjaxPager({
                        sum_items: temp.n,
                        current_page: i,
                        items_per_page: 5,
                        callback: buildlist
                    });
                }
                //构造列表
                commentList = temp;
                //没有留言
                if (commentList.n <= 0) {
                    $("#userCommentListPanel").before('<div id="noComment" class="wu_pl"><p>还没有人对这件宝贝发表看法，您有什么真知灼见？</p><span>赶快来<a href="#" onclick="$(document).scrollTop($(\'#liuyanPanel\').offset().top-200);return false;">占个沙发</a>吧！</span></div>');
                    return;
                }
                if (commentList.l.length > 0) {
                    var t = $("#userCommentList");
                    t.empty();
                    $.each(commentList.l, function(index, item) {
                        t.append('<li><div class="name"><p>会员：' + item.u + '</p><span>' + item.d + '</span></div><div class="text">' + item.c + '</div></li>');
                    });
                    $("#loading").hide();
                    t.show();
                }
            }
        });
    }
    buildlist(1, $("#ajaxPager"));

    //添加收藏方法
    $('#AddFavorite').click(function() {

        $.ajax({
            type: "POST",
            url: "/App_Services/wsCowry.asmx/AddFavorite",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{\"cowryId\":" + cid + "}",
            timeout: 10000,
            beforeSend: function() { $('#AddFavorite').attr("disable", "disable"); },
            complete: function() { $('#AddFavorite').removeAttr("disable"); },
            error: function() { alert("网络错误，请稍后重试。"); },
            success: function(res) {
                if (res.d == "success") { alert('添加收藏成功！'); return false; }
                if (res.d == "collected") { alert('您已经收藏过这件宝贝了哟！'); return false; }
                if (res.d == "fail") { alert('添加收藏失败！'); return false; }
                if (res.d == "noLogin") { window.Panli.Login(); return false; }

                alert('添加收藏失败');
            }
        });
        return false;

    });
    //给栗方法
    $('#gelivibleBtn').click(function() {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsCowry.asmx/AddWellNumber",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{\"id\":" + cid + "}",
            timeout: 10000,
            error: function() { alert("网络错误，请稍后重试。"); },
            success: function(res) {
                var now = new Date();
                if (res.d == "Success") {
                    window.Panli.Message.show('给栗成功！');
                    $('#gelivibleBtn span').text(parseInt($('#gelivibleBtn span').text()) + 1);
                    return;
                }
                if (res.d == "noLogin") {
                    window.Panli.Login();
                }
                if (res.d == "Oneself") {
                    alert('不能给栗自己的宝贝！');
                }
                if (res.d == "Welled") {
                    alert('这个商品你已经给栗过了！');
                }
                if (res.d == "Limit") {
                    alert('你今天给栗次数到上限了！');
                }
                if (res.d == "NotFoundShare") {
                    alert('没有找到要给力的宝贝！');
                }
                if (res.d == "Error") {
                    alert('系统错误！');
                }
            }
        });
        return false;
    });

    //限制字数输入
    $("#commentC").keydown(function() {
        var str = $.trim($(this).val());
        if (str.length > 200) {
            $(this).val(str = str.substring(0, 200));
            return false;
        }
    })
                            .focus(function() {
                                if ($("#commentC").attr('class') == 'hui') {
                                    $(this).attr('class', '').val('');
                                }
                            })
                            .blur(function() {
                                if ($.trim($(this).val()).length <= 0) {
                                    $(this).attr('class', 'hui').val('对这件分享有共鸣？您也来随便说两句吧！');
                                }
                            });
    //发表评论方法
    $('#commentstb').click(function() {
        if ($("#commentC").attr('class') == 'hui') {
            alert("请填写留言内容！");
            return;
        }
        if ($.trim($("#commentC").val()).length > 200) {
            alert("留言内容不能超过200字哦！");
            return;
        }

       
        $.ajax({
            type: "POST",
            url: "/App_Services/wsCowry.asmx/AddComment",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{\"cowryId\":" + cid + ",\"content\":\"" + $("#commentC").val() + "\"}",
            timeout: 10000,
            error: function() { alert("网络错误，请稍后重试。"); },
            success: function(res) {
                var now = new Date();
                //if (res.d == "checkcodeError") { alert("验证码错误"); $('#CommentCheckCodeImg').attr('src', '/ValidateCode.ashx?s=CommentCheckCode&w=130&h=27&t=' + Math.random()); return; }
                if (res.d == "success") {
                    $("#noComment").remove();
                    $("#userCommentList").prepend('<li><div class="name"><p>您刚刚发表</p></div><div class="text">' + HtmlEncode($("#commentC").val()).replace(/\n/g, '<br />') + '</div></li>');
                    $("#userCommentList").show();
                    $(document).scrollTop($("#userCommentListPanel").offset().top - 100);
                    $("#commentC").val("");
                    //$("#CommentCheckCode").val("");
                    //$('#CommentCheckCodeImg').attr("src", "/ValidateCode.ashx?s=CommentCheckCode&w=130&h=27&t=" + Math.random());
                    return;
                }

                if (res.d == "fail") {
                    alert('添加评论失败，请稍后重试。');
                }
                if (res.d == "noLogin") {
                    window.Panli.Login();
                }
            }
        });
    });

    //统计
    $("#buyBtn").click(function() {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsCowry.asmx/AddBuyNumber",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"cowryId":' + cid + '}',
            timeout: 10
        });
    });

}); 