var thisPage = {
    userGroup: uGroup,
    products: sp_prol,
    index: [],
    remarkPanel: '<div style="display:none;" class="beizhu"><div class="bzbox"><div class="if"><label><input type="checkbox" id="noRemarkck"/>无特殊商品备注说明，请勾选此项</label></div><textarea maxLength="500" id="newRemark" onfocus="thisPage.isRemarkFocus=true;" onblur="thisPage.isRemarkFocus=false" cols="" rows=""></textarea><dl><dt><input type="button" id="updmk" value="提交" /></dt><dd><input type="button" value="关闭" onclick="thisPage.isRemarkFocus=false;thisPage.closeRemarkPanel()" /></dd></dl></div><img src="/images20090801/newmypanli/jiantou.gif"/></div>',
    toID: [],
    outID: [],
    isRemarkFocus: false,
    init: function(da) {
        this.index = [];
        if (da.length > 0) {
            for (var i = 0; i < da.length; i++) {
                var u = da[i].Shop.Href;
                if (this.index.length > 0) {
                    for (var j = 0; j < this.index.length; j++) {
                        if (da[this.index[j][0]].Shop.Href == u) { this.index[j][this.index[j].length] = i; break; }
                        if (j + 1 == this.index.length) { this.index[j + 1] = new Array(); this.index[j + 1][0] = i; break; }
                    }
                }
                else { this.index[0] = new Array(); this.index[0][0] = i; };
            }

            var html = "";
            $.each(this.index, function(j, pl) {
                var s = "";
                $.each(pl, function(i, d) {
                    var t = "";
                    t = i == 0 ? '<td id="sj' + j + '" class="b7" rowspan="' + pl.length + '">￥<span>￥0</span></td>' : "";
                    s += '<tr id="li' + d + '"><td class="b1"><input name="products" onclick="thisPage.accountFright(' + j + ');thisPage.accountAll()" type="checkbox" value="' + thisPage.products[d].Href.replace(",", "{###}") + '" checked="checked" /></td><td class="b2"><a href="' + thisPage.products[d].Href + '" target="_blank"><img src="' + thisPage.products[d].Picture + '" onerror="this.src=\'/images20090801/noimg/noimg80.gif\'" /></a></td><td class="b3"><p><a href="' + thisPage.products[d].Href + '" target="_blank">' + thisPage.products[d].Name + '</a></p></td><td class="b4">' + (thisPage.products[d].IsAuction ? '<input type="text" onkeyup="value=value.replace(/[^\\d\\.]/g,\'\')" value="' + thisPage.getPrice(thisPage.products[d], thisPage.userGroup) + '" />' : '￥' + (thisPage.getPrice(thisPage.products[d], thisPage.userGroup)).toFixed(2)) + '</td><td class="b5"><a class="jian" onclick="thisPage.MNum(' + d + ');" title="减"></a><input maxlength="4" onblur="thisPage.updateNum(' + d + ',this.value)" onkeyup="value=value.replace(/[^\\d]/g,\'\')" type="text" value="' + thisPage.products[d].BuyNum + '" /><a class="jia" onclick="thisPage.ANum(' + d + ');" title="加"></a></td><td class="b6">￥<span>' + (thisPage.getPrice(thisPage.products[d], thisPage.userGroup) * thisPage.products[d].BuyNum).toFixed(2) + '</span></td>' + t + '<td class="b8"><a' + ((thisPage.products[d].Remark == "我对此商品无任何特殊备注。" || thisPage.products[d].Remark.length <= 0) ? ' class="orange"' : '') + ' onmouseout="thisPage.cleartoID(thisPage.toID);if($(\'.beizhu\').length>0)thisPage.outID.push(setTimeout(function() {thisPage.closeRemarkPanel();}, 500));" onmouseover="thisPage.showRemarkPanel(' + d + ',true,this)" onclick="thisPage.showRemarkPanel(' + d + ',false,this)" title="' + thisPage.products[d].Remark + '">' + ((thisPage.products[d].Remark == "我对此商品无任何特殊备注。" || thisPage.products[d].Remark.length <= 0) ? '添加备注' : '商品备注') + '</a></td></tr>';
                });
                s += '<tr><td class="sj" colspan="8">商家：<a href="' + thisPage.products[pl[0]].Shop.Href + '" title="' + thisPage.products[pl[0]].Shop.Name + '" target="_blank">' + thisPage.products[pl[0]].Shop.Name + '</a><span>来源网站：' + thisPage.getSiteName(thisPage.products[pl[0]].Shop.Href) + '</span></td></tr>';
                html += "<table>" + s + "</table>";
            });

            $("#shoppingCartProduct").html(html + $("#shoppingCartProduct").html());
            for (var i = 0; i < this.index.length; i++) {
                this.accountFright(i);
            }
            $("#allPro").text(this.products.length);
            this.accountAll();
        }
        $("#pagemain").show();
    },
    ANum: function(i) { this.updateNum(i, this.products[i].BuyNum + 1); },
    MNum: function(i) { if (this.products[i].BuyNum > 0) this.updateNum(i, this.products[i].BuyNum - 1); },
    cleartoID: function(li) { if (li.length > 0) { $.each(li, function(i, d) { clearInterval(d); }); li = []; } },
    closeRemarkPanel: function() { if (this.isRemarkFocus) return; this.cleartoID(thisPage.toID); if ($(".beizhu").length > 0) { $(".beizhu").animate({ width: "0", marginLeft: "0" }, 300, function() { $(this).remove(); }); } },
    showRemarkPanel: function(i, type, dom) { if (this.isRemarkFocus) return; this.closeRemarkPanel(); if (type) { if ($(".beizhu").length > 0) { setTimeout(function() { thisPage.showRemarkPanel(i, type, dom); }, 500); return; } this.toID.push(setTimeout(function() { thisPage.showRemarkPanel(i, !type, dom); }, 500)); } else { $(".beizhu").remove(); $(dom).before(this.remarkPanel); $("#newRemark").val(this.products[i].Remark); $("#noRemarkck").click(function() { if (this.checked) $("#newRemark").val("我对此商品无任何特殊备注。").attr("disabled", "disabled"); else $("#newRemark").val(thisPage.products[i].Remark).removeAttr("disabled"); }); $("#updmk").click(function() { thisPage.updateRemark($("#newRemark").val(), i); }); $(".beizhu").animate({ width: "282px", marginLeft: "-294px" }, 300, function() { $(this).css("display", "inline"); }).mouseenter(function() { thisPage.cleartoID(thisPage.outID); }).mouseleave(function() { thisPage.closeRemarkPanel(); }); } },
    getFreight: function(si) { var Freight = 0; $.each(this.index[si], function(i, d) { if ($("#li" + d + " input[type=checkbox]")[0].checked && thisPage.products[d].Freight > Freight) Freight = thisPage.products[d].Freight; }); return Freight; },
    accountFright: function(si) { $("#li" + this.index[si][0]).parents("table").find(".b7").text("￥" + this.getFreight(si)); },
    accountAll: function() { for (var i = 0; i < this.index.length; i++) this.accountFright(i); var totalFreight = 0; var totalProPrice = 0; $(".b6 span").each(function() { if ($(this).parents("tr").find("input[type='checkbox']")[0].checked) { totalProPrice += parseFloat($(this).text()); } }); $.each(this.index, function(i) { totalFreight += thisPage.getFreight(i); }); $("#totalFreight").text("￥" + totalFreight.toFixed(2)); $("#totalProPrice").text("￥" + totalProPrice.toFixed(2)); $("#totalPrice").text("￥" + (totalFreight + totalProPrice).toFixed(2)); },
    getPrice: function(d, l) { switch (l) { case 3: if (d.VIPPrice3 > 0) return d.VIPPrice3; case 2: if (d.VIPPrice2 > 0) return d.VIPPrice2; case 1: if (d.VIPPrice1 > 0) return d.VIPPrice1; default: return d.Price; } },
    updateRemark: function(remark, i) {
        if (remark == this.products[i].Remark)
        { thisPage.isRemarkFocus = false; thisPage.closeRemarkPanel(); return; }
        $.ajax({ type: "POST",
            url: "/App_Services/CartProductProfile.asmx/AddShoppingCartRemark",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{url:'" + thisPage.products[i].Href + "',remark:'" + remark + "'}",
            timeout: 6000,
            error: function() {
                alert('修改备注失败！');
            },
            success: function() {
                thisPage.products[i].Remark = remark;
                if ($.trim(remark).length > 0 && remark != "我对此商品无任何特殊备注。")
                    $("#li" + i + " .b8 a").attr("class", "").text("商品备注");
                else
                    $("#li" + i + " .b8 a").attr("class", "orange").text("添加备注");
                alert("修改备注成功");
            }
        });
    },
    updateNum: function(i, num) {
        if (num.toString().length <= 0) { num = "1"; }
        num = parseInt(num);
        if ($("#li" + i + " .b5 input")[0].disabled) { return; };
        if (num == 0) { $("#li" + i + " .b5 input").val("1"); return }
        $("#li" + i + " .b5 input").attr("disabled", true);
        $.ajax({ type: "POST",
            url: "/App_Services/CartProductProfile.asmx/UpdateShoppingcartNum",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{url:'" + this.products[i].Href + "',num:" + num + ",viplevel:" + this.userGroup + "}",
            timeout: 5000,
            error: function() { alert('修改数量失败！'); window.location = window.location; },
            success: function(totle) {
                $("#li" + i + " .b5 input").attr("disabled", false).val(num);
                if (parseFloat(totle.d) >= 0) { thisPage.products[i].BuyNum = num; $("#li" + i + " .b6 span").text((thisPage.getPrice(thisPage.products[i], thisPage.userGroup) * thisPage.products[i].BuyNum).toFixed(2)); thisPage.accountAll(); }
                else { window.location = window.location; return; }

            }
        });
    },
    addToFavorites: function(dom) {
        if ($("input:checked").length <= 0) {
            alert("请勾选您要收藏的商品"); return;
        }
        $(dom).attr("disabled", "disabled");
        var s = [];
        $.each($("input:checked"), function(i, d) { s.push(d.value); });
        $.ajax({
            type: "POST",
            url: "/App_Services/wsFavorite.asmx/AddFavorites",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{p:'" + s.toString() + "'}",
            timeout: 25000,
            error: function() { alert("添加收藏失败"); $(dom).removeAttr("disabled"); },
            success: function(data) { alert("添加收藏成功"); $(dom).removeAttr("disabled"); }
        });
    },
    del: function(dom) {
        if ($("input:checked").length <= 0) {
            alert("请勾选您要删除的商品"); return;
        }
        if (!confirm("您确定要删除这些商品吗")) return;
        $(dom).attr("disabled", "disabled");
        var s = [];
        $.each($("input:checked"), function(i, d) { s.push(d.value); });

        $.ajax({
            type: "POST",
            url: "/App_Services/CartProductProfile.asmx/DeleteShoppingCartProducts",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{url:'" + s.toString() + "'}",
            timeout: 10000,
            error: function() { alert("删除失败"); window.location = window.location; },
            success: function(data) { thisPage.products = eval(data.d); if (thisPage.products.length > 0) { $(dom).removeAttr("disabled"); $("#shoppingCartProduct").children("table").remove(); thisPage.init(thisPage.products); } else { window.location.reload(); } }
        });
    },
    submitCheck: function() { if ($("input:checked").length <= 0) { alert("请勾选您要代购的商品"); return false; } },
    getSiteName: function(url) {
        if (url.indexOf("taobao.com") > 0)
            return "淘宝网";
        if (url.indexOf("paipai.com") > 0)
            return "拍拍网";
        if (url.indexOf("eachnet.com") > 0)
            return "易趣网";
        if (url.indexOf("youa.baidu.com") > 0)
            return "百度有啊";
        if (url.indexOf("panli.com") > 0)
            return "Panli";
        if (url.indexOf("139shop.com") > 0)
            return "北斗手机";
        if (url.indexOf("360buy.com") > 0)
            return "京东商城";
        if (url.indexOf("4inlook.com") > 0)
            return "4inLOOK";
        if (url.indexOf("7shop24.com") > 0)
            return "7shop24";
        if (url.indexOf("818shyf.com") > 0)
            return "上海药房";
        if (url.indexOf("amazon.cn") > 0)
            return "卓越网";
        if (url.indexOf("blemall.com") > 0)
            return "联华OK";
        if (url.indexOf("china-pub.com") > 0)
            return "China-Pub";
        if (url.indexOf("cntvs.com") > 0)
            return "七星网";
        if (url.indexOf("dangdang.com") > 0)
            return "当当网";
        if (url.indexOf("e-giordano.com") > 0)
            return "佐丹奴";
        if (url.indexOf("gome.com.cn") > 0)
            return "国美电器";
        if (url.indexOf("m18.com") > 0)
            return "麦网";
        if (url.indexOf("newegg.com.cn") > 0)
            return "新蛋中国";
        if (url.indexOf("no5.com.cn") > 0)
            return "No5时尚广场";
        if (url.indexOf("redbaby.com.cn") > 0)
            return "红孩子";
        if (url.indexOf("shishangqiyi.com") > 0)
            return "时尚起义";
        if (url.indexOf("vancl.com") > 0)
            return "凡客诚品";
        if (url.indexOf("wangshanghai.com") > 0)
            return "网上海";
        if (url.indexOf("x.com") > 0)
            return "北京桔色";
        return "其他网站";
    }
}
$(function() { thisPage.init(thisPage.products); });