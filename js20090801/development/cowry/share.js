//Sander 2011.8.29编辑,9.6修改
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
    if (error != "") {//有误，未输入或者格式错误
        document.getElementById("divemailerror").style.display = "block";
    } else { //验证通过，调用方法发送
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
                //成功后
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


//sharetype分享类型,addshareId从后台获取的唯一生成,proimage图片,title标题,proName为产品名字
var xinlangurl = "http://service.t.sina.com.cn/share/share.php?"; //新浪分享链接
var msnurl = "http://profile.live.com/badge/?"; //msn分享链接
var twiier = "http://twitter.com/intent/tweet?"; //twiier分享链接
var facebook = "http://www.facebook.com/share.php?"; //facebook分享链接
var renren = "http://share.renren.com/share/buttonshare/post/1004?"; //人人网分享链接
var kaixin = "http://www.kaixin001.com/repaste/share.php?"; //开心网分享链接
var lurl = location.href; //自己的url
var titleshow = "我在专为海外华人网购中国商品的Panli上发现了一款很棒的商品：";
var share = {
    ShareLink: function(shareType, addShareId, proimage, proName, userName) {
        if (addShareId == "0") {
            window.Panli.Login();
            return;
        }
        var title = titleshow + proName + ",";
        if (shareType == "4") {
            title += "推荐你去看看哦,";
        } else {
            title += "欢迎大家来围观!";
        }
        var tit = encodeURIComponent(title); //编码的内容，不带url
        var encodeProName = "";
        if (shareType == "8") {
            if (userName != "") {
                encodeProName = "嗨,你的好友" + userName + "发现了一款不错的商品,强烈向您推荐!";
            } else {
                encodeProName = "嗨,你的好友发现了一款不错的商品,强烈向您推荐!";
            }
        } else {
            encodeProName = proName;
        }
        encodeProName = encodeURIComponent(encodeProName); //加码后的产品名字
        switch (shareType) {
            case "1": //facebook
                var u = lurl; //自己的url
                if (addShareId != "0") {
                    u = lurl + "&sharesource=" + addShareId; //自己的url
                }
                var t = tit + u; //推荐内容里面带自己的url
                var facebookshareurl = facebook + "u=" + encodeURIComponent(u) + "&t=" + t; //最后的url
                window.open(facebookshareurl);
                break;
            case "2": //Twitter
                var url = encodeURIComponent(lurl); //自己的url
                if (addShareId != "0") {
                    url = encodeURIComponent(lurl + "&sharesource=" + addShareId); //自己的url
                }
                var text = tit; //推荐内容里面带自己的url
                var twittershareurl = twiier + "text=" + text + "&url=" + url; //最后的url
                window.open(twittershareurl);
                break;
            case "3": //新浪微博
                var pic = proimage; //产品图片
                var url = encodeURIComponent(lurl); //自己的url
                if (addShareId != "0") {
                    url = encodeURIComponent(lurl + "&sharesource=" + addShareId); //自己的url
                }

                var title = tit;
                var xinlangshareurl = xinlangurl + "title=" + title + "&pic=" + pic + "&url=" + url; //最后的url
                window.open(xinlangshareurl);
                break;
            case "4": //qq
                var url = lurl; //自己的url
                if (addShareId != "0") {
                    url = lurl + "&sharesource=" + addShareId; //自己的url
                }
                var title = title + url; //推荐内容里面带自己的url
                share.boxwrite("share_qq_title", title);
                share.gl_overlayinfo("gl_overlay", "block");
                share.qqinfo("share_qq", "block", "div_share_qq_result", "none", "div_share_qq_copy", "block");
                clip.reposition(document.getElementById('btn_copy'));
                share.showqqsuccess(title);

                break;
            case "5": //MSN 
                var screenshot = proimage; //产品图片
                var url = encodeURIComponent(lurl); //自己的url
                if (addShareId != "0") {
                    url = encodeURIComponent(lurl + "&sharesource=" + addShareId); //自己的url
                }

                var titles = encodeProName; //推荐内容里面带自己的url
                var description = tit + url; //分享内容，MSN分享可以由标题和内容，此处设置为相同
                var msnshareurl = msnurl + "title=" + titles + "&description=" + description + "&screenshot=" + screenshot + "&url=" + url; //最后的url
                window.open(msnshareurl);
                break;
            case "6": //人人网
                var pic = proimage; //产品图片
                var url = encodeURIComponent(lurl); //自己的url
                if (addShareId != "0") {
                    url = encodeURIComponent(lurl + "&sharesource=" + addShareId); //自己的url
                }

                var titles = encodeProName; //推荐标题
                var content = tit + url; //推荐内容里面带自己的url
                var renrenshareurl = renren + "title=" + titles + "&content=" + content + "&pic=" + pic + "&url=" + url;
                window.open(renrenshareurl);
                break;
            case "7": //开心网
                var rurl = encodeURIComponent(lurl); //自己的url
                if (addShareId != "0") {
                    rurl = encodeURIComponent(lurl + "&sharesource=" + addShareId); //自己的url
                }

                var rtitle = encodeProName;  //推荐标题
                var rcontent = tit + rurl; //推荐内容里面带自己的url
                var kaixinshareurl = kaixin + "rtitle=" + rtitle + "&rcontent=" + rcontent + "&rurl=" + rurl;
                window.open(kaixinshareurl);
                break;
            case "8": //Email
                var url = lurl; //自己的url
                if (addShareId != "0") {
                    url = lurl + "&sharesource=" + addShareId; //自己的url
                }
                var urll = "<a href=" + url + ">" + url + "</a>"
                var title = titleshow + "<br/>" + proName + "<br/>" + urll + "<br/>" + "<img src=" + proimage + " alt=" + proName + " title=" + proName + " width=209 />"; //推荐内容里面带自己的url
                //var title = titleshow + "<br/>" + proName + "<br/>" + urll; //推荐内容里面带自己的url
                document.getElementById("divemailerror").style.display = "none";

                share.gl_overlayinfo("gl_overlay", "block");
                share.emailinfo("share_email", "block", 'share_email_result', 'none', 'share_email_sand', 'block');
                share.boxwrite("txtreceive", "");
                share.boxwrite("txt_email_title", decodeURIComponent(encodeProName));
                share.boxwrite("txt_email_content", title);
                break;

        }
    },
    //qq层控制
    qqinfo: function(share_qq, qqstate, div_share_qq_result, div_share_qq_result_state, div_share_qq_copy, div_share_qq_copy_state) {
        var ie = share.getIeVersion();
        if (ie == 5 || ie == 6) {
            if (qqstate == "block") {
                var left = document.getElementById(share_qq).offsetWidth * 0.5;
                var top = document.getElementById(share_qq).offsetTop * 0.5;
                document.getElementById(share_qq).style.left = (document.body.clientWidth) / 2 - left + "px";
                document.getElementById(share_qq).style.top = (document.body.clientHight) / 2 - left + "px";
            }
        }
        if (div_share_qq_result_state == "block" && document.getElementById(share_qq).style.display == "none") {
            return;
        }
        document.getElementById(share_qq).style.display = qqstate;
        document.getElementById(div_share_qq_result).style.display = div_share_qq_result_state;
        document.getElementById(div_share_qq_copy).style.display = div_share_qq_copy_state;
    }, //email层控制
    emailinfo: function(share_email, emailstate, div_share_email_result, div_share_email_result_state, div_share_email_sand, div_share_email_sand_state) {
        var ie = share.getIeVersion();
        if (ie == 5 || ie == 6) {
            if (share_email == "block") {
                var left = document.getElementById(share_email).offsetWidth * 0.5;
                var top = document.getElementById(share_email).offsetTop * 0.5;
                document.getElementById(share_email).style.left = (document.body.clientWidth) / 2 - left + "px";
                document.getElementById(share_email).style.top = (document.body.clientHight) / 2 - left + "px";
            }
        }
        document.getElementById(share_email).style.display = emailstate;
        document.getElementById(div_share_email_result).style.display = div_share_email_result_state;
        document.getElementById(div_share_email_sand).style.display = div_share_email_sand_state;
    }, //笼罩层控制
    gl_overlayinfo: function(gl_overlay, everlaystate) {
        document.getElementById(gl_overlay).style.display = everlaystate;
    }, //填写文本框内容
    boxwrite: function(txtid, title) {
        $("#" + txtid).val(title);
    }, //获取浏览器版本
    getIeVersion: function() {
        var ie = 0;
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        if (msie > 0)      // If Internet Explorer, return version number
            ie = parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
        return ie;
    },
    showqqsuccess: function(title) {
        window.scrollTo(0, 0);
        clip.glue("btn_copy");
        clip.addEventListener('mousedown', function() { clip.setText(title); });
        clip.addEventListener('complete', function() {
            share.qqinfo("share_qq", "block", "div_share_qq_result", "block", "div_share_qq_copy", "none");
        });
    }
}
