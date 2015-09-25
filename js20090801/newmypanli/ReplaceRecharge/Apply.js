$(function () {
    //切换标签
    $('.ReplaceRechargeTag').click(function () {
        $('.ReplaceRechargeTag').parent('li').removeClass('zhong');
        $(this).parent('li').addClass('zhong');
        $('.ReplaceRechargePanel').hide();


        if ($('.ReplaceRechargeTag:eq(0)').parent('li').hasClass('zhong')) {
            $('.ReplaceRechargePanel:eq(0)').show();
            $('#rrMainPanel .withoutAccount').show();
        } else {
            $('.ReplaceRechargePanel:eq(1)').show();
            $('#rrMainPanel .withoutAccount').hide();
        }
        if ($('.no_zhifubao:visible').length > 0) {
            $('#payPasswordPanel').hide();
        } else {
            $('#payPasswordPanel').show();
        }

        $('#payPassword').val('');

        if ($('.rrAmount:visible').length <= 0)
            lock();
        else
            $('.rrAmount:visible').keyup();
        return false;
    });


    //文本框焦点获得事件
    $('#alipayAccount').focus(function () {
        $('#alipayAccount').next('p').removeClass('red').text('输入需要代充值的支付宝账号或手机号码');
    });
    $('#userRealInfo').focus(function () {
        $('#userRealInfo').next('p').removeClass('red').text('请输入需要代充值账号对应的实名信息');
    });
    $('.rrAmount').focus(function () {
        $('.rrAmount:visible').next('p').removeClass('red').text('输入整数或小数，小数点后不超过2位');
    });
    $('#rrvcode').focus(function () {
        $('#rrvcode').next('p').removeClass('red').text('输入图中的字符');
    });

    //点击提交申请
    $('#rrSubmitBtn').click(function () {
        var aAcount = $('#alipayAccount:visible').length > 0 ? $.trim($('#alipayAccount').val()) : $.trim($('#aliStatePanel span').text());
        var ur = $('#alipayAccount:visible').length > 0 ? $.trim($('#userRealInfo').val()) : "Panli代注册支付宝";

        if ($('.rrAmount:visible').length <= 0)
            return false;
        var amountstr = $.trim($('.rrAmount:visible').val());
        var amount = parseFloat(amountstr);
        var code = $('#alipayAccount:visible').length > 0 ? $.trim($('#rrvcode').val()) : "代充值";
        var password = $('#payPassword').val();
        if (aAcount.length <= 0) {
            $('#alipayAccount').next('p').addClass('red').text('输入需要代充值的支付宝账号或手机号码');
            return false;
        }
        var regm = new RegExp("^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$");
        var regn = new RegExp("^(\\+86)?\\d{11}$");
        if (!regm.test(aAcount) && !regn.test(aAcount)) {
            $('#alipayAccount').next('p').addClass('red').text('您输入的支付宝账户有误，请重新输入');
            return false;
        }
        if (ur.length <= 0) {
            $('#userRealInfo').next('p').addClass('red').text('输入需要代充值账号对应的实名信息');
            return false;
        }
        if (amount < 5) {
            $('.rrAmount:visible').next('p').addClass('red').text('每笔代充值金额需要大于5元喔！');
            return false;
        }
        if (!new RegExp("^\\d+(\.\\d{1,2})?$").test(amountstr)) {
            $('.rrAmount:visible').next('p').addClass('red').text('您输入的金额有误，请重新输入！');
            return false;
        }

        if (code.length <= 0) {
            $('#rrvcode').nextAll('p').addClass('red').text('输入图中的字符');
            return false;
        }
        if (password.length <= 0) {
            alert('请输入支付密码');
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/App_Services/wsSelfPurchase.asmx/RechargeApply",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"alipayAccount":"' + aAcount + '","userInfo":"' + ur + '","price":' + amount + ',"vcode":"' + code + '","password":"' + password + '"}',
            timeout: 15000,
            beforeSend: function () { $('#rrSubmitBtn').attr('disabled', 'disabled'); },
            complete: function () { $('#rrSubmitBtn').removeAttr('disabled'); },
            error: function () { alert('网络错误！请稍后重试'); },
            success: function (r) {
                if (r.d == 'Success') {
                    $('#rrMainPanel').html('<div class="succeed"><h2>恭喜您！成功提交了代充值申请！</h2><p>本次申请代充值<span>' + $('.rrAmount:visible').val() + '</span>元，我们将在1个工作日内进行审核，请耐心等待！</p><p>本次申请扣除<span>' + $('#rrsFee').text() + '</span>元手续费，消耗<span>' + $('#rrsPoint').text() + '</span>点积分！</p><ul><li><a href="/mypanli/ReplaceRecharge/Record.aspx">查看代充记录</a></li><li><a href="/">返回Panli首页</a></li></ul></div>');
                    //$('#rrMainPanel').html('<div class="succeed"><h2>恭喜您！成功提交了代充值申请！</h2><p>本次申请代充值<span>' + $('.rrAmount:visible').val() + '</span>元，我们将在1个工作日内进行审核，请耐心等待！</p><p>本次申请消耗<span>' + $('#rrsPoint').text() + '</span>点积分！</p><ul><li><a href="/mypanli/ReplaceRecharge/Record.aspx">查看代充记录</a></li><li><a href="/">返回Panli首页</a></li></ul></div>');
                    return;
                }
                if (r.d == 'PasswordError') {
                    alert('支付密码错误');
                    return;
                }
                if (r.d == 'BalanceLack') {
                    lock('对不起！您的帐户余额不足请立即<a href="/mypanli/Account/RmbAccount.aspx" target="new">充值</a>！');
                    return;
                }
                if (r.d == 'ScoreLack') {
                    lock('对不起！您的积分不足，无法提交代充值申请！');
                    return;
                }
                if (r.d == 'CodeWrong') {
                    $('#rrvcode').nextAll('p').addClass('red').text('您输入的验证码有误，请重新输入');
                    $('#rrApplyCode').click();
                    return;
                }
                if (r.d == 'Error') {
                    alert('系统错误，请稍后再试！');
                    return;
                }
            }
        });
        return false;
    });

    //计算手续费和积分
    $('.rrAmount').keyup(function (e) {
        this.value = this.value.replace(/[^\d\.]/g, '');
        var s = $.trim(this.value);
        var index = s.indexOf(".");
        var m = 0;
        if (s.length > 0 && /\d/.test(s)) {
            if (index > 0) {
                s = s.substring(0, s.length <= index + 3 ? s.length : index + 3);
            }
            m = parseFloat(s);
        }
        var fee = m * 0.05;
        //var fee = 0;

        $('#rrsAmount').text(m.toFixed(2));
        $('#rrsFee').text(fee.toFixed(2));
        $('#rrsTotal').text((parseFloat(m.toFixed(2)) + parseFloat(fee.toFixed(2))).toFixed(2));
        $('#rrsPoint').text(Math.floor(m));
        var userprice = parseFloat($('#userCurrentPrice').val());
        var userpoint = parseFloat($('#userCurrentPoint').val());
        if (m <= 0) {
            lock();
            return;
        }
        if (userprice < m + fee) {
            lock('对不起！您的帐户余额不足请立即<a href="/mypanli/Account/RmbAccount.aspx" target="new">充值</a>！');
            return;
        }
        if (userpoint < m) {
            lock('对不起！您的积分不足，无法提交代充值申请！');
            return;
        }
        unlock();
    });

    //代申请支付宝层显示方法
    $('#aliStatePanel .alirbtn').click(function () {
        Panli.Overlay.open();
        $('#applyAlipayPanel').show();
        return false;
    });

    //锁定按钮和解锁
    function lock(str) {
        $('#rrSubmitBtn').attr({ "class": "no", "disabled": "disabled" });
        if (!!str)
            $('#rrErrorInfo').html(str).show();
        else
            $('#rrErrorInfo').hide();
    }
    function unlock() {
        $('#rrSubmitBtn').attr("class", "").removeAttr('disabled');
        $('#rrErrorInfo').hide();
    }
});