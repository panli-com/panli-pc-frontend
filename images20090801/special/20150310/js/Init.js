document.domain = "panli.com";

var dtouchmove = function (e) { e.preventDefault(); };
document.addEventListener('touchmove', dtouchmove, false);

window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };
})();

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var loadUrl = ['P01_panda@2x.png', 'P01_plane@2x.png', 'btn_gray@2x.png', 'P02_panda@2x.png', 'P02_leaf@2x.png', 'P03_panda@2x.png', 'P03_panda2@2x.png', 'P04_panda_body@2x.png', 'P04_panda_box@2x.png', 'P04_panda_head@2x.png', 'P04_takeaway@2x.png', 'P04_angry@2x.png', 'P04_late@2x.png', 'P04_sorry@2x.png', 'P05_panda@2x.png', 'P05_people1@2x.png', 'P05_people2@2x.png', 'P05_people3@2x.png', 'P07_panda@2x.png', 'P08_panda@2x.png', 'P08_people1@2x.png', 'P08_people2@2x.png', 'P08_people3@2x.png', 'P09_crown@2x.png', 'P09_letter@2x.png', 'P09_panda@2x.png', 'P10_panda@2x.png', 'P10_letter@2x.png', 'P10_love@2x.png', 'P11_gril@2x.png', 'P11_panda@2x.png', 'P11_snow@2x.png', 'P12_logo@2x.png', 'P12_box@2x.png', 'P12_arrow@2x.png', 'btn_pink@2x.png']; //保存的图片
function loadimg(url, fun) {
    var newimg = new Image();
    newimg.crossOrigin = "Anonymous";
    newimg.onload = fun;
    newimg.onerror = fun;
    newimg.src = 'http://sf.panli.com/FrontEnd/images20090801/special/20150310/' + url + '?v=1';
    if (newimg.complete || newimg.complete === undefined) {
        newimg.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        newimg.src = 'http://sf.panli.com/FrontEnd/images20090801/special/20150310/' + url;
    }
}

var i = 0;
function loadarr() {
    loadimg(loadUrl[i], function () {
        loadUrl[i] = this;
        i++;
        if (!loadUrl[i]) {
            setp_next();
            $('.loading').remove();
        } else {
            loadarr();
        }
    })
}
loadarr();
var fontColor = '#333'; //字体默认颜色
var step_save = {//保存的参数  index当前第几步 toDataUrl保存上一步截屏
    index: 0,
    toDataUrl: ''
};
function setp_next() {
    if (step[step_save.index]) {
        var newimg = new Image();
        newimg.src = step_save.toDataUrl;
        step[step_save.index](newimg);
    }
}
/* 动画执行默认属性star*/
var toTime = 20, //切换的时间
    bgColor = '#ebebeb', //背景颜色
                nextImg = '', //下一步按钮的图像
                isAnimate = false; //动画是否正在执行
var init = function (obj) {
    this.para = obj;
    if (obj.toData) {
        this.para.toData = new img({ src: obj.toData, coord: [[0, 0], [0, -960]], time: toTime });
        this.para.imgnext = new img({ src: nextImg, coord: [[280, 1780], [280, 820]], time: toTime });
    }
    var _this = this;
    isAnimate = true;
    requestAnimFrame(function () { _this.setAnimate() });
}
init.prototype = {
    para: {},
    time: 0,
    endtime: 0,
    setAnimate: function () {
        var _this = this;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 640, 960);
        _this.para.animate(_this);
        if (_this.para.toData) {
            _this.tRange(_this.para.toData, 0, toTime);
            _this.tRange(_this.para.imgnext, 0);
        }
        if (_this.time >= _this.para.endtime) {
            step_save.index++;

            try {
                step_save.toDataUrl = c.toDataURL();
            } catch (err) {
                //alert(err.message);
            }
            isAnimate = false;

            if (step_save.index == 1) {
                setp_next();
            }
            if (step_save.index == 6) {
                $('body').css('background', '#fdd5d6');
            }

            return false;
        }
        requestAnimFrame(function () { _this.setAnimate(); _this.time++; });
    },
    tRange: function (fun, star, end) {
        var time = this.time;
        if (time >= star && ((end && end >= time) || !end)) {
            fun.animate();
        }
    }
}
/* 动画执行默认属性end*/

