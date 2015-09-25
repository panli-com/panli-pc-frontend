function pageInit() {
    if (typeof document.body.style.maxHeight == "undefined") {
        var divY = (getViewportHeight() - $(".dialog").outerHeight()) / 2;
        $(".dialog").css("top", (divY + document.documentElement.scrollTop).toString());
        $(window).scroll(function() { $(".dialog").css("top", divY + document.documentElement.scrollTop + ""); });
    }

    for (var i = 0; i < pageDatasource.length; i++) {
        pageDatasource[i].mPrice = Math.floor(pageDatasource[i].mPrice);
        if ($("#fpPrice" + pageDatasource[i].mPrice).length <= 0) {
            $("#presentList").prepend("<ul id='fpPrice" + pageDatasource[i].mPrice + "'></ul>");
            $("#presentList").prepend("<div class='sort'><h2><img src='/images20090801/present/" + pageDatasource[i].mPrice + ".gif' alt='满" + pageDatasource[i].mPrice + "就送' /></h2></div>");
        }
        if (pageDatasource[i].nNum <= 0)
            $("#fpPrice" + pageDatasource[i].mPrice).append('<li><div class="pic"><div class="wan">&nbsp;</div><a onclick="showInfo(' + i + ')"><img src="http://img.panli.com/CMS/freeproduct/' + pageDatasource[i].nFreeProID + '/cover/bImg/' + pageDatasource[i].nFreeProID + '.jpg" /></a></div><h1><a onclick="showInfo(' + i + ')">' + pageDatasource[i].szProductName + '</a></h1><dl><dt>剩余量：<span>已送完</span></dt><dd>重量：<span>' + pageDatasource[i].nProWeight + 'g</span></dd><dd>所需积分：<span>' + pageDatasource[i].mPrice + '</span></dd></dl></li>');
        else
            $("#fpPrice" + pageDatasource[i].mPrice).append('<li><div class="pic"><a onclick="showInfo(' + i + ')"><img src="http://img.panli.com/CMS/freeproduct/' + pageDatasource[i].nFreeProID + '/cover/bImg/' + pageDatasource[i].nFreeProID + '.jpg" /></a></div><h1><a onclick="showInfo(' + i + ')">' + pageDatasource[i].szProductName + '</a></h1><dl><dt>剩余量：<span>还有货</span></dt><dd>重量：<span>' + pageDatasource[i].nProWeight + 'g</span></dd><dd>所需积分：<span>' + pageDatasource[i].mPrice + '</span></dd></dl></li>');
    }
}

function showInfo(index) {
    $("#fpImg").attr("src", "http://img.panli.com/CMS/freeproduct/" + pageDatasource[index].nFreeProID + "/cover/vbImg/" + pageDatasource[index].nFreeProID + ".jpg").attr("alt", pageDatasource[index].szProductName);
    $("#fpTitle").text(pageDatasource[index].szProductName);

    $("#fpPrice").text(pageDatasource[index].mPrice + "分");

    if (pageDatasource[index].nNum > 0) {
        $("#fpNum").text("还有货");
    }
    else
        $("#fpNum").text("已送完");
    $("#fpWeight").text(pageDatasource[index].nProWeight + "g");
    $("#fpContent").text(pageDatasource[index].szContent);
    $(".addpanel_overlay").height($(document).height()).show();
    $(".dialog").show();
}


function closeFpInfo() { $(".dialog").hide(); $(".addpanel_overlay").hide(); }
$(document).ready(function() { pageInit() });