var divhtmldecode = $('<div></div>');
String.prototype.replaces = function (oldrel, newrel) {
    if (newrel == null || newrel == 'undefined') newrel = '';
    if (oldrel == null || oldrel == 'undefined') oldrel = '(\\\w*)';
    var rel = new RegExp('{{' + oldrel + '}}', 'g');
    return this.replace(rel, newrel);
};
htmlDecode = function (str) {
    divhtmldecode.html(str);
    return divhtmldecode.text();
};
htmlEncode = function (str) {
    divhtmldecode.text(str);
    return divhtmldecode.html();
};
var ArrangeStr = ['Receiver', 'Country', 'ZipCode', 'City', 'Phone', 'Address'], //根据表单的排列顺序排列, 'Operation'
    Common = {//常见的字符串
        star: '<p class="red">*</p>',
        input: '<input type="text" maxlength="28" value="{{value}}" data-value="{{value}}"/>',
        operation: ['<li><a href="javascript:;" onclick="Country.SetDefault(this);">设置为常用收货地址</a></li>',
                    '<li><a href="javascript:;" class="z_x">常用收货地址</a></li>',
                    '<li><a href="javascript:;" onclick="Country.AmendAddress(this,true);">编辑</a></li><li><a href="javascript:;" onclick="Country.Delete(this);">删除</a></li>',
                    '<li><a onclick="Country.Modify(this);" href="javascript:;">确认添加</a></li>',
                    '<li><a href="javascript:;" onclick="Country.Modify(this);">提交修改</a></li><li><a href="javascript:;" onclick="Country.AmendAddress(this,false);">取消</a></li>'
        ],
        inError: ['请输入姓名', '请选择国家或地区', '请输入邮编', '请输入城市', '请输入联系电话', '请输入详细地址']
    };
