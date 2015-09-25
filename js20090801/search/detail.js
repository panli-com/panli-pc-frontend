var url_default_key = "";
var url_default_type = "1";
var url_default_id = 0;
var temp_diaocha_default_content = "请在此填写您的反馈，我们会认真对待您的意见并改进不足之处。";
$(function() {
    URl_Param_Init();
    GetHotSearch();

    $("#a_cloase_note_Favorites").click(function() {
        $('.llts').hide();
        var data = jaaulde.utils.cookies.get("closenotshow");
        if (data != null) {
            data = data + '|search_list_note_Favorites';
            jaaulde.utils.cookies.set('closenotshow', data, { domain: 'panli.com' });
        }
        else {
            jaaulde.utils.cookies.set('closenotshow', 'search_list_note_Favorites', { domain: 'panli.com' });
        }
        return false;
    });

    var r = jaaulde.utils.cookies.get("closenotshow");
    if (r == null || r == "" || r.indexOf("search_list_note_Favorites") < 0) {
        $(".llts").show();
    }

    $("#diaocha_txt_content").focus(function() {
        $("#diaocha_txt_content").removeClass("dchui");
        if ($("#diaocha_txt_content").val() == temp_diaocha_default_content) {
            $("#diaocha_txt_content").val("");
        }
    });

    $("#diaocha_txt_content").blur(function() {
        if ($("#diaocha_txt_content").val() == "") {
            $("#diaocha_txt_content").addClass("dchui");
            $("#diaocha_txt_content").val(temp_diaocha_default_content);
        }
    });

    $("#diaocha_btn_submit").click(function() {
        var temp_content = $.trim($("#diaocha_txt_content").val());
        var temp_code = $.trim($("#diaocha_txt_code").val());
        if (temp_content == temp_diaocha_default_content || temp_content == "") {
            alert("请输入您的建议");
            return;
        }
        if (temp_code == "") {
            alert("请输入验证码！");
            return;
        }

        $.ajax({
            type: "POST",
            url: "/App_Services/wsFeedBack.asmx/FeedBack",
            dataType: "text",
            contentType: "application/json;utf-8",
            data: "{content:'" + temp_content + "',checkCode:'" + temp_code + "',type:5}",
            timeout: 10000,
            error: function() { alert("提交信息失败"); },
            success: function(msg) {
                var res = eval("(" + msg + ")").d;
                if (res == "noLogin") {
                    $("#checkCode").click();
                    alert("您尚未登陆，请先登陆后操作。");
                    return;
                }
                if (res == "success") {
                    $("#diaocha_txt_code").val("");
                    $("#diaocha_txt_content").val("");
                    $("#checkCode").click();
                    alert("感谢您提出的宝贵意见！");
                    return;
                }
                if (res == "fail" || res == "noCheckCode") {
                    $("#checkCode").click();
                    alert("验证码错误");
                    return;
                }
            }
        });
    });
});

function SearchMethod_Hot(obj) {
    Gobal_Method_AddSearchReocrd($.trim($(obj).html()), "1", "3");
    var tempUrl = '/search/?searchKey=' + encodeURIComponent($.trim($(obj).html())) + "&type=1";
    window.location.href = tempUrl;
}

function GetHotSearch() {
    /*$.ajax({
    type: "POST",
    url: "/App_Services/wsSearch.asmx/GetHotSearch",
    cache: false,
    dataType: "json",
    contentType: "application/json;utf-8",
    data: '{"key":"' + $.trim($("#txt_search_key").val()) + '"}',
    timeout: 15000,
    error: function(a, b, c) { alert("网络错误请重新再试"); },
    success: function(r) {
    $(".resou p").html("热搜：" + r.d);
    }
    });*/
}

