﻿var remarkPanel = '<div class="beizhu"><div style="width: 270px; overflow: hidden; float: left;"><div class="if"><label id="noremarkLb"><input id="noremark" type="checkbox" />无特殊商品备注说明，请勾选此项</label></div><textarea id="remarkContent" cols="" rows=""></textarea><dl><dt><input id="remarkSubmit" type="button" value="提交" /></dt><dd><input id="remarkClose" type="button" onclick="closeRemarkPanel();" value="关闭" /></dd></dl></div><img src="http://sf.panli.com/FrontEnd/images20090801/newmypanli/jiantou.gif" /></div>'; var vPanelIndex = 0; var cacheID = []; function encode(a) { return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/([\\\.\*\[\]\(\)\$\^])/g, "\\$1"); } function decode(a) { return a.replace(/\\([\\\.\*\[\]\(\)\$\^])/g, "$1").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&"); } function del(c, b, a) { if (!confirm("您确定要删除此商品吗")) { return false; } $.ajax({ type: "POST", url: "/App_Services/CartProductProfile.asmx/DeleteOrder", dataType: "json", contentType: "application/json;utf-8", data: "{pID:" + c + "}", timeout: 20000, error: function () { alert("删除失败！！"); }, success: function (d) { if (d.d == 0) { alert("删除失败！"); } else { if (d.d == 1) { if ($("#" + vPanelIndex + "v" + c).siblings("tr").length <= 0) { $("#" + vPanelIndex + "v" + c).closest(".bh").remove(); if ($("#" + vPanelIndex + "v" + c + " .bh").length <= 0) { window.location = window.location; } } else { var e = $("#" + c).closest("table"); $("#" + vPanelIndex + "v" + c).remove(); e.find("tr:even").attr("class", ""); e.find("tr:odd").attr("class", "d"); } } else { if (d.d == 404) { alert("当前状态不能删除！"); } } } } }); } function delFProduct(a) { if (!confirm("您确定要删除此赠品吗？")) { return false; } $.ajax({ type: "POST", url: "/App_Services/CartProductProfile.asmx/RemoveFreeProduct", dataType: "json", contentType: "application/json;utf-8", data: "{id:" + a + "}", timeout: 10000, error: function () { alert("网络错误，请稍后再试！"); }, success: function (b) { if (b.d == "success") { alert("删除成功！您的积分已经退入您的帐户，请查收！"); $(".lipin,.free").remove(); } else { alert("删除失败！"); return false; } } }); }
function changePanel(a) {
    if (a == 2) {
        $("#productsList").find(".tishi").hide();
    } else {
        $("#productsList").find(".tishi").show();
    }
    $(".xk li:lt(3)").removeAttr("class");
    $(".xk li:eq(" + a + ")").attr("class", "t");
    $(".vPanel").hide(); $("#vPanel" + a).show();
    if ($("#vPanel" + a + " .kong").length > 0 || a == 2) {
        $(".di").hide(); $("#prompt").hide();
    }
    else {
        $(".di").show(); $("#prompt").show();
    }
    vPanelIndex = a;
    showOrderInfo();


}
function searchID() { clearSearchRes(); var b = $("#sProID").val(); if ($.trim(b).length <= 0) { alert("请输入要搜索的ID"); return; } var a = $("#" + vPanelIndex + "v" + b + " .w2"); if (a.length > 0) { a.html("<font id='tempSearch' style=\"color:#ff0000;background:#ffff00\">" + a.html() + "</font>"); $(window).scrollTop(a.offset().top); } else { alert("没有找到匹配的商品"); return; } } function clearSearchRes() { $("#tempSearch").parent().html($("#tempSearch").html()); } function searchName() { var c = $.trim($("#sProName").val()); if (c.length <= 0) { alert("请输入搜索商品名"); return false; } c = encode(c); var e = $("#vPanel" + vPanelIndex); var b = e.html().replace(/<font\s+color=.?#ff0000.?>([^<>]*?)<\/font>/i, "$1"); e.html(b); b = e.html(); var d = new RegExp("(<td class=['\"]??w3['\"]??>(?:.|\n)*?<a.*?>(?:.|\n)*?)(" + c + ")((?:.|\n)*?</a>(?:.|\n)*?</td>)", "gi"); b = b.replace(d, "$1<font color='#ff0000'>$2</font>$3"); e.html(b); var a = $("font:eq(0)", $("#vPanel" + vPanelIndex)); if (a.length <= 0) { alert("没有找到匹配的商品"); return; } $(window).scrollTop(a.offset().top); } function showRemarkPanel(c, a, b) { $(".beizhu").remove(); $(b).before(remarkPanel); $("#remarkContent").val($("#remark" + c).val()); if (a) { $("#noremark").click(function () { if (this.checked) { $("#remarkContent").attr("disabled", "disabled").val("我对此商品无任何特殊备注。"); } else { $("#remarkContent").removeAttr("disabled").val($("#remark" + c).val()); } }); $("#remarkSubmit").click(function () { upRemark(c, $.trim($("#remarkContent").val())); }); } else { $("#remarkContent").attr("disabled", "disabled").css({ background: "#eeeeee", color: "#bbbbbb", border: "#bbbbbb solid 1px" }); $("#noremarkLb").css({ color: "#bbbbbb" }); $("#noremarkLb input").attr("disabled", "disabled"); $("#remarkSubmit").remove(); } $(".beizhu").animate({ width: "282px", marginLeft: "-284px" }, 300, function () { }); } function closeRemarkPanel() { if ($(".beizhu").length > 0) { $(".beizhu").animate({ width: "0", marginLeft: "-2px" }, 300, function () { $(this).remove(); }); } } function upRemark(b, a) { $.ajax({ type: "POST", url: "/App_Services/CartProductProfile.asmx/UpdateRemark", dataType: "json", contentType: "application/json;utf-8", data: "{remark:'" + a + "',pID:" + b + "}", timeout: 6000, error: function () { alert("修改备注失败！"); }, success: function (c) { if (c.d == 1) { closeRemarkPanel(); $("#remark" + b).val(a); alert("修改备注成功！"); } else { if (c.d == 404) { alert("当前状态不能更新备注！"); } } } }); } function cs(a) { messageHandle.open(); $("#iframe1").attr("src", "/mypanli/message/ShipMessageDetail.aspx?fkid=" + a + "&type=0"); } function submitToDeliverType() { if ($("#vPanel1 .kong").length > 0) { alert("您目前没有可以提交运送的商品哦！"); return false; } var c = $(".products:checked", $("#vPanel" + vPanelIndex)); var a = ""; if (c.length > 0) { c.each(function (e, f) { a += f.value + ","; }); } var d = 0; var b = $(".FreeProduct:checked", $("#vPanel" + vPanelIndex)); if (b.length > 0) { d = b.val(); } if (d == 0 && c.length <= 0) { alert("您还没有选择要提交运送的商品哦！"); return false; } var w3 = c.parent().siblings(".w3"); var w3a = $.trim(w3.find("a").html()); var zengpinurl = "http://sf.panli.com/FrontEnd/images20090801/newmypanli/OrderCart/zeng.gif"; if (c.length > 0) { var iszengpin = false; $.each(w3, function (i, item) { var spanimgsrc = $(item).find("span").find("img").attr("src"); if (spanimgsrc != zengpinurl || $('span',item).attr('isalonesubmit') == "True") { iszengpin = true; } }); if (iszengpin == false) { alert("赠品不能单独提交，请您将赠品与买到的宝贝(状态为“已到Panli”)合并邮寄，谢谢！"); return false; } } $.ajax({ type: "POST", url: "/App_Services/CartProductProfile.asmx/SubmitToDeliver", dataType: "json", contentType: "application/json;utf-8", data: "{IDs:'" + a.substring(0, a.length - 1) + "',fid:" + d + "}", timeout: 10000, error: function () { alert("提交失败！"); }, success: function (e) { if (e.d) { window.location = "/mypanli/DeliverType/ValidateProducts.aspx"; } else { alert("提交运送失败！"); } } }); } function GetLogisticsInfo(b, a) { if ($(a).next("div").length > 0) { $(a).next("div").toggle(); return; } $.ajax({ type: "POST", url: "/App_Services/wsSelfPurchase.asmx/GetLogisticsInfo", cache: false, dataType: "json", contentType: "application/json;utf-8", data: '{"id":' + b + "}", timeout: 10000, error: function () { }, success: function (d) { var c = $.parseJSON(d.d); $(a).after('<div style="position: relative;"><div class="wuliu"><p>物流公司：' + c.c + "</p><p>运单号码：" + c.p + "</p></div></div>"); } }); }  