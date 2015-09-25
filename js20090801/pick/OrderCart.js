var OrderCart = {
    ShipId: 0,
    Address: {
        DomId: function (id) { return document.getElementById(id); },
        Content: {},
        Init: function (Con) {

            var This = this,
                Private = $('ul li', '#PanlePrivate .dizhi2');
            this.Content = userAddressList;
            this.LoadAddressClick(Private, Con);
            Private.click(function () { This.AddressClick(this); });

        },
        LoadAddressClick: function (Private, Con) {
            var This = this;
            if (!Con) {
                This.AddressClick(Private.eq(0));
                return false;
            }
            OrderCart.TypeClick($('#RetrievingMeans li:eq(0)'));
            var Obj = this.Inquire(Con.ID),
                IsEqual = true,
                NewCon = {
                    "szConsignee": Con.Consignee,
                    "szZip": Con.Zip,
                    "szTelephone": Con.Phone,
                    "szShipCountry": Con.Country,
                    "szShipCity": Con.City,
                    "szShipAddress": Con.Address
                };
            for (var i in NewCon) {
                if ($.trim(NewCon[i]) != $.trim(Obj[i])) {
                    IsEqual = false;
                    $('#PanlePrivate .dizhi2 li').removeClass('on');
                    $('#PanlePrivate .dizhi2 li:last').addClass('on').find('input').attr('checked', 'checked');
                    break;
                };
            };
            if (IsEqual) {
                Private.each(function (i, t) {
                    if ($('input', t).val() == Con.ID) {
                        $(t).show();
                        $(t).addClass('on').find('input').attr('checked', 'checked');
                    }
                });
            };
            $('#baoliu1 input:eq(' + Con.Item + ')').click();
            if (Con.Remark && Con.Remark.length > 0) { $('#txtRemark').removeClass('mr').val(Con.Remark); }
            this.AddAddress(NewCon);
            return false;
        },
        AddressClick: function (t) {
            if ($(t).hasClass('on')) return false;
            this.Select(t);
            if ($(t).find('input').val() <= 0) {
                $('input[type=text],textarea', '#AutoComplete ').each(function (i, th) {
                    $(th).val('');
                    if ($(th).attr('id') == 'txtRemark') {
                        $(th).addClass('mr').val('若您对商品包装、配送有特殊要求，请在此填写，我们一定尽力满足:)');
                    }
                });
                UCCountryCallBack();
                return false;
            }
            this.AddAddress(this.Inquire($('input', t).val()));
        },
        Select: function (t) {
            $(t).parents('.dizhi2').find('li').removeClass('on');
            $(t).addClass('on').find('input').attr('checked', 'checked');
        },
        Inquire: function (id) {
            var List = this.Content;
            if (List.length == 0) return false;
            for (var i = 0; i < List.length; i++) {
                if (List[i].nID == id) return List[i];
            };
            return false;
        },
        AddAddress: function (Obj) {
            DomId = this.DomId;
            DomId('dtCountry').value = Panli.htmlDecode(Obj.szShipCountry);
            DomId('CurrentCity').value = Panli.htmlDecode(Obj.szShipCity);
            DomId('DetailedAddress').value = Panli.htmlDecode(Obj.szShipAddress);
            DomId('ZipCode').value = Panli.htmlDecode(Obj.szZip);
            DomId('Consignee').value = Panli.htmlDecode(Obj.szConsignee);
            DomId('txtTelephone').value = Panli.htmlDecode(Obj.szTelephone);
            UCCountryCallBack();
        },
        IdTest: {
            'dtCountry': '请填写收货区域',
            'CurrentCity': '请填写所在城市',
            'DetailedAddress': '请填写详细地址',
            'ZipCode': '请填写邮政编码',
            'Consignee': '请填写收件人',
            'txtTelephone': '请填写收货人电话'
        }
    },
    PickAddress: {
        //Country: {},
        Init: function (Con) {
            OrderCart.TypeClickbo = false;
            OrderCart.TypeClick($('#RetrievingMeans li:eq(1)'));
            //this.InitSelect();
            if (Con) {
                $('.a_jobtime1 select').val(Con.CoutryID).trigger("change");

                $('.a_jobtime2 select').val(Con.StateID);
                $('#ztFirstName').val(Con.Consignee);
                $('#ztLastName').val(Con.lastName);
                $('#ztPhone').val(Con.Phone);
                if (typeof Con.City != "undefined")
                    $('#baoliu2 input[name=rdoPickReserve]:eq(' + Con.Item + ')').click();
                Con.Remark == '' || !Con.Remark ? '' :
                 $('.beizhu_r .txtRemark').removeClass('mr').val(Con.Remark);
            }
            var stateId = $('.a_jobtime2 select').val(),
                lat = parseFloat($('.a_jobtime2 select option:selected').attr('map-lat')),
                lng = parseFloat($('.a_jobtime2 select option:selected').attr('map-lng')),
                Zoom = $('.a_jobtime2 select option:selected').attr('map-zoom');
            DeliveryOrder.gmap.rqeuestMapData(stateId, lat, lng, Con.PickID);
            //DeliveryOrder.gmap.rqeuestMapData("1", -37.8146667480469, 144.963806152344, 221);
        }

    },
    TypeClickbo: true,
    TypeClick: function (th) {
        if ($(th).find('input').attr('disabled')) return false;
        if ($(th).hasClass('on')) return false;
        var hVal = $(th).find('input').val();
        this.ShipId = $(th).index();
        var _this = this;
        $('#RetrievingMeans li').each(function (i, t) {
            var Val = $(t).find('input').val();
            if (Val == hVal) {
                $(t).addClass('on').find('input').attr('checked', 'checked');
                $('#' + Val).show();
            } else {
                $(t).removeClass('on');
                $('#' + Val).hide();
            }

        });
        if (hVal == "PanlePick") {
            DeliveryOrder.gmap.init(_this.TypeClickbo);
            _this.TypeClickbo = true;
        }
    },
    InitSelect: function () {
        this.Country = pickDictCountry;
        if (typeof this.Country == "undefined") { return false; }
        var ListCountry = this.Country;
        var sel1 = $('.a_jobtime1 select');
        var sel2 = $('.a_jobtime2 select');
        var PhonePrefix = $('#snPhonePrefix');
        var PhoneExample = $('#snPhoneExample');

        for (var i = 0; i < ListCountry.length; i++) {
            
            sel1.append("<option value='" + ListCountry[i].CountryID + "' data-PhoneExample='" + ListCountry[i].PhoneExample + "' data-PhoneLenght=" + ListCountry[i].PhoneLenght + " data-PhonePrefix='" + ListCountry[i].PhonePrefix + "' >" + ListCountry[i].CountryName + "</option>");
            if (i == 0) {
                PhonePrefix.text("+" + ListCountry[i].PhonePrefix);
                PhoneExample.text("填写当地手机号码（如：" + ListCountry[i].PhoneExample + "），以便我们及时联系您。");

                for (var j = 0; j < ListCountry[i].States.length; j++) {
                    sel2.append("<option value='" + ListCountry[i].States[j].StateID + "' map-lat='" + ListCountry[i].States[j].Lat + "' map-lng='" + ListCountry[i].States[j].Lng + "' map-zoom='" + ListCountry[i].States[j].Zoom + "' >" + ListCountry[i].States[j].StateName + "</option>");
                }
            }
        }
      
        sel1.change(function (e, t) {
            var CountryId = $('option:selected', this).val();
            for (var i = 0; i < ListCountry.length; i++) {
                if (ListCountry[i].CountryID == CountryId) {
                    sel2.children("option").remove();

                    PhonePrefix.text("+" + ListCountry[i].PhonePrefix);
                    PhoneExample.text("填写当地手机号码（如：" + ListCountry[i].PhoneExample + "），以便我们及时联系您。");

                    for (var j = 0; j < ListCountry[i].States.length; j++) {
                        sel2.append("<option value=" + ListCountry[i].States[j].StateID + " map-lat='" + ListCountry[i].States[j].Lat + "' map-lng='" + ListCountry[i].States[j].Lng + "' map-zoom='" + ListCountry[i].States[j].Zoom + "' >" + ListCountry[i].States[j].StateName + "</option>");
                    }
                    sel2.trigger("change");
                }
            }
        });
    },
    Public: function () {
        var This = this;

        $('#RetrievingMeans li').click(function () {
            This.TypeClick(this);
        });

        $('#txtRemark,.txtRemark').focus(function () {
            if ($(this).val() == '若您对商品包装、配送有特殊要求，请在此填写，我们一定尽力满足:)' || $(this).hasClass('mr')) {
                $(this).removeClass('mr').val('');
            };
        }).blur(function () {
            if ($.trim($(this).val()) == '')
                $(this).addClass('mr').val('若您对商品包装、配送有特殊要求，请在此填写，我们一定尽力满足:)');
        });

        $('#ztName,#ztNames,#ztPhone').each(function (i, t) {
            $(t).focus(function () {
                $(t).removeClass('am_c_wrong').addClass('am_p_k').nextAll('div.am_error').hide();
            });
        });

        //设置关闭Tip提示
        $("#pickDeliveryTip").click(function () {
            $(this).parent().hide();
            var CurrentUserId = $("#hidUserID").val();
            var picktip = jaaulde.utils.cookies.get('pickdeliverytip');
            if (picktip != null) {
                picktip = picktip + '|' + CurrentUserId;
                jaaulde.utils.cookies.set('pickdeliverytip', picktip, { domain: 'panli.com', hoursToLive: 500 });
            }
            return false;
        });

        var picktip = jaaulde.utils.cookies.get('pickdeliverytip');
        if (picktip != null) {
            var CurrentUserId = $("#hidUserID").val();
            if (picktip.indexOf(CurrentUserId) >= 0) {
                $("div.am_tsgai").hide();
            }
        }

        $("#showPickTip").click(function () {
            $("div.am_tsgai").show();
        });


    },
    Text: {
        _Null: '请填写手机号码',
        Error: '格式有误，格式为：04XXXXXXXX',
        Success: '填写当地手机号码（如：04XXXXXXXX），以便我们及时联系您。'
    },
    Submit: function () {
        var id = this.Address.IdTest,
                Dom = this.Address.DomId,
                This = this;

//        if ($("#RetrievingMeans ul li.on").length <= 0) {
//            alert("请选择收货方式");
//            return false;
//        }

        if (this.ShipId == 0) {
            for (var i in id) {
                if ($.trim(Dom(i).value) == '') {
                    Dom(i).focus();
                    return false;
                };
            }
        } else {
            var boo = true;
            $('#ztFirstName,#ztLastName,#ztPhone').each(function (i, t) {
                if ($.trim($(t).val()) == '') {
                    boo = false;
                    $(t).addClass('am_c_wrong').removeClass('am_p_k').nextAll('div.am_error').show();
                    if (t.id == "ztPhone") {
                        $(t).nextAll('div.am_error').text(This.Text._Null);
                    }
                }
                if (t.id == "ztPhone") {

                    var selCountry = $('.a_jobtime1 > select option:selected');
                    var regexLen = selCountry.attr("data-PhoneLenght");
                    var phoneExample = selCountry.attr("data-phoneexample");
                    var telRegex = new RegExp('^\\d{' + regexLen + '}$', "g");

                    if (!telRegex.test($.trim($(t).val()))) {
                        $(t).addClass('am_c_wrong').removeClass('am_p_k').nextAll('div.am_error').show();
                        if ($.trim($(t).val()) != '') {
                            $(t).nextAll('div.am_error').text(This.Text.Error.replace(new RegExp("04XXXXXXXX"), phoneExample));
                        }
                        boo = false;
                    }
                    //var telRegex = /^04\d{8}$/;
                    //                    if (!telRegex.exec($.trim($(t).val()))) {
                    //                        $(t).addClass('am_c_wrong').removeClass('am_p_k').nextAll('div.am_error').show();
                    //                        if ($.trim($(t).val()) != '') {
                    //                            $(t).nextAll('div.am_error').text(This.Text.Error);
                    //                        }
                    //                        boo = false;
                    //                    }
                }
            });

            if (!boo) return false;
            $('#hidPickPoint').val($('div.mapName li.on').attr('point-id'));
        };

        //$('#addressType').val(this.ShipId + 1);
        $('#Loadding').show();
        return true;
    },
    Init: function () {
        var This = this,
            Con = DefaultAddress,
            AddCons = false,
            PickAdd = false;
        DefaultAddress.addressType == 0 ? function () {
            var val = 1;
            if (val == '1') {
                $('#RetrievingMeans li:eq(0) input').attr('checked', 'checked');
                $('#RetrievingMeans li:eq(0)').addClass("on");
                $('#PanlePrivate').show();
            } else if (val == '2' && $("#PanlePick").size() > 0) {
                var Record = PickLastRecord;
                if (Record.countryID != 0)
                    PickAdd = {
                        'CoutryID': Record.countryID,
                        'StateID': Record.cityID,
                        'TagID': Record.tags,
                        'PickID': Record.PickPointID,
                        'Consignee': Record.szConsignee,
                        'Phone': Record.szTelephone,
                        'lastName': Record.lastName,
                        'Item': Record.item,
                        'Remark': Record.szShipRemark
                    }
            }
        } () : DefaultAddress.addressType == 1 ? AddCons = DefaultAddress.Date : PickAdd = DefaultAddress.Date;

        var kind = $("#hidLastSubmitKind").val();

        this.Address.Init(AddCons);
        This.InitSelect();
        if (((kind == 2 && DefaultAddress.addressType != 1) || DefaultAddress.addressType == 2) && $("#PanlePick").size() > 0) {
            this.PickAddress.Init(PickAdd);
        }
        this.Public();
    }
};


