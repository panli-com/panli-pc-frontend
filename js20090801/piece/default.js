function animated() {
    var isIE = window.ActiveXObject,
        isIE6 = isIE && !window.XMLHttpRequest;
    Middle = function (Dom) {//给指定的dom居中；
        function center() {
            var body = document.compatMode == "BackCompat" ? document.body : document.documentElement,
                    cWidth = body.clientWidth,
                    cHeight = body.clientHeight,
                    sTop = body.scrollTop == 0 ? document.body.scrollTop : document.documentElement.scrollTop,
                    Top = (cHeight - Dom.clientHeight) / 2,
                    Left = (cWidth - Dom.clientWidth) / 2;
            if (isIE6) {
                Dom.style.position = "absolute";
                Dom.style.top = sTop + Top + "px";
            } else {
                Dom.style.position = "fixed";
                Dom.style.top = Top + "px";
            };
            Dom.style.left = Left + "px";
        };
        center();
        window.onscroll = center;
        window.onresize = center;
    };
    Middle(Dom('LeadF'));

    function Dom(d) { return document.getElementById(d); }

    var LNum = 0,
            LWidth = 593,
            Forbid = false,
            ww = 0,
            LeadFleft = Dom('LeadFleft'),
            LeadFright = Dom('LeadFright');
    function Text() {
        if (LNum != 0) {
            Dom('LeadF-A').style.display = 'block';
            if (LNum == 3) {
                LeadFleft.className = 'left_';
                LeadFleft.innerHTML = '再看一遍';
                LeadFright.className = 'right_';
                LeadFright.innerHTML = '立即体验新版';
            } else {
                LeadFleft.className = 'left';
                LeadFleft.innerHTML = '';
                LeadFright.className = 'right';
                LeadFright.innerHTML = '';
            }
        };
        Forbid = false;
    };
    var LeadFALi = Dom('LeadF-A').getElementsByTagName('li');
    function LeadF(b) {
        if (LNum == 0) { Dom('LeadF-A').style.display = 'none'; };
        Forbid = true;
        var v0 = 0,
            a = 30,
            t = 1;
        function speed(V0, A, T) {
            var Vt = V0 * T + A * T * T / 2;
            v0 = Vt;
            if (!b) {
                ww = ww - Vt
                if (ww <= -LNum * LWidth) ww = -LNum * LWidth;
                Dom('LeadF-UL').style.marginLeft = ww + 'px';
                if (ww <= -LNum * LWidth) {
                    clearInterval(set);
                    Text();
                }
            } else if (b) {
                ww = ww + Vt
                if (ww >= -LNum * LWidth) ww = -LNum * LWidth;
                Dom('LeadF-UL').style.marginLeft = ww + 'px';
                if (ww >= -LNum * LWidth) {
                    clearInterval(set);
                    Text()
                }
            }
        }
        for (var i = 0; i < LeadFALi.length; i++) {
            LeadFALi[i].className = LNum == i ? 'on' : '';
        }
        var set = setInterval(function () { speed(v0, a, t) }, 50)
    }
    function Close() {
        var H = Dom('xame_overlay'),
                    L = Dom('LeadF');
        H.style.display = 'none';
        L.style.display = 'none';
        L.parentNode.removeChild(L);
        H.parentNode.removeChild(H);
        jaaulde.utils.cookies.set('piecenotice', 'close', { domain: 'panli.com' ,hoursToLive : 500});
    };
    Dom('LeadF-Close').onclick = function () {
        Close();
        return false;
    };

    Dom('LeadF-UL-P1').onclick = function () {
        if (Forbid) return false;
        if (LNum >= 3) return false;
        LNum++;
        LeadF(false);
        return false;
    };
    LeadFleft.onclick = function () {
        if (this.innerHTML == '再看一遍') {
            LNum = 0;
            LeadF(true);
            return false;
        };
        if (Forbid) return false;
        if (LNum <= 0) return false;
        LNum--;
        LeadF(true);
        return false;
    };
    LeadFright.onclick = function () {
        if (Forbid) return false;
        if (this.innerHTML == '立即体验新版') {
            Close();
            return false;
        }
        if (LNum >= 3) return false;
        LNum++;
        LeadF(false);
        return false;
    };
}


