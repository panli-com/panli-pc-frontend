$(document).ready(function() {
    $("#favoriteList tr:even").addClass("hui");
})
var fId = "";
var closeBtn = 0;
//取消收藏
function deleteFavorite(id) {
    if (confirm("您确定要删除收藏吗？")) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsFavorite.asmx/RemoveFavorite",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{favoriteId:" + id + "}",
            timeout: 10000,
            error: function() { alert("网络错误，请稍后再试！"); },
            success: function(res) { if (res.d != "失败") { ShowTag(res.d); $("#tr_favor_" + id).remove();   if ($(".biao table tr").length <2) { window.location = ToPrevPage(); } } else { alert("删除失败了！"); } }
        });
    }
}
//取消选中收藏
function deleteSelectFavorite() {
    var id = "";
    $("input[name=cbSel]").each(function() { if ($(this).attr("checked")) { id += $(this).val() + "," } });
    if (id.length < 1) {
        alert("请选择您要删除的商品！");
        return;
    }
    if (confirm("您确定要删除这些商品吗？")) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsFavorite.asmx/RemoveSelectFavorite",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{favoriteId:'" + id + "'}",
            timeout: 10000,
            error: function() { alert("网络错误，请稍后再试！"); },
            success: function(res) { if (res.d != "失败") { ShowTag(res.d); var ids = id.split(","); for (i = 0; i < ids.length - 1; i++) $("#tr_favor_" + ids[i]).remove();if ($(".biao table tr").length <2) { window.location = ToPrevPage(); } } else { alert("删除失败了！"); } }
        });
    }
}

