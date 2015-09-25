$(function () {
    $('#PayFeight').attr("checked", false);
    var pic = parseFloat($('#PayFeight').attr('rel')),
        pic1 = parseFloat($('#Balance').text().replace(/[^\d\.]/g, '')),
        pic2 = parseFloat($('#Totalneed').text().replace(/[^\d\.]/g, ''));
    $('#PayFeight').click(function () {
        $('#Totalneed').text($(this).attr('checked') != 'checked' ? '￥' + pic2.toFixed(2) : '￥' + (pic2 + pic).toFixed(2));
    });
    $('.am_payment input').focus(function () { $(this).removeClass('a_red'); })

    $('#submitBtn').click(function () {
        pics = $(this).attr('checked') == 'checked' ? pic2 + pic : pic2;
        if (pics > pic1) {
            alert('您的账户余额不足请充值！');
            return false;
        };
        if (!$('.am_payment input').val()) {
            $('.am_payment input').addClass('a_red');
            alert('请填写支付密码！');
            return false;
        }
    });
})