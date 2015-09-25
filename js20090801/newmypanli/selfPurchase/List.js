var Defualt_Tip_packageNo = "填写或选择所属包裹";
//批量修改物流信息方法
function upLogistics(IDs, company, packagecode, callback) {
    var idstr = ArrayToJSON(IDs);
    $.ajax({
        type: "POST",
        url: "/App_Services/wsSelfPurchase.asmx/UpLogistics",
        cache: false,
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"IDs":' + idstr + ',"companyId":' + company + ',"packagecode":"' + packagecode + '"}',
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
    //$('#scsCompany').val($(dom).parents('tr').find('select').find("option:selected").text());
    $('#scsCompany').val($(dom).parents('tr').find("input[type='hidden'][name='hidByCompanyName']").val());
    //$('#scsCode').val($(dom).parents('tr').find('.wlpackage').val());
    $('#scsCode').val($(dom).parents('tr').find("input[type='hidden'][name='hidByPackageNo']").val());
    $('#scsEmail').val($('#userEmail').val());
}

//信息错误标红方法
function scsError(message, dom) {
    $(dom).addClass('advisory_red').val(message);
}

$(function() {
    //单商品物流信息输入框相关事件
    $('.wlpackage').focus(function() {
        if ($(this).attr('class').indexOf('hong') > 0) {
            $(this).removeClass('hong').val('');
        }
    });
    //显示单个填写物流信息层
    $('.tianxie').mouseover(function() {
        ShowWriteWL(this);
    });
    //点击显示部分不隐藏
    $(".tianxie,.wl").click(function() {
        return false;
    });

    //填写物流信息层取消按钮
    $('.wlCancel').click(function() {
        $(this).parents('.wl').hide().prev('a').removeClass('dd');
        return false;
    });
    //填写物流信息层确定按钮
    $('.wlSubmit').click(function() {
        $tr = $(this).parents('tr');
        $c = $tr.find('select');
        $p = $tr.find('.wlpackage');
        $n = $tr.find('.no_tj');
        $n.show();
        $n.html("");
        if ($.trim($c.val()) == "-1") {
            $n.html("请选择物流公司！");
            return false;
        }
        if ($.trim($p.val()).length <= 0 || $.trim($p.val()) == Defualt_Tip_packageNo) {
            $p.addClass('hong').val('请填写运单号码');
            return false;
        }
        if ($(this).prev('ul').find('.hong').length > 0) {
            return false;
        }
        /*if ($("#hid_PackageNo_OutTime").val().indexOf("|" + $p.val()) >= 0) {
        if (!confirm("由于该包裹已超过免费保管期，根据包裹保管期限规定，您需支付超时保管费10.00元。")) {
        $(this).parents('.wl').hide().prev('a').removeClass('dd');
        return false;
        }
        }*/
        var temp_charge = GetOutChargeByPackageNo($.trim($p.val()));
        if (parseFloat(temp_charge) > 0) {
            if (!confirm("由于该包裹已超过免费保管期，根据包裹保管期限规定，您需支付超时保管费" + temp_charge + "元。")) {
                $(this).parents('.wl').hide().prev('a').removeClass('dd');
                return false;
            }
        }

        var IDs = [];
        IDs.push($(this).parents('tr').find(":checkbox").val());
        upLogistics(IDs, $c.val(), $.trim($p.val()), function(r) {
            if (r.d == '0' || r.d == '10') {
                window.Panli.Message.show('物流信息修改成功');
                //if ($("#hid_PackageNo_Current").val().indexOf("|" + $p.val()) >= 0) {
                if (r.d == '10') {
                    $tr.find("a[name='a_DeleteOne']").hide();
                    $tr.find("input[type='hidden'][name='hidByStatus']").val("4");
                    $tr.find(".gl1").html("");
                }

                $tr.find("input[type='hidden'][name='hidByPackageNo']").val($.trim($p.val()));
                $tr.find("input[type='hidden'][name='hidByCompanyID']").val($c.val());
                $tr.find("input[type='hidden'][name='hidByCompanyName']").val($c.find("option:selected").text());

                SetOutChargeByPackageNo($.trim($p.val()));

                $tr.find(".gl5").html("<div class=\"wuliu\"><a href=\"javascript:return false;\" class=\"chankan\" onclick=\"ShowWLGZ(this);\">物流跟踪</a><p>" + $.trim($p.val()) + "/" + $c.find("option:selected").text().substring(0, 2) + "</p></div>");
                if (r.d == '10') { $tr.find(".gl5").find(".wuliu").append("<span>(包裹已签收)</span>"); }

                $tr.find('.wl').hide().prev('a').removeClass('dd');
                GetManyStatus4();
            } /*
            else if (r.d == "-1") {
                $n.html('网络错误，请稍后再试');
            }
            else if (r.d == "1") {
                $n.html('改包裹号已经被其他用户占用');
            }
            else if (r.d == "2") {
                $n.html('状态不对，这个包裹号已拆包或提交运送');
            }*/
            else if (r.d == "3") {
                alert("您的余额不足，无法提交该包裹。");
                $(this).parents('.wl').hide().prev('a').removeClass('dd');
            }
            else {
                $n.html('物流信息异常，请联系客服（<a href="" onclick="mailOut(this);">service@panli.com</a>）。');
            }
            return false;
        });
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
            //data: '{"id":' + $(this).parents('tr').find(':checkbox').val() + ',"remark":"' + nremark + '"}',
            data: '{"id":' + $(this).parents('tr').find("input[type='hidden'][name='hidByProductID']").val() + ',"remark":"' + nremark + '"}',
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
            //scsError('请填写咨询问题详情！', $('#scsContent').replace(/\\/g, "\\\\").replace(/"/g, "\\\""));
            scsError('请填写咨询问题详情！', $('#scsContent'));
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


//---------------------------------------------------
//显示单个物流层
function ShowWriteWL(obj) {
    $(".wl").hide();
    $(".wl").prev('a').removeClass('dd');
    $(obj).addClass('dd').next('div').show();

    $('body').one('click', function() {    //给BODY绑定一次性点击事件
        $(obj).removeClass('dd').next("div").hide();
    });

    return false;                           //返回
}

var currentBuyName = ""; //批修改的时候判断当前卖家。
var currentWLGZPID = ""; //物流跟踪产品ID。

//删除
function DeleteByOne(obj) {
    if (!confirm('您确定要删除此商品吗？'))
        return false;
    var IDs = [];
    IDs.push(obj);
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
                $("input[type='hidden'][name='hidByProductID']").each(function(i, d) {
                    if ($(this).val() == obj) {
                        $(d).parents('tr').fadeOut(800, function() {
                            $(this).remove();

                            /*$('#ListPanel table').each(function(i, d) {
                            if ($(':checkbox', $(d)).length <= 0)
                            $(d).remove();
                            });
                            if ($('#ListPanel table').length <= 0) {
                            $('#ListPanel').html('<div class="gl_wu"><h2>如果您已经开始使用Panli自助购物服务，记得赶紧<a href="/mypanli/selfPurchase/Order.aspx">提交自助购物</a>商品清单喔！</h2><p><a href="/mypanli/SelfPurchase/Wizard.aspx" target="new">什么是Panli自助购物服务？</a></p></div>');
                            }*/
                            RemoveTable();
                        });
                    }
                });
            }
        }
    });
}

function RemoveTable() {
    $('#ListPanel table').each(function() {
        if ($(this).find("tr").length <= 1) {
            $(this).remove();
        }
    });
    if ($('#ListPanel table').length <= 0) {
        $('#ListPanel').html('<div class="gl_wu"><h2>如果您已经开始使用Panli自助购物服务，记得赶紧<a href="/mypanli/selfPurchase/Order.aspx">提交自助购物</a>商品清单喔！</h2><p><a href="/mypanli/SelfPurchase/Wizard.aspx" target="new">什么是Panli自助购物服务？</a></p></div>');
    }
}

//显示批量修改物流层
function ShowEditManyWL(obj) {
    var flagIsBuy = false;
    var flagIsChange = false;
    var flagIsConfirm = true;
    $("#ListPanel").find("tr").each(function() {
        if ($(this).attr("trtype") == obj) {
            $(this).find(":checkbox:checked").each(function() {
                flagIsBuy = true;
                if (($(this).parents('tr').find('.wlpackage').val() != "" && $(this).parents('tr').find('.wlpackage').val() != Defualt_Tip_packageNo) || $(this).parents('tr').find('select').val() != "-1") {
                    flagIsChange = true;
                }
            });
        }
    });
    if (flagIsBuy == false) {
        alert('请勾选同一卖家的商品');
        return;
    }
    if (flagIsChange) {
        if (confirm('您选中的商品中部分已有物流信息，是否要进行修改？')) {
            flagIsConfirm = true;
        }
        else {
            flagIsConfirm = false;
        }
    }
    if (flagIsConfirm) {
        Panli.Overlay.open();
        $('#divByEditWLMany').show();
        currentBuyName = obj;
        $('#divByEditWLMany').find(".yichang").html("");
    }
}

//关闭批量修改物流层
function CloseEditWLMany() {
    Panli.Overlay.close();
    $('#divByEditWLMany').hide();
}


//批量修改物流方法
function EditManyWl() {
    var company = $('#divByEditWLMany').find("select").val();
    var companyName = $('#divByEditWLMany').find("select").find("option:selected").text();
    var packagecode = $.trim($('#wlpPak').val());
    var note = $('#divByEditWLMany').find(".yichang");
    $(note).show();
    $(note).html("");
    if (company == "-1") {
        $(note).html("请选择物流公司");
        return
    }
    if (packagecode.length <= 0 || $.trim(packagecode) == Defualt_Tip_packageNo) {
        $(note).html("请填写运单号码");
        return;
    }
    /*if ($("#hid_PackageNo_OutTime").val().indexOf("|" + packagecode) >= 0) {
    if (!confirm("由于该包裹已超过免费保管期，根据包裹保管期限规定，您需支付超时保管费10.00元。")) {
    CloseEditWLMany();
    return;
    }
    }*/
    var temp_charge = GetOutChargeByPackageNo(packagecode);
    if (parseFloat(temp_charge) > 0) {
        if (!confirm("由于该包裹已超过免费保管期，根据包裹保管期限规定，您需支付超时保管费" + temp_charge + "元。")) {
            CloseEditWLMany();
            return;
        }
    }

    var IDs = [];
    $("#ListPanel").find("tr").each(function(i, d) {
        if ($(this).attr("trtype") == currentBuyName) {
            $(this).find(":checkbox:checked").each(function() {
                IDs.push($(this).val());
            });
        }
    });
    if (IDs.length == 0) {
        $(note).html("请勾选同一卖家的商品");
        return
    }

    upLogistics(IDs, company, packagecode, function(r) {
        if (r.d == '0' || r.d == '10') {
            $('#divByEditWLMany').find("select").val("-1")
            $('#wlpPak').val('');
            CloseEditWLMany();
            window.Panli.Message.show('物流信息修改成功');

            var flagIsHide = false;
            //if ($("#hid_PackageNo_Current").val().indexOf("|" + packagecode) >= 0) {
            if (r.d == '10') {
                flagIsHide = true;
            }

            $("#ListPanel").find("tr").each(function() {
                if ($(this).attr("trtype") == currentBuyName) {
                    $(this).find(":checkbox:checked").each(function(i, d) {
                        var $t = $(d).parents('tr');

                        $t.find("input[type='hidden'][name='hidByPackageNo']").val(packagecode);
                        $t.find("input[type='hidden'][name='hidByCompanyID']").val(company);
                        $t.find("input[type='hidden'][name='hidByCompanyName']").val(companyName);

                        SetOutChargeByPackageNo(packagecode);

                        if (flagIsHide) {
                            $t.find("a[name='a_DeleteOne']").hide();
                            $t.find("input[type='hidden'][name='hidByStatus']").val("4");
                            $t.find(".gl1").html("");
                        }


                        $t.find(".gl5").html("<div class=\"wuliu\"><a href=\"javascript:return false;\" class=\"chankan\" onclick=\"ShowWLGZ(this);\">物流跟踪</a><p>" + packagecode + "/" + companyName.substring(0, 2) + "</p></div>");
                        if (r.d == '10') { $t.find(".gl5").find(".wuliu").append("<span>(包裹已签收)</span>"); }
                    });
                }
            });

            GetManyStatus4();
        }
        else if (r.d == "3") {
            alert("您的余额不足，无法提交该包裹。");
            CloseEditWLMany();
        }
        else {
            $(note).html('物流信息异常，请联系客服（<a href="mailto:service@panli.com">service@panli.com</a>）。');
        }
    });
}

//显示运单号码列表层
function ShowPackageListDiv(obj) {
    $(obj).next().show();
}

//关闭运单号码列表层
function ClosePackageListDiv(obj) {
    $(obj).next().hide();
}

//选择运单号列表
function SelectPackageListDiv(obj) {
    var str = $(obj).parents("dd").find("a").html();
    var packageNumber = str.split("/")[0];
    var company = $(obj).parents("dd").find("input[type='hidden']").val();
    $(obj).parents("li").find("input[type='text']").val(packageNumber);
    $(obj).parents("ul").find("select").val(company);
    $(obj).parents(".kuaidi_lx").hide();
}
//选择运单号物流跟踪
function SelectPackageListDiv_WLGZ(obj) {
    var str = $(obj).parents("dd").find("a").html();
    var packageNumber = str.split("/")[0];
    var company = $(obj).parents("dd").find("input[type='hidden']").val();
    $("#wlgz_packageNo_edit").val(packageNumber);
    $("#wlgz_company_edit").val(company);
    $(obj).parents(".kuaidi_lx2").hide();
}


//显示物流跟踪层
function ShowWLGZ(obj) {

    WLGZ_Company_View();
    WLGZ_Package_View();

    var hidByCompanyName = $(obj).parents("tr").find("input[type='hidden'][name='hidByCompanyName']").val();
    var hidByCompanyID = $(obj).parents("tr").find("input[type='hidden'][name='hidByCompanyID']").val();
    var hidByPackageNo = $(obj).parents("tr").find("input[type='hidden'][name='hidByPackageNo']").val();
    var hidByStatus = $(obj).parents("tr").find("input[type='hidden'][name='hidByStatus']").val();
    var hidByParcelDateCreated = $(obj).parents("tr").find("input[type='hidden'][name='hidByParcelDateCreated']").val();
    var hidByProductID = $(obj).parents("tr").find("input[type='hidden'][name='hidByProductID']").val();

    $("#wlgz_company_view").html(hidByCompanyName);
    $("#wlgz_company_edit").val(hidByCompanyID);
    $("#wlgz_packageNo_view").html(hidByPackageNo);
    $("#wlgz_packageNo_edit").val(hidByPackageNo);

    if (hidByStatus == "4") {
        $("#wlgz_company_changeEdit").hide();
        $("#wlgz_packageNo_changeEdit").hide();
        $("#wlgz_packageNo_view").append("<span style=\"color:#FF6600;\">（Panli已签收）</span>");
    }
    else {
        $("#wlgz_company_changeEdit").show();
        $("#wlgz_packageNo_changeEdit").show();
    }

    currentWLGZPID = hidByProductID;

    Panli.Overlay.open();
    $('#wlgz').show();

    /*
    $.ajax({
    type: "POST",
    url: "/App_Services/wsSelfPurchase.asmx/GetWLGZList",
    cache: false,
    dataType: "json",
    contentType: "application/json;utf-8",
    data: "{packageNo:'" + $("#wlgz_packageNo_edit").val() + "',wlgsID:" + $("#wlgz_company_edit").val() + "}",
    timeout: 15000,
    beforeSend: function() {
    $("#wlgz_wllist_info").hide();
    $("#wlgz_wllist_load").show();
    },
    complete: function() {
    $("#wlgz_wllist_info").show();
    $("#wlgz_wllist_load").hide();
    },
    error: function() { alert("网络错误请重新再试") },
    success: function(r) {
    $("#wlgz_wllist_info").html(r.d);
    if ($(obj).parents("tr").find("input[type='hidden'][name='hidByStatus']").val() == "4") {
    $("#wlgz_wllist_info").append("<li class=\"xiang_red\">" + $(obj).parents("tr").find("input[type='hidden'][name='hidByParcelDateCreated']").val() + " Panli已签收，质检员正在为您验货，请耐心等待。</li>");
    }
    }
    });*/

    $('#wlgz_wllist_info').html("");
    $("#wlgz_wllist_load").show();
    if (hidByCompanyID != "") {
        /*
        $('#wlgz_wllist_info').load("/mypanli/Data/TraceData.aspx?expressNo=" + hidByPackageNo + "&expressUrl=" + wlgsStr, {}, function() {
        if (hidByStatus == "4") {
        $("#wlgz_wllist_info table").append("<tr class=\"xiang_red\"><td class=\"Track_z\">" + hidByParcelDateCreated + "</td><td>Panli已签收，质检员正在为您验货，请耐心等待。</td></tr>");
        }
        $("#wlgz_wllist_load").hide();
        });*/
        var temp_url = "/mypanli/Data/ParcelTraceData.aspx?expressNo=" + hidByPackageNo + "&expressUrl=" + hidByCompanyID;
        if (hidByStatus == "4") {
            temp_url += "&d=" + encodeURIComponent(hidByParcelDateCreated);
        }
        $('#wlgz_wllist_info').load(temp_url, {}, function() {
            $("#wlgz_wllist_load").hide();
        });
    }
    else {
    /*
        var temp = "<table><tr><td class=\"Track_z\"></td><td>该运单暂无物流信息</td></tr>";
        if (hidByStatus == "4") {
            temp += "<tr class=\"xiang_red\"><td class=\"Track_z\">" + hidByParcelDateCreated + "</td><td>Panli已签收，质检员正在为您验货，请耐心等待。</td></tr>";
        }
        temp += "</table>";
        */
        var temp = "<ul><li>该运单暂无物流信息</li>";
        if (hidByStatus == "4") {
            temp += "<li class=\"xiang_red\">" + hidByParcelDateCreated + "&nbsp;&nbsp;Panli已签收，质检员正在为您验货，请耐心等待。</li>";
        }
        temp += "</ul>";
        $("#wlgz_wllist_info").html(temp);
        $("#wlgz_wllist_load").hide();
    }

}


//关闭物流跟踪层
function CloseWLGZ() {
    Panli.Overlay.close();
    $('#wlgz').hide();
}


function WLGZ_Company_View() {
    $("#wlgz_company_view").show();
    $("#wlgz_company_changeEdit").show();
    $("#wlgz_company_edit").hide();
    $("#wlgz_company_save").hide();
    $("#wlgz_company_cancel").hide();

    $(".kuaidi_lx2").hide();
}

function WLGZ_Company_Edit() {
    $("#wlgz_company_view").hide();
    $("#wlgz_company_changeEdit").hide();
    $("#wlgz_company_edit").show();
    $("#wlgz_company_save").show();
    $("#wlgz_company_cancel").show();

    $(".kuaidi_lx2").hide();
}

function WLGZ_Package_View() {
    $("#wlgz_packageNo_view").show();
    $("#wlgz_packageNo_changeEdit").show();
    $("#wlgz_packageNo_edit").hide();
    $("#wlgz_packageNo_save").hide();
    $("#wlgz_packageNo_cancel").hide();

    $(".kuaidi_lx2").hide();
}

function WLGZ_Package_Edit() {
    $("#wlgz_packageNo_view").hide();
    $("#wlgz_packageNo_changeEdit").hide();
    $("#wlgz_packageNo_edit").show();
    $("#wlgz_packageNo_save").show();
    $("#wlgz_packageNo_cancel").show();

    $(".kuaidi_lx2").hide();
}

$(function() {
    $("#wlgz_company_changeEdit").click(function() {
        WLGZ_Company_Edit();
        return false;
    });

    $("#wlgz_company_cancel").click(function() {
        WLGZ_Company_View();
        return false;
    });

    $("#wlgz_packageNo_changeEdit").click(function() {
        WLGZ_Package_Edit();
        return false;
    });

    $("#wlgz_packageNo_cancel").click(function() {
        WLGZ_Package_View();
        return false;
    });

    $("#wlgz_company_save").click(function() {
        WLGZEdit();
        return false;
    });
    $("#wlgz_packageNo_save").click(function() {
        WLGZEdit();
        return false;
    });

    $("#wlgz_packageNo_edit").click(function() {
        $("#wlgz_packageNo_edit").removeClass("huis");
        return false;
    });

    GetManyStatus4();
});


function WLGZEdit() {

    var company = $('#wlgz_company_edit').val();
    var companyName = $('#wlgz_company_edit').find("option:selected").text();
    var packagecode = $.trim($('#wlgz_packageNo_edit').val());

    if (company == "-1") {
        alert("请选择物流公司");
        return false;
    }
    if (packagecode.length <= 0 || $.trim(packagecode) == Defualt_Tip_packageNo) {
        alert("请填写运单号码");
        return false;
    }

    /*if ($("#hid_PackageNo_OutTime").val().indexOf("|" + packagecode) >= 0) {
    if (!confirm("由于该包裹已超过免费保管期，根据包裹保管期限规定，您需支付超时保管费10.00元。")) {
    Panli.Overlay.close();
    $('#wlgz').hide();
    return false;
    }
    }*/
    var temp_charge = GetOutChargeByPackageNo(packagecode);
    if (parseFloat(temp_charge) > 0) {
        if (!confirm("由于该包裹已超过免费保管期，根据包裹保管期限规定，您需支付超时保管费" + temp_charge + "元。")) {
            Panli.Overlay.close();
            $('#wlgz').hide();
            return false;
        }
    }

    var IDs = [];
    IDs.push(currentWLGZPID);

    upLogistics(IDs, company, packagecode, function(r) {
        if (r.d == '0' || r.d == '10') {
            $('#wlgz_company_view').val(companyName);
            $("#wlgz_packageNo_view").val(packagecode);
            window.Panli.Message.show('物流信息修改成功');

            var flagIsHide = false;
            //if ($("#hid_PackageNo_Current").val().indexOf("|" + packagecode) >= 0) {
            if (r.d == '10') {
                flagIsHide = true;
            }

            $("#ListPanel").find("tr").each(function() {
                var pid = $(this).find("input[type='hidden'][name='hidByProductID']").val();
                if (pid == currentWLGZPID) {
                    var $t = $(this);

                    if (flagIsHide) {
                        $t.find("a[name='a_DeleteOne']").hide();
                        $(this).find("input[type='hidden'][name='hidByStatus']").val("4");
                        $t.find(".gl1").html("");
                    }

                    $(this).find("input[type='hidden'][name='hidByPackageNo']").val(packagecode);
                    $(this).find("input[type='hidden'][name='hidByCompanyID']").val(company);
                    $(this).find("input[type='hidden'][name='hidByCompanyName']").val(companyName);


                    SetOutChargeByPackageNo(packagecode);


                    $t.find(".gl5").html("<div class=\"wuliu\"><a href=\"javascript:return false;\" class=\"chankan\" onclick=\"ShowWLGZ(this);\">物流跟踪</a><p>" + packagecode + "/" + companyName.substring(0, 2) + "</p></div>");
                    if (r.d == '10') { $t.find(".gl5").find(".wuliu").append("<span>(包裹已签收)</span>"); }
                }
            });

            Panli.Overlay.close();
            $('#wlgz').hide()

            GetManyStatus4();
        }
        else if (r.d == "3") {
            alert("您的余额不足，无法提交该包裹。");
            Panli.Overlay.close();
            $('#wlgz').hide()
        }
        else {
            //alert('网络错误，请稍后再试');
            alert("物流信息异常，请联系客服service@panli.com");
        }
    });

    return false;
}

function GetManyStatus4() {

    if ($(".laba").html() == null || $.trim($(".laba").html()) == "") {
        $(".laba").hide();
    }

    var statusCount = 0;
    var temp_statusCount_Str = "";
    var temp_statusCount_PackagNo = "";
    $("input[type='hidden'][name='hidByStatus']").each(function() {
        if ($(this).val() == "4") {
            temp_statusCount_PackagNo = $(this).parents("td").find("input[type='hidden'][name='hidByPackageNo']").val();
            if (temp_statusCount_Str.indexOf("|" + temp_statusCount_PackagNo) < 0) {
                temp_statusCount_Str += "|" + temp_statusCount_PackagNo;
                statusCount++;
            }
        }
    });
    $(".laba").find("p[type='2']").remove();
    if (statusCount > 0) {
        $(".laba").append("<p type=\"2\">您有<span>" + statusCount + "</span>个自助购的包裹已签收，正在为您验货、入库，请耐心等待。</p>");
        $(".laba").show();
    }
}

function GetOutChargeByPackageNo(paramPackageNo) {
    var str = $("#hid_PackageNo_OutTime").val();
    var strArray = str.split("|");
    var i = 0;
    var result = "0";
    for (i = 0; i < strArray.length; i++) {
        if (paramPackageNo == strArray[i].split(",")[0]) {
            result = strArray[i].split(",")[1];
            break;
        }
    }
    return result;
}

function SetOutChargeByPackageNo(paramPackageNo) {
    var str = $("#hid_PackageNo_OutTime").val();
    if (str != "" && str.length > 0 && str.indexOf(paramPackageNo) >= 0) {
        var strArray = str.split("|");
        var i = 0;
        var temp = "";
        for (i = 0; i < strArray.length; i++) {
            if (paramPackageNo != strArray[i].split(",")[0]) {
                temp = temp + "|" + strArray[i];
            }
        }
        if (temp != "") {
            temp = temp.substring(1);
        }
        $("#hid_PackageNo_OutTime").val(temp);
    }
}


function mailOut(obj) {
    var maillink = document.getElementById('maillink');
    maillink.href = "mailto:service@panli.com";
    maillink.click();

    $(obj).parents(".wl").prev().mouseover();
}

function closezzgts() {
    $('.zzgts').hide();
    var data = jaaulde.utils.cookies.get("closenotshow");
    if (data != null) {
        data = data + '|selflist';
        jaaulde.utils.cookies.set('closenotshow', data, { domain: 'panli.com' });
    }
    else {
        jaaulde.utils.cookies.set('closenotshow', 'selflist', { domain: 'panli.com' });
    }
    return false;
}