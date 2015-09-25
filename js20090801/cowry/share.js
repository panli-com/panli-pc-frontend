
$(function() {
    var allfenxiang = $("div[fenxiang],ul[fenxiang]");
    allfenxiang.find("a").click(function() {
        var ahtml = $.trim($(this).html());
        var thisfenxiang = $(this).parents("div[fenxiang],ul[fenxiang]", $(this));
        var proid = thisfenxiang.attr("proid");
        var proName = thisfenxiang.attr("proName");
        var proImage = thisfenxiang.attr("proImage");
        var userName = thisfenxiang.attr("userName");
        if (ahtml == "新浪微博") {
            shares('3', '1', proid, proName, proImage, userName);
        } else if (ahtml == "QQ") {
            shares('4', '1', proid, proName, proImage, userName);
        } else if (ahtml == "msn") {
            shares('5', '1', proid, proName, proImage, userName);
        } else if (ahtml == "Twitter") {
            shares('2', '1', proid, proName, proImage, userName);
        } else if (ahtml == "Facebook") {
            shares('1', '1', proid, proName, proImage, userName);
        } else if (ahtml == "人人") {
            shares('6', '1', proid, proName, proImage, userName);
        } else if (ahtml == "开心") {
            shares('7', '1', proid, proName, proImage, userName);
        } else if (ahtml == "Email") {
            shares('8', '1', proid, proName, proImage, userName);
        }
    });
});

function shares(sharePlatform, panliModel, proid, proName, proImage, userName) {
    $.ajax({
        type: "POST",
        url: "/App_Services/wsShare.asmx/AddTreasureShare",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: "{proid:" + proid + ",sharePlatform:" + sharePlatform + ",panliModel:" + panliModel + "}",
        timeout: 2000,
        success: function(re) {
            share.ShareLink(sharePlatform, re.d, proImage, proName, userName);
        }
    });
}