/****************************************************URL参数赋值开始*****************************************************/
function URl_Param_Init() {
    var Request = new Object();
    Request = GetRequest();
    var url_type = Request["type"];
    var url_key = Request["searchKey"];
    var url_id = Request["id"];
    if (url_key != null && url_key != "" && url_key.length > 0) {
        url_default_key = url_key;
    }
    if (url_type != null && url_type != "" && url_type.length > 0 && url_type == "2") {
        url_default_type = "2";
    }
    if (url_id != null && url_id != "" && url_id.length > 0) {
        url_default_id = parseInt(url_id);
    }
}
/****************************************************URL参数赋值结束*****************************************************/


/****************************************************下面搜索开始*****************************************************/
$(function() {
    $('.sousuo .channel_xl').hover(
        function() {
            $('.sousuo .channel_list').show();
        },
        function() {
            $('.sousuo .channel_list').hide();
        }
    );

    $('.sousuo .channel_list a').click(function() {

        var temp = $.trim($(this).html());
        $(this).html($.trim($(".sousuo .channel_xz").html()));
        $(".sousuo .channel_xz").html(temp);

        if ($.trim($("#txt_search_key_down").val()) == txt_search_default_product) {
            $("#txt_search_key_down").val(txt_search_default_shop);
        }
        else if ($.trim($("#txt_search_key_down").val()) == txt_search_default_shop) {
            $("#txt_search_key_down").val(txt_search_default_product);
        }
        $('.sousuo .channel_list').hide();
        return false;
    });

    $("#txt_search_key_down").focus(function() {
        $(".sousuo .channel_lx").html("");
        $(".sousuo .channel_lx").hide();
        $(this).removeClass("channel_hui");
        var temp_search_value = $.trim($(this).val());
        if (temp_search_value == txt_search_default_product || temp_search_value == txt_search_default_shop) {
            $(this).val("");
        }
    });

    $("#txt_search_key_down").blur(function() {
        var temp_search_value = $.trim($(this).val());
        if (temp_search_value == "") {
            $(this).addClass("channel_hui");
            if ($.trim($(".sousuo .channel_xz").html()) == "商品") {
                $(this).val(txt_search_default_product);
            }
            else {
                $(this).val(txt_search_default_shop);
            }
        }
    });

    $("#btn_search_submit_down").click(function() {
        SearchDown();
    });

    $("#txt_search_key_down").keyup(function(e) {
        if (e.keyCode == 13) {
            e.keyCode == 0;
            SearchDown();
            return false;
        }
        else if (e.keyCode == 38) {

        }
        else if (e.keyCode == 40) {

        }
        else if ($.trim($(".sousuo .channel_xz").html()) == "商品") {
            $.ajax({
                type: "POST",
                url: "/App_Services/wsSearch.asmx/GetSearchKeyList",
                cache: false,
                dataType: "json",
                contentType: "application/json;utf-8",
                data: '{"key":"' + $.trim($("#txt_search_key_down").val()) + '","type":"down"}',
                timeout: 15000,
                error: function(a, b, c) { alert("网络错误请重新再试"); },
                success: function(r) {
                    if (r != null && r != "" && r.d != null && r.d != "") {
                        $(".sousuo .channel_lx").show();
                        $(".sousuo .channel_lx").html(r.d);
                    } else {
                        $(".sousuo .channel_lx").hide();
                    }
                }
            });
        }
    });

    $("#txt_search_key_down").keydown(function(e) {
        var code = e.keyCode;
        var index = $(".channel_lx .channel_on").length == 0 ? 0 : $(".channel_lx a").index($(".channel_lx .channel_on").eq(0));
        if (code == 38) {//向上
            $(".channel_lx a").removeClass("channel_on");
            if (index == 0) {
                $(".channel_lx a:last").addClass("channel_on");
                $("#txt_search_key_down").val($(".channel_lx a:last").attr("keyvalue"));
            } else {
                $(".channel_lx a").eq(index - 1).addClass("channel_on");
                $("#txt_search_key_down").val($(".channel_lx a").eq(index - 1).attr("keyvalue"));
            }
        } else if (code == 40) {//向下
            var backLength = $(".channel_lx .channel_on").length;
            $(".channel_lx a").removeClass("channel_on");
            if (index == $(".channel_lx a").length - 1 || backLength == 0) {
                $(".channel_lx a:first").addClass("channel_on");
                $("#txt_search_key_down").val($(".channel_lx a:first").attr("keyvalue"));
            } else {
                $(".channel_lx a").eq(index + 1).addClass("channel_on");
                $("#txt_search_key_down").val($(".channel_lx a").eq(index + 1).attr("keyvalue"));
            }
        }
    });

    if (url_default_key != null && url_default_key != "" && url_default_key.length > 0) {
        $("#txt_search_key_down").removeClass("channel_hui");
        $("#txt_search_key_down").val(url_default_key);
    }
});

