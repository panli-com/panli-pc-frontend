var shouhuozhankai = "展开收货信息";
var shouhuoyincang = "关闭收货信息";
var divaddinfoId = "div_dizhi_info";

var yunshufei;
var yunshufeiyuan;
var fuwufei;
var fuwufeiyuan;
var chaoshifei;
var chaoshifeiyuan;
var dikoufei;
var yingfufei;
var youfuwufei;
var youhuiquandikou;

var hidfuwu;
var hiddikou;
var hidyingfu;
var hidyouhuiprice;
var xinjiapo;
var dfangshi;
$(function () {

    yunshufei = $("#yunshu");
    yunshufeiyuan = $("#yunshuyuan");
    fuwufei = $("#fuwu");
    fuwufeiyuan = $("#fuwuyuan");
    chaoshifei = $("#chaoshi");
    chaoshifeiyuan = $("#chaoshiyuan");
    dikoufei = $("#dikou");
    yingfufei = $("#yingfu");
    youfuwufei = $("#youfuwu");
    youhuiquandikou = $("#youhuiquandikou");
    hiddikou = $("#hiddikou");
    hidyingfu = $("#hidyingfu");
    hidfuwu = $("#hidfuwu");
    hidyouhuiprice = $("#hidyouhuiprice");
    xinjiapo = $("#sjidadi").text();
    dfangshi = $("#dfangshi");

    $("p>a", "#divShipAdd").bind("click", function () {
        var obj = $(this);
        divdizhiinfodisplay(obj, divaddinfoId);
        jidaChangeText(obj);
    });



    $("form:eq(0)").submit(function () {

        var radiosendlength = $(":radio[name='sendType']:checked").length;
        if (radiosendlength == 0) {
            alert("请选择运送方式");
            return false;
        } else if (radiosendlength > 1) {
            alert("只能选择一种运送方式");
            return false;
        }
        var password = $('#payPassword').val();
        if (password.length <= 0) {
            alert('请输入支付密码！');
            return false;
        }
        $("#ok>p").show();
        $("#confirmOk").addClass("hui");
        $("#confirmOk").attr({ disabled: "disabled" });
    });
    var trarr = $(".yunfei>.table").find("tr").not("tr:eq(0)").not("#trhelan");
    trarr.hover(function () {
        $(this).addClass('ds');
    }, function () {
        $(this).removeClass('ds');
    });

    trarr.click(function () {
        trarr.removeClass('in');
        $(this).addClass('in');
    });
    trarr.attr({ style: "cursor:default;" });
    trarr.find("td:eq(1)").click(function () {

        $(this).prev().find(":radio").attr({ checked: "checked" });
        $(this).prev().find(":radio").click();
    });
    $("tr[id^='ext']").hide();
    var radioSendType = $(":radio[name='sendType']");
    if (radioSendType.length == 1) {
        radioSendType.click();
    }
});

function jidaChangeText(obj) {
    if (obj.text() == shouhuozhankai) {
        obj.text(shouhuoyincang);
    } else {
        obj.text(shouhuozhankai);
    }
}

function divdizhiinfodisplay(obj, disId) {
    if (obj.text() == shouhuozhankai) {
        $("#" + disId).slideDown("slow");
    } else {
        $("#" + disId).hide();
    }
}

function radioType(yunshuyuan, yunshu, fuwuyuan, fuwu, fuwumax, chaoshiyuan, chaoshi, dikou, yingfu, thisval) {
    var hidsendnameval = $("#hidsendnameval");
    if (hidsendnameval.val() != thisval) {

        hiddikou.val(dikou);
        hidyingfu.val(yingfu);
        hidfuwu.val(fuwumax);

        yunshufei.text(parseFloat(yunshu).toFixed(2) + "元");
        fuwufei.text(parseFloat(fuwu).toFixed(2) + "元");
        chaoshifei.text(parseFloat(chaoshi).toFixed(2) + "元");
        dikoufei.text(parseFloat(dikou).toFixed(2) + "元");
        yingfufei.text(parseFloat(yingfu).toFixed(2) + "元");
        youfuwufei.text("￥" + parseFloat(fuwu).toFixed(2));

        yunshufeiyuan.hide();
        fuwufeiyuan.hide();
        chaoshifeiyuan.hide();
        if (yunshuyuan != yunshu) {
            yunshufeiyuan.text("(折前" + parseFloat(yunshuyuan).toFixed(2) + "元)");
            yunshufeiyuan.show();
        }
        if (fuwuyuan != fuwu) {
            fuwufeiyuan.text("(折前" + parseFloat(fuwuyuan).toFixed(2) + "元)");
            fuwufeiyuan.show();
        }
        if (chaoshiyuan != chaoshi) {
            chaoshifeiyuan.text("(折前" + parseFloat(chaoshiyuan).toFixed(2) + "元)");
            chaoshifeiyuan.show();
        }
        hidsendnameval.val(thisval);

        closeyouhuiceng();

        oldyetiqiti();
    }

}