//var DeliveryOrder = {
//    gmap: {
//        initData: { point: 0, state: 0 },
//        map: {},
//        markers: [],
//        infoWindow: {},
//        IsManuallyZoom: false,
//        markerImages: ['http://sf.panli.com/FrontEnd/images20090801/newmypanli/Pick/conter.png', 'http://sf.panli.com/FrontEnd/images20090801/newmypanli/Pick/move.png'],
//        closeInfoWindow: function () {
//            var _this = this;
//            _this.infoWindow.close();
//        },
//        isgoogel: function () {
//            try {
//                if (typeof google === "undefined" || typeof google.maps == "undefined")
//                    return false;
//                else
//                    return true
//            } catch (e) {
//                return false;
//            }
//        },
//        init: function (boo) {
//            var _this = this;
//            if (!this.isgoogel()) {
//                $('.mapShow').addClass('mapShowBg');
//            }

//            var state = $('div.a_jobtime2 > select[name=selState]');
//            var state2 = $('div.a_jobtime2 > select[name=selState] option:selected');
//            var zoom, lat, lng, stateId;
//            zoom = parseInt(state2.attr('map-zoom'));
//            lat = parseFloat(state2.attr('map-lat'));
//            lng = parseFloat(state2.attr('map-lng'));
//            stateId = state.val();


