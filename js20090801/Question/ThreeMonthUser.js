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
        if (b(':radio[name="question_1"]')) {
            $("#wrongtip1").text(a);
            var hei = $('#wrongtip1').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':radio[name="question_2"]')) {
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
        if (b(':checkbox[name="question_7"]')) {
            $("#wrongtip7").text(a);
            var hei = $('#wrongtip7').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':checkbox[name="question_8"]')) {
            $("#wrongtip8").text(a);
            var hei = $('#wrongtip8').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':radio[name="question_9"]')) {
            $("#wrongtip9").text(a);
            var hei = $('#wrongtip9').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':checkbox[name="question_10"]')) {
            $("#wrongtip10").text(a);
            var hei = $('#wrongtip10').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':checkbox[name="question_11"]')) {
            $("#wrongtip11").text(a);
            var hei = $('#wrongtip11').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':checkbox[name="question_12"]')) {
            $("#wrongtip12").text(a);
            var hei = $('#wrongtip12').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':radio[name="question_13"]')) {
            $("#wrongtip13").text(a);
            var hei = $('#wrongtip13').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':radio[name="question_14"]')) {
            $("#wrongtip14").text(a);
            var hei = $('#wrongtip14').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':radio[name="question_15"]')) {
            $("#wrongtip15").text(a);
            var hei = $('#wrongtip15').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if (b(':checkbox[name="question_16"]')) {
            $("#wrongtip16").text(a);
            var hei = $('#wrongtip16').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        var g = "（请填写网站名称或网址）";
        var d = "(请补充您的答案)";
        if ($("#option_1_16").attr("checked") == true && $("#option_1_16_1").val().length == 0) {
            $("#wrongtip1").text(d);
            var hei = $('#wrongtip1').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if ($("#option_1_16").attr("checked") == false) {
            $("#option_1_16_1").val("")
        }
        if ($("#option_3_8").attr("checked") == true && $("#option_3_8_1").val().length == 0) {
            $("#wrongtip3").text(d);
            var hei = $('#wrongtip3').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if ($("#option_3_8").attr("checked") == false) {
            $("#option_3_8_1").val("")
        }
        if ($("#textfield9").val().length == 0) {
            $("#wrongtip5").text(g);
            var hei = $('#wrongtip5').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if ($("#textfield11").val().length == 0) {
            $("#wrongtip5").text(g);
            var hei = $('#wrongtip5').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if ($("#textfield12").val().length == 0) {
            $("#wrongtip5").text(g);
            var hei = $('#wrongtip5').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if ($("#textfield13").val().length == 0) {
            $("#wrongtip6").text(g);
            var hei = $('#wrongtip6').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if ($("#textfield14").val().length == 0) {
            $("#wrongtip6").text(g);
            var hei = $('#wrongtip6').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if ($("#textfield15").val().length == 0) {
            $("#wrongtip6").text(g);
            var hei = $('#wrongtip6').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if ($("#option_7_128").attr("checked") == true && $("#option_7_128_1").val().length == 0) {
            $("#wrongtip7").text(d);
            var hei = $('#wrongtip7').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if ($("#option_7_128").attr("checked") == false) {
            $("#option_7_128_1").val("")
        }
        if ($("#option_8_1").attr("checked") == true && $("#option_8_1_1").val().length == 0) {
            $("#wrongtip8").text("请补充您的论坛网站名称");
            var hei = $('#wrongtip8').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if ($("#option_8_1").attr("checked") == false) {
            $("#option_8_1_1").val("")
        }
        if ($("#option_8_4").attr("checked") == true && $("#option_8_4_1").val().length == 0) {
            $("#wrongtip8").text("请补充您的论坛网站名称");
            var hei = $('#wrongtip8').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if ($("#option_8_4").attr("checked") == false) {
            $("#option_8_4_1").val("")
        }
        if ($("#option_10_8").attr("checked") == true && $("#option_10_8_1").val().length == 0) {
            $("#wrongtip10").text(d);
            var hei = $('#wrongtip10').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if ($("#option_10_8").attr("checked") == false) {
            $("#option_10_8_1").val("")
        }
        if ($("#option_11_32").attr("checked") == true && $("#option_11_32_1").val().length == 0) {
            $("#wrongtip11").text(d);
            var hei = $('#wrongtip11').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if ($("#option_11_32").attr("checked") == false) {
            $("#option_11_32_1").val("")
        }
        if ($("#option_12_64").attr("checked") == true && $("#option_12_64_1").val().length == 0) {
            $("#wrongtip12").text(d);
            var hei = $('#wrongtip12').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if ($("#option_12_64").attr("checked") == false) {
            $("#option_12_64_1").val("")
        }
        if ($("#option_16_32").attr("checked") == true && $("#option_16_32_1").val().length == 0) {
            $("#wrongtip16").text(d);
            var hei = $('#wrongtip16').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        if ($("#option_16_32").attr("checked") == false) {
            $("#option_16_32_1").val("")
        }
        if ($('textarea[name="question_17"]').val().length > 500) {
            $("#wrongtip17").text("最多可输入500个字，谢谢您的配合.");
            var hei = $('#wrongtip17').offset().top;
            $('html,body').animate({
                scrollTop: hei, opacity: 'fast'
            });
            return false;
        }
        return true
    };

    $(".startbtn").click(function () {
        if (validateAll()) {
            $("form")[0].submit(function () {
                return false
            })
        }
    });
});

function check(obj) {
    var j = 0;
    var el = $('input[name="question_7"][type="checkbox"]:checked');
    for (var i = 0; i < 8; i++) {
        if (el[i].checked == true)
            j++;
        if (j >= 4) {
            alert("最多只能选择3项");
            obj.checked = false;
        }
    }
};

function Checked(obj) {
    var j = 0;
    var el = $('input[name="question_12"][type="checkbox"]:checked');
    for (var i = 0; i < 8; i++) {
        if (el[i].checked == true)
            j++;
        if (j >= 4) {
            alert("最多只能选择3项");
            obj.checked = false;
        }
    }
};