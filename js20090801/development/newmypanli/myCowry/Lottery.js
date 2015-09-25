$(function() {
    var left = $('#cowryLeft').click(function() {
        if (!lotteryStart) {
            if (index == dest)
                run(index - 1);
        }
        return false;
    });
    var right = $('#cowryRight').click(function() {
        if (!lotteryStart) {
            if (index == dest)
                run();
        }
        return false;
    });
    var box = $('#cowryBox');
    box.append(box.children().clone()).width($("li:eq(0)", box).width() * $("li", box).length);

    //是否开始抽奖
    var lotteryStart = false;
    //当前滚动位置
    var index = 0;
    //目标滚动位置
    var dest = index;
    var l = box.find("li").length;
    var run = function(i) {
        dest = (i || i == 0) ? i : index + 1;
        if (dest >= 16) {
            dest = 6;
            box.css("margin-left", 0 - 129 * (dest - 1));
        }
        if (dest < 0) {
            dest = 9;
            box.css("margin-left", 0 - 129 * (dest + 1));
        }
        box.animate({ marginLeft: (0 - 129 * dest) + "px" }, 300, function() {
            index = dest;
            if (dest == 20) {
                return false;
            }
        });


    }

    function getIndex(code) {
        code = parseInt(code);
        var codelist = [{ "v": 1, "t": "5点积分", "l": 1, "p": 5 },
                    { "v": 10, "t": "c", "l": 2, "p": 20 },
                   { "v": 6, "t": "p", "l": 3, "p": 35 },
                     { "v": 2, "t": "p", "l": 4, "p": 10 },
                      { "v": 7, "t": "p", "l": 5, "p": 45 },
                      { "v": 3, "t": "p", "l": 6, "p": 15 },
                      { "v": 9, "t": "c", "l": 7, "p": 5 },
                        { "v": 8, "t": "p", "l": 8, "p": 50 },
                         { "v": 4, "t": "p", "l": 9, "p": 25 },
                          { "v": 5, "t": "p", "l": 10, "p": 30}];
        for (var i = 0; i < codelist.length; i++) {
            if (code == codelist[i].v) return codelist[i];
        }
    }
    var lotteryCode = -1;
    $('#lotterySubmit').click(function() {
        lotteryStart = true;
        $.ajax({
            type: "POST",
            url: "/App_Services/wsCowry.asmx/DrawLottery",
            contentType: "application/json;utf-8",
            dataType: "json",
            data: '{"aid":' + $('#appraisalID').val() + '}',
            timeout: 8000,
            beforeSend: function() { $('#lotterySubmit').attr("disabled", "disabled"); },
            error: function() { lotteryCode = -1; $('#lotterySubmit').removeAttr("disabled") },
            success: function(r) { lotteryCode = r.d; }

        });
        box.css("margin-left", 0);
        var ml = 0;
        var loop = 0;
        var sid = setInterval(function() {
            box.css("margin-left", ml = ml - 30);
            if (ml == -1290) {
                ml = 0;
                box.css("margin-left", "0px");
                loop++;
                if (lotteryCode >= 0 && loop > 1) {
                    clearInterval(sid);
                    if (lotteryCode > 10) {
                        switch (lotteryCode) {
                            case 11: alert('您已经抽过奖了'); break;
                            case 12: alert('您还没有评价过宝贝'); break;
                            default: alert('网络错误，请稍后再试'); break;
                        }
                        index = dest = 0;
                        lotteryStart = false;
                        return false;
                    }
                    var temp = getIndex(lotteryCode)
                    var step = temp.l - 3;
                    if (step <= 5) {
                        step += 10;
                    }
                    var templength = 0;
                    sid = setInterval(function() {
                        box.css("margin-left", templength = templength - 3 * (step - 1));
                        if (-1 * (step - 1) * 129 == templength) {
                            clearInterval(sid);
                            sid = setInterval(function() {
                                box.css("margin-left", templength = templength - 3);
                                if (-1 * step * 129 == templength) {
                                    clearInterval(sid);
                                    $('#lotteryTop').html('<div class="wanbi"><h1>您已使用了抽奖机会，获得了' + temp.p + (temp.t == "c" ? "元优惠券" : "点积分") + '！</h1><p>评价自己的宝贝，就可以再次抽奖喔！</p></div>');
                                    $('#lotteryReslut').html('恭喜您！获得<span>' + temp.p + '</span>' + (temp.t == "c" ? "元优惠券" : "点积分") + '！');
                                    $('#lotteryReslut').next('p').html(temp.t == "c" ? '抽奖获得的优惠券已存入您的账户！<a href="/mypanli/Coupon/" target="new">点此查看' : '抽奖获得的积分已存入您的账户！<a href="/mypanli/ScoreRecords.aspx" target="new">点此查看');
                                    $('#LotteryOverlay').height($(document).height());
                                    $('#LotteryDraw,#LotteryOverlay').show();
                                    window.onbeforeunload = null;
                                    index = dest = step;
                                    lotteryStart = false;
                                }
                            }, 20);
                            //                                        box.animate({ marginLeft: (templength - 129) + "px" }, 1000, function() {
                            //                                            $('#lotteryTop').html('<div class="wanbi"><h1>您已使用了抽奖机会，获得了' + temp.p + (temp.t == "c" ? "元优惠券" : "点积分") + '！</h1><p>评价自己的宝贝，就可以再次抽奖喔！</p></div>');
                            //                                            $('#lotteryReslut').html('恭喜您！获得<span>' + temp.p + '</span>' + (temp.t == "c" ? "元优惠券" : "点积分") + '！');
                            //                                            $('#lotteryReslut').next('p').html(temp.t == "c" ? '抽奖获得的优惠券已存入您的账户！<a href="/mypanli/Coupon/" target="new">点此查看' : '抽奖获得的积分已存入您的账户！<a href="/mypanli/ScoreRecords.aspx" target="new">点此查看');
                            //                                            $('#LotteryDraw,#LotteryOverlay').show();
                            //                                            window.onbeforeunload = null;
                            //                                            index = dest = step;
                            //                                            lotteryStart = false;
                            //                                        });
                        }
                    }, 7 * (step - 1));
                    return false;
                }
                if (loop > 10) {
                    clearInterval(sid);
                    alert('网络错误！！！');
                    index = dest = 0;
                    lotteryStart = false;
                    return false;
                }
            }
        }, 40);
    });
});