﻿$(function() { var d = $("#CowryId").val(); var b = { n: 0, l: [] }; var a = $("#userCommentList"); var c = function(e, f) { $.ajax({ type: "POST", url: "/App_Services/wsCowry.asmx/GetComment", cache: false, dataType: "json", contentType: "application/json;utf-8", data: '{"cowryId":' + d + ',"pageN":' + e + "}", timeout: 15000, beforeSend: function() { a.hide(); $("#loading").show(); }, complete: function() { $("#loading").hide(); }, error: function() { }, success: function(i) { var g = $.parseJSON(i.d); if (b.n != g.n) { f.AjaxPager({ sum_items: g.n, current_page: e, items_per_page: 5, callback: c }); } b = g; if (b.n <= 0) { $("#userCommentListPanel").before('<div id="noComment" class="wu_pl"><p>还没有人对这件宝贝发表看法，您有什么真知灼见？</p><span>赶快来<a href="#" onclick="$(document).scrollTop($(\'#liuyanPanel\').offset().top-200);return false;">占个沙发</a>吧！</span></div>'); return; } if (b.l.length > 0) { var h = $("#userCommentList"); h.empty(); $.each(b.l, function(j, k) { h.append('<li><div class="name"><p>会员：' + k.u + "</p><span>" + k.d + '</span></div><div class="text">' + k.c + "</div></li>"); }); $("#loading").hide(); h.show(); } } }); }; c(1, $("#ajaxPager")); $("#AddFavorite").click(function() { $.ajax({ type: "POST", url: "/App_Services/wsCowry.asmx/AddFavorite", dataType: "json", contentType: "application/json;utf-8", data: '{"cowryId":' + d + "}", timeout: 10000, beforeSend: function() { $("#AddFavorite").attr("disable", "disable"); }, complete: function() { $("#AddFavorite").removeAttr("disable"); }, error: function() { alert("网络错误，请稍后重试。"); }, success: function(e) { if (e.d == "success") { alert("添加收藏成功！"); return false; } if (e.d == "collected") { alert("您已经收藏过这件宝贝了哟！"); return false; } if (e.d == "fail") { alert("添加收藏失败！"); return false; } if (e.d == "noLogin") { window.Panli.Login(); return false; } alert("添加收藏失败"); } }); return false; }); $("#gelivibleBtn").click(function() { $.ajax({ type: "POST", url: "/App_Services/wsCowry.asmx/AddWellNumber", dataType: "json", contentType: "application/json;utf-8", data: '{"id":' + d + "}", timeout: 10000, error: function() { alert("网络错误，请稍后重试。"); }, success: function(f) { var e = new Date(); if (f.d == "Success") { window.Panli.Message.show("给栗成功！"); $("#gelivibleBtn span").text(parseInt($("#gelivibleBtn span").text()) + 1); return; } if (f.d == "noLogin") { window.Panli.Login(); } if (f.d == "Oneself") { alert("不能给栗自己的宝贝！"); } if (f.d == "Welled") { alert("这个商品你已经给栗过了！"); } if (f.d == "Limit") { alert("你今天给栗次数到上限了！"); } if (f.d == "NotFoundShare") { alert("没有找到要给力的宝贝！"); } if (f.d == "Error") { alert("系统错误！"); } } }); return false; }); $("#commentC").keydown(function() { var e = $.trim($(this).val()); if (e.length > 200) { $(this).val(e = e.substring(0, 200)); return false; } }).focus(function() { if ($("#commentC").attr("class") == "hui") { $(this).attr("class", "").val(""); } }).blur(function() { if ($.trim($(this).val()).length <= 0) { $(this).attr("class", "hui").val("对这件分享有共鸣？您也来随便说两句吧！"); } }); $("#commentstb").click(function() { if ($("#commentC").attr("class") == "hui") { alert("请填写留言内容！"); return; } if ($("#CommentCheckCode").val() == "") { alert("请填写验证码！"); return; } if ($.trim($("#commentC").val()).length > 200) { alert("留言内容不能超过200字哦！"); return; } $.ajax({ type: "POST", url: "/App_Services/wsCowry.asmx/AddComment", dataType: "json", contentType: "application/json;utf-8", data: '{"cowryId":' + d + ',"content":"' + $("#commentC").val() + '","check":"' + $("#CommentCheckCode").val() + '"}', timeout: 10000, error: function() { alert("网络错误，请稍后重试。"); }, success: function(f) { var e = new Date(); if (f.d == "success") { $("#noComment").remove(); $("#CommentCheckCode").val(""); $('#CommentCheckCodeImg').click();  $("#userCommentList").prepend('<li><div class="name"><p>您刚刚发表</p></div><div class="text">' + HtmlEncode($("#commentC").val()).replace(/\n/g, "<br />") + "</div></li>"); $("#userCommentList").show(); $(document).scrollTop($("#userCommentListPanel").offset().top - 100); $("#commentC").val(""); return; } if (f.d == "fail") { alert("添加评论失败，请稍后重试。"); } if (f.d == "noLogin") { window.Panli.Login(); } if (f.d == "checkerr") { alert("验证码错误"); $("#CommentCheckCode").select(); $('#CommentCheckCodeImg').click(); return false; } } }); }); $("#buyBtn").click(function() { $.ajax({ type: "POST", url: "/App_Services/wsCowry.asmx/AddBuyNumber", dataType: "json", contentType: "application/json;utf-8", data: '{"cowryId":' + d + "}", timeout: 10 }); }); });