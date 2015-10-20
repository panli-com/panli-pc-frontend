function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
}
//$('#shoppingCart').click(function () {
//    var href = this.href;
//    var one_text = $('span em', this);
//    if (one_text.length > 0) {
//        var today = new Date();
//        today.setTime(today.getTime() + (24 * 30 * 60 * 60 * 1000));
//        document.cookie = 'top_shop' + "=true;expires=" + today.toGMTString() + ";path=/";
//        var eq0 = one_text.eq(0);
//        eq0.animate({ opacity: 0 }, 100, function () {

//            one_text.eq(1).css({ 'top': -50 }).show().animate({ top: 10 }, 200, function () {
//                one_text.eq(1).animate({ top: -5 }, 50, function () {
//                    one_text.eq(1).animate({ top: 0 }, 50);
//                });
//            });
//        });

//        setTimeout(function () {
//            location.href = href;
//        }, 800)
//        return false;
//    }
//});
$('#one_text').click(function () {
    var href = this.href;
    var one_text = $('.one_text', this);
    if (one_text.length > 0) {
        var today = new Date();
        today.setTime(today.getTime() + (24 * 30 * 60 * 60 * 1000));
        document.cookie = 'one_text' + "=true;expires=" + today.toGMTString() + ";path=/";
        var eq0 = one_text.eq(0);
        eq0.animate({ opacity: 0 }, 300, function () { eq0.remove(); });
        one_text.eq(1).css({ 'opacity': 0, 'display': 'block' }).animate({ opacity: 1 }, 300);
        setTimeout(function () {
            location.href = href;
        }, 400)
        return false;
    }
});
if (getCookie('top_shop')) {
    $('#shoppingCart span').html('我的仓库');
}
if (getCookie('one_text')) {
    $('#one_text').html('转运');
}

supportCss3 = function (style) {
    var prefix = ['webkit', 'moz', 'o', 'ms'],
                humpStyle = document.documentElement.style;

    function replaces(str) {
        return str.replace(/-(\w)/g, function ($0, $1) {
            return $1.toUpperCase();
        });
    }
    for (var i = 0, len = prefix.length + 1; i < len; i++) {
        var styleName = '';

        styleName = i == 0 ? style : replaces(prefix[i - 1] + '-' + style);

        if (styleName in humpStyle) return styleName;
    }
    return false;
}
if (!supportCss3('transform')) {
    document.body.className += 'no_transform'
}

var urlRel = /^(http(s)?:\/\/)?([\w-]+\.)+([\w-\.]+)(\/[\w-.\/\?%&=]*)?/,
           errerText = '您输入的链接地址不正确，请核实后再填写！';
$('#headSearch,#topSearch').on('click', function () {
    var $input = $(this).prevAll('input'),
               url = $.trim($input.val());
    if (urlRel.test(url)) {
        if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0)
            url = "http://" + url;
        url = url.replace(/&#/gi, '&'); //特殊地址报错
        window.location.href = "/Crawler.aspx?purl=" + encodeURIComponent(url);
    } else {
        $input.addClass('red').val(errerText);
        return false;
    }
});
$('.search input').on(
       { '  ': function () {
           if ($(this).hasClass('red')) {
               $(this).removeClass('red').val('');
           }
       },
           'click': function (e) {
               if ($(this).hasClass('red')) {
                   $(this).removeClass('red').val('');
               }
           },
           'keyup': function (e) {
               if (e.keyCode == 13) {
                   $(this).next().click();
                   return false;
               }
           }
       });

function hover(dom) {
    if (dom.length > 1) {
        dom.each(function (i, t) {
            new hover($(t));
        });
        return false;
    }
    var className = dom.attr('data-hover'),
                     settime = '';
    dom.hover(function () {
        clearTimeout(settime);
        dom.addClass(className);
    }, function () {
        settime = setTimeout(function () { dom.removeClass(className); }, 200);
    })

}
new hover($('*[data-hover]'));

String.prototype.replaces = function (oldrel, newrel) {
    if (!oldrel || oldrel == '') oldrel = '\\\w\+';
    var rel = new RegExp('{{' + oldrel + '}}', 'g');
    if (!newrel || newrel == 'null' || newrel == 'undefined') newrel = '';
    return this.replace(rel, newrel);
}


function RightK() {
    var bodyW = $('body,html').width();
    var $RightNav = $('.r_l_nav');
    if (bodyW >= 1484) {
        $RightNav.css({ 'right': '50%', 'marginRight': '-742px' });
    } else {
        $RightNav.css({ 'right': '25px', 'marginRight': '0' });
    }
}
RightK();
$(window).resize(RightK);

$(window).scroll(function () {
    var scrollTop = $(window).scrollTop(),
                topHeight = $('#nav_list').offset().top + 48;
    if (scrollTop > topHeight) { }
    $('.overHead')[scrollTop > topHeight ? 'addClass' : 'removeClass']('top_Show');
   // (scrollTop > topHeight ? $('#topSearch') : $('#headSearch')).prev().focus();
    if (window['IsIndex']) {
        $('.r_l_nav li:eq(0)').siblings('li')[scrollTop > 400 ? 'show' : 'hide']();
    }
});


$('#r_download').hover(function () {
    $('.icon_code_h', this).show();
    $('.icon_code_p', this).animate({ left: 0 }, 300);
}, function () {
    var _this = this;
    $('.icon_code_p', this).animate({ left: '121px' }, 300, function () {
        $('.icon_code_h', _this).hide();
    });
}); 