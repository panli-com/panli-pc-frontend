var url_default_key = "";
var url_default_type = "1";
var url_default_sort = "";
var temp_diaocha_default_content = "请在此填写您的反馈，我们会认真对待您的意见并改进不足之处。";
var url_default_start_price = "";
var url_default_end_price = "";
var url_default_start_weight = "";
var url_default_end_weight = "";

$(function() {
    $(".jgnum").find("input[type='text']").keyup(function() {
        //$(this).val($(this).val().replace(/\D/g, ''));
    });

    $("#txt_price_from,#txt_price_to").keyup(function(e) {
        if (e.keyCode == 13) {
            SearchMethod('price', 'confirm');
        } else {
            $(this).val($(this).val().replace(/\D/g, ''));
        }
    });

    $("#txt_weight_from,#txt_weight_to").keyup(function(e) {
        if (e.keyCode == 13) {
            SearchMethod('weight', 'confirm');
        } else {
            $(this).val($(this).val().replace(/\D/g, ''));
        }
    });

    $("#txt_price_from,#txt_price_to").focus(function() {
        $(this).parents(".qujian").addClass("qjon");
        $(this).parent().next().show();
        if ($("#txt_price_from").val() != "" || $("#txt_price_to").val() != "") {
            $("#txt_price_clear").show();
        }
        else {
            $("#txt_price_clear").hide();
        }

        return false;
    });

    $("#txt_weight_from,#txt_weight_to").focus(function() {
        $(this).parents(".qujian").addClass("qjon");
        $(this).parent().next().show();
        if ($("#txt_weight_from").val() != "" || $("#txt_weight_to").val() != "") {
            $("#txt_weight_clear").show();
        }
        else {
            $("#txt_weight_clear").hide();
        }

        return false;
    });

    $(".px").click(function() {
        CloseInputWeightOrPriceAll($(this));
        return false;
    });

    $(document).click(function() {
        CloseInputWeightOrPriceAll("");
    });

    $("#txt_price_clear").click(function() {
        $("#txt_price_from").val("");
        $("#txt_price_to").val("");
        return false;
    });
    $("#txt_weight_clear").click(function() {
        $("#txt_weight_from").val("");
        $("#txt_weight_to").val("");
        return false;
    });

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

function CloseInputWeightOrPriceAll(currentObj) {
    $(".px").each(function() {
        if ($(this).html() != $(currentObj).html()) {
            $(this).find(".qujian").removeClass("qjon");
            $(this).find(".numok").hide();
            $(this).find(".numok a").hide();
        }
    });
}

function SearchMethod(optype, sorttype) {
    var sort = url_default_sort;
    if (optype == "commend") {
        url_default_start_price = "";
        url_default_end_price = "";
        url_default_start_weight = "";
        url_default_end_weight = "";

        sort = "commend";
    }
    else if (optype == "price") {
        url_default_start_weight = "";
        url_default_end_weight = "";
        if (sorttype == 'confirm') {
            url_default_start_price = $("#txt_price_from").val();
            url_default_end_price = $("#txt_price_to").val();

            if ($("#a_search_sort_price").attr("class") == 'pxhui') {
                sort = "price-desc";
                if ($("#a_search_sort_price").attr("class") == '' || $("#a_search_sort_price").attr("class") == 'pxhui') {
                    sort = "price-asc";
                }
           }

        } else{
            sort = "price-desc";
            if ($("#a_search_sort_price").attr("class") == '' || $("#a_search_sort_price").attr("class") == 'pxhui') {
                sort = "price-asc";
            }
        }
    }
    else if (optype == "weight") {
        url_default_start_price = "";
        url_default_end_price = "";
        if (sorttype == 'confirm') {
            url_default_start_weight = $("#txt_weight_from").val();
            url_default_end_weight = $("#txt_weight_to").val();
            if ($("#a_search_sort_weight").attr("class") == 'pxhui') {
                sort = "weight-desc"
                if ($("#a_search_sort_weight").attr("class") == '' || $("#a_search_sort_weight").attr("class") == 'pxhui') {
                    sort = "weight-asc"
                }
            }
        } else {
            sort = "weight-desc"
            if ($("#a_search_sort_weight").attr("class") == '' || $("#a_search_sort_weight").attr("class") == 'pxhui') {
                sort = "weight-asc"
            }
        }
    }


    var tempUrl = '/search/?searchKey=' + encodeURIComponent(url_default_key) + "&type=" + url_default_type;
    tempUrl += "&start_price=" + url_default_start_price + "&end_price=" + url_default_end_price;
    tempUrl += "&start_weight=" + url_default_start_weight + "&end_weight=" + url_default_end_weight;
    tempUrl += "&sort=" + sort;
    window.location.href = tempUrl;

    return false;
}

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
    var url_start_price = Request["start_price"];
    var url_end_price = Request["end_price"];
    var url_start_weight = Request["start_weight"];
    var url_end_weight = Request["end_weight"];
    var url_sort = Request["sort"];
    if (url_key != null && url_key != "" && url_key.length > 0) {
        url_default_key = url_key;
    }
    if (url_type != null && url_type != "" && url_type.length > 0 && url_type == "2") {
        url_default_type = "2";
    }
    if (url_start_price != null && url_start_price != "") {
        $("#txt_price_from").val(url_start_price);
        url_default_start_price = url_start_price;
    }
    if (url_end_price != null && url_end_price != "") {
        $("#txt_price_to").val(url_end_price);
        url_default_end_price = url_end_price;
    }
    if (url_start_weight != null && url_start_weight != "") {
        $("#txt_weight_from").val(url_start_weight);
        url_default_start_weight = url_start_weight;
    }
    if (url_end_weight != null && url_end_weight != "") {
        $("#txt_weight_to").val(url_end_weight);
        url_default_end_weight = url_end_weight;
    }
    if (url_sort != null && url_sort != "" && url_sort.indexOf("commend") < 0) {
        url_default_sort = url_sort;
        if (url_sort == "price-asc") {
            $("#a_search_sort_price").attr("class", "xdd");
        }
        else if (url_sort == "price-desc") {
            $("#a_search_sort_price").attr("class", "");
        }
        else if (url_sort == "weight-asc") {
            $("#a_search_sort_weight").attr("class", "xdd");
        }
        else if (url_sort == "weight-desc") {
            $("#a_search_sort_weight").attr("class", "");
        }
        $("#a_search_sort_default").removeClass("paixuby");
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





/***************************************************中间结束*****************************************************/
$(function() {
    $("#A_bingdanggou").click(function() {
        Gobal_Method_AddBrowseReocrd("1", "1");
        window.open('/Piece/?k=' + encodeURIComponent(url_default_key));
    });
    $("#A_shoufenxiang").click(function() {
        Gobal_Method_AddBrowseReocrd("2", "1");
        window.open('/Cowry/List.aspx?k=' + encodeURIComponent(url_default_key));
    });



    $(".dingbu").click(function() {
        window.scrollTo(0);
        return false;
    });
    $(window).scroll(function() {
        showgoTop();
    });
    function showgoTop() {
        if ((document.documentElement.scrollTop + document.body.scrollTop) > 0) {
            $(".dingbu").show();
        }
        else {
            $(".dingbu").hide();
        }
    }
});


/***************************************************中间结束*****************************************************/




/***************************************************运费开始*****************************************************/

var getPicUrl = function (s) {
    var url = "http://sf.panli.com/FrontEnd/images20090801/Tools/Estimates/";
    s = s.toLowerCase();
    if (s.indexOf("dhl") >= 0)
        return url + "dhl.gif";
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
    return url + "sfsy.gif";
};
var getDtime = function(name) {
    name = name.toLowerCase();
    if (name.indexOf("dhl") >= 0)
        return "3~5个工作日";
    if (name.indexOf("ems") >= 0)
        return "5~8个工作日";
    if (name.indexOf("air") >= 0)
        return "8~15个工作日";
    if (name.indexOf("专线") >= 0)
        return "3~8个工作日";
    if (name.indexOf("大陆") >= 0)
        return "2~3个工作日";
    return "";
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
                $("div.yichang").html("该送货地址无结果，试试其它送货地址吧！").show(); //$("div.yichang").show(); //.html(reslut.error)
                $("div.zuidits").html("");
                return;
            }
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
                ftable.append("<tr><td><img src=\"" + getPicUrl(dname) + "\" alt=\"" + dname + "\" /></td><td><span>￥" + mprice + "</span></td><td>￥" + sprice + "</td><td>" + getDtime(dname) + "</td></tr>");
            });
           
            $("div.zuidits").html("<span class=\"yfjg\">￥" + mminprice + "</span>(多件/" + mmindname + ")<b>-</b><span class=\"yfjg\">￥" + sminprice + "</span>(单件/" + smindname + ")");
        }
    });
}

$(function() {
    $("div.search_close a").click(function() {
        Panli.Overlay.close(); $("div.search_dialog").hide(); return false;
    });
    $("#EstimatesSubmit").click(function() {
        var weight = $("#hidweight").val();
        var area = $("#hometownCountry").val();
        EstimatesSubmit(weight, area);

        return false;
    });
    $("div.zuidi_yunfei a.tablezuidi").hover(function() {
        $("div.zdtishi").show();
    }, function() { $("div.zdtishi").hide(); })

});

function ShowInterFeight(weight) {

    Gobal_Method_AddBrowseReocrd("3", "2");

    $("div.tablelist table tr:gt(0)").remove();
    $("#hometownCountry").val("");
    Panli.Overlay.open();
    $("div.search_dialog").show();
    var area = $("#hiddefaultArea").val();
    if (weight == "")
        weight = 100;
    if (area == "")
        area = "美国";
    $("#hidweight").val(weight);
    $("#hiddefaultArea").val(area);
    $("#hometownCountry").val(area);
    EstimatesSubmit(weight, area);
    return false;
}


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
    /*control_country(list, '#countryPanel', '#hometownCountry', function() {
    var $this = $('#hometownCountry');
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