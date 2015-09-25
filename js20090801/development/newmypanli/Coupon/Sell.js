$(function() {
    //生成优惠券图片URL
    function buildImgUrl(price) {
        return "http://sf.panli.com/FrontEnd/images20090801/newmypanli/score/q" + price + ".jpg";
    }
    //用户优惠券列表，d是总数，是当前页列表
    var couponList = { d: 0, l: [] };
    //优惠券列表表格对象
    var listHtml = $("#userCouponList");

    //出售优惠券操作层
    var sellPanel = $('<div><div class="name"><table><tr><td class="z">优惠券号码：</td><td> </td></tr><tr><td class="z">面 值：</td><td> </td></tr><tr><td class="z">来 自：</td><td> </td></tr><tr><td class="z">有 效 期：</td><td> </td></tr><tr><td class="z">售价：</td><td><input class="hui" type="text" maxlength="6" /><p>电子优惠券面值×0.5＜售价＜电子优惠券面值×0.8</p></td></tr></table></div><div class="tijiao"><input type="button" value="我要发布" onmouseover="this.className=\'by\'" onmouseout="this.className=\'\'" /><a href="javascript:;">返回上一步重新选择</a></div></div>')
    //成功出售后的层
    var successPanel = $('<div class="succeed se_"><h2>您的出售信息已成功发布到电子优惠券商城！</h2><span>温馨提示：您发布的电子优惠券如果出售成功，所售金额将自动转入您的RMB账户中。</span><div class="jxl"><h3>接下来您是不是要：</h3><p><a href="/Coupon/" target=\"_blank\">去电子优惠券商城瞧瞧</a><i>或者</i><a href="/mypanli/Coupon/">查看我的优惠券</a></p></div></div>');

    //成功出售后打开提示层方法
    successPanel.open = function() {
        if (successPanel.isAppend)
            successPanel.show();
        else {
            sellPanel.after(successPanel);
            successPanel.show();
            successPanel.isAppend = true;
        }
    };

    //层是否被添加到DOM树
    successPanel.isAppend = false;

    //层是否被添加到DOM树
    sellPanel.isAppend = false;

    //设置出售优惠券的值
    sellPanel.setValue = function(item, index) {
        sellPanel.data("code", item.n);
        sellPanel.data("index", index);
        sellPanel.data("price", item.m);
        $("tr:eq(0) td:eq(1)", sellPanel).html(item.n);
        $("tr:eq(1) td:eq(1)", sellPanel).html('<span>' + item.m + '元</span>');
        $("tr:eq(2) td:eq(1)", sellPanel).html(item.t);
        $("tr:eq(3) td:eq(1)", sellPanel).html(item.d);
    };

    //层展示方法
    sellPanel.open = function() {
        if (sellPanel.isAppend)
            sellPanel.show();
        else {
            $("#userCouponListPanel").after(sellPanel);
            sellPanel.show();
            sellPanel.isAppend = true;
        }
    };

    //出售优惠券的售价验证
    $(":text", sellPanel).focus(function() {
        $(".no_name", sellPanel).hide();
        if ($(this).attr("class") == "hui")
            $(this).val('');
        $(this).removeClass("hui");
    }).keyup(function() {
        this.value = this.value.replace(/[^\d\.]/g, '').replace(/^0+/, '');
    }).keydown(function(e) { if (e.keyCode == 13) $(":button", sellPanel).click(); });


    //层确定按钮点击方法,提交服务器赠送
    $(":button", sellPanel).click(function() {
        var price = $.trim($(":text", sellPanel).val());
        var wrongPanel = $("p", sellPanel);
        if (price.length <= 0) {
            wrongPanel.attr('class', 'wrong').text('请输入电子优惠券的售价');
            return false;
        }
        price = parseFloat(price);
        if (!price) {
            wrongPanel.attr('class', 'wrong').text('您输入的价格有误，请从新输入');
            return false;
        }

        //当前优惠券价格
        var couponPrice = sellPanel.data("price");
        if (couponPrice * 0.5 > price) {
            wrongPanel.attr('class', 'wrong').text('售价须高于电子优惠券面值×0.5');
            return false;
        }
        if (couponPrice * 0.8 < price) {
            wrongPanel.attr('class', 'wrong').text('售价须低于电子优惠券面值×0.8');
            return false;
        }

        price = parseFloat(price.toFixed(2));
        var btn = $(this);
        //if (!confirm('您确定要以' + price + '的价格将电子优惠券' + sellPanel.data("code") + '（' + sellPanel.data("price") + '元）出售吗？')) return false;

        $.ajax({
            type: "POST",
            url: "/App_Services/wsCouponManage.asmx/Sell",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"code":"' + sellPanel.data("code") + '","price":' + price + '}',
            timeout: 10000,
            beforeSend: function() { btn.attr("disabled", "disabled"); },
            error: function() { btn.removeAttr("disabled"); },
            success: function(r) {
                btn.removeAttr("disabled");
                //出售成功成功
                if (r.d == "Success") {
                    couponList.l[sellPanel.data("index")].s = 1;
                    $("#c" + sellPanel.data("index")).removeClass('sell').text('出售中，取消出售');
                    sellPanel.hide();
                    successPanel.open();
                    return;
                }
                //当前状态不允许出售
                if (r.d == "StatusException") { sellPanel.attr('class', 'wrong').text('当前状态不允许出售。'); return; }
                //高于允许的最高售价
                if (r.d == "PriceUnderflow") { sellPanel.attr('class', 'wrong').text('出售失败。'); return; }
                //低于允许的最低售价
                if (r.d == "PriceOverflow") { sellPanel.attr('class', 'wrong').text('出售失败。'); return; }
                //赠送失败
                sellPanel.attr('class', 'wrong').text('出售失败。'); return;
            }
        });

        //alert(sellPanel.data("code"));
        return false;
    });

    //返回上一步链接点击事件
    $("a", sellPanel).click(function() { sellPanel.hide(); $("#userCouponListPanel").show(); });

    //构造列表页面方法
    var buildlist = function(i, jq) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsCouponManage.asmx/GetUserSellCoupons",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"pages":' + i + '}',
            timeout: 15000,
            beforeSend: function() { listHtml.hide(); $("#loading,#userCouponListPanel").show(); },
            error: function() {
                $("#userCouponListPanel").before('<div class="zs_wu">加载优惠券信息出错，请稍后再试！！<br /><a href="/mypanli/Coupon/">返回我的优惠券&gt;&gt;</a></div>').remove();
            },
            success: function(r) {
                var temp = eval("(" + r.d + ")");
                //如果列表项总数发生变化重构分页器
                if (couponList.n != temp.n) {
                    jq.AjaxPager({
                        sum_items: temp.n,
                        current_page: i,
                        items_per_page: 10,
                        callback: buildlist
                    });
                }
                //构造列表
                couponList = temp;
                //用户没有优惠券
                if (couponList.n <= 0) {
                    $("#userCouponListPanel").before('<div class="zs_wu">您目前没有可以出售的电子优惠券。<br /><a href="/mypanli/Coupon/">返回我的优惠券&gt;&gt;</a></div>').remove();
                    return;
                }
                if (couponList.l.length > 0) {
                    listHtml.empty();
                    $.each(couponList.l, function(index, item) {
                        //出售按钮
                        var button;

                        button = $('<a id="c' + index + '" href="javascript:;" ' + (item.s == 0 ? 'class="sell"' : '') + '>' + (item.s == 0 ? '就选这张，下一步' : '出售中，取消出售') + '</a>')
                        //按钮点击事件
                                    .click(function() {
                                        //用户取消出售优惠券
                                        if (item.s) {
                                            if (!confirm('您确定要取消出售电子优惠券' + item.n + '（' + item.m + '元）吗？')) return;
                                            $.ajax({
                                                type: "POST",
                                                url: "/App_Services/wsCouponManage.asmx/CancelSell",
                                                cache: false,
                                                dataType: "json",
                                                contentType: "application/json;utf-8",
                                                data: '{"code":\"' + item.n + '\"}',
                                                timeout: 10000,
                                                beforeSend: function() { button.attr("disabled", "disabled"); },
                                                error: function() {
                                                    button.removeAttr('disabled');
                                                    alert('网络错误，请稍后再试！');
                                                },
                                                success: function(r) {
                                                    button.removeAttr('disabled');
                                                    if (r.d == "success") {
                                                        item.s = 0;
                                                        button.addClass('sell').text('就选这张，下一步');
                                                        return;
                                                    }
                                                    alert('撤销失败，如多次失败请联系客服。');
                                                }
                                            });
                                            return false;
                                        }
                                        //用户选择出售优惠券
                                        else {
                                            $("#userCouponListPanel").hide();
                                            sellPanel.setValue(item, index);
                                            sellPanel.open();
                                        }
                                    });



                        //数据绑定
                        var tr = $('<tr><td class="w1"><img src="' + buildImgUrl(item.m) + '" alt="' + item.m + '元" /></td><td class="w2">' + item.n + '</td><td class="w3">' + item.d + '</td><td class="w4">' + item.m + '元</td><td class="w5"></td></tr>');
                        $(".w5", tr).append(button);
                        listHtml.append(tr);
                    });
                    $("#loading").hide();
                    listHtml.show();
                }
            }
        });
    }
    buildlist(1, $("#ajaxPager"));
});  