function channel_lx_click_down(obj) {
    $("#txt_search_key_down").val($(obj).attr("keyvalue"));
    SearchDown();
}

function SearchDown() {
    var temp_search_value = $.trim($("#txt_search_key_down").val());
    if (temp_search_value == txt_search_default_product || temp_search_value == txt_search_default_shop || temp_search_value == "") {
        alert("请输入搜索关键词！");
        $("#txt_search_key_down").focus();
    }
    else {
        Gobal_Method_AddSearchReocrd(temp_search_value, ($.trim($(".sousuo .channel_xz").html()) == "商品" ? "1" : "2"), "2");
        var tempUrl = '/search/?searchKey=' + encodeURIComponent(temp_search_value) + "&type=" + ($.trim($(".sousuo .channel_xz").html()) == "商品" ? "1" : "2");
        window.location.href = tempUrl;
    }
}
/****************************************************下面搜索结束*****************************************************/



/***************************************************收藏开始*****************************************************/
$(function() {
    if (hidShouChange != "-1" && hidShouChange != null && hidShouChange != "" && hidShouChange.length > 0) {
        $(".zuijin").show();

        if (hidShouChange.length < 2) {
            $(".zjtop ul").hide();
            $('.llts').hide();
        }
        else {
            $(".zjtop ul").show();
            $(".zjtop ul").empty();

            var temp_i = 0;

            for (temp_i = 0; temp_i < hidShouChange.length; temp_i++) {
                $(".zjtop ul").append("<li " + (temp_i == 0 ? "class=\"fyby\"" : "") + "><a  onclick=\"return false;\" href=\"javascript:void(0);\">" + (temp_i + 1) + "</a></li>");
            }

            $(".zjtop ul li").mouseover(function(liIndex) {
                $(".zjtop ul li").removeClass("fyby");
                $(this).addClass("fyby");
                run((parseInt($.trim($(this).find("a").html())) - 1));

                clearTimeout(tid);
                hover = true;
            });

            $(".zjtop ul li").mouseout(function(liIndex) {
                clearTimeout(tid);
                hover = false;
                tid = setTimeout(function() {
                    run();
                }, 3000);
            });
        }


        var box = $('<div class="g_box"></div>');
        var slider = $('<div class="liulan"></div>').append(box).hover(function() { clearTimeout(tid); hover = true; }, function() { clearTimeout(tid); hover = false; tid = setTimeout(function() { run(); }, 3000); });
        $.each(hidShouChange, function(i, d) {
            var ul = $("<ul style=\"width:925px;float:left;\"></ul>");

            $.each(d, function(j, li) {
                ul.append(
                "<li>" +
                        "<div class=\"pic2\">" +
                            "<a  href=\"/search/detail.aspx?id=" + li.id + "\" target=\"_blank\">" +
                                "<img src=\"" + li.picture + "\"  onerror=\"this.src='http://sf.panli.com/FrontEnd/images20090801/noimg/noimg220.gif';\" /></a>" +
                        "</div>" +
                        "<div class=\"llinfo\">" +
                            "<span>￥" + li.price + "</span><em>重量:" + li.weight + "g</em>" +
                        "</div>" +
                        "<h2>" +
                            "<a  href=\"/search/detail.aspx?id=" + li.id + "\" target=\"_blank\">" + li.name + "</a></h2>" +
                    "</li>"
                    );
            });
            box.append(ul);
        });

        box.append(box.children().clone()).width(925 * hidShouChange.length * 2);
        $("#shouchangDiv").empty().append(slider);

        var tid = setTimeout(function() { run(); }, 5000);
        var index = 0;
        var dest = index;
        var hover = false;
        var l = box.find("ul").length;
        var run = function(i) {
            if ($(".g_box").find("ul").length < 3) { return; }
            dest = (i || i == 0) ? i : index + 1;
            if (dest >= l) {
                dest = hidShouChange.length;
                box.css("margin-left", 0 - 925 * (dest - 1));
            }
            if (dest < 0) {
                dest = r.length - 1;
                box.css("margin-left", 0 - 925 * (dest + 1));
            } //alert(dest);
            SetShouChangIndex(dest);
            box.fadeTo("fast", 0.5).animate({ marginLeft: (0 - 925 * dest) + "px" }, 800, function() {
                $(this).fadeTo("fast", 1);
                index = dest;
                clearTimeout(tid);
                if (!hover)
                    tid = setTimeout(function() { run(); }, 5000);
            });
        }


        function SetShouChangIndex(index) {
            index = index % hidShouChange.length;
            //alert(index);

            $(".zjtop ul li").removeClass("fyby");
            $(".zjtop ul li").eq(index).addClass("fyby");
        }
    }
    else {
        $(".zuijin").hide();
    }

    $(".g_box").find("li").mouseover(function() {
        $(".g_box").find("li").removeClass("hongse");
        $(this).addClass("hongse");
    });
    $(".g_box").find("li").mouseout(function() {
        $(".g_box").find("li").removeClass("hongse");
    });
});

