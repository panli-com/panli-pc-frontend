var temp_city_note = "请输入城市名称";
var temp_school_note = "请输入您的学校名称";
var temp_company_note = "请输入完整的公司名称";
var temp_userOk_flag = "0";

//////////////////////////////////////////////完成个人资源开始/////////////////////////////////////////////////////////////////
$(function() {

try {
//IE6下滚动跟随
if (typeof document.body.style.maxHeight == "undefined") {
    $("#div_ImproveUserInfo").css("position", "absolute").css("margin-top", "0px");
    var divY = (getViewportHeight() - $("#div_ImproveUserInfo").outerHeight()) / 2;
    $("#div_ImproveUserInfo").css("top", (divY + document.documentElement.scrollTop).toString());
    $(window).scroll(function() { $("#div_ImproveUserInfo").css("top", divY + document.documentElement.scrollTop + ""); });
}
} catch (e) { }

    try {
        if (typeof (ImproveUserInfoFlag) != "undefined" && ImproveUserInfoFlag != null && ImproveUserInfoFlag != "" && ImproveUserInfoFlag == "1") {
            ShowImproveUserInfoDiv();
        } 
    } catch (e) { }
    try {
        if (typeof (ImproveUserInfoIsAutoShow) != "undefined"  && ImproveUserInfoIsAutoShow == "0") {
            $("#chk_notAutoShowDiv").attr("checked", true);
        } else {
            $("#chk_notAutoShowDiv").attr("checked", false);
        }
    } catch (e) { }
    try {
        if (typeof (ImproveUserInfoFlag_Note_Master) != "undefined" && ImproveUserInfoFlag_Note_Master != null && ImproveUserInfoFlag_Note_Master != "") {
            if ($("#div_Improve_Master_Div_Note") != null && $("#div_Improve_Master_Div_Note").length > 0) {
                $("#div_Improve_Master_Div_Note").show();
                $("#div_Improve_Master_Div_Note").html(ImproveUserInfoFlag_Note_Master);
            }
        }
    } catch (e) { }
    try {
        if (typeof (ImproveUserInfoFlag_Note_Top_Mypanli) != "undefined" && ImproveUserInfoFlag_Note_Top_Mypanli != null && ImproveUserInfoFlag_Note_Top_Mypanli != "") {
            if ($("#ImproveUserInfo_zhuce_new") != null && $("#ImproveUserInfo_zhuce_new").length > 0) {
                $("#ImproveUserInfo_zhuce_new").show();
                $("#ImproveUserInfo_zhuce_new").html(ImproveUserInfoFlag_Note_Top_Mypanli);

            }
        }
    } catch (e) { }
});

function ShowImproveUserInfoDiv() {
    $("#div_ImproveUserInfo").show();
    Panli.Overlay.open();
}
//////////////////////////////////////////////完成个人资源结束/////////////////////////////////////////////////////////////////

