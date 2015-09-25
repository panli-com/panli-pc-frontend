;(function ($) {
    jQuery.fn.CheckInput = function (opt) {
        opt = $.extend({
            tip: ""
        }, opt || {});
        var _this = $(this);
        if($.trim(_this.val()).length == 0)
            _this.val(opt.tip);
        if (opt) {
            _this.blur(function (e) {
                if ($.trim(_this.val()).length == 0) {
                    _this.val(opt.tip);
                }
            }).focus(function (e) {
                if (_this.val() == opt.tip) {
                    _this.val("");
                }
            });
        }
    }
})(jQuery);