/***************************************************收藏结束*****************************************************/








$(function() {
    $(".zuidi").hover(
    function() { $(".zdtishi").show(); },
    function() { $(".zdtishi").hide(); });

    $("#a_daigou").click(function() {
        DaiGouMethodLink();
    });
});

function DaiGouMethodLink() {
    //window.Panli.Crawl.open("" + $("#hidProductUrl").val() + "");
    DaiGouTongJi();
    return false;
}


function DaiGouTongJi() {

    $.ajax({
        type: "POST",
        url: "/App_Services/wsSearch.asmx/DaiGouTongJi",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"proID":' + $("#hidProductID").val() + '}',
        success: function(r) {
        }
    });

}



/***************************************************运费开始*****************************************************/

var CheckDeliver = null;

function FreightResult(_mminprice, _mmindname, _sminprice, _smindname) {
    this.mminprice = _mminprice;
    this.mmindname = _mmindname;
    this.sminprice = _sminprice;
    this.smindname = _smindname;
};

var getPicUrl = function (name) {
    var url = "http://sf.panli.com/FrontEnd/images20090801/Tools/Estimates/";
    s = name.toLowerCase();
    if (s.indexOf("dhl") >= 0)
        return url + "dhl.gif";
    if (s.indexOf("ems普通") >= 0)
        return name;
    if (s.indexOf("ems") >= 0)
        return url + "ems.gif";
    if (s.indexOf("air") >= 0)
        return url + "air.gif";
    if (s.indexOf("敏感商品专线") >= 0)
        return url + "mgsp.gif";
    if (s.indexOf("自提专线") >= 0)
        return url + "ztzx.gif";
    if (s.indexOf("专线") >= 0)
        return url + "panli_zx.gif";
    if (s.indexOf("大陆") >= 0)
        return url + "guonei.gif";
    return name;
};
var getDtime = function (name) {
    name = name.toLowerCase();
    if (name.indexOf("ems普通") >= 0)
        return "5~10工作日";
    if (name.indexOf("dhl") >= 0)
        return "3~5个工作日";
    if (name.indexOf("ems") >= 0)
        return "5~8个工作日";
    if (name.indexOf("air") >= 0)
        return "8~20个工作日";
    if (name.indexOf("专线") >= 0)
        return "7~10个工作日";
    if (name.indexOf("大陆") >= 0)
        return "2~3个工作日";
    if (name.indexOf("特惠线") >= 0)
        return "7~15个工作日";
    return "8~15个工作日";
}



