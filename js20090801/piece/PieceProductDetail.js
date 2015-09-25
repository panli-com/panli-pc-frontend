var pProductDetail = {
    init: function () {
        //配置并初始化jqzoom
        var options = {
            zoomType: 'standard',
            lens: true,
            preloadImages: true,
            alwaysOn: false,
            zoomWidth: 250,
            zoomHeight: 250,
            zoomHeightFun: function () { return $('#JqzoomImg').height(); },
            zoomWidthFun: function () { return $('#JqzoomImg').width(); },
            xOffset: 10,
            yOffset: -3,
            position: 'right',
            disableZoomAttributeDomID: 'JqzoomImg',
            title: false
        };
        //抓取成功才使用图片放大器
        $('.jqzoom').jqzoom(options);
        //延时加载图片
//        $("div.DetailsCTao_Con img").lazyload({
//            //placeholder: "http://sf.panli.com/FrontEnd/images20090801/Tools/Estimates/160px_160px.gif",
//            effect: "fadeIn"
//        });
    }
};



var snatchProduct = {};
var shopBuy = {
    init: function () {
        this.method();
        this.skuGroup.init();
        //this.goodsList.init();
    },
    method: function () {
        var skuId = '#DetailsC_ConSku',
            _this = this;

        $('.DetailsC_Textarea', skuId).focus(function () {//备注方法
            if ($.trim($(this).val()).length == 0 || $(this).hasClass('DetailsC_TextareaHui')) $(this).removeClass('DetailsC_TextareaHui');
        }).blur(function () {
            if ($.trim($(this).val()).length == 0) $(this).addClass('DetailsC_TextareaHui');
        });


        $('#DetailsCSubmit').val('添加到列表');
        $('#DetailsCSubmit').click(function () {//增加商品按钮事件
            _this.addSubmit(this);
            return false;
        });

        $('.DetailsC_ConImgMin li').mouseover(function () {
            if (hasClass('on')) return false;
            $(this).addClass('on').siblings('.on').removeClass('on');
        });
        this.numbers.isNumbers($('#Buy_NumInput'), true);
    },
    numbers: {//数量表单输入
        isNumbers: function (dom, boo) {
            this.digital({ dom: dom[0] });
            boo ? this.quantity(dom) : '';
            return false;
        },
        digital: function (o) {//为指定的表单赋方法只能输入数字或者指定的字符
            var obj = {
                dom: document,
                price: false,
                keyup: function () { }
            }
            obj = $.extend(obj, o);
            var dom = obj.dom, price = obj.price, keyup = obj.keyup;
            dom.style.imeMode = 'disabled'; //除谷歌浏览器禁止输入法切换
            dom.onkeydown = function (e) {
                var event = window.event || e, num = event.charCode ? event.charCode : event.keyCode, val = this.value;
                if (event.shiftKey || !((num >= 48 && num <= 57) || num == 8 || (num >= 96 && num <= 105) || (price && (num == 190 || num == 110) && val.indexOf('.') < 0 && val.length != 0))) {
                    return false;
                }
            };
            dom.onkeyup = function () {
                var rel = price ? /[^\d\.]/g : /[^\d]/g,
                    val = this.value.replace(rel, '');
                this.value = val;
                keyup(this);
                return false;
            };
        },
        quantity: function (dom) {
            var delayed = false;
            dom.blur(function () {
                var val = this.value.match(/^\d+/);
                if (!val || parseInt(val) <= 0) {
                    val = this.value = 1;
                };
                parseInt(val) <= 1 ? dom.prev().addClass('Hui') : dom.prev().removeClass('Hui');
            });
            dom.prev().click(function () {
                amendNum(this, true);
                return false;
            });

            dom.next().click(function () {
                amendNum(this, false);
                return false;
            });

            var amendNum = function (_this, amend) {
                if (delayed || $(_this).hasClass('Hui')) return false;
                var val = dom.val().match(/^\d+/);
                val = !val ? '1' : val;
                amend ? (--val) : (++val);
                val > 1 ? dom.prev().removeClass('Hui') : function () {
                    dom.prev().addClass('Hui');
                    val = 1;
                } ();
                dom.val(val);
                return false;
            }
        }
    },
    skuGroup: {//sku生成html并赋方法；
        skuData: {},
        skuType: function (sku) {
            for (var i = 0; i < sku.length; i++) {
                this.skuData[sku[i].TypeName] ? this.skuData[sku[i].TypeName].push(sku[i]) : this.skuData[sku[i].TypeName] = [sku[i]];
            };
            return false;
        },
        init: function () {
            var sku = snatchProduct.Skus;
            this.addInfo();
            if (!sku || sku == "null" || sku.length == 0) { return false; };
            this.isSku();
            this.skuType(sku);
            this.addSku();
            this.addmethod();
            this.skuOne();
        },
        addInfo: function () {
            var Description = snatchProduct.Description;
            // alert(Description)
            var DescriptionDom = $('<div>' + Description + '</div>');
            $('img', DescriptionDom).lazyload({ effect: "fadeIn", placeholder: "http://sf.panli.com/FrontEnd/images20090801/Tools/Estimates/160px_160px.gif" });

            if (!Description || Description == null || Description.length == 0) {
                $("div.DetailsCTao").hide();
            } else {
                $('.DetailsCTao_Con').append(DescriptionDom);
            }
            return false;
        },
        skuOne: function () {
            $('#DetailsC_ConSku .DetailsC_Sku').each(function (i, t) {
                if ($('ul li', t).length == 1) {
                    $('ul li:eq(0)', t).click();
                }
            });
            return false;
        },
        addSku: function () {
            var html = '',
                sku = this.skuData;
            for (var i in sku) {
                html += '<dd><span>' + i + '：</span><div class="DetailsC_Sku"><div class="DetailsCTi">请选择' + i + '</div><ul>'
                for (var j = 0; j < sku[i].length; j++) {
                    html += '<li data-skuid=' + sku[i][j].SkuId + ' data-img="' + sku[i][j].PicUrl + '"><em></em><a href="#">' + sku[i][j].PropertyName + '</a></li>';
                }
                html += '</ul></div></dd>';
            };
            $('#SkuPerv').after(html);
        },
        skuAddHui: function () {
            var onSku = [], errSku = this.errSku;
            if (errSku.length == 0) return false;
            $('#DetailsC_ConSku .DetailsC_Sku').each(function (i, t) {
                if ($('li.on', t).length > 0) onSku.push($('li.on', t).attr('data-skuid'));
            });
            var id = this.examineId(onSku);
            $('#DetailsC_ConSku .DetailsC_Sku li').each(function (i, t) {
                if ($(t).hasClass('on')) return;
                var skuId = $(t).attr('data-skuid');
                $.inArray(skuId, id) >= 0 ? $(t).addClass('hui') : $(t).removeClass('hui');
            });
            return false;
        },
        errSku: [],
        okSku: [],
        isSku: function () {//把sku组合可以用的和不可以的分类
            var com = snatchProduct.SkuCombinations,
                errSku = [];
            if (com.length == 0) return false;
            for (var i = 0; i < com.length; i++) {
                com[i].Quantity <= 0 ? this.errSku.push(com[i]) : this.okSku.push(com[i])
            };
            return false;
        },
        examineId: function (onSku) {
            var errsku = this.errSku,
                presSku = [],
                arrSku = [],
                onSkuAll = new Array(),
                okSku = this.okSku,
                len = $('.DetailsC_Sku', '#DetailsC_ConSku').length;
            for (var j = 0; j < onSku.length; j++) {
                onSkuAll.push([onSku[j]])
                for (var i = 0; i < errsku.length; i++) {
                    if ($.inArray(onSku[j], errsku[i].SkuIds) >= 0) {
                        presSku.push(errsku[i]);
                        Array.prototype.push.apply(arrSku, errsku[i].SkuIds);
                    }
                }
            };
            switch (onSku.length) {//处理sku类型种类
                case 2:
                    //onSkuAll = len <= 2 ? onSkuAll : [];
                    onSkuAll.push([onSku[0], onSku[1]]);
                    break;
                case 3:
                    onSkuAll = [];
                    onSkuAll.push([onSku[0], onSku[1]]);
                    onSkuAll.push([onSku[1], onSku[2]]);
                    onSkuAll.push([onSku[0], onSku[2]]);
                    onSkuAll.push([onSku[0], onSku[1], onSku[2]]);
                    break;
                case 4:
                    onSkuAll = [];
                    onSkuAll.push([onSku[0], onSku[1]]);
                    onSkuAll.push([onSku[0], onSku[2]]);
                    onSkuAll.push([onSku[0], onSku[3]]);
                    onSkuAll.push([onSku[1], onSku[2]]);
                    onSkuAll.push([onSku[1], onSku[3]]);
                    onSkuAll.push([onSku[2], onSku[3]]);
                    onSkuAll.push([onSku[0], onSku[1], onSku[2]]);
                    onSkuAll.push([onSku[0], onSku[1], onSku[3]]);
                    onSkuAll.push([onSku[0], onSku[2], onSku[3]]);
                    onSkuAll.push([onSku[1], onSku[2], onSku[3]]);
                    break;
            }
            arrSku = this.query.delRepeat(arrSku);
            var errorZ = [];

            for (var i = 0; i < arrSku.length; i++) {
                var boo = false,
                    boossss = true; //是否在同一类别
                for (var j = 0; j < onSkuAll.length; j++) {
                    var arron = onSkuAll[j];
                    if (onSkuAll[j].length >= (len - 1)) {
                        var lenone = new Array(arrSku[i]);
                        Array.prototype.push.apply(lenone, onSkuAll[j]);

                        lenone = lenone.sort(function (a, b) { return a - b }).toString();
                        for (var l = 0; l < errsku.length; l++) {
                            var errskul = errsku[l].SkuIds.sort(function (a, b) { return a - b }).toString();
                            if (lenone == errskul) {
                                errorZ.push(arrSku[i]);
                                continue;
                            }
                        };
                    }
                    if (onSkuAll[j] == '' || !onSkuAll[j] || $.inArray(arrSku[i], onSkuAll[j]) >= 0) continue;
                    if (this.query.isSameType(onSkuAll[j], arrSku[i])) {
                        boossss = false;
                        continue;
                    } else {
                        boossss = true;
                    }

                    for (var k = 0; k < okSku.length; k++) {
                        if ($.inArray(arrSku[i], okSku[k].SkuIds) < 0) continue;
                        var boos = true;
                        for (var n = 0; n < arron.length; n++) {
                            if (arron[n] == '' || !arron[n]) continue;
                            if ($.inArray(arron[n], okSku[k].SkuIds) < 0) {
                                boos = false;
                                break;
                            }
                        };
                        if (boos) boo = true;
                    }
                }
                if (!boo && boossss) errorZ.push(arrSku[i]);
            }
            return errorZ;
        },
        query: {
            isSameType: function (arrid, id) {
                var data = shopBuy.skuGroup.skuData;
                for (var i in data) {
                    var arrboo = false,
                        arridboo = false;
                    for (var j = 0; j < data[i].length; j++) {
                        if ($.inArray(data[i][j].SkuId, arrid) >= 0) arrboo = true;
                        if (data[i][j].SkuId == id) arridboo = true;
                    }
                    if (arrboo && arridboo) return true;
                }
                return false;
            },
            skuConId: function (skus) {//根据选中id，找到组合的id 和价格
                if (skus.length == 0) return '';
                var Sku = snatchProduct.SkuCombinations,
                    skus = skus.sort(function (a, b) { return a - b }).toString();
                for (var i = 0; i < Sku.length; i++) {
                    var Skui = Sku[i].SkuIds.sort(function (a, b) { return a - b }).toString();
                    if (Skui == skus) {
                        return Sku[i]
                    };
                };
                return '';
            },
            delRepeat: function (arr) {//去除重复
                var Repeat = []
                for (var i = 0; i < arr.length; i++) {
                    if ($.inArray(arr[i], Repeat) < 0) Repeat.push(arr[i]);
                }
                return Repeat;
            }
        },
        price: function () {
            var skuId = [],
                skuErorr = false,
                dom = $('#DetailsC_ConSku');

            $('.DetailsC_Sku', dom).each(function (i, t) {
                $('li.on', t).length > 0 ?
                           skuId.push($('li.on', t).attr('data-skuid')) :
                           skuErorr = true;
            });
            if (skuErorr) return false;
            var objPrice = this.query.skuConId(skuId);
            var disPrice = this.discount(objPrice);
            var Price = objPrice.Price,
                lowest = objPrice.Promo_Price;
            lowest = lowest <= 0 || crawlProduct.DiscountExpiredDate <= 0 ? Price : lowest;
            disPrice = disPrice <= 0 ? Price : disPrice;
            Price = Math.min(Price, lowest);
            disPrice = Math.min(Price, disPrice);
            $('.DetailsC_Mon', dom).text('￥' + Price.toFixed(2));
            crawlProduct.Price = disPrice;
        },
        discount: function (obj) {
            var vipDiscs = vipDisc,
                uGroup = $('#hidUserLevel').val();
            if (uGroup > 0) {
                vipDiscs = vipDiscs.v4 > 0 || $('') == "flanbian" ? vipDiscs.v4 : vipDiscs.v3 > 0 ? vipDiscs.v3 : vipDiscs.v2 > 0 ? vipDiscs.v2 : vipDiscs.v1 > 0 ? vipDiscs.v1 : 0;
            };
            var Price = obj.Price;
            var Promo = obj.Promo_Price <= 0 || crawlProduct.DiscountExpiredDate <= 0 ? Price : obj.Promo_Price;
            var disPrice = 0;
            if (vipDiscs > 0) {
                disPrice = Price * vipDiscs;
            };
            if (Promo > disPrice && disPrice != 0) {
                $('#SkuPerv').show();
                $('#SkuPerv em').text('￥' + disPrice.toFixed(2));

            } else {
                $('#SkuPerv').hide();
            };
            return disPrice;
        },
        dataImg: function (_th) {
            var dataSrc = $(_th).attr('data-img');
            if (dataSrc != '') {
                var imgSrc = dataSrc + (/taobaocdn.com/.test(dataSrc) ? '_300x300.jpg' : '');
                $('#JqzoomImg').attr('src', imgSrc);
                $('.DetailsC_ConImgMin li.on').removeClass('on').find('.zoomThumbActive').removeClass('zoomThumbActive');
                $('.zoomWrapperImage img').attr('src', dataSrc);
            }
            return false;
        },
        addmethod: function () {
            var skuId = '#DetailsC_ConSku',
                _this = this,
                errSku = this.errSku;
            $('.DetailsC_Sku li', skuId).click(function () {
                if ($(this).hasClass('hui')) return false;
                if ($(this).hasClass('on')) {
                    $(this).removeClass('on');
                } else {
                    $(this).parents('div.DetailsC_Sku').find('.DetailsCTi').hide();
                    $(this).addClass('on').siblings('li.on').removeClass('on');
                };
                _this.skuAddHui();
                _this.price();
                _this.dataImg(this);
                return false;
            });
        }
    },
    addSubmitMess: function (sku, num, skuHtml) {
        var okSku = this.skuGroup.okSku,
            comSku = this.skuGroup.query.skuConId(sku);
        comSku = comSku == '' ? '' : comSku.CombinationId;
        snatchProduct.SkuCombinationId = comSku;
        snatchProduct.SkuRemark = skuHtml;
        snatchProduct.Remark = $.trim($('.DetailsC_Textarea').val());
        snatchProduct.BuyNum = num;
    },
    addSubmit: function () {
        var _this = this,
            skuId = '#DetailsC_ConSku',
            skuStr = [],
            skuErorr = false,
            skuHtml = '';
        $('.DetailsC_Sku', skuId).each(function (i, t) {
            if ($('li.on', t).length > 0) {
                skuHtml += (skuHtml == '' ? '' : ' ') + $('li.on a', t).text();
                skuStr.push($('li.on', t).attr('data-skuid'));
            } else {
                $('.DetailsCTi', t).show();
                skuErorr = true;
            }
        });
        if (skuErorr) return false;

        var num = $('#Buy_NumInput').val();
        if (!/^(0+)?[1-9](\d+)?$/.test(num)) {//验证提交商品数量是否符合
            alert('商品数量提交异常,请重新提交。');
            $('#Buy_NumInput').val(1);
            return false;
        };
        this.addSubmitMess(skuStr, num, skuHtml);
        //snatchProduct.Description = encodeURIComponent(snatchProduct.Description);


        $.ajax({
            type: "POST",
            url: "/App_Services/wsPieceService.asmx/AddPieceProductToCart",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{ url:'" + snatchProduct.ProductUrl + "',skuComId:'" + snatchProduct.SkuCombinationId + "',skuStr:'" + snatchProduct.SkuRemark + "',num:'" + snatchProduct.BuyNum + "',remark:'" + snatchProduct.Remark + "'}",
            timeout: 10000,
            beforeSend: function () {
                if ($('.shopBuyGoodsYes:visible').length == 0) { $('.shopBuyGoodsYes').show(); $('.shopBuyGoodsNo').hide(); }
                $('.BuyYesUl .BuyYesUlLoad').animate({ marginTop: '0px' }, 200);
            }, //商品列表加载显示 
            error: function () {
                alert('网络错误,请稍后重试。');
                $('.BuyYesUl .BuyYesUlLoad').animate({ marginTop: '-77px' }, 200);
                if ($('.shopBuyGoodsYes .BuyYesUl li').length <= 1) { $('.shopBuyGoodsYes').hide(); $('.shopBuyGoodsNo').show(); }
            },
            success: function (res) {
                var Result = res.d;
                var Products = {
                    "ProductName": snatchProduct.ProductName,
                    "ProductUrl": snatchProduct.ProductUrl,
                    "Picture": snatchProduct.Picture,
                    "Price": snatchProduct.Price,
                    "Num": snatchProduct.BuyNum,
                    "SkuStr": snatchProduct.SkuRemark,
                    "SkuComId": snatchProduct.SkuCombinationId
                };
                Result ? TuanList.goodsList.addLiHtml(Products)
                    : function () {
                        $('.BuyYesUl .BuyYesUlLoad').animate({ marginTop: '-77px' }, 200);
                        if ($('.shopBuyGoodsYes .BuyYesUl li').length <= 1) { $('.shopBuyGoodsYes').hide(); $('.shopBuyGoodsNo').show(); };
                    } ();
                return false;
            }
        });

    }
};

$(function () {
    snatchProduct = crawlProduct
    pProductDetail.init();
    shopBuy.init();

   // $('.DetailsCTao img').lazyload({ effect: "fadeIn" });
});