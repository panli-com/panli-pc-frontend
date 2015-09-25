$(function () {
    var status = $("#LoginStatus").attr("value");
    if (status == 0) {
        window.Panli.Login();
    }
    var b = function (d) {
        var c = true;
        $(d).each(function (e, f) {
            if (f.checked) { c = false }
        });
        return c
    };

    var a = "（请您选择答案）";
    validateAll = function () {
        $(".wrongtip").each(function (e, f) {
            $(f).text("")
        });
        var c = false;
        $('#ddd').scroll()
        if (b(':radio[name="question_1"]')) {
            $("#wrongtip1").text(a);
            var hei = $('#wrongtip1').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':checkbox[name="question_2"]')) {
            $("#wrongtip2").text(a);
            var hei = $('#wrongtip2').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':radio[name="question_3"]')) {
            $("#wrongtip3").text(a);
            var hei = $('#wrongtip3').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':radio[name="question_4"]')) {
            $("#wrongtip4").text(a);
            var hei = $('#wrongtip4').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':radio[name="question_5"]')) {
            $("#wrongtip5").text(a);
            var hei = $('#wrongtip5').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':checkbox[name="question_6"]')) {
            $("#wrongtip6").text(a);
            var hei = $('#wrongtip6').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':radio[name="question_7"]')) {
            $("#wrongtip7").text(a);
            var hei = $('#wrongtip7').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':radio[name="question_8"]')) {
            $("#wrongtip8").text(a);
            var hei = $('#wrongtip8').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (c) { return false }
        var d = "(请补充您的答案)";
        if ($("#option_6_16").attr("checked") == true && $("#option_6_16_1").val().length == 0) {
            $("#wrongtip6").text(d); c = true;
            var hei = $('#wrongtip6').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false
        }
        if ($("#option_6_16").attr("checked") == false) {
            $("#option_6_16_1").val("")
        }
        if ($("#option_8_32").attr("checked") == true && $("#option_8_32_1").val().length == 0) {
            $("#wrongtip8").text(d); c = true;
            var hei = $('#wrongtip8').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false
        }
        if ($("#option_8_32").attr("checked") == false) {
            $("#option_8_32_1").val("")
        }
        if ($("#textfield9").val().length > 500) {
            $("#wrongtip9").text("最多可输入500个字，谢谢您的配合.");
            var hei = $('#wrongtip9').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false
        }
        return true
    };

    $(".startbtn").click(function () {

        if (validateAll()) {

            $("form")[0].submit(function () {
                return false
            });
        }
    });
});