//截取中英文混合字符串方法
String.prototype.sub = function(n) {
    var r = /[^\x00-\xff]/g;
    if (this.replace(r, "mm").length <= n)
        return this;
    n = n - 3;
    var m = Math.floor(n / 2);
    for (var i = m; i < this.length; i++) {
        if (this.substr(0, i).replace(r, "mm").length >= n) {
            return this.substr(0, i) + "...";
        }
    } return this;
};
//构造列表页面方法
var buildlist = function(i, jq) {
    //用户优惠券列表，d是总数，是当前页列表
    var couponList = { d: 0, l: [] };
    //优惠券列表表格对象
    var listHtml = $("#messageList");
    $.ajax({
        type: "POST",
        url: "/App_Services/wsMessage.asmx/GetUserMessage",
        cache: false,
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"type":"' + $("#ajaxPager").data("type") + '","key":"' + $("#ajaxPager").data("key") + '","pages":' + i + '}',
        //data: '{"pages":' + i + '}',
        timeout: 15000,
        beforeSend: function() {
            $("#load").show();
            $("#messageList").hide(); 
            $("#noneSearch").hide();
            $("#noneList").hide();
            $("#ajaxPager").hide(); 
        },
        error: function() { alert("网络错误请重新再试") },
        success: function(r) {
            var temp = eval("(" + r.d + ")");
            //如果列表项总数发生变化重构分页器
            if (couponList.n != temp.n) {
                jq.AjaxPager({
                    sum_items: temp.n,
                    current_page: i,
                    items_per_page: 10,
                    callback: buildlist
                });
            }
            //构造列表
            couponList = temp;
            //用户没有短消息
            if (couponList.n <= 0) {
                $("#messageList").hide();
                $("#load").hide();
                if ($("#ajaxPager").data("key") == "") {
                    $("#noneContent").html("您的短信箱中目前没有咨询短信！");
                    if ($("#ajaxPager").data("type") == "Product") $("#noneContent").html("您的短信箱中目前没有商品咨询短信！");
                    if ($("#ajaxPager").data("type") == "Shipment") $("#noneContent").html("您的短信箱中目前没有运单咨询短信！");
                    $("#noneList").show();
                    $("#noneSearch").hide();
                }
                else {
                    $("#searchCotent").html("很抱歉，没有找到与“" + $("#ajaxPager").data("key") + "”相符的短信！<br />是不是输入的商品ID或运单ID有误呢？");
                    $("#noneSearch").show();
                    $("#noneList").hide();
                }
                return;
            }
            if (couponList.l.length > 0) {
                $("#messageList").show();
                var t = $("#messageList");
                t.empty();
                $.each(couponList.l, function(index, items) {
                    var cssClass = "message"; //得到短消息的图标
                    var isBlod = "no_c"; //是否为粗体
                    var showLine = '<a href="showMessage.aspx?id=' + items.n + '">' + items.t + '</a>';
                    var lastContent = "";
                    var title = "";
                    if (items.r != "NewMsg") {
                        cssClass = "already";
                        isBlod = "";
                    }
                    switch (items.m) {
                        case "Shipment":
                            lastContent = "[最后回复]&nbsp;" + items.c.sub(60) + "";
                            cssClass = cssClass + "_yd"; //运单短信
                            title = "运单短信";
                            break;
                        case "Product":
                            lastContent = "[最后回复]&nbsp;" + items.c.sub(60) + "";
                            cssClass = cssClass + "_xt"; //商品短信
                            title = "商品短信";
                            break;
                    }
                    t.append('<li id="l' + items.n + '" onmousemove="$(\'#a' + items.n + '\').show();" onmouseout="$(\'#a' + items.n + '\').hide();"><div class="' + cssClass + '" title="' + title + '"></div><div class="mail"><h1 class="' + isBlod + '">' + showLine + '</h1>' + lastContent + '</div><div class="fasong"><p>' + items.d + '</p></div></li>')
                });
                t.show();
                $("#ajaxPager").show();
                $("#noneSearch").hide();
                $("#noneList").hide();
                $("#load").hide();
            }
        }
    });
}
$(function() {
    $("#ajaxPager").data("type", "");
    $("#ajaxPager").data("key", "");
    buildlist(1, $("#ajaxPager"));

});
function ChangeTypeClass(dom) {
    //$(dom).click(function() {
    $(dom).parent("li").nextAll("li").attr("class", "");
    $(dom).parent("li").prevAll("li").attr("class", "")
    $(dom).parent("li").attr("class", "c_on")
    //})
}
function DoSearch() {
    if ($.trim($("#searchTxt").val()).length > 0 && $.trim($("#searchTxt").val()) != "您可以输入商品ID或运单号进行查找") {
        $("#ajaxPager").data("type", "");
        $("#ajaxPager").data("key", $.trim($("#searchTxt").val()));
        $("#searchTxt").val("");
        buildlist(1, $("#ajaxPager"));
    }
    else {
        $("#ajaxPager").data("type", "");
        $("#ajaxPager").data("key", "");
        buildlist(1, $("#ajaxPager"));
    }
}
$(document).ready(function() {
    $("#searchTxt").keydown(function(e) {
        if (e.keyCode == 13) {
            DoSearch();
            return false;
        }
    });
});