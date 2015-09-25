

(function () {
    var country = {
        init: function (callback) {
            var list = this.countryList;
            if (list) {
                callback(list);
            } else {
                this.callback.push(callback);
                this.getList();
            }
            return false;
        },
        callback: [],
        getSuccess: function (list) {
            this.countryList = list;
            var callback = this.callback;
            for (var i = 0, len = callback.length; i < len; i++) {
                callback[i](list);
            }
        },
        getList: function () {
            var _this = this;
            if (this.isget) return false;
            this.isget = true;
            $.ajax({
                type: "POST",
                contentType: "application/json;utf-8",
                url: "/App_Services/wsShip.asmx/GetCountry",
                cache: false,
                dataType: "json",
                timeout: 15000,
                error: function () { alert('获取列表失败,请稍后再试'); },
                complete: function () { },
                success: function (r) {
                    _this.getSuccess(r.d);
                }
            });
        }
    };
    window['countrylist'] = function (call) { country.init(call) };
})();


(function () {
    var contrydiv = $("<div class='tcbox'><div class='country'><div class='zimu'><ul></ul></div><div class='gj_name'></div></div></div>").click(function () { return false; });
    Frequently = '常见收货区域'; //常用国家名称
    var SaveData = {};
    var $current = '';
    var Countrys = {
        init: function (data) {
            var _this = this;
            this.getCountType(data);
            $(document).click(function () { _this.action.hide(); });
        },
        getCountType: function (CountryList) {
            CountryList.sort(function (a, b) { return b.Order - a.Order });
            var newCountryType = {}, TypeName = [];
            for (var i = 0; i < CountryList.length; i++) {//国家按名称分类
                var present = CountryList[i];
                if (!newCountryType[present.Initial]) {
                    TypeName.push(present.Initial);
                    newCountryType[present.Initial] = [];
                }
                newCountryType[present.Initial].push(present);
                if (present.Status == 1) {//保存默认国家分类
                    if (!newCountryType[Frequently]) {
                        newCountryType[Frequently] = [];
                    }
                    newCountryType[Frequently].push(present);
                }
            };
            SaveData.CountryType = newCountryType;
            TypeName.sort();
            this.getNavHtml([Frequently].concat(TypeName.pop(), TypeName));

        },
        getNavHtml: function (TypeName) {
            var TypeHtml = '', _this = this;
            for (var i = 0; i < TypeName.length; i++) {
                TypeHtml += '<li class=""><a href="javascript:;" class="' + (i < 2 ? "w90" : "w35") + '">' + TypeName[i] + '</a></li>';
            };

            var TypeNameHtml = $('<ul>' + TypeHtml + '</ul>').find('li').on('click', function () {
                if ($(this).hasClass('c_on')) return false;
                var contryNameDom = $(this).parents('.country').find('.gj_name');
                $(this).addClass('c_on').siblings('.c_on').removeClass('c_on');
                contryNameDom.empty().append(_this.getTypeHtml($.trim($(this).text())));
                return false;
            });
            contrydiv.find('.zimu').append(TypeNameHtml);
            return false;
        },
        getTypeHtml: function (Type) {//国家类型方法，传入类型名如（A）反回A的所有国家名称Html
            var _this = this,
                CountryHtml = '',
                SaveDataType = SaveData.CountryHtml;
                SaveDataType?'':SaveDataType={};//如果没有对象 创建一个对象
            if (SaveDataType && SaveDataType[Type]) {//如果存储数据有就直接取数据
                CountryHtml = SaveDataType[Type];//取数据
            } else {//无数据生成并赋方法；
                CountryHtml = $('<ul></ul>');
                var Country = SaveData.CountryType[Type];
                for (var i = 0; i < Country.length; i++) {
                    CountryHtml.append('<li data-countryid="' + Country[i].ShipCountryId + '"><a href="javascript:;">' + Country[i].CountryName + '</a></li>');

                }
                CountryHtml.find('li').click(function () {
                    $current.val($.trim($(this).text())); //赋值给表单;
                    _this.action.hide();
                    _this.para.callback($(this).attr('data-countryid'));
                    return false;
                });
                SaveDataType[Type] = CountryHtml;
            };
            return CountryHtml;
        },
        action: {
            hide: function () {//隐藏层
                contrydiv.animate({ "height": "0px", "width": "0px" }, 300, function () { contrydiv.hide().css({ "height": "auto", "width": "622px" }); });
            },
            show: function () {
                contrydiv.css({ "height": "0px", "width": "0px" }).show().animate({ "height": "139px", "width": "622px" }, 500, function () { contrydiv.css("height", "auto"); });
            } 
        }

    }

   countrylist(function(list){ 
          Countrys.init(list);
          jQuery.fn.Country = function (obj) {
        var para = {
            callback: function () { return false; }
        }
        $.extend(para, obj);
        var $this = this;
        $this.on('click', function () {
            var $input = $current = $(this);

            Countrys.para = para;
            if ($input.nextAll('.tcbox:visible').length > 0) return false;
            if ($input.nextAll('.tcbox').length <= 0) {
                $input.after(contrydiv).parent().css({ 'position': 'relative' });
                $input.nextAll('.tcbox').css({//设置国家层的位置
                    zIndex: 10,
                    left: $input.offset().left - $input.parent().offset().left + 'px',
                    top: $input.offset().top - $input.parent().offset().top + this.offsetHeight + 1 + 'px'//加1表示国家列表与输入框间隔1个像素
                })
            };
            contrydiv.find('.zimu li:eq(0)').click();
            Countrys.action.show();
            return false;
        });
        return this;
    }
   });
})();