function senderemail() {
    var txtreceive = document.getElementById("txtreceive").value;
    var error = "";
    if (txtreceive == "") {
        $("#divemailerror").html("请至少输入一个邮箱");
        error = "请至少输入一个邮箱";
    }
    else {
        var regemail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        var spli = txtreceive.split(",");
        var splilength = spli.length;
        for (var i = 0; i < splilength; i++) {
            var el = spli[i];
            if (!regemail.test(el)) {
                $("#divemailerror").html("邮件地址有误");

                error = "邮件地址有误";
            }
        }
    }
    if (error != "") {
        document.getElementById("divemailerror").style.display = "block";
    } else { 
        var title = $("#txt_email_title").val();
        var content = $("#txt_email_content").val();
        $.ajax({
            type: "POST",
            url: "/App_Services/wsShare.asmx/SendEmail",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{title:'" + title + "',body:'" + content + "',receives:'" + txtreceive + "'}",
            timeout: 2000,
            success: function(re) {
                if (re.d) {
                    $("#share_email_resulttxt").html("恭喜您,邮件发送成功!");
                } else {
                    $("#share_email_resulttxt").html("抱歉，邮件发送失败，请稍后再试");
                    $("#share_email_result").get(0).style.backgroud = "none";
                }
                share.emailinfo('share_email', 'block', 'share_email_result', 'block', 'share_email_sand', 'none');
            }
        });
    }
}
var xinlangurl = "http://service.t.sina.com.cn/share/share.php?"; var msnurl = "http://profile.live.com/badge/?"; var twiier = "http://twitter.com/intent/tweet?"; var facebook = "http://www.facebook.com/share.php?"; var renren = "http://share.renren.com/share/buttonshare/post/1004?"; var kaixin = "http://www.kaixin001.com/repaste/share.php?"; var lurl = location.href; var titleshow = "我在专为海外华人网购中国商品的Panli上发现了一款很棒的商品："; var share = { ShareLink: function(a, F, I, Y, J) { if (F == "0") { window.Panli.Login(); return } var O = titleshow + Y + ","; if (a == "4") { O += "推荐你去看看哦," } else { O += "欢迎大家来围观!" } var U = encodeURIComponent(O); var C = ""; if (a == "8") { if (J != "") { C = "嗨,你的好友" + J + "发现了一款不错的商品,强烈向您推荐!" } else { C = "嗨,你的好友发现了一款不错的商品,强烈向您推荐!" } } else { C = Y } C = encodeURIComponent(C); switch (a) { case "1": var H = lurl; if (F != "0") { H = lurl + "&sharesource=" + F } var V = U + H; var G = facebook + "u=" + encodeURIComponent(H) + "&t=" + V; window.open(G); break; case "2": var Z = encodeURIComponent(lurl); if (F != "0") { Z = encodeURIComponent(lurl + "&sharesource=" + F) } var A = U; var P = twiier + "text=" + A + "&url=" + Z; window.open(P); break; case "3": var R = I; var Z = encodeURIComponent(lurl); if (F != "0") { Z = encodeURIComponent(lurl + "&sharesource=" + F) } var O = U; var Q = xinlangurl + "title=" + O + "&pic=" + R + "&url=" + Z; window.open(Q); break; case "4": var Z = lurl; if (F != "0") { Z = lurl + "&sharesource=" + F } var O = O + Z; share.boxwrite("share_qq_title", O); share.gl_overlayinfo("gl_overlay", "block"); share.qqinfo("share_qq", "block", "div_share_qq_result", "none", "div_share_qq_copy", "block"); clip.reposition(document.getElementById("btn_copy")); share.showqqsuccess(O); break; case "5": var E = I; var Z = encodeURIComponent(lurl); if (F != "0") { Z = encodeURIComponent(lurl + "&sharesource=" + F) } var D = C; var T = U + Z; var K = msnurl + "title=" + D + "&description=" + T + "&screenshot=" + E + "&url=" + Z; window.open(K); break; case "6": var R = I; var Z = encodeURIComponent(lurl); if (F != "0") { Z = encodeURIComponent(lurl + "&sharesource=" + F) } var D = C; var W = U + Z; var S = renren + "title=" + D + "&content=" + W + "&pic=" + R + "&url=" + Z; window.open(S); break; case "7": var M = encodeURIComponent(lurl); if (F != "0") { M = encodeURIComponent(lurl + "&sharesource=" + F) } var N = C; var B = U + M; var X = kaixin + "rtitle=" + N + "&rcontent=" + B + "&rurl=" + M; window.open(X); break; case "8": var Z = lurl; if (F != "0") { Z = lurl + "&sharesource=" + F } var L = "<a href=" + Z + ">" + Z + "</a>"; var O = titleshow + "<br/>" + Y + "<br/>" + L + "<br/><img src=" + I + " alt=" + Y + " title=" + Y + " width=209 />"; document.getElementById("divemailerror").style.display = "none"; share.gl_overlayinfo("gl_overlay", "block"); share.emailinfo("share_email", "block", "share_email_result", "none", "share_email_sand", "block"); share.boxwrite("txtreceive", ""); share.boxwrite("txt_email_title", decodeURIComponent(C)); share.boxwrite("txt_email_content", O); break } }, qqinfo: function(D, I, B, H, A, E) { var G = share.getIeVersion(); if (G == 5 || G == 6) { if (I == "block") { var F = document.getElementById(D).offsetWidth * 0.5; var C = document.getElementById(D).offsetTop * 0.5; document.getElementById(D).style.left = (document.body.clientWidth) / 2 - F + "px"; document.getElementById(D).style.top = (document.body.clientHight) / 2 - F + "px" } } if (H == "block" && document.getElementById(D).style.display == "none") { return } document.getElementById(D).style.display = I; document.getElementById(B).style.display = H; document.getElementById(A).style.display = E }, emailinfo: function(B, D, C, I, H, A) { var G = share.getIeVersion(); if (G == 5 || G == 6) { if (B == "block") { var F = document.getElementById(B).offsetWidth * 0.5; var E = document.getElementById(B).offsetTop * 0.5; document.getElementById(B).style.left = (document.body.clientWidth) / 2 - F + "px"; document.getElementById(B).style.top = (document.body.clientHight) / 2 - F + "px" } } document.getElementById(B).style.display = D; document.getElementById(C).style.display = I; document.getElementById(H).style.display = A }, gl_overlayinfo: function(A, B) { document.getElementById(A).style.display = B }, boxwrite: function(B, A) { $("#" + B).val(A) }, getIeVersion: function() { var A = 0; var C = window.navigator.userAgent; var B = C.indexOf("MSIE "); if (B > 0) { A = parseInt(C.substring(B + 5, C.indexOf(".", B))) } return A }, showqqsuccess: function(A) { window.scrollTo(0, 0); clip.glue("btn_copy"); clip.addEventListener("mousedown", function() { clip.setText(A) }); clip.addEventListener("complete", function() { share.qqinfo("share_qq", "block", "div_share_qq_result", "block", "div_share_qq_copy", "none") }) } };