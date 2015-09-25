var pM = {
    extend: function (obj, old) {
        for (var i in old) {
            obj[i] = old[i];
        }
        return obj;
    },
    loadimg: function (url, fun) {
        var newimg = new Image();
        newimg.onload = fun;
        newimg.src = url;
    }
}

function text(para) {
    var oldPara = {
        time: 100,
        nowTime: 0,
        coord: [0, 0], //coord [star [x,y] end[x,y]]
        opacity: [1, 1], //opacity [star,end]
        space: 5,
        color:'#333',
        scale: [1, 1],//scale [star,end]
        isWhole:true
    }
    para = pM.extend(oldPara, para);
    this.init(para);
};
text.prototype = {
    init: function (para) {
        this.para = para;
        var time = para.time;
        var coord = para.coord;
        if (!(coord[0] instanceof Array)) {
            coord = [coord, coord];
        }
        var coordX = coord[1][0] - coord[0][0],
            coordY = coord[1][1] - coord[0][1];
        para.speedC = [coordX / time, coordY / time];
        para.exeC = [coord[0][0], coord[0][1]];

        para.speedS =(para.scale[1] - para.scale[0])/ time
        para.exeS = para.scale[0];

        para.speedO = (para.opacity[1] - para.opacity[0]) / time;
        para.exeO = para.opacity[0];

        var fontArray = para.font;
        var text = para.noSplit ? [para.text] : para.text.split(''),
            DefaultFont = fontArray.splice(0, 1)[0].font;
        var newText = [],
            fontDistance = para.exeC;

        for (var i = 0, len = text.length; i < len; i++) {
            var newDefault = pM.extend({}, para);
            newDefault.text = text[i];
            newDefault.font = DefaultFont;
            for (var j = 0, lens = fontArray.length; j < lens; j++) {
                if (fontArray[j].text == text[i]) {
                    newDefault.font = fontArray[j].font;
                }
            }
            newDefault.exeC = fontDistance;

            var newFontWidth = newDefault.font + para.space;
            if (para.speedC[0] > 0) { newFontWidth = -newFontWidth; }
            fontDistance = [fontDistance[0] + newFontWidth, fontDistance[1]];

            newText.push(newDefault);
        }
        this.animateArr = newText;
    },
    animate: function () {
        var para = this.para,
		    animateArr = this.animateArr;
        for (var i = 0, len = animateArr.length; i < len; i++) {
            var present = animateArr[i];
            if (!present.isStar && !present.isWhole) {
                present.isStar=true;
                break;
            } else {
                if (present.time > present.nowTime) {
                    present.exeC = [present.exeC[0] + present.speedC[0], present.exeC[1] + present.speedC[1]];
                    present.exeS += present.speedS;
                    present.exeO += present.speedO;
                    present.nowTime++;
                }
                this.fill(present);
            }

        }
    },
    fill: function (obj) {
        ctx.save();
        var scale = obj.exeS;
        ctx.fillStyle = obj.color;
        ctx.font = (obj.weight ? 'bold ' : '') + obj.font + 'px "Helvetica","Microsoft YaHei"';
        ctx.globalAlpha = obj.exeO;
        ctx.scale(scale, scale);
        ctx.textBaseline = 'middle';
        ctx.fillText(obj.text, parseInt((obj.exeC[0] + obj.font / 2) / scale), parseInt(obj.exeC[1] / scale));
        ctx.restore();
    }
}

