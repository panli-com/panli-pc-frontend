var shouhuozhankai = "展开收货信息";
var shouhuoyincang = "关闭收货信息";
var divaddinfoId = "div_dizhi_info";


var ShipAarry;

//构建运送方式对象
function Shipping(_number, _name, _price) {
    this.number = _number;
    this.name = _name;
    this.price = _price;
}

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
            $('#payPassword').focus();
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
    //trarr.attr({ style: "cursor:default;" });
    trarr.find("td:eq(1)").click(function () {

        $(this).prev().find(":radio").attr({ checked: "checked" });
        $(this).prev().find(":radio").click();
    });
    $("tr[id^='trextop']").hide();


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

function radioType(yunshuyuan, yunshu, fuwuyuan, fuwu, fuwumax, chaoshiyuan, chaoshi, dikou, yingfu, _this) {
    var hidsendnameval = $("#hidsendnameval");

    if (hidsendnameval.val() != $(_this).val()) {

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
            yunshufeiyuan.text("(原价" + parseFloat(yunshuyuan).toFixed(2) + "元)");
            yunshufeiyuan.show();
        }
        if (fuwuyuan != fuwu) {
            fuwufeiyuan.text("(原价" + parseFloat(fuwuyuan).toFixed(2) + "元)");
            fuwufeiyuan.show();
        }
        if (chaoshiyuan != chaoshi) {
            chaoshifeiyuan.text("(原价" + parseFloat(chaoshiyuan).toFixed(2) + "元)");
            chaoshifeiyuan.show();
        }
        hidsendnameval.val($(_this).val());
        closeyouhuiceng();

        oldyetiqiti();

        // Author: yuma
        // Data: 2012 - 6 - 21
        // 获取数据信息的td元素
        var infocontainer = $(_this).parent("td").next();
        if (infocontainer.size() > 0) {
            ShipAarry = new Array();
            var itemtitle = infocontainer.children("table.table2");
            var itemtr = itemtitle.find("tr");
            var Delivery;
            if (itemtr.size() == 1) {
                var dname = $.trim(itemtr.first().children("td.p1").text());
                Delivery = new Shipping($(_this).val(), dname, parseFloat(fuwu).toFixed(2));
                ShipAarry.push(Delivery);
            }
            else if (itemtr.size() > 1) {
                //获取拆分信息的容器
                var paomin = infocontainer.children("div.paomin");
                //获取拆分的对象
                var baos = paomin.children("div.bao1");
                baos.each(function (i, o) {
                    var bao = $(this),
                    baoname = bao.children("div.baoname");
                    var dname = baoname.children("h2").text().replace("商品清单", "");
                    var wfee = baoname.find("p > span:last").text().replace("￥", "");
                    dname = $.trim(dname);
                    wfee = $.trim(wfee);
                    Delivery = new Shipping($(_this).val(), dname, parseFloat(wfee).toFixed(2));
                    ShipAarry.push(Delivery);
                });
            }
        }
        CreateCoupons();
        ///启用番币
        if (window.EnablePanli) {
            CreatePanbi();
        }
    }

}