function EstimatesSubmit(weight, area) {

    $.ajax({
        type: "POST",
        url: "/App_Services/wsEstimates.asmx/GetGlobalFreight",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"weight":' + parseFloat(weight).toFixed(0) + ',"aname":\'' + area + '\'}',
        timeout: 5000,
        beforeSend: function() {
            $("div.tablelist table tr:gt(0)").remove();
            $("#EstimatesLoading").show();
            $("div.yichang").hide();
        }, error: function() {
            $("div.yichang").html("查询发生错误，请稍后再试。").show(); //$("div.yichang").show();
        }, success: function(r) {
            var reslut = $.parseJSON(r.d);
            if (!!reslut.error) {
                $("#EstimatesLoading").hide();
                $("div.yichang").html("该送货地址无结果，试试其它送货地址吧！").show(); //$("div.yichang").show(); //html(reslut.error).
                $("div.zuidits").html("");
                $("#EstimatesSubmit").hide();
                return;
            }
            $("#EstimatesSubmit").show();
            $("div.tablelist table tr:gt(0)").remove();
            var ftable = $("div.tablelist table");
            $("#EstimatesLoading").hide();
            $("div.yichang").hide();
            var mminprice = reslut.mminprice, sminprice = reslut.sminprice;
            var mmindname, smindname;
            $.each(reslut.l, function(i, t) {
                var dname = t.name;
                var bprice = t.bprice;
                var uprice = t.uprice;
                var weight = t.weight;
                var mprice = t.mprice.toFixed(2);
                var sprice = t.sprice.toFixed(2);
                if (mprice == mminprice)
                    mmindname = dname;
                if (sprice == sminprice)
                    smindname = dname;
                mmindname = mmindname || "";
                smindname = smindname || "";
                //ftable.append("<tr><td><img src=\"" + getPicUrl(dname) + "\" alt=\"" + dname + "\" /></td><td>" + bprice + "</td><td>" + uprice + "</td><td>" + weight + "</td><td>" + mprice + "</td><td>" + sprice + "</td><td>" + getDtime(dname) + "</td></tr>");
                ftable.append("<tr><td>" + (dname!=getPicUrl(dname)? "<img src=\"" + getPicUrl(dname) + "\" alt=\"" + dname + "\" />":dname)+"</td><td><span>￥" + mprice + "</span></td><td>￥" + sprice + "</td><td>" + getDtime(dname) + "</td></tr>");
            });
            $("div.zuidits").html("<span class=\"yfjg\">￥" + mminprice + "</span>(多件/" + mmindname + ")<b>-</b><span class=\"yfjg\">￥" + sminprice + "</span>(单件/" + smindname + ")");
            CheckDeliver = new FreightResult(mminprice,mmindname,sminprice,smindname);
        }
    });
}

$(function() {
    $("div.search_close a").click(function() {
        Panli.Overlay.close(); $("div.search_dialog").hide(); return false;
    });
    $("#EstimatesSubmit").click(function() {
        if (CheckDeliver) {
            $("#li_feight_default").empty().html("<span class=\"yfjg\">￥" + parseFloat(CheckDeliver.mminprice).toFixed(2) + "</span>(多件/" + CheckDeliver.mmindname + ")<b>-</b><span class=\"yfjg\">￥" + parseFloat(CheckDeliver.sminprice).toFixed(2) + "</span>(单件/" + CheckDeliver.smindname + ")"); //新增
            $("#lbl_yongsongdate").html(getDtime(CheckDeliver.mmindname) + "(" + CheckDeliver.mmindname + ")"); //新增
            $(".dao .guojia").html($("#hometownCountry").val());
            $("#hiddefaultArea").val($("#hometownCountry").val());
            Panli.Overlay.close(); $("div.search_dialog").hide();
        }
        return false;
    });
    $("div.zuidi_yunfei a.tablezuidi").hover(function() {
        $(".search_dialog .zdtishi").show();
    }, function() { $("div.zdtishi").hide(); })

});