var Country = {
    Data: [],
    CountryOnId: 0, //表示默认地址id
    Init: function () {
        var _this = this;
        $.getJSON("/App_Scripts/JSData/UserAddress.ashx?r=" + new Date(), function (data) {
            var dPanel = '',
                datalList = data,
                newData = [];
            _this.CountryOnId = defaultindex;
            for (var i = 0, len = datalList.length; i < len; i++) {//分类并保存数据data
                newData[i] = _this.Arrange([//排序后并保存
                    datalList[i].Consignee,
                    datalList[i].CountryName,
                    datalList[i].Postcode,
                    datalList[i].CityName,
                    datalList[i].Telephone,
                    datalList[i].Address
                ], { ID: datalList[i].ID });
                var tCreateDom = _this.CreateDom(newData[i], false); //生成html字符串
                dPanel = _this.CountryOnId == datalList[i].ID ? tCreateDom + dPanel : dPanel + tCreateDom; //如果是默认地址位置放第一
            };
            _this.Data = newData; //保存数据
            $("#ListPanel").html(dPanel + _this.CreateDom({}, true, true)).find('*[data-country=true]').Country(); //把html放进ListPanel
        });
        //给input绑定事件
        $('.address input[type=text]').live('focus', function () { _this.InputFocus(this); });
    },
    //模版内容
    Dom: '<div class="address {{pitchOn}}" data-id="{{id}}"><div class="box"><table>'
        + '<tr><td class="z">收 货 人 :</td><td class="c">{{' + ArrangeStr[0] + '}}</td><td class="z"></td><td class="c"></td></tr>'
        + '<tr><td class="z">所在国家或地区 :</td><td class="c"><div>{{' + ArrangeStr[1] + '}}</div></td>'
            + '<td class="z">邮政编码 :</td><td class="c">{{' + ArrangeStr[2] + '}}</td></tr>'
        + '<tr><td class="z">所在城市 :</td><td class="c">{{' + ArrangeStr[3] + '}}</td>'
            + '<td class="z">电话号码 :</td><td class="c">{{' + ArrangeStr[4] + '}}</td></tr>'
        + '<tr><td class="z">详细地址 :</td><td colspan="3">{{' + ArrangeStr[5] + '}}</td></tr></table>'
        + '<div class="chaozuo"><ul>{{Operation}}</ul></div></div></div>',
    QueryId: function (id) {//传如id查询对应id的数据位置
        var data = this.Data;
        if (data.length == 0) return '';
        for (var i = 0, len = data.length; i < len; i++)
            if (data[i].ID == id) return i;
        return '';
    },
    //增加地址内容
    CreateDom: function (data, isInput, isOn) {//第一个表示传来的数据,第二表示是否已表单显示，第三（增加外框的class）
        var Arr = ArrangeStr,
            Domhtml = this.Dom,
            Input = this.Input,
            operation = Common.operation,
            sClass = '';
        sClass = data.ID == this.CountryOnId ? 's1' : isOn ? 's2' : '';
        Domhtml = Domhtml.replaces('pitchOn', sClass);
        for (var i = 0, len = Arr.length; i < len; i++) {
            var newdata = data[Arr[i]];
            if (!newdata) newdata = '';
            if (isInput && Input[i]) {
                newdata = Input[i].replaces('value', newdata);
            }
            Domhtml = Domhtml.replaces(Arr[i], newdata);
        };
        var Operation = operation[0] + operation[2]; //表示默认操作按钮
        if (data.ID) {
            Domhtml = Domhtml.replaces('id', data.ID);
            if (data.ID == this.CountryOnId) Operation = operation[1] + operation[2]; //表示默认地址操作按钮
            if (isInput) Operation = operation[4]; //表示修改操作按钮
        } else {
            Operation = operation[3]; //表示最下面的操作按钮
        }
        Domhtml = Domhtml.replaces('Operation', Operation).replaces();
        return Domhtml;
    },
    //输入框
    Input: [//按照arrangeStr的顺序排列
         Common.input + Common.star,
        '<input type="text" data-country="true" readonly="true"  value="{{value}}" data-value="{{value}}"/>' + Common.star,
        '<input type="text" maxlength="20"  value="{{value}}" data-value="{{value}}"/>' + Common.star,
         Common.input + Common.star,
         Common.input + Common.star,
        '<input type="text" maxlength="86" value="{{value}}" data-value="{{value}}"/>' + Common.star
    ],
    InputFocus: function (t) {
        var $t = $(t),
            $p = $t.nextAll('p.red');
        if ($p.length > 0) {
            var phtml = $t.parents('.address').attr('data-id');
            $p.html('*'); //phtml ? '' :
        }
        return false;
    },
    //根据Arr的内容与ArrangeStr顺序 创建新的对象并合并Obj  并输出
    Arrange: function (Arr, Obj) {
        var oldArr = ArrangeStr,
            newArr = {};
        for (var i = 0, len = oldArr.length; i < len; i++) {
            if (!Arr[i]) Arr[i] = '';
            newArr[oldArr[i]] = Arr[i];
        };
        if (Obj) jQuery.extend(newArr, Obj);
        return newArr;
    },
    //删除地址内容
    Delete: function (t) {
        if (!confirm("您确定要删除这个地址吗?")) {
            return;
        };
        var $address = $(t).parents('.address'),
            id = $address.attr('data-id'),
            _this = this;
        $.ajax({
            type: "POST",
            url: "/App_Services/wsUserAddress.asmx/DelAddress",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{id:" + id + "}",
            timeout: 8000,
            error: function () { alert("error"); },
            success: function (r) {
                if (r.d == "success") {
                    $address.animate({ height: '0px' }, 300, function () {
                        $address.remove();
                        _this.Data.splice(_this.QueryId(id), 1); //删除保存数据
                    });
                } else {
                    alert("删除失败！");
                }
            }
        });
    },
    //修改地址内容
    AmendAddress: function (t, boo) {
        var $address = $(t).parents('.address'),
            id = $address.attr('data-id');
        var html = this.CreateDom(this.Data[this.QueryId(id)], boo, boo);
        $address.replaceWith(html);
        $('.address[data-id=' + id + ']').find("*[data-country=true]").Country();
        return false;
    },
    //设置默认地址
    SetDefault: function (t) {
        var $address = $(t).parents('.address'),
            operation = Common.operation,
            id = $address.attr('data-id');
        $.ajax({
            type: "POST",
            url: "/App_Services/wsUserAddress.asmx/SetDefaultAddress",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"id":' + id + '}',
            timeout: 8000,
            error: function () { alert("网络错误请稍后再试"); },
            success: function (r) {
                switch (r.d) {
                    case "success":
                        $address.siblings('.s1').removeClass('s1').find('.chaozuo ul').html(operation[0] + operation[2]);
                        $address.addClass('s1').find('.chaozuo ul').html(operation[1] + operation[2]);
                        break;
                    case "fail":
                        alert("失败");
                        break;
                    case "noLogin":
                        alert("没有登录");
                        break
                    default:
                        break;
                }
            }
        });
    },
    //设置增加地址内容
    ReplaceAdd: function ($t, addId) {
        var id = $t.attr('data-id'),
            newid = id ? id : addId;
        var html = this.CreateDom(this.Data[this.QueryId(newid)], false, this.CountryOnId == newid); //生成html
        if (id)//是添加还是修改
            $t.replaceWith(html).find('*[data-country=true]').Country(); //修改
        else {//添加
            var $h = $(html).css('height', '0px');
            $t.before($h);
            $h.animate({ height: '182px' }, 300, function () {
                $t.css('height', 'auto');
            });
        }
    },
    //验证国家名称是否合法
    TestCountry: function (name) {
        var Countrynames = PanliCountryList;
        for (var i = 0, len = Countrynames.length; i < len; i++) {
            if (Countrynames[i].CountryName == name)
                return true;
        };
        alert('国家名称无效,请重新选择!');
        return false;
    },
    //增加与修改验证
    Modify: function (t) {
        var _this = this,
            $address = $(t).parents('.address'),
            $input = $address.find('input[type=text]'),
            addressArr = [],
            isChange = false;
        //获取表单里面的内容
        for (var i = 0, len = $input.length; i < len; i++) {
            var $inputi = $.trim($input[i].value);
            if ($inputi == '') {//如果表单信息为空 显示错误信息
                if ($input.eq(i).nextAll('p')) {//检查表单后面是否有p元素
                    $input.eq(i).nextAll('p').html(Common.inError[i]);
                } else {
                    $input.eq(i).after('<p class="red">' + Common.inError[i] + '</p>');
                }
                return false;
            }
            addressArr[i] = htmlDecode($inputi);
            //是否改变元素
            if ($inputi != $.trim($input.eq(i).attr('data-value'))) isChange = true;
        };
        if (!isChange) {//修改地址没发生变化时执行
            this.ReplaceAdd($address);
            return false;
        }
        //如果没有id则id=0
        var id = $address.attr('data-id');
        id = id ? id : 0;
        addressArr = this.Arrange(addressArr); //排序
        //验证是否超过10条地址
        if ($address.siblings('.address[data-id]').length >= 10 && id == 0) {
            alert("您的地址簿最多只能记录10个收货地址");
            return false;
        }
        //验证填写国家是否符合
        if (!this.TestCountry(addressArr.Country)) return false;
        $.ajax({
            type: "POST",
            url: "/App_Services/wsUserAddress.asmx/AddAddress",
            data: '{id:' + id + ',consignee:"' + addressArr.Receiver.replace(/'/g, "\\'").replace(/"/g, "\\\"") + '",country:"' + addressArr.Country.replace(/'/g, "\\'").replace(/"/g, "\\\"") + '",city:"' + addressArr.City.replace(/'/g, "\\'").replace(/"/g, "\\\"") + '",address:"' + addressArr.Address.replace(/'/g, "\\'").replace(/"/g, "\\\"") + '",teltphone:"' + addressArr.Phone.replace(/'/g, "\\'").replace(/"/g, "\\\"") + '",zip:"' + addressArr.ZipCode.replace(/'/g, "\\'").replace(/"/g, "\\\"") + '"}',
            dataType: "json",
            contentType: "application/json;utf-8",
            timeout: 6000,
            error: function () { return false; },
            success: function (data) {
                if (data.d > 0 && id == 0) {
                    addressArr['ID'] = data.d;
                    _this.Data.push(addressArr);
                    $address.find('input[type=text]').val('');
                } else
                    jQuery.extend(_this.Data[_this.QueryId(id)], addressArr);
                if (data) _this.ReplaceAdd($address, addressArr['ID']);
            }
        })
    }

}
$(function () {
    countrylist(function (list) { PanliCountryList = list; Country.Init(); })
});