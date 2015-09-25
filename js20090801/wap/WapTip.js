;(function($){ 

    jQuery.fn.CheckInput = function(opt){
        
        opt = $.extend({
             tip : "",
             action : "keydown" //   blur,keydown
        },opt || {});

        var _this = $(this);
        _this.val(opt.tip);
        if(opt)
        {
            switch(opt.action)
            {
                case "keydown":
                {
                    _this.bind("keydown",function(e){ alert(e);});
                    break;
                }
                case "blur":
                {
                    _this.bind("blur",function(){
                        if(_this.val() == opt.tip)
                        {
                            _this.val("");
                        }
                    });
                    break;
                }
                default:
                    break;
            }
        }
    }
})(jQuery);

$(function(){
    
    $("input[name=txtUserName]").CheckInput({ tip : "请输入注册时填写的用户名/邮箱"});

});