function ShowInterFeight() {

    Gobal_Method_AddBrowseReocrd("3", "3");

    $("div.tablelist table tr:gt(0)").remove();
    $("#hometownCountry").val("");
    Panli.Overlay.open();
    $("div.search_dialog").show();
    var area = $("#hiddefaultArea").val();
    var weight = $("#hidweight").val();
    if (weight == "")
        weight = 100;
    if (area == "") {
        area = "美国";
        $("#hiddefaultArea").val(area);
    }
    $("#hometownCountry").val(area);
    EstimatesSubmit(weight, area);
    return false;
}

$(function() {
    $(".dao .guojia").html($("#hiddefaultArea").val());
    $.ajax({
        type: "POST",
        url: "/App_Services/wsEstimates.asmx/GetGlobalFreight",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"weight":' + parseFloat($("#hidweight").val()).toFixed(0) + ',"aname":\'' + $("#hiddefaultArea").val() + '\'}',
        success: function(r) {
            var reslut = $.parseJSON(r.d);
            if (!!reslut.error) {
                return;
            }
            var mminprice = reslut.mminprice, sminprice = reslut.sminprice;
            var mmindname, smindname;
            $.each(reslut.l, function(i, t) {
                var dname = t.name;
                var bprice = t.bprice;
                var uprice = t.uprice;
                var weight = t.weight;
                var mprice = t.mprice;
                var sprice = t.sprice;
                if (mprice == mminprice)
                    mmindname = dname;
                if (sprice == sminprice)
                    smindname = dname;
            });
            $("#li_feight_default").empty().html("<span class=\"yfjg\">￥" + parseFloat(mminprice).toFixed(2) + "</span>(多件/" + mmindname + ")<b>-</b><span class=\"yfjg\">￥" + parseFloat(sminprice).toFixed(2) + "</span>(单件/" + smindname + ")");
            $("#lbl_yongsongdate").html(getDtime(mmindname) + "(" + mmindname + ")"); //新增
            CheckDeliver = new FreightResult(mminprice, mmindname, sminprice, smindname);
        }
    });
});


