$(function() {
    $(".v_xuanz select").val($("#hidSearchDateCondition").val());
    $(".v_xuanz select").change(function() {
        window.location.href = "/mypanli/vip/growthinfo.aspx?d=" + $(".v_xuanz select").val();
    });

    var temp_i = 0;
    $(".v_biao table tr").each(function() {
        if (temp_i % 2 == 1) {
            $(this).addClass("hui");
        }
        temp_i++;
    });
});