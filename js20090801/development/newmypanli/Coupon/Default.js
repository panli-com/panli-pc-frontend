$(function() {
    //用户优惠券列表，d是总数，是当前页列表
    var couponList = { d: 0, l: [] };
    //优惠券列表表格对象
    var listHtml = $("#userCouponList");
    //构造列表页面方法
    var buildlist = function(i, jq) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsCouponManage.asmx/GetUserCoupons",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"pages":' + i + '}',
            timeout: 15000,
            beforeSend: function() { listHtml.hide(); $("#loading").show(); },
            error: function() { },
            success: function(r) {

                var temp = eval("(" + r.d + ")");
                //如果列表项总数发生变化重构分页器
                if (couponList.n != temp.n) {
                    jq.AjaxPager({
                        sum_items: temp.n,
                        current_page: i,
                        items_per_page: 10,
                        callback: buildlist
                    });
                }
                //构造列表
                couponList = temp;
                //用户没有优惠券
                if (couponList.n <= 0) {
                    $("#userCouponListPanel").before('<div class="biao mei">您目前没有可以使用的电子优惠券，别灰心。<br /><a href="/Help/Detail.aspx?hid=62" target="_blank">如何获得电子优惠券&gt;&gt;</a></div>').remove();
                    return;
                }
                if (couponList.l.length > 0) {
                    var t = $("#userCouponList");
                    t.empty();
                    $.each(couponList.l, function(index, item) {
                        t.append('<tr><td class="w1">' + item.d + '</td><td class="w2">' + item.n + '</td><td class="w3">' + item.m + '</td><td class="w4">' + item.t + '</td><td class="w5">' + (item.s == '未使用' ? '<span>' + item.s + '</span>' : item.s) + '</td></tr>');
                    });
                    $("#loading").hide();
                    t.show();
                    $('tr:odd', t).addClass('hui');
                }
            }
        });
    }
    buildlist(1, $("#ajaxPager"));
});  