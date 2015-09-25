var TuanList = {
    numbers: {//数量表单输入

        isNumbers: function (dom, boo, isPro) {
            this.digital({ dom: dom[0] });
            boo ? this.quantity(dom, isPro) : '';
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
        quantity: function (dom, isPro) {
            var delayed = false,
                _th = this;
            dom.blur(function () {
                var val = this.value.match(/^\d+/);
                if (!val || parseInt(val) <= 0) {
                    val = this.value = 1;
                };
                parseInt(val) <= 1 ? dom.prev().addClass('Hui') : dom.prev().removeClass('Hui');
                _th.numAjax(val, this);
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
                _th.numAjax(val, _this);
                return false;
            }
        },
        numAjax: function (num, _this) {
            var product = $(_this).parents('li').find('a.productUrl')
            $.ajax({
                type: "POST",
                url: "/App_Services/wsPieceService.asmx/UpdatePieceProductNum",
                dataType: "json",
                contentType: "application/json;utf-8",
                data: "{url:'" + product.attr('href') + "',skuComId:'" + product.attr('data-productid') + "',num:'" + num + "'}",
                timeout: 10000,
                beforeSend: function () { delayed = true; $('.BuyYesUl .Buy_NumInput').attr('disabled', 'disabled'); },
                complete: function () { delayed = false; $('.BuyYesUl .Buy_NumInput').removeAttr('disabled'); TuanList.totalPrice(); },
                error: function () {
                    alert('网络错误,请稍后重试。');
                },
                success: function (res) {
                    if (res.d) {
                        $(_this).parents('li').find('.Buy_NumInput').val(num);
                        if (num > 1) {
                            $(_this).parents('li').find('.Buy_NumLeft').removeClass('Hui')
                        }
                        TuanList.totalPrice(); //计算总价格
                    } else {
                        alert('网络错误,请稍后重试。');
                    }
                    return false;
                }
            });
        }
    },
    goodsList: {//商品列表系列
        tuanId: 0,
        init: function (data) {
            this.loadHtml(data.reverse());
            TuanList.totalPrice();
        },
        loadHtml: function (data) {
            if (data.length == 0) return '';
            var Html = $('<div></div>');
            for (var i = 0; i < data.length; i++) {
                $('.BuyYesTop ul').append(this.liHtml(data[i]));
            }
            return false
        },
        addLiHtml: function (obj) {
            var _this = this;
            this.queryId(obj) ? '' :
            $('.BuyYesTop').animate({ scrollTop: '0px' }, 100, function () {
                $('#productImg img').attr('src', obj.Picture);
                $('#productImg').css({ opacity: 0 }).show().animate({ opacity: 1 }, 100);
                var gapHeight = $('.BuyYesUl .BuyYesUlLoad').offset().top - $('#productImg').offset().top + 84,
                    gapwidth = $('.BuyYesUl .BuyYesUlLoad').offset().left - $('#productImg').offset().left;
                $('#productImg').animate({ top: gapHeight + 'px', left: gapwidth + 'px' }, 300, function () {
                    $('.BuyYesUl .BuyYesUlLoad').after(_this.liHtml(obj));
                    $('.BuyYesUl .BuyYesUlLoad').animate({ marginTop: '-77px' }, 100);
                    $('#productImg').css({ top: '0px', left: '0px', opacity: 0 }).hide();
                    TuanList.totalPrice(); //计算总价格
                });
            });
        },
        queryId: function (obj) {
            var _this = this, boo = false;
            $('.BuyYesUl li').each(function (i, t) {
                var productid = $('a', t).attr('data-productid'),
                    productUrl = $('a', t).attr('href');
                if (obj.SkuComId == productid && obj.ProductUrl == productUrl) {
                    $(t).find('.Buy_NumInput').val(parseInt($(t).find('.Buy_NumInput').val()) + parseInt(obj.Num));
                    setTimeout(function () { $('.BuyYesUl .BuyYesUlLoad').animate({ marginTop: '-77px' }, 100); }, 200);
                    TuanList.totalPrice();
                    boo = true;
                }
            });
            return boo;
        },
        getDisPrice: function (obj) {
            var Price = obj.Price,
            uGroup = $('#hidUserLevel').val();
            if (uGroup > 0) {
                Price = obj.VIPPrice4 > 0 ? obj.VIPPrice4 : obj.VIPPrice3 > 0 ? obj.VIPPrice3 : obj.VIPPrice2 > 0 ? obj.VIPPrice2 : obj.VIPPrice1 > 0 ? obj.VIPPrice1 : obj.Price;
            }
            if (obj.PromotionPrice > 0) {
                Price = Math.min(Price, obj.PromotionPrice)
            }
            return Price;
        },
        liHtml: function (obj) {//单个商品li 的html生成 并赋方法;
            var _this = this;
            var Dom = $('<li><a class="productUrl" data-productid="' + obj.SkuComId + '" href="' + obj.ProductUrl + '"><img src="' + obj.Picture + '" title="' + obj.ProductName + '" onerror="this.src=\'http://sf.panli.com/FrontEnd/images20090801/noimg/noimg220.gif\';"/></a>' +
                      '<div class="BuyYes_title" title="' + obj.SkuStr + '">' + obj.SkuStr + '</div><div class="BuyYes_Num" data-pic="' + _this.getDisPrice(obj) + '"><span>￥' + _this.getDisPrice(obj).toFixed(2) + '</span>' +
                      '<p class="Buy_Num"><a href="javascript:void(0);" class="Buy_NumLeft ' + (obj.BuyNum <= 1 ? 'Hui' : '') + '">-</a><input type="text" value="' + obj.Num + '" class="Buy_NumInput" /><a href="javascript:void(0);" class="Buy_NumRight">+</a></p>' +
                      '</div><div class="clear"></div></li>');
            TuanList.numbers.isNumbers($('.Buy_NumInput', Dom), true, true); //给单个商品增加只能输入数子和加减方法；
            return Dom;
        },
        _subStr: function (str) {
            var charMatch = str.match(/[\u4e00-\u9fa5]/g);
            charMatch = charMatch == '' || !charMatch ? 0 : charMatch.length
            return charMatch + str.length;
        }


    },
    totalPrice: function () {
        var Price = 0;
        $('.BuyYesUl li').each(function (i, t) {
            if ($(t).hasClass('BuyYesUlLoad')) return;
            var productNum = $(t).find('.Buy_NumInput').val(),
                productPic = $(t).find('.BuyYes_Num').attr('data-pic');
            Price += productNum * productPic;
        });
        $('.BuyYes_Total span').text('￥' + Price.toFixed(2));
        $('.shopBuyGoodsTitle').html('<em></em>拼店铺商品列表' + ($('.BuyYesUl li').length - 1));
        return false;
    },
    Init: function () {
        var _this = this;
        this.goodsList.tuanId = $('#tuanId').val();
        var data = pieceCartProducts;
        if (data.length == 0) {
            $('.shopBuyGoodsYes').hide();
            $('.shopBuyGoodsNo').show();
        } else {
            this.goodsList.init(data);
            return false;
        }
    }
};
$(function () {
    TuanList.Init();
});