function oldyetiqiti() {
    var radiotr = $(":radio[name='sendType']:checked").parent().next().find("table:eq(0)>tbody>tr");
    var radiotrlength = radiotr.length;
    if (radiotrlength == 1) {
        var tdtext = $.trim(radiotr.find("td:eq(0)").text());
        if (xinjiapo == "新加坡" && tdtext == "Panli专线") {
            dfangshi.fadeIn("slow");
            dfangshi.html("书籍/液体/气体等类商品请使用其他运送方式；体积大而重量轻的商品（如大型毛绒玩具等），计费方式与体积重量相关。<a href='http://service.panli.com/Help/Detail/55.html' target='_blank'>详情&gt;&gt;</a>");
        } else if (tdtext == "DHL" || (tdtext == "Panli专线" && xinjiapo != "新加坡")) {
            dfangshi.fadeIn("slow");
            dfangshi.html("液体/气体等类商品请使用其他运送方式；体积大而重量轻的商品（如大型毛绒玩具等），计费方式与体积重量相关。<a href='http://service.panli.com/Help/Detail/55.html' target='_blank'>详情&gt;&gt;</a>");
        } else if (tdtext == "EMS") {
            dfangshi.fadeIn("slow");
            dfangshi.html("液体/气体等类商品请使用其他运送方式。<a href='http://service.panli.com/Help/Detail/55.html' target='_blank'>详情&gt;&gt;</a>");
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
//优惠劵点击使用
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

    var hidfuwutemp = hidfuwu.val();    //服务费
    var yingfutemp = hidyingfu.val();   //运输费
    var youhuipricetemp = hidyouhuiprice.val();  //优惠劵

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

//使用优惠劵
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
//取消优惠劵
function QuXiaoYouHuiQuan() {
    var dival = hiddikou.val();
    var yingval = hidyingfu.val();
    if (dival != "" && yingval != "") {
        dikoufei.text(dival + "元");
        yingfufei.text(yingval + "元");
    }
    $(":radio[name='Coupon']").removeAttr("checked");
}

//优惠劵点击取消
function closeyouhuiceng() {
    $(":radio[name='Coupon']").removeAttr("checked");


    $("#pshiyongyouhuiquan").fadeIn("slow");
    $("#pquxiaoyouhuiquan").hide();
    $("#divyouhuiquan").hide();
}

function azhankai() {
    $("tr[id^='trextop']").show();
    $("#azhankai").parent().hide();
}


/*--------------------------------------------------
Author:yuma
Data: 2012-6-21
*/


//信息符合的优惠劵
function CreateCoupons() {
    $("#hidcoupons").val("");
    $("#hidcouponnames").val("");
    var Coupons = $("div.shiyong");

    if (Coupons.size() > 0) {
        Coupons.html("");
        if (ShipAarry.length > 0) {
            for (var s in ShipAarry) {
                var Couponhtml = "<p style=\"display: block\" rel=" + s + " ttype=\"sel\" >"
                       + "本次运单 (" + ShipAarry[s].name + ") 服务费为<span id=\"youfuwu\">￥" + ShipAarry[s].price + "</span>，"
                       + "<a href=\"javascript:void(0)\" "
                       + "onclick=\"UsingConpon(this);\">(+)使用优惠券抵扣部分服务费</a></p>"
                       + "<p style=\"display:none;color:#339900\" rel=\"\" ttype=\"suc\" >"
                       + "您成功使用优惠券抵扣服务费：<Span>￥15.00</Span>&nbsp;&nbsp;"
                       + "<a href=\"#\">取消使用优惠券</a></p>";
                Coupons.html(Coupons.html() + "" + Couponhtml);
            }
        } else {
            alert("加载错误，请刷新页面！");

        }
    }
}
function UsingConpon(_obj) {
    var aobj = $(_obj);
    if (parseFloat(aobj.prev().text().replace(/[^\d\.]/g, ''))<= 0) {
        alert('服务费已全免，无需使用优惠券');
        return false;
    }
   
    var conpenobj = aobj.parent().next();
    var chks = $("#hidcoupons").val().split(",");
    var conponsObj = $("div.youhuiquan > ul > li");
    conponsObj.show();
    for (var k = 0; k < chks.length; k++) {
        conponsObj.each(function (i, o) {
            var _this = $(this);
            var _val = _this.children().children().val();
            if (chks[k] == _val) {
                _this.hide();
            }
        });
    }
    //将优惠劵的选择项清空
    $(":radio[name='Coupon']").removeAttr("checked");
    if (conpenobj.size() > 0) {
        if (conpenobj[0].nodeName == "DIV") {
            aobj.text("(+)使用优惠券抵扣部分服务费");
            $("#divyouhuiquan").hide().insertAfter(aobj.parent().parent());
        }
        else {
            $("div.shiyong > p[ttype=sel] >a ").text("(+)使用优惠券抵扣部分服务费");
            aobj.text("(-)使用优惠券抵扣部分服务费");
            $("#divyouhuiquan").show().insertAfter(aobj.parent());
        }
    }
    else {
        $("div.shiyong > p[ttype=sel] >a ").text("(+)使用优惠券抵扣部分服务费");
        aobj.text("(-)使用优惠券抵扣部分服务费");
        $("#divyouhuiquan").show().insertAfter(aobj.parent());
    }
}

function CloseConpons() {
    //将优惠劵的选择项清空
    $(":radio[name='Coupon']").removeAttr("checked");
    $("div.shiyong > p[ttype=sel] >a ").text("(+)使用优惠券抵扣部分服务费");
    $("#divyouhuiquan").hide().insertAfter("div.shiyong");
}
//选择使用 优惠劵
function CheckConpons() {
    var radiochk = $(":radio[name='Coupon']:checked");
    $("div.shiyong > p[ttype=sel] >a ").text("(+)使用优惠券抵扣部分服务费");
    if (radiochk.size() > 0) {
        var conponval = radiochk.val();
        var conponids = $("#hidcoupons");
        var conponnames = $("#hidcouponnames");
        if (conponids.val().indexOf(conponval) == -1) {
            var Len = radiochk.parentsUntil("div.youhuiquan").length;
            var pUntil = radiochk.parentsUntil("div.youhuiquan");
            var checksconpons = $(pUntil[Len - 1]).parent().parent();
            var distip = checksconpons.next();
            distip.show();
            var usingconpon = checksconpons.prev("p");
            var _index = usingconpon.attr("rel");
            distip.attr("rel", conponval);
            distip.attr("nel", ShipAarry[_index].name);
            distip.html("您成功使用优惠券抵扣本次服务费(" + ShipAarry[_index].name + ")：<Span>￥" + hidyouhuiprice.val() + "</Span>&nbsp;&nbsp;<a href=\"javascript:void(0);\" onclick=\"ConcelChkConpons(this);\" >取消使用优惠券</a>");
            usingconpon.hide();
            conponids.val(conponids.val() + "," + conponval);
            conponnames.val(conponnames.val() + "," + ShipAarry[_index].name);

            radiochk.parent().parent().hide();

            $(":radio[name='Coupon']").removeAttr("checked");

            CheksCouponsNumber();

            $("#divyouhuiquan").hide().insertAfter("div.shiyong");
            //运单费用
            var MaxDedExp = parseFloat(ShipAarry[_index].price);
            //当前优惠劵面值
            var CurDedExp = parseFloat(hidyouhuiprice.val());
            //抵扣显示费用
            var dk = dikoufei.text().replace("元", "");

            var yingfutemp = hidyingfu.val();   //运输费
            var flyingfu = parseFloat(yingfutemp);

            var s;
            if (MaxDedExp < CurDedExp) {
                s = parseFloat(dk) + MaxDedExp;
                dikoufei.text(s.toFixed(2) + "元");
                flyingfu = flyingfu - s;
            }
            else {
                s = parseFloat(dk) + CurDedExp;
                dikoufei.text(s.toFixed(2) + "元");
                flyingfu = flyingfu - s;
            }
            yingfufei.text(flyingfu.toFixed(2) + "元");
        } else {
            alert("错误，优惠劵已经选择过了！");
        }
    } else {
        alert("请选择优惠劵,来抵扣服务费！");
    }
}

//检测是否优惠劵的数据可兑换的配送方式是否不能满足的情况
function CheksCouponsNumber() {
    if ($("div.youhuiquan ul li:visible").size() == 0) {
        $("div.shiyong p[ttype=sel]").hide();
    }
}


//取消选择的优惠劵
function ConcelChkConpons(_obj) {

    var disptip = $(_obj).parent();
    var checkconpon = disptip.prev("p");
    checkconpon.show();
    disptip.hide();

    $("div.shiyong p[ttype=sel]").each(function () {

        if (!$(this).next("p[ttype=suc]").is(":visible")) {
            $(this).show();
        }
    });

    //取出当前运送方式的最大抵扣费用
    var prevShip = checkconpon.attr("rel");
    //该运送方式的所需服务费
    var MaxFee = ShipAarry[prevShip].price;
    //优惠劵兑换的面值
    var UseFee = $(_obj).prev().html().replace("￥", "");
    //抵扣显示费用
    var dk = dikoufei.text().replace("元", "");
    var yingfutemp = hidyingfu.val();   //运输费
    var flyingfu = parseFloat(yingfutemp);
    MaxFee = parseFloat(MaxFee);
    UseFee = parseFloat(UseFee);
    if (MaxFee < UseFee) {
        s = parseFloat(dk) - MaxFee;
        dikoufei.text(s.toFixed(2) + "元");
        flyingfu = flyingfu - s;
    }
    else {
        s = parseFloat(dk) - UseFee;
        dikoufei.text(s.toFixed(2) + "元");
        flyingfu = flyingfu - s;
    }
    yingfufei.text(flyingfu.toFixed(2) + "元");
    var cid = disptip.attr("rel");
    var conpons = $("#hidcoupons").val();
    if (conpons.indexOf(cid) > -1) {
        conpons = conpons.replace(cid, "");
    }
    $("#hidcoupons").val(conpons);
    var ids = conpons.split(",");
    var chks = [];
    for (var j = 0; j < ids.length; j++) {
        if (ids[j] != "")
            chks.push(ids[j]);
    }
    $("#hidcoupons").val(chks.join(","));
    var nid = disptip.attr("nel");
    var conponnames = $("#hidcouponnames").val();
    if (conponnames.indexOf(nid) > -1) {
        conponnames = conponnames.replace(nid, "");
    }
    $("#hidcouponnames").val(conponnames);
    var nds = conponnames.split(",");
    var chkns = [];
    for (var j = 0; j < nds.length; j++) {
        if (nds[j] != "")
            chkns.push(nds[j]);
    }
    $("#hidcouponnames").val(chkns.join(","));

}





/*--------------------------------------------------
Author:Victor
Data: 2015-06-24
*/

//番币提示
var panbiMsgtimer = null;
var panbiMsgtimer1 = null;
var hidpanbisjson = [{ hidpanbinames: '', hidpanbis: 0 }];
//番币
function CreatePanbi() {
    var Panbis = $("#divpanbi");
    var inputIndex = 0;
    if (Panbis.size() > 0) {
        Panbis.html("");
        if (ShipAarry.length > 0) {
            for (var s in ShipAarry) {
                inputIndex++;
                var Panbihtml = "<div class=\"Panbi_box\">"
    	                    + "<div class=\"input_box\">"
    		                    + "<input type=\"checkbox\" name=\"Panbi\" fuwu=\"" + ShipAarry[s].price + "\" value=\"shiying\"/><span><label for=\"check\">使用</label>番币抵扣" + ShipAarry[s].name + "服务费(" + ShipAarry[s].price + "元)</span><input name=\"panbitxt_" + inputIndex + "\" type=\"text\" fuwuname=\"" + ShipAarry[s].name + "\" class=\"text\">"
    	                        + "<span class=\"panbijianqu\">-<b>0</b>元</span>"
    	                    + "</div>"
                            + "<span name=\"maxfuwu\" class=\"red_tisi\">您输入的番币数量不能高于服务费<i class='arrow'></i><i class='arrow arrow2'></i></span>"
                            + "<span name=\"maxpanbispan\" class=\"red_tisi\">您最多只能输入<em name=\"maxpanbi\"></em>番币<i class='arrow'></i><i class='arrow arrow2'></i></span></div>";
                Panbis.html(Panbis.html() + "" + Panbihtml);
                PanbiInit();
            }
        } else {
            alert("加载错误，请刷新页面！");

        }
    }
}

function PanbiInit() {
    $(".xianshi").show();
    //$("#panbiye").html(window.panbiYe);
    keyupdown();

    //显示番币担保说明
    $("#icoPanbiDoubt").hover(function () {
        $(".assuredetails").show();
    }, function () {
        $(".assuredetails").hide();
    });
}

function keyupdown() {
    //选择使用番币
    $("#divpanbi .Panbi_box input[type='checkbox']").click(function (event) {
        if ($(this).is(":checked") == true) {
            $(this).siblings(".text,.panbijianqu").css("display", "block").parent();

            $(this).siblings("input[class='text']").keydown();
            var fuwuprice = parseFloat($(this).parents(".Panbi_box").find("input[type='checkbox']").attr("fuwu"));
            fuwuprice = (parseFloat(fuwuprice) * 100).toFixed(0);
            var maxpanbi = parseFloat($(this).parents(".Panbi_box").find("input[class='text']").attr("maxpanbi"));
            if (maxpanbi > fuwuprice) {
                $(this).parents(".Panbi_box").find("input[class='text']").val(fuwuprice);
            } else {
                $(this).parents(".Panbi_box").find("input[class='text']").val(maxpanbi);
            }
            $(this).siblings("input[class='text']").keyup();
        }
        else if ($(this).is(":checked") == false) {
            $(this).parents(".Panbi_box").css({ height: 25 });
            $(this).siblings(".text,.panbijianqu").css("display", "none").parent().siblings(".red_tisi").css("display", "none");
            getPanbiYe();
        }
    });
    
    //输入番币
    $("#divpanbi .Panbi_box input[class='text']").keydown(function (event) {
        $(this).attr("maxpanbi", getDqPanbiYe(this));
        return true;
    });

    $("#divpanbi .Panbi_box input[class='text']").keyup(function () {
        var isHide1 = false;
        var isHide2 = false;
        this.value = this.value.replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, "$1");
        var panbiNumber = parseFloat($(this).val());
        var reduction = parseFloat($(this).val() / 100);
        var fuwuprice = parseFloat($(this).siblings("input[type='checkbox']").attr("fuwu"));
        var maxpanbi = parseFloat($(this).attr("maxpanbi"));

        if (reduction > fuwuprice) {
            $(this).parents(".Panbi_box").find("[name='maxfuwu']").show()
            $(this).parents(".Panbi_box").find("[name='maxpanbispan']").hide()
            this.value = (fuwuprice * 100).toFixed(0);
            reduction = parseFloat(fuwuprice);
            hidePanbiMsg($(this).parents(".Panbi_box").find("[name='maxfuwu']"), this);
        } else {
            isHide1 = true;
            $(this).parents(".Panbi_box").find("[name='maxfuwu']").hide()
        }
        panbiNumber = parseFloat($(this).val());
        if (panbiNumber > maxpanbi) {
            $(this).parents(".Panbi_box").find("[name='maxpanbispan']").show()
            $(this).parents(".Panbi_box").find("[name='maxpanbi']").text(maxpanbi)
            this.value = maxpanbi;
            reduction = parseFloat(maxpanbi / 100);
            $(this).parents(".Panbi_box").find("[name='maxfuwu']").hide()
            hidePanbiMsg($(this).parents(".Panbi_box").find("[name='maxpanbispan']"), this);
        } else {
            isHide2 = true;
            $(this).parents(".Panbi_box").find("[name='maxpanbispan']").hide()
        }
        if (isHide1 && isHide2) {
            $(this).parents(".Panbi_box").css({ height: 25 });
        }
        $(this).parents(".Panbi_box").find(".panbijianqu b").html(reduction);
        getPanbiYe();
    });
}

//获取番币余额 计算抵扣
function getPanbiYe() {
    var hidpanbis = $("#hidpanbis");
    var hidpanbinames = $("#hidpanbinames");
    hidpanbis.val("");
    hidpanbinames.val("");
    var deduction = 0;
    var panbiYejs = window.panbiYe;
    var yingfu = 0;
    var panbi = 0;
    var panbis = $("#divpanbi :checkbox[name='Panbi']:checked").siblings("input[class='text']");
    for (var i = 0; i < panbis.length; i++) {
        var Shipname = $(panbis[i]).attr("fuwuname")
        panbi = $(panbis[i]).val() != "" ? parseInt($(panbis[i]).val()) : 0;
        panbiYejs = panbiYejs - panbi;
        deduction = parseFloat(deduction) + parseFloat(panbi);
        hidpanbinames.val(hidpanbinames.val() + "," + Shipname);
        hidpanbis.val(hidpanbis.val() + "," + panbi)
        if (panbiYejs < 0) {
            $("#panbiye").html(0);
            dikoufei.text((window.panbiYe / 100).toFixed(2) + "元");

            yingfu = hidyingfu - (window.panbiYe / 100);
            yingfufei.text(parseFloat(yingfu).toFixed(2) + "元");
            return true;
        }
    }
    $("#panbiye").html(panbiYejs);
    deduction = deduction / 100;
    yingfu = parseFloat(hidyingfu.val()) - deduction;
    dikoufei.text(deduction.toFixed(2) + "元");
    yingfufei.text(parseFloat(yingfu).toFixed(2) + "元");
}

function getDqPanbiYe(dqName) {
    var panbiYejs = window.panbiYe;
    var panbis = $("#divpanbi :checkbox[name='Panbi']:checked").siblings("input[class='text']");
    for (var i = 0; i < panbis.length; i++) {
        var panbiInput = $(panbis[i]);
        if (panbiInput.attr("name") != $(dqName).attr("name")) {
            var panbi = panbiInput.val();
            panbiYejs = window.panbiYe - panbi;
            if (panbiYejs < 0) {
                return 0;
            }
        }
    }
    return panbiYejs;
}

///
function hidePanbiMsg(documentD, dqName) {
    $(dqName).parents(".Panbi_box").css({ height: 50 });
    if ($(dqName).attr("name") == "panbitxt_1") {
        clearTimeout(panbiMsgtimer);
        panbiMsgtimer = setTimeout(function () {
            $(documentD).hide();
            $(dqName).parents(".Panbi_box").css({height:25});
        }, 2000)
    } else {
        clearTimeout(panbiMsgtimer1);
        panbiMsgtimer1 = setTimeout(function () {
            $(documentD).hide();
            $(dqName).parents(".Panbi_box").css({ height: 25 });
        }, 2000)
    }
}

//获取番币
function getPanbiInfo() {
    $.ajax({
        type: "Post",
        url: "/App_Services/wsPanBi.asmx/GetPanbiInfo",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: "{}",
        timeout: 10000,
        error: function () {
            alert('网络错误，请稍后再试');
        },
        success: function (r) {
            var myIntegral = parseInt(r.d.UserPanbi.Integral);
            if (window.danbaoPrice) {
                window.panbiYe = (myIntegral - parseInt(window.danbaoPrice));
                $("#panbiye").html(window.panbiYe);
            } else {
                $("#panbiye").html(window.panbiYe);
            }
            //alert("担保费:" + window.danbaoPrice);
            //$("#panbiye").text(r.d.UserPanbi.Integral);
        }
    });
}
flag = false;
//function dispDetails() {
//   
//    if (!flag) {
//        $(".assuredetails").show();
//        flag = true;
//    } else {
//        $(".assuredetails").hide();
//        flag = false;
//    }
//}