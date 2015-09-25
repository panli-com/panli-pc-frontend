function getViewportHeight() { if (window.innerHeight != window.undefined) { return window.innerHeight; } if (document.compatMode == "CSS1Compat") { return document.documentElement.clientHeight; } if (document.body) { return document.body.clientHeight; } return window.undefined; }
(function () {
    window.Panli = {};
    /*控件，可单独文件*/
    //全局遮罩层 
    window.Panli.Overlay = {
        dom: $('<div></div>').css({ "position": "fixed", "bottom": 0, "top": 0, "left": 0, "right": 0, "background": "#000", "height": "100%", "width": "100%", "_position": "absolute", "z-index": 800, "display": "none" }),
        open: function (color) { if (color) { this.dom.css("background", color); } else { this.dom.css("background", "#000"); } this.dom.fadeTo(100, 0.56); },
        close: function () { this.dom.hide(); },
        init: function () { $(document.body).append(this.dom); }
    }; //一键填单控件
    window.Panli.Crawl = {
        //层主体对象
        frame: $('<div class="addpanel_dialog" style="display:none;"><div class="addpanel_windowname"><h2>一键填单</h2><a href="#" title="关闭"></a></div></div>'),
        //抓取控件对象
        crawlDom: {
            //抓取的服务器地址
            snatchServiceUrl: '/Script/Snatch.json',
            addToShoppingCartServiceUrl: '/Script/AddToShoppingCart.json',
            //抓取到的商品
            snatchProduct: {
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
                Price: 0, //商品价格                
                //IsFreightFree: false, //是否免运费
                Picture: " ", //图片地址
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
            },
            //重设抓取商品信息
            resetSnatchProduct: function () {
                this.snatchProduct = {
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
                    Price: 0, //商品价格                
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
            },

            //框架层
            frame: $('<div class="addpanel_inlay"><div class="addpanel_procedure"><img src="http://tuan.panlidns.com/images/AddItemPanel/procedure.gif" alt="代购流程" /></div></div>'),
            //第一页对象
            firstDiv: $('<div class="addpanel_write"><label>购买商品页网址</label><div class="addpanel_address"><input type="text" value="" /></div><input class="addpanel_tijiao" type="button" onmouseover="this.className=\'addpanel_tijiao_\'" onmouseout="this.className=\'addpanel_tijiao\'" /></div>' +
            '<div class="addpanel_prompt addpanel_dhk"><p>请将您想代购商品的详细页网址粘贴到输入框中提交!</p></div><div class="addpanel_tishi"><h2>温馨提示：</h2><ul><li>为您代购中国所有购物网站的商品，系统将自动抓取商品信息！</li></ul></div>'),
            //第二页对象
            secondDiv: $('<div class="addpanel_wangzhi"><dl><dt>购买商品页网址：</dt><dd><input id="addpanel_pUrl" class="addpanel_hui" type="text" disabled="disabled" value="" /></dd></dl><p id="addpanel_pPromtS">恭喜您！商品信息抓取成功，您可以修改购买数量和填写商品备注！</p></div>'
                        + '<div class="addpanel_data"><div class="addpanel_img" id="productImg" style="display: inline;"><img src="" alt="" /></div><label style="display: none"><input type="checkbox" disabled="disabled" checked="checked" value="1" /><b>拍卖</b></label> '
                        + '<table><tr><td class="addpanel_zuo">商品名称：</td><td><input id="addpanel_pName" class="addpanel_hui addpanel_k" type="text" value="" /></td></tr>'
                        + '<tr><td class="addpanel_zuo">商品价格：</td><td><input id="addpanel_pPrice" class="addpanel_red" onkeyup="value=value.replace(/[^\\d\\.]/g,\'\')" type="text" value="请填写商品价格" /><span>RMB</span><span id="addpanel_userGroup" style="color:#fff;background:#66CC00;padding:1px 2px;background:">白金卡会员价</span></td></tr>'
                        + '<tr><td class="addpanel_zuo">中国大陆运费：</td><td><input onkeyup="value=value.replace(/[^\\d]/g,\'\')" id="addpanel_pFreight" class="addpanel_red" type="text" value="10" /><span>RMB</span></td></tr>'
                        + '<tr><td class="addpanel_zuo">购买数量：</td><td><input onkeyup="value=value.replace(/[^\\d]/g,\'\')" id="addpanel_pNum" type="text" /><a href="#" class="addpanel_plus" title="增加"></a><a class="addpanel_jian" href="#" title="减少"></a></td></tr>'
                        + '   <tr><td class="addpanel_zuo">商品备注：</td><td><textarea id="addpanel_pRemark" class="addpanel_still"  cols="" rows="">可以告诉我们您对商品的特殊要求，比如：颜色.尺码等等</textarea></td></tr></table></div>'
                        + ' <div class="addpanel_go"><input id="addpanel_nextBtn" class="addpanel_next" type="button" onmouseover="this.className=\'addpanel_next_\'" onmouseout="this.className=\'addpanel_next\'" /><a class="addpanel_clear" href="#">[清空]</a></div>'
                        + ''),
            //第三页对象
            thirdDiv: $('<div class="addpanel_succeed"><h2>恭喜！商品已经成功添加至购物车！</h2></div><div class="addpanel_last"><div class="addpanel_img"><img src="" alt="" /></div><div class="addpanel_show"><h2>UK泰迪熊台灯</h2><ul><li>商品价格：<span>￥155.00</span></li><li>国内运费：<span>20</span></li><li>购买数量：<span>1</span></li></ul></div></div><div class="addpanel_lastnav"><a href="http://www.panli.com/mypanli/ShoppingCart.aspx">查看购物车并结算</a><a class="addpanel_clear" href="#">继续填写代购单</a></div>'),

            //设置显示的层
            setDiv: function (div) {
                this.firstDiv.detach();
                this.secondDiv.detach();
                this.thirdDiv.detach();
                this.frame.append(div);
            },
            //重设第一页
            resetFirstDiv: function () {
                this.firstDiv.slice(1, 2).removeClass('addpanel_wrong').removeClass('addpanel_loading').addClass('addpanel_dhk').html('<p>请将您想代购商品的详细页网址粘贴到输入框中提交!</p>');
                $('.addpanel_address input', this.firstDiv).removeAttr('disabled').val('');
                $('.addpanel_tijiao', this.firstDiv).removeAttr('disabled');
            },
            //设置第二页显示内容
            setSecondDiv: function (product) {
                var cd = window.Panli.Crawl.crawlDom;
                $('#addpanel_nextBtn', this.secondDiv).removeAttr('disabled');
                this.snatchProduct = jQuery.extend(true, cd.snatchProduct, product || {});

                $('#addpanel_pUrl', cd.secondDiv).val(this.snatchProduct.ProductUrl);

                $('.addpanel_img img', cd.secondDiv).attr({ "src": this.snatchProduct.Thumbnail, "alt": this.snatchProduct.ProductName });
                if (this.snatchProduct.IsAuction) {
                    $('label', cd.secondDiv).show();
                } else {
                    $('label', cd.secondDiv).hide();
                }

                $('#addpanel_pName', cd.secondDiv).val(this.snatchProduct.ProductName);
                if (this.snatchProduct.ProductName == '' || this.snatchProduct.ProductName == null) {
                    $('#addpanel_pName', cd.secondDiv).addClass('addpanel_red').removeClass('addpanel_hui').removeAttr('disabled').val('请填写商品名称');
                } else {
                    $('#addpanel_pName', cd.secondDiv).addClass('addpanel_hui').removeClass('addpanel_red').attr('disabled', 'disabled');
                }

                //敏感商品               
                if (product.Error == 'KeyError') {
                    $('#addpanel_pPromtS', cd.secondDiv).addClass('addpanel_newalert').html('您代购的商品中含有仿牌和违禁品信息，我们将在审核后为您代购 &nbsp;<a href="http://service.panli.com/Help/Detail/331.html" target="_blank">了解详情</a>');
                } else {
                    $('#addpanel_pPromtS', cd.secondDiv).removeClass('addpanel_newalert').html('恭喜您！商品信息抓取成功，您可以修改购买数量和填写商品备注！');
                }
                var price = parseFloat(this.snatchProduct.Price).toFixed(2);
                //Vip价格逻辑
                if (cd.snatchProduct.UserGroup > 0) {
                    switch (cd.snatchProduct.UserGroup) {
                        case 1: price = cd.snatchProduct.Vip1Price > 0 ? cd.snatchProduct.Vip1Price : price; break;
                        case 2: price = cd.snatchProduct.Vip2Price > 0 ? cd.snatchProduct.Vip2Price : price; break;
                        case 3: price = cd.snatchProduct.Vip3Price > 0 ? cd.snatchProduct.Vip3Price : price; break;
                        case 4: price = cd.snatchProduct.Vip4Price > 0 ? cd.snatchProduct.Vip4Price : price; break;
                        default: break;
                    }
                }
                var DiscountPrice = parseFloat(this.snatchProduct.DiscountPrice);
                //显示会员价文字
                if (price != cd.snatchProduct.Price && cd.snatchProduct.UserGroup > 0 && (DiscountPrice <= 0 || (DiscountPrice > 0 && price < DiscountPrice))) {
                    $('#addpanel_userGroup', cd.secondDiv).css('background', '#66CC00').text(cd.snatchProduct.UserGroup == 1 ? '金卡' : (cd.snatchProduct.UserGroup == 2 ? '白金' : (cd.snatchProduct.UserGroup == 3 ? '钻石' : '皇冠')) + '会员价');
                } else {
                    $('#addpanel_userGroup', cd.secondDiv).css('background', '#fff').text('');
                }
                var adddom = $('#addpanel_pPrice', cd.secondDiv).addClass('addpanel_hui').removeClass('addpanel_red').attr('disabled', 'disabled');

                (DiscountPrice > 0 && DiscountPrice < price) ? adddom.val(this.snatchProduct.DiscountPrice) : (price > 0 ? adddom.val(price) : $('#addpanel_pPrice', cd.secondDiv).addClass('addpanel_red').removeClass('addpanel_hui').removeAttr('disabled').val('请填写商品价格'));
                //绑定运费
                var freight = parseFloat(this.snatchProduct.Freight);
                if (freight >= 0) {
                    $('#addpanel_pFreight', cd.secondDiv).addClass('addpanel_hui').removeClass('addpanel_red').attr('disabled', 'disabled').val(this.snatchProduct.Freight);
                } else {
                    $('#addpanel_pFreight', cd.secondDiv).addClass('addpanel_red').removeClass('addpanel_hui').removeAttr('disabled').val('请填写寄达上海的运费');
                }

                $('#addpanel_pNum', cd.secondDiv).val(this.snatchProduct.BuyNum);
                //设置备注
                if (this.snatchProduct.Remark != '') {
                    $('#addpanel_pRemark', cd.secondDiv).removeClass('addpanel_still').val(this.snatchProduct.Remark);
                } else {
                    $('#addpanel_pRemark', cd.secondDiv).addClass('addpanel_still').val('可以告诉我们您对商品的特殊要求，比如：颜色.尺码等等');
                }
            },

            //设置第三页显示内容
            setThirdDiv: function () {
                $('.addpanel_img img', this.thirdDiv).attr({ "src": this.snatchProduct.Thumbnail, "alt": this.snatchProduct.ProductName });
                $('.addpanel_show h2', this.thirdDiv).text(this.snatchProduct.ProductName);
                $('.addpanel_show span:eq(0)', this.thirdDiv).text('￥' + $('#addpanel_pPrice', this.secondDiv).val());
                $('.addpanel_show span:eq(1)', this.thirdDiv).text('￥' + this.snatchProduct.Freight);
                $('.addpanel_show span:eq(2)', this.thirdDiv).text(this.snatchProduct.BuyNum);
            },

            //初始化抓取控件
            init: function (para) {
                var cd = window.Panli.Crawl.crawlDom;
                para = jQuery.extend({
                    SnatchServiceUrl: cd.snatchServiceUrl,    //抓取服务器地址
                    AddProductUrl: cd.addToShoppingCartServiceUrl      //添加到购物车商品地址                   
                }, para || {});
                //配置服务器地址
                this.snatchServiceUrl = para.SnatchServiceUrl;
                this.addToShoppingCartServiceUrl = para.AddProductUrl;
                //第一页相关事件初始化
                $('.addpanel_tijiao', this.firstDiv).click(function () { cd.snatch(); return false; });
                $('.addpanel_address', this.firstDiv).keydown(function (e) { if (e.keyCode == 13) { cd.snatch(); return false; } });

                //第二页相关事件初始化
                //提交购物车按钮
                $('#addpanel_nextBtn', this.secondDiv).click(function () {
                    //参数验证通过                   
                    if (cd.validateProduct()) {
                        //提交服务器
                        $.ajax({
                            type: "POST",
                            url: cd.addToShoppingCartServiceUrl,
                            dataType: "json",
                            contentType: "application/json;utf-8",
                            data: JSON.stringify({ "json": JSON.stringify(cd.snatchProduct) }),
                            timeout: 20000,
                            beforeSend: function () {
                                $('#addpanel_nextBtn', this.secondDiv).attr('disabled', 'disabled');
                            },
                            complete: function () {
                                $('#addpanel_nextBtn', this.secondDiv).removeAttr('disabled');
                            },
                            error: function () {
                                alert('网络错误，请稍后再试');
                            },
                            success: function (data) {
                                data = data.d || data;
                                if (data.Error == '') {
                                    cd.setThirdDiv();
                                    cd.setDiv(cd.thirdDiv);
                                } else {
                                    alert(data.Error);
                                }
                            }
                        });
                    }
                    return false;
                });
                //错误内容填写焦点事件
                this.secondDiv.delegate('.addpanel_red', 'focus', function () {
                    $(this).removeClass('addpanel_red').val('');
                });
                //数量加号按钮
                $('.addpanel_plus', this.secondDiv).click(function () {
                    var tb = $('#addpanel_pNum', cd.secondDiv); tb.val(parseInt(tb.val()) + 1);
                });
                //数量减号按钮
                $('.addpanel_jian', this.secondDiv).click(function () {
                    var tb = $('#addpanel_pNum', cd.secondDiv); parseInt(tb.val()) < 2 ? 1 : tb.val(parseInt(tb.val()) - 1);
                });
                //数量框焦点脱离
                $('#addpanel_pNum', cd.secondDiv).blur(function () {
                    if ($(this).val().length <= 0) $(this).val(1);
                });
                //清空
                $('.addpanel_clear', this.secondDiv).click(function () {
                    cd.resetFirstDiv();
                    cd.setDiv(cd.firstDiv);
                    return false;
                });
                //备注
                $('#addpanel_pRemark', this.secondDiv).focus(function () {
                    if ($(this).hasClass('addpanel_still')) {
                        $(this).removeClass('addpanel_still').val('');
                    }
                })
                .blur(function () {
                    if ($(this).val().length <= 0) {
                        $(this).addClass('addpanel_still').val('可以告诉我们您对商品的特殊要求，比如：颜色.尺码等等');
                    }
                });


                //第三页相关事件初始化              
                $('.addpanel_clear', this.thirdDiv).click(function () {
                    cd.resetFirstDiv();
                    cd.setDiv(cd.firstDiv);
                    return false;
                });
                //内容页加载完毕
                this.resetFirstDiv();
                this.setDiv(this.firstDiv);
            },
            //抓取方法（打开）
            snatch: function (para) {
                para = jQuery.extend({
                    HasSnatch: false,    //是否抓取过
                    ProductUrl: "",      //商品URL
                    Remark: "",    //商品备注
                    BuyNum: 1,
                    needSnatch: true //是否需要抓取
                }, para || {});
                if (para.needSnatch) {//需要抓取
                    if (para.ProductUrl == '') {
                        para.ProductUrl = $('.addpanel_address input', this.firstDiv).val();
                    }

                    if (para.ProductUrl.indexOf("http://") < 0 && para.ProductUrl.indexOf("https://") < 0)
                        para.ProductUrl = "http://" + para.ProductUrl;
                    //该句代码用于外部按钮传入URL直接赋值
                    $('.addpanel_address input', this.firstDiv).val(para.ProductUrl);

                    //设置显示第一页
                    this.setDiv(this.firstDiv);
                    var reg = new RegExp("http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?");
                    if (!reg.test(para.ProductUrl)) {
                        this.firstDiv.slice(1, 2).removeClass('addpanel_dhk').addClass('addpanel_wrong').html('<p>输入的网址不正确，请核实后再填写！</p>');
                        return false;
                    }
                    this.submitSnatch(para);
                }
            },
            //提交服务器抓取
            submitSnatch: function (para) {
                var cd = window.Panli.Crawl.crawlDom;
                $.ajax({
                    type: "POST",
                    url: cd.snatchServiceUrl,
                    dataType: "json",
                    contentType: "application/json;utf-8",
                    data: '{"url":"' + window.Panli.htmlDecode(para.ProductUrl) + '"}',
                    timeout: 20000,
                    beforeSend: function () {
                        $('.addpanel_tijiao', cd.firstDiv).attr('disabled', 'disabled');
                        $('.addpanel_address input', cd.firstDiv).attr('disabled', 'disabled');
                        cd.firstDiv.slice(1, 2).removeClass('addpanel_wrong').removeClass('addpanel_dhk').addClass('addpanel_loading').html('<img src=" http://tuan.panlidns.com/images/topfoot/loading.gif" alt="抓取中" /><p>正在抓取商品信息...</p>');
                    },
                    complete: function () {
                        $('.addpanel_tijiao', cd.firstDiv).removeAttr('disabled');
                        $('.addpanel_address input', cd.firstDiv).removeAttr('disabled');
                    },
                    error: function () {
                        var url = para.ProductUrl
                        cd.resetSnatchProduct();
                        cd.snatchProduct.ProductUrl = url;
                        cd.snatchProduct.Shop.ShopUrl = url;
                        cd.setSecondDiv(cd.snatchProduct);
                        cd.setDiv(cd.secondDiv);
                    },
                    success: function (data) {
                        if (data.d) {
                            data = $.parseJSON(data.d);
                        }
                        //data = data.d || data;
                        para.ProductUrl = data.ProductUrl;
                        if (para.HasSnatch)
                            data = $.extend(para, data || {});
                        else
                            data = $.extend(data, para || {});
                        data.HasSnatch = true;
                        data.DiscountExpiredDate = data.ClientDate; //兼容反序列化问题
                        data._thumbnail = data.Thumbnail;
                        if (data.Error == "BlockedShop") {
                            cd.firstDiv.slice(1, 2).removeClass('addpanel_dhk').removeClass('addpanel_loading').addClass('addpanel_wrong').html("<p>该商品的卖家为嫌疑商家，请不要代购此商品！</p>");
                            return;
                        }
                        cd.setSecondDiv(data);
                        cd.setDiv(cd.secondDiv);
                    }
                });
            },
            //验证第二页是否填全信息
            validateProduct: function () {
                var name = $.trim($('#addpanel_pName', this.secondDiv).val());
                if (name == '') {
                    $('#addpanel_pName', this.secondDiv).addClass('addpanel_red').val('请填写商品名称');
                } else {
                    this.snatchProduct.ProductName = name;
                }
                if (!$('#addpanel_pPrice', this.secondDiv).hasClass('addpanel_hui')) {
                    var price = parseFloat($.trim($('#addpanel_pPrice', this.secondDiv).val()));
                    if (price > 0) {
                        this.snatchProduct.Price = price;
                    } else {
                        $('#addpanel_pPrice', this.secondDiv).addClass('addpanel_red').val('请填写商品价格');
                    }
                }
                if (!$('#addpanel_pFreight', this.secondDiv).hasClass('addpanel_hui')) {
                    var freight = parseFloat($.trim($('#addpanel_pFreight', this.secondDiv).val()));
                    if (freight >= 0) {
                        this.snatchProduct.Freight = freight;
                    } else {
                        $('#addpanel_pFreight', this.secondDiv).addClass('addpanel_red').val('请填写寄达上海的运费');
                    }
                }

                var num = parseInt($.trim($('#addpanel_pNum', this.secondDiv).val()));
                if (num > 0) {
                    this.snatchProduct.BuyNum = num;
                } else {
                    $('#addpanel_pNum', this.secondDiv).addClass('addpanel_red').val('请填写购买数量');
                }

                if (!$('#addpanel_pRemark', this.secondDiv).hasClass('addpanel_still')) {
                    this.snatchProduct.Remark = $('#addpanel_pRemark', this.secondDiv).val();
                }
                if ($('.addpanel_red', this.secondDiv).length > 0) {
                    return false;
                }
                return true;
            }
        },
        //打开方法
        open: function (para) {
            
            //传入商品URL
            if (typeof para === "string") {
                window.location.href = "/Crawler.aspx?purl=" + encodeURIComponent(para);
                //this.crawlDom.snatch({ ProductUrl: para });
            }
            //传入商品详细参数
            else {
                window.location.href = "/Crawler.aspx?purl=" + encodeURIComponent(para.ProductUrl);
                //this.crawlDom.snatch(para);
            }
            //this.frame.show();
            //window.Panli.Overlay.open();
        },
        //关闭方法
        close: function () {
            this.frame.hide();
            window.Panli.Overlay.close();
        },

        //初始化
        init: function (para) {
            para = jQuery.extend({
                SnatchServiceUrl: this.crawlDom.snatchServiceUrl,    //抓取服务器地址
                AddProductUrl: this.crawlDom.addToShoppingCartServiceUrl,      //添加到购物车商品地址
                CssUrl: "http://tuan.panlidns.com/css/AddItemPanel.css"  //样式表地址
            }, para || {});

//            var css = $('<link href="' + para.CssUrl + '" rel="stylesheet" type="text/css" />');
//            $('head', document).append(css);
//            //修复部分IE下的BUG
//            if ($.browser.msie) {
//                css.attr('href', para.CssUrl + '?v=1.0');
//            }
            //抓取控件核心部分开始初始化
            this.crawlDom.init(para);
            this.frame.append(this.crawlDom.frame);
            $(document.body).append(this.frame);
            $('.addpanel_windowname a', this.frame).click(function () {
                window.Panli.Crawl.close();
                return false;
            });

            //IE6下滚动跟随
            if (typeof document.body.style.maxHeight == "undefined") {
                this.frame.css("position", "absolute").css("margin-top", "0px");
                var divY = (getViewportHeight() - this.frame.outerHeight()) / 2;
                this.frame.css("top", (divY + document.documentElement.scrollTop).toString());
                $(window).scroll(function () { window.Panli.Crawl.css("top", divY + document.documentElement.scrollTop + ""); });
            }
        }
    };
    window.Panli.divhtmldecode = $('<div></div>');

    //全局方法
    window.Panli.htmlDecode = function (str) {
        window.Panli.divhtmldecode.html(str);
        return window.Panli.divhtmldecode.text();
    };
    window.Panli.htmlEncode = function (str) {
        window.Panli.divhtmldecode.text(str);
        return window.Panli.divhtmldecode.html();
    };
    window.Panli.Message = {
        Panel: {},
        init: function () {
            window.Panli.Message.Panel = $('<div class="Operation_cg"> </div>');
            jQuery(document.body).append(window.Panli.Message.Panel);
        },
        show: function (mess) {
            if (!window.Panli.Message.Panel.text)
                window.Panli.Message.init();
            window.Panli.Message.Panel.text(mess).stop(true, true).show();
            window.Panli.Message.Panel.fadeOut(2500);
        },
        showCallBack: function(mess,Callfun)
        {
            if (!window.Panli.Message.Panel.text)
                window.Panli.Message.init();
            window.Panli.Message.Panel.text(mess).stop(true, true).show();
            window.Panli.Message.Panel.fadeOut(2500,function(){
                Callfun();
            });
        }
    }
})();
var Panli = window.Panli;
//兼容老方法
var HtmlEncode = Panli.htmlEncode;
var HtmlDecode = Panli.htmlEncode;