var Extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;
}
var CurrentStyle = function(element) {
    return element.currentStyle || document.defaultView.getComputedStyle(element, null);
}
var Bind = function(object, fun) {
    var args = Array.prototype.slice.call(arguments).slice(2);
    return function() {
        return fun.apply(object, args.concat(Array.prototype.slice.call(arguments)));
    }
}
var Tween = {
    Quart: {
        easeOut: function(t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        }
    },
    Back: {
        easeOut: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        }
    },
    Bounce: {
        easeOut: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        }
    }
}
var SlideTrans = function(container, slider, count, options) {
    this._slider = document.getElementById(slider);
    this._container = document.getElementById(container);
    this._timer = null;
    this._count = Math.abs(count);
    this._target = 0;
    this._t = this._b = this._c = 0;
    this.Index = 0;
    this.SetOptions(options);
    this.Auto = !!this.options.Auto;
    this.Duration = Math.abs(this.options.Duration);
    this.Time = Math.abs(this.options.Time);
    this.Pause = Math.abs(this.options.Pause);
    this.Tween = this.options.Tween;
    this.onStart = this.options.onStart;
    this.onFinish = this.options.onFinish;

    var bVertical = !!this.options.Vertical;
    this._css = bVertical ? "top" : "left";
    var p = CurrentStyle(this._container).position;
    p == "relative" || p == "absolute" || (this._container.style.position = "relative");
    this._container.style.overflow = "hidden";
    this._slider.style.position = "absolute";

    this.Change = this.options.Change ? this.options.Change :
		this._slider[bVertical ? "offsetHeight" : "offsetWidth"] / this._count;
};
SlideTrans.prototype = {
    SetOptions: function(options) {
        this.options = {
            Vertical: true,
            Auto: true,
            Change: 0,
            Duration: 50,
            Time: 10,
            Pause: 4000,
            onStart: function() { },
            onFinish: function() { },
            Tween: Tween.Quart.easeOut
        };
        Extend(this.options, options || {});
    },
    Run: function(index) {
        index == undefined && (index = this.Index);
        index < 0 && (index = this._count - 1) || index >= this._count && (index = 0);
        this._target = -Math.abs(this.Change) * (this.Index = index);
        this._t = 0;
        this._b = parseInt(CurrentStyle(this._slider)[this.options.Vertical ? "top" : "left"]);
        this._c = this._target - this._b;

        this.onStart();
        this.Move();
    },
    Move: function() {
        clearTimeout(this._timer);
        if (this._c && this._t < this.Duration) {
            this.MoveTo(Math.round(this.Tween(this._t++, this._b, this._c, this.Duration)));
            this._timer = setTimeout(Bind(this, this.Move), this.Time);
        } else {
            this.MoveTo(this._target);
            this.Auto && (this._timer = setTimeout(Bind(this, this.Next), this.Pause));
        }
    },
    MoveTo: function(i) {
        this._slider.style[this._css] = i + "px";
    },
    Next: function() {
        this.Run(++this.Index);
    },
    Previous: function() {
        this.Run(--this.Index);
    },
    Stop: function() {
        clearTimeout(this._timer); this.MoveTo(this._target);
    }
};
var forEach = function(array, callback, thisObject) {
    if (array.forEach) {
        array.forEach(callback, thisObject);
    } else {
        for (var i = 0, len = array.length; i < len; i++) { callback.call(thisObject, array[i], i, array); }
    }
}
$(function() {
    var l = $("#SlideTriggers li").length;
    var st = new SlideTrans("slidePanel", "marqueePic", l, { Vertical: false });

    $('#leftbtn').click(function() {
        var n = st.Index == 0 ? l - 1 : st.Index - 1;
        //st.Auto = false;
        st.Run(n);
        $("#SlideTriggers li").removeClass('yz_on');
        $("#SlideTriggers li:eq(" + n + ")").addClass('yz_on');
        return false;
    });

    $('#rightbtn').click(function() {
        var n = st.Index == l - 1 ? 0 : st.Index + 1;
        //st.Auto = false;
        st.Run(n);
        $("#SlideTriggers li").removeClass('yz_on');
        $("#SlideTriggers li:eq(" + n + ")").addClass('yz_on');

        return false;
    });

    $("#SlideTriggers li").each(function(i) { $(this).hover(function() { this.className = "yz_on"; st.Auto = false; st.Run(i); }, function() { this.className = ""; st.Auto = true; st.Run(); }); });
    st.onStart = function() {
        $("#SlideTriggers li").each(function(i) { this.className = st.Index == i ? "yz_on" : ""; });
    }
    st.Run();

    //搜索按钮点击
    $('#searchBtn').click(function() {
        if ($('#cowrySearchKey').hasClass('m_hui')) {
            window.location = '/Cowry/List.aspx';
            return false;
        }
        if ($.trim($('#cowrySearchKey').val()).length <= 0) {
            window.location = '/Cowry/List.aspx';
            return false;
        }
        window.location = '/Cowry/List.aspx?k=' + encodeURIComponent($.trim($('#cowrySearchKey').val()));
        return false;
    });
    //搜索框回车事件
    $('#cowrySearchKey')
    .focus(function() {
        if ($('#cowrySearchKey').hasClass('m_hui'))
            $('#cowrySearchKey').removeClass('m_hui').val('');
    })
    .blur(function() {
        var k = $.trim($('#cowrySearchKey').val());
        if (k.length <= 0 || k == '') {
            $('#cowrySearchKey').addClass('m_hui').val('输入关键字');
        }
    })
    .keydown(function(e) {
        if (e.keyCode == 13) {
            $('#searchBtn').click();
            return false;
        }
    });

});

function geilivible(id, dom) {
    $.ajax({
        type: "POST",
        url: "/App_Services/wsCowry.asmx/AddWellNumber",
        dataType: "json",
        contentType: "application/json;utf-8",
        data: "{\"id\":" + id + "}",
        timeout: 10000,
        error: function() { alert("网络错误，请稍后重试。"); },
        success: function(res) {
            var now = new Date();
            if (res.d == "Success") {
                window.Panli.Message.show('给栗成功！');
                $('span', $(dom)).text(parseInt($('span', $(dom)).text()) + 1);
                return;
            }
            if (res.d == "noLogin") {
                window.Panli.Login();
            }
            if (res.d == "Oneself") {
                alert('不能给栗自己的宝贝！');
            }
            if (res.d == "Welled") {
                alert('这个商品你已经给栗过了！');
            }
            if (res.d == "Limit") {
                alert('你今天给栗次数到上限了！');
            }
            if (res.d == "NotFoundShare") {
                alert('没有找到要给力的宝贝！');
            }
            if (res.d == "Error") {
                alert('系统错误！');
            }
        }
    });
}