function img(obj) {
    var para = {
        src: '',
        time: 100,
        nowTime: 0,
        angle:[0,0],
        coord: [0, 0], //coord [star [x,y] end[x,y]]
        opacity: [1, 1], //opacity [star,end]
        scale: [1, 1]//scale [star,end]
    }
    pM.extend(para, obj)
    this.init(para);
}
img.prototype = {
    init: function (para) {
        this.para = para;
        var time = para.time;

        var coord = para.coord;
        if (!(coord[0] instanceof Array)) {
            para.coord = coord = [coord, coord];
        }
        var coordX = coord[1][0] - coord[0][0],
                 coordY = coord[1][1] - coord[0][1];
        para.speedC = [coordX / time, coordY / time];
        para.exeC = [coord[0][0], coord[0][1]];


        var angle = para.angle;
        if (!angle instanceof Array) {
            para.angle = angle = [angle, angle];
        }
        para.speedA = (angle[1] - angle[0]) / time; ;
        para.exeA = angle[0];

        var clip = para.clip;
        if (clip) {
            para.speedClip = 100 / time;
            para.exeClip = 0
        }


        var opacity = para.opacity;
            if (!opacity instanceof Array) {
                opacity = [opacity, opacity];
            }
            para.speedO = (opacity[1] - opacity[0]) / time;
            para.exeO = opacity[0]
        

        var scale = para.scale;
            if (!scale instanceof Array) {
                scale = [scale, scale];
            }
            para.speedS = (scale[1] - scale[0]) / time;
            para.exeS = scale[0]
        
    },
    speed: function (star, end, now, all) {

        return now <= all ? (end - star) / all : 0;
    },
    animate: function () {
        var para = this.para,
                 speed = this.speed;
        var coord = para.coord;
        if (para.time > para.nowTime) {
          
                para.exeC[0] += speed(para.coord[0][0], para.coord[1][0], para.nowTime, para.time);
                para.exeC[1] += speed(para.coord[0][1], para.coord[1][1], para.nowTime, para.time); // para.speedC[1]
            
                para.exeS += para.speedS;
            
                para.exeO += para.speedO;
                if (para.exeO < 0) para.exeO = 0;
            
            if (para.clip) {
                para.exeClip += para.speedClip;
            }
            para.exeA += para.speedA;
            para.nowTime++;
        }
        this.fill(para);
    },
    fill: function (obj) {
        ctx.save()
        ctx.scale(obj.exeS, obj.exeS);
        ctx.globalAlpha = obj.exeO;
        var exeCoordX = parseInt(obj.exeC[0] / obj.exeS),
            exeCoordY = parseInt(obj.exeC[1] / obj.exeS);
        // if (obj.exeA != 0) { console.log(obj.src.width) }
        // ctx.save()
        //ctx.translate(320, 480);
        var imgWidth = obj.src.width,
            imgHeight = obj.src.height;
        var translateX = parseInt(exeCoordX + imgWidth / 2),
            translateY = parseInt(exeCoordY + imgHeight / 2)

        ctx.translate(translateX, translateY);

        ctx.rotate(obj.exeA * Math.PI / 180);

        exeCoordX = exeCoordX - translateX;
        exeCoordY = exeCoordY - translateY;
        if (obj.clip) {
            ctx.rect(exeCoordX, exeCoordY, parseInt(imgWidth / obj.exeS), parseInt(imgHeight / (obj.exeS * 100) * obj.exeClip));
            ctx.clip();
        }
        ctx.drawImage(obj.src, exeCoordX, exeCoordY);
        ctx.restore();
    }

}

function line(obj) {
    var para = {
        time: 100,
        nowTime: 0,
        size:3,
        color:'#333333',
        coord: [0, 0] //coord [star [x,y] end[x,y]]  
    }
    pM.extend(para, obj)
    this.init(para);
}
line.prototype = {
    init: function (para) {
        this.para = para;
        var time = para.time;
        var coord = para.coord;
        if (!(coord[0] instanceof Array)) {
            coord = [coord, coord];
        }
        var coordX = coord[1][0] - coord[0][0],
            coordY = coord[1][1] - coord[0][1];
        para.speedC = [coordX / time, coordY / time];
        para.exeC = [coord[0][0], coord[0][1]];

    },
    animate: function () {
        var para = this.para,
                 speed = this.speed;
        var coord = para.coord;
        if (para.time > para.nowTime) {
            para.exeC[0] += para.speedC[0];
            para.exeC[1] += para.speedC[1];

            para.nowTime++;
        }
        this.fill(para);
    },
    fill: function (obj) {
        ctx.save();
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = obj.size;
        ctx.beginPath();
        ctx.moveTo(obj.coord[0][0], obj.coord[0][1]);
        ctx.lineTo(obj.exeC[0], obj.exeC[1]);
        ctx.stroke();
        ctx.restore();
    }

}