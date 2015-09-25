    // JavaScript Documen

var remote_province = typeof remote_ip_info != undefined ? remote_ip_info.province : '';
remote_ip_info = typeof remote_ip_info != undefined ? remote_ip_info.country : '';

var provincestr = "中国大陆江浙沪皖";
if (remote_ip_info.indexOf("中国") >= 0) {
    remote_ip_info = "上海/浙江/江苏/安徽".indexOf(remote_province) >= 0 ? provincestr : "中国大陆其他省市";
}

countrylist(function (list) {
    for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].CountryName == remote_ip_info) {
            $('#sel_addr input').val(list[i].CountryName).attr('data-id', list[i].ShipCountryId);
            break;
        }
    };
    $('#sel_addr input').Country({ 'callback': function (id) { $('#sel_addr input').attr('data-id', id); } }); 
})
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/, '');
}

$(function () {
   
    mv.app.toCheck();
    //mv.app.toSel();
    mv.app.toCal();

    var url = location.href,
    indexs = url.indexOf('?');
    if (indexs >= 0) {
        var str = url.substr(indexs + 1);
        str = '{"' + str.replace(/&*$/, '').replace(/&/g, '","').replace(/=/g, '":"') + '"}';
        strobj = eval('(' + str + ')');
        if (!isNaN(strobj.p) && !isNaN(strobj.w) && strobj.c) {
            $('input[name=cost]').val(strobj.p);
            $('input[name=weight]').val(strobj.w);
            $('#aaa ul li').each(function (i, t) {
                if ($.trim($(t).text()) ==decodeURIComponent(strobj.c)) {
                    $('input[name=address]').val($(t).text()).attr('data-id',$(t).attr('data-id'));
                }
            });
            $('#btn').click();
        }
    }
});


var mv = {}; //命名空间
mv.tools = {};

// 获取某区域内的某个类名为的元素，并返回；
mv.tools.getByClass = function (oParent, sClass) {
    var aEle = oParent.getElementsByTagName('*');
    var arr = [];

    for (var i = 0; i < aEle.length; i++) {
        if (aEle[i].className.indexOf(sClass) >= 0) {
            //if(aEle[i].className.indexOf(sClass)>=0){
            arr.push(aEle[i]);
        }
    }
    return arr;
};


mv.ui = {};


mv.app = {};

//重量参考页
mv.app.toCheck = function () {

    //var oSel = document.getElementById('est_li3');
    var aDiv = document.getElementById('weight_id');
    var aTips = document.getElementById('show_tips_a');

    //点击参考页出现，点击别处隐藏	  
    aTips.onmouseover = function (ev) {
        var This = this;
        var ev = ev || window.event;   //阻止冒泡
        This.className = 'show_tips_active'; //改变样式
        This.onmouseout = function () { //点击屏幕别处时，菜单隐藏
            This.className = 'show_tips'; //回复样式
        };
        ev.cancelBubble = true;  //阻止冒泡
    }



}


var urlarr = [["dhl", "ems", "air", "敏感商品", "panli专线", "大陆", "自提"], ["dhl.gif", "ems.gif", "air.gif", "mgsp.gif", "panli_zx.gif", "guonei.gif", "ztzx.gif"]];
var getPicUrl = function (s) {
    var url = "http://sf.panli.com/FrontEnd/images20090801/Tools/Estimates/";
    var oldName = s;
    s = s.toLowerCase();
    for (var i = 0, len = urlarr[0].length; i < len; i++) {
        if (s.indexOf('ems') >= 0 && s.indexOf('经济型')>=0) {
            return 'EMS(经济型)';
        }
        if (s.indexOf('ems普通') >= 0) {
            return 'EMS普通';
        }
        if (s.indexOf(urlarr[0][i]) >= 0) {
            return "<img src=" + url + urlarr[1][i] + " alt=" + oldName + " />";
        }
    }
    return oldName;
};  //根据名称获取相应图标
//提交按钮方法