//            if (typeof (_this.map.center) == "undefined" && this.isgoogel()) {
//                try {
//                    var latlng = new google.maps.LatLng(lat, lng);
//                    var mapOptions = {
//                        zoom: zoom,
//                        center: latlng,
//                        mapTypeId: google.maps.MapTypeId.ROADMAP,
//                        mapTypeControl: false,
//                        streetViewControl: false
//                    };
//                    google.maps.visualRefresh = true;
//                    _this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
//                    _this.infoWindow = new google.maps.InfoWindow({
//                        map: _this.map
//                    });
//                    _this.infoWindow.close();
//                    _this.zoomChanged();
//                    _this.dragChanged();
//                }
//                catch (err) {

//                }
//            }
//            if (boo) {
//                _this.rqeuestMapData(stateId);
//            };
//            _this.menuItemClick();
//        },

//        zoomChanged: function () {
//            var _this = this;
//            var state = $('div.a_jobtime2 > select[name=selState]');

//            zoom = parseInt($('option:selected', state).attr('map-zoom'));
//            var stateId;
//            google.maps.event.addDomListener(_this.map, 'zoom_changed', function (event) {
//                if (!_this.IsManuallyZoom) {
//                    stateId = parseInt($('option:selected', state).val());
//                    var nzoom = _this.map.getZoom();
//                    var latlng = _this.map.getCenter();
//                    _this.rqeuestMenuData(stateId, latlng.lat(), latlng.lng(), nzoom);
//                }
//            });
//        },
//        radiusViewable: function (bounds) {
//            var center = bounds.getCenter();
//            var ne = bounds.getNorthEast();
//            var r = 3963;
//            var lat1 = center.lat() / 57.2958;
//            var lon1 = center.lng() / 57.2958;
//            var lat2 = ne.lat() / 57.2958;
//            var lon2 = ne.lng() / 57.2958;
//            var dis = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));
//            return dis
//        },
//        dragChanged: function () {
//            var _this = this;
//            var state = $('div.a_jobtime2 > select[name=selState]');
//            var stateId;
//            zoom = parseInt($('option:selected', state).attr('map-zoom'));
//            google.maps.event.addDomListener(_this.map, 'dragend', function () {
//                stateId = parseInt($('option:selected', state).val());
//                var nzoom = _this.map.getZoom();
//                var latlng = _this.map.getCenter();
//                _this.rqeuestMenuData(stateId, latlng.lat(), latlng.lng(), nzoom);
//            });
//        },
//        addMarket: function (p) {
//            var _this = this;
//            var index = _this.markers.length + 1;
//            var lat, lng;
//            lat = parseFloat(p.lat);
//            lng = parseFloat(p.lng);
//            var latlng = new google.maps.LatLng(lat, lng);

