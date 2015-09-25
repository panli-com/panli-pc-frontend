$(function () {
    function typelist(str) {
        var list = {
            'eventTerminal': {
                ALL: '不限',
                APP: '手机APP',
                PAD: 'iPad',
                PC: '网站'
            },
            'eventNode': {
                ALL: function () { return this.CART + '<br />' + this.APPBUY + '<br />' + this.SHARE },
                CART: '<a href="http://www.panli.com/mypanli/ShoppingCart.aspx">购物车</a>',
                SHARE: '<a href="http://www.panli.com/Piece/">拼单</a>',
                APPBUY: '<a href="javascript:;" class="immedia_use">立即购买<span class="two_dimension"><span>只能在移动端使用哦！</span><i></i><span>扫一扫<br />把Panli装进手机<br />体验立即购买哦!</span></span></a>'
            }

        }
        var newlist = {};
        str.replace(/(eventNode|eventTerminal)\:([\w\|]+)/g, function (str, str1, str2) {
            var _this = list[str1],
                        newString = '';
            str2.replace(/[a-zA-Z]+/g, function (newstr) {
                var newStr = _this[newstr.toUpperCase()];
                newString += (newString == '' ? '' : '<br/>') + (typeof newStr == 'function' ? newStr.call(_this) : newStr);
            });
            newlist[str1] = newString;
            return;
        });
        return newlist;
    }

    var type = 1;
    function getUserCash(page) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsCouponManage.asmx/GetUserCashCouponListByPager",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"type":"' + type + '","pageIndex":"' + page + '","pageSize":8}',
            timeout: 15000,
            beforeSend: function () { $('#tablelist').hide(); $("#loading").show(); },
            complete: function () { $('#tablelist').show(); $("#loading").hide(); },
            error: function () { alert('网络错误,加载失败！') },
            success: function (r) {
                var list = r.d.list;
                $('.totals').text(r.d.pageCount);
                if (list && list.length > 0) {
                    $('.biaonot').hide();
                    $('.biaohave').show();
                    var html = '';
                    for (var i = 0, len = list.length; i < len; i++) {
                        var status = list[i].CouponStatus,
                                    statusClass = '',
                                    statusName = '';
                        switch (status) {
                            case '过期':
                                statusClass = 'guoqi_hui';
                                break;
                            case '已用':
                                statusClass = 'used_hui';
                                break;
                        };

                        var typeStr = new typelist(list[i].Strategies);
                        html += '<tr class="' + statusClass + '"><td class="w1" style="line-height: 20px;">' + list[i].CouponCode + '</td><td class="w3">' + (list[i].Conditions > 0 ? '满' + list[i].Conditions + '元减' + list[i].Amount + '元' : '直减￥' + list[i].Amount) + '</td><td>' + list[i].DetailNote + '</td><td class="w5" style="text-align: left;  line-height: 20px;">' + list[i].BeginTimeToString + '至<br/>' + list[i].EndTimeToString + '</td><td class="w5" style="line-height: 20px;">' + typeStr['eventTerminal'] + '</td><td class="w5" style="line-height: 20px;">' + typeStr['eventNode'] + '<td class="w7">' + list[i].CouponStatus + '</td></tr>';
                    }
                    //立即购买hover事件
                    $('#tablelist').html(html).find('.immedia_use').hover(function () {
                        $(this).css('zIndex', 1).find('span').show();
                    }, function () {
                        $(this).css('zIndex', 0).find('span').hide();
                    })
                    //分页
                    $(".page_bottom div").AjaxPager({ sum_items: r.d.pageCount, current_page: page, items_per_page: 8, callback: getUserCash });
                } else {
                    $('.biaonot').show();
                    $('.biaohave').hide();
                }
            }
        });
    }
    
    $('#examine').click(function () {
        type = 2;
        getUserCash(1);
        $('.expiring').hide();
        $('.expired').show();
    });
    $('#examineBack').click(function () {
        type = 1;
        getUserCash(1);
        $('.expiring').show();
        $('.expired').hide();
    });
    if (location.hash == '#expire' && $('#examine').length>0) {
        $('#examine').click();
    } else {
        getUserCash(1);
    }
});