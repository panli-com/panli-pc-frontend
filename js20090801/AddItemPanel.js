function p1UnLock() {
    $(".addpanel_address_").attr("class", "addpanel_address");
    $("#addpanel_submit").removeAttr("disabled");
    $("#itemUrl").removeAttr("disabled");
}

function p1Lock() {
    $("#itemUrl").attr("disabled", "disabled");
    $(".addpanel_address").attr("class", "addpanel_address_");
}

function noPrice(price) {
    if (price != -1)
        $("#productPrice").val(price).attr("disabled", "disabled").attr("class", "addpanel_hui");
    else {
        $("#productPrice").attr("class", "addpanel_red").focus(function() { if ($(this).attr("class") == "addpanel_red") $(this).val(""); $(this).attr("class", ""); }).blur(function() { if ($.trim($(this).val()) <= 0) $(this).attr("class", "addpanel_red").val("请填写商品价格"); disSubBtn(); }).keydown(function() { disSubBtn(); }).val("请填写商品价格");
        $("#proAlert").attr("class", "addpanel_alert").text("系统未能抓取商品相关信息，您可以在输入框中填写相关信息");
    }
}

function disSubBtn() {
    if ($("#productName").attr("class") != "addpanel_red addpanel_k" && $("#productPrice").attr("class") != "addpanel_red" && !$("#productSendPrice").hasClass('addpanel_red')) {
        $("#successBtn").removeAttr("disabled").attr("class", "addpanel_next");
    }
    else {
        $("#successBtn").attr("disabled", "disabled").attr("class", "addpanel_next_no");
    }
}