function ReplaceD(tagname) {
    return tagname.replace(/'/g, "\\'");
}

function ReplaceA(tagname) {
    return tagname.replace(/&amp;/g, "%26amp%3b");
}

function ReplaceNAM(tagname) {
    return tagname.replace(/&/g, "%26amp%3b");
}

//初始化标签管理层
function InitTagManager() {
    $("#p_Tag_m").text("标签名只能有7个中文或14个英文字符！").removeClass("red");
}

//弹出标签管理层
function tagShow(isShow) {
    if (isShow) {
        $(".addpanel_overlay").height($(document).height()).show();
        $("#dialog").show();
        $.ajax({
            type: "POST",
            url: "/App_Services/wsFavorite.asmx/GetUserTags",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{}",
            timeout: 10000,
            error: function() { alert("网络错误，请稍后再试！"); },
            success: function(res) {
                var tags = eval(res.d);
                $("#tagCount").text(tags.length);
                if (tags.length > 0) {
                    var str = "";
                    $.each(tags, function(i, data) { str += "<li id=\"l_" + i + "\"><b>" + data.TagName + "<span>(" + data.FavoriteCount + ")</span></b><p><a href=\"javascript:;\" onclick=\"ShowEditTag(" + i + ",true,'" + ReplaceD(data.TagName) + "'," + data.FavoriteCount + ")\">编辑</a><a href=\"javascript:;\" onclick=\"DeleteUserTag('" + ReplaceD(data.TagName) + "'," + i + ")\">删除</a></p></li>" });
                    InitTagManager();
                }
                $("#dialogTag").html(str);
            }
        });
        $("#txtTagName").keydown(function(e) { if (e.keyCode == 13) { $(".biao_dialog .o").click(); return false; } });
        $("#txtTagName").focus();
    }
    else {
        $(".addpanel_overlay").hide();
        $("#dialog").hide();
    }
}

//显示编辑状态
function ShowEditTag(tagNumber, isShow, tagName, favoriteCount) {
    if (isShow) {
        $("#l_" + tagNumber).html("<input id=\"t_" + tagNumber + "\" maxlength=\"14\" onkeydown=\"TagKeyDown(event," + tagNumber + ",'" + ReplaceD(tagName) + "'," + favoriteCount + ")\" oldtext=\"\" type=\"text\" onkeyup=\"TagKeyup(event,this)\" value=\"" + tagName + "\" /><p><a href=\"javascript:;\" onclick=\"EditUserTag(" + tagNumber + ",'" + ReplaceD(tagName) + "'," + favoriteCount + ")\">确定</a><a href=\"javascript:;\" onclick=\"ShowEditTag(" + tagNumber + ",false,'" + ReplaceD(tagName) + "'," + favoriteCount + ")\">取消</a></p>");
    } else {
        $("#l_" + tagNumber).html("<b>" + tagName + "<span>(" + favoriteCount + ")</span></b><p><a href=\"javascript:;\" onclick=\"ShowEditTag(" + tagNumber + ",true,'" + ReplaceD(tagName) + "'," + favoriteCount + ")\">编辑</a><a href=\"javascript:;\" onclick=\"DeleteUserTag('" + ReplaceD(tagName) + "'," + tagNumber + ")\">删除</a></p>"); InitTagManager();
    }
}

function TagKeyDown(e, tagNumber, oldTag, favoriteCount) {
    if (e.keyCode == 13) {
        EditUserTag(tagNumber, oldTag, favoriteCount);
    }
}

function TagKeyup(e, t) {
    var tagname = $(t).val();
    var vali = ValidateTagName(tagname);
    if (vali == 2) {
        tagname = $(t).attr("oldtxt");
    }
    else if (vali == 3) {
        tagname = tagname.substring(0, tagname.length - 1);
    }
    $(t).val(tagname);
    $(t).attr("oldtxt", tagname);
}

//编辑一个标签
function EditUserTag(tagNumber, oldTag, favoriteCount) {
    var tagName = $.trim($("#t_" + tagNumber).val());
    if (tagName == "") {
        $("#p_Tag_m").text("标签名不能为空！").addClass("red");
        return;
    }
    if (tagName == oldTag) {
        $("#l_" + tagNumber).html("<b>" + oldTag + "<span>(" + favoriteCount + ")</span></b><p><a href=\"javascript:;\" onclick=\"ShowEditTag(" + tagNumber + ",true,'" + ReplaceD(oldTag) + "'," + favoriteCount + ")\">编辑</a><a href=\"javascript:;\" onclick=\"DeleteUserTag('" + ReplaceD(oldTag) + "'," + tagNumber + ")\">删除</a></p>");
        return;
    }
    var vt = ValidateTagName(tagName);
    if (vt == 2) {
        $("#p_Tag_m").text("每个标签限定14个英文字母或7个中文，请重新输入！").addClass("red");
        return;
    }
    else if (vt == 3) {
        $("#p_Tag_m").text("标签中不要使用 \  / : * ? , ，\" < > 哦，请正确填写!").addClass("red");
        return;
    }
    else {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsFavorite.asmx/EditUserTag",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{oldTagName:'" + ReplaceD(oldTag) + "',newTagName:'" + ReplaceD(tagName) + "'}",
            timeout: 10000,
            error: function() { alert("网络错误，请稍后再试！"); },
            success: function(res) {
                if (res.d != 3) { flag = 1; if (queryTag == ReplaceD(oldTag)) loca = "/mypanli/Favorite.aspx?tag=" + ReplaceD(encodeURI(tagName)); $("#l_" + tagNumber).html("<b>" + tagName + "<span>(" + favoriteCount + ")</span></b><p><a href=\"javascript:;\" onclick=\"ShowEditTag(" + tagNumber + ",true,'" + ReplaceD(tagName) + "'," + favoriteCount + ")\">编辑</a><a href=\"javascript:;\" onclick=\"DeleteUserTag('" + ReplaceD(tagName) + "'," + tagNumber + ")\">删除</a></p>"); } else { flag = 1; $("#l_" + tagNumber).remove(); }
            }
        });
    }
}