$(function() {
    if ($("#hidOpType").val() == "2") {
        Hide_HeadImg();
    }
    else if ($("#hidOpType").val() == "1") {
        Hide_UserInfo();
    }

    $("#txtCity").focus(function() {
        if ($("#txtCity").val() == temp_city_note) {
            $("#txtCity").val("");
        }
        $("#txtCity").removeClass("am_tt3");
        $("#txtCity").addClass("am_tt4");
    });
    $("#txtCity").blur(function() {
        if ($("#txtCity").val() == temp_city_note || $("#txtCity").val() == "") {
            $("#txtCity").removeClass("am_tt4");
            $("#txtCity").addClass("am_tt3");
            $("#txtCity").val(temp_city_note);
        }
    });
    $("#txtSchool").focus(function() {
        if ($("#txtSchool").val() == temp_school_note) {
            $("#txtSchool").val("");
        }
        $("#txtSchool").removeClass("am_tt3");
        $("#txtSchool").addClass("am_tt4");
    });
    $("#txtSchool").blur(function() {
        $("#note_wrong1_school").hide();
        $("#note_wrong2_school").hide();
        $("#note_right_school").hide();
        if ($("#txtSchool").val() == temp_school_note || $("#txtSchool").val() == "") {
            $("#txtSchool").removeClass("am_tt4");
            $("#txtSchool").addClass("am_tt3");
            $("#txtSchool").val(temp_school_note);

            $("#note_wrong1_school").show();
        }
        else {
            if (CodeLength($("#txtSchool").val()) > 60) {
                $("#note_wrong2_school").show();
            } else {
                $("#note_right_school").show();
            }
        }
    });

    $("#txtCompany").focus(function() {
        if ($("#txtCompany").val() == temp_company_note) {
            $("#txtCompany").val("");
        }
        $("#txtCompany").removeClass("am_tt5");
        $("#txtCompany").addClass("am_tt6");
    });
    $("#txtCompany").blur(function() {
        $("#note_wrong1_company").hide();
        $("#note_wrong2_company").hide();
        $("#note_right_company").hide();
        if ($("#txtCompany").val() == temp_company_note || $("#txtCompany").val() == "") {
            $("#txtCompany").removeClass("am_tt6");
            $("#txtCompany").addClass("am_tt5");
            $("#txtCompany").val(temp_company_note);

            $("#note_wrong1_company").show();
        }
        else {
            if (CodeLength($("#txtCompany").val()) > 60) {
                $("#note_wrong2_company").show();
            } else {
                $("#note_right_company").show();
            }
        }
    });



    //生日
    $("input[datepicker]").datepicker({ changeYear: true, changeMonth: true, dateFormat: 'yy-mm-dd', yearRange: '1900:' + new Date().getFullYear() });
    $("input[datepicker]").change(function() {
        $("#note_wrong_birthday").hide();
        $("#note_right_birthday").show();
    });

    //关闭
    $(".xame_close a,.xame_gb a,#a_WaitClose,.xame_gb a").click(function() {
        CloseDiv_ImproveUser();
    });

    $(".xame_xuanx").find("a").eq(0).click(function() {
        Change_UserInfo();
        return false;
    });
    $(".xame_xuanx").find("a").eq(1).click(function() {
        Change_HeadImg();
        return false;
    });

    $("#btnSave").click(function() {
        SaveUserInfo();
    });

    $("input[type=radio][name='workOrStudy']").click(function() {
        if ($(this).val() == "1") {
            $("#tr_school").show();
            $("#tr_company").hide();
        }
        if ($(this).val() == "2") {
            $("#tr_company").show();
            $("#tr_school").hide();
        }
    });
    /*
    if (typeof (CountryListJSON) != "undefined" && CountryListJSON != null && CountryListJSON != "" && CountryListJSON == "1") {
    CountryList();
    }*/
    try {
        CountryList();
    } catch (e) { }

    $("input[type=radio][name='sex_ImproveUser']").click(function() {
        $("#note_right_sex").show();
    });

});

function CloseDiv_ImproveUser() {
    var data = jaaulde.utils.cookies.get("closenotshow");
    if (data != null) {
        data = data + '|ImproveUserInfo';
        jaaulde.utils.cookies.set('closenotshow', data, { domain: 'panli.com' });
    }
    else {
        jaaulde.utils.cookies.set('closenotshow', 'ImproveUserInfo', { domain: 'panli.com' });
    }

    $("#div_ImproveUserInfo").hide();
    Panli.Overlay.close();

    //    if ($("#chk_notAutoShowDiv").is(":checked")) {
    //        NotAutoShowImproveUserInfoDiv();
    //    }
    NotAutoShowImproveUserInfoDiv();
    return false;
}

function SaveUserInfo() {
    if ($("#txtBirthday").val() == "0000-00-00" || $("#txtBirthday").val() == "") {
        $("#note_wrong_birthday").show();
        return;
    }

    if ($("#dtCountry_ImproveUser").val() == "" || $("#dtCountry_ImproveUser").val() == "国家") {
        $("#note_wrong_country").show();
        return;
    }

    if ($("input[type=radio][name='workOrStudy']:checked").val() == "1") {
        $("#note_wrong1_school").hide();
        $("#note_wrong2_school").hide();
        if ($("#txtSchool").val() == "" || $("#txtSchool").val() == temp_school_note) {
            $("#note_wrong1_school").show();
            return;
        }
        if (CodeLength($("#txtSchool").val()) > 60) {
            $("#note_wrong2_school").show();
            return;
        }
    }
    else if ($("input[type=radio][name='workOrStudy']:checked").val() == "2") {
        $("#note_wrong1_company").hide();
        $("#note_wrong2_company").hide();
        if ($("#txtCompany").val() == "" || $("#txtCompany").val() == temp_company_note) {
            $("#note_wrong1_company").show();
            return;
        }
        if (CodeLength($("#txtCompany").val()) > 60) {
            $("#note_wrong2_company").show();
            return;
        }
    }
    var cityName = "";
    if ($("#txtCity").val() != "" && $("#txtCity").val() != temp_city_note) {
        cityName = $("#txtCity").val();
    }
    var countryName = "";
    if ($("#txtCompany").val() != "" && $("#txtCompany").val() != temp_company_note) {
        countryName = $("#txtCompany").val();
    }

    $.ajax({
        type: "POST",
        async: false,
        url: "/App_Services/wsImproveUserInfo.asmx/UpdateUserInfo",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"sex":' + $("input[type=radio][name='sex_ImproveUser']:checked").val() + ',"birthday":"' + $("#txtBirthday").val() + '","country":"' + $("#dtCountry_ImproveUser").val() +
                '","city":"' + cityName + '","workOrStudy":"' + $("input[type=radio][name='workOrStudy']:checked").val() + '","schoolID":"' + $("#hidSchoolID").val()
                 + '","edu_xueli":"' + $("#selectXueLi").val() + '","edu_shcoolName":"' + $("#txtSchool").val() + '","companyName":"' + countryName + '"}',
        timeout: 5000,
        beforeSend: function() {
        },
        error: function() {

        },
        success: function(r) {
            if (r.d == "1") {
                temp_userOk_flag = "1";
                $(".xame_tishik").hide();
                $(".xame_xinxi").hide();
                $(".xame_over").show();
                $("#div_success_userinfo").show();
                if ($("#hidOpType").val() == "2" || $(".xame_xuanx").find("li").eq(0).is(":hidden")) {
                    $("#div_success_userinfo").find("p").eq(0).hide();
                    $(".xame_wsxx").hide();
                }
            }
        }
    });
}

