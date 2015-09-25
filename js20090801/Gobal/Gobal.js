var Panli = {};
Panli.Overlay = {
    dom: $('<div></div>').css({ "position": "fixed", "bottom": 0, "top": 0, "left": 0, "right": 0, "background": "#000", "height": "100%", "width": "100%", "_position": "absolute", "z-index": 800,'display':'none'}),
    open: function (color) { if (color) { this.dom.css("background", color); } else { this.dom.css("background", "#000"); } this.dom.fadeTo(100, 0.56); },
    close: function () { this.dom.hide(); },
    init: function () { $(document.body).append(this.dom); }
}; //一键填单控件

Panli.divhtmldecode = $('<div></div>');

//全局方法
Panli.htmlDecode = function (str) {
    window.Panli.divhtmldecode.html(str);
    return window.Panli.divhtmldecode.text();
};
Panli.htmlEncode = function (str) {
    window.Panli.divhtmldecode.text(str);
    return window.Panli.divhtmldecode.html();
};

var HtmlEncode = Panli.htmlEncode;
var HtmlDecode = Panli.htmlEncode;
$(function () {
    Panli.Overlay.init();
});