// 产品抓取成功后数据绑定方法
function buildP2(data) {
    var item = eval("(" + data.d + ")");
    if (data._statusCode == 500) {
        buildP2_fail();
    } else {

        if (item.Name != "")
            $("#productName").val(item.Name).attr("disabled", "disabled").attr("class", "addpanel_hui addpanel_k");
        else {
            $("#productName").attr("class", "addpanel_red addpanel_k").focus(function() { if ($(this).attr("class") == "addpanel_red addpanel_k") $(this).val(""); $(this).attr("class", "addpanel_k"); }).blur(function() { if ($.trim($(this).val()) <= 0) $(this).attr("class", "addpanel_red addpanel_k").val("请填写商品名称"); disSubBtn(); }).keydown(function() { disSubBtn(); }).val("请填写商品名称");
            $("#proAlert").attr("class", "addpanel_alert").text("系统未能抓取商品相关信息，您可以在输入框中填写相关信息");
        }
        if (!item.IsAuction) {
            switch (item.UserGroup) {
                case 0:
                    if (item.Price != -1) {
                        $("#productPrice").val(item.Price).attr("disabled", "disabled").attr("class", "addpanel_hui");
                        if ($("#productName").attr("class") != "addpanel_red") $("#successBtn").removeAttr("disabled").attr("class", "addpanel_next");
                    }
                    else
                        noPrice(-1);
                    break;
                case 1:
                    if (item.VIPPrice1 != -1) {
                        $("#productPrice").val(item.VIPPrice1).attr("disabled", "disabled").attr("class", "addpanel_hui").next("span").after('<span id="vipPriceS" style="color:#fff;background:#66CC00;padding:1px 2px;background:">金卡会员价</span>');
                        if ($("#productName").attr("class") != "addpanel_red") $("#successBtn").removeAttr("disabled").attr("class", "addpanel_next");
                    }
                    else
                        noPrice(item.Price);
                    break;
                case 2:
                    if (item.VIPPrice2 != -1) {
                        $("#productPrice").val(item.VIPPrice2).attr("disabled", "disabled").attr("class", "addpanel_hui").next("span").after('<span id="vipPriceS" style="color:#fff;background:#66CC00;padding:1px 2px;background:">白金卡会员价</span>');
                        if ($("#productName").attr("class") != "addpanel_red") $("#successBtn").removeAttr("disabled").attr("class", "addpanel_next");
                    }
                    else
                        noPrice(item.Price);
                    break;
                case 3:
                    if (item.VIPPrice3 != -1) {
                        $("#productPrice").val(item.VIPPrice3).attr("disabled", "disabled").attr("class", "addpanel_hui").next("span").after('<span id="vipPriceS" style="color:#fff;background:#66CC00;padding:1px 2px;background:">钻石会员价</span>');
                        if ($("#productName").attr("class") != "addpanel_red") $("#successBtn").removeAttr("disabled").attr("class", "addpanel_next");
                    }
                    else
                        noPrice(item.Price);
                    break;
                case 4:
                    if (item.VIPPrice4 != -1) {
                        $("#productPrice").val(item.VIPPrice4).attr("disabled", "disabled").attr("class", "addpanel_hui").next("span").after('<span id="vipPriceS" style="color:#fff;background:#66CC00;padding:1px 2px;background:">皇冠会员价</span>');
                        if ($("#productName").attr("class") != "addpanel_red") $("#successBtn").removeAttr("disabled").attr("class", "addpanel_next");
                    }
                    else
                        noPrice(item.Price);
                    break;
                default:
                    if (item.Price != -1) {
                        $("#productPrice").val(item.Price).attr("disabled", "disabled").attr("class", "addpanel_hui");
                        if ($("#productName").attr("class") != "addpanel_red") $("#successBtn").removeAttr("disabled").attr("class", "addpanel_next");
                    }
                    else
                        noPrice(-1);
                    break;
            }
        }
        else {
            $("#isAuction").show();
            if (item.Price != -1)
                $("#productPrice").val(item.Price).attr("class", "").blur(function() { if ($.trim($(this).val()) < item.Price) $(this).val(item.Price.toString()); });
            else
                $("#productPrice").attr("class", "addpanel_red").focus(function() { if ($(this).attr("class") == "addpanel_red") $(this).val(""); $(this).attr("class", ""); }).blur(function() { if ($.trim($(this).val()) <= 0) $(this).attr("class", "addpanel_red").val("请填写商品价格") }).val("请填写商品价格");
        }

        if (item.Freight != -1)
            $("#productSendPrice").val(item.Freight).attr("class", "addpanel_hui").attr("disabled", "disabled");
        else
        // $("#productSendPrice").val("10").attr("class", "addpanel_red addpanel_wen").focus(function() { $("#question").css("display", "inline"); });

            $("#productSendPrice").val("请填写寄达上海的运费").attr("class", "addpanel_red").removeAttr('disabled');

        if (item.Href != "")
            $("#productUrl").val(item.Href);
        else
            $("#productUrl").val($("#itemUrl").val());

        if (item.Picture != "")
            $("#productImg").css("display", "inline").children("img").attr("src", item.Picture);

        if (item.Thumbnail != "")
            $("#productThumbnail").css("display", "inline").children("img").attr("src", item.Thumbnail);



        disSubBtn();

        // 将商品信息存放到全局变量addItem_productInfo
        addItem_productInfo.Name = $("#productName").val();
        addItem_productInfo.Href = $("#productUrl").val();
        addItem_productInfo.Picture = item.Picture;
        addItem_productInfo.Thumbnail = item.Thumbnail;
        addItem_productInfo.Category = item.Category.Name;
        addItem_productInfo.SubCategory = item.SubCategory.Name;
        addItem_productInfo.ShopName = item.Shop.Name;
        addItem_productInfo.ShopHref = item.Shop.Href;
        addItem_productInfo.Price = item.Price;
        addItem_productInfo.VIPPrice1 = item.VIPPrice1;
        addItem_productInfo.VIPPrice2 = item.VIPPrice2;
        addItem_productInfo.VIPPrice3 = item.VIPPrice3;
        addItem_productInfo.VIPPrice4 = item.VIPPrice4;
        addItem_productInfo.Freight = $("#productSendPrice").val();
        addItem_productInfo.IsAuction = item.IsAuction;
        addItem_productInfo.Shop.Credit = (!item.Shop.Credit) ? -100 : item.Shop.Credit;
        addItem_productInfo.Shop.PositiveRatio = (!item.Shop.PositiveRatio) ? -100 : item.Shop.PositiveRatio;
        addItem_productInfo.Shop.Trueness = (!item.Shop.Trueness) ? -100 : item.Shop.Trueness;
        addItem_productInfo.Shop.ServiceAttitude = (!item.Shop.ServiceAttitude) ? -100 : item.Shop.ServiceAttitude;
        addItem_productInfo.Shop.DeliverySpeed = (!item.Shop.DeliverySpeed) ? -100 : item.Shop.DeliverySpeed;
    }
}

