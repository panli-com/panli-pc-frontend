function changeStyle(style) {
    $.ajax({
        type: "POST",
        url: "/App_Services/wsNewMyPanli.asmx/ChangeStyle",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: "{style:'" + style + "'}",
        timeout: 10000,
        error: function() { },
        success: function(res) { }
    });
    document.getElementById("styleName").href = "http://sf.panli.com/FrontEnd/css20090801/newmypanli/" + style + "/color.css";
}

$(document).ready(function() {
    var ulScroll = $("#affiche");
    if (ulScroll.length > 0) {
        ulScroll.append($("#affiche li").clone());
        var ulH = $("#affiche li:eq(0)").height();
        var step = 1;
        var s = function() {
            var t = ulScroll.scrollTop();
            ulScroll.scrollTop((t >= ulH * ($("#affiche li").length - 1) ? 0 : t) + step);
            if (t % ulH == 0) {
                step = 0; setTimeout(function() { step = 1; }, 2000);
            }
        }
        var timeid = setInterval(s, 100);
        ulScroll.hover(function() { clearInterval(timeid); }, function() { timeid = setInterval(s, 100); });
    }
});        