//删除一个标签
function DeleteUserTag(tagName, tagNumber) {
    if (confirm("确定要删除吗？")) {
        $.ajax({
            type: "POST",
            url: "/App_Services/wsFavorite.asmx/DeleteUserTag",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{tagName:'" + ReplaceD(tagName) + "'}",
            timeout: 10000,
            error: function() { alert("网络错误，请稍后再试！"); },
            success: function(res) { if (res.d) { flag = 1; if (queryTag == ReplaceD(tagName)) loca = "/mypanli/Favorite.aspx"; $("#l_" + tagNumber).remove(); $("#tagCount").text(parseInt($("#tagCount").text()) - 1); } else { alert("删除失败了！"); } }
        });
    }
}

//添加用户标签
function AddUserTag() {
    var tagName = $.trim($("#txtTagName").val());
    if (tagName == "") {
        $("#p_Tag_m").text("标签名不能为空！").addClass("red");
        return;
    }
    var vt = ValidateTagName(tagName);
    if (vt == 2) {
        $("#p_Tag_m").text("每个标签限定14个英文字母或7个中文，请重新输入！").addClass("red");
        return;
    }
    else if (vt == 3) {
        $("#p_Tag_m").text("标签中不要使用 \  / : * ? , ，\" < > 哦，请正确填写!").addClass("red");
        return;
    }
    else {
        $(".biao_dialog .o").attr("disabled", true);
        $.ajax({
            type: "POST",
            url: "/App_Services/wsFavorite.asmx/AddUserTag",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{tagName:'" + ReplaceD(tagName) + "'}",
            timeout: 10000,
            error: function() { alert("网络错误，请稍后再试！"); $(".biao_dialog .o").attr("disabled", false); },
            success: function(res) {
                if (res.d) {
                    $(".biao_dialog .o").attr("disabled", false);
                    if (flag != 1) flag = 2;
                    var i = $("#dialogTag").find("li").length;
                    InitTagManager();
                    $("#txtTagName").val("");
                    $("#dialogTag").append("<li id=\"l_" + i + "\"><b>" + tagName + "<span>(0)</span></b><p><a href=\"javascript:;\" onclick=\"ShowEditTag(" + i + ",true,'" + ReplaceD(tagName) + "'," + 0 + ")\">编辑</a><a href=\"javascript:;\" onclick=\"DeleteUserTag('" + ReplaceD(tagName) + "'," + i + ")\">删除</a></p></li>"); $("#p_Tag_m").text("标签名只能有7个中文或14个英文字符！").removeClass("red");
                    $("#tagCount").text(parseInt($("#tagCount").text()) + 1);
                    $("#dialogTag").scrollTop($("#dialogTag").height());
                } else {
                    $(".biao_dialog .o").attr("disabled", false);
                    $("#txtTagName").val("");
                    $("#p_Tag_m").text("你已经有该标签了").addClass("red");

                }
            }
        });
    }
}

//全选
function CheckAll(isChecked) {
    $("input[name=cbSel]").each(function() { $(this).attr("checked", isChecked) });
}

function FCheck() {
    $("input[name=cbSel]").each(function() { this.checked = !this.checked; });
}


