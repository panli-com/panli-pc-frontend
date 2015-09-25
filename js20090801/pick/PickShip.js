
var pickShip = {
    Data: {
        See: {}
    },
    LogisticsText: {},
    LogisticsParms: {
        url: "",
        numformat: "",
        num: "",
        pz: "",
        isThrough: 0
    },
    //联系客服
    ContactService: function (shipid) {
        $("#messageContainer").moveDiv($("#dragmessage"), $("#messageClose")).open();
        $("#replyFrame").attr("src", "/mypanli/message/ShipMessageDetail.aspx?fkid=" + shipid + "&type=3");
        return false;
    },
    //查看物流
    ShowLogistics: function (url, num, pz, through) {
        $('#dis2').removeClass('dis');
        $('#dis1').addClass('dis');
        $('.Track_message').show();
        Panli.Overlay.open();
        var ship = this;
        ship.LogisticsParms.url = url;
        ship.LogisticsParms.num = num;
        ship.LogisticsParms.numformat = "t" + num;
        ship.LogisticsParms.pz = "s" + pz;
        ship.LogisticsParms.isThrough = through;
        var shipData = "{ 'shipid': '" + pz + "' }";
        var lpz = ship.LogisticsParms.pz;
        if (ship.LogisticsParms.isThrough == 0) {
            $('.Track_box').html("<table><tr><td class='Track_z'></td><td>该运单暂无处理信息</td></tr></table>");
            ship.LogisticsText[lpz] = $('.Track_box').html();
            return false;
        }
        if (ship.LogisticsText[lpz]) {
            $('.Track_box').html(ship.LogisticsText[lpz]);
            ship.aclick();
        }
        else {
            $('.Track_box').html("loading......");
            ship.deletes();
            $.ajax({
                type: "POST",
                url: "/App_Services/Logistics.asmx/PickShipStatusRecord",
                dataType: "json",
                contentType: "application/json;utf-8",
                data: shipData,
                timeout: 10000,
                error: function () {
                    $('.Track_message').hide();
                    Panli.Overlay.close();
                    alert("请求超时，请重试！");
                },
                success: function (r) {
                    var textdate = eval(r.d);
                    var datetext = "<table>";
                    if (textdate == "") {
                        datetext += "<tr><td class='Track_z'></td><td>";
                        datetext += "该运单暂无处理信息</td></tr>";
                    } else {
                        for (var as in textdate) {
                            datetext += "<tr>";
                            datetext += "<td class='Track_z'>" + textdate[as].Date + "</td>";
                            datetext += "<td>" + textdate[as].Message + "</td>";
                            datetext += "</tr>";
                        }
                    }
                    datetext += "</table>";
                    $('.Track_box').html(datetext);
                    ship.aclick();
                    ship.LogisticsText[lpz] = $('.Track_box').html();
                    ship.adds();
                }
            });
        }
    },
    ShowInternationLogistics: function (url, num, pz, through) {
        $('#dis1').removeClass('dis');
        $('#dis2').addClass('dis');
        $('.Track_message').show();
        Panli.Overlay.open();
        var ship = this;
        ship.LogisticsParms.url = url;
        ship.LogisticsParms.num = num;
        ship.LogisticsParms.numformat = "t" + num;
        ship.LogisticsParms.pz = "s" + pz;
        ship.LogisticsParms.isThrough = through;
        ship.deletes();
        $('.Track_box').Logistics({ id: ship.LogisticsParms.num, url: ship.LogisticsParms.url, fun: ship.adds });
    },
    aclick: function () {
        var ship = this;
        $('.Track_box table tr td a').attr('href', 'javascript:void(0)').click(function () {
            $('#dis1').removeClass('dis');
            $('#dis2').addClass('dis');
            ship.deletes();
            $('.Track_box').Logistics({ id: ship.LogisticsParms.num, url: ship.LogisticsParms.url, fun: ship.adds });
            return false;
        });
    },
    adds: function () {
        var ulleng = $('.Track_ment li').length;
        for (var is = 0; is < ulleng; is++) {
            $('.Track_ment li:eq(' + is + ')').attr('id', 'dis' + (is + 1));
        }
        return false;
    },
    deletes: function () {
        var ulleng = $('.Track_ment li').length;
        for (var is = 0; is < ulleng; is++) {
            $('.Track_ment li:eq(' + is + ')').attr('id', 'dis');
        }
        return false;
    },
    //撤销运单
    CancelShip: function (shipid, dom) {
        if (shipid.length > 0) {
            if (confirm("您确定要撤销此运单吗？")) {
                $.ajax({
                    type: "POST",
                    url: "/App_Services/wsPickService.asmx/CancelPickShip",
                    dataType: "json",
                    contentType: "application/json;utf-8",
                    data: "{\"shipid\":\"" + shipid + "\"}",
                    timeout: 10000,
                    beforeSend: function () { $(dom).attr("disabled", "disabled"); },
                    complete: function () { $(dom).removeAttr("disabled"); },
                    error: function () { alert("网络发生错误，请重试！") },
                    success: function (res) {
                        switch (res.d) {
                            case -2: alert("参数异常"); break;
                            case -3: alert("对不起，您还没有登录！"); window.location.href = "http://passport.panli.com/login"; break;
                            case -1: alert("撤销运单失败！"); break;
                            case 0: alert("撤销运单成功！"); $("#tr" + shipid).remove(); if ($("#shiplist tr").length <= 1) { window.location = window.location.href } else { $("#shiplist tr").removeClass("hui"); $("#shiplist tr:gt(0):odd").addClass("hui"); } break;
                            case 1: alert("当前状态不允许修改"); break;
                            default:
                                alert("撤销运单失败！"); break;
                        }
                    }
                });
            }
        }
        else {
            alert("参数异常");
        }
    },
    CancelShipOrder: function (shipid, dom) {
        if (shipid.length > 0) {
            if (confirm("您确定要撤销此运单吗？")) {
                $.ajax({
                    type: "POST",
                    url: "/App_Services/wsPickService.asmx/CancelPickShip",
                    dataType: "json",
                    contentType: "application/json;utf-8",
                    data: "{\"shipid\":\"" + shipid + "\"}",
                    timeout: 10000,
                    beforeSend: function () { $(dom).attr("disabled", "disabled"); },
                    complete: function () { $(dom).removeAttr("disabled"); },
                    error: function () { alert("网络发生错误，请重试！") },
                    success: function (res) {
                        switch (res.d) {
                            case -2: alert("参数异常"); break;
                            case -3: alert("对不起，您还没有登录！"); window.location.href = "http://passport.panli.com/login"; break;
                            case -1: alert("撤销运单失败！"); break;
                            case 0: { alert("撤销运单成功！"); window.location = "/mypanli/Pick/ShipOrder.aspx"; break; }
                            case 1: alert("当前状态不允许修改"); break;
                            default:
                                alert("撤销运单失败！"); break;
                        }
                    }
                });
            }
        }
        else {
            alert("参数异常");
        }
    },
    AddReservation: function (Th) {
        var This = this;
        var Obj = {
            PointId: [$('input:checked', '#PickClick').val(), "请选择自提地点！"],
            Date: [$('.PickMon-AmendDate select:eq(0)').val(), "请选择自提日期！"],
            DateTime: [$('.PickMon-AmendDate select:eq(1)').val(), "请选择自提时间！"],
            Id: [This.TionId, "错误的参数请关闭后重新开启！"]
        };
        for (var i in Obj) {
            if ($.trim(Obj[i][0]).length == 0) {
                alert(Obj[i][1]);
                return false;
            }
        };

        $.ajax({
            type: "POST",
            url: "/App_Services/wsPickService.asmx/ReservationByShip",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{\"shipid\":\"" + This.TionId + "\",\"point\":\"" + Obj.PointId[0] + "\",\"daytime\":\"" + Obj.Date[0] + "\",\"hourstime\":\"" + Obj.DateTime[0] + "\"}",
            timeout: 10000,
            beforeSend: function () { $(Th).attr("disabled", "disabled"); },
            complete: function () { $(Th).removeAttr("disabled"); },
            error: function () { window.Panli.Message.showCallBack('网络发生错误，请重试！', function () { }); },
            success: function (res) {
                switch (res.d) {
                    case 3:
                        {
                            $("#PickReceived,#PickAmend").hide();
                            window.Panli.Overlay.close();
                            window.Panli.Message.showCallBack('参数异常', function () { });
                            break;
                        }
                    case 4: alert("对不起，您还没有登录！"); window.location.href = "http://passport.panli.com/login"; break;
                    case 1:
                        {
                            $("#PickReceived,#PickAmend").hide();
                            window.Panli.Overlay.close();
                            window.Panli.Message.showCallBack('预约成功！', function () {
                                window.location = window.location.href;
                            });
                            break;
                        }
                    case 2:
                        {
                            window.Panli.Overlay.close();
                            $("#PickReceived,#PickAmend").hide();
                            window.Panli.Message.showCallBack('预约失败！', function () { });
                            break;
                        }
                    default:
                        {
                            window.Panli.Overlay.close();
                            $("#PickReceived,#PickAmend").hide();
                            window.Panli.Message.showCallBack('预约失败，请稍后再试！', function () { });
                            break;
                        }
                }
            }
        });
    },
    ReservationDate: function (th) {
        var Name = this.InquireDate($(th).val()),
              Html = '<option value="">——请选择时间——</option>';
        for (var i in Name[0]) {
            Html += '<option value="' + Name[0][i].TimeHoursSpan + '">' + Name[0][i].TimeHoursSpan + '</option>'
        };
        $(th).next().html(Html);
        return false;

    },
    InquireDate: function (name) {
        var ids = $('.PickMon-AddOn input').val();
        if (!ids || !name) return false;
        var Data = this.AddReseData[ids];
        if (!Data) { alert('没有可用数据！'); return false; }
        var hs = [];
        for (var i in Data) {
            if (Data[i].TimeDay == name) {
                hs.push(Data[i].HoursSpan);
            }
        }
        if (hs.length > 0)
            return hs;
        return false;
    },
    //预约
    Reservation: function (id) {
        $('.PickMon-AmendDate select:eq(0)').html('<option value="">——请选择日期——</option>');
        $('.PickMon-AmendDate select:eq(1)').html('<option value="">——请选择时间——</option>');

        var This = this;
        this.TionId = id;
        this.Ajaxrequest(id, 'GetPickShipPointById', function (data) {
            This.addContext(data);
        });

    },
    PickMonAdd: function (t, id) {
        if ($(t).hasClass('PickMon-AddOn')) return false;
        $('.PickMon-AmendDate select:eq(0)').html('<option value="">——请选择日期——</option>');
        $('.PickMon-AmendDate select:eq(1)').html('<option value="">——请选择时间——</option>');

        $('.PickMon-AddressIn', $(t)).attr('checked', 'checked');
        $('#PickClick .PickMon-AddOn').removeClass('PickMon-AddOn').addClass('PickMon-Add');
        $(t).addClass('PickMon-AddOn').removeClass('PickMon-Add');

        var data = this.AddReseData[id];

        Html = '<option value="">——请选择日期——</option>';
        for (var i in data) {
            Html += '<option value="' + data[i].TimeDay + '">' + data[i].TimeDay + '</option>'
        };
        $('.PickMon-AmendDate select:eq(0)').html(Html);
        return false;
    },
    addContext: function (data) {
        var Id = $('#PickAmend'),
            AddData = {},
            Html = '',
            This = this,
            url = '';
        $('td.Right1:eq(0)', Id).text(data.Country + " - " + data.City);
        $('td.Right1:eq(1)', Id).text(data.Consignee + " " + data.LastName);
        $('td.Right1:eq(2)', Id).text(data.Phone);
        var pointDisabled = 0;

        var lat, lng, pn, pt, ads, t, dst, zoom;

        for (var i in data.Points) {
            pointDisabled++;
            //if (parseInt(data.Points[i].Point.Status) == 1) {
            AddData[data.Points[i].Point.PointID] = data.Points[i].BusinessForamtTimes;
            lat = data.Points[i].Point.lat;
            lng = data.Points[i].Point.lng;
            pn = encodeURI(data.Points[i].Point.PointName);
            pt = data.Points[i].Point.PointType;
            ads = encodeURI(data.Points[i].Point.Address);
            t = encodeURI(data.Points[i].Point.BusinessHourDescription);
            dst = encodeURI(data.Points[i].Point.District);
            zoom = data.Points[i].Point.zoom;

            url = 'http://www.panli.com/mypanli/Pick/GoogleMapLoad.htm?lat=' + lat + '&lng=' + lng + '&zoom=' + zoom + '&pn=' + pn + '' +
                     '&pt=' + pt + '&ads=' + ads + '&t=' + t + "&dst=" + dst;

            Html += '<div class="PickMon-Add" onclick="pickShip.PickMonAdd(this,' + data.Points[i].Point.PointID + ')"><input type="radio" name="Address" class="PickMon-AddressIn" value="' + data.Points[i].Point.PointID + '" /><div class="PickMon-Address">'
                     + '<p>' + data.Points[i].Point.PointName + (pt == 1 && data.Points.length > 1 ? '<p><span class="redTip">（若您选择在中心站自提，则无法更改取货地点。）</span></p>' : '') + '</p><p>地址：' + data.Points[i].Point.Address + '，' + data.Points[i].Point.District + '</p><p class="Date">时间：' + data.Points[i].Point.BusinessHourDescription + '</p></div>'
                     + '<a href="javascript:;" class="PickMon-Map"  onclick="window.open(\'' + url + '\',\'地图查找\',\'left=\' + (screen.width - 950) / 2 + \',top=\' + (screen.height - 800) / 2 + \',height=510, width=510,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no\');return false;"></a><div style="clear: both;" ></div></div>';
            //            }
            //            else {
            //                pointDisabled = true;
            //            }
        };

        $('#PickClick').html(Html);

        if (pointDisabled==0) {
            $('#pointDisabledTip', '#PickAmend').show();
        }
        this.AddReseData = AddData;
        //如果只有一个自提点那么就 默认选中
        var PickBo = false;
        var Tdata = {};
        if (this.ReseId) {
            this.Ajaxrequest(this.ReseId, 'GetPickShipPointReceivedById', function (data) {
                Tdata = data,
            T2data = This.Data.See[This.ReseId];
                if (Tdata) {
                    $("div.PickMon-Add", "#PickClick").each(function (i, t) {
                        if (Tdata.Points.ID == $(t).find('input').val()) {
                            PickBo = true;
                            $(t).triggerHandler("click");
                            $('.PickMon-AmendDate select:eq(0)', '#PickAmend').val(Tdata.WrokDayTime);
                            This.ReservationDate($('.PickMon-AmendDate select:eq(0)', '#PickAmend'));
                            $('.PickMon-AmendDate select:eq(1)', '#PickAmend').val(Tdata.WrokHoursTime);
                        }
                    });
                }

                if (!PickBo && data.Points.length > 0)
                    $("div.PickMon-Add", "#PickClick").eq(0).triggerHandler("click");
                window.Panli.Overlay.open();
                $('#PickAmend').show();
            });
        } else {
            if (!PickBo && data.Points.length > 0)
                $("div.PickMon-Add", "#PickClick").eq(0).triggerHandler("click");
            window.Panli.Overlay.open();
            $('#PickAmend').show();
        }
    },
    Ajaxrequest: function (id, url, fun) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsPickService.asmx/" + url,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{\"shipid\":\"" + id + "\"}",
            timeout: 10000,
            beforeSend: function () { },
            complete: function () { },
            error: function () { alert("网络发生错误，请重试！") },
            success: function (res) {
                res = eval("(" + res.d + ")");
                var data = res.date,
                    text = {
                        0: '提交参数异常！',
                        2: '参数提交失败！',
                        3: '请登陆后操作！'
                    };
                res.type == 1 ? fun(data) : alert(text[res.type]);
                return false;
            }
        });
    },
    addEvaluation: function (data) {

        var Id = $('#PickReceived');
        lat = data.Points.lat;
        lng = data.Points.lng;
        pn = encodeURI(data.Points.Name);
        pt = data.Points.Type;
        ads = encodeURI(data.Points.Address);
        t = encodeURI(data.Points.BusinessTime);
        dst = encodeURI(data.Points.District);
        zoom = data.Points.zoom;
        url = "http://www.panli.com/mypanli/Pick/GoogleMapLoad.htm?lat=" + lat + "&lng=" + lng + "&zoom=" + zoom + "&pn=" + pn + "" +
                     "&pt=" + pt + "&ads=" + ads + "&t=" + t + "&dst=" + dst;
        $('td.Right1:eq(0)', Id).text(data.Country + " - " + data.City);
        $('td.Right1:eq(1)', Id).text(data.Consignee + " " + data.LastName);
        $('td.Right1:eq(2)', Id).text(data.Phone);
        $('td.Right1:eq(3) .PickMon-Address p:eq(0)', Id).text(data.Points.Name.replace("ParcelPoint", ""));
        $('td.Right1:eq(3) .PickMon-Address p:eq(1)', Id).text("地址：" + data.Points.Address + "，" + data.Points.District);
        $('td.Right1:eq(3) .PickMon-Address p:eq(2)', Id).text(data.Points.BusinessTime);
        $('td.Right1:eq(3) .PickMon-Map', Id).click(function () {
            window.open(url, "地图查找", "left=" + (screen.width - 950) / 2 + ",top=" + (screen.height - 800) / 2 + ",height=510, width=510,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no"); return false;
        });
        $('td.Right1:eq(4) .PickMon-Date', Id).text(data.ReceiveTime);

        //如果状态为 移动站派送中 则不能修改
        //如果状态为 用户已预约或者用户未赴约 那个还需求判断一下 如果是领取时间为当天的6点之前则可以修改 其他则不能修改了
        if (data.Status == 25)
            $('div.PickMon-Submit a.Right', Id).hide();
        else if (data.Status == 21 && data.IsUpdateReceive == true)
            $('div.PickMon-Submit a.Right', Id).show();
        else if (data.Status == 22)
            $('div.PickMon-Submit a.Right', Id).show();
        else
            $('div.PickMon-Submit a.Right', Id).hide();
        window.Panli.Overlay.open();
        $('#PickReceived').show();
        return false;
    },
    //查看预约
    ShowReservation: function (id) {
        var This = this;
        this.ReseId = id;
        this.Ajaxrequest(id, 'GetPickShipPointReceivedById', function (data) {
            This.Data.See[id] = data;
            This.addEvaluation(data);
        });
        return false;
    },
    CancelOverlay: function (th) {
        window.Panli.Overlay.close();
        $(th).parents('.PickMon').hide();
    },
    //确认订单
    ConfirmShip: function (shipid, dom) {
        if (shipid.length > 0) {
            if (confirm("您确定收到包裹了吗？")) {
                $.ajax({
                    type: "POST",
                    url: "/App_Services/wsPickService.asmx/ConfirmPickShip",
                    dataType: "json",
                    contentType: "application/json;utf-8",
                    data: "{\"shipid\":\"" + shipid + "\"}",
                    timeout: 10000,
                    beforeSend: function () { $(dom).attr("disabled", "disabled"); },
                    complete: function () { $(dom).removeAttr("disabled"); },
                    error: function () { alert("网络发生错误，请重试！"); },
                    success: function (res) {
                        switch (res.d) {
                            case 0: alert("参数异常"); break;
                            case 3: alert("对不起，您还没有登录！"); window.location.href = "http://passport.panli.com/login"; break;
                            case 2: alert("确认收货失败！"); break;
                            case 1: window.location = "/mypanli/OrderVote.aspx?orderID=" + shipid + "&shiptype=2"; break;
                            default:
                                alert("确认收货失败！"); break;
                        }
                    }
                });
            }
        }
        else {
            alert("参数异常！");
        }
    },
    Public: function () {
        var This = this,
            YdId = '#YunDan td.w7';
        $('.chakan', YdId).click(function () {
            This.ShowReservation($(this).parents('tr').attr('Data-Id'));
            return false;
        });

        $('.yuyue', YdId).click(function () {
            This.ReseId = '';
            This.Reservation($(this).parents('tr').attr('Data-Id'));
            return false;
        });

        $('#pickOpr .Right').click(function () {
            This.CancelOverlay(this);
            This.Reservation(This.ReseId);
            return false;
        });

        $('.PickMon-Submit a', '#PickAmend').click(function () {
            This.AddReservation(this);
            return false;
        });

        $('.PickMon-AmendDate select:eq(0)', '#PickAmend').change(function () {
            This.ReservationDate(this);
            return false;
        });

        $('.Track_ment li').click(function () {//当点击物流跟踪菜单切换 并加载信息
            if ($(this).attr('id') == "dis2") {//国际物流
                $('#dis1').removeClass('dis');
                $(this).addClass('dis');
                pickShip.deletes();
                $('.Track_box').Logistics({ id: pickShip.LogisticsParms.num, url: pickShip.LogisticsParms.url, fun: pickShip.adds });
                //                var lnums = pickShip.LogisticsParms.num;
                //                if (pickShip.LogisticsText[lnums]) {
                //                    $('.Track_box').html(pickShip.LogisticsText[lnums]);
                //                } else {
                //                    $('.Track_box').html("<div class='Track_tishi'>以下信息由物流公司提供,如有疑问请联系<a href='mailto:service@panli.com'>Panli客服</a></div>loading......");
                //                    pickShip.deletes();
                //                    $('.Track_box').load("/mypanli/Data/TraceData.aspx?expressNo=" + pickShip.LogisticsParms.num + "&expressUrl=" + pickShip.LogisticsParms.url, function () {
                //                        $('.Track_box').html("<div class='Track_tishi'>以下信息由物流公司提供,如有疑问请联系<a href='mailto:service@panli.com'>Panli客服</a></div>" + $(this).html());
                //                        pickShip.LogisticsText[lnums] = $('.Track_box').html();
                //                        pickShip.adds();
                //                    });
                //                }

            }
            if ($(this).attr('id') == "dis1") {//运单处理

                $('#dis2').removeClass('dis');
                $(this).addClass('dis');
                if (pickShip.LogisticsText[pickShip.LogisticsParms.pz]) {
                    $('.Track_box').html(pickShip.LogisticsText[pickShip.LogisticsParms.pz]);
                    pickShip.aclick();
                }
                else {
                    pickShip.ShowLogistics(pickShip.LogisticsParms.url, pickShip.LogisticsParms.num, pickShip.LogisticsParms.pz.replace("s", ""), pickShip.LogisticsParms.isThrough);
                }

            }
        });
        $(".g3").each(function (i, d) {
            $("img", $(d)).hover(function (e) {
                $("#ShipDetail").remove();
                $(document.body).append('<div id="ShipDetail" class="title">' + $(this).attr("remark") + '</div>');
                if ($(this).attr("remark").length > 30) $("#ShipDetail").width(300);
                $("#ShipDetail").css({ top: (e.clientY + 15 + (window.pageYOffset || document.documentElement.scrollTop)) + "px", left: e.clientX + "px" }).show();
                //                $(this).mousemove(function (e) {
                //                    $("#ShipDetail").css({ top: (e.clientY + 15 + (window.pageYOffset || document.documentElement.scrollTop)) + "px", left: e.clientX + "px" }).show();
                //                });
            }, function () {
                $(this).unbind("mousemove");
                $("#ShipDetail").remove();
            });
        });

    },
    Init: function () {
        this.Public();
    }
};

$(function () {
    pickShip.Init();
});


function Json(O) {//对象序列化
    var Json = '',
        S = [];
    switch (Object.prototype.toString.call(O).slice(8, -1)) {
        case 'Array':
            for (var i = 0; i < O.length; i++)
                S.push(arguments.callee(O[i]));
            Json += '[' + S.join(',') + ']';
            break;
        case 'Date':
            Json += "new Date(" + O.getTime() + ")";
            break;
        case 'RegExp':
        case 'Function':
            Json += O.toString();
            break;
        case 'Object':
            for (var i in O) {
                O[i] = typeof (O[i]) == 'string' ? '"' + O[i] + '"' : (typeof (O[i]) === 'object' ? arguments.callee(O[i]) : O[i]);
                S.push(i + ':' + O[i]);
            }
            Json += '{' + S.join(',') + '}';
    }
    return Json;
};