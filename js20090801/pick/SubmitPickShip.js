var PickShipSubmit = {
    init: function () {
        this.Coupon();
        this.Submit();

        var b = true;
        $('#jidaClick').click(function () {
            if (b) {
                $('.dizhi_info').slideDown("slow");
                $(this).text('关闭收货信息');
            } else {
                $('.dizhi_info').hide();
                $(this).text('展开收货信息');
            }
            b = !b;
            return false;
        });
    },
    ClickId: 0,
    CouponNum: {
        CouponAll: 0
    },
    Coupon: function () {
        var This = this,
            Add = $('#shiyong1'),
            Cancel = $('#shiyong2'),
            Coupon = $('#Coupon'),
            CouponOk = $('#Coupon .sytj a:eq(0)'),
            CouponClose = $('#Coupon .sytj a:eq(1)'),
            CouponNum = $('.js table td.lv');
        Add.find('a').click(function () {
            if (parseFloat($(this).prev().text().replace(/[^\d\.]/g, '')) <= 0) {
                alert('服务费已全免，无需使用优惠券');
                return false;
            }
            Coupon.show();
            return false;
        });
        CouponClose.click(function () {
            Coupon.hide();
            Coupon.find('li input:checked').removeAttr('checked');
            return false;
        });
        CouponOk.click(function () {
            var mon = Coupon.find('li input:checked'),
                mons = mon.attr('data-mon');
            if (mon.length == 0) { alert('请选择要使用的优惠券！'); return false; }
            var mo = parseFloat(CouponNum.prev().prev().find('span').text().replace(/[^\d\.]/g, ''));
            mo = mons > mo ? mo : mons;
            CouponNum.find('span').text(mo + '元');
            var Money = (parseFloat(This.CouponNum.CouponAll) - parseFloat(mo)).toFixed(2);
            if (Money < 0) Money = 0.00;
            CouponNum.next().find('b').text(Money);
            Cancel.find('span').text('￥' + mons);
            Add.hide();
            Cancel.show();
            Coupon.hide();
            mon.removeAttr('checked');
            This.ClickId = mon.val();
            return false;
        });
        Cancel.find('a').click(function () {
            Add.show();
            Cancel.hide();
            CouponNum.find('span').text('0.00 元');
            CouponNum.next().find('b').text(This.CouponNum.CouponAll);
            This.ClickId = 0;
            return false;
        });
    },
    Submit: function () {
        var This = this;
        $('.queren input').click(function () {
            if ($.trim($('#payPassword').val()).length == 0) { alert('请输入支付密码！'); $('#payPassword').focus(); return false; }
            $('#hidCoupon').val(This.ClickId);
            $('.ok p').show();
        })
    }

};

$(function () {
   
    var dom = $('.js table td.lv');
    PickShipSubmit.init();
    PickShipSubmit.CouponNum.CouponAll = dom.next().find('b').text().replace(/[^\d\.]/g, '');
});