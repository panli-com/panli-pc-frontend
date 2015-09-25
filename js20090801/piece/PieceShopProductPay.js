var EnableObj = { price: 0, type: 0, conditions: 0, allPrice: 0 };
var Pay = {
    init: function () {
        var _this = this;
        $('#PayFeight').click(function () {
            _this.calcTotalPrice();
            if ($(this).attr('checked') == 'checked') {
                $("#payPriceText").children("li:eq(1)").hide();
                $("#payPriceText").children("li:eq(2)").show();
            } else {
                $("#payPriceText").children("li:eq(1)").show();
                $("#payPriceText").children("li:eq(2)").hide();
            }
        });

        $("input[type=text].NumInput").each(function () {
            _this.numbers.isNumbers($(this), true);
        });
        var spRemarkPanel = $('<div class="beizhu" style="width: 282px;left:-294px; "><div class="bzbox"><textarea id="spRemarkInput" class="" name="" cols="" rows=""></textarea><dl><dt><input name="" type="button" value="提交" class="EditRemarkBtn" /></dt><dd><input class="CloseBtn" name="" type="button" value="关闭" /></dd></dl></div> <img src="http://sf.panli.com/FrontEnd/images20090801/newmypanli/jiantou.gif" alt="箭头"/></div>');
        spRemarkPanel.click(function (e) {
            e.stopPropagation();
        });

        $('textarea', spRemarkPanel).focus(function () {
            if ($(this).hasClass('red')) {
                $(this).removeClass('red').val('');
            }
        });

        $('.CloseBtn', spRemarkPanel).click(function () {
            spRemarkPanel.close();
            return false;
        });

        spRemarkPanel.open = function (dom) {
            spRemarkPanel.detach();
            $(dom).after(spRemarkPanel);
            $('textarea', spRemarkPanel).removeClass('red');
            spRemarkPanel.css({ "width": "0px", "left": "-10px" }).animate({ "width": "282px", "left": "-294px" }, { duration: "slow" });
            $('#spRemarkInput').val($(dom).nextAll('input').val());
        };

        spRemarkPanel.close = function () {
            spRemarkPanel.animate({ "width": "0px", "left": "-10px" }, function () { spRemarkPanel.detach(); });
        }

        spRemarkPanel.toggle = function (dom) {
            spRemarkPanel.stop(true, true);
            $(dom).find(".beizhu").length > 1 ? spRemarkPanel.close() : spRemarkPanel.open(dom);
        }

        $('.EditRemarkBtn', spRemarkPanel).click(function () {
            var $d = $(this);
            var oremark = $d.parents('.w5s').next('input').val();
            var nremark = $.trim($('#spRemarkInput').val());
            if (nremark.length <= 0) {
                $('textarea', spRemarkPanel).val('请填写商品备注').addClass('red');
                return false;
            }
            if (nremark == oremark) {
                spRemarkPanel.close();
                return false;
            }
            _this.remarkUpdate(this, nremark, spRemarkPanel);

        });

        $("div.w5s > a.a_bznn").click(function (e) {
            spRemarkPanel.toggle(this);
            e.stopPropagation();
            return false;
        });

        $("div.w5s > a.a_scnn").click(function (e) {
            _this.remove($(this));
            return false;
        });
        $(document).click(function () { spRemarkPanel.close(); });
    },
    numbers: {//数量表单输入
        isNumbers: function (dom, boo) {
            this.digital({ dom: dom[0] });
            boo ? this.quantity(dom, true) : '';
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
                isPro ? _th.numUpdata(val, this) : '';
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
                isPro ? _th.numUpdata(val, _this) : dom.val(val);
                return false;
            }
        },
        numUpdata: function (num, dom) {
            var url = $(dom).parents("tr").attr("data-url");
            var skuComId = $(dom).parents("tr").attr("data-skucomid");
            $.ajax({
                type: "POST",
                url: "/App_Services/wsPieceService.asmx/UpdatePieceProductNum",
                dataType: "json",
                contentType: "application/json;utf-8",
                data: "{url:'" + url + "',skuComId:'" + skuComId + "',num:'" + num + "'}",
                timeout: 10000,
                beforeSend: function () { $(dom).attr('disabled', 'disabled'); },
                complete: function () { $(dom).removeAttr('disabled'); },
                error: function () {
                    alert('网络错误,请稍后重试。');
                },
                success: function (res) {
                    if (res.d) {
                        $(dom).parents('div.Buy_Num').find('.NumInput').val(num);
                        if (num > 1) {
                            $(dom).prev().removeClass('Hui');
                        }
                        else {
                            $(dom).prev().addClass('Hui');
                        }
                        Pay.calcTotalPrice();
                    }
                }
            });
        }
    },
    calcTotalPrice: function () {
        var totalPrice = 0;
        $("tr", "#pieceProducts").each(function (i, t) {
            if ($('td.w4 input', t).length <= 0) return;
            var num = $('td.w4 input', t).val().match(/\d{1,}(\.\d+)?/)[0],
                price = $('td.w3', t).text().match(/\d{1,}(\.\d+)?/)[0];
            totalPrice += num * price;
        });
        totalPrice = EnableObj.allPrice = parseFloat(totalPrice);

        EnableObj.setList && EnableObj.setList();

        var enable = EnableObj.conditions <= 0 || (EnableObj.conditions > 0 && EnableObj.conditions < totalPrice) ? EnableObj.price : 0;
        enable = Math.min(enable, totalPrice);

        $('.couponPrice span').text('-' + enable.toFixed(2));

       

        totalPrice -= enable;

        var _maxFeight = parseFloat($('#PayFeight').attr("rel"));
        $('#PayFeight').attr('checked') == 'checked' ? $("#payPriceInFeight").text(parseFloat(totalPrice + _maxFeight).toFixed(2)) : $("#payPriceInFeight").text(totalPrice.toFixed(2));
        $("#payPriceNotInFeight,#payPriceNotInFeight2").text(totalPrice.toFixed(2));

        if (totalPrice + enable == 0) {
            $("#confirmPay").attr('disabled', 'disabled').removeClass().addClass("by_");
            $("dt.no").hide();
            return;
        }
        totalPrice = $('#PayFeight').attr('checked') == 'checked' ? parseFloat(totalPrice + _maxFeight) : totalPrice;
        if (totalPrice < this.AccountBalance) {
            $("dt.no").hide();
            $("#confirmPay").removeAttr('disabled').removeClass().addClass("by");
        }
        else {
            $("dt.no").show();
            $("#confirmPay").attr('disabled', 'disabled').removeClass().addClass("by_");
        }
    },
    remarkUpdate: function (dom, remark, spRemarkPanel) {
        var tr = $(dom).parents("tr");
        var url = tr.attr("data-url");
        var skuComId = tr.attr("data-skucomid");

        $.ajax({
            type: "POST",
            url: "/App_Services/wsPieceService.asmx/UpdatePieceProductRemark",
            cache: false,
            dataType: "json",
            beforeSend: function () { $(dom).attr('disabled', 'disabled'); },
            complete: function () { $(dom).removeAttr('disabled'); },
            contentType: "application/json;utf-8",
            data: "{url:'" + url + "',skuComId:'" + skuComId + "',remark:'" + remark + "'}",
            timeout: 10000,
            error: function () { alert('网络错误，请稍后再试'); },
            success: function (r) {
                if (r.d) {
                    spRemarkPanel.close();
                    $(dom).parents("div.w5s").find("input[type=hidden]").val(remark);
                }
            }
        });

    },
    remove: function (dom) {
        var tr = dom.parents("tr");
        var url = tr.attr("data-url");
        var skuComId = tr.attr("data-skucomid");
        $.ajax({
            type: "POST",
            url: "/App_Services/wsPieceService.asmx/RemovePieceProduct",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{url:'" + url + "',skuComId:'" + skuComId + "'}",
            timeout: 10000,
            beforeSend: function () { dom.attr('disabled', 'disabled'); },
            complete: function () { dom.removeAttr('disabled'); },
            error: function () {
                alert('网络错误,请稍后重试。');
            },
            success: function (res) {
                if (res.d) {
                    tr.remove();
                    Pay.calcTotalPrice();
                    if ($("tr", "#pieceProducts").length == 1) {
                        window.location.href = "/Piece";
                    }
                }

            }
        });
    },
    AccountBalance: 0,
    SubmitCheck: function () {

        var payTotal = $("#payPriceText > li:visible:eq(0)").children("b");
        var regex = /\d{1,}(\.\d+)?/;
        if (payTotal.size() > 0) {
            if (regex.test(payTotal.text())) {
                if (this.AccountBalance < parseFloat(payTotal.text())) {
                    alert('您的账户余额不足请充值！');
                    return false;
                }
            }
        }
        if ($("tr", "#pieceProducts").length <= 1) {
            alert("对不起，您未选择拼单商品不能支付！");
            return false;
        }
        if (!$('.am_payment input').val()) {
            $('.am_payment input').addClass('a_red');
            alert('请填写支付密码！');
            return false;
        }
        return true;
    }
};

$(function () {
    Pay.AccountBalance = parseFloat($("#myAccountBalance").text());
    Pay.init();
    getUserEnableCash() 
});

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
        error: function () { $(".substall").parent().remove(); },
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
                    Pay.calcTotalPrice();
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
                        $(this)[valObj && ((valObj.Conditions > 0 && allprice >= valObj.Conditions) || valObj.Conditions == 0)? (isShow = true, 'show') : 'hide']();
                    });
                    if (!isShow) {
                        $(".substall").parent().hide();
                        $couponCode.val('');
                    } else {
                        $(".substall").parent().show();
                    }
                    return false;
                };
                Pay.calcTotalPrice();
            } else {
                $(".substall").parent().remove();
            }
        }

    });
}