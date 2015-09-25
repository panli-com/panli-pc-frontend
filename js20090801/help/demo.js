$(document).ready(function() {

if (self.location.href.indexOf("recharge-alipay-3-2.aspx") > 0 ||self.location.href.indexOf("recharge-alipay-3-1.aspx") > 0) {
     $(".diy_2").mouseover(function() {
        $(".diy_next").show();
    });
    $(".diy_2").mouseout(function() {
    $(".diy_next").show();
    });
}else{
     $(".diy_1").mouseover(function() {
        $(".diy_next").show();
    });
    $(".diy_1").mouseout(function() {
        $(".diy_next").hide();
    });
}   
    $(".diy_next").mouseover(function() {
        $(".diy_next").show();
    });
    $(".diy_next").mouseout(function() {
        $(".diy_next").hide();
    });
    if (self.location.href.indexOf("buyself") > 0) {
        $("#DemoLink").val("buyself-step1-1.aspx");
    }
    if (self.location.href.indexOf("daigou") > 0) {
        $("#DemoLink").val("daigou-step1-1.aspx");
    }
    if (self.location.href.indexOf("recharge") > 0) {
        $("#DemoLink").val("recharge-alipay-1.aspx");
    }
    if (self.location.href.indexOf("register") > 0) {
        $("#DemoLink").val("register-alipay-1.aspx");
    }
    if (self.location.href.indexOf("IntlTTransport") > 0) {
        $("#DemoLink").val("IntlTTransport-step1.aspx");
    }
    $("#DemoLink").bind("change", function() { self.location.href = $(this).val(); });
});