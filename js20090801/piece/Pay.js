var ProPrice = 0;
var SendPrice;
var EnableObj = { price: 0, type: 0 ,conditions:0,allPrice:0};
$(function () {
    //配置并初始化jqzoom
    var options = {
        zoomType: 'standard',
        lens: true,
        preloadImages: true,
        alwaysOn: false,
        zoomWidth: 304,
        zoomHeight: 304,
        zoomHeightFun: function () { return $('#JqzoomImg').height(); },
        zoomWidthFun: function () { return $('#JqzoomImg').width(); },
        xOffset: 10,
        yOffset: -1,
        position: 'right',
        disableZoomAttributeDomID: 'JqzoomImg',
        title: false
    };

    //抓取成功才使用图片放大器
    $('.jqzoom').jqzoom(options);

    ProPrice = parseFloat($('#productPrice').val());
    SendPrice = parseFloat($('#sendPrice').val());
    //延时加载图片
    $("div.DetUR-XQ img").lazyload({
        //placeholder: "http://sf.panli.com/FrontEnd/images20090801/Tools/Estimates/160px_160px.gif",
        effect: "fadeIn"
    });
    SkuMatch.init(); //sku匹配
    getUserEnableCash(); //获取优惠券

});


var SkuMatch = {
    Data: [],
    ObjName: function (name) {
        var Data = this.Data;
        for (var i = 0; i < Data.length; i++) {
            if (Data[i].Name == name) return i;
        };
        return false;
    },
    matching: function (Th) {
        var SkuId = $(Th).attr('rel'),
            Matchs = [], Error = [];
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
        this.MatE(Matchs, SkuId, Th, Error);
    },
    MatE: function (Matchs, SkuId, Th, Error) {
        var DlThrel = $(Th).parents('tr').attr('rel'),
            Num = parseInt(this.ObjName(DlThrel));

        isNaN(Num) ? '' : this.Data[Num].Change = $(Th).text(); //存储当前选中规格
        isNaN(Num) ? '' : this.Data[Num].Sid = $(Th).attr('rel'); //存储当前选中规格

        $('.sp tr.SkuTr').each(function (i, t) {
            var Dlrel = $(t).attr('rel');
            if (!Dlrel || Dlrel == DlThrel) return;
            $(t).find('ul li a').each(function (j, k) {
                var Det = $(k).attr('rel'),
                boo = false, ErrBoo = true;
                for (var i1 = 0; i1 < Matchs.length; i1++) {
                    if (Matchs[i1] == Det) {
                        ErrBoo = false;
                        boo = true;
                        continue;
                    }
                };
                for (var j1 = 0; j1 < Error.length; j1++) {
                    if (Error[j1] == Det) {
                        ErrBoo = false;
                    }
                };
                if (ErrBoo) boo = true;
                boo ? $(k).removeClass('Border_Hui') : $(k).addClass('Border_Hui'); //匹配成功增加hui样式否则去除hui样式
            });
        });
        //匹配结束
    },
    PriceMatching: function () {//获取选取的sku价格
        var SkuId = [],
            Errors = false;
        $('.sp tr.SkuTr').each(function (i, t) {
            $(t).find('li a.Border_Red').length == 0 ? Errors = true : SkuId.push($(t).find('li a.Border_Red').attr('rel'));
        });
        if (Errors) return 0;
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
                //商品本身的限时折扣价格
                var productDiscountPrice = $("#productDiscountPrice").val();
                //商品本身的原价
                var pPrice = $("#pprice").val();
                //逻辑说明
                // 先将sku的价格打panli会员折扣价格，与sku的限时折扣价比较，谁小取谁

                //sku显示折扣价格
                var skuDiscountPrice = skuCombination[i].Promo_Price;
                //sku价格
                var skuPrice = skuCombination[i].Price;
                //折扣
                var rebate = this.ProductRebate(vipDisc);

                if (skuDiscountPrice > 0 || skuPrice > 0) {

                    if (skuDiscountPrice > 0) {
                        if (skuPrice > 0) {
                            var skuVIPPriceDiscount = skuPrice * rebate;
                            if (skuVIPPriceDiscount < skuDiscountPrice) {

                                SetPanliVipDisctPrice(skuVIPPriceDiscount);
                                SetTaobaoDisctPrice(skuDiscountPrice);
                                SetTotolDisctPrice(skuVIPPriceDiscount);
                                return skuVIPPriceDiscount;
                            }
                        }
                        SetTaobaoDisctPrice(skuDiscountPrice);
                        SetTotolDisctPrice(skuDiscountPrice);
                        return skuDiscountPrice;
                    }
                    if (skuPrice > 0) {
                        var skuVIPPriceDiscount = skuPrice * rebate
                        if (skuDiscountPrice > 0) {
                            if (skuVIPPriceDiscount > skuDiscountPrice) {

                                SetTaobaoDisctPrice(skuDiscountPrice);
                                SetTotolDisctPrice(skuDiscountPrice);
                                SetPanliVipDisctPrice(skuVIPPriceDiscount);
                                return skuDiscountPrice;
                            }
                        }
                        SetPanliVipDisctPrice(skuVIPPriceDiscount);
                        SetTaobaoDisctPrice(skuPrice);
                        SetTotolDisctPrice(skuVIPPriceDiscount);
                        return skuVIPPriceDiscount;
                    }
                }
                var pvipDiscountPrice = pPrice * rebate;
                var _oldp = productDiscountPrice > 0 ? productDiscountPrice > vipDiscountPrice ? vipDiscountPrice : productDiscountPrice : vipDiscountPrice;

                SetTaobaoDisctPrice(_oldp);
                SetTotolDisctPrice(_oldp);
                return _oldp;
            }
        };
        return 0;
    },
    ProductRebate: function (p) {
        return p.v4 > 0 ? p.v4 : p.v3 > 0 ? p.v3 : p.v2 > 0 ? p.v2 : p.v1 > 0 ? p.v1 : 1;
    },
    init: function () {
        $("#PayFeight").attr("checked", false);


        if (typeof skuList === "undefined" || typeof skuList === null || skuList === null || skuList.length <= 0) { return false };
        Data = this.Data;
        for (var i = 0; i < skuList.length; i++) {
            var Num = parseInt(this.ObjName(skuList[i].TypeName));
            isNaN(Num) ? Data.push({ Name: skuList[i].TypeName, Arr: [skuList[i]] }) : Data[Num].Arr.push(skuList[i]);
        };

        var Html = '';
        for (var j = 0; j < Data.length; j++) {
            Html += '<tr class="SkuTr" rel="' + Data[j].Name + '"><td class="l">' + Data[j].Name + '：</td><td><div class="Tishi" style="display:none;">请选择一种 ' + Data[j].Name + '!</div><ul class="DetColor">';
            var Arr = Data[j].Arr;
            for (var k = 0; k < Arr.length; k++) {
                Html += '<li><a rel="' + Arr[k].SkuId + '" href="javascript:void(0)">' + Arr[k].PropertyName + '</a></li>';
            };
            Html += '</ul></td></tr>';
        };
        $('.sp tr.shu').before(Html);

        $('.sp tr.SkuTr').each(function (i, t) {//点击规格促发效果
            $(t).find('td li a').click(function () {
                if ($(this).hasClass('Border_Hui')) return false;
                var dd = $(this).parents('td');
                dd.find('li a').removeClass('Border_Red');
                dd.find('.Tishi').hide();
                $(this).addClass('Border_Red');
                SkuMatch.matching(this);
                SkuMatch.PriceMatching();
                return false;
            });
            if ($(t).find('td li').length <= 1) {
                $(t).find('td li:first a').click();
            }
        });
    }
};

