var shouhuozhankai = "展开收货信息"; //显示文字
var shouhuoyincang = "关闭收货信息";
var divaddinfoId = "div_dizhi_info"; //收货信息div
//最后付款信息
var yunshufei; //运输费id对象
var yunshufeiyuan; //运输费原价
var fuwufei; //服务费id对象
var fuwufeiyuan; //服务费原价
var chaoshifei; //超时费id对象
var chaoshifeiyuan; //超时费原价
var dikoufei; //抵扣服务费id对象
var yingfufei; //应付总额id对象
var youfuwufei; //本次运单服务费id对象
var youhuiquandikou; //优惠券使用金额id对象

var hidfuwu; //隐藏表单服务费
var hiddikou; //隐藏表单保存抵扣服务费
var hidyingfu; //隐藏表单保存应付总额
var hidyouhuiprice; //隐藏表单优惠券金额
var xinjiapo; //寄达地对象
var dfangshi; //要修改的文字提示对象，体积重要计算详情
$(function() {
    //加载时获取对象
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
    //展开隐藏收货信息
    $("p>a", "#divShipAdd").bind("click", function() {
        var obj = $(this);
        divdizhiinfodisplay(obj, divaddinfoId); //显示隐藏层
        jidaChangeText(obj); //改变文字
    });


    //提交运送
    $("form:eq(0)").submit(function() {
        //先判断是否有选中radio
        var radiosendlength = $(":radio[name='sendType']:checked").length;
        if (radiosendlength == 0) {
            alert("请选择运送方式");
            return false;
        } else if (radiosendlength > 1) {
            alert("只能选择一种运送方式");
            return false;
        }
        $("#ok>p").show(); //显示正在提交
        $("#confirmOk").addClass("hui"); //变灰
        $("#confirmOk").attr({ disabled: "disabled" }); //不能再次点击
    });
    var trarr = $(".yunfei>.table").find("tr").not("tr:eq(0)").not("#trhelan"); //除了第一个tr文字说明行与特殊地址ems不运送的提示
    trarr.hover(function() {
        $(this).addClass('ds');
    }, function() {
        $(this).removeClass('ds');
    });

    trarr.click(function() {
        trarr.removeClass('in');
        $(this).addClass('in');
    });
    trarr.attr({ style: "cursor:default;" });
    trarr.find("td:eq(1)").click(function() {

        $(this).prev().find(":radio").attr({ checked: "checked" });
        $(this).prev().find(":radio").click();
    });
    $("tr[id^='trextop']").hide();

    //如果只有一个，那么默认选中
    var radioSendType = $(":radio[name='sendType']");
    if (radioSendType.length == 1) {
        radioSendType.click();
    };


});
//展开隐藏收货信息显示的文字改变,参数顺序：jquery对象
function jidaChangeText(obj) {
    if (obj.text() == shouhuozhankai) {
        obj.text(shouhuoyincang); //改变文字
    } else {
        obj.text(shouhuozhankai); //改变文字
    }
}
//显示隐藏div,对于收货信息,参数顺序：jquery对象，id
function divdizhiinfodisplay(obj, disId) {
    if (obj.text() == shouhuozhankai) {
        $("#" + disId).slideDown("slow"); //动画显示
    } else {
        $("#" + disId).hide(); //隐藏
    }
}
//选择运送方式radio点击,参数顺序：运输费原价,运输费,服务费原价,服务费，服务费最大，超时保管费原价,超时保管费,地扣费,应付总额,value
function radioType(yunshuyuan, yunshu, fuwuyuan, fuwu, fuwumax, chaoshiyuan, chaoshi, dikou, yingfu, thisval) {
    var hidsendnameval = $("#hidsendnameval");
    if (hidsendnameval.val() != thisval) {
        //添加到隐藏域
        hiddikou.val(dikou); //为隐藏表单抵扣费赋值
        hidyingfu.val(yingfu); //为隐藏表单应付总额赋值
        hidfuwu.val(fuwumax); //为隐藏表单服务费赋值
        //显示最后的价格
        yunshufei.text(parseFloat(yunshu).toFixed(2) + "元"); //显示运输费
        fuwufei.text(parseFloat(fuwu).toFixed(2) + "元"); //显示服务费
        chaoshifei.text(parseFloat(chaoshi).toFixed(2) + "元"); //显示超时保管费
        dikoufei.text(parseFloat(dikou).toFixed(2) + "元"); //显示抵扣费
        yingfufei.text(parseFloat(yingfu).toFixed(2) + "元"); //显示应付总额
        youfuwufei.text("￥" + parseFloat(fuwu).toFixed(2)); //在使用优惠券旁边显示本次运单的服务费
        //显示打折前的价格,先隐藏
        yunshufeiyuan.hide();
        fuwufeiyuan.hide();
        chaoshifeiyuan.hide();
        if (yunshuyuan != yunshu) { //如果价格不同，说明有打折
            yunshufeiyuan.text("(折前" + parseFloat(yunshuyuan).toFixed(2) + "元)"); //为运输费原价标签赋文本
            yunshufeiyuan.show(); //显示原价
        }
        if (fuwuyuan != fuwu) {
            fuwufeiyuan.text("(折前" + parseFloat(fuwuyuan).toFixed(2) + "元)"); //为服务费原价标签赋文本
            fuwufeiyuan.show(); //显示服务费原价
        }
        if (chaoshiyuan != chaoshi) {
            chaoshifeiyuan.text("(折前" + parseFloat(chaoshiyuan).toFixed(2) + "元)"); //为超时保管费原价标签赋文本
            chaoshifeiyuan.show(); //显示超时保管费原价
        }
        hidsendnameval.val(thisval); //把值添加到隐藏表单
        //取消使用的优惠券
        closeyouhuiceng();
        //原来的液体气体提示，有关此提示请参见"SD-AL-111014-【提交运送-提示调整】程序说明文档";
        oldyetiqiti();
    }

}
//旧版的液体气体提示
function oldyetiqiti() {
    var radiotr = $(":radio[name='sendType']:checked").parent().next().find("table:eq(0)>tbody>tr");
    var radiotrlength = radiotr.length; //获取选中radio的行数，如果为2则拆分了
    if (radiotrlength == 1) {
        var tdtext = $.trim(radiotr.find("td:eq(0)").text()); //获取选中radio的运送方式文本
        if (xinjiapo == "新加坡" && tdtext == "Panli专线") {//当寄达地是新加坡时,panli专线时
            dfangshi.fadeIn("slow");
            dfangshi.html("书籍/液体/气体等类商品请使用其他运送方式；体积大而重量轻的商品（如大型毛绒玩具等），计费方式与体积重量相关。<a href='http://service.panli.com/Help/Detail/55.html' target='_blank'>详情&gt;&gt;</a>");
        } else if (tdtext == "DHL" || (tdtext == "Panli专线" && xinjiapo != "新加坡")) {
            dfangshi.fadeIn("slow");
            dfangshi.html("液体/气体等类商品请使用其他运送方式；体积大而重量轻的商品（如大型毛绒玩具等），计费方式与体积重量相关。<a href='http://service.panli.com/Help/Detail/55.html' target='_blank'>详情&gt;&gt;</a>");
        } else if (tdtext == "EMS") {//显示ems的提示
            dfangshi.fadeIn("slow");
            dfangshi.html("液体/气体等类商品请使用其他运送方式。<a href='http://service.panli.com/Help/Detail/55.html' target='_blank'>详情&gt;&gt;</a>");
        } else {
            dfangshi.hide(); //隐藏提示
        }
    } else {
        dfangshi.hide(); //隐藏提示
    }
}
//优惠券radio点击时
function radioyouhuiclick(youhuiprice) {
    hidyouhuiprice.val(youhuiprice); //为隐藏表单优惠券赋值
}
//点击使用按钮使用优惠券
function ShiYongYouHuiQuan() {
    var yunsongtype = $(":radio[name='sendType']:checked").length; //选择优惠券时必须先选中运送方式
    if (yunsongtype == 0) {
        alert("请选择运送方式");
        return;
    }
    var youhuitype = $(":radio[name='Coupon']:checked").length; //选中优惠券radio
    if (youhuitype == 0) {
        alert("请选择优惠券");
        return;
    }

    var hidfuwutemp = hidfuwu.val(); //从隐藏表单中获取服务费价格
    var yingfutemp = hidyingfu.val(); //从隐藏表单中获取应付总额价格
    var youhuipricetemp = hidyouhuiprice.val(); //从隐藏表单中获取优惠券价格

    var flfuwu = parseFloat(hidfuwutemp); //转换为浮点数
    var flyouhuiprice = parseFloat(youhuipricetemp); //转换为浮点数
    var flyingfu = parseFloat(yingfutemp); //转换为浮点数

    if (flyouhuiprice < flfuwu) { //当优惠券金额小于服务费时，优惠券抵消部分服务费
        dikoufei.text(flyouhuiprice.toFixed(2) + "元"); //显示抵扣费
        flyingfu = flyingfu - flyouhuiprice; //计算应付总额
        youhuiquandikou.text("￥" + flyouhuiprice.toFixed(2)); //显示使用了多少优惠券金额
    } else {//当优惠券金额大于或等于服务费时，则该优惠券全部抵扣服务费，多余金额将不退
        dikoufei.text(flfuwu.toFixed(2) + "元"); //显示抵扣费
        flyingfu = flyingfu - flfuwu; //计算应付总额
        youhuiquandikou.text("￥" + flfuwu.toFixed(2)); //显示使用了多少优惠券金额
    }
    yingfufei.text(flyingfu.toFixed(2) + "元"); //显示应付总额

    $("#divyouhuiquan").hide(); //隐藏选择优惠券列表
}

