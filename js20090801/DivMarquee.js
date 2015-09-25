
var MyMarquees = new Array();
// 生成随机数
function RandStr(n, u) {
    var tmStr = "abcdefghijklmnopqrstuvwxyz0123456789";
    var Len = tmStr.length;
    var Str = "";
    for (i = 1; i < n + 1; i++) {
        Str += tmStr.charAt(Math.random() * Len);
    }
    return (u ? Str.toUpperCase() : Str);
}
// 获取检测实例名
function getMyMQName(mName) {
    var name = mName == undefined ? RandStr(5) : mName;
    var myNames = ',' + MyMarquees.join(',') + ',';

    while (myNames.indexOf(',' + name + ',') != -1) {
        name = RandStr(5);
    }
    return name;
}
function Marquee(inits) {
    var $self = this;
    var $init = inits;

    // 获取元素
    $self.Get = function(e) {
        return typeof (e) == 'object' ? e : document.getElementById(e);
    };

    // 无间滚动初始化
    $self.Init = function() {
        if ($init.obj == undefined) return;
        $self.mode = $init.mode == undefined ? 'x' : $init.mode; 			// 滚动模式(x:横向, y:纵向)
        $self.mName = getMyMQName($init.name); 							// 实例名
        $self.mObj = $self.Get($init.obj); 								// 滚动对象
        $self.interval = $init.interval == undefined ? 10 : $init.interval; 	// 滚动间歇
        $self.speed = $init.speed == undefined ? 1 : $init.speed; 			// 滚动间歇
        $self.autoStart = $init.autoStart == undefined ? true : $init.autoStart; // 自动开始
        $self.hovering = $init.hovering == undefined ? true : $init.hovering; // 鼠标经过是否暂停

        $self.mDo = null; 												// 计时器
        $self.pause = false; 											// 暂停状态

        if (($self.mObj.scrollWidth <= $self.mObj.offsetWidth && $self.mode == 'x') || ($self.mObj.scrollHeight <= $self.mObj.offsetHeight && $self.mode == 'y')) return;

        MyMarquees.push($self.mName);

        // 克隆滚动内容
        $self.mObj.innerHTML = $self.mode == 'x' ? (
            '<table width="100%" border="0" align="left" cellpadding="0" cellspace="0">' +
            '    <tr>' +
            '        <td id="MYMQ_' + $self.mName + '_1">' + $self.mObj.innerHTML + '</td>' +
            '        <td id="MYMQ_' + $self.mName + '_2">' + $self.mObj.innerHTML + '</td>' +
            '    </tr>' +
            '</table>'
        ) : (
            '<div id="MYMQ_' + $self.mName + '_1">' + $self.mObj.innerHTML + '</div>' +
            '<div id="MYMQ_' + $self.mName + '_2">' + $self.mObj.innerHTML + '</div>'
        );

        // 获取对象、高宽
        $self.mObj1 = $self.Get('MYMQ_' + $self.mName + '_1');
        $self.mObj2 = $self.Get('MYMQ_' + $self.mName + '_2');
        $self.mo1Width = $self.mObj1.scrollWidth;
        $self.mo1Height = $self.mObj1.scrollHeight;

        // 初始滚动
        if ($self.autoStart) $self.Start();
    };

    // 开始滚动
    $self.Start = function() {
        clearInterval($self.mDo);
        $self.mDo = setInterval(($self.mode == 'x' ? $self.MoveX : $self.MoveY), $self.interval);
        if ($self.hovering) {
            $self.mObj.onmouseover = function() { $self.pause = true; };
            $self.mObj.onmouseout = function() { $self.pause = false; };
        }
    }

    // 停止滚动
    $self.Stop = function() {
        clearInterval($self.mDo);
        $self.mObj.onmouseover = function() { };
        $self.mObj.onmouseout = function() { };
    }

    // 水平滚动
    $self.MoveX = function() {
        if ($self.pause) return;
        var left = $self.mObj.scrollLeft;
        if (left >= $self.mo1Width && $self.speed > 0) {
            $self.mObj.scrollLeft = left - $self.mo1Width - $self.speed;
        } else if (left == 0 && $self.speed < 0) {
            $self.mObj.scrollLeft = $self.mo1Width - $self.speed;
        } else {
            $self.mObj.scrollLeft += $self.speed;
        }
    };

    // 垂直滚动
    $self.MoveY = function() {
        if ($self.pause) return;
        var top = $self.mObj.scrollTop;
        if (top >= $self.mo1Height && $self.speed > 0) {
            $self.mObj.scrollTop = top - $self.mo1Height - $self.speed;
        } else if (top == 0 && $self.speed < 0) {
            $self.mObj.scrollTop = $self.mo1Height - $self.speed;
        } else {
            $self.mObj.scrollTop += $self.speed;
        }
    };

    $self.Init();
}