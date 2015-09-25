// JavaScript Document

var banner = {
    Interval: 5000, //切换间隔时间
    Speed: 500, //切换速度
    Init: function () {
        if ($('.banenr_list li').length > 1) {
            this.Bind(); //绑定事件
            this.SaveDataFun(); //保存支点的所有data-banner 属性

            this.Animate.init(); //开始动画
        }
    },
    Bind: function () {
        var ban_img = $('.banenr_list li'),
            _this = this,
           len = this.Animate.length = ban_img.length;
        var text = '';
        for (var i = 0; i < len; i++) {
            //生成圆点的html
            text += '<span' + (i == 0 ? ' class="on"' : '') + '>&nbsp;</span> ';
        }
        $('.banenr_dot').html(text);

        $('.banner').hover(function () {
            $('.banner_f_l,.banner_f_r').addClass('j_show');
        }, function () {
            $('.banner_f_l,.banner_f_r').removeClass('j_show');
        });

        $('.banner_f_l').on('click', function () {
            _this.Animate.stop();
            _this.Animate.init(--_this.starNum);
        });
        $('.banner_f_r').on('click', function () {
            _this.Animate.stop();
            _this.Animate.init();
        });

        $('.banenr_dot span').on('click', function () {
            if ($(this).hasClass('on')) return false;
            _this.Animate.stop();
            _this.Animate.init($(this).index());
        })
    },
    Animate: {
        //验证是否支持css3属性  表示验证所有浏览器    否则只验证不带前缀浏览器
        supportCss3: function (style) {
            var prefix = ['webkit', 'moz', 'o'],
                humpStyle = document.documentElement.style;

            function replaces(str) {
                return str.replace(/-(\w)/g, function ($0, $1) {
                    return $1.toUpperCase();
                });
            }
            for (var i = 0, len = prefix.length + 1; i < len; i++) {
                var styleName = '';

                styleName = i == 0 ? style : replaces(prefix[i - 1] + '-' + style);

                if (styleName in humpStyle) return styleName;
            }
            return false;
        },
        star: function () { },
        stop: function () {
            clearTimeout(this.star);
        },
        starNum: -1,
        stopNum: -1,
        animate: function (arr, type, speed) {
            if (!arr || arr.length <= 0) return false;
            for (var i = 0, len = arr.length; i < len; i++) {
                if (this.isTransition) {//是否支持css3指定2d转换属性   支持 用css  不支持用jquery animate
                    $(arr[i].dom).css(arr[i][type]);
                } else {
                    $(arr[i].dom).animate(arr[i][type], speed);
                }
            };
            return false;
        },
        init: function (lists) {
            var dom = $('.banenr_list'), _this = this, len = _this.length;
            function anmate(Indexs) {
                //在运行动画时  禁止点击
                if (_this.isAnimate) return false;
                _this.isAnimate = true;

                var stopNum = _this.stopNum,
                starNum = _this.starNum;

                if (isNaN(Indexs)) {//是否为点击 
                    starNum++;
                    if (starNum >= len) {
                        starNum = 0;
                    };
                } else {
                    if (starNum >= len) {
                        starNum = 0;
                    };

                    if (starNum < 0) {
                        starNum = len - 1;
                    };
                    starNum = Indexs;
                }

                var starDom = $('.banenr_list li').eq(starNum).css({ opacity: '1' }); //显示层的dom
                var stopDom = $('.banenr_list li').eq(stopNum); //结束层的dom

                //切换圆点的class的变幻
                $('.banenr_dot span:eq(' + starNum + ')').addClass('on').siblings('span.on').removeClass('on');
                _this.animate(_this.saveData[starNum], 'star', banner.Speed); //运行显示的动画
                _this.animate(_this.saveData[stopNum], 'stop', banner.Speed); //运行结束层的动画

                stopDom.animate({ opacity: '0' }, banner.Speed);

                setTimeout(function () {
                    //{动画结束后的操作
                    stopDom.css('zIndex', '0');
                    starDom.css('zIndex', '1');

                    //结束的编号赋值
                    _this.stopNum = _this.starNum = starNum;

                    //把是否在运行改为flase
                    _this.isAnimate = false;
                    //在指定的时间运行
                    _this.star = setTimeout(anmate, banner.Interval);
                }, banner.Speed)
            }
            anmate(lists);
        }
    },
    RegroupObj: function (str, obj) {//str重新组合成style属性对象
        var newobj = {};
        var strArr = str.match(/^([a-z]+):{([\s\S]+)}$/); //获取开始|结束名称和dom的所以 开始|结束类型所以style
        if (strArr.length >= 3) {
            var objName = strArr[1];

            if (!obj[objName])
                obj[objName] = {};

            var objD = obj[objName];

            var objStyle = strArr[2].split(/,(?=[\w:\s,\%]+|[\w:\s,\%]+\|{[\w:\s,{}\%]+)?/); //分割style

            for (var i = 0, len = objStyle.length; i < len; i++) {
                if (objStyle[i] != '') {
                    var styleArr = objStyle[i].split(/:(?![\w\s,:%\.]+})/); //分割style名称与属性

                    var styleName = styleArr[0],
                    styleAttr = styleArr[1];
                    // styleName.split(/^[\w\s%\.\(\)]+\|/);

                    var styleCss3 = this.Animate.supportCss3(styleName),
                        isExist = /\|{/.test(styleArr);
                    if (isExist && !styleCss3 && !this.Animate.isTransition) {//如果有并不支持css3属性 或者不支持isTransition属性
                        this.RegroupObj(styleAttr.replace(/^[\w\s%\.\(\)]+\|/, objName + ':'), obj);
                    } else {//支持css3属性 或者  无css3属性
                        styleName = styleCss3;
                        objD[styleName] = styleAttr.replace(/\|[\s\S]+$/, '');
                    }
                }
            }
        }
        return obj;
    },
    SaveDataFun: function () {
        var ban_img = $('.banenr_list li'),
            _this = this,
            saveData = [];
        var isTransition = this.Animate.supportCss3('transition');
        this.Animate.isTransition = !!isTransition;
        for (var i = 0, len = ban_img.length; i < len; i++) {
            var newcss = {};
            if (i != 0) {
                newcss['opacity'] = 0;
                newcss['zIndex'] = 0;
            } else {
                newcss['zIndex'] = 1;
            }
            $('.banenr_list li').eq(i).css(newcss); //增加对应的css

            var current = [];
            $("[data-banner]", ban_img[i]).each(function (j, t) {
                var $this = $(t),
                    data_banner = $this.attr("data-banner"); //获取当前dom的data-banner的属性
                $this.removeAttr("data-banner");

                data_banner = data_banner.split(/,(?=[a-z]*\:\{)|,$/ig); //

                var newobj = { dom: t, star: {}, stop: {} };
                for (var h = 0, leng = data_banner.length; h < leng; h++) {
                    if (data_banner[h] != '') {
                        _this.RegroupObj(data_banner[h], newobj);
                    }
                }

                $this.css(newobj.stop);
                if (isTransition) {
                    $this.css(isTransition, 'all ' + _this.Speed + 'ms ease-out');
                }
                current[j] = newobj //保存每个dom要动的属性  包括开始与结束
            });
            saveData[i] = current; //保存每个banner需要动的css对象
        };
        this.Animate.saveData = saveData;
        return false;
    }

}
banner.Init();
