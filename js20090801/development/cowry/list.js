$(function () {
    //显示大图逻辑
    var $img = $('<div class="windows" style="display:none;"><div class="jiantou"></div><div class="white"><a target="new" href="#"><img src="" alt="产品名称" /></a></div><p><a class="pName" target="new" href="#"></a></p></div>');
    $('body').append($img);
    $img.hover(function () { $img.show(); }, function () { $img.hide(); });
    $('.CowryImg').hover(
            function () {
                if ($.trim($(this).attr('src')) == 'http://sf.panli.com/FrontEnd/images20090801/noimg/noimg80.gif')
                    return;
                $('img', $img).attr({ src: $(this).attr('Limg'), alt: $(this).attr('alt') });
                $('a', $img).attr('href', $(this).parent("a").attr('href'));
                $img.css({ top: $(this).offset().top, left: $(this).offset().left + 75 }).show();
            },
            function () {
                $img.hide();
            });

    //搜索结果字符标红
    $('.cowryName').each(function (i, d) {
        $(d).html($(d).text().replace($('#cowrySearchKey').val(), '<font color="#f00">' + $('#cowrySearchKey').val() + '</font>'));
    });

    //搜索按钮点击
    $('#searchBtn').click(function () {
        if ($('#cowrySearchKey').hasClass('grey')) {
            window.location = '/Cowry/List.aspx';
            return false;
        }
        if ($.trim($('#cowrySearchKey').val()).length <= 0) {
            window.location = '/Cowry/List.aspx';
            return false;
        }
        window.location = '/Cowry/List.aspx?k=' + encodeURI($.trim($('#cowrySearchKey').val()));
        return false;
    });
    //搜索框回车事件
    $('#cowrySearchKey')
    .focus(function () {
        if ($('#cowrySearchKey').hasClass('grey'))
            $('#cowrySearchKey').removeClass('grey').val('');
    })
    .blur(function () {
        var k = $.trim($('#cowrySearchKey').val());
        if (k.length <= 0 || k == '') {
            $('#cowrySearchKey').addClass('grey').val('请输入关键字');
        }
    })
    .keydown(function (e) {
        if (e.keyCode == 13) {
            $('#searchBtn').click();
            return false;
        }
    });
    //    $(document).mouseup(function() {
    //        $('#orderbyList,#cowrysort').hide();

    //    });
});
function geilivible(id, dom) {
    $.ajax({
        type: "POST",
        url: "/App_Services/wsCowry.asmx/AddWellNumber",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: "{\"id\":" + id + "}",
        timeout: 10000,
        error: function() { alert("网络错误，请稍后重试。"); },
        success: function(res) {
            var now = new Date();
            if (res.d == "Success") {
                window.Panli.Message.show('给栗成功！');
                $('span', $(dom)).text(parseInt($('span', $(dom)).text()) + 1);
                return;
            }
            if (res.d == "noLogin") {
                window.Panli.Login();
            }
            if (res.d == "Oneself") {
                alert('不能给栗自己的宝贝！');
            }
            if (res.d == "Welled") {
                alert('这个商品你已经给栗过了！');
            }
            if (res.d == "Limit") {
                alert('你今天给栗次数到上限了！');
            }
            if (res.d == "NotFoundShare") {
                alert('没有找到要给力的宝贝！');
            }
            if (res.d == "Error") {
                alert('系统错误！');
            }
        }
    });
}
                                        
                                        
                                         