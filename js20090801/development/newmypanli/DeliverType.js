function selectAddress(dom) {
    $("#adressList li").removeAttr("class");
    var d = $("#adressList input:checked").parent("li").attr("class", "on").find(".you");
    if ($("#adressList input:checked").val() != "0") {
        var s = d.find(".AddressConsignee").text();
        $("#Consignee").val(s.substring(s.indexOf("：") + 1, s.length));
        s = d.find(".AddressTelephone").text();
        $("#Telephone").val(s.substring(s.indexOf("：") + 1, s.length));
        s = d.find(".AddressCountry").text();
        $("#Country").val(s.substring(s.indexOf("：") + 1, s.length));
        s = d.find(".AddressCity").text();
        $("#City").val(s.substring(s.indexOf("：") + 1, s.length));
        s = d.find(".AddressAll").text();
        $("#Address").val(s.substring(s.indexOf("：") + 1, s.length));
        s = d.find(".AddressPostcode").text();
        $("#Postcode").val(s.substring(s.indexOf("：") + 1, s.length));
    } else {
        $("#Consignee").val("");
        $("#Telephone").val("");
        $("#Country").val("111");
        $("#City").val("");
        $("#Address").val("");
        $("#Postcode").val("");
    }
    $("#userinfo p").remove();
    $("#userinfo .red").removeClass("red");
}
function showAll() {
    if ($('#adressList li:hidden').length > 0)
        $('#adressList li').show();
    else
        $('#adressList li:gt(2)').hide();
    $('#adressList li:last').show();
}

function selectSendType(f, dom) {
    //服务费商品部分
    var s = parseFloat($("#DeliverServicePreic").val());
    //团购商品优惠
    var g = parseFloat($("#GroupServicePrice").val());
    //折扣值
    var discount = parseFloat($("#DeliverDiscount").val());
    //服务费
    $("#ServicePrice").text((f * 0.1 + s).toFixed(2));
    //优惠券面额
    var p = $("#userCoupon :checked").length > 0 ? parseFloat($("#" + $("#userCoupon :checked").val()).val()) : 0;
    //优惠券实际使用金额
    var c = p < (f * 0.1 + s - g) ? p : s;


    if ($("#prompt").length > 0 && $("#isUseCoupon").val() != '1')
        $("#prompt").css("color", "#333333").html('本次运单服务费为<span>￥' + $("#ServicePrice").text() + '</span>，您可以使用优惠券抵扣部分服务费！<a href="javascript:;" onclick="showCoupon()">(+)使用优惠券抵</a>');
    $("#Freight").html(f.toFixed(2) + "元");
    $("#usedCoupon").html((c + ((f * 0.1 + s) - c) * (1 - discount)).toFixed(2));
    $("#SendPrice").show();
    $("#FreightPrice").html(f.toFixed(2));
    $(".sendType").removeClass("in");
    $(dom).addClass("in").find(".u1 input").attr("checked", true);
    $("#sendTypeName").html($(dom).find(".u2").text());
    caclPrice();
}

function selectarea(t) {
    $("#SendPrice,#temp20100629").hide();
    $(".sendType").remove();
    var id = $("#areaList input:checked").val();
    if (t) {
        if (id == 20) {
            $("#temp20100629 h3").html('您选择的所在地区为：荷兰');
            $("#temp20100629 p").html('很遗憾，由于目前荷兰不支持EMS运送，而含有礼品的运单只能选择EMS。如有疑问，请与客服人员联系。');
            $("#temp20100629,#DType,.lm_").show(); return;
        }
    }
    $.ajax({
        type: "POST",
        url: "/App_Services/wsEstimates.asmx/GetDeliverType",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: "{cid:" + id + "}",
        timeout: 10000,
        error: function() { alert("网络错误，请稍后再试！"); },
        success: function(r) {
            var list = eval(r.d);
            $(".sendType").remove();
            $.each(list, function(i, d) { d.szSendTypeName = d.szSendTypeName.replace("（", "<i>(").replace("）", ")</i>"); $("#DType table").append('<tr class="sendType" onclick="selectSendType(' + d.Freight + ',this)" ><td class="u1"><input type="radio" name="sendType" value="' + d.nSendTypeID + '" /></td><td class="u2">' + d.szSendTypeName + '</td><td class="u3">' + $("#areaList input:checked").attr("country") + '</td><td class="u4">' + d.BPrice.toFixed(2) + '<span>(' + d.BWeight + '克)</span></td><td class="u5">' + d.UPrice.toFixed(2) + '<span>(每续重' + d.UWeight + '克或其零数)</span></td><td class="u6">' + d.Entry.toFixed(2) + '</td></tr>'); });
            $("#DType,.lm_").show();
            if ($(".sendType").length == 1) { selectSendType(list[0].Freight, $(".sendType")[0]); }
        }
    });
}

