var prodata = {};
function step1() { gsItemInit(); $("#fillshopingStep2").hide(); $("#fillshopingStep3").hide(); $("#fillshopingStep1").show(); document.getElementById("myPanli_itemUrl").focus(); }
function step2() { $("#fillshopingStep1").hide(); $("#fillshopingStep3").hide(); $("#fillshopingStep2").show(); }
function step3() { buileS3(); $("#fillshopingStep1").hide(); $("#fillshopingStep2").hide(); $("#fillshopingStep3").show(); }
function buileS3() {
    $("#sp_proTNum").text("0"); $("#sp_proSum").text("0");
    $.ajax({
        type: "POST",
        url: "/App_Services/wsAddItem.asmx/ShoppingCartInfo",
        dataType: "text",
        contentType: "application/json;utf-8",
        data: "{}",
        timeout: 20000,
        error: function (a, b, c) { },
        success: function (data) {
            var v = data.split("#"); $("#sp_proTNum").text(v[1].toString()); $("#sp_proSum").text(v[2].toString());
        }
    });
    $("#sp_proPic").attr("src", prodata.Picture); $("#sp_proName").text($("#gsItemName").val()); $("#sp_proPrice").text("￥" + $("#gsItemPrice").val()); $("#sp_proFright").text($("#gsItemFreight").val()); $("#sp_proNum").text($("#gsItemNum").val());
}

function gsItemInit() {
    $("#myPanli_itemUrl").removeAttr("disabled").val(""); $("#toGetProBtn").removeAttr("disabled").attr("class", "tijiao");
    $('#itemUrlTip').attr("class", "dhk").html("<p>请将您想代购商品的<span>详细页网址</span>粘贴到输入框中提交！</p>");
    $("#gsItemRemark").attr("class", "still").removeAttr("disabled").val("");
    $("#gsItemNum").val("1");
    $("#gsItemName").removeAttr("disabled").val("").attr("class", "text_k");
    $("#gsItemPrice").removeAttr("disabled").val("").attr("class", "text");
    $("#favoriteInfo").hide();
    $("#FillvipPriceS").remove();
    document.getElementById("IsAddToFavorite").checked = false;
    document.getElementById("gsItemRemarkCheck").checked = false;
    $("#FillShoppingForm_ppmgts").hide();
}

function checkAll() {
    if ($("#gsItemUrl").val().length > 0 && $("#gsItemName").attr("class") != "text_k red" && !$("#gsItemFreight").hasClass('red') && $("#gsItemPrice").attr("class") != "text red") {
        if (($("#gsItemRemark").val().length > 0 && $("#gsItemRemark").attr("class") != "red") || document.getElementById("gsItemRemarkCheck").checked)
            return true;
        else
        { $("#gsItemRemark").attr("class", "red").val("请填写备注"); return false; }
    }
    else
        return false;
}

function remarkChangeCheck() {
    if (document.getElementById("gsItemRemarkCheck").checked) $("#gsItemRemark").attr("disabled", "disabled").attr("class", "hui").val("我对此商品无任何特殊备注。");
    else $("#gsItemRemark").removeAttr("disabled").attr("class", "still").val("");
}

function noPrice(price) {
    if (price >= 0) { $("#gsItemPrice").attr("class", "text").val(price).unbind("blur").blur(function () { var p = $(this).val(); try { if (p.length <= 0 || parseFloat(p) < price) $(this).val(price.toString()); } catch (e) { $(this).val(price.toString()); } }); }
    else { $("#gsItemPrice").attr("class", "text red").val("请填写商品价格"); }
}

function checkInput(dom, str) { if ($.trim($(dom).val()).length <= 0) $(dom).attr("class", "text red").val(str); }

function checkItemName(dom) {
    if ($.trim($(dom).val()).length <= 0) $(dom).attr("class", "text_k red").val("请填写商品名称");
}