//            var marker = new google.maps.Marker({
//                position: latlng,
//                map: _this.map,
//                title: p.name.replace("ParcelPoint", ""),
//                zIndex: index
//            });

//            if (p.type == 1 || p.type == 2) {
//                marker.setIcon(_this.markerImages[p.type - 1]);
//            }

//            google.maps.event.addListener(marker, 'click', function () {
//                _this.infoWindow.setContent('<div class="mapKuann"> ' +
//                                            '<p>' + p.name.replace("ParcelPoint", "") + '</p> ' +
//                                            '<p>特点：<span>' + _this.pointKindFeature(p.type) + '</san></p>' +
//                                            '<p>地址：' + p.address + '，' + p.district + '</p>' +
//                                            '<p>时间：' + p.time + '</p>' +
//                                            '</div>');
//                _this.map.setCenter(latlng);
//                _this.infoWindow.open(_this.map, marker);
//                _this.queryPoint(p);

//            });
//            _this.markers.push({ pid: p.point, mk: marker });
//        },
//        isShowGotoBack: function () {
//            var state = $('div.a_jobtime2 > select[name=selState]').val();
//            var len = $('div.mapName li:not(.a_xsq)').length;
//            if (this.initData.point != len || this.initData.state != state) {
//                $("li.a_xsq").show();
//            } else {
//                $("li.a_xsq").hide();
//            }
//        },
//        pointKindFeature: function (t) {
//            switch (t) {
//                case 1: return "须要预约，免费保管30天";
//                case 2: return "须要预约，免费保管30天";
//                case 3: return "无须预约，免费保管7天";
//                case 4: return "无须预约，免费保管7天";
//                default: return "须要预约，免费保管30天"
//            }
//        },
//        ClaerMarkers: function () {
//            var _this = this;
//            for (var i = 0; i < _this.markers.length; i++) {
//                _this.markers[i].mk.setMap(null);
//            }
//            _this.markers = [];
//        },
//        queryPoint: function (p) {
//            var isId = true,
//            _this = this;
//            var _state = $('.a_jobtime2 select').val();
//            var hight = 0;
//            $('div.mapName li:not(.a_xsq)').each(function (i, t) {
//                if ($(t).attr('point-id') == p.point) {
//                    isId = false;
//                    $(t).addClass('on').siblings('.on').removeClass('on');
//                    $('.mapName').animate({ scrollTop: hight + 'px' }, 200);
//                    return false;
//                };
//                hight += $(t).height();
//            });
//            if (isId) {
//                this.rqeuestMenuData(_state, p.lat, p.lng, _this.map.getZoom())
//                return false;
//            };
//            _this.isShowGotoBack();
//            var hight = 0;

