var gobalShopID = 0;
$(function() {
    $(".top a").click(function() {
        window.scrollTo(0, 0);
    });
    $(".hot_shopm li")
        .hover(function() {
            $(".redmessage").hide();
            $(".hot_shopm li").removeClass($("#hidLevelColor").val());
            $(this).find(".redmessage").show();
            $(this).addClass($("#hidLevelColor").val());
        }
        , function() {
            $(this).find(".redmessage").hide();
            $(this).removeClass($("#hidLevelColor").val());
        }
    );
    $(".search_dialog .search_close a,.search_dialog .queding .see_else,#goonSetXinYiShangJia").click(function() {
        $(".search_overlay").hide();
        $("#div_dialog_xinyishangjia,#div_dialog_xinyishangjia_success").hide();

    });

    $(".search_dialog .queding .button a").click(function() {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsVIP.asmx/AddShop",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"shopID":' + gobalShopID + '}',
            timeout: 15000,
            error: function() { alert("网络错误请重新再试"); },
            success: function(rr) {
                var r = $.parseJSON(rr.d);
                if (r.result == "0") {
                    $("#div_dialog_xinyishangjia_success .chenggong p").eq(1).html("您还可以将" + r.count + "家折扣商家设置为心仪商家。");
                    $("#div_dialog_xinyishangjia").hide();
                    $("#div_dialog_xinyishangjia_success").show();
                    SetShopClassByShopID(r.count);
                }
                else if (r.result == "1") {
                    alert("您已填加3个店铺");
                }
                else if (r.result == "2") {
                    alert("该店铺已填加");
                }
                else if (r.result == "3") {
                    alert("您的等级不够");
                }
                else if (r.result == "4") {
                    alert("没有找到该店铺");
                }
                else {
                    alert("网络错误请重新再试");
                }
            }
        });
    });
});

function SetXinYiShangJia(temp_shopid) {
    gobalShopID = parseInt(temp_shopid);

    var arr = GetShopClassByShopID(temp_shopid);
    $(".search_overlay").show();
    $("#div_dialog_xinyishangjia").show();
    $("#div_dialog_xinyishangjia .dianpu img").attr("src", arr[1]);
    $("#div_dialog_xinyishangjia .dianpu a").attr("href", arr[0]);
    $("#div_dialog_xinyishangjia .shuoming h3").html("确定要将\"" + arr[2] + "\"设置为心仪商家吗?");
    $("#div_dialog_xinyishangjia .shuoming p").eq(0).find("span").html(arr[3] + "折");

    $("#div_dialog_xinyishangjia_success .chenggong p").eq(0).find("span").html(arr[3] + "折");
    $("#div_dialog_xinyishangjia_success .chenggong h3").html("成功将\"" + arr[2] + "\"设置为心仪商家！");
    $("#div_dialog_xinyishangjia_success .goon a").eq(1).attr("href", arr[0]);
}

function GetShopClassByShopID(shopID) {
    var strArr = [];
    $(".hot_shopm li[name='" + shopID + "']").each(function() {
        strArr.push($(this).find(".shangjia a").attr("href"));
        strArr.push($(this).find(".shangjia a img").eq(0).attr("src"));
        strArr.push($(this).find(".white_border h2 a").text());
        strArr.push($(this).find("label[name='lbl_v4']").html());

        return false;
    });
    return strArr;
}

function SetShopClassByShopID(countID) {
    $(".hot_shopm li").each(function() {
        if ($(this).attr("name") == gobalShopID) {
            $(this).find(".redmessage p").eq(2).hide();
            $(this).find(".redmessage p").eq(1).hide();
            $(this).find(".redmessage p").eq(0).find("label[name='lbl_v3orV4']").html($(this).find("label[name='lbl_v4']").html());
        } else {
            if (countID == "0") {
                $(this).find(".redmessage p").eq(2).hide();
            }
        }
    });
}
