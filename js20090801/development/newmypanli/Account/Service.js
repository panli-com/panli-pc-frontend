var type = 0;
$("input:text").focus(function() { $(this).removeClass('red'); });
function selectPanel(i) {
    type = i;
    $(".b_2").hide();
    $("#t" + i).show();
}

function t1check() {
    var dom = $("input:eq(0)", "#t1");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        $("em:eq(0)", "#t1").addClass("red").text("请填写您的汇款金额！");
        return false;
    }
    dom = $("input:eq(1)", "#t1");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇款银行名称！</em>');
        return false;
    }
    dom = $("input:eq(2)", "#t1");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇款人姓名！</em>');
        return false;
    }
    dom = $("input:eq(3)", "#t1");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇款人姓名！</em>');
        return false;
    }
    dom = $("input:eq(4)", "#t1");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇入银行名称！</em>');
        return false;
    }
    dom = $("input:eq(5)", "#t1");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇入银行卡号！</em>');
        return false;
    }
    $("#content").val("汇款金额：" + $("input:eq(0)", "#t1").val() + $("#moneyType").val() + "\r\n汇款银行名称：" + $("input:eq(2)", "#t1").val() + "\r\n汇款人姓名：" + $("input:eq(3)", "#t1").val() + "(名字)" + $("input:eq(4)", "#t1").val() + "(姓氏)\r\n汇入银行的名称：" + $("input:eq(5)", "#t1").val() + "\r\n汇入银行的卡号：" + $("input:eq(6)", "#t1").val());
    return true;
}

function t2check() {
    var dom = $("input:eq(0)", "#t2");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        $("em:eq(0)", "#t2").addClass("red").text("请填写您的汇款金额！");
        return false;
    }
    dom = $("input:eq(1)", "#t2");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        $("em:eq(0)", "#t2").addClass("red").text("请填写您的外币单位！");
        return false;
    }
    dom = $("input:eq(2)", "#t2");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇款国家/地区！</em>');
        return false;
    }
    dom = $("input:eq(3)", "#t2");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇款人姓名！</em>');
        return false;
    }
    dom = $("input:eq(4)", "#t2");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇款人姓名！</em>');
        return false;
    }
    dom = $("input:eq(5)", "#t2");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        $("em:eq(1)", "#t2").addClass("red").text("请填写您的mtcn号码！");
        return false;
    }

    $("#content").val("汇款金额：￥" + $("input:eq(0)", "#t2").val() + "(金额)，" + $("input:eq(1)", "#t2").val() + "(外币单位)\r\n汇款国家/地区：" + $("input:eq(2)", "#t2").val() + "\r\n汇款人姓名：" + $("input:eq(3)", "#t2").val() + "(名字)，" + $("input:eq(4)", "#t2").val() + "(姓氏)\r\nmtcn号码：" + $("input:eq(5)", "#t2").val());
    return true;
}

function t3check() {
    if ($("input:checked", "#t3").length <= 0) {
        alert("请选择您的充值平台！");
        return false;
    }
    if (($.trim($("input:eq(2)", "#t3").val()) + $.trim($("input:eq(3)", "#t3").val())).length <= 0) {
        $("input:eq(2)", "#t3").addClass("red");
        $(".gao:eq(0)", "#t3").next("em").addClass("red").text("请填写您的充值金额或订单号！");
        return false;
    }
    var chongzhipingtai = $("input:checked","#t3").val();
    var chongzhijine = $(".hui:eq(0)").find("input").val();
    var dingdanhao = $.trim($(".hui:eq(1)").find("input").val());
    var zhifuxinxi = $(".hui:eq(2)").find("input").val();
    if (chongzhipingtai == "支付宝") {
        $("#content").val("充值平台：" + chongzhipingtai + "\r\n充值金额：￥" + chongzhijine + "\r\n交易号：" + dingdanhao + "\r\n支付信息：" + zhifuxinxi);
    } else {
        $("#content").val("充值平台：" + chongzhipingtai + "\r\n充值金额：￥" + chongzhijine + "\r\n交易号：" + dingdanhao);
    }
    //$("#content").val("充值平台：￥" + $("input:checked", "#t3").val() + "\r\n充值金额：" + $.trim($("input:eq(2)", "#t3").val()) + "\r\n订单号：" + $.trim($("input:eq(3)", "#t3").val()));
    return true;
}
function t4check() {
    var dom = $("input:eq(0)", "#t4");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        $("em:eq(0)", "#t4").addClass("red").text("请填写您的汇款金额！");
        return false;
    }
    dom = $("input:eq(1)", "#t4");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            $(".gao:eq(1)", "#t4").after('<em class="red"></em>').next("em").text("请填写您的paypal充值帐号！");
        return false;
    }
    dom = $("input:eq(2)", "#t4");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        $("em:last", "#t4").addClass("red").text("请填写您的充值交易号！");
        return false;
    }
    $("#content").val("汇款金额：$" + $("input:eq(0)", "#t4").val() + "\r\npaypal充值帐号：" + $("input:eq(1)", "#t4").val() + "\r\n充值交易号：" + $("input:eq(2)", "#t4").val());
    return true;
}
function t5check() {
    var dom = $("input:eq(0)", "#t5");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        $("em:eq(0)", "#t5").addClass("red").text("请填写您的汇款金额！");
        return false;
    }
    dom = $("input:eq(1)", "#t5");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇款银行名称！</em>');
        return false;
    }
    dom = $("input:eq(2)", "#t5");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇款人姓名！</em>');
        return false;
    }
    dom = $("input:eq(3)", "#t5");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇入银行名称！</em>');
        return false;
    }
    $("#content").val("汇款金额：￥" + $("input:eq(0)", "#t5").val() + "\r\n汇款银行名称：" + $("input:eq(1)", "#t5").val() + "\r\n汇款人姓名：" + $("input:eq(2)", "#t5").val() + "\r\n汇入银行的名称：" + $("input:eq(3)", "#t5").val());
    return true;
}
function t6check() {
    var dom = $("#az_amount", "#t6");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        $("#az_amount_tip", "#t6").addClass("red").text("请填写您的汇款金额！");
        return false;
    }
    dom = $("#az_ibanname", "#t6");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇款银行名称！</em>');
        return false;
    }
    dom = $("#az_lname", "#t6");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇款人姓名！</em>');
        return false;
    }
    dom = $("#az_fname", "#t6");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇款人姓名！</em>');
        return false;
    }
    dom = $("#az_bakbsb", "#t6");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇入银行BSB号！</em>');
        return false;
    }
    dom = $("#az_bakcar", "#t6");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇入银行卡号！</em>');
        return false;
    }
    $("#content").val("汇款金额：" + $("#az_amount", "#t6").val() + "AUD" + "\r\n汇款银行名称：" + $("#az_ibanname", "#t6").val() + "\r\n汇款人姓名：" + $("#az_lname", "#t6").val() + "(名字)" + $("#az_fname", "#t6").val() + "(姓氏)\r\n汇入银行的名称：" + $("input[type=radio][name=abouchementBank]:checked", "#t6").val() + "\r\n汇入银行BSB号：" + $("#az_bakbsb", "#t6").val() + "\r\n汇入银行的卡号：" + $("#az_bakcar", "#t6").val());
    return true;
}
function t7check() {
    var dom = $("input:eq(0)", "#t7");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        $("em:eq(0)", "#t7").addClass("red").text("请填写您的汇款金额！");
        return false;
    }

    dom = $("input:eq(1)", "#t7");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇款人姓名！</em>');
        return false;
    }
    dom = $("input:eq(2)", "#t7");
    if ($.trim(dom.val()).length <= 0) {
        dom.addClass("red");
        if (dom.parent().next("em").length <= 0)
            dom.parent().after('<em class="red">请填写您的汇款人姓名！</em>');
        return false;
    }

    var bankName = "澳洲墨尔本City办事处";
    $("#content").val("汇款金额：" + $("input:eq(0)", "#t7").val() + "AUD" + "\r\n汇款银行名称：" + bankName + "\r\n汇款人姓名：" + $("input:eq(1)", "#t7").val() + "(名字)" + $("input:eq(2)", "#t7").val() + "(姓氏)\r\n备注：" + $("input:eq(3)", "#t7").val());
    return true;
}