//        },
//        queryPoints: function (point) {
//            var hight = 0;
//            $('div.mapName li:not(.a_xsq)').each(function (i, t) {
//                if ($(t).attr('point-id') == point) {
//                    $(t).trigger("click");
//                    $('.mapName').animate({ scrollTop: hight + 'px' }, 200);
//                };
//                hight += $(t).height();
//            });
//        },
//        menuItemClick: function () {
//            var _this = this;
//            var menuItems = $("div.mapName > ul li:not(.a_xsq)");
//            menuItems.live('click', function (e, i) {
//                var item = $(this);
//                var pid = item.attr('point-id');
//                var marker;
//                for (var i = 0; i < _this.markers.length; i++) {
//                    if (_this.markers[i].pid == pid) {
//                        marker = _this.markers[i].mk;
//                        break;
//                    }
//                }
//                if (marker) {
//                    google.maps.event.trigger(marker, "click");
//                }
//            });
//        },
//        rqeuestMapData: function (stateId, lat, lng, Pointid) {
//            var _this = this;
//            var mbox = $("div.mapName");
//            var sp = mbox.find("ul li.on").size() > 0 ? mbox.find("ul li.on").attr('point-id') : 0;

//            $.ajax({
//                type: "POST",
//                url: "/App_Services/wsPickService.asmx/GetMarkerPoints",
//                dataType: "json",
//                contentType: "application/json;utf-8",
//                data: "{\"stateId\":\"" + stateId + "\"}",
//                timeout: 10000,
//                beforeSend: function () { $("div.mapName").find("ul").remove(); mbox.children("div.gNull").hide(); mbox.children("div.gloading").show(); },
//                complete: function () { },
//                error: function () { },
//                success: function (res) {
//                    var data = eval('(' + res.d + ')');
//                    if (data.result) {
//                        mbox.find("div.gNull").hide();
//                        if (_this.isgoogel()) {
//                            _this.ClaerMarkers();
//                            for (var i = 0; i < data.points.length; i++) {
//                                _this.addMarket(data.points[i]);
//                            }
//                        }
//                        _this.initData.point = data.points.length;
//                        _this.initData.state = stateId;
//                        _this.addrqeuestMenuData(data, sp);
//                        mbox.children("div.gloading").hide();
//                        !Pointid ? '' : _this.queryPoints(Pointid);
//                        _this.isShowGotoBack();
//                    } else {
//                        mbox.find("div.gNull").show();
//                    }
//                    mbox.children("div.gloading").hide();
//                }
//            });
//            return false;
//        },
//        addrqeuestMenuData: function (data, sp) {
//            var _this = this;
//            if (data) {
//                var menuBox = '<ul>';
//                for (var j = 0; j < data.points.length; j++) {
//                    menuBox += '<li point-id="' + data.points[j].point + '" ' + (data.points[j].point == sp ? "class='on'" : "") + '  >' +
//                                       '<div class="onMap">' +
//                                       '<h6 ' + (data.points[j].type == 1 ? 'class="mapCentre"' : '') + '>' + data.points[j].name.replace("ParcelPoint", "") + '' + (data.points[j].type == 1 ? '(中心站)' : '') + '</h6>' +
//                                       '<span class="mapTopbai">地址：' + data.points[j].address + '，' + data.points[j].district + '</span>' +
//                                       '<span>特点：' + _this.pointKindFeature(data.points[j].type) + '</span> ' +
//                                       '<span>时间：' + data.points[j].time + '</span>' +
//                                       '</div>' +
//                                       '</li>';
//                }
//                menuBox += '<li class="a_xsq" style="width:177px;cursor:inherit;display:none;">' +
//                           '<div class="a_xsn"><a href="javascript:;" onclick="DeliveryOrder.gmap.GotoBack();">显示该州所有自提点</a></div>' +
//                           '</li>';

