$(function() {
    $('#selfUrl').focus(function() {
        $("#urlError").hide();
        $(this).select();
        return false;
    }).keydown(function(e) {
        if (e.keyCode == 13) {
            $('#spCrawlBtn').click();
            return false;
        }
    });
    //抓取商品信息点击按钮
    $('#spCrawlBtn').click(function() {
        //验证链接是否合法
        var url = $('#selfUrl').val();
        if ($.trim(url).length <= 0) {
            $("#urlError").html("<p>请输入商品网址！</p>").show();
            return false;
        }
        var reg = new RegExp("http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?");
        if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0)
            url = "http://" + url;
        if (!reg.test(url)) {
            $("#urlError").html("<p>您输入的链接地址不正确，请核实后再填写！</p>").show();
            return false;
        }
        //判断页面上是否有抓取失败并且未填写信息的商品
        if ($('#addInputPanel:visible').length > 0) {
            alert('请先填写完上一件商品的信息');
            return false;
        }
        //判断页面上商品是否存在相同的
        var i = 0;
        while ($('.w2 a', '#splistPanel').length > i) {
            if ($('.w2 a:eq(' + (i++) + ')').attr('href') == url) {
                alert('该商品已经添加！');
                return;
            }
        }
        //提交抓取
        $.ajax({
            type: "POST",
            url: "/App_Services/wsSelfPurchase.asmx/GetProductInfo",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"url":"' + url + '"}',
            timeout: 50000,
            beforeSend: function() { $('#spCrawlBtn,#selfUrl').attr('disabled', 'disabled'); $("#spLoading").show(); $('#noitemPanel').hide(); },
            complete: function() { $("#spLoading").hide(); $('#spCrawlBtn,#selfUrl').removeAttr('disabled'); },
            error: function() { alert('网络错误，请稍后再试'); },
            success: function(r) {
                var p = $.parseJSON(r.d);
                if (p.e != '')
                    addInput(p);
                else
                    addProduct(p);
                $('#selfUrl').val('');
            }
        });
        return false;
    });
    //商品抓取成功后构建商品信息行
    function addProduct(p) {
        var t = '<table class="splist"><tr><td class="w1"><a class="spDelBtn" href="' + p.u + '" title="删除"></td> '
                        + '<td class="w2"><a href="' + p.u + '" class="pic" target="new"><img onerror="this.src=\'http://sf.panli.com/FrontEnd/images20090801/noimg/noimg80.gif\'" src="' + (p.p == '' ? 'http://sf.panli.com/FrontEnd/images20090801/noimg/noimg80.gif' : p.p) + '" alt="' + p.n + '" /></a><h3><a href="' + p.u + '" target="new">' + p.n + '</a></h3></td> '
                        + '<td class="w8" style="display: none;">¥' + p.pr + '</td><td class="w3"><a class="jian" href="#" title="减"></a><input type="text" value="' + p.m + '" class="spbuynum" /><a class="jia" href="#" title="加"></a></td> '
                        + '<td class="w4"><textarea class="' + (p.r == '' ? 'hui' : '') + '" cols="" rows="">' + (p.r == '' ? '请填写商品备注' : p.r) + '</textarea></td></tr></table>';
        t = $(t);
        //var t = $('<table class="splist"><tr><td class="w1"><a class="spDelBtn" href="' + p.u + '" title="删除"></td><td class="w2"><a href="' + p.u + '" class="pic" target="new"><img onerror="this.src=\'http://sf.panli.com/FrontEnd/images20090801/noimg/noimg80.gif\'" src="' + p.p + '" alt="' + p.n + '" /></a><h3><a href="' + p.u + '" target="new">' + p.n + '</a></h3></td><td class="w8">¥' + p.pr + '</td><td class="w3"><a class="jian" href="#" title="减"></a><input type="text" value="' + p.m + '" class="spbuynum" /><a class="jia" href="#" title="加"></a></td><td class="w4"><textarea class="' + (p.r == '' ? 'hui' : '') + '" cols="" rows="">' + (p.r == '' ? '请填写商品备注' : p.r) + '</textarea></td></tr></table>');
        t.hide();
        if ($('.splist:eq(0)').length <= 0) {
            $('#splistPanel').append(t);
        } else {
            $('.splist:eq(0)').before(t);
        }
        t.fadeIn(1200);
        $('#spsubmitPanel').show();
    }
    //商品抓取失败后构建用户自行输入商品信息列方法
    function addInput(p) {
        //商品已经抓取过
        if (p.e == "Exists") {
            alert('该商品已经添加！');
            return;
        }
        //初始化自己填写信息层
        addInputPanelInit();
        $('#addInputPanel').fadeTo(500, 1).data("product", p);
    }

    //输入商品信息确认点击
    $('#spinputsubmit').click(function() {
        //判断是否有未填或错误
        if ($('#addInputPanel .red').length > 0) {
            return false;
        }
        $.ajax({
            type: "POST",
            url: "/App_Services/wsSelfPurchase.asmx/UdProductName",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"name":"' + $('#spname').val() + '","remark":"' + $('#spremark').val() + '","price" : "' + $('#spprice').val() + '"}',
            timeout: 15000,
            beforeSend: function() { $('#spinputsubmit').attr('disabled', 'disabled'); },
            complete: function() { $('#spinputsubmit').removeAttr('disabled'); },
            error: function() { alert('网络错误，请稍后再试'); },
            success: function(r) {
                if (r.d == 'success') {
                    //取出商品对象，给备注和商品名赋值
                    var p = $('#addInputPanel').data("product");
                    p.n = $('#spname').val();
                    p.r = $('#spremark').val();
                    p.m = $('#spnum').val();
                    p.pr = $('#spprice').val();
                    $('#addInputPanel').hide();
                    addProduct(p);
                    p.m = parseInt($('#spnum').val());
                    upProNum(p.u, p.m, '');
                    return;
                }
                alert('添加失败');
            }
        });
        return false;
    });
    //初始化自己输入商品信息层方法
    function addInputPanelInit() {
        $('#spremark,#spname,#spprice').attr('class', 'red');
        $('#spprice').val("请填写商品单价");
        $('#spname').val('请填写商品名称');
        $('#spremark').val('请填写商品备注');
        $('#spnum').val('1');

        $('#spprice').val("0");
        $('#spprice').removeClass("red");
    }
    //输入信息删除
    $('#spinputDel').click(function() {
        $('#addInputPanel').fadeOut(500, function() {
            if ($('.splist').length <= 0) {
                $('#noitemPanel').show();
                $('#spsubmitPanel').hide();
            }
        });
        return false;
    });
    //删除商品
    $('.spDelBtn').live('click', function() {
        if (!confirm('您确定要删除这件商品吗？'))
            return false;
        var $d = $(this);
        $.ajax({
            type: "POST",
            url: "/App_Services/wsSelfPurchase.asmx/DelProduct",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"url":"' + $d.attr('href') + '"}',
            timeout: 10000,
            beforeSend: function() { $d.attr('disabled', 'disabled'); },
            complete: function() { $d.removeAttr('disabled'); },
            error: function() { alert('网络错误，请稍后再试'); },
            success: function(r) {
                if (r.d == 'success') {
                    var $t = $d.parents('.splist');
                    $t.fadeOut(500, function() {
                        $t.remove();
                        if ($('.splist').length <= 0) {
                            $('#noitemPanel').show();
                            $('#spsubmitPanel').hide();
                        }
                    });
                }
            }
        });
        return false;
    });
    //加法按钮
    $('.jia').live('click', function() {
        var $d = $(this).prev('input');
        $d.val(parseInt($d.val()) + 1);
        upProNum($(this).parents('.splist').find('.spDelBtn').attr('href'), $d.val(), this);
        return false;
    });
    //减法按钮
    $('.jian').live('click', function() {
        var $d = $(this).next('input');
        parseInt($d.val()) < 2 ? 1 : $d.val(parseInt($d.val()) - 1);
        upProNum($(this).parents('.splist').find('.spDelBtn').attr('href'), $d.val(), this);
        return false;
    });
    //数量输入框
    $('.spbuynum').live('keyup', function() {
        this.value = this.value.replace(/[^\d]/g, '');
    }).live('blur', function() {
        if (this.value.length <= 0) this.value = 1;
        upProNum($(this).parents('.splist').find('.spDelBtn').attr('href'), this.value, this);
    });
    //修改商品数量
    function upProNum(url, num, dom) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsSelfPurchase.asmx/UpBuynum",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"url":"' + url + '","n":' + num + '}',
            timeout: 10000,
            beforeSend: function() { $(dom).attr('disabled', 'disabled'); },
            complete: function() { $(dom).removeAttr('disabled'); },
            error: function() { alert('网络错误，请稍后再试'); },
            success: function() {

            }
        });
    }
    $(".splist textarea[name=reprice]").live('focus', function() {
        var c = $(this).attr("class"); if (c == "hui" || c == "red") $(this).attr("class", "").val("");
        $(this).data("price", $.trim($(this).val()));
    }).live('blur', function() {
        var $d = $(this);
        var price = $d.data("price");
        var nr = $.trim($d.val());

        if (nr.length > 0) {
            var reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^[0]{1}(\.\d{1,2})?$)/;
            if (!reg.test($(this).val())) {
                $d.attr("class", "red").val("请填写正确的商品单价");
                return;
            }
            else {
                if (parseFloat(nr) != parseFloat(price)) {
                    $.ajax({
                        type: "POST",
                        url: "/App_Services/wsSelfPurchase.asmx/UpBuyPrice",
                        cache: false,
                        dataType: "json",
                        contentType: "application/json;utf-8",
                        data: '{"url":"' + $d.parents('.splist').find('.w2 .pic').attr('href') + '","p":"' + HtmlEncode(nr) + '"}',
                        timeout: 10000,
                        error: function() { alert('网络错误，请稍后再试'); $d.val(price); },
                        success: function(r) {
                            if (r.d != 'success') {
                                $d.val(price);
                            }
                        }
                    });
                }
            }
        }
        else {
            $d.attr("class", "hui").val("请填写商品单价。");
            return;
        }
    });
    //商品备注框的焦点获得和脱离事件
    $('.w4 textarea').live('focus', function() {
        var c = $(this).attr("class"); if (c == "hui" || c == "red") $(this).attr("class", "").val("");
        $(this).data("remark", $.trim($(this).val()));
    })
            .live('blur', function() {
                var $d = $(this);
                var remark = $d.data("remark");
                var nr = $.trim($d.val());
                if (nr.length <= 0) $d.attr("class", "hui").val("请填写商品备注。");
                if ($d.parents('.splist').length <= 0)
                    return;
                //如果备注变化，提交服务器修改
                if (nr != remark) {
                    $.ajax({
                        type: "POST",
                        url: "/App_Services/wsSelfPurchase.asmx/UpRemark",
                        cache: false,
                        dataType: "json",
                        contentType: "application/json;utf-8",
                        data: '{"url":"' + $d.parents('.splist').find('.w2 .pic').attr('href') + '","remark":"' + HtmlEncode(nr) + '"}',
                        timeout: 10000,
                        error: function() { alert('网络错误，请稍后再试'); $d.val(remark); },
                        success: function(r) {
                            if (r.d != 'success') {
                                $d.val(remark);
                            }
                        }
                    });
                }
            });
    //未抓取成功时填写商品名的文本域
    $('#spname').focus(function() {
        var c = $(this).attr("class"); if (c == "hui" || c == "red") $(this).attr("class", "").val("");
    })
         .blur(function() {
             if ($.trim($(this).val()).length <= 0) $(this).attr("class", "red").val("请填写商品名称。");
         });

   $('#spremark').focus(function() {
             var c = $(this).attr("class"); if (c == "hui" || c == "red") $(this).attr("class", "").val("");
         })
        .blur(function() {
            if ($.trim($(this).val()).indexOf("请填写商品备注") >= 0 || $.trim($(this).val()).length <= 0) {
                $(this).attr("class", "red").val("请填写商品备注。");
            }
        });
         
    //未抓取成功时填写商单价的文本域
    $('#spprice').focus(function() {
        var c = $(this).attr("class"); if (c == "hui" || c == "red") $(this).attr("class", "").val("");
    })
         .blur(function() {
             if ($.trim($(this).val()).length > 0) {
                 var reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^[0]{1}(\.\d{1,2})?$)/;
                 if (!reg.test($.trim($(this).val()))) {
                     $(this).attr("class", "red").val("请填写正确的商品单价");
                 }
                 else {
                     //if (parseFloat($(this).val()) <= 0) {
                     //  $(this).attr("class", "red").val("商品单价不能小于零");
                     // }
                 }
             }
             else {
                 $(this).attr("class", "red").val("请填写商品单价。");
             }
         });
    //修改商品价格
    function upProPrice(url, price) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsSelfPurchase.asmx/UpBuyPrice",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"url":"' + url + '","p":' + price + '}',
            timeout: 10000,
            beforeSend: function() { },
            complete: function() { },
            error: function() { alert('网络错误，请稍后再试'); },
            success: function() {
            }
        });
    }
    //提交商品信息
    $('#spsubmit').click(function() {
        if ($('.splist').length <= 0) {
            alert('请先提交商品信息');
            return false;
        }
        $('.splist .w4 .hui').each(function(i, d) {
            $(this).attr('class', 'red');
        });
        if ($('.splist .w4 .red').length > 0)
            return false;
        var $d = $('#spsubmit');
        $.ajax({
            type: "POST",
            url: "/App_Services/wsSelfPurchase.asmx/SpSubmit",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"id":' + $('#selfWarnId').val() + '}',
            timeout: 10000,
            beforeSend: function() { $d.attr('disabled', 'disabled'); },
            complete: function() { $d.removeAttr('disabled'); },
            error: function() { alert('网络错误，请稍后再试'); },
            success: function(r) {
                switch (r.d) {
                    case 'error':
                        alert('页面超时');
                        window.onbeforeunload = null;
                        window.location = window.location.href;
                        return;
                    case 'success':
                        window.onbeforeunload = null;
                        window.location = '/mypanli/SelfPurchase/List.aspx';
                        return;
                    default: alert('提交失败，请重试'); return;

                }
            }
        });
        return false;
    });
    if ($("#selfUrl").val() != "") {
        $('#spCrawlBtn').click();
    }
    window.onbeforeunload = function() {
        if ($('.splist,#addInputPanel:visible').length > 0)
            return '刷新当前页面，您输入的内容将不被保存，确定要继续吗?';
    }
});