function checkName() {
    if ($.trim($("#username").val()).length <= 0) {
        $("#username").addClass("red");
        if ($("#username").next("p").length <= 0)
            $("#username").after('<p class="red">请填写panli用户名！</p>');
        return false;
    }

    $.ajax({
        type: "POST",
        url: "/App_Services/wsMember.asmx/CheckUserEmailOrUserName",
        async: true,
        dataType: "json",
        contentType: "application/json;utf-8",
        data: "{s:\"" + $("#username").val() + "\"}",
        timeout: 5000,
        error: function() { alert("网络错误，请稍后重试。"); },
        success: function(r) {
            if (!r.d) {
                $("#username").addClass("red");
                if ($("#username").next("p").length <= 0)
                    $("#username").after('<p class="red">用户名不存在,请确认填写无误！</p>');
                else
                    $("#username").addClass("red").next('p').text('用户名不存在,请确认填写无误！');
                return false;
            }
            if (checkAll()) {
                $("form").submit();
            }
        }
    });
}

function checkAll() {
    var email = $.trim($("#email").val());
    if (email.length <= 0) {
        $("#email").addClass("red");
        if ($("#email").next("p").length <= 0)
            $("#email").after('<p class="red">请输入您的Email联系地址！</p>');
        else
            $("#email").addClass("red").next('p').text('请输入您的常用Email地址！');
        return false;
    }
    if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)) {
        $("#email").addClass("red");
        if ($("#email").next("p").length <= 0)
            $("#email").after('<p class="red">Email地址格式错误！</p>');
        else
            $("#email").addClass("red").next('p').text('Email地址格式错误！');
        return false;
    }



    if ($.trim($("#date").val()).length <= 0) {
        $("#date").addClass("red");
        if ($(".riqi").next("p").length <= 0)
            $(".riqi").after('<p class="red">请选择您的充值日期！</p>');
        return false;
    }
    if ($("input:checked", "#typelist").length <= 0) {
        alert("请选择您的充值方式！");
        return false;
    }

    //当选择国际信用卡或国内银行卡输入金额必须输入
    var typelistId = $("#typelist");
    var checkedval = $(typelistId).find(":checked").val();

    if (checkedval == "国际信用卡支付" || checkedval == "国内银行卡支付") {
        //必须选择充值平台
        var t3cls = $("input:checked","#t3").length;
        if (t3cls == 0) {
            alert("请选择充值平台");
            return false;
        }
        
        var huieq = $(".hui:eq(0)").find("input").val();
        if (huieq == "") {
            alert("请输入您的充值金额");
            return false;
        }
    }
    
    switch (type) {
        case 1: return t1check(); 
        case 2: return t2check(); 
        case 3: return t3check();
        case 4: return t4check();
        case 5: return t5check();
        case 6: return t6check();
        case 7: return t7check();
        default: return false;
    }
}

$('#date').datepick({ maxDate: 0, closeAtTop: false, showDefault: false, showOn: 'both', buttonImageOnly: true, buttonImage: 'http://sf.panli.com/FrontEnd/images20090801/newmypanli/RmbAccount/guojia.gif' });
$(".datepick-trigger").click(function(e) { $(".riqi").next('p').remove(); }); 