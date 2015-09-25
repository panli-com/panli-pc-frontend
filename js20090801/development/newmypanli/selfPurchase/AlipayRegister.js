$(function() {
    //申请代注册支付宝
    $('#registerAliBtn').click(function() {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsSelfPurchase.asmx/RegisterAliPay",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"enableTaobao":' + ($('#enableTaobaoAccount')[0].checked ? 1 : 0) + '}',
            timeout: 10000,
            beforeSend: function() { $('#registerAliBtn').attr('disabled', 'disabled'); },
            complete: function() { $('#registerAliBtn').removeAttr('disabled'); },
            error: function() { alert('网络错误！请稍后重试'); },
            success: function(r) {
                if (r.d == 'success') {
                    $('#applyAlipayPanel').attr('class', 'zhuce_succeed').html('<h2>恭喜您！成功提交了代注册申请！</h2><p>我们将在 <span>1</span> 个工作日内为您完成代注册，请耐心等待！</p><p>注册成功后，我们将通过Panli短信、邮件通知您！</p><div class="fanhui"><a href="/">返回Panli首页</a></div>');
                    Panli.Overlay.close();
                    $('#confirmPanel').hide(); 
                    return false;
                }
                alert('申请失败，请稍后再试验');
                return false;
            }
        });
        return false;
    });
});