/////////////运费国家开始/////////////
$(function() {

    var callEstimates = function(area) {
        var weight = $("#hidweight").val();
        var aname = $("#hiddefaultArea").val();
        if (area != aname) {
            EstimatesSubmit(weight, area);
            $("#hiddefaultArea").val(area);
        }
    }

    var control_country = function(PanliCountryList, countryPanel_selector, dtCountry_selector, fn) {

        //国家列表
        var InitialList = [];
        $.each(PanliCountryList, function(i, d) {
            if ($.inArray(d.Initial, InitialList) < 0) {
                InitialList.push(d.Initial);
            }
        });
        for (var i = 0; i < InitialList.length; i++) {
            for (var j = 0; j < InitialList.length - i - 1; j++) {
                if (InitialList[j] > InitialList[j + 1]) {
                    var temp = InitialList[j];
                    InitialList[j] = InitialList[j + 1];
                    InitialList[j + 1] = temp;
                }
            }
        }


        //国家选择层控件
        var countryPanel = $(countryPanel_selector);
        var areaPanel = $(countryPanel_selector + ' .zimu ul');
        var InitialPanel = $(countryPanel_selector + ' .gj_name ul');

        areaPanel.empty();
        //初始化字母标签项                                                          
        $.each(InitialList, function(i, d) {
            var t = $('<li><a class="' + (d == '中国大陆转送' ? "w90" : "w35") + '" href="#">' + d + '</a></li>').find('a').click(function() {
                InitialPanel.empty();
                //字母标签点击事件（生成国家面板）
                $.each(PanliCountryList, function(i, country) {
                    if (d == country.Initial) {
                        var tCountry = $('<li><a href="#">' + country.CountryName + '</a></li>').find('a').click(function() {
                            $(dtCountry_selector).val(country.CountryName.substring(0, 16));
                            if (fn) { fn(country.CountryName); }
                            //GetSendTypes(country.ShipCountryId);
                            countryPanel.animate({ "height": "0px", "width": "0px" }, 300, function() { countryPanel.hide().css({ "height": "auto", "width": "622px" }); });
                            callEstimates(country.CountryName.substring(0, 16));
                            return false;
                        }).end();
                        InitialPanel.append(tCountry);
                    }
                });
                $('li', areaPanel).removeClass('c_on');
                $(this).parent('li').addClass('c_on');
                return false;
            }).end();
            if (d == '中国大陆转送')
                areaPanel.prepend(t);
            else
                areaPanel.append(t);
        });


        //插入默认常用国家区域
        var temp = $('<li><a class="w90" href="#">常见区域</a></li>').find('a').click(function() {
            InitialPanel.empty();
            $.each(PanliCountryList, function(i, country) {
                if (country.Status == 1) {
                    var t = $('<li class="c_on"><a href="#" title="' + country.CountryName + '">' + country.CountryName + '</a></li>').find('a').click(function(e) {
                        $(dtCountry_selector).val(country.CountryName.substring(0, 16));
                        if (fn) { fn(country.CountryName); }
                        //GetSendTypes(country.ShipCountryId);
                        countryPanel.animate({ "height": "0px", "width": "0px" }, 300, function() { countryPanel.hide().css({ "height": "auto", "width": "515px" }); });
                        //e.stopPropagation();
                        callEstimates(country.CountryName.substring(0, 16));
                        return false;
                    }).end();
                    InitialPanel.append(t);
                }
            });
            $('li', areaPanel).removeClass('c_on');
            $(this).parent('li').addClass('c_on');
            return false;
        }).end();
        areaPanel.prepend(temp);
        //默认选中第一个标签
        $('li:eq(0) a', areaPanel).click();
        //点击国家展开层
        $(dtCountry_selector).click(function() {
            $('#hometownCountry_panel,#countryPanel').hide();
            $('li:eq(0) a', areaPanel).click();
            countryPanel.css({ "height": "0px", "width": "0px" }).show().animate({ "height": "139px", "width": "515px" }, 500, function() { countryPanel.css("height", "auto"); });
            return false;
        });

        $(document).click(function() { countryPanel.hide(); });
        countryPanel.click(function() { return false; });
    }
    var list = CountryListJSON;
    //var courtryextensions = [{ "CountryName": "中国", "Initial": "T-Z", "Order": 101, "Status": 1, "ShipCountryId": 100 }, { "CountryName": "台湾", "Initial": "T-Z", "Order": 102, "Status": 1, "ShipCountryId": 101}];
    var courtryextensions = [{ "CountryName": "台湾", "Initial": "T-Z", "Order": 102, "Status": 1, "ShipCountryId": 101}];
    /*control_country(list, '#countryPanel', '#dtCountry', function() {
    var $this = $('#dtCountry');
    if ($this.val() != "" && $this.attr('placeholder') != $this.val()) {
    $this.css('color', '#000');
    $this.parent().parent().find('td:last-child').show();
    }
    });*/
    control_country(courtryextensions.concat(list), '#hometownCountry_panel', '#hometownCountry', function(countryName) {
        if (countryName == "中国") {
            $("#hometownCity").hide();
            $('#hometown_select').show();
            //                       
        } else {
            $('#hometown_select').hide();
            $("#hometownCity").val('').show();

        }
        var $this = $('#hometownCountry');
        if ($this.val() != "" && $this.attr('placeholder') != $this.val()) {
            $this.css('color', '#000');
            $this.parent().parent().find('td:last-child').show();
        }
    });
});
/////////////运费国家结束/////////////
/***************************************************运费结束*****************************************************/




