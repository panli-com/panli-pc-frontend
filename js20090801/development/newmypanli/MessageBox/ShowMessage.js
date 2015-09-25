
var buildlist = function(i, jq) {
    //用户优惠券列表，d是总数，是当前页列表
    var couponList = { d: 0, l: [] };
    //优惠券列表表格对象
    var listHtml = $("#messageList");
    $.ajax({
        type: "POST",
        url: "/App_Services/wsMessage.asmx/GetSingleUserMessage",
        cache: false,
        dataType: "json",
        contentType: "application/json;utf-8",
        data: '{"topicId":"' + query + '","pages":' + i + '}',
        timeout: 15000,
        beforeSend: function() { },
        error: function(a, b, c) { },
        success: function(r) {
            var temp = eval("(" + r.d + ")");
            //如果列表项总数发生变化重构分页器
            if (couponList.n != temp.n) {
                jq.AjaxPager({
                    sum_items: temp.n,
                    current_page: i,
                    items_per_page: 10,
                    callback: buildlist
                });
            }
            //构造列表
            couponList = temp;
            //用户没有短消息
            if (couponList.n <= 0) {
                $("#answerList").hide();
                window.location = "UserMessage.aspx";
                return;
            }
            if (couponList.l.length > 0) {
                $("#mainTitle").html(couponList.t)
                $("#answerList").show();
                var t = $("#answerList");
                t.empty();
                $.each(couponList.l, function(index, items) {
                    var img = '<img src="' + myFace + '" onerror="this.src=\'http://sf.panli.com/FrontEnd/images20090801/noimg/noimg80.gif\'"  />';
                    var user = "<span class=\"wo\">我";
                    if (items.m == "KefuToUser") {
                        user = "<span class=\"hong\">Panli客服"
                        img = '<img src="http://sf.panli.com/FrontEnd/images20090801/server.jpg" onerror="this.src=\'http://sf.panli.com/FrontEnd/images20090801/noimg/noimg80.gif\'" />';
                    }
                    t.append(' <li id="l' + items.n + '"><div class="face"><span>' + img + '</span></div><div class="xinxi_ly"><div class="ly_t">' + user + ':</span>' + items.d + '</div><p>' + items.c + '</p></div></li>');
                });
                t.show();
                $("#noneList").hide();
            }
        }
    });
}
        $(function() {
            buildlist(1, $("#ajaxPager"));
        });
        function AddUserMessage()
        {
            var content = $.trim($("#answerBox").val())
            if(content != ""&&content.length <5000)
            {
                 content = HtmlEncode(content);
                 $.ajax({
                    type: "POST",
                    url: "/App_Services/wsMessage.asmx/AddSingleUserMessage",
                    cache: false,
                    dataType: "json",
                    contentType: "application/json;utf-8",
                    data: '{"topicId":"'+query+'","content":"' + content + '"}',
                    timeout: 15000,
                    error: function(a, b, c) { alert("网络错误请重新再试") },
                    success: function(r) {
                        if (r.d == "success") {
                           buildlist(1, $("#ajaxPager"));
                        }
                        else
                            alert("网络错误请重新再试");
                    }
                }
                    );
            }
            else if(content.length >=5000)
            {
                alert("回复字数必须少于50000字数");
            }
            else
            {
               alert("请输入至少一个字");
            }
            $("#answerBox").val("");
        }
          $(document).ready(function() {
    $("#answerBox").keydown(function(e) {
        if (e.keyCode == 13) {
            AddUserMessage();
            return false;
        }
    });
});