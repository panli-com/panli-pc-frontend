// JavaScript Document

var banner = {
    Interval: 5000, //�л����ʱ��
    Speed: 500, //�л��ٶ�
    Init: function () {
        if ($('.banenr_list li').length > 1) {
            this.Bind(); //���¼�
            this.SaveDataFun(); //����֧�������data-banner ����

            this.Animate.init(); //��ʼ����
        }
    },
    Bind: function () {
        var ban_img = $('.banenr_list li'),
            _this = this,
           len = this.Animate.length = ban_img.length;
        var text = '';
        for (var i = 0; i < len; i++) {
            //����Բ���html
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
        //��֤�Ƿ�֧��css3����  ��ʾ��֤���������    ����ֻ��֤����ǰ׺�����
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
                if (this.isTransition) {//�Ƿ�֧��css3ָ��2dת������   ֧�� ��css  ��֧����jquery animate
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
                //�����ж���ʱ  ��ֹ���
                if (_this.isAnimate) return false;
                _this.isAnimate = true;

                var stopNum = _this.stopNum,
                starNum = _this.starNum;

                if (isNaN(Indexs)) {//�Ƿ�Ϊ��� 
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

                var starDom = $('.banenr_list li').eq(starNum).css({ opacity: '1' }); //��ʾ���dom
                var stopDom = $('.banenr_list li').eq(stopNum); //�������dom

                //�л�Բ���class�ı��
                $('.banenr_dot span:eq(' + starNum + ')').addClass('on').siblings('span.on').removeClass('on');
                _this.animate(_this.saveData[starNum], 'star', banner.Speed); //������ʾ�Ķ���
                _this.animate(_this.saveData[stopNum], 'stop', banner.Speed); //���н�����Ķ���

                stopDom.animate({ opacity: '0' }, banner.Speed);

                setTimeout(function () {
                    //{����������Ĳ���
                    stopDom.css('zIndex', '0');
                    starDom.css('zIndex', '1');

                    //�����ı�Ÿ�ֵ
                    _this.stopNum = _this.starNum = starNum;

                    //���Ƿ������и�Ϊflase
                    _this.isAnimate = false;
                    //��ָ����ʱ������
                    _this.star = setTimeout(anmate, banner.Interval);
                }, banner.Speed)
            }
            anmate(lists);
        }
    },
    RegroupObj: function (str, obj) {//str������ϳ�style���Զ���
        var newobj = {};
        var strArr = str.match(/^([a-z]+):{([\s\S]+)}$/); //��ȡ��ʼ|�������ƺ�dom������ ��ʼ|������������style
        if (strArr.length >= 3) {
            var objName = strArr[1];

            if (!obj[objName])
                obj[objName] = {};

            var objD = obj[objName];

            var objStyle = strArr[2].split(/,(?=[\w:\s,\%]+|[\w:\s,\%]+\|{[\w:\s,{}\%]+)?/); //�ָ�style

            for (var i = 0, len = objStyle.length; i < len; i++) {
                if (objStyle[i] != '') {
                    var styleArr = objStyle[i].split(/:(?![\w\s,:%\.]+})/); //�ָ�style����������

                    var styleName = styleArr[0],
                    styleAttr = styleArr[1];
                    // styleName.split(/^[\w\s%\.\(\)]+\|/);

                    var styleCss3 = this.Animate.supportCss3(styleName),
                        isExist = /\|{/.test(styleArr);
                    if (isExist && !styleCss3 && !this.Animate.isTransition) {//����в���֧��css3���� ���߲�֧��isTransition����
                        this.RegroupObj(styleAttr.replace(/^[\w\s%\.\(\)]+\|/, objName + ':'), obj);
                    } else {//֧��css3���� ����  ��css3����
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
            $('.banenr_list li').eq(i).css(newcss); //���Ӷ�Ӧ��css

            var current = [];
            $("[data-banner]", ban_img[i]).each(function (j, t) {
                var $this = $(t),
                    data_banner = $this.attr("data-banner"); //��ȡ��ǰdom��data-banner������
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
                current[j] = newobj //����ÿ��domҪ��������  ������ʼ�����
            });
            saveData[i] = current; //����ÿ��banner��Ҫ����css����
        };
        this.Animate.saveData = saveData;
        return false;
    }

}
banner.Init();
