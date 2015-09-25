$(function() {
    $('#a_shop,#div_shop').hover(function() { $('#a_shop').parent().addClass('von'); $('#div_shop').show(); }, function() { $('#a_shop').parent().removeClass('von'); $('#div_shop').hide(); });

    $('.myviptable table tr').hover(
        function() {
            $(this).addClass("vb");
        },
        function() {
            $(this).removeClass("vb");
        }
    );

});

function DeleteShop(shopID) {
    if (confirm("是否取消设置该心仪店铺")) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsVIP.asmx/DeleteShop",
            cache: false,
            dataType: "json",
            contentType: "application/json;utf-8",
            data: '{"shopID":' + shopID + '}',
            timeout: 15000,
            error: function() { alert("网络错误请重新再试"); },
            success: function(r) {
                if (r.d == "0") {
                    window.location.href = window.location.href;
                }
                else if (r.d == "1") {
                    alert(" 3个月之内不能删除");
                }
                else {
                    alert("网络错误请重新再试");
                }
            }
        });
    }
}