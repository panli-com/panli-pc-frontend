var PieceShopProduct = {

    UrlKey_Focus: function (obj) {
        var val = $(obj).val();
        if (val == "请输入当前店铺商品链接") {
            $(obj).val('').removeClass('grey');
        }
    },

    UrlKey_Blur: function (obj) {
        var val = $(obj).val();
        if (val == '') {
            $(obj).val('请输入当前店铺商品链接').addClass('grey');
        }
    },
    //链接搜索
    UrlSearch: function () {
        var val = $('#urlKey').val().toLowerCase();

        if (val.indexOf('http://') < 0 && val.indexOf('https://') < 0) {
            alert('请输入正确的商品链接!');
            return false;
        }
        if (val.indexOf('taobao.com') < 0 && val.indexOf('tmall.com') < 0) {
            alert('仅淘宝下店铺商品链接搜索!');
            return false;
        }
        var pId = getQueryString("id");

        window.open('/Piece/PieceProductDetail.aspx?id=' + pId + "&purl=" + encodeURIComponent(val));

    },
    init: function () {
        var _this = this;
        $("input[type=text].NumInput").each(function () {
            _this.numbers.isNumbers($(this), true);
        });
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
            var url = $(dom).parents("li").attr("data-url");
            var skuComId = $(dom).parents("li").attr("data-skucomid");
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
                        $(dom).parents('p.Buy_Num').find('.NumInput').val(num);
                        if (num > 1) {
                            $(dom).prev().removeClass('Hui');
                        }
                        else {
                            $(dom).prev().addClass('Hui');
                        }
                    }
                }
            });
        }
    }
};
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2]; return null;
}
$(function () {
    PieceShopProduct.init();
});