//设置Panli会员折扣
function SetPanliVipDisctPrice(p) {
    $("#plvipPriceTip,#plvipPrice").text("￥" + parseFloat(p).toFixed(2));
}
//设置Taobao会员折扣
function SetTaobaoDisctPrice(p) {
    $('.sp table tr:eq(2) b').text("￥" + parseFloat(p).toFixed(2));
}
//设置最终支付价格
function SetTotolDisctPrice(p) {
    ProPrice = p;
    /*var num = parseInt($("#PieceproductNum").val());
    ProPrice = parseFloat(p);
    $("#productPrice").val(ProPrice);
    if (document.getElementById("PayFeight").checked) {
        $("#ProPrice").text((ProPrice * num).toFixed(2));
        $("#totalPrice").text("￥" + (ProPrice * num + SendPrice).toFixed(2));
    }
    else {
        $("#ProPrice").text((ProPrice * num).toFixed(2));
        $("#totalPrice").text("￥" + (ProPrice * num).toFixed(2));
    }*/
    sumBlur();
}

//备注框焦点脱离
function rblur(dom) {
    if ($.trim($(dom).val()).length <= 0) $(dom).attr("class", "still");
}

//计算价格和需要的积分
function sumBlur() {
    var num = parseInt($("#PieceproductNum").val()),//获取数量
        ProSendPrice = (document.getElementById("PayFeight").checked ? SendPrice : 0), //获取运费
        proPriceAll = EnableObj.allPrice = ProPrice * num, //商品总价
        enable = EnableObj.conditions <= 0 || (EnableObj.conditions > 0 && EnableObj.conditions < proPriceAll) ? EnableObj.price : 0; //是否可以使用代金券
    EnableObj.setList && EnableObj.setList();//修改可以使用的list
    enable = Math.min(enable, proPriceAll);
    EnableObj.enable = enable;
        newProPriceAll=proPriceAll-enable;
    
    $("#ProPrice").text((proPriceAll).toFixed(2));
    var  $EnableTip=$("#ProEnable").text('-' + enable.toFixed(2)).next();
    EnableObj.conditions ==0 && EnableObj.price > enable ?
                       $EnableTip.html('<em>使用“直减'+EnableObj.price+'元”代金券，超出商品价格的部分不予以返还</em>').show():
                       $EnableTip.hide();
         $("#ProSendPrice").text(ProSendPrice.toFixed(2) + '(运费)');
         $("#totalPrice").text('￥' + (newProPriceAll + ProSendPrice).toFixed(2));
}