function buildP2_fail() {
    $("#proAlert").attr("class", "addpanel_alert").text("系统未能抓取商品相关信息，您可以在输入框中填写相关信息");
    $("#productUrl").val(/^http(s)?:\/\//g.test($("#itemUrl").val()) ? $("#itemUrl").val() : "http://" + $("#itemUrl").val());
    //$("#productSendPrice").val("10").attr("class", "addpanel_red addpanel_wen").focus(function() { $("#question").css("display", "inline"); });
    $("#productSendPrice").val("请填写寄达上海的运费").attr("class", "addpanel_red").removeAttr('disabled');
    $("#productName").attr("class", "addpanel_red addpanel_k").focus(function() { if ($(this).attr("class") == "addpanel_red addpanel_k") $(this).val(""); $(this).attr("class", "addpanel_k"); }).blur(function() { if ($.trim($(this).val()) <= 0) $(this).attr("class", "addpanel_red addpanel_k").val("请填写商品名称"); disSubBtn(); }).keydown(function() { disSubBtn(); }).val("请填写商品名称");
    $("#productPrice").attr("class", "addpanel_red").focus(function() { if ($(this).attr("class") == "addpanel_red") $(this).val(""); $(this).attr("class", ""); }).blur(function() { if ($.trim($(this).val()) <= 0) $(this).attr("class", "addpanel_red").val("请填写商品价格"); disSubBtn(); }).keydown(function() { disSubBtn(); }).val("请填写商品价格");
    disSubBtn();

    addItem_productInfo.Name = "";
    addItem_productInfo.Href = $("#productUrl").val();
    addItem_productInfo.Picture = "";
    addItem_productInfo.Thumbnail = "";
    addItem_productInfo.Category = "";
    addItem_productInfo.SubCategory = "";
    addItem_productInfo.ShopName = "";
    addItem_productInfo.ShopHref = "";
    addItem_productInfo.Price = 0;
    addItem_productInfo.VIPPrice1 = -1;
    addItem_productInfo.VIPPrice2 = -1;
    addItem_productInfo.VIPPrice3 = -1;
    addItem_productInfo.VIPPrice4 = -1;
    addItem_productInfo.Freight = $("#productSendPrice").val();
    addItem_productInfo.IsAuction = false;
    addItem_productInfo.Shop.Credit = -100;
    addItem_productInfo.Shop.PositiveRatio = -100;
    addItem_productInfo.Shop.Trueness = -100;
    addItem_productInfo.Shop.ServiceAttitude = -100;
    addItem_productInfo.Shop.DeliverySpeed = -100;
}

var addItem_productInfo = {
    "Name": "",
    "Href": "",
    "Picture": "",
    "Thumbnail": "",
    "Category": "",
    "SubCategory": "",
    "ShopName": "",
    "ShopHref": "",
    "Price": -1,
    "VIPPrice1": -1,
    "VIPPrice2": -1,
    "VIPPrice3": -1,
    "VIPPrice4": -1,
    "BuyNum": -1, //此属性暂时无用
    "Freight": -1,
    "IsAuction": false,
    "Shop": { "Credit": -100, "PositiveRatio": -100, "Trueness": -100, "ServiceAttitude": -100, "DeliverySpeed": -100 }
};

//$(document).ready(function() {

var ShowError = function(XMLHttpRequest, textStatus, errorThrown) {
    p1UnLock();
    $("#p1").hide();
    if ($("#p2 div") <= 0) {
        $("#p2").load("/AddItemPanel/AddItemPanel2.html", function() { buildP2_fail(); $("#p2").show(); $("#productRemark").focus(); });
    } else {
        buildP2_fail();
        $("#p2").show();
        $("#productRemark").focus();
    }
    //alert(textStatus);
}
var ShowItemSnapshot = function(data) {
    p1UnLock();
    var error = eval("(" + data.d + ")").Error;
    if (error == "BlockedShop") {
        $("#promptInfo").attr("class", "addpanel_wrong").find("img").remove();
        $("#promptInfo p").html("该商品的卖家为嫌疑商家，请不要代购此商品！<a href=\"http://service.panli.com/Help/Detail/98.html\" target=\"_blank\">什么是嫌疑商家？</a>");
        return;
    }
    if (error == "KeyError") {
        $("#AddItemPanel1_ppmgts").show();
        $("#AddItemPanel1_tishi").hide();
        $("#promptInfo").attr("class", "addpanel_dhk").find("img").remove();
        $("#promptInfo p").text("请将您想代购商品的详细页网址粘贴到输入框中提交!");
        $("#itemUrl").val("");
        return;
    }
    $("#p1").hide();
    if ($("#p2 div").length <= 0) {
        $("#p2").load("/AddItemPanel/AddItemPanel2.html", function() { buildP2(data); $("#productRemark").focus(); });
    } else {
        buildP2(data);
        $("#p2").show();
        $("#productRemark").focus();
    }
}

//输入商品网址后提交方法
var CrawlSubmit = function() {
    var url = $("#itemUrl").val();
    var reg = new RegExp("http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?");
    if (url.length <= 0) {
        $("#promptInfo").attr("class", "addpanel_wrong");
        $("#promptInfo p").text("请输入您想代购商品的详细页网址！");
    }
    else {
        if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1)
            url = "http://" + url;
        if (reg.test(url)) {
            p1Lock();
            $("#addpanel_submit").attr("disabled", "disabled");
            $("#promptInfo").attr("class", "addpanel_loading").prepend("<img src=\"http://sf.panli.com/FrontEnd/images20090801/AddItemPanel/loading.gif\" alt=\"请稍候\" />");
            $("#promptInfo p").text("正在抓取商品信息...");

            $.ajax({
                type: "POST",
                url: "/App_Services/wsAddItem.asmx/GetItemSnapshot",
                dataType: "json",
                contentType: "application/json;utf-8",
                data: "{url:'" + url + "'}",
                timeout: 25000,
                error: ShowError,
                success: ShowItemSnapshot
            });
        }
        else {
            $("#promptInfo").attr("class", "addpanel_wrong");
            $("#promptInfo p").text("输入的网址不正确，请核实后再填写！");
        }
    }
}

$("#addpanel_submit").click(CrawlSubmit);

if ($("#itemUrl").val().length > 0) { CrawlSubmit(); }

$("#itemUrl").keydown(function(e) { if (e.keyCode == 13) { $("#addpanel_submit").click(); return false; } });
//});