function Hide_HeadImg() {
    $("#div_success_userinfo").hide();
    $(".xame_over").hide();

    $(".xame_xuanx").find("li").eq(0).hide();
    $(".xame_xuanx").find("li").eq(1).show();
    $(".xame_xuanx").find("li").eq(1).addClass("xame_xz");
    Change_HeadImg();
}

function Hide_UserInfo() {
    $("#div_success_userinfo").hide();
    $(".xame_over").hide();

    $(".xame_xuanx").find("li").eq(1).hide();
    $(".xame_xuanx").find("li").eq(0).show();
    $(".xame_xuanx").find("li").eq(0).addClass("xame_xz");
    Change_UserInfo();
}

function Change_UserInfo() {
    $(".xame_xuanx a").removeClass("xame_xz");
    $(".xame_xuanx").find("a").eq(0).addClass("xame_xz");

    $(".xame_tishik").find("p").eq(0).show();
    $(".xame_tishik").find("p").eq(1).hide();

    $("#iframeHeadImg").show();
    //$(".xame_xinxi").hide();
    if (temp_userOk_flag == "1") {
        $(".xame_over").hide();
        $("#div_success_userinfo").hide();
    } else {
        $(".xame_xinxi").hide();
    }
    if ($("#hidHeadImgIsOk").val() == "1") {
        $(".xame_tishik").hide();
    } else {
        $(".xame_tishik").show();
    }
}

function Change_HeadImg() {
    $(".xame_xuanx a").removeClass("xame_xz");
    $(".xame_xuanx").find("a").eq(1).addClass("xame_xz");

    $(".xame_tishik").find("p").eq(0).hide();
    $(".xame_tishik").find("p").eq(1).show();

    $("#iframeHeadImg").hide();
    //$(".xame_xinxi").show();
    if (temp_userOk_flag == "1") {
        $(".xame_over").show();
        $("#div_success_userinfo").show();
        $(".xame_tishik").hide();
    } else {
        $(".xame_xinxi").show();
        $(".xame_tishik").show();
    }
}