/***************************************************我的同铺宝贝开始*****************************************************/



//构造列表页面方法
var buildlist = function(i, jq) {
    //用户优惠券列表，d是总数，是当前页列表
    var couponList = { d: 0, l: [] };
    //优惠券列表表格对象
    var listHtml = $("#messageList");
    $.ajax({
        type: "POST",
        url: "/App_Services/wsSearch.asmx/GetShopProduct",
        cache: false,
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"pages":' + i + ',"shopurl":"' + $("#hidShopUrl").val() + '","pid":' + url_default_id + '}',
        timeout: 15000,
        beforeSend: function() {
            $("#load").show();
            $("#messageList").hide();
            $("#p_ajaxPager").hide();
        },
        error: function() { alert("网络错误请重新再试") },
        success: function(r) {
            var temp = eval("(" + r.d + ")");
            if (parseInt(temp.n) < 1) {
                $(".searchqita").hide();
                return;
            }
            //如果列表项总数发生变化重构分页器
            if (couponList.n != temp.n) {
                jq.AjaxPager({
                    sum_items: temp.n,
                    current_page: i,
                    items_per_page: 15,
                    callback: buildlist
                });
            }
            //构造列表
            couponList = temp;
            if (couponList.l.length > 0) {
                $("#messageList").show();
                var t = $("#messageList");
                t.empty();
                var temp_temp = "";
                $.each(couponList.l, function(index, items) {
                    temp_temp += "<li>" +
                            "<div class=\"pic2\">" +
                                "<a    href=\"/search/detail.aspx?id=" + items.id + "\" target=\"_blank\">" +
                                    "<img src=\"" + items.picture + "\" onerror=\"this.src='http://sf.panli.com/FrontEnd/images20090801/noimg/noimg220.gif';\" /></a>" +
                            "</div>" +
                            "<div class=\"llinfo\">" +
                                "<span>￥" + items.price + "</span><em>重量:" + items.weight + "g</em>" +
                            "</div>" +
                            "<h2>" +
                                "<a    href=\"/search/detail.aspx?id=" + items.id + "\" target=\"_blank\">" + items.name + "</a></h2>" +
                        "</li>";
                });
                t.append(temp_temp);
                t.show();
                $("#ajaxPager").show();
                if ($.trim($("#ajaxPager").html()).length > 5) {
                    $("#p_ajaxPager").show();
                }
                $("#load").hide();
            }
        }
    });
}

$(function() {
    buildlist(1, $("#ajaxPager"));
});

/***************************************************我的同铺宝贝结束*****************************************************/





/***************************************************收藏宝贝开始*****************************************************/
$(function() {
    $("#a_shouchangshuliang").click(function() {
        $.ajax({
            async: false,
            type: "POST",
            url: "/App_Services/wsSearch.asmx/ShouChangProduct",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"proID":' + $("#hidProductID").val() + '}',
            success: function(r) {
                if (r.d == "-99") {
                    window.Panli.Login();
                }
                else if (r.d == "0") {
                    alert("添加收藏成功！");
                    SetShouChangNumber();
                }
                else if (r.d == "1") {
                    alert("您已经收藏过这件宝贝了哟！");
                }
                else {
                    alert("系统繁忙，请稍后再试！");
                }
            }
        });
    });

    SetShouChangNumber();
});

function SetShouChangNumber() {
    var number = GetShouChangNumber();
    if (parseInt(number) > 0) {
        $("#a_shouchangshuliang").html("收藏宝贝<span>(" + number + ")</span>");
    } else {
        $("#a_shouchangshuliang").html("收藏宝贝");
    }
}

function GetShouChangNumber() {
    var number = 0;
    $.ajax({
        async: false,
        type: "POST",
        url: "/App_Services/wsSearch.asmx/ShouChangNumber",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"proID":' + $("#hidProductID").val() + '}',
        success: function(r) {
            number = parseInt(r.d);
        }
    });

    return number;
}

/***************************************************收藏宝贝结束*****************************************************/