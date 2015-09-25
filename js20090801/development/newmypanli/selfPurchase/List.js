//批量修改物流信息方法
function upLogistics(IDs, company, packagecode, callback) {
    var idstr = ArrayToJSON(IDs);
    $.ajax({
        type: "POST",
        url: "/App_Services/wsSelfPurchase.asmx/UpLogistics",
        cache: false,
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"IDs":' + idstr + ',"company":"' + company + '","package":"' + packagecode + '"}',
        timeout: 10000,
        error: function() { alert('网络错误，请稍后再试'); },
        success: callback
    });
}

//把数组转成JSON字符串
function ArrayToJSON(arr) {
    var json = '[';
    for (var i = 0; i < arr.length; i++) {
        json += arr[i] + ',';
    }
    json = json.substring(0, json.lastIndexOf(',', json.length)) + ']';
    return json;
}

//打开留言层
function openCSPanel(id, dom) {
    Panli.Overlay.open();
    $('#CSPanel :text,#scsContent').removeClass('advisory_red').val('');
    $('#CSPanel').data("id", id).show();
    $('#scsCompany').val($(dom).parents('tr').find('.wlcompany').val());
    $('#scsCode').val($(dom).parents('tr').find('.wlpackage').val());
    $('#scsEmail').val($('#userEmail').val());
}

//信息错误标红方法
function scsError(message, dom) {
    $(dom).addClass('advisory_red').val(message);
}


