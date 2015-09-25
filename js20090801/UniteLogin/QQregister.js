var register = {
    init: function () {
        this.method();
        $(this.classified.repetition.dom).keydown(function (e) {
            if (e.keyCode == 13) {
                $('.refer input').click();
                return false;
            }
        })
    },
    classified: {
        name: {
            dom: 'input[name=txtUserName]',
            url: ['/App_Services/wsMember.asmx/CheckUserByName', 'username'],
            normal: '用户名也可以作为您登录Panli的帐号，大家以后就这样称呼您',
            exist: '该用户名已存在，试试别的名字吧',
            isEmpty: '请输入Email地址',
            format: '用户名长度必须是2-8个汉字或4-16个字符',
            error: '用户名必须是大小写英文字母、中文、数字组成，长度2-8个汉字或4-16个字符',
            formatfun: function (str) {
                var regCn = /[\u4e00-\u9fa5]/g;
                var regtest = /^([\u4e00-\u9fa5]|\w)*$/;
                if (!regtest.test(str) || regtest.test('-')) return this.error;
                var len = str.replace(regCn, '');
                len = str.length * 2 - len.length;
                if (!(len >= 4 && len <= 16)) return this.format;
                return false;
            }
        },
        email: {
            dom: 'input[name=txtUserEmail]',
            url: ['/App_Services/wsMember.asmx/CheckUserByEmail', 'email'],
            normal: '此邮箱将作为您登录panli的帐号，并将用来接收验证邮件',
            exist: '您已是Panli会员,建议即刻绑定账户',
            isEmpty: '请输入您的常用邮箱，以便接受重要信息',
            format: 'Email格式不正确',
            formatfun: function (str) {
                var reg = new RegExp("^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$");
                if (!reg.test(str)) return this.format;
                return false;
            }
        },
        password: {
            dom: 'input[name=txtPassword]',
            normal: '请设置您在Panli的登录密码，注意大小写',
            isEmpty: '请输入您的帐号密码',
            format: '密码必须是大小写英文字母、数字组成、长度为6-20个字符',
            formatfun: function (str) {
                var reg = /^\w{6,20}$/;
                if (!reg.test(str)) return this.format;
                var reg = $.trim($(register.classified.repetition.dom).val());
                if (reg == str)
                    register.formatOk($(register.classified.repetition.dom), 'repetition');
                return false;
            }
        },
        repetition: {
            dom: 'input[name=txtConfirmPassword]',
            normal: '请重复输入您的登录密码',
            isEmpty: '请再次输入您的帐号密码',
            error: '两次密码输入不一致，请重新输入',
            format: '密码必须是大小写英文字母、数字组成、长度为6-20个字符',
            formatfun: function (str) {
                var reg = $.trim($(register.classified.password.dom).val()),
                    rel = /^\w{6,20}$/;
                if (reg != str) return this.error;
                if (!rel.test(str)) return this.format;
                return false;
            }
        }
    },
    formatOk: function (_this, i, fun) {
        $(_this).removeClass('wrong').nextAll('p').removeClass('red').html('<img src="http://sf.panli.com/FrontEnd/images20090801/Register/gou.gif">');
        this.classified[i].testBoo = true;
        typeof (fun) == 'function' ? fun() : '';
        return false;
    },
    formatError: function (_this, str, i) {
        $(_this).addClass('wrong').nextAll('p').addClass('red').html(str);
        this.classified[i].testBoo = false;
        return false;
    },
    formatBlur: function (i, dom) {
        var _this = this;
        dom.removeClass('on').nextAll('p').removeClass('prompt');
        if ($.trim(dom.val()).length <= 0) {//判断是否为空
            _this.formatError(dom, _this.classified[i].isEmpty, i);
            return false;
        };
        var format = _this.classified[i].formatfun($.trim(dom.val()));
        if (format) {
            _this.formatError(dom, format, i);
            return false;
        };
        var fun = typeof (arguments[2]) == 'function' ? arguments[2] : function () { };
        _this.classified[i].url ? _this.ajax(i, dom, function () { _this.formatOk(dom, i, fun); }) : _this.formatOk(dom, i, fun);
    },
    method: function () {
        var _this = this;
        $.each(_this.classified, function (i, t) {
            var dom = $(_this.classified[i].dom);
            dom.focus(function () {
                dom.addClass('on').removeClass('wrong').nextAll('p').addClass('prompt').removeClass('red').html(_this.classified[i].normal);
            });
            dom.blur(function () {
                _this.formatBlur(i, dom);
            });
        });
        $('.refer input').click(function () {
            return _this.submit();
        });
        $(_this.classified.email.dom).keyup(function () {
            keyups(this);
        }).focus(function () { keyups(this);  }).blur(function () {var ths = this; setTimeout(function () { $(ths).nextAll('.channel_lx').hide(); }, 300); });
        function keyups(th) {
            var val = $(th).val().split('@');
            $(th).nextAll('.channel_lx').find('a').each(function (i, t) {
                $(t).find('b').text(val[0]);
                if (!val[1]) val[1] = '';
                $(t).attr('data-email').indexOf(val[1]) == 0 ? $(t).show() : $(t).hide();
            });
            $(th).nextAll('.channel_lx').show();
        };
        $('.channel_lx').find('a').mouseover(function () {
            $(this).addClass('channel_on').siblings('.channel_on').removeClass('channel_on');
        }).click(function () {
            $(_this.classified.email.dom).val($(this).text());
            $(_this.classified.email.dom).focus();
        });
    },
    ajax: function (i, dom, fun) {
        var _this = this;
        $.ajax({
            type: "POST",
            url: _this.classified[i].url[0],
            dataType: "text",
            contentType: "application/json;utf-8",
            data: "{" + _this.classified[i].url[1] + ":'" + $.trim($(dom).val()) + "'}",
            timeout: 20000,
            error: function () { },
            success: function (data) {
                eval("(" + data + ")")["d"] ? _this.formatError(dom, _this.classified[i].exist, i) : fun();
            }
        });
    },
    submitFun: function () {
        var boo = true, _this = this;
        var d = register.classified;
        $.each(register.classified, function (i, t) {
            if (!register.classified[i].testBoo) {
                boo = false;
                return false;
            };
        });
        if (boo) {
            this.submitTest = true;
            $('.refer input').click();
        }
    },
    submitTest: false,
    submit: function () {
        var _this = this,
             testBoo = true;
        if (!this.submitTest) {
            $.each(_this.classified, function (i, t) {
                if (!_this.classified[i].testBoo) {
                    testBoo = false;
                    _this.formatBlur(i, $(_this.classified[i].dom), _this.submitFun);
                };
            });
        };
        return testBoo;
    }

};

$(function () { register.init();})
