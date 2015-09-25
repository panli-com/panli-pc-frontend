function settime($t, zIndex) {
    setTimeout(function () { $t.css('zIndex', zIndex) }, 300);
}
var type = {
    typeName: ['type1', 'type2', 'type3', 'type4'],
    contrasts: function (scrollTop) {
        var typename = this.typeName,
            heights = $(window).height();
        console.log(heights);
        for (var i = 0, len = typename.length; i < len; i++) {
            if (typename[i]) {
                var $dom = $('.' + typename[i]),
                        top = $dom.offset().top + 400;
                if (scrollTop + heights > top) {
                    this[typename[i]]();
                    delete typename[i];
                }
            }
        }
    },
    type1: function () {
        var classlist = {
            'list1': { top: 0, left: 0, height: '551px' },
            'list2': { top: 33, left: '160px', height: '490px' }
        }
        $('.type1 .list1').css(classlist.list2);

        $('.type1 .list2').css(classlist.list1);
        settime($('.type1 .list2'), 2);
    },
    type2: function () {
        $('.type2').addClass('scroll');
    },
    type3: function () {
        var classlist = {
            'list4': { top: 0, left: '105px', height: '551px' },
            'list5': { top: 33, left: '0px', height: '490px' },
            'list6': { top: 33, left: '230px', height: '490px' }
        }

        type3.i = 0;
        function type3() {
            type3.i++;
            var saveClass = $('.type3 img:last').attr('data-class');
            $('.type3 img').each(function (i, t) {
                var nowClass = $(t).attr("data-class");
                $(t).css(classlist[saveClass]).attr("data-class", saveClass);

                settime($(t), saveClass == 'list4' ? 2 : saveClass == 'list5' ? 0 : 1);

                saveClass = nowClass;
            });
            if (type3.i < 3)
                setTimeout(type3, 4000);

        }
        setTimeout(type3, 1000);

    },
    type4: function () {

        var $hongbao = $('.hongbao'),
                width = 500,
                heigh = 600;
        for (var i = 0; i < 20; i++) {
            setTimeout(function () {
                var $span = $('<span></span>');
                $hongbao.append($span);
                var nowWidth = parseInt(Math.random() * 25 + 20),
            nowTop = parseInt(Math.random() * 100 - 100),
            nowLeft = parseInt(width * Math.random() - 20),
            rotate = parseInt(Math.random() * 180 - 90);
                $span.css({ 'width': nowWidth + 'px', 'opacity': 1, 'height': nowWidth + 'px', 'top': nowTop + 'px', 'left': nowLeft + 'px', 'transform': 'rotate(' + rotate + 'deg)' });
                (function ($$span) {
                    var endTop = parseInt(Math.random() * 40 + 480);
                    setTimeout(function () { $$span.css({ opacity: 0, top: endTop + 'px' }) }, 50)
                })($span);
            }, parseInt(Math.random() * 1400));
        }
        setTimeout(function () { $('.list8').animate({ 'opacity': 1 }, 300); }, 3000)
    }
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

var isTransition = supportCss3('transition');
$(window).scroll(function () {
    var scrollTop = $(window).scrollTop(),
                topHeight = $('.banner').offset().top + 444;
    if (scrollTop > topHeight) { }
    $('.overhead')[scrollTop > topHeight ? 'addClass' : 'removeClass']('top_Show');
    if (isTransition) {
        type.contrasts(scrollTop);
    }
});
if (isTransition) {
    $('.list8').css('opacity', 0);
}