var GetSuccess = function (data) {
    prodata = $.parseJSON(data.d);
    prodata.DiscountExpiredDate = prodata.ClientDate; //兼容反序列化问题
    if (prodata.Error == "BlockedShop") { gsItemInit(); $("#myPanli_itemUrl").val(prodata.ProductUrl); $('#itemUrlTip').attr("class", "wrong").html("<p style=\"width:405px;\">该商品的卖家为嫌疑商家，请不要代购此商品！<a href=\"/Help/Detail.aspx?hid=98\" target=\"_blank\">什么是嫌疑商家？</a></p>"); return; }
//    if (prodata.Error == "KeyError") {
//        $("#FillShoppingForm_ppmgts").show();
//        $("#myPanli_itemUrl").removeAttr("disabled").val(""); $("#toGetProBtn").removeAttr("disabled").attr("class", "tijiao");
//        $('#itemUrlTip').attr("class", "dhk").html("<p>请将您想代购商品的<span>详细页网址</span>粘贴到输入框中提交！</p>");
//        return;
    //    }
    if (prodata.Error == "KeyError") {
        $(".wangzhi p").eq(0).addClass("newalert").html('您代购的商品中含有仿牌和违禁品信息，我们将在审核后为您代购 &nbsp;<a  href="http://service.panli.com/Help/Detail/331.html" target="_blank">了解详情</a>');
    } else {
        $(".wangzhi p").eq(0).removeClass("newalert").html('温馨提示：如果代购商品信息未能抓取（或信息不完整），请您填写商品相关信息！');
    }

    if (prodata.ProductUrl != "") $("#gsItemUrl").val(prodata.ProductUrl);
    else $("#gsItemUrl").val($("#myPanli_itemUrl").val());
    if (prodata.ProductName != "") $("#gsItemName").attr("class", "text_k hui").attr("disabled", "disabled").val(prodata.ProductName);
    else $("#gsItemName").attr("class", "text_k red").val("请填写商品名称");
    $("#gsItemImg").attr("src", prodata.Picture).attr("alt", prodata.ProductName);
    if (prodata.IsAuction) {
        $("#gsItemAuction").attr("checked", "checked"); noPrice(prodata.Price); $(".paimai").show();
    }
    else
        switch (prodata.UserGroup) {
        case 4: if (prodata.Vip4Price > 0) { $("#gsItemPrice").attr("disabled", "disabled").attr("class", "text hui").val(prodata.Vip4Price).next("span").after('<span id="FillvipPriceS" style="color:#fff;background:#66CC00;padding:1px 2px;background:">皇冠会员价</span>'); break; }
        case 3: if (prodata.Vip3Price > 0) { $("#gsItemPrice").attr("disabled", "disabled").attr("class", "text hui").val(prodata.Vip3Price).next("span").after('<span id="FillvipPriceS" style="color:#fff;background:#66CC00;padding:1px 2px;background:">钻石会员价</span>'); break; }
        case 2: if (prodata.Vip2Price > 0) { $("#gsItemPrice").attr("disabled", "disabled").attr("class", "text hui").val(prodata.Vip2Price).next("span").after('<span id="FillvipPriceS" style="color:#fff;background:#66CC00;padding:1px 2px;background:">白金卡会员价</span>'); break; }
        case 1: if (prodata.Vip1Price > 0) { $("#gsItemPrice").attr("disabled", "disabled").attr("class", "text hui").val(prodata.Vip1Price).next("span").after('<span id="FillvipPriceS" style="color:#fff;background:#66CC00;padding:1px 2px;background:">金卡会员价</span>'); break; }
        default: if (prodata.Price > 0) $("#gsItemPrice").attr("disabled", "disabled").attr("class", "text hui").val(prodata.Price); else noPrice(-1); break;
    }

    if (prodata.Freight >= 0) $("#gsItemFreight").attr("disabled", "disabled").attr("class", "text hui").val(prodata.Freight); else $("#gsItemFreight").removeAttr("disabled").attr("class", "text red").val("请填写寄达上海的运费");
    step2();
}