var piece = {
    //初始化
    init: function () {
        //默认下拉框为隐藏的
        $("dl.new_p_AllText").hide();
        this.dropdwon();
        this.search();
        this.hotHover();
    },
    //下拉框效果
    dropdwon: function () {

        var btnToggle = $("a.new_p_AllA");
        var dropPanel = $("dl.new_p_AllText");
        btnToggle.click(function (event) {
            dropPanel.show();
            event.stopPropagation(); // 阻止事件冒泡
        });
        dropPanel.children("dd").each(function (i) {
            var _this = $(this);
            _this.click(function (e) {
                var text = $(this).children("a").html();
                btnToggle.html(text + "<em></em>");
                btnToggle.attr("rel", $(this).children("a").attr("rel"));
                dropPanel.hide();
                e.stopPropagation();
            });
        });
        $("body").click(function () { dropPanel.hide(); })
        

    },
    search: function () {
        var btnSearch = $("input.new_p_CheckSub");

        btnSearch.click(function () {
            var btnToggle = $("a.new_p_AllA");
            var url = window.location.href;
            var categoryVal = btnToggle.attr("rel");
            if (url.indexOf("c=") <= 0) {
                if (url.indexOf("?") <= 0) {
                    url = url + "?c=" + categoryVal;
                }
                else {
                    url = url + "&c=" + categoryVal;
                }
            }
            else {
                var reg = new RegExp("c=\\d*", "g");
                url = url.replace(reg, "c=" + categoryVal);
            }
            var inputSearch = $("input.new_p_CheckText");
            var key = inputSearch.val();
            key = encodeURI($.trim(key));
            if (url.indexOf("k=") <= 0) {
                if (url.indexOf("?") <= 0) {
                    url = url + "?k=" + key;
                }
                else {
                    url = url + "&k=" + key;
                }
            } else {
                var reg = new RegExp("k=[^&]*", "g");
                url = url.replace(reg, "k=" + key);
            }
            var price = $("div.new_p_PriceNum > a.on").attr("rel");
            if (url.indexOf("p=") <= 0) {
                if (url.indexOf("?") <= 0) {
                    url = url + "?p=" + price;
                }
                else {
                    url = url + "&p=" + price;
                }
            } else {
                var reg = new RegExp("p=\\d*", "g");
                url = url.replace(reg, "p=" + price);
            }
            window.location = url;
        });
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
    getQueryAllString: function () {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    feedback: function () {
        var checkCode = $.trim($("#suggestCheck").val());
        var content = HtmlEncode($.trim($("#suggestContent").val()));
        if (content.length <= 0) {
            alert("请输入您的建议");
            return;
        }
    },
    hotHover: function () {
        $("div.hot_p_n > ul > li").each(function () {
            var _this = $(this);
            _this.mouseover(function () {
                var hasSelected = _this.hasClass("on");
                if (!hasSelected) {
                    _this.addClass("on");
                    _this.siblings("li").removeClass("on");
                }
            });
        });
    }
};

$(document).ready(function () {

    piece.init();

    $('.new_p_All').hover(function () {
        $(this).addClass('new_p_AllOn').find('.new_p_AllText').show();
    }, function () {
        $(this).removeClass('new_p_AllOn').find('.new_p_AllText').hide();
    })

    if ($("#LeadF").size() > 0) {
        animated();
    }

    NumDom = $('.a_banner ul li').length - 1;
    if (NumDom > 0) {
        var set = setInterval('Banner()', 5000);
        $('.a_banner .BannerSub a').each(function (i) {
            $(this).mouseover(function () {
                clearInterval(set);
                Banner(i);
            }).mouseout(function () {
                set = setInterval('Banner()', 5000);
            })
        });

    }else {
        $('.a_banner .BannerSub').hide();
    }

    $('#sendSuggestBtn').click(function () {
        if ($('#suggestContent').val() == '') {
            alert('请填写您提出的建议！');
            $('#suggestContent').focus();
            return false;
        };
        if ($('#suggestCode').val() == '') {
            alert('请填写验证码！');
            $('#suggestCode').focus();
            return false;
        };
        $.ajax({
            type: "POST",
            url: "/App_Services/wsFeedBack.asmx/FeedBack",
            dataType: "text",
            contentType: "application/json;utf-8",
            data: "{content:'" + $('#suggestContent').val() + "',checkCode:'" + $('#suggestCode').val() + "',type:2}",
            timeout: 10000,
            error: function () { alert("提交信息失败"); },
            success: function (msg) {
                var res = eval("(" + msg + ")").d;
                if (res == "noLogin") {
                    $("#fbCheckCode").click();
                    alert("您尚未登陆，请先登陆后操作。");
                    return;
                }
                if (res == "success") {
                    $("#suggestCode").val(""); $("#suggestContent").val(""); $("#fbCheckCode").click();
                    alert("感谢您提出的宝贵意见！");
                    return;
                }
                if (res == "fail" || res == "noCheckCode") {
                    $("#fbCheckCode").click();
                    alert("验证码错误");
                    return;
                }

            }
        });
        return false;
    });
});

var width = 950,
    Num = 1,
    NumDom = 0;
function Banner(N) {//banner切换
    Num = N || N == 0 ? N : Num;
    $('.a_banner .BannerSub a').removeClass('on').eq(Num).addClass('on');
    $('.a_banner .Banner-Ul ul').animate({ marginLeft: -width * Num + 'px' }, 300);
    Num++;
    if (Num > NumDom) Num = 0;
    if (Num < 0) Num = NumDom;
}
