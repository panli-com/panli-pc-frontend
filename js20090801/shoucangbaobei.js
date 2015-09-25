//添加收藏方法
$(function() {
    var ashoucang = $('a[shoucangbaobei]');

    ashoucang.click(function() {
        var AddFavorite = $(this);
        var renshu = parseInt($(this).attr("renshu"));
        var divshow = AddFavorite.parent().next().find("div");
        var cid = AddFavorite.attr("shoucangbaobei");

        $.ajax({
            type: "POST",
            url: "/App_Services/wsCowry.asmx/AddFavorite",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{\"cowryId\":" + cid + "}",
            timeout: 10000,
            beforeSend: function() { AddFavorite.attr("disable", "disable"); },
            complete: function() { AddFavorite.removeAttr("disable"); },
            error: function() { alert("网络错误，请稍后重试。"); },
            success: function(res) {

            if (res.d == "success") {
                    AddFavorite.next("span").html(renshu+1);
                    divshow.find("p").hide();
                    divshow.show();
                    divshow.find("p:eq(0)").show();
                    divshow.fadeOut(8000);
                }
                else if (res.d == "collected") {
                    divshow.find("p").hide();
                    divshow.show();
                    divshow.find("p:eq(1)").show();
                    divshow.fadeOut(8000);
                }
                else if (res.d == "fail") {
                    alert('添加收藏失败！');
                }
                else if (res.d == "noLogin") {
                    window.Panli.Login();
                }

            }
        });
    });
});