//提交检查
function checkall() {
    $('#Oksubmit').attr('disabled', 'disabled');
    for (var i = 0; i < $('.SkuTr').length; i++) {
        if ($('.SkuTr').eq(i).find('.DetColor a.Border_Red').length == 0) {
            $('.SkuTr').eq(i).find('.Tishi').show();
            $('#Oksubmit').removeAttr('disabled');
            return false;
        }
    }
    var p = $('#payPassword').val(); if (p.length <= 0) {
        alert('请输入支付密码！');
        $('#payPassword').focus();
        $('#Oksubmit').removeAttr('disabled');
        return false;
    }

    if (parseFloat($('#UserCurrentPrice').val()) < (ProPrice * parseInt($("#PieceproductNum").val()) - (EnableObj.enable?EnableObj.enable:0) + (document.getElementById("PayFeight").checked ? SendPrice : 0))) {
        alert('很抱歉，您的余额不足，无法参与本次拼单！');
        $('#Oksubmit').removeAttr('disabled');
        return false;
    }
    var SkuIdS = new Array();
    for (i in SkuMatch.Data) {
        SkuIdS.push(SkuMatch.Data[i].Sid);
    }
    $("#skuInfo").val(SkuIdS.join(","));
    return true;
}

//立即拼单
function instantlyPiece() {
    var PostBackUrl = window.location;
    window.Panli.Login(PostBackUrl);
}

function getUserEnableCash() {
    var $couponCode = $('#couponCode'),
        $subst = $('.substituting'),
        $substList = $('.substList'),
        $substCheck = $('.substCheck'),
        $newTotalPrice = $('#newTotalPrice'),
        $totalTip = $('#totalTip'),
        $newTotal = $('#newTotal'),
        $subBtn = $('#subBtn');

    $.ajax({
        type: "POST",
        url: "/App_Services/wsCouponManage.asmx/GetUserEnableCashCouponList",
        cache: false,
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"type":"1","node":"2"}',
        timeout: 15000,
        error: function () { $subst.parent().remove(); $("#ProEnable").remove(); },
        success: function (r) {
            if (r.d && r.d.length) {
                d = r.d;
                var html = '<span data-value="0">不使用代金券</span>',
                                      obj = {};
                for (var i = 0, len = d.length; i < len; i++) {
                    var newEvent = d[i];
                    html += '<span data-value="' + newEvent.CouponCode + '"><em class="fleft">' + (newEvent.Conditions > 0 ? '满' + newEvent.Conditions + '元减' + newEvent.Amount + '元' : '直减' + newEvent.Amount + '元') + '</em><em class="fright">有效期至' + newEvent.EndTimeToString + '</em></span>'
                    obj[d[i].CouponCode] = d[i];
                }
                $substCheck.click(function () {
                    $substList.find(':visible').length <= 0 ? $substList.show() : '';
                    return false;
                })
                $substList.find('span').click(function () {
                    $substList.hide();
                    $substCheck.html($(this).html());
                    return false;
                });
                $(document.body).click(function () { $substList.hide(); })
                $substList.html(html).find('span').click(function () {
                    $substList.hide();
                    $substCheck.html($(this).html());
                    var val = $.trim($(this).attr('data-value'));
                    var valObj = obj[val];
                    if (!valObj) {
                        EnableObj.price = 0;
                    } else {
                        EnableObj.price = valObj.Amount;
                        EnableObj.type = valObj.Eventype;
                        EnableObj.conditions = valObj.Conditions;
                    }
                    sumBlur();
                    $couponCode.val(val);
                    return false;
                });


                EnableObj.setList = function () {
                    var allprice = this.allPrice,
                        isShow = false;
                    $substList.find('span').each(function (i, t) {
                        var val = $.trim($(this).attr('data-value')),
                            valObj = obj[val];
                        if (val == 0) return;
                        $(this)[valObj && ((valObj.Conditions > 0 && allprice >= valObj.Conditions) || valObj.Conditions==0) ? (isShow = true, 'show') : 'hide']();
                    });
                    if (!isShow) {
                        $subst.parent().hide(); $("#ProEnable").hide();
                        $couponCode.val('');
                    } else {
                        $subst.parent().show(); $("#ProEnable").show();
                    }
                    return false;
                };
                sumBlur();
            } else {
                $subst.parent().remove(); $("#ProEnable").remove();
            }
        }

    });
}