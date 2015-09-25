var PieceShop = {
    crawlProduct: function (url) {
        var errorTip = $("p.ErrorMs");
        if (url.length == 0 || url.toLowerCase().indexOf("http://") < 0) {
            errorTip.show().html("商品链接有误，请重新输入");
            return false;
        }
        var pid = PieceShop.getQueryString("id");
        if (pid === null) {
            window.location = "/piece/";
            return false;
        }
        $("#snatchBtn").attr("class", "ConSnatchSubmit_Over").attr("disabled", true);
        $("#snatchUrl").attr("disabled", true);

        $.ajax({
            type: "post",
            url: "/App_Services/wsPieceService.asmx/GetShopProduct",
            dataType: "json",
            contentType: "application/json;utf-8",
            timeout: 10000,
            data: "{pid:" + pid + ",url:'" + url + "'}",
            error: function () {
                $("div.ShopProduct > div.loading").hide();
                alert("网络请求错误,请稍后再试！");
            },
            beforeSend: function () {
                $("div.ShopProduct > div.new_tj").hide();
                $("div.ShopProduct > div.loading").show();
            },
            complete: function () {
                $("div.ShopProduct > div.loading").hide();
                $("#snatchBtn").attr("class", "ConSnatchSubmit").attr("disabled", false);
                $("#snatchUrl").attr("disabled", false).val("");
            },
            success: function (e) {
                var data = $.parseJSON(e.d);
                if (data) {
                    switch (data['Error']) {
                        case 'notLogin':
                            alert('您未登陆，请先登录再执行此操作！');
                            location.href = 'http://passport.panli.com/Login.aspx?ReturnUrl=' + location.href;
                            break;
                        case 'nullAgrs':
                            $('#snatchUrl').parent().parent().next().show();
                            break;
                        case 'existing':
                            alert('该商品已经存在！');
                            break;
                        case 'fail':
                            alert('该商品抓取失败！');
                            break;
                        case 'notBelong':
                            alert('对不起，该商品不是此店铺的商品！');
                            break;
                        case 'submitted':
                            alert('对不起，主单已经拼单结束！');
                            location.href = 'http://www.panli.com/Piece/PieceShopFail.aspx';
                            break;
                        case 'blockedShop':
                            alert('该商品的卖家为嫌疑商家，请不要代购此商品！');
                            location.href = 'http://www.panli.com/Piece';
                            break;
                        case 'notRange':
                            alert("对不起，拼店铺在北京时间每天晚间9点至次日早晨9点才开展！");
                            location.href = 'http://www.panli.com/Piece';
                        default:
                            //PieceShop.addProduct(data);
                            ShopSku.AddAllSku(data);
                            break;
                    }
                    if ($("div.sp_info").size() == 0) {
                        $("div.ShopProduct > div.new_tj").show();
                    }
                }
            }
        });
    },
    Boo: false,
    ReviseAjax: function (Th, num) {
        var id = Th.parent('td').siblings('td.w1').find('a').attr('alt');
        $.ajax({
            type: "post",
            url: "/App_Services/wsPieceService.asmx/UpdateNumberOfProductById",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{id:'" + id + "','num':'" + num + "'}",
            timeout: 6000,
            error: function () {
                alert("网络请求错误,请稍后再试！");
            },
            beforeSend: function () {
                PieceShop.Boo = true;
                Th.attr('disabled', 'disabled');
            },
            complete: function () {
                PieceShop.Boo = false;
                Th.removeAttr('disabled');
            },
            success: function (e) {
                if (e.d) {
                    Th.val(num);
                    var D = parseFloat(Th.parent('td').siblings('td.w5').text().replace(/[^\d\.]/g, ''));
                    Th.parent('td').siblings('td.w6').text('￥' + (num * D).toFixed(2))
                    PieceShop.calcPriceTotal();
                } else {
                    alert("网络请求错误,请稍后再试！");
                }
            }
        });
    },
    Digital: function (o, Sku) {//为指定的表单赋方法只能输入数字或者指定的字符
        var obj = jQuery.extend({
            dom: document,
            price: false,
            keyup: function () { }
        }, o || {}),
            dom = obj.dom,
            price = obj.price,
            keyup = obj.keyup,
            Th = this,
            rel = price ? /[^\d\.]/g : /[^\d]/g,
            nums = price ? 0 : 1;
        dom.css('imeMode', 'disabled'); //除谷歌浏览器禁止输入法切换
        dom.keydown(function (e) {
            var event = window.event || e, num = event.charCode ? event.charCode : event.keyCode, val = this.value;
            if (event.shiftKey || !((num >= 48 && num <= 57) || num == 8 || (num >= 96 && num <= 105) || (price && (num == 190 || num == 110) && val.indexOf('.') < 0 && val.length != 0))) {
                event.preventDefault ? event.preventDefault() : window.event.returnValue = false;
                return false;
            }
        });
        dom.keyup(function () {
            var val = this.value.replace(rel, '');
            val = parseInt(val) <= nums ? nums : val;
            this.value = val;
            keyup(this);
            return false;
        });
        if (!price) {
            dom.blur(function () {
                var val = this.value.replace(rel, '');
                val = isNaN(parseInt(val)) ? nums : val;
                this.value = val;
                Sku ? '' : Th.ReviseAjax(dom, val);
                return false;
            });
            function ClickNum(f) {
                if (PieceShop.Boo) return false;
                var val = dom.val().replace(rel, '');
                if (val <= 1 && f) return false;
                f ? (--val) : (++val);
                Sku ? dom.val(val) : Th.ReviseAjax(dom, val);
                return false;
            }
            var cut = Sku ? dom.next().next() : dom.prev(),
             add = Sku ? dom.next() : dom.next();
            cut.click(function () {
                ClickNum(true);
                return false;
            });
            add.click(function () {
                ClickNum(false);
                return false;
            });
        }
    },
    DeleteAjax: function (Th, id) {
        $.ajax({
            type: "post",
            url: "/App_Services/wsPieceService.asmx/DeleteProductById",
            dataType: "json",
            contentType: "application/json;utf-8",
            timeout: 6000,
            data: "{id:'" + id + "'}",
            error: function () {
                alert("网络请求错误,请稍后再试！");
            },
            success: function (e) {
                if (e.d) {
                    if (Th) {
                        $(Th).parents($(Th).parents('.sp_info').hasClass('sp_infoOn') ? '.sp_infoOn' : 'tr').remove();
                        $('#sp_info table tr:odd').addClass('on');
                        $('#sp_info table tr:even').removeClass('on');
                        if ($('.sp_info tr').length <= 0) {
                            $('.new_tj').length > 0 ? $('.new_tj').show() : $('.loading').after('<div class="new_tj" style="">将商品链接添加至方框内，例如<span>item.taobao.com/?id=20230</span></div>');
                        }
                        PieceShop.calcPriceTotal();
                    }
                } else {
                    alert('删除失败！');
                }
            }
        });
        return false;
    },
    Num: 0,
    addProduct: function (data) {
        var p = data.AllData;
        var Dom = $('.sp_info tr');
        for (var i = 0; i < Dom.length; i++) {
            var ThDom = Dom.eq(i);
            if (ThDom.find('td.w1 a').attr('rel') == p.ProductUrl) {

                var Htmlsku = ThDom.find('td.w4').attr('data-SkuId').split(','),
                    DataSku = data.RemarkId.split(','),
                    ErrorSku = false;
                for (var j = 0; j < Htmlsku.length; j++) {
                    if ($.inArray(Htmlsku[j], DataSku) < 0 && Htmlsku[j] != '') ErrorSku = true;
                }
                if (ErrorSku) continue;

                var Num = parseInt(ThDom.find('td.w3 input').val()) + data.Numbers, //增加后的数量
                    TextArea = ThDom.find('td.w4 textarea'), //备注Dom
                    Price = parseFloat(data.Price).toFixed(2)//价格计算
                ThDom.find('td.w3 input').val(Num);
                TextArea.val((TextArea.hasClass('hui') ? '' : TextArea.val()) + '  ' + data.Remarks);
                TextArea.val() == '' ? TextArea.addClass('hui').val('请填写商品备注') : TextArea.removeClass('hui');
                ThDom.find('td.w6').text('￥' + (Num * Price).toFixed(2));
                PieceShop.calcPriceTotal();
                return false;
            }
        }
        
        var str = $("<div class='sp_info sp_infoOn'><table><tr >"
        + "<td class='w1'><a href='javascript:void(0);' title='删除' rel='" + p.ProductUrl + "' alt='" + p.Identity + "' onclick='PieceShop.DeleteAjax(this,\"" + p.Identity + "\")'></a></td>"
        + "<td class='w2'><a href='javascript:void(0);' class='pic'><img alt='' src='" + p.Picture + "_40x40.jpg'></a><h3><a href='javascript:void(0);'>'" + p.ProductName + "'</a></h3></td>"
        + "<td class='w5'>￥" + parseFloat(data.Price).toFixed(2) + "</td>"
        + "<td class='w6'>￥" + (parseFloat(data.Price).toFixed(2) * data.Numbers).toFixed(2) + "</td>"
        + "<td class='w3'> <a class='jian' href='#' title='减'></a><input type='text' value='" + data.Numbers + "' class='DigitalNum" + (++this.Num) + "' /><a class='jia' href='#' title='加'></a></td>"
        + "<td class='w4' data-SkuId='" + data.RemarkId + "'><textarea class='" + (data.Remark == '' ? 'hui' : '') + "' onblur='PieceShop.undateRemarkblur(this)' onfocus='PieceShop.undateRemarkfocus(this)' cols='' rows=''>" + (data.Remark == '' ? '请填写商品备注' : data.Remark) + "</textarea></td>"
        + "</table></div>");
        $("div.ShopProduct > div.loading").hide();
        if ($('.sp_info tr').length <= 0) { $('.new_tj').hide(); }
        if ($("div.sp_infoOn").size() > 0) {
            if ($('#sp_info').length <= 0) {
                $("div.sp_infoOn").after("<div class='sp_info' id='sp_info'><table>" + $("div.sp_infoOn table").html() + "</table></div>")
            } else {
                $("#sp_info table").prepend($("div.sp_infoOn table").html());
            };

            $("#sp_info table tr:eq(0) td.w3 input").val($("div.sp_infoOn table td.w3 input").val());
            $("#sp_info table tr:eq(0) td.w4 textarea").val($("div.sp_infoOn table td.w4 textarea").val());
            $("div.sp_infoOn").remove();
        }
        $("div.loading").after(str);
        $('#sp_info table tr:odd').addClass('on');
        $('#sp_info table tr:even').removeClass('on');

        this.Digital({ dom: $('.DigitalNum' + this.Num) });
        this.Digital({ dom: $('.DigitalNum' + (this.Num - 1)) });
        PieceShop.calcPriceTotal();
    },
    revemoProduct: function (u, o) {
        $("div.sp_info table tr").each(function (i, n) {
            var _this = $(n);
            var url = $(n).attr("rel");
            _this.children("td.w1").find("a").click(function () {
                $.ajax({
                    type: "post",
                    url: "/App_Services/wsPieceService.asmx/DeleteProductById",
                    dataType: "json",
                    contentType: "application/json;utf-8",
                    data: "{id:'" + u + "'}",
                    timeout: 6000,
                    error: function () {
                        alert("网络请求错误,请稍后再试！");
                    },
                    complete: function () {
                        PieceShop.calcPriceTotal();
                        PieceShop.resetTable();
                    },
                    success: function (e) {
                        $(o).parent().parent("tr").remove();
                    }
                });
            });
        });
    },
    undateRemarkblur: function (n) {
        var dom = $(n).find('td.w4 textarea').length > 0 ? $(n).find('td.w4 textarea') : $(n),
               remark = dom.val(),
               URl = $(n).find('td.w4 textarea').length > 0 ? $(n).find('td.w1 a').attr('alt') : $(n).parents('tr').find('td.w1 a').attr('alt');
        if (!dom.val()) {
            dom.addClass('hui').val('请填写商品备注');
        }
        $.ajax({
            type: "post",
            url: "/App_Services/wsPieceService.asmx/UpdateReMarkOfProductById",
            dataType: "json",
            contentType: "application/json;utf-8",
            timeout: 6000,
            data: "{id:'" + URl + "',remark : '" + remark + "'}",
            error: function () {
                alert("网络请求错误,请稍后再试！");
            },
            complete: function () {

            },
            success: function (e) {
            }
        });
    },
    undateRemarkfocus: function (n) {
        var dom = $(n).find('td.w4 textarea').length > 0 ? $(n).find('td.w4 textarea') : $(n);
        if (dom.hasClass('hui') && dom.val() == '请填写商品备注') dom.removeClass('hui').val('');
    },
    updateRemark: function (n) {
        $(n).children("td.w4").find("textarea").blur(function () {
            PieceShop.undateRemarkblur(n)
        }).focus(function () {
            PieceShop.undateRemarkfocus(n)
        })
    },
    resetTable: function () {
        if ($("div.sp_info:not(.sp_infoOn) table tr").length == 0) {
            $("div.sp_info:not(.sp_infoOn)").remove();
            $("div.new_tj").show();
        }
    },
    calcPriceTotal: function () {

        var totalPrice = 0;
        var reg = new RegExp("[^\\d\\.]", "g");
        var totalNum = 0;
        $("div.sp_info:not(.sp_infoOn) table tr").each(function (i, t) {
            var money = parseFloat($.trim($(t).children("td.w5").text().replace(reg, "")));
            var num = parseInt($.trim($(t).children("td.w3").find('input:eq(0)').val()));
            totalPrice += money * num;
            totalNum += num

        });

        var firstTr = $("div.sp_infoOn table tr:first");
        if (firstTr.size() > 0) {
            var firstMoney = parseFloat($.trim(firstTr.children("td.w5").text().replace(reg, "")));
            var firstNum = parseInt($.trim(firstTr.children("td.w3").find('input:eq(0)').val()));
            totalPrice += firstMoney * firstNum;
            totalNum += firstNum;
        }
        $("#totalCount").text(totalNum);
        $("#totalPrice").text(totalPrice.toFixed(2));
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
    init: function () {
        var _this = this;
        $("#snatchBtn").click(function () { _this.crawlProduct($("#snatchUrl").val()) });

        $("div.sp_info table tr").each(function (i, n) {
            PieceShop.updateRemark(n);
        });

        $('.sp_info table tr').each(function (i, d) {
            PieceShop.Digital({ dom: $(d).find('td.w3 input') });
        });

        $('.ShopSubmit a').click(function () {
            if ($('.sp_info tr').length <= 0) {
                alert('请先在店铺中选择你要拼单的商品');
                return false;
            };
        });

        $('#snatchUrl').focus(function () {
            $(this).parent().parent().next().hide();
        });
    }
};


var ShopSku = {
    Data: {},
    SkuData: [],
    Id: '.addpanel_dialog',
    AddAllSku: function (data) {//增加弹层判断 
        var AllId = this.Id;
        this.Data = data;
        this.SkuData = [];
        if ($(AllId).length <= 0) {//不存在弹层
            this.Dom(data);
        } else {//存在弹层
            $('#ProductUrl', AllId).val(data.ProductUrl);
            $('#ProductName', AllId).val(data.ProductName);
            $('#ProductPic', AllId).val(this.ProductPic(data));
            $('#ProductImg', AllId).attr('src', data.Picture + '_100x100.jpg');
            $(AllId + ',.addpanel_overlay').show();
            this.AddMethodSku();
            return false;
        }
    },
    ObjName: function (name) {//在data里面查找相应的sku名称
        var Data = this.SkuData;
        for (var i = 0; i < Data.length; i++) {
            if (Data[i].Name == name) return i;
        };
        return false;
    },
    SkuDom: function () {//拼写sku的Html
        var Data = this.SkuData,
            skuList = this.Data.Skus,
            SkuHtml = '';
        if (typeof skuList === null || skuList === null || typeof skuList === 'undefined') { return '' };
        for (var i = 0; i < skuList.length; i++) {
            var Num = parseInt(this.ObjName(skuList[i].TypeName));
            isNaN(Num) ? Data.push({ Name: skuList[i].TypeName, Arr: [skuList[i]] }) : Data[Num].Arr.push(skuList[i]);
        };

        for (var j = 0; j < Data.length; j++) {
            SkuHtml += '<tr class="SkuData" rel="' + Data[j].Name + '"><td class="addpanel_zuo">' + Data[j].Name + '：</td><td><div style="position:relative;"><div class="addpanel_ansx" style="position:absolute;top:2px;left:385px;width:16px;">'
            + '<a href="javascript:void(0)" class="page-prev" onclick="ShopSku.SkuPaga(this,true,true)"></a><a href="javascript:void(0)" class="page-next" onclick="ShopSku.SkuPaga(this,false,true)"></a></div></div>'
            + '<div class="a_size"><ul>';
            var Arr = Data[j].Arr;

            for (var k = 0; k < Arr.length; k++) {
                SkuHtml += '<li><a rel="' + Arr[k].SkuId + '" href="javascript:void(0)">' + Arr[k].PropertyName + '</a></li>';
            };
            SkuHtml += '</ul></div></td></tr>';
        };
        if (Data.length == 0) {
            $('.addpanel_wangzhi', this.Id).css('marginTop', '100px');
        }
        return SkuHtml;
    },
    Matching: function (This) {//sku按钮事件 触发查询匹配的sku id
        var SkuId = $(This).attr('rel'),
            Matchs = [],
            skuCombination = this.Data.SkuCombinations,
            Error = [];
        for (var i = 0; i < skuCombination.length; i++) {//查询匹配sku并存储
            var SkuCom = skuCombination[i].SkuIds,
                SkuBoo = true;
            if (skuCombination[i].Quantity <= 0) {
                Array.prototype.push.apply(Error, SkuCom)
                continue; //判断存货量小于0跳过
            }
            for (var j = 0; j < SkuCom.length; j++) {
                if (SkuCom[j] == SkuId) {//sku相等的存储
                    Array.prototype.push.apply(Matchs, SkuCom);
                    SkuBoo = false;
                    break;
                };
            };
            if (SkuBoo) Array.prototype.push.apply(Error, SkuCom);

        };
        function relp(arr) {
            for (var i = 0; i < arr.length; i++) {
                for (var j = arr.length; i < j; j--) {
                    if (arr[i] == arr[j]) {
                        arr.splice(j, 1);
                    }
                }
            };
            return arr;
        }
        Matchs = relp(Matchs);
        Error = relp(Error);
        this.MatE(Matchs, SkuId, This, Error);
    },
    MatE: function (Matchs, SkuId, Th, Error) {//skuid 与sku html匹配
        var DlThrel = $(Th).parents('tr').attr('rel'),
            Num = parseInt(this.ObjName(DlThrel));
        isNaN(Num) ? '' : this.SkuData[Num].Change = $(Th).attr('rel'); //存储当前选中规格
        $('tr.SkuData', this.Id).each(function (i, t) {
            var Dlrel = $(t).attr('rel');
            if (!Dlrel || Dlrel == DlThrel) return;
            $(t).find('ul li a').each(function (j, k) {
                var Det = $(k).attr('rel'),
                boo = false,
                ErrBoo = true;
                for (var i1 = 0; i1 < Matchs.length; i1++) {
                    if (Matchs[i1] == Det) {
                        ErrBoo = false; //查询是否存在通过
                        boo = true;
                        continue;
                    }
                };
                for (var j1 = 0; j1 < Error.length; j1++) {
                    if (Error[j1] == Det) {
                        ErrBoo = false; //查询是否存在不通过
                    }
                };
                if (ErrBoo) boo = true;
                boo ? $(k).removeClass('Border_Hui') : $(k).addClass('Border_Hui'); //匹配成功增加hui样式否则去除hui样式
            });
        });
        //匹配结束
    },
    IsAnima: false,
    SkuPaga: function (This, Boole, anima) {//sku上下按钮事件
        if (ShopSku.IsAnima) return false;
        var SkuUl = $(This).parents('tr').find('ul'),
            SkuLIheight = 42,
            SkuUlheight = SkuUl.height(),
            SkuUlTop = SkuUl.css('marginTop') ? parseInt(SkuUl.css('marginTop')) : 0;
        if (anima) {
            if ((Boole && SkuUlTop >= 0) || (!Boole && -SkuUlTop >= SkuUlheight - SkuLIheight) || $(This).hasClass('page-none') || $(This).hasClass('page-nones')) return false;
            ShopSku.IsAnima = true;
            SkuUlTop += Boole ? SkuLIheight : -SkuLIheight;
            SkuUl.animate({ 'marginTop': SkuUlTop + 'px' }, 200, function () { ShopSku.IsAnima = false; });
        }

        var prev = $(This).parent().find('a:eq(0)'),
            next = $(This).parent().find('a:eq(1)');

        SkuUlTop >= 0 ?
              prev.addClass('page-nones').removeClass('page-prev') :
              prev.addClass('page-prev').removeClass('page-nones');

-SkuUlTop >= SkuUlheight - SkuLIheight ?
           next.addClass('page-none').removeClass('page-next') :
           next.addClass('page-next').removeClass('page-none');
        return false;
    },
    AddMethodSku: function () {//增加sku的选取事件
        var AllId = this.Id;
        $('tr#NumberTr', AllId).after(this.SkuDom());
        var Dom = $('tr.SkuData', AllId);
        Dom.each(function (i, t) {
            $(t).find('li a').click(function () {
                if ($(this).hasClass('Border_Hui')) return false;
                var SkuData = $(this).parents('tr');
                SkuData.find('li a').removeClass('a_on').prev().hide();
                $(this).addClass('a_on').prev().hasClass('a_checked') ? $(this).prev().show() : $(this).before('<div class="a_checked"></div>');
                ShopSku.Matching(this);
                ShopSku.PriceMatching() ? $('#ProductPic', AllId).val(ShopSku.PriceMatching()) : '';
                return false;
            });
            if ($(t).find('li').length <= 1) {
                $(t).find('li:first a').click();
            };
            ShopSku.SkuPaga($('.addpanel_ansx a:last', t), '', false);
        });
        return false;
    },
    PriceMatching: function () {//获取选取的sku价格
        var SkuId = [],
            skuCombination = this.Data.SkuCombinations,
            Errors = false;
        $('tr.SkuData', this.Id).each(function (i, t) {
            $(t).find('li a.a_on').length == 0 ? Errors = true : SkuId.push($(t).find('li a.a_on').attr('rel'));
        });
        var pDiscountPrice = this.Data.DiscountPrice;
        var pPrice = this.Data.Price;
        var rebate = this.ProductRebate(this.Data);
        if (Errors || typeof skuCombination === null || skuCombination === null || typeof skuCombination === 'undefined') {
            var pvipDiscountPrice = (parseFloat(pPrice) * rebate).toFixed(2);
            return parseFloat(pDiscountPrice > 0 ? pDiscountPrice > pvipDiscountPrice ? pvipDiscountPrice : pDiscountPrice : pvipDiscountPrice).toFixed(2);
        }
        for (var i = 0; i < skuCombination.length; i++) {
            var SkuCom = skuCombination[i].SkuIds,
                Matching = true;
            for (var j = 0; j < SkuId.length; j++) {
                if ($.inArray(SkuId[j], SkuCom) < 0) {
                    Matching = false;
                    break;
                };
            };
            if (Matching) {

                var skuPrice = skuCombination[i].Price;
                var skuDiscountPrice = skuCombination[i].Promo_Price;

                if (skuDiscountPrice > 0 || skuPrice > 0) {

                    if (skuDiscountPrice > 0) {

                        if (skuPrice > 0) {
                            var skuPriceDiscount = (parseFloat(skuPrice) * rebate).toFixed(2);
                            return parseFloat(skuDiscountPrice > skuPriceDiscount ? skuPriceDiscount : skuDiscountPrice).toFixed(2);
                        }
                        return parseFloat(skuDiscountPrice).toFixed(2);
                    }
                    if (skuPrice > 0) {
                        var skuPriceDiscount = (parseFloat(skuPrice) * rebate).toFixed(2);
                        if (skuDiscountPrice > 0) {
                            return parseFloat(skuDiscountPrice > skuPriceDiscount ? skuPriceDiscount : skuDiscountPrice).toFixed(2);
                        }
                        return parseFloat(skuPriceDiscount).toFixed(2);
                    }
                }
                var pvipDiscountPrice = (parseFloat(pPrice) * rebate).toFixed(2);
                return parseFloat(pDiscountPrice > 0 ? pDiscountPrice > pvipDiscountPrice ? pvipDiscountPrice : pDiscountPrice : pvipDiscountPrice).toFixed(2);

            }

        };
        var pvipDiscountPrice = (parseFloat(pPrice) * rebate).toFixed(2);
        return parseFloat(pDiscountPrice > 0 ? pDiscountPrice > pvipDiscountPrice ? pvipDiscountPrice : pDiscountPrice : pvipDiscountPrice).toFixed(2);
    },
    ProductRebate: function (p) {
        var userLevel = p.UserGroup, price = 0;
        if (p.Vip3Price + p.Vip2Price + p.Vip1Price + p.Vip4Price > 0 && userLevel > 0) {
            if (userLevel == 4) {
                if (p.Vip4Price > 0)
                    price = p.Vip4Price;
                else
                    UserLevel--;
            }
            if (userLevel == 3) {
                if (p.Vip3Price > 0)
                    price = p.Vip3Price;
                else
                    UserLevel--;
            }
            if (userLevel == 2) {
                if (p.Vip2Price > 0)
                    price = p.Vip2Price;
                else
                    UserLevel--;
            }
            if (userLevel == 1) {
                if (p.Vip1Price > 0)
                    price = p.Vip1Price;
                else
                    UserLevel--;
            }
            if (userLevel == 0)
                price = p.Price;
        }
        else {
            price = p.Price;
        }
        return price / p.Price;
    },
    ProductPic: function (p) {//计算vip价格
        //要显示商品促销价格
        //逻辑为 判断 将促销的价格和vip折扣价格相比较 谁少取谁
        var vipPrice = (p.Price * this.ProductRebate(p)).toFixed(2);
        if (typeof p.DiscountPrice != "undefined" && typeof p.DiscountPrice != null) {
            if (p.DiscountPrice > 0) {
                return p.DiscountPrice > vipPrice ? vipPrice : p.DiscountPrice.toFixed(2);
            }
            return vipPrice;
        }
        else {
            return vipPrice;
        }
    },
    VipLevelTip: function (p) {

        var vipPrice = (p.Price * this.ProductRebate(p)).toFixed(2);

        if (typeof p.DiscountPrice != "undefined" && typeof p.DiscountPrice != null) {
            if (p.DiscountPrice > 0) {

                if (p.DiscountPrice < vipPrice) {
                    return "";
                }
            }
        }
        var userLevel = p.UserGroup;
        var levelTip = "";
        if (p.Vip3Price + p.Vip2Price + p.Vip1Price + p.Vip4Price > 0 && userLevel > 0) {
            if (userLevel == 4) {
                if (p.Vip4Price > 0)
                    levelTip = "<span id=\"addpanel_userGroup\" style=\"color:#fff;background:#66CC00;padding:1px 2px;background:\">皇冠会员价</span>";
                else
                    UserLevel--;
            }
            if (userLevel == 3) {
                if (p.Vip3Price > 0)
                    levelTip = "<span id=\"addpanel_userGroup\" style=\"color:#fff;background:#66CC00;padding:1px 2px;background:\">钻石会员价</span>";
                else
                    UserLevel--;
            }
            if (userLevel == 2) {
                if (p.Vip2Price > 0)
                    levelTip = "<span id=\"addpanel_userGroup\" style=\"color:#fff;background:#66CC00;padding:1px 2px;background:\">白金卡会员价</span>";
                else
                    UserLevel--;
            }
            if (userLevel == 1) {
                if (p.Vip1Price > 0)
                    levelTip = "<span id=\"addpanel_userGroup\" style=\"color:#fff;background:#66CC00;padding:1px 2px;background:\">金卡会员价</span>";
                else
                    UserLevel--;
            }
            if (userLevel == 0)
                levelTip = "";
        }
        else {
            levelTip = "";
        }
        return levelTip;
    },
    Dom: function (data) {//弹层Html
        var Html = '';
        Html = $('<div class="addpanel_dialog"><div class="addpanel_windowname"><a href="javascript:void(0)" title="关闭" onclick="ShopSku.SkuClose()"></a></div><div class="addpanel_inlay">'
		         + '<div class="addpanel_procedure"></div><div class="addpanel_wangzhi"><dl><dt>购买商品页网址：</dt><dd><input class="addpanel_hui" id="ProductUrl" disabled="disabled" type="text" value="' + data.ProductUrl + '" /></dd>'
                 + '</dl><p style="display:">恭喜您！商品信息抓取成功，您可以修改购买数量和填写商品备注！</p><p class="addpanel_alert" style="display:none">系统未能抓取商品相关信息，您可以在输入框中填写相关信息</p></div>'
                 + '<div class="addpanel_data"><div class="addpanel_img"><img id="ProductImg" src="' + data.Picture + '"_100x100.jpg" /></div>'
                 + '<table><tr><td class="addpanel_zuo">商品名称：</td><td><input class="addpanel_k addpanel_hui" id="ProductName" disabled="disabled" type="text" value="' + data.ProductName + '" /></td></tr>'
                 + '<tr><td class="addpanel_zuo">商品价格：</td><td><input class="addpanel_hui" id="ProductPic" disabled="disabled" type="text" value="' + this.ProductPic(data) + '" /><span>RMB</span>' + this.VipLevelTip(data) + '</td></tr>'
                 + '<tr id="NumberTr"><td class="addpanel_zuo">购买数量：</td><td class="a_jj"><input type="text" id="ProductNumber"  value="1"/><a href="#" title="增加数量"></a><a class="addpanel_jian" href="#" title="减少数量"></a></td></tr>'
                 + '<tr><td class="addpanel_zuo">商品备注：</td><td><textarea class="addpanel_still" id="ProductRemark" cols="" rows="">可以告诉我们您对商品的特殊要求，比如：颜色.尺码等等</textarea></td></tr></table></div>'
                 + '<div class="addpanel_go"><span class="addpanel_Error">请填写</span><input class="addpanel_next_no" type="button" onmouseover="this.className=\'addpanel_next_\'" onmouseout="this.className=\'addpanel_next\'" />'
                 + '<a href="javascript:void(0)" title="关闭" onclick="ShopSku.SkuClose()">[关闭]</a></div></div></div><div class="addpanel_overlay"></div>');
        this.AddMethod(Html);
        return false;
    },
    AddMethod: function (Html) {//初始增加弹层的所有事件
        PieceShop.Digital({ dom: $('#ProductNumber', Html) }, true); //数量

        PieceShop.Digital({ dom: $('#ProductPic', Html), price: true }, true); //价格
        function Price(IdDom, text) {//价格运费方法
            IdDom.blur(function () {
                if (this.value == '') $(this).addClass('addpanel_red').val(text);
            }).focus(function () {
                if ($(this).hasClass('addpanel_red')) $(this).removeClass('addpanel_red').val('');
            });
            return false;
        };
        Price($('#ProductPic', Html), '请填写商品价格');

        $('#ProductRemark', Html).blur(function () {//备注增加方法
            if ($(this).val() == '') $(this).addClass('addpanel_still').val('可以告诉我们您对商品的特殊要求，比如：颜色.尺码等等');
        }).focus(function () {
            if ($(this).hasClass('addpanel_still')) $(this).removeClass('addpanel_still').val('');
        });

        $('.addpanel_go input', Html).click(function () {//提交增加方法
            return ShopSku.Submit();
        });

        $('body').prepend(Html);
        this.AddMethodSku();
        return false;
    },
    SkuClose: function (boo) {//关闭弹出层  并初始化
        var AllId = this.Id;
        $(AllId + ',.addpanel_overlay').hide();
        $('.addpanel_wangzhi', AllId).css('marginTop', '0px');
        $('tr.SkuData', AllId).remove();
        $('#ProductNumber', AllId).val(1);
        $('#ProductRemark', AllId).val('');
        return false;
    },
    Submit: function () {//增加商品按钮事件
        var AllId = this.Id,
        RemarkSku = '',
        RemarkId = '',
        RemarkSkuError = '',
        Data = this.Data,
        Numbers = parseInt($('#ProductNumber', AllId).val()),
        Remark = $('#ProductRemark', AllId).hasClass('addpanel_still') ? '' : $('#ProductRemark', AllId).val();

        $('tr.SkuData', AllId).each(function (i, t) {//获取sku信息  和错误信息
            if ($(t).find('li a.a_on').length == 0) {
                RemarkSkuError += (RemarkSkuError == '' ? '' : '、') + $(t).attr('rel')
            } else {
                RemarkId += $(t).find('li a.a_on').attr('rel') + ',';
                RemarkSku += $(t).attr('rel') + ":" + $(t).find('li a.a_on').text() + " ";
            }
        });
        RemarkId = RemarkId.substring(0, RemarkId.length - 1);

        if (RemarkSkuError != '') {//如果错误信息  事件
            $('.addpanel_Error', AllId).text('请填写' + RemarkSkuError);
            $('.addpanel_Error', AllId).css('opacity', '0.3').show()
            $('.addpanel_Error', AllId).animate({ marginTop: '-40px', opacity: '0.8' }, 700, function () {
                setTimeout(function () {
                    $('.addpanel_Error', AllId).animate({ marginTop: '-15px', opacity: '0.3' }, 400, function () {
                        $('.addpanel_Error', AllId).hide();
                    });
                }, 300)
            })
            return false;
        };

        if (isNaN(Numbers) || Numbers <= 0) {
            alert('填写数量错误;');
            return false;
        };
        
        var datas = {
            Numbers: Numbers,
            Price: this.PriceMatching(),
            Remark: RemarkSku + (Remark == "" ? "" : (RemarkSku == "" ? "" : "|") + Remark),
            Remarks: Remark,
            RemarkId: RemarkId,
            AllData: Data
        };
        $.ajax({//更改抓取信息  
            type: "post",
            url: "/App_Services/wsPieceService.asmx/UpdateProductOfProductById",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{id:'" + Data.Identity + "',number:'" + Numbers + "',skuid:'" + RemarkId + "',remark:'" + Remark + "'}",
            timeout: 6000,
            error: function () {
                alert("网络请求错误,请稍后再试！");
            },
            success: function (e) {
                if (e.d) {
                    ShopSku.SkuClose(true);
                    PieceShop.addProduct(datas);
                } else {
                    alert('网络请求错误,请稍后再试！');
                    return false;
                }
            }
        });
        return false;
    }

};
$(document).ready(function () {
    PieceShop.init();
});