//                menuBox += '</ul>';
//                $("div.mapName").find("ul").remove();
//                $("div.mapName").children("div.gloading").hide();
//                $("div.mapName").append(menuBox);
//                $("div.mapName ul li").hover(function () { $(this).addClass('hover'); }, function () { $(this).removeClass('hover'); })
//                        .click(function () {
//                            if ($(this).hasClass('on')) return false;
//                            $(this).addClass('on').siblings('li.on').removeClass('on');
//                        });
//            }
//        },
//        rqeuestMenuData: function (stateId, lat, lng, newZoom) {
//            var _this = this;
//            var longding = '<div class="gloading"></div>';
//            var mbox = $("div.mapName");
//            var sp = mbox.find("ul li.on").size() > 0 ? mbox.find("ul li.on").attr('point-id') : 0;
//            $.ajax({
//                type: "POST",
//                url: "/App_Services/wsPickService.asmx/GetMenuPoints",
//                dataType: "json",
//                contentType: "application/json;utf-8",
//                data: "{\"stateId\":\"" + stateId + "\",\"lat\":\"" + lat + "\",\"lng\" : \"" + lng + "\",\"newZoom\":\"" + newZoom + "\"}",
//                timeout: 10000,
//                beforeSend: function () {
//                    mbox.find("ul").remove();
//                    mbox.children("div.gNull").hide();
//                    mbox.children("div.gloading").show();
//                },
//                complete: function () {

