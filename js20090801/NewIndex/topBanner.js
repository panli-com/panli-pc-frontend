function getdate(newdate) {
    var year = newdate.getFullYear(),
       month = newdate.getMonth(),
       day = newdate.getDate();
    return new Date(year, month, day, 23, 59, 59);
}
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
}
function bannerSpecial(cookieName, dateStar, dateEnd,datehours, isFun, elseFun) {
    dateStar = dateStar.getTime();
    dateEnd = dateEnd.getTime();
    var data = getCookie(cookieName);

    if (ajaxInit.date > dateStar && ajaxInit.date < dateEnd && (!cookieName || data == null)) {
        var today;
        if (typeof datehours === 'number') {
            today = new Date();
            today.setTime(today.getTime() + (datehours * 60 * 60 * 1000));
        } else {
            today = getdate(datehours);
            today.setTime(today.getTime());
        }
        document.cookie = cookieName + "=true;expires=" + today.toGMTString();
        isFun();
    }else{
       typeof elseFun=='function'?elseFun():'';
    }
}
function ajaxInit(date) {
    ajaxInit.date = date;
    new bannerSpecial('isShowMaxBanner', new Date(2015, 3, 18, 10), new Date(2015, 3, 16, 10), 30 * 24, function () {//2015 3 16 top banner活动
        var maxbanner = $('<div id="maxbanner" style="width:100%; margin:auto; text-align:center; background:url(http://sf.panli.com/FrontEnd/images20090801/newindex/banner/back.gif);  z-index:1000; overflow:hidden; height:0px;"><a href="http://www.panli.com/Special/shippingsale_201509.html" target="_blank"><img src="http://sf.panli.com/FrontEnd/images20090801/newindex/banner/950X600.jpg" alt="" /></a></div>');
        $('body').prepend(maxbanner);
        $(function () {
            $('#ad20100608').hide();
            maxbanner.animate({ 'height': '600px' }, 500, function () {
                setTimeout(function () {
                    maxbanner.animate({ 'height': '40px' }, 500, function () {
                        $('#ad20100608').show();
                        maxbanner.css({ 'position': 'absolute', 'left': 0, 'top': 0 }).animate({ 'opacity': 0 }, 300, function () { maxbanner.remove(); });
                    });
                }, 3000)
            })
        })
    }, function () {





        //定时12月12日0:00—12月13日0:00; 圣诞三重礼弹窗 ///

        //弹出框链接：  http://www.panli.com/Special/Christmas2015.html  
        new bannerSpecial('Special13', new Date(2015, 12, 7), new Date(2015, 12, 13), new Date(date), function () {
            var _ImgW = 527,
                _ImgH = 539,
                _closeAR = 32,
                _closeAT = 0,
                _imgSrc = 'http://sf.panli.com/Ued/Pc/index/images/layer20160106.png',
                _aHref = 'http://www.panli.com/Special/sale_201601.html';
            var Special10 = $('<div class="Special10" style="width:' + _ImgW + 'px; height:' + _ImgH + 'px; background:url(' + _imgSrc + '); position:fixed; left:50%; top:50%; margin-left:-' + _ImgW / 2 + 'px; margin-top:-' + _ImgH / 2 + 'px; z-index:9999;"><a href="javascript:;" class="SpecialClose" style="display:block; width:60px; height:60px; position:absolute; right:' + _closeAR + 'px; top:' + _closeAT + 'px;z-index:12;"></a><a href="' + _aHref + '" style="display:block; width:' + _ImgW + 'px; height:' + _ImgH + 'px;  position:absolute; left:0px; bottom:0px;z-index:10;"></a></div>');
            $('body').prepend(Special10);
            Panli.Overlay.open();
            Special10.find('.SpecialClose').click(function () {
                Panli.Overlay.close();
                Special10.remove();
                return false;
            });
        });





        //弹出框链接：  http://www.panli.com/Special/Christmas2015.html  
        new bannerSpecial('Special13', new Date(2015, 12, 13), new Date(2015, 12, 14), new Date(date), function () {
            var _ImgW = 619,
                _ImgH = 537,
                _closeAR = 116,
                _closeAT = -13,
                _imgSrc = 'http://sf.panli.com/Ued/Pc/index/images/layer20160112.png',
                _aHref = 'http://www.panli.com/Special/sale_201601.html';
            var Special10 = $('<div class="Special10" style="width:' + _ImgW + 'px; height:' + _ImgH + 'px; background:url(' + _imgSrc + '); position:fixed; left:50%; top:50%; margin-left:-' + _ImgW / 2 + 'px; margin-top:-' + _ImgH / 2 + 'px; z-index:9999;"><a href="javascript:;" class="SpecialClose" style="display:block; width:60px; height:60px; position:absolute; right:' + _closeAR + 'px; top:' + _closeAT + 'px;z-index:12;"></a><a href="' + _aHref + '" style="display:block; width:' + _ImgW + 'px; height:' + _ImgH + 'px;  position:absolute; left:0px; bottom:0px;z-index:10;"></a></div>');
            $('body').prepend(Special10);
            Panli.Overlay.open();
            Special10.find('.SpecialClose').click(function () {
                Panli.Overlay.close();
                Special10.remove();
                return false;
            });
        });



    });
}
$.ajax({
    type: "POST",
    url: "/App_Services/wsDefault.asmx/GetDateTimeStamp",
    dataType: "json",
    contentType: "application/json;utf-8",
    timeout: 10000,
    error: function () { },
    success: function (msg) {
        var millisecond = parseInt(clientTimeZoneT().millisecond);
        var HDateTime = parseFloat(msg.d * 1000);     
        if (msg)
            ajaxInit(HDateTime);
    }
});

function clientTimeZoneT() {
    //获得时区偏移量
    var timeOffset = new Date().getTimezoneOffset();
    //获得时区小时偏移基数
    var hour = parseInt(timeOffset / 60);
    //获得时区分钟偏移基数
    var munite = timeOffset % 60;
    var prefix = "-";
    if (hour < 0 || munite < 0) {
        prefix = "+";
        hour = -hour;
        if (munite < 0) {
            munite = -munite;
        }
    }
    hour += " ";
    munite += " ";
    if (hour.length == 2) {
        hour = "0" + hour;
    }
    if (munite.length == 2) {
        munite = "0" + munite;
    }
    var TimeZone = prefix + hour + munite;

    var TimeZoneJ = {
        TimeZone: TimeZone,
        Minute:timeOffset,
        millisecond: (timeOffset*60*1000)
    }

    return TimeZoneJ;
}


$(window).scroll(function () {
    var scrollTop = $(window).scrollTop();
    if (window['IsIndex']) {
        $('#black_Top')[scrollTop > 400 ? 'show' : 'hide']();
    }
});
