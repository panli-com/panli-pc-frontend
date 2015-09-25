$(document).ready(function() {
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
        p == "relative" || p == "absolute" || (this._container.style.position = "absolute");
        //this._container.style.overflow = "hidden";
        $(this._container).height("275px");
        $(this._slider).height($(this._slider).children("li").length * 275);
        this._slider.style.position = "absolute";

        this.Change = 275;
    };
    SlideTrans.prototype = {
        SetOptions: function(options) {
            this.options = {//默认值
                Vertical: true, //是否垂直方向（方向不能改）
                Auto: true, //是否自动
                Change: 0, //改变量
                Duration: 50, //滑动持续时间
                Time: 10, //滑动延时
                Pause: 4000, //停顿时间(Auto为true时有效)
                onStart: function() { }, //开始转换时执行
                onFinish: function() { }, //完成转换时执行
                Tween: Tween.Quart.easeOut//tween算子
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
        var st = new SlideTrans("SlidePlayer", "Slides", $("#Slides li").length, { Vertical: true });
        $(".SlideTriggers li").each(function(i) { $(this).hover(function() { this.className = "Current"; st.Auto = false; st.Run(i); }, function() { this.className = ""; st.Auto = true; st.Run(); }); });
        st.onStart = function() {
            $(".SlideTriggers li").each(function(i) { this.className = st.Index == i ? "Current" : ""; });
        }
        st.Run();
    });


    $(".ph dl").each(function() { $(this).mouseover(function() { $(".ph dl dt").hide(); $(".ph dl dd").show(); $(this).find("dd").hide(); $(this).find("dt").show(); }); });
    $(".ph dl:eq(0)").mouseover();
});