//开始计算
mv.app.toCal = function () {

    var cCal = document.getElementById('est_mesg');
    var cLi = mv.tools.getByClass(cCal, 'est_li');  // 
    var oD = mv.tools.getByClass(cCal, 'est_li_all');        //填写信息4个div部分
    var oDivTable = document.getElementById('est_res');         //表格外的div
    var oTable = mv.tools.getByClass(oDivTable, 'est_list')[0]; //整个表格
    var aTbody = mv.tools.getByClass(oDivTable, 'res_list')[0]; //表格主体1
    // var bTbody = mv.tools.getByClass(oDivTable, 'res_list_blank')[0]; //表格主体2
    //var oTr = mv.tools.getByClass(oDivTable, 'none')[0];        //列表空白页
    var kuang = document.getElementById('kuang');


    for (var i = 0, len = oD.length; i < len; i++) {
        if (i != 0) {
            var inputs = oD[i].getElementsByTagName('input')[0];
            inputs.title = i;
            inputs.onfocus = function () {
                oD[this.title].className = oD[this.title].className.replace('est_errors', '').trim();
            }
        } else {
            var inputs = oD[i].getElementsByTagName('input');
            for (var j = 0, lens = inputs.length; j < lens; j++) {
                inputs[j].title = i;


                inputs[j].onchange = function () {
                    this.value.trim() == 2 ? $(kuang).val(0).css('color', '#666').attr('readonly', 'readonly').parent().css('backgroundColor', '#ddd') : $(kuang).css('color', '#000').val('').removeAttr('readonly').parent().css('backgroundColor', '#fff');
                    oD[this.title].className = oD[this.title].className.replace('est_errors', '').trim();

                };
            }
        }
    }
    var save = {};
    //鼠标点击按钮后
    var ul = document.getElementById('res_ul').getElementsByTagName('li');

    $('.kuang').keyup(function (e) {
        if (e.keyCode == 13) {
            $('#btn').click();
            return false;
        }
    })

    document.getElementById('btn').onclick = function () {
        var bodytop = $('body').scrollTop(),
            est_maintop = $('.est_main').offset().top;
        if (bodytop < est_maintop) {
            $('body').animate({ 'scrollTop': est_maintop + 'px' }, 500);
        }
        var is = true,
            valObj = {};

        for (var i = 0, len = oD.length; i < len; i++) {
            var dom = oD[i];
            dom.className = 'est_li_all';

            if (i == 0) {
                var input = dom.getElementsByTagName('input'),  //判断radio部分
                    isCheck = false;
                for (var j = 0, lens = input.length; j < lens; j++) {
                    if (input[j].checked) {
                        isCheck = true;
                        valObj.check = input[j].value;
                    };
                }
                if (!isCheck) {
                    is = false;
                    dom.className += ' est_errors';
                }

            } else if (i == 1) {                       //判断第二个框
                var input = dom.getElementsByTagName('input')[0],
                    val = input.value.trim();
                if (/^\d+(\.\d+)?$/.test(val)) {                //匹配有效数字
                    valObj.price = parseFloat(val).toFixed(2); //保留2位并显示
                } else {
                    dom.className += ' est_errors';
                    is = false;
                }

            } else if (i == 2) {                       //判断第三个框
                var input = dom.getElementsByTagName('input')[0],
                     val = input.value.trim();
                if (/^\d+(\.\d+)?$/.test(val)) {                //匹配有效数字
                    val = input.value = Math.ceil(val);        //向下取整并显示
                    valObj.weight = val;
                } else {
                    dom.className += ' est_errors';
                    is = false;
                }
            } else {                                              //判断第四个框
                var input = dom.getElementsByTagName('input')[0],
                    val = input.value.trim();
                if (val == '') {
                    dom.className += ' est_errors';
                    is = false;
                } else {
                    valObj.area = input.getAttribute('data-id');
                }
            }

        }
        if (!is) return false;
        


        //如果已经有相同请求数据直接调用
        if (save[valObj.area]
            && save[valObj.area][valObj.weight]
            && save[valObj.area][valObj.weight][valObj.price]
            && save[valObj.area][valObj.weight][valObj.price][valObj.check]) {

            var saveHtml = save[valObj.area][valObj.weight][valObj.price][valObj.check];
            $(aTbody).html(saveHtml);
            ul[1].style.display = saveHtml.indexOf('自提') >= 0 ? 'block' : 'none';
            ul[2].style.display = saveHtml.indexOf('大陆') >= 0 ? 'none' : 'block';
            return false;
        }
        document.getElementById('res_ul').style.display = 'none';
        oDivTable.className = 'res_list_hide';

        //加载背景
        //oTr.className = 'loading';
        var bTbody = mv.tools.getByClass(oDivTable, 'res_list_blank')[0] || mv.tools.getByClass(oDivTable, 'loading')[0];
        $.ajax({
            type: "POST",
            url: "/App_Services/wsEstimates.asmx/GetFeight",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"weight":"' + valObj.weight + '","aid":"' + valObj.area + '","price" : "' + valObj.price + '","type":"' + valObj.check + '"}',
            timeout: 10000,
            beforeSend: function () { bTbody.className = 'loading'; },
            complete: function () { oDivTable.className = ''; },
            error: function () {
                alert('网络错误,请稍后重试。');
            },
            success: function (res) {
                var data = eval('(' + res.d + ')'),
                    html = '';
                data = data['l'];
                var isZT = false, isDL = false;
                for (var i = 0, len = data.length; i < len; i++) {
                    var m = parseFloat(data[i].m),
                        e = parseFloat(data[i].e);
                    var temp_serviceCost = parseFloat(data[i].s);
                    if (data[i].n.indexOf('自提') >= 0) { isZT = true };
                    if (data[i].n.indexOf('大陆') >= 0) { isDL = true }
                    var totalPrice = e + m + parseFloat(valObj.price) + temp_serviceCost;

                    html += !mv.isDateture || data[i].n.indexOf('自提') >= 0 ? '<tr><td>' + getPicUrl(data[i].n) + '</td><td>' + valObj.price + '</td><td>' + m.toFixed(2) + '</td><td>' + e.toFixed(2) + '</td><td>' + temp_serviceCost.toFixed(2) + '</td><td class="a">' + totalPrice.toFixed(2) + '</td><td>' + (data[i].d.trim() == '' ? '未知' : data[i].d) + '个工作日</td></tr>' :
                                           '<tr><td>' + getPicUrl(data[i].n) + '</td><td>' + valObj.price + '</td><td>' + m.toFixed(2) + '</td><td>' + e.toFixed(2) + '</td><td><span class="phonePrice" title="使用App购买商品，并提交运单">0.00</span><span class="pcPrice" title="使用网页版购买商品，并提交运单">' + temp_serviceCost.toFixed(2) + '</span></td><td class="a"><span class="phonePrice"  title="使用App购买商品，并提交运单">' + (totalPrice - temp_serviceCost).toFixed(2) + '</span><span class="pcPrice" title="使用网页版购买商品，并提交运单">' + totalPrice.toFixed(2) + '</span></td><td>' + (data[i].d.trim() == '' ? '未知' : data[i].d) + '个工作日</td></tr>';
                };
                $(aTbody).html(html);
                ul[1].style.display = isZT ? 'block' : 'none';
                ul[2].style.display = isDL ? 'none' : 'block';

                document.getElementById('res_ul').style.display = 'block';
                //保存数据
                save[valObj.area] ? '' : save[valObj.area] = {};
                save[valObj.area][valObj.weight] ? '' : save[valObj.area][valObj.weight] = {};
                save[valObj.area][valObj.weight][valObj.price] ? '' : save[valObj.area][valObj.weight][valObj.price] = {};
                save[valObj.area][valObj.weight][valObj.price][valObj.check] = html;
            }
        });

        return false;

    }









}