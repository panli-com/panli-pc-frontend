var CrawlerProduct = {
    init: function () {
        //配置并初始化jqzoom
        var options = {
            zoomType: 'standard',
            lens: true,
            preloadImages: true,
            alwaysOn: false,
            zoomWidth: 250,
            zoomHeight:250,
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
    }
};

$(function () {
    CrawlerProduct.init();
    Product.Init();  
});

var Product = {
    snatchData: {},
    Init: function () {

        this.snatchData = crawlProduct;
        if (crawlProduct.DiscountPrice <= 0) {
            crawlProduct.DiscountPrice = crawlProduct.Price;
        }
        this.goodsList.init();
        this.skuGroup.init();
        this.method();
        this.Freight();
    },
    Freight: function () {//运费小于0时处理
        var snatchs = this.snatchData;
        if (snatchs.Freight < 0) {
            $('#DetailsC_Freight').removeAttr('disabled').removeClass('addpanel_hui').addClass('amc_inputInit');
            var isFreightDom = $('<div class="DetailsC_isFreight"><span>请填写商品到上海的运费</span><div><em></em></div></div>')
                               .hover(function () { $('div,span', this).show(); },
                                      function () { $('div,span', this).hide(); })
            $('#DetailsC_Freight').val('').before(isFreightDom);
        }
    },
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
        quantity: function (dom, isPro) {//dom节点   ispro 是否要ajax请求保存数据
            var delayed = false,
                _th = this;
            dom.blur(function () {
                var val = this.value.match(/^\d+/);
                if (!val || parseInt(val) <= 0) {
                    val = this.value = 1;
                };
                parseInt(val) <= 1 ? dom.prev().addClass('Hui') : dom.prev().removeClass('Hui');
                isPro ? _th.numAjax(val, this) : '';
            });
            dom.prev().click(function () {
                amendNum(this, true);
                return false;
            });

            dom.next().click(function () {
                amendNum(this, false);
                return false;
            });
            if (dom.val() > 1) {
                dom.prev().removeClass('Hui');
            }
            var amendNum = function (_this, amend) {
                if (delayed || $(_this).hasClass('Hui')) return false;
                var val = dom.val().match(/^\d+/);
                val = !val ? '1' : val;
                amend ? (--val) : (++val);
                val > 1 ? dom.prev().removeClass('Hui') : function () {
                    dom.prev().addClass('Hui');
                    val = 1;
                } ();
                isPro ? _th.numAjax(val, _this) : dom.val(val);
                return false;
            }
        },
        numAjax: function (num, _this) {
            var product = $(_this).parents('li').find('a.productUrl');

            if ($(_this).attr('data-val') == parseInt(num)) return false;
            $.ajax({
                type: "POST",
                url: "/App_Services/CartProductProfile.asmx/UpdateShoppingcartNum",
                dataType: "json",
                contentType: "application/json;utf-8",
                data: "{url:'" + product.attr("href") + "',num:" + num + ",viplevel:" + uGroup + ",skuComId:'" + product.attr('data-productid') + "'}",
                timeout: 10000,
                beforeSend: function () { delayed = true; $('.BuyYesUl .Buy_NumInput').attr('disabled', 'disabled'); },
                complete: function () { delayed = false; $('.BuyYesUl .Buy_NumInput').removeAttr('disabled'); /*Product.totalPrice();*/ },
                error: function () {
                    $(_this).val($(_this).attr('data-val'));
                    alert('网络错误,请稍后重试。');
                },
                success: function (res) {
                    $(_this).parents('li').find('.Buy_NumInput').val(num);
                    if (num > 1) {
                        $(_this).parents('li').find('.Buy_NumLeft').removeClass('Hui')
                    }
                    $(_this).attr('data-val', num)
                    Product.goodsList.shopTotalPrice($(_this).parents('.shopType'));
                    return false;
                }
            });
        }
    },
    goodsList: {//商品列表系列
        init: function () {
            var data = sp_prol;
            if (data.length == 0) {
                $('.shopBuyGoodsYes').hide();
                $('.shopBuyGoodsNo').show();
            } else {
                this.shopType(data)
                this.loadHtml(this.Data);
                // Product.totalPrice();
                return false;
            }
        },
        Data: {},
        shopType: function (Data) {
            for (var i = 0; i < Data.length; i++) {
                this.Data[Data[i].Shop.Href] ? this.Data[Data[i].Shop.Href].push(Data[i]) : this.Data[Data[i].Shop.Href] = [Data[i]];
            };
            return false;
        },
        loadHtml: function (data) {
            if (data.length == 0) return '';
            for (var j in data) {
                var Html = '';
                for (var i = 0; i < data[j].length; i++) {
                    i == 0 ? $('.BuyYesTop').append(this.divHtml(data[j][i])) : $('.BuyYesTop ul:last').append(this.liHtml(data[j][i]));
                };

            }
            $('.BuyYesTop .shopType').each(function (i2, th) {
                var price = 0;
                $('ul.BuyYesUl li', th).each(function (i, t) {
                    price += parseFloat($('.BuyYes_Num', t).attr('data-pic')) * parseInt($('.Buy_NumInput', t).val());
                });
                $('.BuyYes_Total span', th).text('￥' + price.toFixed(2));
            });
            this.productNum();
            return false
        },
        productNum: function () {
            $('.shopBuyGoodsTitle').html('<em></em>您的购物车有' + $('.BuyYesTop .shopType li').length + '件商品');
            return false;
        },
        addLiHtml: function (obj) {
            var _this = this;
            obj = this.addShop.amendObj(obj);
            $('#productImg img').attr('src', obj.Thumbnail == '' || obj.Thumbnail == null ? 'http://sf.panli.com/FrontEnd/images20090801/noimg/noimg80.gif' : obj.Thumbnail).parent().css({ opacity: 0 }).show()
            $('#productImg').animate({ opacity: 1 }, 200);
            $('#BuyYesUlLoad .BuyYesUlLoad').animate({ marginTop: '-77px' }, 100, function () {
                _this.queryId(obj) ? '' : _this.addShop.isShop(obj);
            })
        },
        queryId: function (obj) {
            var _this = this, boo = false;
            var heights = 0;
            $('.BuyYesTop .shopType').each(function (num, th) {
                $('.BuyYesUl li', th).each(function (i, t) {
                    var productid = $('a', t).attr('data-productid'),
                        productUrl = $('a', t).attr('href');
                    productid = !productid ? '' : productid;
                    if (obj.SkuComId == productid && (obj.ProductUrl == productUrl ||
                    //手机端加后缀  适应手机端
                    productUrl.indexOf(obj.ProductUrl) >= 0
                    //obj.ProductUrl + '&_skuComId=' + obj.SkuComId == productUrl || obj.ProductUrl + '&_skuComId=' + obj.SkuComId + '&_skuComId=' + obj.SkuComId == productUrl||
                    //obj.ProductUrl + '?_skuComId=' + obj.SkuComId == productUrl || obj.ProductUrl + '&_skuComId=' + obj.SkuComId + '?_skuComId=' + obj.SkuComId == productUrl
                    //end手机端加后缀  适应手机端
                     )) {
                        $('.BuyYesTop').animate({ scrollTop: heights + 'px' }, 100, function () {
                            _this.addShop.productImg(function () {
                                var Allnum = parseInt($(t).find('.Buy_NumInput').val()) + parseInt(obj.BuyNum);
                                $(t).find('.Buy_NumInput').val(Allnum).attr('data-val', Allnum);
                                $(t).find('.Buy_NumInput').prev().removeClass('Hui');
                                var domheight = $(t).offset().top,
                                 buyYesheight = $('.BuyYesTop').offset().top;
                                _this.shopTotalPrice(th);
                            });
                        })
                        boo = true;
                    }
                })
                heights += $(th).height();
            });
            return boo;
        },
        addShop: {
            isShop: function (obj) {
                var boo = true, dom = '', _this = this;
                $('.BuyYesTop .shopType').each(function (i, t) {
                    var url = $('ul', t).attr('data-url');
                    if (obj.Shop.ShopUrl == url) {
                        boo = false;
                        dom = t;
                    }
                });
                !boo ? this.beShop(obj, dom) : this.notShop(obj);
            },
            beShop: function (obj, dom) {
                var _this = this;
                var domheight = $('.BuyYes_Total', dom).offset().top,
                    buyYesheight = $('.BuyYesTop').offset().top,
                    buyYeswidth = $('.BuyYesTop').offset().left,
                    gapHeight = buyYesheight - $('#productImg').offset().top + 30,
                    gapwidth = buyYeswidth - $('#productImg').offset().left;
                $('.BuyYesTop').animate({ scrollTop: domheight - buyYesheight + 'px' }, 100)
                _this.productImg(function () {
                    var liHtml = Product.goodsList.liHtml(obj);
                    liHtml.css('height:0px');
                    $('.BuyYesUl', dom).prepend(liHtml);
                    liHtml.animate({ height: '62px' }, 100);
                    Product.goodsList.shopTotalPrice(dom); //计算总价格
                    Product.goodsList.productNum(); //计算商品数量
                });
            },
            notShop: function (obj) {
                var _this = this;
                var buyYesheight = $('.BuyYesTop').offset().top,
                    buyYeswidth = $('.BuyYesTop').offset().left,
                    gapHeight = buyYesheight - $('#productImg').offset().top,
                    gapwidth = buyYeswidth - $('#productImg').offset().left;
                $('.BuyYesTop').animate({ scrollTop: '0px' }, 100, function () {
                    _this.productImg(function () {
                        var liHtml = Product.goodsList.divHtml(obj);
                        liHtml.css('height:0px');
                        $('#BuyYesUlLoad').after(liHtml);
                        liHtml.animate({ height: '107px' }, 300, function () {
                            liHtml.css('height', 'auto');
                        });
                        Product.goodsList.productNum(); //计算商品数量
                    });
                })

            },
            productImg: function (fun) {
                var buyYesheight = $('.BuyYesTop').offset().top,
                    buyYeswidth = $('.BuyYesTop').offset().left,
                    gapHeight = buyYesheight - $('#productImg').offset().top,
                    gapwidth = buyYeswidth - $('#productImg').offset().left;
                $('#productImg').animate({ top: gapHeight + 'px', left: gapwidth + 'px' }, 400, function () {
                    $('#productImg').css({ top: '0px', left: '0px', opacity: 0 }).hide();
                    typeof (fun) == 'function' ? fun() : '';
                    $('#DetailsCSubmit').removeAttr('disabled');
                });
            },
            amendObj: function (obj) {
                obj.Href = obj.ProductUrl;
                obj.Shop.Name = obj.Shop.ShopName;
                obj.Shop.Href = obj.Shop.ShopUrl;
                obj.Name = obj.ProductName;
                obj.PromotionPrice = obj.payPrice;
                return obj;
            }
        },
        divHtml: function (obj) {
            var shopName = obj.Shop.Name,
                _this = this;
            if (shopName == null || shopName == '' || shopName == obj.Shop.Href)
                shopName = "----";
            var Html = $('<div class="shopType"><div class="BuyYes_Total"><em title=' + shopName + '>' + shopName.substring(0, 10) + '</em><span>￥' + (_this.getDisPrice(obj) * obj.BuyNum).toFixed(2) + '</span></div><ul class="BuyYesUl" data-url="' + obj.Shop.Href + '"></ul></div>');
            $('ul', Html).append(this.liHtml(obj));
            return Html;
        },
        getDisPrice: function (obj) {
            var Price = obj.Price;
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
            var Dom = $('<li><a class="productUrl" data-productid="' + obj.SkuComId + '" href="' + obj.Href + '"><img src="' + (obj.Thumbnail == '' ? 'http://sf.panli.com/FrontEnd/images20090801/noimg/noimg80.gif' : shearImg(62, obj.Thumbnail)) + '" title="' + obj.Name + '" onerror="this.src=\'http://sf.panli.com/FrontEnd/images20090801/noimg/noimg80.gif\';"/></a>' +
                      '<div class="BuyYes_title" title="' + obj.SkuStr + '">' + obj.SkuStr.substring(0, _this._subStr(obj.SkuStr)) + '</div><div class="BuyYes_Num" data-pic="' + _this.getDisPrice(obj) + '"><span>￥' + _this.getDisPrice(obj).toFixed(2) + '</span>' +
                      '<p class="Buy_Num"><a href="javascript:void(0);" class="Buy_NumLeft ' + (obj.BuyNum <= 1 ? 'Hui' : '') + '">-</a><input type="text" maxlength="6" value="' + obj.BuyNum + '" data-val="' + obj.BuyNum + '" class="Buy_NumInput" /><a href="javascript:void(0);" class="Buy_NumRight">+</a></p>' +
                      '</div><div class="clear"></div></li>');
            Product.numbers.isNumbers($('.Buy_NumInput', Dom), true, true); //给单个商品增加只能输入数子和加减方法；
            return Dom;
        },
        _subStr: function (str) {
            if (!str || str.length == 0) return '';
            var charMatch = str.match(/[\u4e00-\u9fa5]/g);
            charMatch = charMatch == '' || !charMatch ? 0 : charMatch.length
            return charMatch + str.length;
        },
        shopTotalPrice: function (dom) {
            var price = 0;
            $('.BuyYesUl li', dom).each(function (i, t) {
                price += parseInt($('.Buy_NumInput', t).val()) * parseFloat($('.BuyYes_Num', t).attr('data-pic'));
            });
            $('.BuyYes_Total span', dom).text('￥' + price.toFixed(2));
            return false;
        }
    },
    skuGroup: {
        skuData: {},
        skuType: function (sku) {
            for (var i = 0; i < sku.length; i++) {
                this.skuData[sku[i].TypeName] ? this.skuData[sku[i].TypeName].push(sku[i]) : this.skuData[sku[i].TypeName] = [sku[i]];
            };
            return false;
        },
        init: function () {
            var sku = Product.snatchData.Skus;
            this.addInfo();
            if (!sku || sku == "null" || sku.length == 0) { return false; };
            this.isSku();
            this.skuType(sku);
            //this.addSku();
            this.addmethod();
            this.skuOne();
            errorSku = this.errSku;

            this.skuAddHui(true);
            this.removeSkuid(); //删除所有和无用skuid相关联的组合id
        },

        addInfo: function () {
            var Description = Product.snatchData.Description;
            var DescriptionDom = $('<div class="zoomOut">' + Description + '</div>');
            $('img', DescriptionDom).each(function (i, t) {//“梦芭莎”做了延时加载，还原！
                if ($(t).attr('data-original') != '') {
                    $(t).attr('src', $(t).attr('data-original'));
                }
            });
            $('img', DescriptionDom).lazyload({
                effect: "fadeIn",
                placeholder: "http://sf.panli.com/FrontEnd/images20090801/Tools/Estimates/160px_160px.gif",
                handler: ($('.zoomOut').css('transformOrigin') != 'undefined' ? function () { $('.DetailsCTao_Con').css('height', $('.DetailsCTao_Con').innerHeight() * 0.84); } : '')
            });
            $('.DetailsCTao_Con').append(DescriptionDom);
            return false;
        },
        skuOne: function () {
            $('#DetailsC_ConSku .DetailsC_Sku').each(function (i, t) {
                if ($('ul li', t).length == 1) {
                    Product.skuGroup.liclick($('ul li', t), true);
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
                    html += '<li data-skuid="' + sku[i][j].SkuId + '"  data-img="' + sku[i][j].PicUrl + '"><em></em><a href="#">' + sku[i][j].PropertyName + '</a></li>';
                }
                html += '</ul></div></dd>';
            };
            $('#SkuPerv').after(html);
        },
        skuAddHui: function (isOne) {//第一次检测
            var onSku = [], errSku = this.errSku;
            if (errSku.length == 0 || $('#DetailsC_ConSku .DetailsC_Sku').length == 1) return false;
            $('#DetailsC_ConSku .DetailsC_Sku').each(function (i, t) {
                if ($('li.on', t).length > 0) onSku.push($('li.on', t).attr('data-skuid'));
            });
            var id = this.examineId(onSku);
            this.removeSku = isOne ? id : [];
            $('#DetailsC_ConSku .DetailsC_Sku li').each(function (i, t) {
                if ($(t).hasClass('on')) return;
                var skuId = $(t).attr('data-skuid');
                if (!isOne) {
                    $.inArray(skuId, id) >= 0 ? $(t).addClass('hui') : $(t).removeClass('hui');
                } else {
                    $.inArray(skuId, id) >= 0 ? $(t).remove() : '';
                }
            });
            return false;
        },
        errSku: [],
        okSku: [],
        isSku: function () {//把sku组合可以用的和不可以的分类
            var com = Product.snatchData.SkuCombinations,
                errSku = [];
            if (!com || com.length == 0) return false;
            for (var i = 0; i < com.length; i++) {
                com[i].Quantity <= 0 ? this.errSku.push(com[i]) : this.okSku.push(com[i])
            };
            return false;
        },
        removeSkuid: function () {
            var removeSku = this.removeSku,
                 errSku = this.errSku,
                 newErrSku = [];
            for (var i = 0, len = errSku.length; i < len; i++) {
                if (!$.inArray(errSku[i], removeSku) >= 0) {
                    newErrSku.push(errSku[i]);
                }
            }
            this.errSku = newErrSku;
        },
        examineId: function (onSku) {//查找未成功id
            var errsku = this.errSku,
                okSku = this.okSku,
                query = this.query;
            var errorZ = [],
                typeData = this.skuData; //分类后的sku
            for (var j in typeData) {//遍历sku分类
                var newCom = onSku.slice(0); //复制一个onsku

                for (var k = 0, newTLen = typeData[j].length; k < newTLen; k++) {
                    for (var n = 0, nlen = onSku.length; n < nlen; n++) {
                        if (typeData[j][k].SkuId == onSku[n]) {
                            newCom.splice(n, 1);
                            break;
                        }
                    }
                }
                for (var k = 0, newTLen = typeData[j].length; k < newTLen; k++) {
                    var newComP = newCom.slice(0);
                    newComP.push(typeData[j][k].SkuId);
                    var isBoole = false;
                    for (var i = 0, len = okSku.length; i < len; i++) {
                        var skuids = okSku[i].SkuIds;
                        if (query.inArray(newComP, skuids)) {
                            isBoole = true;
                            break;
                        }
                    }
                    if (!isBoole) errorZ.push(typeData[j][k].SkuId);
                }
            }
            return errorZ;
        },
        query: {
            inArray: function (newarr, oldarr) {//判断一个数组是不是包含另外一个数组！
                if (newarr == '' || !newarr || !oldarr || oldarr == '') return false;
                var oldarrs = newarr.length > oldarr.length ? newarr : oldarr,
                     newarrs = newarr.length > oldarr.length ? oldarr : newarr;
                for (var i = 0; i < newarrs.length; i++) {
                    if ($.inArray(newarrs[i], oldarrs) < 0) return false;
                }
                return true;
            },
            isSameType: function (arrid, id) {//判断前面数组里面有无和后面id同组
                var data = Product.skuGroup.skuData;
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
                if (!skus || skus.length == 0) return '';
                var Sku = Product.snatchData.SkuCombinations;
                if (Sku.length == 0 || !Sku) return false;
                for (var i = 0; i < Sku.length; i++) {
                    var Skui = Sku[i].SkuIds;
                    if (this.inArray(Skui, skus)) {
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
            if (objPrice == '') return false;
            var disPrice = this.discount(objPrice);

            var Price = objPrice.Price,
                lowest = objPrice.Promo_Price;

            //需要修改的  第一个 如果选择的了sku那 crawlProduct对象中price则赋值为 sku的price
            //第二个 如果选择的了sku那有限时折扣价格 crawlProduct对象中DiscountPrice则赋值为 sku的Promo_Price
            //将商品的价格 变为sku选择的价格
            Product.snatchData.Price = Price;

            //将商品的显示折扣价格 变为sku的显示折扣价格
            //Product.snatchData.DiscountPrice = lowest === null ? -1 : lowest;

            lowest = lowest == 0 || Product.snatchData.DiscountExpiredDate <= 0 ? Price : lowest;
            disPrice = disPrice == 0 ? Price : disPrice;

            Price = Math.min(Price, lowest);
            disPrice = Math.min(Price, disPrice);

            if (Price <= 0 || !Price) return false;

            $('.DetailsC_Mon', dom).text('￥' + Price.toFixed(2));

            Product.snatchData.payPrice = disPrice;

        },
        discount: function (obj) {
            var vipDiscs = vipDisc;
            var Price = obj.Price;
            if (uGroup > 0) {
                vipDiscs = vipDiscs.v4 > 0 || $('#txtUserName').val() == "flanbian" ? vipDiscs.v4 : vipDiscs.v3 > 0 ? vipDiscs.v3 : vipDiscs.v2 > 0 ? vipDiscs.v2 : vipDiscs.v1 > 0 ? vipDiscs.v1 : 0;
                obj.Vip1Price = obj.Vip1Price > 0 ? obj.Vip1Price * Price : obj.Vip1Price;
                obj.Vip2Price = obj.Vip2Price > 0 ? obj.Vip2Price * Price : obj.Vip2Price;
                obj.Vip3Price = obj.Vip3Price > 0 ? obj.Vip3Price * Price : obj.Vip3Price;
                obj.Vip4Price = obj.Vip4Price > 0 ? obj.Vip4Price * Price : obj.Vip4Price;
            };
            var Promo = obj.Promo_Price <= 0 || Product.snatchData.DiscountExpiredDate <= 0 ? Price : obj.Promo_Price;
            var disPrice = 0;
            if (vipDiscs > 0) {
                disPrice = Price * vipDiscs;
            };
            if (Promo > disPrice && disPrice != 0) {
                $('#VIPPrice').show();
                $('#VIPPrice em').text('￥' + disPrice.toFixed(2));

            } else {
                $('#VIPPrice').hide();
            };
            return disPrice;
        },
        dataImg: function (_th) {
            var dataSrc = $(_th).attr('data-img');
            if (dataSrc != '') {
                var imgSrc = shearImg(250, dataSrc);
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
                _this.liclick(this);
                return false;
            });
        },
        liclick: function (_this, isFirst) {
            if ($(_this).hasClass('hui')) return false;
            if ($(_this).hasClass('on')) {
                $(_this).removeClass('on');
            } else {
                $(_this).parents('div.DetailsC_Sku').find('.DetailsCTi').hide();
                $(_this).addClass('on').siblings('li.on').removeClass('on');
                isFirst ? '' : this.dataImg(_this);
            };
            this.skuAddHui();
            this.price();
            return false;
        }
    },
    method: function () {
        var skuId = '#DetailsC_ConSku',
            _this = this;

        $('.DetailsC_Textarea', skuId).focus(function () {//备注方法
            if ($.trim($(this).val()).length == 0 || $(this).hasClass('DetailsC_TextareaHui'))
                $(this).removeClass('DetailsC_TextareaHui');
        }).blur(function () {
            if ($.trim($(this).val()).length == 0) $(this).addClass('DetailsC_TextareaHui');
        });

        var NotPrice = $('#notProductPrice');
        if (NotPrice.length > 0) {
            Product.numbers.digital({ dom: NotPrice[0], price: true });
            NotPrice.focus(function () {//商品价格
                if ($(this).hasClass('amc_red')) {
                    $(this).removeClass('amc_red').val('');
                }
            }).blur(function () {
                if ($.trim(this.value).length == 0) {
                    $(this).addClass('amc_red').val('请填写商品价格');
                }
            });
            if (NotPrice.val() != '请填写商品价格' && NotPrice.hasClass('amc_red')) {
                $(this).removeClass('amc_red');
            }
        }

        var NotPrice = $('#DetailsC_Freight');
        if (NotPrice.length > 0) {
            Product.numbers.digital({ dom: NotPrice[0], price: true });
            NotPrice.focus(function () {//运费价格
                if ($(this).hasClass('amc_red')) {
                    $(this).removeClass('amc_red').val('');
                }
            }).blur(function () {
                if ($.trim(this.value).length == 0) {
                    $(this).addClass('amc_red').val('请填写运费');
                }
            });
            if (NotPrice.val() != '请填写运费' && NotPrice.hasClass('amc_red')) {
                $(this).removeClass('amc_red');
            }
        }

        var NotName = $('#notProductName');
        if (NotName.length > 0) {
            NotName.focus(function () {//商品名称
                if ($(this).hasClass('amc_red')) {
                    $(this).removeClass('amc_red').val('');
                }
            }).blur(function () {
                if ($.trim(this.value).length == 0) {
                    $(this).addClass('amc_red').val('请填写商品名称');
                }
            });
            if (NotName.val() != '请填写商品名称' && NotPrice.hasClass('amc_red')) {
                $(this).removeClass('amc_red');
            }
        }


        $('#DetailsCSubmit').click(function () {//增加商品按钮事件

            _this.addSubmit(this);

            return false;
        });

        $('.DetailsC_ConImgMin li').mouseover(function () {
            $(this).addClass('on').siblings('.on').removeClass('on');
        });

        this.numbers.isNumbers($('#DetailsC_ConSku .Buy_Num input'), true);
    },
    addSubmitMess: function (num) {
        var okSku = this.skuGroup.okSku;
        Product.snatchData.Remark = $.trim($('.DetailsC_Textarea').val());
        Product.snatchData.BuyNum = num;
        //crawlProduct.Price = $('#SkuPerv .DetailsC_Mons s').text().match(/\d{1,}(\.\d+)?$/)[0];
    },
    addSubmit: function () {

        var ProductName = $('#notProductName')
        if (ProductName.length > 0) {
            var ProductNameText = $.trim(ProductName.val());
            if (ProductNameText.length == 0 || ProductName.hasClass('amc_red')) {
                return false;
            };
            Product.snatchData.ProductName = ProductNameText;
        }

        var ProductPrice = $('#notProductPrice');
        if (ProductPrice.length > 0) {
            var ProductPriceNum = parseFloat($('#notProductPrice').val());
            if (ProductPrice.hasClass('amc_red')) {
                alert('请填写商品价格');
                return false;
            };
            if (isNaN(ProductPriceNum) || ProductPriceNum == 0) {
                alert('商品价格格式错误,请重新提交。');
                return false;
            };
            Product.snatchData.Price = ProductPriceNum;
        };

        var ProductFreight = $("#DetailsC_Freight");
        if (ProductFreight.length > 0 && !ProductFreight.attr('disabled')) {
            var ProductFreightNum = parseFloat(ProductFreight.val());
            if (ProductFreight.hasClass('amc_red')) {
                alert('请填写运费价格');
                return false;
            };
            if (isNaN(ProductFreightNum)) {
                alert('运费价格格式错误,请重新提交。');
                return false;
            };
            Product.snatchData.Freight = ProductFreightNum;
        }

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

        var num = $('#DetailsC_ConSku .Buy_Num input').val();
        if (!/^(0+)?[1-9](\d+)?$/.test(num)) {//验证提交商品数量是否符合
            alert('商品数量提交异常,请重新提交。');
            $('#DetailsC_ConSku .Buy_Num input').val(1);
            return false;
        };
        this.addSubmitMess(num);
        Product.snatchData.DiscountExpiredDate = Product.snatchData.ClientDate;
        var comSku = this.skuGroup.query.skuConId(skuStr);
        comSku = comSku == '' ? '' : comSku.CombinationId;
        Product.snatchData.Description = "";
        //crawlProduct.Description = encodeURIComponent(crawlProduct.Description);
        if (comSku == '' && skuHtml != '') {
            alert('当前商品无库存，请重新选择。'); return false;
        }
        this.submitAjax(comSku, skuHtml);


    },
    submitAjax: function (comSku, skuHtml) {
        var price = Product.snatchData.payPrice,
        snatch = Product.snatchData;
        $.ajax({
            type: "POST",
            url: "/App_Services/wsAddItem.asmx/AddToShoppingCart",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: JSON.stringify({ "json": JSON.stringify(Product.snatchData), "skuStr": skuHtml, "skuComId": comSku }),
            timeout: 20000,
            beforeSend: function () {
                if ($('.BuyYesTop .shopType').length == 0) { $('.shopBuyGoodsYes').show(); $('.shopBuyGoodsNo').hide(); }
                $('#BuyYesUlLoad .BuyYesUlLoad').animate({ marginTop: '0px' }, 100);
                $('#DetailsCSubmit').attr('disabled', 'disabled');
            },
            complete: function () {

            },
            error: function () {
                alert('网络错误，请稍后再试');
                if ($('.BuyYesTop .shopType').length <= 0) { $('.shopBuyGoodsYes').hide(); $('.shopBuyGoodsNo').show(); }
                $('#BuyYesUlLoad .BuyYesUlLoad').animate({ marginTop: '-77px' }, 100);
                $('#DetailsCSubmit').removeAttr('disabled');
            },
            success: function (data) {
                data = data.d || data;
                snatch.SkuComId = comSku;
                snatch.SkuStr = skuHtml;
                snatch.Price = price == 0 || !price ? snatch.Price > snatch.DiscountPrice && snatch.DiscountPrice > 0 ? snatch.DiscountPrice : snatch.Price : price;
                data.Error == '' ? Product.goodsList.addLiHtml(Product.snatchData)
                                : function () {
                                    if ($('.BuyYesTop .shopType').length <= 0) { $('.shopBuyGoodsYes').hide(); $('.shopBuyGoodsNo').show(); };
                                    $('#BuyYesUlLoad .BuyYesUlLoad').animate({ marginTop: '-77px' }, 100);
                                    $('#DetailsCSubmit').removeAttr('disabled');
                                    alert("添加购物车失败！");
                                } ();
            }
        });
    }


};