function caclPrice() {
    $("#totalPrice").html((parseFloat($("#ServicePrice").text()) + parseFloat($("#FreightPrice").text()) + parseFloat($("#StorePrice").text()) - parseFloat($("#usedCoupon").text())).toFixed(2) + "元");
}
function showCoupon() { $("#prompt").hide(); $("#couponPanel").show(); }
function hideCoupon() { $("#prompt").show(); $("#couponPanel").hide(); }
function useCoupon() {
    if ($("#" + $("#userCoupon :checked").val()).length > 0) {
        //优惠券面额
        var p = parseFloat($("#" + $("#userCoupon :checked").val()).val());
        //团购商品优惠
        var g = parseFloat($("#GroupServicePrice").val());
        //折扣值
        var discount = parseFloat($("#DeliverDiscount").val());
        //服务费总额
        var s = parseFloat($("#ServicePrice").text());
        //优惠券实际使用金额
        var c = p < (s - g) ? p : s;
        $("#usedCoupon").html((c + (s - c) * (1 - discount) + g).toFixed(2));
        $("#isUseCoupon").val("1");
        $("#couponPanel").hide();
        $("#prompt").css("color", "#339933").html('您成功使用优惠券抵扣服务费：<span>￥' + (p < s ? p : s).toFixed(2) + '</span>&nbsp;&nbsp;<a href="javascript:;" onclick="cancelCoupon()">取消使用优惠券</a>').show();
        caclPrice();
    } else {
        alert("请正确选择您要使用的优惠券。");
    }
}
function cancelCoupon() {
    //团购商品优惠
    var g = parseFloat($("#GroupServicePrice").val());
    //服务费总额
    var s = parseFloat($("#ServicePrice").text());
    //折扣值
    var discount = parseFloat($("#DeliverDiscount").val());
    $("#usedCoupon").html((s * (1 - discount) + g).toFixed(2));
    $("#userCoupon :checked").removeAttr("checked");
    $("#isUseCoupon").val(0);
    $("#prompt").css("color", "#333333").html('本次运单服务费为<span>￥' + $("#ServicePrice").text() + '</span>，您可以使用优惠券抵扣部分服务费！<a href="javascript:;" onclick="showCoupon()">(+)使用优惠券抵</a>');
    caclPrice();
}

function checkAll() {
    if ($.trim($("#Consignee").val()).length <= 0) {
        if ($("#Consignee").next("p").length <= 0)
            $("#Consignee").attr("class", "red").after('<p class="red">请输入收货人姓名</p>');
        $(window).scrollTop($("#Consignee").offset().top - 20);
        return false;
    }
    if ($.trim($("#Telephone").val()).length <= 0) {
        if ($("#Telephone").next("p").length <= 0)
            $("#Telephone").attr("class", "red").after('<p class="red">请输入收货人电话</p>');
        $(window).scrollTop($("#Telephone").offset().top - 20);
        return false;
    }
    if ($("#Country").val() == "111") {
        if ($("#Country").next("p").length <= 0)
            $("#Country").after('<p class="red">请选择您所在的国家或地区</p>');
        $(window).scrollTop($("#Country").offset().top - 20);
        return false;
    }
    if ($.trim($("#City").val()).length <= 0) {
        if ($("#City").next("p").length <= 0)
            $("#City").attr("class", "red").after('<p class="red">请输入您所在的城市</p>');
        $(window).scrollTop($("#City").offset().top - 20);
        return false;
    }
    if ($.trim($("#Address").val()).length <= 0) {
        if ($("#Address").next("p").length <= 0)
            $("#Address").attr("class", "red k").after('<p class="red">请输入您收货的详细地址</p>');
        $(window).scrollTop($("#Address").offset().top - 20);
        return false;
    }
    if ($.trim($("#Postcode").val()).length <= 0) {
        if ($("#Postcode").next("p").length <= 0)
            $("#Postcode").attr("class", "red").after('<p class="red">请输入邮政编码</p>');
        $(window).scrollTop($("#Postcode").offset().top - 20);
        return false;
    }
    if ($("#areaList input:checked").length <= 0) {
        $(window).scrollTop($("#areaList").offset().top - 20);
        alert("请选择运送区域");
        return false;
    }
    if ($("#DType input:checked").length <= 0) {
        $(window).scrollTop($("#DType").offset().top - 20);
        alert("请选择运送方式");
        return false;
    }
    return true;
}

$(function() {
    $("#adressList input:eq(0)").click();
    $("#areaList input").attr("checked", false);
    $("form").submit(function() {
        var res = checkAll();
        if (res) {
            $("input:text,textarea").each(function(i, d) { $(d).val(HtmlEncode($(d).val())); });
        }
        return res;
    });
    $("#submitbtn").removeAttr("disabled");
    $("input").each(function() { $(this).keydown(function(e) { if (e.keyCode == 13) return false; }); });
});