function CountryList() {
    var control_country_ImproveUser = function(PanliCountryList, countryPanel_selector, dtCountry_selector, fn) {

        //国家列表
        var InitialList = [];
        $.each(PanliCountryList, function(i, d) {
            if ($.inArray(d.Initial, InitialList) < 0) {
                InitialList.push(d.Initial);
            }
        });
        for (var i = 0; i < InitialList.length; i++) {
            for (var j = 0; j < InitialList.length - i - 1; j++) {
                if (InitialList[j] > InitialList[j + 1]) {
                    var temp = InitialList[j];
                    InitialList[j] = InitialList[j + 1];
                    InitialList[j + 1] = temp;
                }
            }
        }


        //国家选择层控件
        var countryPanel_ImproveUserInfo = $(countryPanel_selector);
        var areaPanel = $(countryPanel_selector + ' .zimu ul');
        var InitialPanel = $(countryPanel_selector + ' .gj_name ul');

        areaPanel.empty();
        //初始化字母标签项                                                          
        $.each(InitialList, function(i, d) {
            var t = $('<li><a class="' + (d == '中国大陆转送' ? "w90" : "w35") + '" href="#">' + d + '</a></li>').find('a').click(function() {
                InitialPanel.empty();
                //字母标签点击事件（生成国家面板）
                $.each(PanliCountryList, function(i, country) {
                    if (d == country.Initial) {
                        var tCountry = $('<li><a href="#">' + country.CountryName + '</a></li>').find('a').click(function() {
                            $(dtCountry_selector).val(country.CountryName.substring(0, 5));
                            if (fn) { fn(country.CountryName); }
                            //GetSendTypes(country.ShipCountryId);
                            countryPanel_ImproveUserInfo.animate({ "height": "0px", "width": "0px" }, 300, function() { countryPanel_ImproveUserInfo.hide().css({ "height": "auto", "width": "622px" }); });
                            $("#note_wrong_country").hide();
                            $("#note_right_country").show();
                            return false;
                        }).end();
                        InitialPanel.append(tCountry);
                    }
                });
                $('li', areaPanel).removeClass('c_on');
                $(this).parent('li').addClass('c_on');
                return false;
            }).end();
            if (d == '中国大陆转送')
                areaPanel.prepend(t);
            else
                areaPanel.append(t);
        });


        //插入默认常用国家区域
        var temp = $('<li><a class="w90" href="#">常见区域</a></li>').find('a').click(function() {
            InitialPanel.empty();
            $.each(PanliCountryList, function(i, country) {
                if (country.Status == 1) {
                    var t = $('<li class="c_on"><a href="#" title="' + country.CountryName + '">' + country.CountryName + '</a></li>').find('a').click(function(e) {
                        $(dtCountry_selector).val(country.CountryName.substring(0, 5));
                        if (fn) { fn(country.CountryName); }
                        //GetSendTypes(country.ShipCountryId);
                        countryPanel_ImproveUserInfo.animate({ "height": "0px", "width": "0px" }, 300, function() { countryPanel_ImproveUserInfo.hide().css({ "height": "auto", "width": "515px" }); });
                        //e.stopPropagation();
                        $("#note_wrong_country").hide();
                        $("#note_right_country").show();
                        return false;
                    }).end();
                    InitialPanel.append(t);
                }
            });
            $('li', areaPanel).removeClass('c_on');
            $(this).parent('li').addClass('c_on');
            return false;
        }).end();
        areaPanel.prepend(temp);
        //默认选中第一个标签
        $('li:eq(0) a', areaPanel).click();
        //点击国家展开层
        $(dtCountry_selector).click(function() {
            //$('#hometownCountry_panel,#countryPanel').hide();
            $('li:eq(0) a', areaPanel).click();
            countryPanel_ImproveUserInfo.css({ "height": "0px", "width": "0px" }).show().animate({ "height": "139px", "width": "515px" }, 500, function() { countryPanel_ImproveUserInfo.css("height", "auto"); });
            return false;
        });

        $(document).click(function() { countryPanel_ImproveUserInfo.hide(); });
        countryPanel_ImproveUserInfo.click(function() { return false; });
    }
    var list = CountryListJSON; //CountryListJSON; //<%=CountryListJSON %>;
    var courtryextensions = [{ "CountryName": "中国", "Initial": "T-Z", "Order": 101, "Status": 1, "ShipCountryId": 100 }, { "CountryName": "台湾", "Initial": "T-Z", "Order": 102, "Status": 1, "ShipCountryId": 101}];
    control_country_ImproveUser(list, '#countryPanel_ImproveUserInfo', '#dtCountry_ImproveUser', function() {
        var $this = $('#dtCountry_ImproveUser');
        if ($this.val() != "" && $this.attr('placeholder') != $this.val()) {
            $this.css('color', '#000');
            $this.parent().parent().find('td:last-child').show();
        }
    }); /*
    control_country_ImproveUser(courtryextensions.concat(list), '#hometownCountry_panel', '#hometownCountry', function(countryName) {
        if (countryName == "中国") {
            $("#hometownCity").hide();
            $('#hometown_select').show();
            //                        $('#province').val('1').change();                
            //                        if(countryName == "台湾")
            //                        {
            //                         $('#province').val('34').change(); 
            //                         }

        } else {
            $('#hometown_select').hide();
            $("#hometownCity").val('').show();

        }
        var $this = $('#hometownCountry');
        if ($this.val() != "" && $this.attr('placeholder') != $this.val()) {
            $this.css('color', '#000');
            $this.parent().parent().find('td:last-child').show();
        }
    });*/
}


function CodeLength(str) {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}

function NotAutoShowImproveUserInfoDiv() {
    $.ajax({
        type: "POST",
        async: false,
        url: "/App_Services/wsImproveUserInfo.asmx/ImproveUserInfoIsShow",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"isAuto":' + $("#chk_notAutoShowDiv").is(":checked") + '}',
        timeout: 5000,
        beforeSend: function() {
        },
        error: function() {

        },
        success: function(r) {

        }
    });
}

function LocationCloseDiv(url) {
    CloseDiv_ImproveUser();
    window.location.href = url;
}