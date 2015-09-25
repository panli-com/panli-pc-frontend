var $username = $('.usernametxt'),
                 $password = $('.pwdtxt'),
                 $remember = $('.remember'),
                 $errorTip = $('.locktip'),
                 $submit = $('.immedilgre');
function errorTip(name) {
    if ($errorTip.length > 0) {
        $errorTip.show().find('p').html(name);
    } else {
        $('.rightcenter .lg_box').append($('<div class="locktip"><p>' + name + '</p></div>'));
        $errorTip = $('.locktip');
    }
}



$submit.on('click', function () {
    var usernameVal = $.trim($username.val()),
        passwordVal = $.trim($password.val());

    if (usernameVal.length == 0) {
        errorTip('请输入邮箱、用户名');
        $username.focus();
        return false;
    }
    if (passwordVal.length == 0) {
        errorTip('请输入密码');
        $password.focus();
        return false;
    }

    var $verification = $('.safetxt');
    if ($verification.length > 0) {
        var verificationVal = $.trim($verification.val());
        if (verificationVal.length == 0) {
            errorTip('请输入验证码');
            $verification.focus();
            return false;
        }
    }
    $("form")[0].submit();
});

var $encrypt = $('#encrypts'), //显示密码隐藏密码
    $noencrypt = $('#noencrypts');
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

$('.lg_box input').on({ 'keyup': function (e) {
    if (e.keyCode == 13)
        $submit.click();
   return false;
}
});

$noencrypt.on('blur', function () {//密码明文失去焦点触发  密文的失去焦点事件
    $encrypt.val($noencrypt.val());
}).on('keyup', function (e) {
    if (e.keyCode == 13) {
        $encrypt.val($noencrypt.val())
        $submit.click();
        return false;
    }
});



$('#r_checkbox').click(function () {//我已阅读并同意
    var ischeck = $(this).hasClass('remembered');
    $('#isremembered').val(ischeck ? '0' : 1);
    $(this)[ischeck ? 'removeClass' : 'addClass']('remembered');
    return false;
});

var isCheck = false;
$('.usernametxt').blur(function () {
    var logName = $.trim($('.usernametxt').val());
    if (logName != '' && !isCheck && $('#loginCheckCode').length <= 0) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsMember.asmx/CheckUserCookie",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"nickname":"' + logName + '"}',
            timeout: 5000,
            beforeSend: function () {
                isCheck = true;
            },
            complete: function () {
                isCheck = false;
            },
            error: function () {
                this.success({d:0});
            },
            success: function (r) {
                if (r.d != 1) {
                    $('.lg_box .field:eq(1)').after('<div class="field"><input type="text" class="safetxt" placeholder="验证码" name="loginCode" maxlength="4" /><a href="javascript:;"><img id="loginCheckCode" src="/ValidateCode.ashx?s=loginCode&amp;w=160&amp;h=40&amp;t=1886823108" title="点击图片刷新" alt="验证码" style="vertical-align:middle;cursor:pointer;" onclick="this.src=\'\/ValidateCode.ashx?s=loginCode&amp;w=160&amp;h=40&amp;t=\'+Math.random();" border="0"></a></div>');
                    $('.lg_box .field:eq(2)').on({ 'keyup': function (e) {
                           if (e.keyCode == 13)
                                $submit.click();
                             }
                    });
                }
            }
        });
    }

});