//弹出添加商品标签
function AddTag(id) {
    fId = id;
    $("#f_tianjiaTag").remove();
    $.ajax({
        type: "POST",
        url: "/App_Services/wsFavorite.asmx/GetCommonTag",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: "{}",
        timeout: 10000,
        error: function() { alert("网络错误，请稍后再试！"); },
        success: function(res) {
            var str = " <div class=\"tianjia\" onmouseup=\"UnmouseUp(event)\" id=\"f_tianjiaTag\"><div class=\"h3\"><h3>自定义标签：</h3><a href=\"javascript:;\" class=\"guan\" onclick=\"RemoveTag()\" title=\"删除标签\"></a></div><div class=\"gx\"><label>个性标签：</label> <input id=\"tagName\" onchange=\"AddTagChange()\" onfocus=\"TxtFocus()\" type=\"text\" /> <p id=\"p_Tag\">最多可加3个标签，逗号隔开，每个标签字数限14个字符</p></div> <div class=\"chang\"><label> 常用标签：</label><p id=\"tagP\">"
            var tags = eval(res.d);
            if (tags.length > 0) {
                $.each(tags, function(i, data) { str += "<a href=\"javascript:;\" onclick=\"AddTagToText(this,'" + ReplaceD(data.TagName) + "')\">" + data.TagName + "</a>" })
            }
            str += "</p></div><div class=\"ok\"><input name=\"\" type=\"button\" onclick=\"AddFavoriteTag()\" value=\"确定\" /><input name=\"\" type=\"button\" onclick=\"RemoveTag()\" value=\"取消\" /></div></div>"
            $("#btnAdd" + id).after(str);
           
            var ts = new Array();
            $("#tr_favor_" + fId + " ul li").each(function() { ts.push($(this).find("a").eq(0).attr("title")); });
            ts.pop();
            if (ts.length > 0) {
                $("#tagName").val(ts.join(","));
            }
            var tagsl = $("#tagName").val().replace(/，/g, ",");
            $.each($("#tagP a"), function(i, d) {
            if (tagsl.indexOf($(d).text() + ",") == 0 || tagsl.indexOf("," + $(d).text() + ",") >= 0 || tagsl.indexOf($(d).text()) >= 0)
                    $(d).attr("class", "h");
            });
            $("#tagName").keydown(function(e) { if (e.keyCode == 13) { AddFavoriteTag(); return false; } });
            if ($(document).scrollTop() < ($("#f_tianjiaTag").offset().top + $("#f_tianjiaTag").height() - getTotalHeight()))
                $(document).scrollTop($("#f_tianjiaTag").offset().top + $("#f_tianjiaTag").height() - getTotalHeight());
            setTimeout(function() { $("#tagName").focus(); }, 100);
        }
    });
}

function TxtFocus() {
    if ($.browser.msie) {
        var e = event.srcElement;
        var r = e.createTextRange();
        r.moveStart('character', e.value.length);
        r.collapse(true);
        r.select();
    }
}

function getTotalHeight() {

    if ($.browser.msie) {
        return document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight :
                          document.body.clientHeight;
    } else {
        return self.innerHeight;
    }
}

function ReplaceBlank(tagname) {
    return tagname.replace();
}

//删除一个商品的标签
function RemoveFavoriteTag(tagName, id) {
    $.ajax({
        type: "POST",
        url: "/App_Services/wsFavorite.asmx/RemoveFavoriteTag",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: "{tagName:'" + ReplaceD(tagName) + "',favoriteId:" + id + "}",
        timeout: 10000,
        error: function() { alert("网络错误，请稍后再试！"); },
        success: function(res) { if (res.d != "失败") { ShowTag(res.d); $("#tr_favor_" + id + " ul li a[title=" + ReplaceD(tagName) + "]").parent().remove(); if ($("#tr_favor_" + id + " ul li input").length != 1) $("#tr_favor_" + id + " ul").append("<li> <input type=\"button\" class=\"f_c\" title=\"添加标签\" id='btnAdd" + id + "' onclick=\"AddTag(" + id + ")\" type=\"button\" /></li>"); } else { alert("删除失败了！"); } }
    });
}
//阻止添加商品层添加事件
function UnmouseUp(e) {
    if (e && e.stopPropagation != undefined) { e.stopPropagation(); }
    else { window.event.cancelBubble = true; }
}

//添加商品标签文本改变事件
function AddTagChange() {
    var tags = $("#tagName").val().replace(/，/g, ",");
    var txtTags = tags.split(",");
    if ((txtTags.length) > 3 && txtTags[txtTags.length - 1] != "") {
        $("#p_Tag").text("商品最多可添加3个标签，您选多了哦！").addClass("red");
        return;
    }
    else {
        $("#p_Tag").text("最多可加3个标签，逗号隔开，每个标签字数限14个字符").removeClass("red");
        return;
    }
}

