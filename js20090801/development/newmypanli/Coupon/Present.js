$(function() {
    //生成优惠券图片URL
    function buildImgUrl(price) {
        return "http://sf.panli.com/FrontEnd/images20090801/newmypanli/score/q" + price + ".jpg";
    }

    var username = $("#username").val();

    //赠送优惠券层
    var presentPanel = $('<div><div class="name"><table><tr><td class="z">优惠券号码：</td><td> </td></tr><tr><td class="z">面 值：</td><td> </td></tr><tr><td class="z">来 自：</td><td> </td></tr><tr><td class="z">有 效 期：</td><td> </td></tr><tr><td class="z">赠 送 给：</td><td><input class="hui" type="text" value="(您想送给谁？就填写TA的Panli用户名吧)" /><div class="no_name">&nbsp;</div></td></tr></table></div><div class="tijiao"><input type="button" value="我要赠送" onmouseover="this.className=\'by\'" onmouseout="this.className=\'\'" /><a href="javascript:;">返回上一步重新选择</a></div></div>')
    //成功赠送后的层
    var successPanel = $('<div class="succeed"><h2>您的电子优惠券已赠送成功！</h2><span> </span><div class="jxl"><h3>接下来您是不是要：</h3><p><a href="/mypanli/Coupon/">查看我的优惠券</a><i>或者</i><a href="javascript:;">继续赠送优惠券</a></p></div></div>');
    //继续赠送优惠券按钮点击方法
    $("a", successPanel).click(function() { successPanel.hide(); buildlist(1, $("#ajaxPager")); });


    //成功赠送后打开提示层方法
    successPanel.open = function(name) {
        $("span", successPanel).html('您刚刚把了一张电子优惠券<b>（' + presentPanel.data("price") + '元）</b>赠送给' + name + '!<br />卡号为' + presentPanel.data('code') + '，建议您及时提醒对方查收！');
        if (successPanel.isAppend) {
            successPanel.show();
        }
        else {
            presentPanel.after(successPanel);
            successPanel.show();
            successPanel.isAppend = true;
        }
    };

    //层是否被添加到DOM树
    successPanel.isAppend = false;

    //层是否被添加到DOM树
    presentPanel.isAppend = false;

    //设置赠送优惠券的值
    presentPanel.setValue = function(code, price, source, date) {
        presentPanel.data("code", code);
        presentPanel.data("price", price);
        $("tr:eq(0) td:eq(1)", presentPanel).html(code);
        $("tr:eq(1) td:eq(1)", presentPanel).html('<span>' + price + '元</span>');
        $("tr:eq(2) td:eq(1)", presentPanel).html(source);
        $("tr:eq(3) td:eq(1)", presentPanel).html(date);
        presentPanel.init();
    };

    //初始化用户名输入框
    presentPanel.init = function() {
        $(":text", presentPanel).attr('class', 'hui').val('(您想送给谁？就填写TA的Panli用户名吧)');
        $(".no_name", presentPanel).hide();
    }

    //层展示方法
    presentPanel.open = function() {
        if (presentPanel.isAppend)
            presentPanel.show();
        else {
            $("#userCouponListPanel").after(presentPanel);
            presentPanel.show();
            presentPanel.isAppend = true;
        }
    };

    //输入被赠送用户姓名的焦点方法
    $(":text", presentPanel).focus(function() {
        $(".no_name", presentPanel).hide();
        if ($(this).attr("class") == "hui")
            $(this).val('');
        $(this).removeClass("hui");
        //焦点脱离方法
    }).blur(function() {
        if ($.trim($(this).val()).length <= 0)
            $(this).val('(您想送给谁？就填写TA的Panli用户名吧)').attr('class', 'hui');

        //输入框回车事件
    }).keydown(function(e) { if (e.keyCode == 13) $(":button", presentPanel).click(); });


    //层确定按钮点击方法,提交服务器赠送
    $(":button", presentPanel).click(function() {
        var name = $.trim($(":text", presentPanel).val());
        var btn = $(this);
        if (name.length <= 0 || $(":text", presentPanel).attr('class') == 'hui') {
            $(".no_name", presentPanel).text('请输入您想赠送的用户名。').show();
            return false;
        }
        if (name == username) {
            $(".no_name", presentPanel).text('不能赠送给自己噢！').show();
            return false;
        }

        if (!confirm('您确定要将电子优惠券' + presentPanel.data("code") + '（' + presentPanel.data("price") + '元）赠送给' + name + '吗？')) return false;

        $.ajax({
            type: "POST",
            url: "/App_Services/wsCouponManage.asmx/Present",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"name":"' + name + '","code":"' + presentPanel.data("code") + '"}',
            timeout: 15000,
            beforeSend: function() { btn.attr("disabled", "disabled"); },
            error: function() { btn.removeAttr("disabled"); },
            success: function(r) {
                btn.removeAttr("disabled");
                //赠送成功
                if (r.d == "success") { presentPanel.hide(); successPanel.open(name); }
                //赠送失败
                if (r.d == "fail") { $(".no_name", presentPanel).text('赠送失败').show(); }
                //被赠送人用户名不存在
                if (r.d == "noUser") { $(".no_name", presentPanel).text('该用户名不存在，是不是输入有误呢？').show(); }
            }
        });

        //alert(presentPanel.data("code"));
        return false;
    });

    //返回上一步链接点击事件
    $("a", presentPanel).click(function() { presentPanel.hide(); $("#userCouponListPanel").show(); });



    //用户优惠券列表，d是总数，是当前页列表
    var couponList = { d: 0, l: [] };
    //优惠券列表表格对象
    var listHtml = $("#userCouponList");
    //构造列表页面方法
    var buildlist = function(i, jq) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsCouponManage.asmx/GetUserGivableCoupons",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"pages":' + i + '}',
            timeout: 15000,
            beforeSend: function() { $("#userCouponList").hide(); $("#loading,#userCouponListPanel").show(); },
            error: function() {
                $("#userCouponListPanel").before('<div class="zs_wu">加载优惠券信息出错，请稍后再试！！<br /></div>').remove();
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
                    $("#userCouponListPanel").before('<div class="zs_wu">您目前没有可以赠送的电子优惠券。<br /><a href="/mypanli/Coupon/">查看我的优惠券</a></div>').remove();
                    return;
                }
                if (couponList.l.length > 0) {
                    listHtml.empty();
                    $.each(couponList.l, function(index, item) {
                        //赠送按钮绑定方法
                        var button = $('<input type="button" value="就选这张，下一步" />').click(function() {
                            $("#userCouponListPanel").hide();
                            presentPanel.setValue(item.n, item.m, item.t, item.d); presentPanel.open();
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