$(function(){var A=function(){var B=$("#CouponCode").val();if(B.length>0){$.ajax({type:"POST",url:"/App_Services/wsFrock.asmx/AuCoupon",dataType:"json",contentType:"application/json;utf-8",data:'{"Code":"'+B+'"}',timeout:10000,beforeSend:function(){$("#ReceiveCoupon").unbind("click",A)},complete:function(){$("#ReceiveCoupon").bind("click",A)},error:function(){alert("领取优惠劵发生了错误，请重试!")},success:function(C){if(C.d=="success"){alert("恭喜您！成功领取到了20元优惠劵一张，马上去“我的优惠劵”查看。");window.location.href="http://www.panli.com/mypanli/Coupon/";return false}if(C.d=="collected"){alert("您已经领取过了，去“我的优惠劵”查看。");window.location.href="http://www.panli.com/mypanli/Coupon/";return false}if(C.d=="fail"){alert("领取失败！");return false}if(C.d=="vaildataError"){alert("您输入的优惠劵代码有误，请核实。");return false}if(C.d=="notInRangn"){alert("优惠劵已领完。");window.location.href="http://www.panli.com/";return false}if(C.d=="notLogin"){alert("请登录或注册后领取！");window.Panli.Login();return false}alert("领取失败！")}})}else{alert("请输入您的优惠劵代码!")}};$("#ReceiveCoupon").bind("click",A)});