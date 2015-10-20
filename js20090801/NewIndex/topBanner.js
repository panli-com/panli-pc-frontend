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
    
    

        //10月10日10:00—10月15日0:00
        new bannerSpecial('Special13', new Date(2015, 9, 10,10), new Date(2015, 9, 15,8), new Date(date), function () {
            var Special10 = $('<div class="Special10" style="width:659px; height:405px; background:url(http://sf.panli.com/Ued/images/20150927/doing_005.png); position:fixed; left:50%; top:50%; margin-left:-329.5px; margin-top:-202.5px; z-index:9999;"><a href="javascript:;" class="SpecialClose" style="display:block; width:60px; height:60px; position:absolute; right:38px; top:148px;z-index:12;"></a><a href="http://www.panli.com/Special/sale_201510.aspx" style="display:block; width:663px; height:510px; position:absolute; left:0px; bottom:0px;z-index:10;"></a></div>');
            $('body').prepend(Special10);
            Panli.Overlay.open();
            Special10.find('.SpecialClose').click(function () {
                Panli.Overlay.close();
                Special10.remove();
                return false;
            });
        });


        //最后1天的弹框，是10月15日0:00—10月16日0:00弹的
        new bannerSpecial('Special13', new Date(2015, 9, 10, 15,8), new Date(2015, 9, 16,8), new Date(date), function () {
            var Special10 = $('<div class="Special10" style="width:672px; height:480px; background:url(http://sf.panli.com/Ued/images/20150927/doing_006.png); position:fixed; left:50%; top:50%; margin-left:-336px; margin-top:-240px; z-index:9999;"><a href="javascript:;" class="SpecialClose" style="display:block; width:60px; height:60px; position:absolute; right:-9px; top:169px;z-index:12;"></a><a href="http://www.panli.com/Special/sale_201510.aspx" style="display:block; width:672px; height:480px; position:absolute; left:0px; bottom:0px;z-index:10;"></a></div>');
            $('body').prepend(Special10);
            Panli.Overlay.open();
            Special10.find('.SpecialClose').click(function () {
                Panli.Overlay.close();
                Special10.remove();
                return false;
            });
        });


        //定时10月20日0:00—10月28日0:00
        new bannerSpecial('Special13', new Date(2015, 9, 20), new Date(2015, 9, 28), new Date(date), function () {
            var Special10 = $('<div class="Special10" style="width:507px; height:543px; background:url(http://sf.panli.com/Ued/images/20150927/doing_007.png); position:fixed; left:50%; top:50%; margin-left:-253.5px; margin-top:-271.5px; z-index:9999;"><a href="javascript:;" class="SpecialClose" style="display:block; width:60px; height:60px; position:absolute; right:40px; top:51px;z-index:12;"></a><a href="http://www.panli.com/Special/hongbao_201510.aspx" style="display:block; width:507px; height:543px;  position:absolute; left:0px; bottom:0px;z-index:10;"></a></div>');
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
    url: "/App_Services/wsDefault.asmx/GetDateTime",
    dataType: "json",
    contentType: "application/json;utf-8",
    timeout: 10000,
    error: function () { },
    success: function (msg) {
        if (msg)
            ajaxInit(parseFloat(msg.d));
    }
});



    