/*动画步骤执行方法star*/
var step = [function () {
    nextImg = loadUrl[2];
    var page1_text1 = new text({ text: '那年夏天,拉着行李箱,', coord: [[400, 100], [100, 100]], font: [{ font: 36}], scale: [0, 1], opacity: [0, 1], time: 30, isWhole: false });
    var page1_text1Hide = new text({ text: '那年夏天,拉着行李箱,', coord: [100, 100], font: [{ font: 36}], opacity: [1, 0], time: 5 });
    var page1_text2 = new text({ text: '我离开了家', coord: [[400, 160], [170, 160]], font: [{ font: 48}], scale: [0, 1], opacity: [0, 1], time: 30, isWhole: false });
    var page1_text2Hide = new text({ text: '我离开了家', coord: [170, 160], font: [{ font: 48}], opacity: [1, 0], time: 5 });

    var imgPanda = new img({ src: loadUrl[0], coord: [[700, 300], [170, 300]], time: 40 });
    var imgPandaNew = new img({ src: loadUrl[0], coord: [700, 300], time: 5, opacity: [1, 0] });
    var imgPlane = new img({ src: loadUrl[1], coord: [[-2800, 50], [800, 50]], time: 80 });
    var imgnext = new img({ src: nextImg, coord: [280, 820], time: 40 });

    new init({
        animate: function (othis) {

            othis.tRange(imgPanda, 0, 100);
            othis.tRange(imgPandaNew, 100);
            othis.tRange(imgnext, 0);

            var page1Time = 120;
            othis.tRange(page1_text1, 0, page1Time);
            othis.tRange(page1_text2, 0, page1Time);
            othis.tRange(page1_text1Hide, page1Time);
            othis.tRange(page1_text2Hide, page1Time);

            othis.tRange(imgPlane, 60, 160);
        },
        endtime: 180
    });
},

      function (toData) {
          var page2_text1 = new text({ text: '开始一个人', coord: [[170, 60], [170, 90]], font: [{ font: 48}], opacity: [0, 1], time: 30 });
          var page2_text2 = new text({ text: '海外漂着的苦逼日子', coord: [[120, 130], [120, 160]], font: [{ font: 36}], opacity: [0, 1], time: 30 });
          var imgPlane = new img({ src: loadUrl[1], coord: [[-600, -50], [720, 250]], time: 40, scale: [0.3, 0.3] });
          var page2_img1 = new img({ src: loadUrl[3], coord: [[360, 200], [170, 300]], time: 40, scale: [0, 1] });
          var page2_img2 = new img({ src: loadUrl[4], coord: [[640, 380], [60, 680]], time: 40, angle: [0, 75] });
          var imgnext = new img({ src: loadUrl[2], coord: [280, 820], time: 40 });

          new init({
              animate: function (othis) {
                  othis.tRange(imgPlane, 20, 60);
                  othis.tRange(page2_img1, 55);
                  othis.tRange(page2_text1, 90);
                  othis.tRange(page2_text2, 120);
                  othis.tRange(page2_img2, 150);

                  othis.tRange(imgnext, 0);
              },
              endtime: 220
          });
      },
         function (toData) {
             var page3_img1 = new img({ src: loadUrl[5], coord: [[170, 1110], [170, 150]], time: toTime });
             var page3_img2 = new img({ src: loadUrl[6], coord: [170, 150], time: 20, opacity: [0, 1] });
             var page3_text1 = new text({ text: '“异域美食”都是什么鬼', coord: [[80, 700], [80, 670]], font: [{ font: 36}], opacity: [0, 1], time: 30 });
             var page3_text2 = new text({ text: '根本又贵又难吃', coord: [[120, 770], [120, 740]], font: [{ font: 48}], opacity: [0, 1], time: 30 });
             var page3_line = [],
                 lineX = 40;
             for (var i = 0; i < 16; i++) {
                 var height = Math.random() * 150 + 200;
                 page3_line.push(new line({ coord: [[lineX, 0], [lineX, height]], size: 10, time: 40, color: '#666' }));
                 lineX += 37;
             }
             new init({
                 animate: function (othis) {
                     for (var i = 0, len = page3_line.length; i < len; i++) {
                         page3_line[i]
                         othis.tRange(page3_line[i], 190);
                     }
                     othis.tRange(page3_img1, 0, 170);
                     othis.tRange(page3_img2, 150);
                     othis.tRange(page3_text1, 80);
                     othis.tRange(page3_text2, 110);
                 },
                 endtime: 280,
                 toData: toData
             });

         },
         function (toData) {
             var page4_text1 = new text({ text: '“穷”是一剂良药', coord: [80, 80], font: [{ font: 36 }, { text: '穷', font: 60 }, { text: '”', font: 60 }, { text: '“', font: 60}], opacity: [0, 1], time: 30 });
             var page4_text2 = new text({ text: '专治十来年的公主病', coord: [100, 140], font: [{ font: 36}], opacity: [0, 1], time: 30 });
             var page4_img1 = new img({ src: loadUrl[7], coord: [[-300, 540], [100, 540]], time: 30 }),
                 page4_img2 = new img({ src: loadUrl[8], coord: [[-214, 238], [186, 238]], time: 30 }),
                 page4_img3 = new img({ src: loadUrl[9], coord: [[-287, 330], [113, 330]], time: 30 }),
                 page4_img8 = new img({ src: loadUrl[9], coord: [[113, 330], [113, 358]], time: 20 }),
                 page4_img4 = new img({ src: loadUrl[10], coord: [[-370, 200], [30, 200]], time: 30 }),
                 page4_img5 = new img({ src: loadUrl[11], coord: [[770, 600], [470, 600]], scale: [0.6, 1], time: 20 }),
                 page4_img6 = new img({ src: loadUrl[12], coord: [[650, 420], [350, 410]], scale: [0.6, 0.9], angle: [-20, -20], time: 20 }),
                 page4_img7 = new img({ src: loadUrl[13], coord: [[220, 420], [50, 250]], angle: [0, -15], opacity: [0, 1], scale: [0, 1], time: 20 });

             new init({
                 animate: function (othis) {
                     othis.tRange(page4_text1, 40);
                     othis.tRange(page4_text2, 80);

                     othis.tRange(page4_img1, 80);
                     othis.tRange(page4_img3, 80, 160);
                     othis.tRange(page4_img8, 160);
                     othis.tRange(page4_img2, 80);
                     othis.tRange(page4_img4, 80);

                     othis.tRange(page4_img6, 120);
                     othis.tRange(page4_img5, 120);
                     othis.tRange(page4_img7, 160);
                 },
                 endtime: 220,
                 toData: toData
             });

         },
         function (toData) {
             var page5_text1 = new text({ text: '作为外国人眼中的“老外”', coord: [80, 680], font: [{ font: 36}], opacity: [0, 1], time: 30 });
             var page5_text2 = new text({ text: '很容易“特别”到没有朋友', coord: [15, 750], font: [{ font: 36 }, { text: '特', font: 60 }, { text: '别', font: 60 }, { text: '”', font: 60 }, { text: '“', font: 60}], opacity: [0, 1], time: 30 });
             var page5_img1 = new img({ src: loadUrl[14], coord: [[170, 1240], [170, 280]], time: toTime }),
                 page5_img2 = new img({ src: loadUrl[15], coord: [350, 200], opacity: [0, 1], time: 30 }),
                 page5_img3 = new img({ src: loadUrl[16], coord: [60, 120], opacity: [0, 1], time: 30 }),
                 page5_img4 = new img({ src: loadUrl[17], coord: [300, 10], opacity: [0, 1], time: 30 });
             new init({
                 animate: function (othis) {
                     othis.tRange(page5_img2, 140);
                     othis.tRange(page5_img3, 190);
                     othis.tRange(page5_img4, 240);
                     othis.tRange(page5_img1, 0);
                     othis.tRange(page5_text1, 60);
                     othis.tRange(page5_text2, 100);
                 },
                 endtime: 300,
                 toData: toData
             });
         },
         function (toData) {
             var page6_text1 = new text({ text: '但是', coord: [[220, 1160], [220, 200]], font: [{ font: 64}], time: toTime }),
                 page6_text2 = new text({ text: '变成', coord: [220, 470], font: [{ font: 64}], opacity: [0, 1], time: 30 });
             var page6_line = new line({ coord: [[0, 960], [0, 0]], size: 1280, time: 60, color: '#fdd5d6' });
             var str1 = '我要逆袭'.split(''),
                 str2 = '人生赢家'.split(''),
                 str1Arr = [],
                 str2Arr = [],
                 coord1 = 90,
                 coord2 = -20;
             for (var i = 0, len = str1.length; i < len; i++) {
                 str1Arr.push(new text({ text: str1[i], coord: [coord1, 310], font: [{ font: 90}], opacity: [0, 1], scale: [4, 1], weight: true, time: 5 }));
                 str2Arr.push(new text({ text: str2[i], coord: [coord2, 600], font: [{ font: 130}], opacity: [0, 1], scale: [4, 1], weight: true, color: '#ff0000', time: 5 }));
                 coord1 += 95;
                 coord2 += 135;
             }
             new init({
                 animate: function (othis) {
                     othis.tRange(page6_line, 140);
                     othis.tRange(page6_text1, 0);
                     othis.tRange(page6_text2, 100);

                     var time_str1 = 50, time_str2 = 140
                     for (var i = 0, len = str1Arr.length; i < len; i++) {
                         othis.tRange(str1Arr[i], time_str1);
                         othis.tRange(str2Arr[i], time_str2);
                         time_str1 += 10;
                         time_str2 += 10;
                     }
                 },
                 endtime: 200,
                 toData: toData
             });
         },
         function (toData) {
             bgColor = '#fdd5d6';
             nextImg = loadUrl[35];
             var page7_text1 = new text({ text: '舌尖上的中国', coord: [150, 100], font: [{ font: 48}], opacity: [0, 1], time: 20 }),
                 page7_text2 = new text({ text: '买买买', coord: [180, 180], font: [{ font: 64}], opacity: [0, 1], weight: true, time: 20 });
             var page7_img1 = new img({ src: loadUrl[18], coord: [[-600, 320], [100, 320]], time: 30 });
             new init({
                 animate: function (othis) {
                     othis.tRange(page7_text1, 30);
                     othis.tRange(page7_text2, 60);
                     othis.tRange(page7_img1, 90);
                 },
                 endtime: 130,
                 toData: toData
             });
         },
         function (toData) {
             var page8_text1 = new text({ text: '因为祖传的大厨基因', coord: [[120, 1040], [120, 80]], font: [{ font: 36}], time: toTime }),
                 page8_text2 = new text({ text: '所以更任性', coord: [[160, 1100], [160, 140]], font: [{ font: 48}], time: toTime });
             var page8_img1 = new img({ src: loadUrl[19], coord: [[150, 1400], [150, 440]], time: toTime }),
                 page8_img2 = new img({ src: loadUrl[20], coord: [[200, 500], [20, 360]], scale: [0, 1], opacity: [0, 1], time: 20 }),
                 page8_img3 = new img({ src: loadUrl[21], coord: [[380, 400], [190, 180]], scale: [0, 1], opacity: [0, 1], time: 20 }),
                 page8_img4 = new img({ src: loadUrl[22], coord: [375, 355], scale: [0, 1], opacity: [0, 1], time: 20 });
             new init({
                 animate: function (othis) {
                     othis.tRange(page8_text1, 0);
                     othis.tRange(page8_text2, 0);
                     othis.tRange(page8_img1, 0);
                     othis.tRange(page8_img2, 50);
                     othis.tRange(page8_img3, 60);
                     othis.tRange(page8_img4, 70);
                 },
                 endtime: 110,
                 toData: toData
             });
         },
         function (toData) {
             var page9_text1 = new text({ text: '总拿咱当宝的', coord: [180, 90], font: [{ font: 36}], opacity: [0, 1], time: 20 }),
                 page9_text2 = new text({ text: '永远是咱的', coord: [200, 150], font: [{ font: 36}], opacity: [0, 1], time: 20 }),
                 page9_text3 = new text({ text: '亲爸亲妈', coord: [135, 230], font: [{ font: 72}], opacity: [0, 1], time: 20 });
             var page9_img1 = new img({ src: loadUrl[25], coord: [[110, 1360], [110, 400]], time: toTime }),
                 page9_img2 = new img({ src: loadUrl[23], coord: [60, 330], scale: [1.6, 1], opacity: [0, 1], time: 10 }),
                 page9_img3 = new img({ src: loadUrl[24], coord: [320, 340], clip: 1, time: 60 });
             new init({
                 animate: function (othis) {
                     othis.tRange(page9_text1, 40);
                     othis.tRange(page9_text2, 70);
                     othis.tRange(page9_text3, 100);
                     othis.tRange(page9_img3, 130);
                     othis.tRange(page9_img1, 0);
                     othis.tRange(page9_img2, 200);
                 },
                 endtime: 300,
                 toData: toData
             });
         },
         function (toData) {
             var page10_text1 = new text({ text: '相信自己自带主角光环', coord: [110, 640], font: [{ font: 36}], opacity: [0, 1], time: 15 }),
                 page10_text2 = new text({ text: '只要坚持努力', coord: [190, 700], font: [{ font: 36}], opacity: [0, 1], time: 15 }),
                 page10_text3 = new text({ text: '就能赢得全世界的温柔对待', coord: [65, 760], font: [{ font: 36}], opacity: [0, 1], time: 15 });
             var page10_img1 = new img({ src: loadUrl[26], coord: [[110, 1130], [110, 170]], time: toTime }),
                 page10_img2 = new img({ src: loadUrl[27], coord: [40, 30], time: 20, clip: 2 }),
                 page10_img3 = new img({ src: loadUrl[28], coord: [350, 90], time: 10, opacity: [0, 1], scale: [3, 1] });
             new init({
                 animate: function (othis) {

                     othis.tRange(page10_img1, 0);
                     othis.tRange(page10_img3, 160);

                     othis.tRange(page10_img2, 130);
                     othis.tRange(page10_text1, 40);
                     othis.tRange(page10_text2, 70);
                     othis.tRange(page10_text3, 100);

                 },
                 endtime: 200,
                 toData: toData
             });
         },
         function (toData) {
             var page11_text1 = new text({ text: '感谢你让我一路同行，', coord: [110, 60], font: [{ font: 36}], opacity: [0, 1], time: 15 }),
                 page11_text2 = new text({ text: '让我能够见证与分享你一路走来的', coord: [40, 115], font: [{ font: 30}], opacity: [0, 1], time: 15 }),
                 page11_text3 = new text({ text: '努力与成长，', coord: [160, 170], font: [{ font: 48}], opacity: [0, 1], time: 15 });
             var str1 = '下一个十年 '.split(''),
                 str2 = '继续伴你左右'.split(''),
                 str1Arr = [],
                 str2Arr = [],
                 coord1 = 165,
                 coord2 = 90;
             for (var i = 0, len = str1.length; i < len; i++) {
                 str1Arr.push(new text({ text: str1[i], coord: [[260, 680], [coord1, 680]], font: [{ font: 52}], opacity: [0, 1], scale: [6, 1], weight: true, time: 8 }));
                 str2Arr.push(new text({ text: str2[i], coord: [[300, 760], [coord2, 760]], font: [{ font: 64}], opacity: [0, 1], scale: [6, 1], weight: true, time: 8 }));
                 coord1 += 57;
                 coord2 += 69;
             }

             var page11_img1 = new img({ src: loadUrl[29], coord: [[-300, 300], [120, 385]], scale: [0.4, 1], time: 40 }),
                 page11_img2 = new img({ src: loadUrl[30], coord: [[640, 120], [140, 220]], scale: [0.4, 1], time: 40 });

             var snowArr = [];
             for (var i = 0, j = 0; i < 12; i++) {
                 var w = i % 4;
                 if (w == 0) j++;
                 var randoms = Math.random(),
                     scale = 0.2 + Math.ceil((randoms * 0.8) * 10) / 10;
                 snowArr.push(new img({ src: loadUrl[31], coord: [parseInt((randoms + w) * (550 / 4)), parseInt((Math.random() - 1 + j) * 900 / 3)], opacity: [0, 0.9], scale: [scale, scale], time: parseInt(randoms * 10) + 20 }))
             }

             new init({
                 animate: function (othis) {
                     othis.tRange(page11_text1, 40);
                     othis.tRange(page11_text2, 70);
                     othis.tRange(page11_text3, 100);

                     var time_str1 = 230, time_str2 = 270
                     for (var i = 0, len = str1Arr.length; i < len; i++) {
                         othis.tRange(str1Arr[i], time_str1);
                         othis.tRange(str2Arr[i], time_str2);
                         time_str1 += 6;
                         time_str2 += 6;
                     }

                     othis.tRange(page11_img1, 140);
                     othis.tRange(page11_img2, 180);

                     for (var i = 0, len = snowArr.length; i < len; i++) {
                         othis.tRange(snowArr[i], 330);
                     }
                 },
                 endtime: 400,
                 toData: toData
             });

         },
         function (toData) {
             bgColor = '#ffffff';
             $('body').css('background', '#ffffff');
             var toData = new img({ src: toData, coord: [0, 0], time: toTime, opacity: [1, 0], scale: [1, 1] }),
                 page12_img = new img({ src: loadUrl[32], coord: [180, 120], time: toTime });


             var page12_text1 = new text({ text: '海外华人代购', coord: [160, 250], font: [{ font: 36}], space: 10, opacity: [0, 1], time: toTime }),
                 page12_text2 = new text({ text: '相伴  年', coord: [120, 370], font: [{ font: 60}], space: 10, opacity: [0, 1], time: toTime }),
                 page12_text3 = new text({ text: '10', coord: [275, 368], font: [{ font: 75}], weight: true, color: '#ff6e6e', noSplit: true, opacity: [0, 1], time: toTime });

             var page12_img2 = new img({ src: loadUrl[33], coord: [[300, -200], [230, 680]], scale: [0.4, 1], time: 20 }),
                 page12_img3 = new img({ src: loadUrl[34], coord: [310, 630], time: 20 });
             var page12_text4 = new text({ text: 'Click Here', coord: [240, 590], font: [{ font: 30}], color: '#ff6e6e', weight: true, noSplit: true, opacity: [0, 1], time: 15 });
             new init({
                 animate: function (othis) {
                     othis.tRange(toData, 0, toTime);
                     othis.tRange(page12_img, 0);
                     othis.tRange(page12_text1, 0);
                     othis.tRange(page12_text2, 0);
                     othis.tRange(page12_text3, 0);

                     othis.tRange(page12_img2, 100);
                     othis.tRange(page12_img3, 160);
                     othis.tRange(page12_text4, 140);
                 },
                 endtime: 200
             });

         },
         function (toData) {
             isAnimate = true;

             $('.share').addClass('share_show');
             var $masking = $('.masking')

             var title = '出国留学=富二代？NO！我要为自己正名，我们是牛X代！[hold住]分享真实海外游子的异乡生活，戳中泪点别哭哦。[泪流满面]',
                 shareUrl = 'http://www.panli.com/Special/GotoSpecial/Goto10th_review.aspx',
                 picImg = 'http://sf.panli.com/FrontEnd/images20090801/special/20150310/share_wf.jpg';
             $('.share_list li').on({
                 'touchstart': function () {
                     $(this).addClass('hover');
                 },
                 'touchend': function () {
                     $(this).removeClass('hover');
                 },
                 'tap': function () {
                     var $this = $(this);
                     if ($this.hasClass('share_weixin')) {
                         $masking.show();
                         document.removeEventListener('touchmove', dtouchmove, false)
                     }
                     if ($this.hasClass('share_facebook')) {

                         location.href = 'https://www.facebook.com/dialog/feed?app_id=563546080352185&description=' + title + '&redirect_uri=' + shareUrl + '&name=海外漂泊路 我最懂你&href=' + shareUrl + '&link=' + shareUrl + '&picture=' + picImg + '&ref=detail';
                         $.get('/App_Services/wsShareRecord.asmx/AddTenYearBackShareRecord', { 'clientType': 1, 'shareType': 3 }, function () { });
                     }
                     if ($this.hasClass('share_sina')) {
                         location.href = 'http://service.weibo.com/share/share.php?title=' + encodeURIComponent(title) + '&pic=' + encodeURIComponent(picImg) + '&url=' + encodeURIComponent(shareUrl);
                         $.get('/App_Services/wsShareRecord.asmx/AddTenYearBackShareRecord', { 'clientType': 1, 'shareType': 1 }, function () { });
                     }
                 }
             });

         }
     ];
/*动画步骤执行方法end*/

$('#myCanvas').on('swipeUp', function () {//向上滑动  切换
    if (!isAnimate) {
        setp_next();
    }
})

var mycanvas = $('#myCanvas');

c.addEventListener('touchend', function (e) {
    if (!isAnimate) {
        var offset = mycanvas.offset()

        var mouseX = e.changedTouches[0].pageX,
        mouseY = e.changedTouches[0].pageY;
        if (step_save.index == 12) {
            var canvasX = 230 + offset.left,
                canvasY = 680 + offset.top;
            if ((mouseX > canvasX && mouseY > canvasY) && (mouseX < (canvasX + 190) && mouseY < (canvasY + 154))) {
                setp_next();
            }
        } else if (step_save.index < 12) {
            var canvasX = 280 + offset.left,
                canvasY = 820 + offset.top;

            if ((mouseX > canvasX && mouseY > canvasY) && (mouseX < (canvasX + 80) && mouseY < (canvasY + 80))) {
                setp_next();
            }
        }
    }
})