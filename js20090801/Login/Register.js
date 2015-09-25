

function register() {
    var _this = this;
    var nameVal=$.trim($('#errorInfo').val());
    if (nameVal.length != 0) {
        var namearr = nameVal.split(':');
        $('[data-register-name=' + namearr[0] + ']')
                           .addClass('error')
                           .nextAll('.tips')
                           .html('<i class="erroricn"></i>' + namearr[1]);
    }

    $('[data-register-name]').on({ 'blur': function () {
        _this.blur($(this));
    }, 'keyup': function (e) {
        if (e.keyCode == 13)
            _this.submit();
        return false;
    }
    });

    var $encrypt = $('#encrypt'), //显示密码隐藏密码
                            $noencrypt = $('#noencrypt');
    var isshow = false;
    $('.pwddisp').on('click', function () {
        if (!isshow) {
            $encrypt.hide();
            $(this).text('隐藏');
            $noencrypt.show().val($encrypt.val()).focus();
        } else {
            $noencrypt.hide();
            $(this).text('显示');
            $encrypt.show().val($noencrypt.val()).focus();
        }
        isshow = !isshow;
    });

    $noencrypt.on({ 'blur': function () {//密码明文失去焦点触发  密文的失去焦点事件
        $encrypt.val($noencrypt.val());
        _this.blur($encrypt);
    }, 'keyup': function (e) {
        if (e.keyCode == 13) {
            $encrypt.val($noencrypt.val());
            _this.submit();
            return false;
        }
    }
    });

    $('#r_checkbox').click(function () {//我已阅读并同意
        var ischeck = $(this).hasClass('checked');
        $(this)[ischeck ? 'removeClass' : 'addClass']('checked');
        return false;
    });

    $('.immedilgre').click(function () { return _this.submit(); })
}
register.prototype = {
    save: {},
    tipClass: {
        error: '<i class="erroricn"></i>',
        success: '<i class="erroricn righticn"></i>'
    },
    tip: function (type, issub) {//提示信息的显示与隐藏
        var save = this.save,
                                    datum = this.getName(save.name),
                                    isType = type === true;
        datum.bool = isType;
        save.node[isType ? 'removeClass' : 'addClass']('error')
                                    .nextAll('.tips')
                                    .html((isType ? '' : this.tipClass['error'] + datum[type]));

        if (isType && typeof issub == 'number')
            this.submit(++issub);
        return false;
    },
    blur: function ($this, issub) {//失去焦点

        if (typeof $this == 'string') {
            $this = $('[data-register-name=' + $this + ']');
        }
        var _this = this;
        var val = $.trim($this.val());
        var name = $.trim($this.attr('data-register-name'));
        var obj = _this.getName(name);

        _this.save = { node: $this, name: name };

        if (obj && obj.dataVal != val) {
            obj.dataVal = val;
            var testVal = val;
            if (name == 'name') {
                testVal = val.replace(/[\u4e00-\u9fa5]/g, 'aa');
            }
            if (!obj.rel.test(testVal)) {
                _this.tip('format');
                typeof issub == 'number' ? $this.focus() : '';
                return false;
            }
            if (obj.ajax) {
                $.ajax({
                    type: "POST",
                    url: obj.ajax.url,
                    dataType: "json",
                    contentType: "application/json;utf-8",
                    data: '{"' + obj.ajax.name + '" :"' + val + '"}',
                    timeout: 10000,
                    success: function (res) {
                        _this.tip(res.d ? 'error' : true, issub);
                        return false;
                    }
                });
            } else {
                _this.tip(true, issub);
                obj.dispose && obj.dispose();
            }

        }
    },
    getName: function (name) {//根据name  获取datum相应的内容
        var namelist = this.name;
        for (var i = 0, len = namelist.length; i < len; i++) {
            if (namelist[i] == name)
                return this.datum[i];
        }
        return false;
    },
    name: ['name', 'email', 'password', 'verification'],
    datum: [

                                {
                                    mr: "用户名也可以作为您登录Panli的帐号，大家以后就这样称呼您",
                                    focus: "昵称可由大小写英文字母、中文、数字组成，长度2-8个汉字或4-16个字符",
                                    error: "昵称已存在",
                                    format: "用户名长度必须是2-8个汉字或4-16个字符",
                                    bool: false,
                                    rel: /^[\u4e00-\u9fa5\w]{4,16}$/,
                                    ajax: { url: "/App_Services/wsMember.asmx/CheckUserByName", name: "username" }
                                },
                                {
                                    mr: "此邮箱将作为您登录panli的帐号，并将用来接收验证邮件",
                                    error: "Email地址已存在",
                                    format: "Email格式不正确",
                                    bool: false,
                                    rel: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                                    ajax: { url: "/App_Services/wsMember.asmx/CheckUserByEmail", name: "email" }
                                },
                                {
                                    mr: "请输入您的帐号密码",
                                    focus: "长度6-20个字符",
                                    format: "密码长度必须是6-20个字符",
                                    bool: false,
                                    rel: /^.{6,20}$/
                                },

                                {
                                    mr: "请填写验证码",
                                    error: "验证码错误",
                                    format: "验证码错误",
                                    rel: /^\w{4}$/,
                                    bool: false
                                }

                            ],
    submit: function (i) {//submit执行
        i = i ? i : 0;
        if (this.name[i]) {//循环验证
            this.datum[i].bool ? this.submit(++i) : this.blur(this.name[i], i);
            return false;
        }
        if (!$('#r_checkbox').hasClass('checked')) {
            alert('请阅读Panli注册协议');
            return false;
        }
        $('form').submit();
    }
}
new register();