//                },
//                error: function () {
//                    alert("网络请求失败！");
//                    mbox.children("div.gNull").show();
//                    mbox.children("div.gloading").hide();
//                },
//                success: function (res) {
//                    mbox.children("div.gloading").hide();
//                    var data = eval('(' + res.d + ')');
//                    if (data.result) {
//                        //_this.initData.point = data.points.length;
//                        //_this.initData.state = stateId;
//                        _this.addrqeuestMenuData(data, sp);
//                        _this.isShowGotoBack();
//                    } else {
//                        mbox.children("div.gNull").show();
//                    }
//                }
//            });
//            return false;
//        },
//        GotoBack: function () {
//            var id = $('option:selected', $('.a_jobtime2 select')).val();
//            lat = $('option:selected', $('.a_jobtime2 select')).attr('map-lat'),
//            lng = $('option:selected', $('.a_jobtime2 select')).attr('map-lng'),
//            zoom = $('option:selected', $('.a_jobtime2 select')).attr('map-zoom');
//            if (this.isgoogel) {
//                lat = parseFloat(lat);
//                lng = parseFloat(lng);
//                var latlng = new google.maps.LatLng(lat, lng);
//                this.closeInfoWindow();
//                this.map.setCenter(latlng);
//                zoom = parseInt(zoom);
//                this.IsManuallyZoom = true;
//                this.map.setZoom(zoom);
//            }
//            this.rqeuestMapData(id, lat, lng);
//            this.IsManuallyZoom = false;
//        }
//    },

//    Inits: function () {
//        var This = this;
//        $('.a_jobtime2 select').change(function () {
//            var id = $('option:selected', this).val();
//            lat = $('option:selected', this).attr('map-lat'),
//            lng = $('option:selected', this).attr('map-lng'),
//            zoom = $('option:selected', this).attr('map-zoom');
//            if (This.gmap.isgoogel()) {
//                lat = parseFloat(lat);
//                lng = parseFloat(lng);
//                var latlng = new google.maps.LatLng(lat, lng);
//                This.gmap.closeInfoWindow();
//                This.gmap.map.setCenter(latlng);
//                zoom = parseInt(zoom);
//                This.gmap.IsManuallyZoom = true;
//                This.gmap.map.setZoom(zoom);
//            }
//            This.gmap.rqeuestMapData(id, lat, lng);
//            This.gmap.IsManuallyZoom = false;
//        });
//    }
//};

$(function () {
    OrderCart.Init();
    //DeliveryOrder.Inits();
    UCCountryCallBack();
    //这里为了春节期间，关闭自提点业务下的到了2014-02-09-9则需要删除该代码
        
});

var FilterCountrys = ["美国", "英国", "澳大利亚", "新西兰", "上海/浙江/江苏/安徽", "中国大陆其他省市"];
//外部处理选择国家
function UCCountryCallBack(cn) {
    var OrdinaryProduct = $("#hidOrdinaryProduct").val();
    var txtCountry = $("#dtCountry").val();
    var boo = true;
    for (var i = 0; i < FilterCountrys.length; i++) {
        if (cn) {
            if (cn == FilterCountrys[i] && OrdinaryProduct == "1") {
                $("div.am_tsgai2").hide();
                boo = false;
                break;
            }
        } else {
            if (txtCountry == FilterCountrys[i] && OrdinaryProduct == "1") {
                $("div.am_tsgai2").hide();
                boo = false;
                break;
            }
        }
    }
    if (boo) {
        if ($.trim(txtCountry).length != 0) {
            $("div.am_tsgai2").show();
        } else {
            $("div.am_tsgai2").hide();
        }
    }
   
}