function oldyetiqiti() {
    var radiotr = $(":radio[name='sendType']:checked").parent().next().find("table:eq(0)>tbody>tr");
    var radiotrlength = radiotr.length;
    if (radiotrlength == 1) {
        var tdtext = $.trim(radiotr.find("td:eq(0)").text());
        if (xinjiapo == "新加坡" && tdtext == "Panli专线") {
            dfangshi.fadeIn("slow");
            dfangshi.html("书籍/液体/气体等类商品请使用其他运送方式；体积大而重量轻的商品（如大型毛绒玩具等），计费方式与体积重量相关。<a href='http://service.panli.com/Help/Detail/229.html' target='_blank'>详情&gt;&gt;</a>");
        } else if (tdtext == "DHL" || (tdtext == "Panli专线" && xinjiapo != "新加坡")) {
            dfangshi.fadeIn("slow");
            dfangshi.html("液体/气体等类商品请使用其他运送方式；体积大而重量轻的商品（如大型毛绒玩具等），计费方式与体积重量相关。<a href='http://service.panli.com/Help/Detail/229.html' target='_blank'>详情&gt;&gt;</a>");
        } else if (tdtext == "EMS") {
            dfangshi.fadeIn("slow");
            dfangshi.html("液体/气体等类商品请使用其他运送方式。<a href='http://service.panli.com/Help/Detail/229.html' target='_blank'>详情&gt;&gt;</a>");
        } else {
            dfangshi.hide();
        }
    } else {
        dfangshi.hide();
    }
}

function radioyouhuiclick(youhuiprice) {
    hidyouhuiprice.val(youhuiprice);
}

function ShiYongYouHuiQuan() {
    var yunsongtype = $(":radio[name='sendType']:checked").length;
    if (yunsongtype == 0) {
        alert("请选择运送方式");
        return;
    }
    var youhuitype = $(":radio[name='Coupon']:checked").length;
    if (youhuitype == 0) {
        alert("请选择优惠券");
        return;
    }

    var hidfuwutemp = hidfuwu.val();
    var yingfutemp = hidyingfu.val();
    var youhuipricetemp = hidyouhuiprice.val();

    var flfuwu = parseFloat(hidfuwutemp);
    var flyouhuiprice = parseFloat(youhuipricetemp);
    var flyingfu = parseFloat(yingfutemp);

    if (flyouhuiprice < flfuwu) {
        dikoufei.text(flyouhuiprice.toFixed(2) + "元");
        flyingfu = flyingfu - flyouhuiprice;
        youhuiquandikou.text("￥" + flyouhuiprice.toFixed(2));
    } else {
        dikoufei.text(flfuwu.toFixed(2) + "元");
        flyingfu = flyingfu - flfuwu;
        youhuiquandikou.text("￥" + flfuwu.toFixed(2));
    }
    yingfufei.text(flyingfu.toFixed(2) + "元");

    $("#divyouhuiquan").hide();
}


function linkshiyonghouhuiquan(obj) {

    var sendType = $(":radio[name='sendType']:checked").parent().next();
    var sendTypeLength = sendType.find("table:eq(0)").find("tbody:eq(0)").find("tr").length;
    if (sendTypeLength > 1) {


        var result = "";
        var paomin = sendType.find(".paomin:eq(0)>div");
        $.each(paomin, function (i, item) {

            var name = $(item).find("div:eq(0)>h2").html().replace("商品清单", "");

            var price = $(item).find("div:eq(0)>p>span:eq(2)").html();
            result += name + "运单的服务费：" + price + ",";
        });
        result += "系统将自动为您抵扣额度大的那笔服务费。";
        $("#divyouhuiquantishi>p").html(result);
        $("#divyouhuiquantishi").show();
    } else {
        $("#divyouhuiquantishi").hide();
    }
    var s = $(obj).parent();
    s.hide();
    s.parent().prev().fadeIn('slow');
    $('#pquxiaoyouhuiquan').fadeIn('slow');
    $('#youhuiquandikou').text('￥0.00');
}

function QuXiaoYouHuiQuan() {
    var dival = hiddikou.val();
    var yingval = hidyingfu.val();
    if (dival != "" && yingval != "") {
        dikoufei.text(dival + "元");
        yingfufei.text(yingval + "元");
    }
    $(":radio[name='Coupon']").removeAttr("checked");
}


function closeyouhuiceng() {
    $(":radio[name='Coupon']").removeAttr("checked");


    $("#pshiyongyouhuiquan").fadeIn("slow");
    $("#pquxiaoyouhuiquan").hide();
    $("#divyouhuiquan").hide();
}

function extshow() {
    $("tr[id^='ext']").show();
    $("#extshowdiv").hide();
}