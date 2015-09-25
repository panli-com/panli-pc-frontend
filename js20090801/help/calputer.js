String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/, '');
}
var Class = function (className, dom) {
    dom = dom || document;
    var domall = dom.getElementsByTagName('*'),
                domArr = [];

    var rel = new RegExp("^([\\\w\\\s-]+\\\s+)?" + className + "(\\\s+[\\\w\\\s-]+)?$");
    for (var i = 0, len = domall.length; i < len; i++) {

        if (rel.test(domall[i].className.trim()))//&&domall[i].className.indexOf(className) >= 0
            domArr.push(domall[i]);
    }
    return domArr;
}
function calputer(dom) {
    var _this = this;
    this.dom = dom;
    this.domid = document.getElementById('calputer');

    //dom节点
    this.importDom = Class('import', dom)[0], // document.getElementById('import'),
            this.resultDom = Class('result', dom)[0]; // document.getElementById('result');
    //正则表达

    var li = dom.getElementsByTagName('li');

    for (var i = 0, len = li.length; i < len; i++) {
        if (li[i].className.indexOf('btn-str') < 0)
            li[i].onclick = function () {
                var val = this.innerHTML.trim();
                /^[0-9\.]$/.test(val) ? _this.numbers(val) :
                        /^[\/\*\-\+]$/.test(val) ? _this.calculate(val) :
                        /^\=$/.test(val) ? _this.equal() : '';
            }
    };

    Class('btnBack', dom)[0].onclick = function () { _this.back(); };
    Class('btnCls', dom)[0].onclick = function () { _this.cls(); };
    Class('btnClose', dom)[0].onclick = function () { _this.close(); };
    Class('btnOk', dom)[0].onclick = function () { _this.ok(); };
    this.domid.onfocus = function () { _this.open(); }
};
calputer.prototype = {
    symbol: '',
    newnum: 0,
    oldnum: 0,
    position: function () {
        var domid = $(this.domid),
            domidPar = $(domid).parent();
        

    },
    calculate: function (val) {
        this.equal();
        this.symbol = val;
        this.resultDom.innerHTML = this.oldnum + val;

    },
    equal: function () {
        var symbol = this.symbol,
                oldnum = this.oldnum,
                newnum = this.newnum,
                importDom = this.importDom,
                resultDom = this.resultDom;

        if (symbol != '' && oldnum != 0 && newnum != 0 && /^[0-9]+(\.[0-9]+)?$/.test(newnum)) {
            resultDom.innerHTML = this.oldnum = eval(oldnum + symbol + newnum);
            importDom.innerHTML = this.newnum = 0;
            this.symbol = '';
        } else if (newnum > 0 && /^[0-9]+(\.[0-9]+)?$/.test(newnum)) {

            resultDom.innerHTML = this.oldnum = parseFloat(newnum);
            importDom.innerHTML = this.newnum = 0;
        }
    },
    numbers: function (val) {
        var importDom = this.importDom,
                resultDom = this.resultDom;

        if (this.symbol == '') { resultDom.innerHTML = ''; this.oldnum = 0 };

        var num = importDom.innerHTML + val;

        if (!/^[0-9]+(\.[0-9]*)?$/.test(num)) return false;

        if (/^0[1-9]|^0{2,}/.test(num)) num = num.replace(/^0/, '');

        importDom.innerHTML = num;

        this.newnum = num;
    },
    open: function () {
        this.dom.style.display = 'block';
    },
    back: function () {
        var newnum = this.newnum;
        if (newnum <= 0) return false;

        newnum = newnum.replace(/[0-9\.]$/, '');

        this.importDom.innerHTML = this.newnum = newnum == '' ? 0 : newnum;
    },
    cls: function () {
        this.importDom.innerHTML = this.newnum = this.oldnum = 0;
        this.symbol = this.resultDom.innerHTML = '';
    },
    close: function () {
        this.dom.style.display = 'none';
        this.cls();
    },
    ok: function () {
        this.equal();
        this.domid.value = this.oldnum;
        this.close();
    }

}