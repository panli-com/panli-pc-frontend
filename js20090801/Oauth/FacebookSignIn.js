var FaceBookSignIn = {
    //设置控制面板的元素
    PanelElements: function () {
        $('body').data('Panel', {
            'SimpleRegsiterFrom': {
                '_this': $('#SimpleRegisterForm'),
                'regEmail': {
                    '_this': $("input[name='regEmail']"),
                    'tips': $("input[name='regEmail']").next("div.info_tips").children("p:first-child"),
                    'succeed': $("input[name='regEmail']").parent().next(".wid3").children("span.succeed")
                },
                'regName': {
                    '_this': $("input[name='regName']"),
                    'tips': $("input[name='regName']").next("div.info_tips").children("p:first-child"),
                    'succeed': $("input[name='regName']").parent().next(".wid3").children("span.succeed")
                },
                'regPassword': {
                    '_this': $("input[name='regPassword']"),
                    'tips': $("input[name='regPassword']").next("div.info_tips").children("p:first-child"),
                    'succeed': $("input[name='regPassword']").parent().next(".wid3").children("span.succeed")
                },
                'regPasswordConfirm': {
                    '_this': $("input[name='regPasswordConfirm']"),
                    'tips': $("input[name='regPasswordConfirm']").next("div.info_tips").children("p:first-child"),
                    'succeed': $("input[name='regPasswordConfirm']").parent().next(".wid3").children("span.succeed")
                },
                'submitBtn': $("#regBtn")
            },
            'SyncAccountForm': {
                '_this': $('#SyncAccountForm'),
                'accountName': {
                    '_this': $("input[name='accountName']"),
                    'tips': $("input[name='accountName']").next("div.info_tips").children("p:first-child"),
                    'succeed': $("input[name='accountName']").parent().next(".wid4").children("span.succeed")
                },
                'accountPassword': {
                    '_this': $("input[name='accountPassword']"),
                    'tips': $("input[name='accountPassword']").next("div.info_tips").children("p:first-child"),
                    'succeed': $("input[name='accountPassword']").parent().next(".wid4").children("span.succeed")
                },
                'fbLoginCode': {
                    '_this': $("input[name='fbLoginCode']"),
                    'tips': $("input[name='fbLoginCode']").siblings("div.info_tips").children("p:first-child"),
                    'succeed': $("input[name='fbLoginCode']").parent().next(".wid4").children("span.succeed")
                },
                'submitBtn': $("#syncBtn")
            }
        });
    },
    //获取面板元素
    GetPanel: function () {
        return $("body").data('Panel');
    },
    SimpleRegsiterVali: {
        regEmail: {
            formatTip: "Email格式不正确",
            existTip: "此邮箱已存在，建议进行绑定操作！",
            regex: "^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$",
            fun: function (dom, icon, tip) {
                var _this = this;
                var regex = new RegExp(this.regex);
                var emailval = $.trim(dom.val());
                if (!regex.test(emailval)) {
                    tip.addClass("red").html(_this.formatTip).show();
                    icon.hide();
                    FaceBookSignIn.ValidationViewStates.Register.regEmail = false;
                } else {
                    $.ajax({
                        type: "POST",
                        url: "/App_Services/wsMember.asmx/CheckUserByEmail",
                        dataType: "json",
                        contentType: "application/json;utf-8",
                        data: "{email:'" + emailval.toLowerCase() + "'}",
                        timeout: 10000,
                        beforeSend: function () { },
                        complete: function () { },
                        error: function () {
                            tip.addClass("red").html(_this.formatTip).show();
                            icon.hide();
                            FaceBookSignIn.ValidationViewStates.Register.regEmail = false;
                        },
                        success: function (res) {
                            if (!res.d) {
                                tip.hide();
                                icon.show();
                                FaceBookSignIn.ValidationViewStates.Register.regEmail = true;
                            }
                            else {
                                tip.addClass("red").show().html(_this.existTip);
                                icon.hide();
                                FaceBookSignIn.ValidationViewStates.Register.regEmail = false;
                            }
                        }
                    });
                }
            }
        },
        regName: {
            formatTip: "用户名必须是大小写英文字母、中文、数字组成，长度2-8个汉字或4-16个字符！",
            lengthTip: "用户名长度必须是2-8个汉字或4-16个字符！",
            existTip: "此用户名已存在，建议进行绑定操作！",
            regex: "^([\\u4e00-\\u9fa5]|\\w)*$",
            fun: function (dom, icon, tip) {
                var _this = this;
                var nickname = $.trim(dom.val());
                var regtest = new RegExp("^([\\u4e00-\\u9fa5]|\\w)*$");
                var regunderline = new RegExp("_");
                if (regtest.test(nickname) && regunderline.exec(nickname) == null) {
                    var regEng = new RegExp("\\w", "g");
                    var regCn = new RegExp("[\\u4e00-\\u9fa5]", "g");
                    var nicknamelength = 0;
                    var res;
                    while ((res = regEng.exec(nickname)) != null)
                        nicknamelength++;
                    while ((res = regCn.exec(nickname)) != null)
                        nicknamelength += 2;
                    if (nicknamelength <= 16 && nicknamelength >= 4) {
                        $.ajax({
                            type: "POST",
                            url: "/App_Services/wsMember.asmx/CheckUserByName",
                            dataType: "json",
                            contentType: "application/json;utf-8",
                            data: "{username:'" + nickname.toLowerCase() + "'}",
                            timeout: 10000,
                            beforeSend: function () { },
                            complete: function () { },
                            error: function () {
                                nicknamechecked = true;
                            },
                            success: function (res) {
                                if (!res.d) {
                                    tip.hide();
                                    icon.show();
                                    FaceBookSignIn.ValidationViewStates.Register.regName = true;
                                }
                                else {
                                    tip.addClass("red").show().html(_this.existTip);
                                    icon.hide();
                                    FaceBookSignIn.ValidationViewStates.Register.regName = false;
                                }
                            }
                        });
                    }
                    else {
                        tip.addClass("red").show().html(_this.lengthTip);
                        icon.hide();
                        FaceBookSignIn.ValidationViewStates.Register.regName = false;
                    }
                }
                else {
                    tip.addClass("red").show().html(_this.formatTip);
                    icon.hide();
                    FaceBookSignIn.ValidationViewStates.Register.regName = false;
                }
            }
        },
        regPassword: {
            formatTip: "密码必须是大小写英文字母、数字组成，长度为6-20个字符！",
            regex: "/\s/",
            fun: function (dom, icon, tip, cfm) {
                var _this = this;
                var regex = new RegExp(_this.regex);
                var passwordVal = $.trim(dom.val());
                if (regex.test(passwordVal) || passwordVal.length < 6 || passwordVal.length > 20) {
                    tip.addClass("red").html(_this.formatTip).show();
                    icon.hide();
                    FaceBookSignIn.ValidationViewStates.Register.regPassword = false;
                } else {
                    tip.hide();
                    icon.show();
                    FaceBookSignIn.ValidationViewStates.Register.regPassword = true;
                    var comparepassword = $.trim(cfm.val());
                    if (comparepassword.length > 0) {
                        cfm.triggerHandler("blur");
                    }
                }
            }
        },
        regPasswordConfirm: {
            formatTip: "密码必须是大小写英文字母、数字组成，长度为6-20个字符！",
            confirmTip: "两次密码输入不一致，请重新输入！",
            regex: "/\s/",
            fun: function (dom, icon, tip, cfm) {
                var _this = this;
                var regex = new RegExp(_this.regex);
                var passwordVal = $.trim(dom.val());
                if (regex.test(passwordVal) || passwordVal.length < 6 || passwordVal.length > 20) {
                    tip.addClass("red").html(_this.formatTip).show();
                    icon.hide();
                    FaceBookSignIn.ValidationViewStates.Register.regPasswordConfirm = false;
                } else {
                    if ($.trim(cfm.val()) == passwordVal) {
                        tip.hide();
                        icon.show();
                        FaceBookSignIn.ValidationViewStates.Register.regPasswordConfirm = true;
                    }
                    else {
                        tip.addClass("red").html(_this.confirmTip).show();
                        icon.hide();
                        FaceBookSignIn.ValidationViewStates.Register.regPasswordConfirm = false;
                    }
                }
            }
        }
    },
    //简单注册表单提交
    SimpleRegsiterFromSubmit: function () {

        var flagCount = 0;
        var _RegsiterFrom = FaceBookSignIn.GetPanel()['SimpleRegsiterFrom'];
        $.each(FaceBookSignIn.ValidationViewStates['Register'], function (i, n) {
            if (!n) {
                _RegsiterFrom[i]['_this'].trigger("blur");
            }
        });
        $.each(FaceBookSignIn.ValidationViewStates['Register'], function (i, n) {
            if (n) {
                flagCount++;
            }
        });
        if (flagCount == 4) {
            _RegsiterFrom['_this'].submit();
        }
    },
    //注册表单提交状态视图
    ValidationViewStates: {
        Register: {
            regEmail: false,
            regName: false,
            regPassword: false,
            regPasswordConfirm: false
        },
        SyncFaceBook:
        {
            accountName: false,
            accountPassword: false,
            fbLoginCode: false
        }
    },
    SyncFaceBookVail: {
        accountName: {
            formatTip: "请输入您的邮箱/会员名",
            regex1: "^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$",
            regex2: "^([\\u4e00-\\u9fa5]|\\w)*$",
            fun: function (dom, icon, tip) {
                var _this = this;
                var emailornameval = $.trim(dom.val());
                if (emailornameval.length > 0) {
                    tip.hide();
                    FaceBookSignIn.ValidationViewStates.SyncFaceBook.accountName = true;
                }
                else {
                    tip.addClass("red").html(_this.formatTip).show();
                    FaceBookSignIn.ValidationViewStates.SyncFaceBook.accountName = false;
                }
            }
        },
        accountPassword: {
            formatTip: "请输入登录密码",
            regex: "/\s/",
            fun: function (dom, icon, tip, cfm) {
                var _this = this;
                var passwordVal = $.trim(dom.val());
                if (passwordVal.length > 0) {
                    tip.hide();
                    FaceBookSignIn.ValidationViewStates.SyncFaceBook.accountPassword = true;
                } else {
                    tip.addClass("red").html(_this.formatTip).show();
                    FaceBookSignIn.ValidationViewStates.SyncFaceBook.accountPassword = false;
                }
            }
        },
        fbLoginCode: {
            formatTip: "验证码格式错误！",
            regex: "/\s/",
            fun: function (dom, icon, tip) {
                var _this = this;
                var regex = new RegExp(_this.regex);
                var checkCode = $.trim(dom.val());
                if (regex.test(checkCode) || checkCode.length != 4) {
                    tip.addClass("red").html(_this.formatTip).show();
                    FaceBookSignIn.ValidationViewStates.SyncFaceBook.fbLoginCode = false;
                } else {

                    $.ajax({
                        type: "POST",
                        url: "/ValidateCode.ashx?s=FaceBookSyncLoginCode&code=" + checkCode,
                        dataType: "text",
                        timeout: 10000,
                        error: function (a, b, c) { FaceBookSignIn.ValidationViewStates.SyncFaceBook.fbLoginCode = false; },
                        success: function (msg) {
                            if (msg == '0') {
                                tip.addClass("red").html(_this.formatTip).show();
                                FaceBookSignIn.ValidationViewStates.SyncFaceBook.fbLoginCode = false;
                            }
                            else {
                                tip.hide();
                                FaceBookSignIn.ValidationViewStates.SyncFaceBook.fbLoginCode = true;
                            }
                        }
                    });
                }
            }
        }
    },
    //同步FaceBook表单提交
    SyncFaceBookFromSubmit: function () {
        var flagCount = 0;
        var _SyncFaceBookFrom = FaceBookSignIn.GetPanel()['SyncAccountForm'];
        $.each(FaceBookSignIn.ValidationViewStates['SyncFaceBook'], function (i, n) {
            if (!n) {
                _SyncFaceBookFrom[i]['_this'].triggerHandler("blur");
            }
        });
        $.each(FaceBookSignIn.ValidationViewStates['SyncFaceBook'], function (i, n) {
            if (n) {
                flagCount++;
            }
        });
        if (flagCount == 3) {
            _SyncFaceBookFrom['_this'].submit();
        }
    },
    //初始化
    Init: function () {
        FaceBookSignIn.PanelElements();
        var curthis = this;
        var _this = this.GetPanel();
        var _RegsiterFrom = _this['SimpleRegsiterFrom'];
        var _SyncAccountForm = _this['SyncAccountForm'];
        $.each(_RegsiterFrom, function (i, n) {
            if (i == "_this")
                return;
            if (i == "submitBtn") {
                n.bind("click", curthis.SimpleRegsiterFromSubmit);
            }
            else if (i == "regPasswordConfirm") {
                n._this.bind("blur", function () {
                    curthis.SimpleRegsiterVali.regPasswordConfirm.fun($(this), _RegsiterFrom[i].succeed, _RegsiterFrom[i].tips, _RegsiterFrom['regPassword']._this);
                }).bind("keydown", function (event) {
                    if (event.keyCode == 13) {
                        curthis.SimpleRegsiterFromSubmit();
                    }
                });
            }
            else if (i == "regPassword") {
                n._this.bind("blur", function () {
                    curthis.SimpleRegsiterVali[i].fun($(this), _RegsiterFrom[i].succeed, _RegsiterFrom[i].tips, _RegsiterFrom['regPasswordConfirm']._this);
                });
            } else {
                n._this.bind("blur", function () {
                    curthis.SimpleRegsiterVali[i].fun($(this), _RegsiterFrom[i].succeed, _RegsiterFrom[i].tips);
                });
            }
        });
        $.each(_SyncAccountForm, function (i, n) {
            if (i == "_this")
                return;
            if (i == "submitBtn") {
                n.bind("click", curthis.SyncFaceBookFromSubmit);
            }
            else if (i == "fbLoginCode") {
                n._this.bind("blur", function () {
                    curthis.SyncFaceBookVail[i].fun($(this), _SyncAccountForm[i].succeed, _SyncAccountForm[i].tips);
                }).bind("keydown", function (event) {
                    if (event.keyCode == 13) {
                        curthis.SyncFaceBookFromSubmit();
                    }
                });
            }
            else {
                n._this.bind("blur", function () {
                    curthis.SyncFaceBookVail[i].fun($(this), _SyncAccountForm[i].succeed, _SyncAccountForm[i].tips);
                });
            }
        });
    }
};
$(document).ready(function () {
    FaceBookSignIn.Init();
});