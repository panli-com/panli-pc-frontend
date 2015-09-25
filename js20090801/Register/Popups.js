
var Popups = {
    URL: 'http://passport.panli.com',
    Show: function () {
        $('#PopupsOver').show();
        $('#Popups').show();
    },
    Init: function () {
        this.Method();
        $.ajax({
            type: "POST",
            url: Popups.URL + "/App_Services/UnionService.ashx?method=IsShowUrl",
            dataType: "jsonp",
            contentType: "application/json;utf-8",
            timeout: 50000,
            beforeSend: function () { },
            jsonp: "callback",
            jsonpCallback: "r",
            success: function (r) {
                r.Result != 'true' ? $('.present').remove() : $('.present').show(); //.favorable,
            }
        });
    },
    Prompt: {
        AreaCode: {
            Null: '请输入你的手机号'
        },
        Phone: {
            Null: '请输入你的手机号',
            Error: '手机号码错误',
            Repeat: '该手机号码已使用，请换用其他手机号码验证.'
        }
    },
    isCode: true,
    Code: function (boo) {
        var _this = this;
        var AreaCode = $.trim($('#AreaCode').val()),
            Phone = $.trim($('#Phone').val());
        Phone = Phone.replace(/^0+/, '');
        if (/[^\d]/.test(AreaCode) || /[^\d]/.test(Phone)) {
            $('.fTest:eq(0) .fTestE').addClass('fTestError').text(_this.Prompt.Phone.Error);
            return false;
        }
        if (!this.isCode) return false;
        this.isCode = false;


        $.ajax({
            type: "POST",
            url: Popups.URL + "/App_Services/UnionService.ashx?method=SendSms&countryCode=" + $.trim($('#AreaCode').val()) + "&number=" + Phone,
            dataType: "jsonp",
            contentType: "application/json;utf-8",
            timeout: 50000,
            beforeSend: function () { },
            jsonp: "callback",
            jsonpCallback: "r",
            error: function () { alert('网络超时！'); },
            complete: function () { _this.isCode = true; },
            success: function (r) {
                if (r.Result == 'success') {
                    if (!boo) {
                        _this.Switch(true);
                        $('#Popups .fTest:eq(1) b.fTextPhone').text($.trim($('#AreaCode').val()) + '-' + Phone);
                    }
                    $('.fTest:eq(1) .fSucceed').show();
                    _this.DataTime();
                } else if (r.Result != 'fail') {
                    $('.fTest:eq(0) .fTestE').addClass('fTestError').text(r.Result);
                    $('.fTest:eq(1) .fSucceed').hide();
                } else {
                    alert('号码错误，请重新输入您的号码！');
                };

            }
        });
    },
    DataTime: function () {
        var data = 60, _this = this, dataTime = '';
        var dataTime = setInterval(function () {
            data--;
            if (data < 0) {
                clearInterval(dataTime);
                $('.fTest:eq(1) .fSucceed').hide();
                $('.fTest:eq(1) .fSend').text('免费获取验证码');
                return false;
            };
            $('.fTest:eq(1) .fSend').text(data + ' 秒后重新发送');
        }, 1000);
    },
    Method: function () {
        var _this = this, PopupsDom = $('#Popups');
        var getCoupon1 = PopupsDom.find('.fTest:eq(0)');
        getCoupon1.find('.fSubmit').click(function () {
            var isPass = true;
            getCoupon1.find('input[type=text]').each(function (i, t) {
                if ($.trim(t.value) == '') {
                    isPass = false;
                    $(t).addClass('redborder');
                    getCoupon1.find('.fTestE').addClass('fTestError').text(_this.Prompt.Phone.Null);
                    return false;
                }
            });
            if (isPass) _this.Code();
        });
        getCoupon1.find('input[type=text]').focus(function () {
            getCoupon1.find('.fTestE').removeClass('fTestError').text('');
            $(this).removeClass('redborder');
        });
        $('#AreaCode').click(function () {
            $(this).next().show();
        }).next().find('a').click(function () {
            $('#AreaCode').val($(this).attr('href'));
            $(this).parent().hide();
            return false;
        });
        $('#Phone').keyup(function () {
            $(this).val(this.value.replace(/[^\d]/g, ''));
        })

        $('body').click(function () { $('.AreaSelect').hide(); });
        $('#AreaCode,.AreaSelect').click(function () { return false; })

        $('.fTest:eq(1) .fSend').click(function () {
            if ($(this).html() != '免费获取验证码') return false;
            _this.Code(true);
        });


        var getCoupon2 = PopupsDom.find('.fTest:eq(1)'),
            isgetCoupon2 = true;
        getCoupon2.find('.fSubmit').click(function () {
            var code = $.trim($('#Verification').val());
            if (code == '') {
                $('#Verification').addClass('redborder').parents('li').find('.fTishi').addClass('error').text('不能为空');
                return false;
            }
            if (code.length != 6) {
                $('#Verification').addClass('redborder').parents('li').find('.fTishi').addClass('error').text('请输入您收到的6位验证码');
                return false;
            }
            if (!isgetCoupon2) return false;
            isgetCoupon2 = false;
            $.ajax({
                type: "POST",
                url: Popups.URL + "/App_Services/UnionService.ashx?method=ValidateUserPhoneCode&code=" + $.trim($('#Verification').val()),
                dataType: "jsonp",
                contentType: "application/json;utf-8",
                timeout: 10000,
                jsonp: "callback",
                jsonpCallback: "r",
                beforeSend: function () { },
                error: function () { alert('Network Error！'); },
                complete: function () { isgetCoupon2 = true; },
                success: function (r) {
                    r.Result.toString() == 'true' ? function () {
                        _this.Switch(true);
                    } ()
                           : $('#Verification').addClass('redborder').parents('li').find('.fTishi').addClass('error').text('请输入您收到的6位验证码');
                }
            });

        });

        $('#Verification').focus(function () {
            $(this).removeClass('redborder').parents('li').find('.fTishi').removeClass('error').text('请输入您收到的6位验证码');
        });

        PopupsDom.find('.fclose').click(function () {
            PopupsDom.hide().find('input[type=text]').val('');
            $('#PopupsOver').hide();
            _this.Switch(0);
            return false;
        });


    },
    SwitchNum: 0,
    Switch: function (boo) {
        $('#Verification').focus();
        $('#Phone').focus();
        boo ? (this.SwitchNum++) : (this.SwitchNum--);
        if (typeof (boo) === 'number') this.SwitchNum = boo;
        $('#Popups .fTest').css('zIndex', 0).eq(this.SwitchNum).css('zIndex', 5);
    }
};
$(function () {
    Popups.Init();
});