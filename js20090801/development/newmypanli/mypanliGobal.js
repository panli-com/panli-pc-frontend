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


    var url = window.location.href;
    var reg = new RegExp("/\\w*\\.aspx.*=");
    var regu = new RegExp("/\\w*\\.aspx");
    if (url != null) {
        if ($(".left li a[href*='" + reg.exec(url) + "']").length > 0)
            $(".left li a[href*='" + reg.exec(url) + "']").parent("li").attr("class", "xz").append("<b></b>");
        else
            $(".left li a[href*='" + regu.exec(url) + "']").parent("li").attr("class", "xz").append("<b></b>");
    }
});        