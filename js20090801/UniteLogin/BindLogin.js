var register = {
    init: function () {
        this.method();
        $("input[name=textVerification]").keydown(function (e) {
            if (e.keyCode == 13) regSubmit();
        })
    },
    classified: {
        email: {
            dom: 'input[name=txtAccountName]',
            normal: '请输入您的用户名或邮箱'
        },
        password: {
            dom: 'input[name=txtPassword]',
            normal: '请输入您的登录密码'
        },
        repetition: {
            dom: 'input[name=textVerification]',
            normal: '请输入验证码'
        }
    },
    method: function () {
        var _this = this;
        $.each(_this.classified, function (i, t) {
            var dom = $(_this.classified[i].dom);
            dom.focus(function () {
                dom.addClass('on').removeClass('wrong').nextAll('p').removeClass('red').html('');
            });
            dom.blur(function () {
                dom.removeClass('on')
                if ($.trim(dom.val()).length <= 0) {
                    dom.addClass('wrong').nextAll('p').addClass('red').html(_this.classified[i].normal);
                    return false;
                }
                dom.nextAll('p').html('<img src="http://sf.panli.com/FrontEnd/images20090801/Register/gou.gif" />');
            });
        });
        $('.refer input').click(function () {
            return _this.submit();
        });
    },
    submit: function () {
        var _this = this,
             testBoo = true;
        if (!this.submitTest) {
            $.each(_this.classified, function (i, t) {
                if ($.trim($(_this.classified[i].dom).val()).length <= 0) {
                    testBoo = false;
                    $(_this.classified[i].dom).addClass('wrong').nextAll('p').addClass('red').html(_this.classified[i].normal);
                    $('#federatedBindCheckCode').click();
                };
            });
        };
        return testBoo;
    }

};

$(function () { register.init(); })