//添加标签常用标签点击事件
function AddTagToText(tag, tagname) {
    var tags = $("#tagName").val().replace(/，/g, ",");
    var isShow = true;
    var ts = tags.split(",");
    for (i = 0; i < ts.length; i++) {
        if (ts[i] == tagname) {
            isShow = false;
            break;
        }
    }
    if (tags.lastIndexOf(",") + 1 != tags.length) {
        tags += ",";
    }
    if (isShow) { if (tags.split(",").length > 3) { $("#p_Tag").text("商品最多可添加3个标签，您选多了哦！").addClass("red"); return; } else { tags += (tagname + ","); $(tag).addClass("h"); $("#p_Tag").text("最多可加3个标签，逗号隔开，每个标签字数限14个字符").removeClass("red"); } }
    else { $(tag).removeClass("h"); tags = tags.replace((tagname + ","), ""); $("#p_Tag").text("最多可加3个标签，逗号隔开，每个标签字数限14个字符").removeClass("red"); }
    $("#tagName").val(tags);
    $("#tagName").focus();
}

//验证标签名
function ValidateTagName(tagName) {
    tagName = $.trim(tagName);
    var regtest = new RegExp("[\\/:,，\*\?\"<>]");
    if (!regtest.test(tagName)) {
        //var regEng = new RegExp("[^\\u4e00-\\u9fa5]", "g");
        var regCn = new RegExp("[\\u0391-\\uFFE5]", "g");
        var nicknamelength = tagName.length;
        while (regCn.exec(tagName) != null)
            nicknamelength++;

        if (nicknamelength <= 14) {
            return 1; //正确
        } else {
            return 2; //长度不对
        }
    }
    else {
        return 3; //字符不对
    }
}

//移除添加标签层
function RemoveTag() {
    fId = 0; $("#f_tianjiaTag").remove();
}

//显示删除按钮，阻止删除       
function ShowClose() {
    clearTimeout(closeBtn);
}

//显示删除标签按钮
function ShowDelTag(tag, id) {
    $(tag).after("<a href=\"javascript:;\" onmouseout=\"$(this).remove()\" onclick=\"RemoveFavoriteTag('" + ReplaceD($(tag).attr("title")) + "'," + id + ")\" class=\"close\" onmouseover=\"ShowClose()\" title=\"删除标签\"></a>");
}

//隐藏删除标签按钮
function HideDelTag(tag) {
    closeBtn = setTimeout(function() {
        $(tag).next().remove();
    }, 500);
}
//去除重复的项
Array.prototype.unique = function() {
    var a = {}; for (var i = 0; i < this.length; i++) {
        if (typeof a[this[i]] == "undefined")
            a[this[i]] = 1;
    }
    this.length = 0;
    for (var i in a)
        this[this.length] = i;
    return this;
}