var GetFail = function (prodata) {
    prodata = {
        ID: 1, //服务器用，临时存放ID
        BuyNum: 1, //购买数量
        Category: "", //一级类目
        Description: "", //描述
        Error: "", //返回的错误信息
        Freight: 0, //运费
        IsAuction: false, //是否拍卖
        IsBook: false, //是否书籍
        IsCombinationMeal: false, //是否组合套装
        DiscountPrice: "", //活动折扣价
        DiscountExpiredSeconds: 0, //折扣价过期时间(剩余秒数)
        DiscountExpiredDate: '2012-1-1 12:00:00', //折扣价过期时间
        Price: -1, //商品价格                
        //IsFreightFree: false, //是否免运费
        Picture: "", //图片地址
        ProductName: "", //商品名称
        ProductUrl: "", //商品链接
        Remark: "", //商品备注
        Source: "", //来源
        Shop: {
            KeeperName: "",
            ShopName: "", //店铺名称
            ShopUrl: "", //店铺地址
            Credit: -1, //信用
            DeliverySpeed: -1, //物流速度
            Instruction: "", //？？？
            IsAccurate: false, //
            PositiveRatio: -1, //
            ServiceAttitude: -1, //
            Trueness: -1, //
            Site: {
                SiteName: "",
                SiteUrl: ""
            }
        }, //商家信息
        Site: {
            SiteName: "",
            SiteUrl: ""
        }, //站点信息
        Thumbnail: "", //缩略图
        UserGroup: 0, //用户VIP等级
        Vip1Price: -1,
        Vip2Price: -1,
        Vip3Price: -1,
        Vip4Price: -1,
        Skus: [], //SKU
        SkuCombinations: []//SKU组合
    };
    $("#gsItemName").attr("class", "text_k red").val("请填写商品名称");
    $("#gsItemPrice").attr("class", "text red").val("请填写商品价格");
    $("#gsItemFreight").removeAttr("disabled").attr("class", "text red").val("请填写寄达上海的运费");
    $("#gsItemUrl").val(/^http(s)?:\/\//g.test($("#myPanli_itemUrl").val()) ? $("#myPanli_itemUrl").val() : "http://" + $("#myPanli_itemUrl").val());
    step2();
}

function step1Lock() {
    $("#myPanli_itemUrl").attr("disabled", "disabled");
    $("#toGetProBtn").attr("disabled", "disabled");
}
function toGetPro() {
    var url = $("#myPanli_itemUrl").val();
    if (url.length <= 0) { $('#itemUrlTip').attr("class", "wrong").html("<p>请输入您想代购商品的详细页网址！</p>"); return; }
    if (url.indexOf("http://") <= -1 && url.indexOf("https://") <= -1) url = "http://" + url;

    if (new RegExp("http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?").test(url)) {
        //        step1Lock();
        //        $('#itemUrlTip').attr("class", "loading").html('<img src="http://sf.panli.com/FrontEnd/images20090801/newmypanli/fillShoppingForm/loading.gif" alt="加载中" /><p>正在抓取商品信息...</p>');
        //        $.ajax({
        //            type: "POST",
        //            url: "/App_Services/wsAddItem.asmx/GetItemSnapshot",
        //            dataType: "json",
        //            contentType: "application/json;utf-8",
        //            data: '{"url":"' + url + '"}',
        //            timeout: 25000,
        //            error: GetFail,
        //            success: GetSuccess
        //        });
        window.location.href = "/Crawler.aspx?purl=" + encodeURIComponent(url);

    }
    else { $('#itemUrlTip').attr("class", "wrong").html("<p>输入的网址不正确，请核实后再填写！</p>"); return; }
}

function toShoppingCart() {
    if (!checkAll()) return;
    prodata.Price = prodata.Price < 0 ? $('#gsItemPrice').val() : prodata.Price;

    //Tom 2013-4-28 Add
    prodata.ProductName = $("#gsItemName").val();
    prodata.Remark = $("#gsItemRemark").val();
    prodata.BuyNum = $("#gsItemNum").val();

    $.ajax({
        type: "POST",
        url: "/App_Services/wsAddItem.asmx/AddToShoppingCart",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: JSON.stringify({ "json": JSON.stringify(prodata) }),
        timeout: 10000,
        error: function () { alert("网络错误，请稍后再试"); },
        success: function (d) { if (d.d) step3(); else alert("您提交的商品信息有误。"); }
    });

    if (document.getElementById("IsAddToFavorite").checked) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsFavorite.asmx/AddFavorite",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{name:'" + HtmlEncode($("#gsItemName").val()) + "',href:'" + $("#gsItemUrl").val() + "',picture:'" + prodata.Thumbnail + "',price:" + prodata.Price + ",shopName:'" + prodata.Shop.Name + "',shopHref:'" + prodata.Shop.Href + "',remark:'',tags:'',siteName:'" + prodata.Shop.Name + "'}",
            timeout: 5000,
            error: function () { $("#favoriteInfo").text("商品未能添加至收藏夹").show(); },
            success: function () { $("#favoriteInfo").text("商品已成功添加至收藏夹").show(); }
        });
    }
}

$(document).ready(function () {
    $("#myPanli_itemUrl").keydown(function (e) { if (e.keyCode == 13) { toGetPro(); return false; } });
    document.getElementById("myPanli_itemUrl").focus();
});