$(function() {
    //单商品物流信息输入框相关事件
    $('.wlcompany,.wlpackage').focus(function() {
        if ($(this).attr('class').indexOf('hong') > 0) {
            $(this).removeClass('hong').val('');
        }
    });

    //填写物流信息悬浮事件
    $('.tianxie,.wan', '#ListPanel').hover(function() { $(this).addClass('dd').next('div').show(); }, function() { $(this).removeClass('dd').next('div').hide(); });
    $('.wl', '#ListPanel').hover(function() { $(this).show().prev('a').addClass('dd'); }, function() { $(this).hide().prev('a').removeClass('dd'); });
    //填写物流信息层取消按钮
    $('.wlCancel').click(function() {
        $(this).parents('.wl').hide().prev('a').removeClass('dd'); return false;
    });
    //填写物流信息层确定按钮
    $('.wlSubmit').click(function() {
        $c = $(this).prev('ul').find('.wlcompany');
        $p = $(this).prev('ul').find('.wlpackage');
        if ($.trim($c.val()).length <= 0) {
            $c.addClass('hong').val('请填写物流公司');
            //return false;
        }
        if ($.trim($p.val()).length <= 0) {
            $p.addClass('hong').val('请填写运单号码');
            //return false;
        }

        if ($(this).prev('ul').find('.hong').length > 0) {
            return false;
        }
        var IDs = [];
        IDs.push($(this).parents('tr').find(":checkbox").val());
        upLogistics(IDs, $c.val(), $p.val(), function(r) {
            if (r.d == 'success') {
                window.Panli.Message.show('物流信息修改成功');
                $(this).parents('.wl').hide().prev('a').removeClass('dd');
            }
            return false;
        });
        return false;
    });
    //批量删除按钮
    $('#delBtn').click(function() {
        if ($('.gl1 :checked').length <= 0) {
            alert('请勾选您要删除的商品！');
            return false;
        }
        if (!confirm('您确定要删除这些商品吗？'))
            return false;
        var IDs = [];
        $('.gl1 :checked').each(function(i, d) {
            IDs.push($(d).val());
        });
        $.ajax({
            type: "POST",
            url: "/App_Services/wsSelfPurchase.asmx/DelProducts",
            cache: false,
            dataType: "json",
            beforeSend: function() { $('#delBtn').attr('disabled', 'disabled'); },
            complete: function() { $('#delBtn').removeAttr('disabled'); },
            contentType: "application/json;utf-8",
            data: '{"IDs":' + ArrayToJSON(IDs) + '}',
            timeout: 10000,
            error: function() { alert('网络错误，请稍后再试'); },
            success: function(r) {
                if (r.d == 'success') {
                    $('.gl1 :checked').each(function(i, d) {
                        $(d).parents('tr').fadeOut(800, function() {
                            $(this).remove();

                            $('#ListPanel table').each(function(i, d) {
                                if ($(':checkbox', $(d)).length <= 0)
                                    $(d).remove();
                            });
                            if ($('#ListPanel table').length <= 0) {
                                $('#ListPanel').html('<div class="gl_wu"><h2>如果您已经开始使用Panli自助购物服务，记得赶紧<a href="/mypanli/selfPurchase/Order.aspx">提交自助购物</a>商品清单喔！</h2><p><a href="/mypanli/SelfPurchase/Wizard.aspx" target="new">什么是Panli自助购物服务？</a></p></div>');
                            }

                        });
                    });
                }
            }
        });
        return false;
    });

    //批量改物流按钮
    $('#wlBtn').click(function() {
        if ($('.gl1 :checked').length <= 0) {
            alert('请勾选同一包裹内的商品');
            return false;
        }
        var str = '';
        $('.gl1 :checked').each(function(i, d) {

            str = str + ($(d).parents('tr').find('.wlpackage').hasClass('hong') ? "" : $(d).parents('tr').find('.wlpackage').val());
            str = str + ($(d).parents('tr').find('.wlcompany').hasClass('hong') ? "" : $(d).parents('tr').find('.wlcompany').val());
        });

        if ($.trim(str).length > 0)
            if (!confirm('您选中的商品中部分已有物流信息，是否要进行修改？'))
            return false;

        $('#wlOverlay,#wlEditPanel').show();
        return false;
    });

    $('#wlpCom,#wlpPak').focus(function() {
        if ($(this).hasClass('hong'))
            $(this).removeClass('hong').val('');
    });


    //批量改物流层确定按钮
    $('#wlpSubmit').click(function() {
        var company = $('#wlpCom').val();
        var packagecode = $('#wlpPak').val();
        if (company.length <= 0) {
            $('#wlpCom').addClass('hong').val('请填写物流公司');
        }
        if (packagecode.length <= 0) {
            $('#wlpPak').addClass('hong').val('请填写运单号码');
        }

        if ($('#wlEditPanel .hong').length > 0)
            return false;

        var IDs = [];
        $('.gl1 :checked').each(function(i, d) {
            IDs.push($(d).val());
        });
        upLogistics(IDs, company, packagecode, function(r) {
            if (r.d == 'success') {
                $('#wlpCom,#wlpPak').val('');
                $('#wlEditPanel,#wlOverlay,#wlEditPanel').hide();
                window.Panli.Message.show('物流信息修改成功');
                $('.gl1 :checked').each(function(i, d) {
                    var $t = $(d).parents('tr');
                    $t.find('.wlcompany').val(company);
                    $t.find('.wlpackage').val(packagecode);
                    this.checked = false;
                });

            }
        });
        return false;
    });

    //批量改物流层取消和关闭按钮
    $('#wlpCancel,#wlpClose').click(function() {
        $('#wlEditPanel').fadeOut(500, function() { $('#wlOverlay,#wlEditPanel').hide(); });
        return false;
    });

    //备注层
    var spRemarkPanel = $('<div class="bz_dw"><div class="beizhu"><div style="width: 270px; float: left;"><textarea id="spRemarkInput" cols="" rows=""></textarea><dl><dt><input class="EditRemarkBtn" type="button" value="修改" /></dt><dd><input class="CloseBtn" type="button" value="关闭" /></dd></dl></div><img src="http://sf.panli.com/FrontEnd/images20090801/newmypanli/jiantou.gif" alt="" /></div></div>');


    //备注层输入框焦点获得
    $('textarea', spRemarkPanel).focus(function() {
        if ($(this).hasClass('red')) {
            $(this).removeClass('red').val('');
        }
    });
    $('.CloseBtn', spRemarkPanel).click(function() {
        spRemarkPanel.close();
        return false;
    });
    spRemarkPanel.click(function(e) {
        e.stopPropagation();
    });
    //备注层显示、关闭、切换方法
    spRemarkPanel.open = function(dom) {
        //$(this).next('.bz_dw').remove();
        spRemarkPanel.detach();
        $(dom).after(spRemarkPanel);
        $('textarea', spRemarkPanel).removeClass('red');
        spRemarkPanel.find('.beizhu').css({ "width": "0px", "left": "-60px" }).animate({ "width": "280px", "left": "-340px" });
        $('#spRemarkInput').val($(dom).nextAll('input').val());
    }

    spRemarkPanel.close = function() {
        spRemarkPanel.find('.beizhu').animate({ "width": "0px", "left": "-60px" }, function() { spRemarkPanel.detach(); });

    }

    spRemarkPanel.toggle = function(dom) {
        spRemarkPanel.stop(true, true);
        $(dom).nextAll().length > 1 ? spRemarkPanel.close() : spRemarkPanel.open(dom);
    }

    //修改备注确定按钮
    $('.EditRemarkBtn', spRemarkPanel).click(function() {
        var $d = $(this);
        var oremark = $d.parents('.bz_dw').next('input').val();
        var nremark = $.trim($('#spRemarkInput').val());

        if (nremark.length <= 0) {
            $('textarea', spRemarkPanel).val('请填写商品备注').addClass('red');
            return false;
        }

        if (nremark == oremark) {
            spRemarkPanel.close();
            return false;
        }
        //alert($(this).parents('tr').find(':checkbox').val());
        $.ajax({
            type: "POST",
            url: "/App_Services/wsSelfPurchase.asmx/UpRemarkWithId",
            cache: false,
            dataType: "json",
            beforeSend: function() { $(this).attr('disabled', 'disabled'); },
            complete: function() { $(this).removeAttr('disabled'); },
            contentType: "application/json;utf-8",
            data: '{"id":' + $(this).parents('tr').find(':checkbox').val() + ',"remark":"' + nremark + '"}',
            timeout: 10000,
            error: function() { alert('网络错误，请稍后再试'); },
            success: function(r) {

                if (r.d == 'success') {
                    $d.parents('.bz_dw').next('input').val(nremark);
                    spRemarkPanel.close();
                }
            }
        });

        return false;
    });

    //备注层显示
    $('.spRemark').click(function(e) {
        spRemarkPanel.toggle(this);
        e.stopPropagation();
        return false;
    });


    //长度限制
    $('#cscontent').keyup(function() {
        var s = $.trim($('#cscontent').val());
        if (s.length > 1000)
            $('#cscontent').val(s.substring(0, 1000));
    });


    //留言层内输入框焦点获得时间
    $('#CSPanel :text,#scsContent').focus(function() {
        if ($(this).hasClass('advisory_red')) {
            $(this).removeClass('advisory_red').val('');
        }
    });
    //提交留言信息
    $('#selfCSbtn').click(function() {
        var email = $.trim($('#scsEmail').val());
        var company = $.trim($('#scsCompany').val());
        var code = $.trim($('#scsCode').val());
        var content = $.trim($('#scsContent').val());
        if ($('#CSPanel .advisory_red').length > 0)
            return false;
        if (email.length <= 0) {
            scsError('请填写您的常用邮箱！', $('#scsEmail'));
            return false;
        }
        var reg = new RegExp("\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");
        if (!reg.test(email)) {
            scsError('您的Email格式有误！', $('#scsEmail'));
            return false;
        }
        if (company.length <= 0) {
            scsError('请填写物流公司名！', $('#scsCompany'));
            return false;
        }
        if (code.length <= 0) {
            scsError('请填写运单号码！', $('#scsCode'));
            return false;
        }
        if (content.length <= 0) {
            scsError('请填写咨询问题详情！', $('#scsContent').replace(/\\/g, "\\\\").replace(/"/g, "\\\""));
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/App_Services/wsSelfPurchase.asmx/CService",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"id":' + $('#CSPanel').data('id') + ',"email":"' + email + '","company":"' + company + '","code":"' + code + '","content":"' + content.replace(/\\/g, '\\').replace(/"/g, '\"') + '"}',
            timeout: 10000,
            beforeSend: function() { $('#selfCSbtn').attr("disabled", "disabled"); },
            complete: function() { $('#selfCSbtn').removeAttr("disabled"); },
            error: function() { alert('网络错误，请稍后再试'); },
            success: function(r) {
                alert('您的问题已成功提交，我们将在1-2个工作日内回馈至您的邮箱，请耐心等待。');
                $('#CSPanel').hide();
                Panli.Overlay.close();
                $('#CSPanel :text,#scsContent').val('');
                //window.location = "/Help/";
                return false;
            }
        });
    });
    
    $(document).click(function() { spRemarkPanel.close(); });
});