$(function() {
    //给栗方法
    var geili = $('a[geili]');
    geili.click(function() {
        var gelivibleBtn = $(this);
        var divshow = gelivibleBtn.next().find("div");
        var cid = gelivibleBtn.attr("geili");
        var geilirenshu = parseInt(gelivibleBtn.attr("geilirenshu"));
        $.ajax({
            type: "POST",
            url: "/App_Services/wsCowry.asmx/AddWellNumber",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{\"id\":" + cid + "}",
            timeout: 10000,
            error: function() { alert("网络错误，请稍后重试。"); },
            success: function(res) {

                var now = new Date();
                if (res.d == "Success") {
                    divshow.find("p").hide();
                    divshow.show();
                    //window.Panli.Message.show('给栗成功！');
                    //给力加1
                    //$('#gelivibleBtn span').text(parseInt($('#gelivibleBtn span').text()) + 1);
                    gelivibleBtn.parent().find("a.favcount").html(geilirenshu + 1);
                    divshow.find("p:eq(0)").show();

                    divshow.fadeOut(8000);
                }
                else if (res.d == "noLogin") {
                    window.Panli.Login();

                }
                else if (res.d == "Oneself") {
                    alert('不能给栗自己的宝贝！');

                }
                else if (res.d == "Welled") {
                    //alert('这个商品你已经给栗过了！');
                    divshow.find("p").hide();
                    divshow.show();
                    divshow.find("p:eq(1)").show();

                    divshow.fadeOut(8000);

                }
                else if (res.d == "Limit") {
                    alert('你今天给栗次数到上限了！');
                }
                else if (res.d == "NotFoundShare") {
                    alert('没有找到要给力的宝贝！');
                }
                else if (res.d == "Error") {
                    alert('系统错误！');
                }
            }
        });
    });
});