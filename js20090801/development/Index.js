$(function() {
    var tempstr = '<div class="caozuo"><a href="http://passport.panli.com/Register/" class="zhuce">立即免费注册</a><a href="/shopping_demo/" class="yanshi" target="_blank">代购演示</a></div>';
    var banner = $("#banner");
    //切换显示的当前显示页
    var bindex = 0;
    //切换显示的目标显示页
    var bdest = bindex;
    //是否悬停在标签按钮上，判断停止切换
    var hover = false;
    //悬停的标签索引
    var btnindex = -1;
    //循环切换
    var bannertid;
    //3个按钮标签数组
    var bannerbtn = [];
    bannerbtn[0] = $("#bannerbtn0");
    bannerbtn[1] = $("#bannerbtn1");
    bannerbtn[2] = $("#bannerbtn2");

    //向上滚动按钮
    $("#bannerUp").click(function() { if (bdest == bindex) { clearTimeout(bannertid); bdest = bindex > 0 ? bindex - 1 : 2; brun(); } });

    //向下滚动按钮
    $("#bannerDown").click(function() { if (bdest == bindex) { clearTimeout(bannertid); brun(); } });

    //标签按钮事件
    $.each(bannerbtn, function(i, d) {
        d.hover(function() {
            hover = true; btnindex = i;
            if (bdest == bindex) {
                clearTimeout(bannertid);
                if (bdest == i)
                    return;
                bdest = i;
                brun();
            }

        }, function() {
            hover = false; btnindex = -1;
            if (bdest == bindex) {
                clearTimeout(bannertid); bannertid = setTimeout(brun, 10000);
            }
        });
    });

    //重置3个按钮标签
    function resetBtn() {
        bannerbtn[0].attr("class", "cutover_1");
        bannerbtn[1].attr("class", "cutover_2");
        bannerbtn[2].attr("class", "cutover_3");
    }

    //3个大banner数组
    var b = [];
    b[0] = $("li", banner);
    b[2] = $('<li class="banner_3"><p>想团什么你来说，全球华人等你来号召，就等你了！<br />你的团购你做主，你来砍价谁敢拦？开团越多，省越多！</p>' + tempstr + '<dl class="chakan"><dd><a href="http://tuan.panli.com">大家在团什么？</a></dd><dt><a href="http://service.panli.com/Help/List/20.html" target="_blank">查看团购规则</a></dt></dl></li>');
    b[1] = $('<li class="banner_2"><p>拼单买国货，国内免运费...<br />无需为淘那件心爱的连衣裙而花费太多时间，别人帮你找好，就等你来拼单了。</p>' + tempstr + '<dl class="chakan"><dd><a href="/Piece/">看看大家拼些什么？</a></dd><dt><a href="http://service.panli.com/Help/List/21.html" target="_blank">查看拼单购规则</a></dt></dl></li>');
    $.each(b, function(i, d) { d.mousemove(function() { clearTimeout(bannertid); bannertid = setTimeout(brun, 10000); }); });
    //循环切换banner方法体
    var brun = function() {
        bdest = bindex != bdest ? bdest : (bindex > 1 ? 0 : bindex + 1);
        resetBtn(); bannerbtn[bdest].attr("class", "cutover_" + (bdest + 1) + "_");
        banner.append(b[bdest]); b[bdest].css("margin-top", "-248px").hide().fadeIn(1000);
        b[bindex].css("z-index", 10).fadeOut(1000, function() { $(this).css("z-index", 1).remove(); b[bdest].css("margin-top", "0"); bindex = bdest; if (!hover) { clearTimeout(bannertid); bannertid = setTimeout(brun, 10000); } else { if (btnindex >= 0 && btnindex != bindex) { bdest = btnindex; brun(); } } });
    }
    bannertid = setTimeout(brun, 10000);


    //随便看看滚动方法
    var cutString = function(s, l) { if (s.length > l) return s.substring(0, l - 2) + "..."; return s; }
    $.getJSON("/App_Scripts/JSData/MaqueeProductInfo.ashx?r=" + Math.random(), function(d) {
        var m = $("<ul></ul>");
        $("#Slider").empty().append(m);
        $.each(d, function(i, s) { m.append('<li><div class="detailed"><div class="pic"><a href="/See/?type=' + s.c + '#' + s.id + '"><img alt="' + s.n + '" src="' + s.p + '" /></a></div><div class="info"><h2><a href="/See/?type=' + s.c + '#' + s.id + '">' + cutString(s.n, 40) + '</a></h2><dl><dd><b>￥' + s.m.toFixed(2) + '</b><span>' + s.d + '</span></dd><dd class="i_bj">代购信息：<i>' + s.un + '</i>购买于' + s.s + '</dd></dl></div></div><div class="concise"><p><a href="/See/?type=' + s.c + '#' + s.id + '">' + cutString(s.n, 25) + '</a></p><span>' + s.d + '</span></div></li>'); });

        (function(speeds, timeout) {
            var flag = true;
            var $scroll = m;
            var ch = 0;
            var timeid;
            var step = 1;
            var liHeight = $scroll.find(".concise:eq(0)").outerHeight();
            $scroll.scrollTop(0);
            $scroll.children().each(function() { ch += $(this).outerHeight(); });
            $scroll.append($scroll.html());
            var showLi = $scroll.find("li:eq(1)");
            $(showLi).find(".detailed").show();
            $(showLi).find(".concise").hide();
            var s = function() {
                var t = $scroll.scrollTop();
                if (t >= ch) {
                    showLi = $scroll.find("li:eq(0)");
                    $scroll.find(".detailed").hide();
                    $(showLi).find(".detailed").show();
                    $(showLi).find(".concise").hide();
                }
                $scroll.scrollTop((t >= ch ? 0 : t) + step);

                if ($scroll.scrollTop() % liHeight == 0) _pause();
            }
            function _pause() {
                //alert($scroll.scrollTop());
                step = 0;
                if (flag) {
                    setTimeout(function() {
                        $(showLi).find(".concise").show();
                        showLi = $(showLi).next("li:first");
                        if (!showLi) {
                            showLi = $scroll.find("li:first");
                        }
                        $scroll.find(".detailed").hide();
                        $(showLi).find(".detailed").show();
                        $(showLi).find(".concise").hide();
                        flag = true;
                        step = 1;
                    }, timeout);
                }
                flag = false;
            }

            $scroll.find("li").mouseover(function() {
                $scroll.find(".detailed").hide();
                $(this).find(".detailed").show();
                $(this).find(".concise").hide();
                clearInterval(timeid);
            });
            $scroll.find("li").mouseout(function() {
                $scroll.find(".detailed").hide();
                $(this).find(".concise").show();
                $(showLi).find(".detailed").show();
                $(showLi).find(".concise").hide();
                timeid = setInterval(s, speeds);
            });
            timeid = setInterval(s, speeds);
        })(30, 3000);
    });

    //团购倒计时
    (function() {
        var seconds = $("#GroupLimit").val();
        var cacl = function() {
            var s = seconds--;
            if (s <= 0) {
                $("#GTime").html("已截团");
                return;
            }
            var day = parseInt(s / 86400); s %= 86400;
            var hour = parseInt(s / 3600); s %= 3600;
            var minute = parseInt(s / 60); s %= 60;
            var second = s;
            $("#Day").text(day);
            $("#Hour").text(hour);
            $("#Minute").text(minute);
            $("#Second").text(seconds);
            $("#GTime").html('剩余<i>' + day + '</i>天<i>' + hour + '</i>小时<i>' + minute + '</i>分<i>' + second + '</i>秒');
        }
        setInterval(cacl, 1000);
    })();

    //小编推荐滚动代码段
    $.getJSON("/App_Scripts/JSData/Index_PanliRecommend.ashx?r=" + Math.random(), function(r) {
        //初始化DIV内容
        var left = $('<div class="g_left"><a href="javascript:;" title="向左"></a></div>').click(function() { clearTimeout(tid); if (index != dest) return; run(index - 1); });
        var right = $('<div class="g_right"><a href="javascript:;" title="向右"></a></div>').click(function() { clearTimeout(tid); if (index != dest) return; run(); });
        var box = $('<div class="g_box"></div>');
        var slider = $('<div class="g_center"></div>').append(box).hover(function() { clearTimeout(tid); hover = true; }, function() { clearTimeout(tid); hover = false; tid = setTimeout(function() { run(); }, 3000); });
        $.each(r, function(i, d) {
            var ul = $("<ul></ul>");

            $.each(d, function(j, li) {
                ul.append('<li><div class="g_pic"><a href="/PanliRecommend/Product.aspx?pid=' + li.id + '" target="_blank"><img src="' + li.p + '" alt="' + li.n + '" /></a><p>已购买' + li.s + '件</p></div><h2><a href="/PanliRecommend/Product.aspx?pid=' + li.id + '" target="_blank">' + li.n + '</a></h2><span>￥' + li.m + '</span></li>');
            });
            box.append(ul);
        });
        box.append(box.children().clone()).width(660 * r.length * 2);
        $("#Recommend").empty().append(left).append(slider).append(right);


        //滚动方法
        var tid = setTimeout(function() { run(); }, 5000);
        //当前滚动位置
        var index = 0;
        //目标滚动位置
        var dest = index;
        //鼠标是否悬停在滚动层上
        var hover = false;
        var l = box.find("ul").length;
        var run = function(i) {

            dest = (i || i == 0) ? i : index + 1;
            //alert(index + "," + dest);
            if (dest >= l) {
                dest = r.length;
                box.css("margin-left", 0 - 660 * (dest - 1));
            }
            if (dest < 0) {
                dest = r.length - 1;
                box.css("margin-left", 0 - 660 * (dest + 1));
            }
            box.fadeTo("fast", 0.5).animate({ marginLeft: (0 - 660 * dest) + "px" }, 800, function() {
                $(this).fadeTo("fast", 1);
                index = dest;
                clearTimeout(tid);
                if (!hover)
                    tid = setTimeout(function() { run(); }, 5000);
            });
        }
    });

    //优惠活动和折扣信息切换代码段
    $("#navi ul li:first-child").addClass("qh");
    $("#navi ul li:last-child").addClass("wu");
    $(".desc").hide();
    $("#desc1").show();
    $("#navi ul li ").mouseover(function() {
        $("#navi ul li").removeClass();
        $(this).addClass("qh");
        if ($(this).next("li").length == 0) {
            $(this).prev("li").addClass("wu");
        }
        else {
            $(this).next("li").addClass("wu");
        }
        $(".desc").hide();
        $(".desc:eq(" + $("#navi ul li").index(this) + ")").show();
    });

});