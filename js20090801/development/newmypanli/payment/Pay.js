$(function() {
    //所有人代付款列表信息
    var l = [];
    //指定人代付款列表信息
    var li = [];

    //切换代付款方式
    $('.pmTag').click(function() {
        $('.pmTag').parent('li').toggleClass('p_on');
        $('.pmPanel').toggle();
        pmCacl();
        return false;
    });

    //链接输入框获得焦点方法
    $('#pmUrl').focus(function() { $('#pmUrlError').hide(); $(this).select(); });


    //抓取按钮点击方法
    $('#pmSnatchBtn').click(function() {
        $('#pmUrlError').hide();
        var url = $.trim($('#pmUrl').val());
        if (url.length <= 0) {
            $('#pmUrlError').html('<p>请输入代付款链接</p>').show();
            return false;
        }
        if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1)
            url = "http://" + url;

        var reg = new RegExp("http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?");
        if (!reg.test(url)) {
            $('#pmUrl').val('');
            $('#pmUrlError').html('<p>您输入的代付款链接有误，请重新输入</p>').show();
            return false;
        }
        for (var i = 0; i < l.length; i++) {
            if (l[i].u == url) {
                $('#pmUrl').val('');
                $('#pmUrlError').html('<p>您已经抓取过这条代付款链接了喔！</p>').show();
                return false;
            }
        }

        $.ajax({
            type: "POST",
            url: "/App_Services/wsSelfPurchase.asmx/GetPaymentInfo",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"url":"' + url + '"}',
            timeout: 15000,
            beforeSend: function() { $('#pmLoading').show(); },
            complete: function() { $('#pmLoading').hide(); },
            error: function() { alert('网络错误！请稍后重试'); },
            success: function(r) {
                $('#pmUrl').val('');
                var item = $.parseJSON(r.d);
                switch (item.error) {
                    case '': break;
                    case 'noLogin': alert('登陆超时，请刷新页面重试'); return;
                    case 'wrongAddress': alert('代付款包裹物流地址错误'); return;
                    case 'fail':
                        $('#pmUrl').val('');
                        $('#pmUrlError').html('<p>您输入的代付款链接有误，请重新输入</p>').show();
                        return false;
                    default: alert('抓取失败！请稍后重试'); return;
                }
                $('.pmPanel:visible .pmSnatchPrompt').hide();
                var t = $('<table class="p1"><tr><td class="b1"><a href="#" class="pmDelBtn"><img src="http://sf.panli.com/FrontEnd/images20090801/newmypanli/payment/s1.gif" alt="删除" /></a></td><td class="b2">' + item.i + '</td><td class="b3">' + item.n + '</td><td class="b4">￥' + item.p + '</td></tr></table>');
                $('.pmPanel:visible').append(t);
                t.fadeIn(1000);
                $('.dingdan .p1:visible').css('background-color', '');
                $('.dingdan .p1:visible:odd').css('background-color', '#f5fbfd');
                l.push(item);
                pmCacl();
            }
        });
        return false;
    });

    //限制淘宝商家名长度
    $('#pm2shopinfo').keyup(function() {
        var str = $(this).val();
        var regCn = new RegExp("[\\u4e00-\\u9fa5]", "g");
        var strlength = str.length;
        while (regCn.exec(str) != null)
            strlength++;
        if (strlength > 30) {
            $(this).val(str.substring(0, str.length - 1));
            $('#pm2shopinfo').keyup();
        }
    });

    //指定人代付款界面文本框获得焦点事件   
    $('#pm2dealNo').focus(function() {
        $(this).next('p').removeClass('error').text('请输入代付款交易号');
    });
    $('#pm2shopinfo').focus(function() {
        $(this).next('p').removeClass('error').text('请输入卖家的淘宝用户名');
    });
    $('#pm2Price').focus(function() {
        $(this).next('p').removeClass('error').text('请填写代付款金额(含邮费)');
    });

    //指定人代付款添加按钮
    $('#pmAddBtn').click(function() {
        var dealNo = $.trim($('#pm2dealNo').val());
        var pricestr = $.trim($('#pm2Price').val());
        var price = parseFloat(pricestr);
        var shopinfo = $.trim($('#pm2shopinfo').val());
        if (dealNo.length <= 0) {
            $('#pm2dealNo').next('p').addClass('error');
            return false;
        }
        if (shopinfo.length <= 0) {
            $('#pm2shopinfo').next('p').addClass('error');
            return false;
        }
        if (pricestr.length <= 0) {
            $('#pm2Price').next('p').addClass('error').text('输入整数或小数，小数点后不超过2位');
            return false;
        }
        if (!new RegExp("^\\d+(\.\\d{1,2})?$").test(pricestr)) {
            $('#pm2Price').next('p').addClass('error').text('您输入的金额有误，请重新输入！');
            return false;
        }

        if (li.length > 0) {
            for (var index = 0; index < li.length; index++) {
                if (li[index].n == dealNo) {
                    alert('该代付款请求已经添加！');
                    return false;
                }
            }
        }

        $('.pmPanel:visible .pmSnatchPrompt').hide();
        var t = $('<table class="p1"><tr><td class="b1"><a href="#" class="pmDelBtn"><img src="http://sf.panli.com/FrontEnd/images20090801/newmypanli/payment/s1.gif" /></a></td><td class="b5">' + shopinfo + '</td><td class="b6">' + dealNo + '</td><td class="b4">￥' + price + '</td></tr></table>');
        $('.pmPanel:visible').append(t);
        t.fadeIn(1000);
        $('.dingdan .p1:visible').css('background-color', '');
        $('.dingdan .p1:visible:odd').css('background-color', '#f5fbfd');
        li.push({ "u": "http://www.panli.com", "n": dealNo, "p": price, "i": shopinfo });
        $('#payments2 :text').val('');
        pmCacl();
    });


    //删除方法
    $('.pmDelBtn').live("click", function() {
        var no = $.trim($(this).parents('.p1').find($('#pmSnatchBtn:visible').length > 0 ? '.b3' : '.b6').text());
        if ($('#pmSnatchBtn:visible').length > 0)
            l = $.grep(l, function(n, i) { return n.n != no; });
        else
            li = $.grep(li, function(n, i) { return n.n != no; });
        $(this).parents('.p1').fadeOut(1000, function() {
            $(this).remove();
            $('.dingdan .p1:visible').css('background-color', '');
            $('.dingdan .p1:visible:odd').css('background-color', '#f5fbfd');
            pmCacl();
            if ($('.dingdan .p1:visible').length <= 0) {
                $('.pmPanel:visible .pmSnatchPrompt').show();
                submitLock();
                return false;
            }
        });
        return false;
    });

    //提交按钮加锁解锁方法
    function submitLock(str) {
        if (!!str) {
            $('#submitPanel p').html('<img src="http://sf.panli.com/FrontEnd/images20090801/newmypanli/payment/z_1.gif" alt="error" />' + str).show();
        } else {
            $('#submitPanel p').hide();
        }
        $('#pmSubmit').attr({ "disabled": "disabled", "class": "c_no" });
    }
    function submitUnlock() {
        $('#submitPanel p').hide();
        $('#pmSubmit').attr("class", "tj").removeAttr("disabled");
    }

    //计算金额方法
    function pmCacl() {
        var pmAmount = 0, pmFee = 0;
        var templist = $('#pmSnatchBtn:visible').length > 0 ? l : li;
        if (templist.length <= 0) {
            submitLock();
            return false;
        }
        for (var i = 0; i < templist.length; i++) {
            var t = parseFloat(templist[i].p);
            pmAmount += t;
            pmFee += parseFloat((t / 10).toFixed(2));
        }


        $('#pmAmount').text('￥' + pmAmount.toFixed(2));
        $('#pmFee').text('￥' + pmFee.toFixed(2));
        $('#pmTotalPrice').text('￥' + (pmAmount + pmFee).toFixed(2));
        var ucp = parseFloat($('#userCurrentPrice').val());
        if (pmAmount + pmFee > ucp)
            submitLock('对不起！您的账户余额不足，请充值后再试！');
        else
            submitUnlock();
    }

    //提交方法
    $('#pmSubmit').click(function() {
        if ($('#pmSnatchBtn:visible').length > 0) {
            if (l.length <= 0) {
                submitLock('请先添加代付款链接');
                return false;
            }
        } else {
            if (li.length <= 0) {
                submitLock('请添加代付记录后再提交支付！');
                return false;
            }

        }
        var templist = $('#pmSnatchBtn:visible').length > 0 ? l : li;

        var para = '[';
        var totalprice = 0;
        for (var i = 0; i < templist.length; i++) {
            var t = (templist[i].u + '<#>' + templist[i].n + '<#>' + templist[i].p + '<#>' + templist[i].i).replace(/\"/g, "");
            para += '"' + t + '",';
        }
        para = para.substring(0, para.lastIndexOf(",")) + ']';
        $.ajax({
            type: "POST",
            url: "/App_Services/wsSelfPurchase.asmx/PaymentApply",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"para":' + para + '}',
            timeout: 15000,
            beforeSend: function() { $('#pmSubmit').attr('disabled', 'disabled'); },
            complete: function() { $('#pmSubmit').removeAttr('disabled'); },
            error: function() { alert('网络错误！请稍后重试'); },
            success: function(r) {
                var res = $.parseJSON(r.d);
                if (res.r == 'Success') {
                    $('#pmMainPanel').attr('class', 'cg').html('<div class="succeed"><h2>恭喜您！成功提交了代付款申请</h2><p>本次共支付了<span>' + res.p + '</span>元，我们将在<span>1</span>个工作日内为您代付款，请耐心等待。</p><em>代付款成功后，请使用自助购物服务提交本次代付款的商品链接，以便于我们为您验货。</em><a class="cj" href="/mypanli/SelfPurchase/Order.aspx">立即使用自助购物</a><a class="qita" href="/mypanli/payment/Record.aspx">查看代付款记录</a></div>');
                    window.onbeforeunload = null;
                    $(window).scrollTop(0);
                } else if (res.r == 'BalanceLack') {
                    alert('余额不足');
                } else {
                    alert('数据错误，请刷新页面重新提交');
                }
            }
        });

        return false;
    });

});

window.onbeforeunload = function() {
    if ($('.dingdan .p1:visible').length > 0)
        return '关闭、刷新当前页面数据会被清空，确定要这么做吗？';


};