//点击外面使用优惠券链接按钮
function linkshiyonghouhuiquan(obj) {
    //如果有2个运单的话，则显示扣除服务费高的那个运单
    var sendType = $(":radio[name='sendType']:checked").parent().next();
    var sendTypeLength = sendType.find("table:eq(0)").find("tbody:eq(0)").find("tr").length;
    if (sendTypeLength > 1) {
        //显示提示
        //显示内容设定
        var result = "";
        var paomin = sendType.find(".paomin:eq(0)>div");
        $.each(paomin, function(i, item) {
            //运送方式名称
            var name = $(item).find("div:eq(0)>h2").html().replace("商品清单", "");
            //服务费
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
//取消使用优惠券
function QuXiaoYouHuiQuan() {
    var dival = hiddikou.val(); //获取隐藏表单抵扣费
    var yingval = hidyingfu.val(); //获取隐藏表单应付总额
    if (dival != "" && yingval != "") {//不为空
        dikoufei.text(dival + "元"); //还原价格
        yingfufei.text(yingval + "元");
    }
    $(":radio[name='Coupon']").removeAttr("checked"); //移除选中的优惠券radio
}

//取消优惠券层关闭要判断是否有选中
function closeyouhuiceng() {
    $(":radio[name='Coupon']").removeAttr("checked"); //移除选中的优惠券radio

    //显示使用优惠券文字
    $("#pshiyongyouhuiquan").fadeIn("slow");
    $("#pquxiaoyouhuiquan").hide(); //隐藏取消优惠券文字
    $("#divyouhuiquan").hide(); //隐藏选择优惠券列表
}
//展开隐藏更多运送方式
function azhankai() {
    $("tr[id^='trextop']").slideDown("slow");
    $("#azhankai").parent().hide();
}