//给商品添加标签
function AddFavoriteTag() {
    if (fId > 0) {
        var tagName = $.trim($("#tagName").val());
        tagName = tagName.replace(/，/g, ",");
        if (tagName.lastIndexOf(",") == tagName.length - 1) tagName = tagName.substring(0, tagName.length - 1);
        var txtTags = tagName.split(",");
        txtTags = txtTags.unique();
        tagName = txtTags.join(",");
        if (txtTags.length > 3 && txtTags[txtTags.length - 1] != "") {
            $("#p_Tag").text("商品最多可添加3个标签，您选多了哦！").addClass("red");
            return;
        }
        for (i = 0; i < txtTags.length; i++) {
            var vc = ValidateTagName(txtTags[i]);
            if (vc == 2) {
                $("#p_Tag").text("每个标签限定14个英文字母或7个中文，请重新输入！").addClass("red");
                return;
            }
            else if (vc == 3) {
                $("#p_Tag").text("标签中不要使用 \  / : * ? , ，\" < > 哦，请正确填写!").addClass("red");
                return;
            }
            else $("#p_Tag").text("最多可加3个标签，逗号隔开，每个标签字数限14个字符").removeClass("red");
        }
        $.ajax({
            type: "POST",
            url: "/App_Services/wsFavorite.asmx/AddFavoriteTag",
            dataType: "json",
            contentType: "application/json;utf-8",
            data: "{favoriteId:" + fId + ",tags:'" + ReplaceD(tagName) + "'}",
            timeout: 10000,
            error: function() { alert("网络错误，请稍后再试！"); },
            success: function(res) {
                $("#tr_favor_" + fId + " ul li").remove();
                $.each(txtTags, function() {
                    if (eval(this).length > 0)
                        $("#tr_favor_" + fId + " ul").append("<li><a href=\"/mypanli/Favorite.aspx?tag=" + ReplaceNAM(eval(this)) + "\" class=\"y\" onmouseout=\"HideDelTag(this)\" onmouseover=\"ShowDelTag(this," + fId + ")\" title=\"" + $.trim(eval(this)) + "\">" + $.trim(eval(this)) + "</a></li>");
                });
                ShowTag(res.d);
                if (txtTags.length < 3) $("#tr_favor_" + fId + " ul").append("<li> <input type=\"button\" class=\"f_c\" title=\"添加标签\" id='btnAdd" + fId + "' onclick=\"AddTag(" + fId + ")\" type=\"button\" /></li>");
                $("#f_tianjiaTag").remove();
            }
        });
    }
}

//阴影层效果
$(function() {
    if (typeof document.body.style.maxHeight == "undefined") {
        //if ($.browser.msie && $.browser.version == "6.0") {
        $("#dialog").css("position", "absolute").css("margin-top", "0px");
        var divY = (getViewportHeight() - $("#dialog").outerHeight()) / 2;
        $("#dialog").css("top", (divY + document.documentElement.scrollTop).toString());
        $(window).biaoroll(function() { $("#dialog").css("top", divY + document.documentElement.scrollTop + ""); });
    }
    $(document).bind("mouseup", function() { $("#f_tianjiaTag").remove(); });
});


function ShowTag(res) {
    var tags = eval(res);
    var str = "";
    $("#tagCount").text(tags.length);
    if (tags.length > 0) {
        $.each(tags, function(i, data) {
            if (queryTag == "" && i == 0) {
                str += "<li class=\"xuan\"><a href=\"/mypanli/Favorite.aspx\">" + data.TagName + "</a><span>(" + data.FavoriteCount + ")</span></li>";
            } else if (i == 0) {
            str += "<li class=\"xuan\"><a href=\"/mypanli/Favorite.aspx\">" + data.TagName + "</a><span>(" + data.FavoriteCount + ")</span></li>";

            }
            else if (queryTag == ReplaceD(data.TagName)) {
            str += "<li class=\"xuan\"><a href=\"/mypanli/Favorite.aspx?tag=" + ReplaceA(encodeURI(data.TagName)) + "\">" + data.TagName + "</a><span>(" + data.FavoriteCount + ")</span></li>";

            }
            else {
                str += "<li><a href=\"/mypanli/Favorite.aspx?tag=" + ReplaceA(encodeURI(data.TagName)) + "\">" + data.TagName + "</a><span>(" + data.FavoriteCount + ")</span></li>";
            }
        });
    }
    $("#Tag_List_Collection").html(str);
}

//获取所有标签
function GetAllTag(tagName, id) {
    $.ajax({
        type: "POST",
        url: "/App_Services/wsFavorite.asmx/GetAllTag",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: "{}",
        timeout: 10000,
        error: function() { alert("网络错误，请稍后再试！"); },
        success: function(res) { if (res.d != "失败") { ShowTag(res.d); } else { alert("删除失败了！"); } }
    });
}