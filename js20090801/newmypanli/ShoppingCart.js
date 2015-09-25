var thisPage = {
    userGroup: uGroup,
    products: sp_prol,
    index: [],
    remarkPanel: '<div style="display:none;" class="beizhu"><div class="bzbox"><div class="if"><label><input type="checkbox" id="noRemarkck"/>无特殊商品备注说明，请勾选此项</label></div><textarea maxLength="500" id="newRemark" onfocus="thisPage.isRemarkFocus=true;" onblur="thisPage.isRemarkFocus=false" cols="" rows=""></textarea><dl><dt><input type="button" id="updmk" value="提交" /></dt><dd><input type="button" value="关闭" onclick="thisPage.isRemarkFocus=false;thisPage.closeRemarkPanel()" /></dd></dl></div><img src="http://sf.panli.com/FrontEnd/images20090801/newmypanli/jiantou.gif"/></div>',
    toID: [],
    outID: [],
    isRemarkFocus: false,
    init: function (da) {
        $("#shoppingCartProduct table").remove();
        this.index = [];
        if (da.length > 0) {
            for (var i = 0; i < da.length; i++) {
                var u = da[i].Shop.Href;
                if (this.index.length > 0) {
                    for (var j = 0; j < this.index.length; j++) {
                        if (da[this.index[j][0]].Shop.Href == u) {
                            this.index[j][this.index[j].length] = i;
                            break;
                        }
                        if (j + 1 == this.index.length) {
                            this.index[j + 1] = new Array();
                            this.index[j + 1][0] = i;
                            break;
                        }
                    }
                } else {
                    this.index[0] = new Array();
                    this.index[0][0] = i;
                }
            }

            var html = "";
            $.each(this.index, function (j, pl) {
                var s = "";
                s += '<tr><td class="sj" colspan="1"><input name="" type="checkbox" onclick="thisPage.ShopCheck(this);" value="" checked="checked" /></td><td class="sj" colspan="7">商家：<a href="' + thisPage.products[pl[0]].Shop.Href + '" title="' + thisPage.products[pl[0]].Shop.Name + '" target="_blank" >' + thisPage.products[pl[0]].Shop.Name + '</a><span>来自网站：' + thisPage.getSiteName(thisPage.products[pl[0]].Shop.Href) + '</span></td></tr>';
                $.each(pl, function (i, d) {
                    var t = "",
                    sPrice = thisPage.getPrice(thisPage.products[d], thisPage.userGroup),
                    yPrice = thisPage.products[d].PromotionPrice > 0 ? thisPage.products[d].PromotionPrice : thisPage.products[d].Price;
                    t = i == 0 ? '<td id="sj' + j + '" class="b7" rowspan="' + pl.length * 2 + '">￥<span>￥0</span></td>' : "";
                    s += '<tr id="li' + d + '"><td rowspan="2" class="b1"><input name="products" onclick="thisPage.ProductCheck(this);thisPage.accountFright(' + j + ');thisPage.accountAll();" type="checkbox" value="' + d + '" checked="checked" /></td>' +
                            '<td class="b2" style="border-bottom:none;"><a href="' + thisPage.products[d].Href + '" target="_blank" ><img src="' + (thisPage.products[d].Thumbnail == '' ? 'http://sf.panli.com/FrontEnd/images20090801/noimg/noimg80.gif' : thisPage.products[d].Thumbnail) + '"  onerror="this.src=\'http://sf.panli.com/FrontEnd/images20090801/noimg/noimg80.gif\'"/></a></td>' +
                            '<td class="b3" style="border-bottom:none;"><p><a href="' + thisPage.products[d].Href + '" target="_blank">' + thisPage.products[d].Name + '</a></p></td>' +
                            '<td rowspan="2" class="b4">' + (thisPage.products[d].IsAuction ? '<input type="text" onkeyup="value=value.replace(/[^\\d\\.]/g,\'\')" value="' + sPrice + '" />' : (yPrice > sPrice ? '<b><em class="vip' + thisPage.userGroup + '"></em>￥' + sPrice.toFixed(2) + '</b><s>原价：￥' + yPrice.toFixed(2) + '</s>' : '￥' + sPrice.toFixed(2))) + '</td>' +
                            '<td rowspan="2" class="b5"><a class="jian" onclick="thisPage.MNum(' + d + ');" title="减"></a><input maxlength="4" onblur="thisPage.updateNum(' + d + ',this.value)" onkeyup="value=value.replace(/[^\\d]/g,\'\')" type="text" value="' + thisPage.products[d].BuyNum + '" /><a class="jia" onclick="thisPage.ANum(' + d + ');" title="加"></a></td>' +
                            '<td rowspan="2" class="b6">￥<span>' + (sPrice * thisPage.products[d].BuyNum).toFixed(2) + '</span></td>' + t +
                            '<td rowspan="2" class="b8"><a' + ((thisPage.products[d].Remark == "我对此商品无任何特殊备注。" || thisPage.products[d].Remark.length <= 0) ? ' class="orange"' : '') + ' onmouseout="thisPage.cleartoID(thisPage.toID);if($(\'.beizhu\').length>0)thisPage.outID.push(setTimeout(function() {thisPage.closeRemarkPanel();}, 500));" onmouseover="thisPage.showRemarkPanel(' + d + ',true,this)" onclick="thisPage.showRemarkPanel(' + d + ',false,this)" title="' + thisPage.products[d].Remark + '">' + ((thisPage.products[d].Remark == "我对此商品无任何特殊备注。" || thisPage.products[d].Remark.length <= 0) ? '添加备注' : '商品备注') + '</a></td>';
                    s += '<tr><td class="b2" style="border-top:none;">&nbsp;</td>' +
                            '<td class="b3" style="border-top:none;"><p style="color:#999;" title="' + thisPage.products[d].SkuStr + '">' + thisPage.products[d].SkuStr + '</p></td>' +
                            '</tr>';
                });
                html += "<table>" + s + "</table>";
            });

            $("#shoppingCartProduct").html(html + $("#shoppingCartProduct").html());
            for (var i = 0; i < this.index.length; i++) {
                this.accountFright(i);
            }
            $("#allPro").text(this.products.length);
            $('#CartStatus').show();
            this.accountAll();
        }
        $("#pagemain").show();
    },
    ShopCheck: function (checkdom) {

        $(checkdom).parents("table").find("input:checkbox").attr("checked", checkdom.checked);

        var tableAllShopCheckbox = $('#shoppingCartProduct td.sj > input[name!=products]:checkbox');
        var MainSwitch = $('div.bt li.w6 > input:checkbox');
        MainSwitch.attr('checked', tableAllShopCheckbox.length == tableAllShopCheckbox.filter(':checked').length);

        this.accountAll();
    },
    ProductCheck: function (c) {
        var tableChilderCheckbox = $(c).parents("table").find("input[name=products]:checkbox");
        var tableChilderShopCheckbox = $(c).parents("table").find("input[name!=products]:checkbox");
        tableChilderShopCheckbox.attr('checked', tableChilderCheckbox.length == tableChilderCheckbox.filter(':checked').length);

        var tableAllShopCheckbox = $('#shoppingCartProduct td.sj > input[name!=products]:checkbox');
        var MainSwitch = $('div.bt li.w6 > input:checkbox');
        MainSwitch.attr('checked', tableAllShopCheckbox.length == tableAllShopCheckbox.filter(':checked').length);
    },
    UnCheckAll: function () {
        $('table input[name=products]:checkbox').each(function () { this.checked = !this.checked; })
        var check;
        var MainSwitch = $('div.bt li.w6 > input:checkbox');
        $('div.product table').each(function () {
            check = $(this).find("input[name=products]:checkbox");
            $(this).find("td.sj > input[name!=products]:checkbox").attr('checked', check.length == check.filter(':checked').length);
        });
        var tableAllShopCheckbox = $('#shoppingCartProduct td.sj > input[name!=products]:checkbox');
        MainSwitch.attr('checked', tableAllShopCheckbox.length == tableAllShopCheckbox.filter(':checked').length);
    },
    CheckAll: function () {
        $('table input[name=products]:checkbox').attr('checked', true);
        var check;
        var MainSwitch = $('div.bt li.w6 > input:checkbox');
        $('div.product table').each(function () {
            check = $(this).find("input[name=products]:checkbox");
            $(this).find("td.sj > input[name!=products]:checkbox").attr('checked', check.length == check.filter(':checked').length);
        });
        var tableAllShopCheckbox = $('#shoppingCartProduct td.sj > input[name!=products]:checkbox');
        MainSwitch.attr('checked', tableAllShopCheckbox.length == tableAllShopCheckbox.filter(':checked').length);
    },
    ANum: function (i) { this.updateNum(i, this.products[i].BuyNum + 1); },
    MNum: function (i) { if (this.products[i].BuyNum > 0) this.updateNum(i, this.products[i].BuyNum - 1); },
    cleartoID: function (li) {
        if (li.length > 0) {
            $.each(li, function (i, d) { clearInterval(d); });
            li = [];
        }
    },
    closeRemarkPanel: function () {
        if (this.isRemarkFocus) return;
        this.cleartoID(thisPage.toID);
        if ($(".beizhu").length > 0) {
            $(".beizhu").animate({ width: "0", marginLeft: "0" }, 300, function () { $(this).remove(); });
        }
    },
    showRemarkPanel: function (i, type, dom) {
        if (this.isRemarkFocus) return;
        this.closeRemarkPanel();
        if (type) {
            if ($(".beizhu").length > 0) {
                setTimeout(function () { thisPage.showRemarkPanel(i, type, dom); }, 500);
                return;
            }
            this.toID.push(setTimeout(function () { thisPage.showRemarkPanel(i, !type, dom); }, 500));
        } else {
            $(".beizhu").remove();
            $(dom).before(this.remarkPanel);
            $("#newRemark").val(this.products[i].Remark);
            $("#noRemarkck").click(function () {
                if (this.checked) $("#newRemark").val("我对此商品无任何特殊备注。").attr("disabled", "disabled");
                else $("#newRemark").val(thisPage.products[i].Remark).removeAttr("disabled");
            });
            $("#updmk").click(function () { thisPage.updateRemark($("#newRemark").val(), i); });
            $(".beizhu").animate({ width: "282px", marginLeft: "-294px" }, 300, function () { $(this).css("display", "inline"); }).mouseenter(function () { thisPage.cleartoID(thisPage.outID); }).mouseleave(function () { thisPage.closeRemarkPanel(); });
        }
    },
    getFreight: function (si) {
        var Freight = 0;
        $.each(this.index[si], function (i, d) { if ($("#li" + d + " input[type=checkbox]")[0].checked && thisPage.products[d].Freight > Freight) Freight = thisPage.products[d].Freight; });
        return Freight;
    },
    accountFright: function (si) {
        $("#li" + this.index[si][0]).parents("table").find(".b7").html(is1111 && this.getFreight(si)>0 ? "￥0<s style='display: block;'>￥" + this.getFreight(si) + "</s>" : "￥" + this.getFreight(si));
    },
    accountAll: function () {
        for (var i = 0; i < this.index.length; i++)
            this.accountFright(i);
        var totalFreight = 0;
        var totalProPrice = 0;
        $(".b6 span").each(function () {
            if ($(this).parents("tr").find("input[type='checkbox']")[0].checked) {
                totalProPrice += parseFloat($(this).text());
            }
        });
        $.each(this.index, function (i) {
            totalFreight += thisPage.getFreight(i);
        });
        totalFreight = is1111 ? 0 : totalFreight;//双1111活动
        $('#CheckNum').text($('table input[name=products]:checked').length);
        $('#AllproductNum').text(this.products.length);

        $("#totalFreight,#totalFreightUp").text("￥" + totalFreight.toFixed(2));
        $("#totalProPrice,#totalProPriceUp").text("￥" + totalProPrice.toFixed(2));
        $("#totalPrice,#totalPriceUp,#totalPriceBottom,#FloatTotalPrice").text("￥" + (totalFreight + totalProPrice).toFixed(2));
    },
    getPrice: function (d, l) {

        var price = d.Price;
        switch (l) {
            case 4:
                if (d.VIPPrice4 > 0) price = d.VIPPrice4; break;
            case 3:
                if (d.VIPPrice3 > 0) price = d.VIPPrice3; break;
            case 2:
                if (d.VIPPrice2 > 0) price = d.VIPPrice2; break;
            case 1:
                if (d.VIPPrice1 > 0) price = d.VIPPrice1; break;
            default:
                break;
        }
        return (d.PromotionExpriedSeconds > 0 && d.PromotionPrice > 0 && d.PromotionPrice < price) ? d.PromotionPrice : price;
    },
    updateRemark: function (remark, i) {
        if (remark == this.products[i].Remark) {
            thisPage.isRemarkFocus = false;
            thisPage.closeRemarkPanel();
            return;
        }
        $.ajax({
            type: "POST",
            url: "/App_Services/CartProductProfile.asmx/AddShoppingCartRemark",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{url:'" + thisPage.products[i].Href + "',remark:'" + remark + "',skuComId:'" + this.products[i].SkuComId + "'}",
            timeout: 6000,
            error: function () {
                alert('修改备注失败！');
            },
            success: function () {
                thisPage.products[i].Remark = remark;
                if ($.trim(remark).length > 0 && remark != "我对此商品无任何特殊备注。")
                    $("#li" + i + " .b8 a").attr("class", "").text("商品备注");
                else
                    $("#li" + i + " .b8 a").attr("class", "orange").text("添加备注");
                thisPage.isRemarkFocus = false;
                thisPage.closeRemarkPanel();
            }
        });
    },
    updateNum: function (i, num) {
        if (num.toString().length <= 0) {
            num = "1";
        }
        num = parseInt(num);
        if ($("#li" + i + " .b5 input")[0].disabled) {
            return;
        }
        ;
        if (num == 0) {
            $("#li" + i + " .b5 input").val("1");
            return
        }
        $("#li" + i + " .b5 input").attr("disabled", true);
        $.ajax({
            type: "POST",
            url: "/App_Services/CartProductProfile.asmx/UpdateShoppingcartNum",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{url:'" + this.products[i].Href + "',num:" + num + ",viplevel:" + this.userGroup + ",skuComId:'" + this.products[i].SkuComId + "'}",
            timeout: 5000,
            error: function () {
                alert('修改数量失败！');
                window.location = window.location;
            },
            success: function (totle) {
                $("#li" + i + " .b5 input").attr("disabled", false).val(num);
                if (parseFloat(totle.d) >= 0) {
                    thisPage.products[i].BuyNum = num;
                    $("#li" + i + " .b6 span").text((thisPage.getPrice(thisPage.products[i], thisPage.userGroup) * thisPage.products[i].BuyNum).toFixed(2));
                    thisPage.accountAll();
                } else {
                    window.location = window.location;
                    return;
                }

            }
        });
    },
    addToFavorites: function (dom) {
        if ($("input:checked").length <= 0) {
            alert("请勾选您要收藏的商品");
            return;
        }
        $(dom).attr("disabled", "disabled");
        var s = [];
        $.each($("input[name=products]:checked"), function (i, d) {
            s.push(thisPage.products[parseInt($(d).val())].Href.replace(/,/g, "{###}"));
        });
        $.ajax({
            type: "POST",
            url: "/App_Services/wsFavorite.asmx/AddFavorites",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{p:'" + s.toString() + "'}",
            timeout: 25000,
            error: function () {
                alert("添加收藏失败");
                $(dom).removeAttr("disabled");
            },
            success: function (data) {
                alert("添加收藏成功");
                $(dom).removeAttr("disabled");
            }
        });
    },
    del: function (dom) {
        if ($("input:checked").length <= 0) {
            alert("请勾选您要删除的商品");
            return;
        }
        if (!confirm("您确定要删除这些商品吗")) return;
        $(dom).attr("disabled", "disabled");
        var s = [];
        $.each($("input[name=products]:checked"), function (i, d) {
            s.push(thisPage.products[parseInt($(d).val())].Href.replace(/,/g, "{###}") + "_sku_" + thisPage.products[parseInt($(d).val())].SkuComId)
        });

        $.ajax({
            type: "POST",
            url: "/App_Services/CartProductProfile.asmx/DeleteShoppingCartProducts",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{url:'" + s.toString() + "'}",
            timeout: 10000,
            error: function () {
                alert("删除失败");
                window.location = window.location;
            },
            success: function (data) {
                thisPage.products = eval(data.d);
                if (thisPage.products.length > 0) {
                    $(dom).removeAttr("disabled");
                    $("#shoppingCartProduct").children("table").remove();
                    thisPage.init(thisPage.products);

                } else {
                    window.location.reload();
                }
            }
        });
    },
    submitCheck: function () {

        if ($("input:checked").length <= 0) {
            alert("请勾选您要代购的商品");
            return false;
        }

        $("input[name=products]:checked").each(function () {
            $(this).val(thisPage.products[parseInt($(this).val())].Href.replace(/,/g, "{###}") + "_sku_" + thisPage.products[parseInt($(this).val())].SkuComId);
        });
    },
    getSiteName: function (url) {
        if (url.indexOf("taobao.com") > 0)
            return "淘宝网";
        if (url.indexOf("tmall.com") > 0)
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
};
$(function () {
    Panli.Overlay.init();
    Panli.Crawl.init({
        SnatchServiceUrl: '/App_Services/wsAddItem.asmx/GetItemSnapshot',
        AddProductUrl: '/App_Services/wsAddItem.asmx/AddToShoppingCart'
    });
    thisPage.init(thisPage.products);

    //下拉层展示
    $('#mainLink,#mainLinkPanel').hover(function () {
        $('#mainLinkPanel').show();
        $('#mainLink').addClass('g_nav_');
        $('#mainLink s').css('border-color', '#fff #fff #999 #fff;');

    }, function () {
        $('#mainLinkPanel').hide();
        $('#mainLink').removeClass('g_nav_');
        $('#mainLink s').css('border-color', '#999 #fff #fff #fff;');
    });


    //验证一键填单输入
    var validateUrl = function () {
        if ($("#CrawlUrl").hasClass("fast_wz_"))
            return false;
        var url = $.trim($("#CrawlUrl").val());
        if (url.length <= 0 || url == 'http://') {
            $("#CrawlUrl").addClass("fast_wz_").val("请您输入商品链接地址！");
            $("#CrawlUrl").css('backgroundImage', 'none');
            return false;
        }
        var reg = new RegExp("http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?");
        if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0)
            url = "http://" + url;
        if (!reg.test(url)) {
            $("#CrawlUrl").addClass("fast_wz_").val("您输入的链接地址不正确，请核实后再填写！");
            $("#CrawlUrl").css('backgroundImage', 'none');
            return false;
        }
        return true;
    };
    //一键填单点击事件
    var CrawlClick = function () {
        if (validateUrl()) {
            var url = $.trim($("#CrawlUrl").val());
            if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0)
                url = "http://" + url;
            //Panli.Crawl.open(url);
            //$("#CrawlUrl").css('backgroundImage', 'url(http://sf.panli.com/FrontEnd/images20090801/Gobal/topbottonbg.gif)').val("http://");
            window.location.href = "/Crawler.aspx?purl=" + encodeURIComponent(url);

        }
        return false;
    };

    $("#CrawlUrl").focus(function () {
        if ($("#CrawlUrl").val() == "http://" || $("#CrawlUrl").hasClass("fast_wz_")) {
            $("#CrawlUrl").css('backgroundImage', 'none').val('');
        }
        $("#CrawlUrl").removeClass("fast_wz_");
    })
    .blur(function () {
        if ($.trim($("#CrawlUrl").val()).length <= 0) {
            $("#CrawlUrl").css('backgroundImage', 'url(http://sf.panli.com/FrontEnd/images20090801/Gobal/topbottonbg.gif)').val("http://");
        }
    })
    .keydown(function (e) {
        if (e.keyCode == 13) {
            CrawlClick();
            return false;
        }
    });
    //抓取按钮点击事件
    $("#PanliCrawlBtn").click(CrawlClick);

    //IE6下滚动跟随
    if (typeof document.body.style.maxHeight == "undefined") {
        $('#floatPanel').css("position", "absolute").css("margin-top", "0px");
        var divY = (getViewportHeight() - $('#floatPanel').outerHeight());
        $('#floatPanel').css("top", (divY + document.documentElement.scrollTop).toString());
        $(window).scroll(function () { $('#floatPanel').css("top", divY + document.documentElement.scrollTop + ""); });
    }

    //浮动结算按钮显示隐藏
    var floatPanelDisplay = function () {
        if ($('#payPanel').size() > 0) {
            var ws = $(window).scrollTop();
            var pp = $('#payPanel').offset().top;
            var wp = $(window).height();
            if (wp + ws - pp <= 60) {
                $('#floatPanel').show();
            } else {
                $('#floatPanel').hide();
            }
        }
    };
    $(window).scroll(floatPanelDisplay).resize(floatPanelDisplay);
    floatPanelDisplay();
});