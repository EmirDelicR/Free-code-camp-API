///< reference path="../node_modules/@types/jquery/index.d.ts" />
var Twich = /** @class */ (function () {
    function Twich() {
        var _this = this;
        this.strApi = "https://wind-bow.glitch.me/twitch-api/streams/";
        this.chlApi = "https://wind-bow.glitch.me/twitch-api/channels/";
        this.chl = ["freecodecamp", "ESL_SC2"];
        this.arrStr = [];
        this.arrChl = [];
        this.init = function () {
            _this.fetchContent();
        };
        this.fetchContent = function () {
            for (var i = 0; i < _this.chl.length; i++) {
                var str_url = _this.strApi + _this.chl[i];
                var chl_url = _this.chlApi + _this.chl[i];
                _this.getJson(str_url, chl_url, i);
            }
        };
        this.getJson = function (url_str, url_chl, index) {
            $.getJSON(url_str, function (data) {
                if (data.stream === null) {
                    _this.arrStr[index] = "Offline";
                }
                else {
                    _this.arrStr[index] = "Online";
                }
                $.getJSON(url_chl, function (data) {
                    _this.arrChl[index] = data;
                    _this.check();
                });
            });
        };
        this.check = function () {
            var num = _this.chl.length;
            if (_this.arrChl.length == num && _this.arrStr.length == num) {
                _this.draw(num);
            }
        };
        this.draw = function (num) {
            for (var i = 0; i < num; i++) {
                var $wrap = $('<div/>').addClass('wrap');
                var $name = $('<p/>').addClass('p-con').html(_this.arrChl[i].display_name);
                var $logo = $('<img/>').addClass('img').attr('src', _this.arrChl[i].logo);
                var $logoWrap = $('<p/>').addClass('img-w');
                var $descr = $('<span/>').addClass('descr').html(_this.arrChl[i].game + ' - ' + _this.arrChl[i].language);
                var $status = $('<i/>');
                $logoWrap.append($logo);
                $wrap.append($logoWrap);
                if (_this.arrStr[i] == "Offline") {
                    $status.addClass('fa fa-volume-off');
                    $name.append($status);
                    $wrap.append($name);
                    _this.setBox1($wrap);
                }
                else {
                    $status.addClass('fa fa-volume-up');
                    $name.append($status, '<br/>', $descr);
                    $wrap.append($name);
                    _this.setBox2($wrap);
                }
            }
        };
    }
    Twich.prototype.setBox1 = function (elem) {
        elem.appendTo($('.content-3')).clone().appendTo($('.content-1'));
    };
    Twich.prototype.setBox2 = function (elem) {
        elem.appendTo($('.content-2')).clone().appendTo($('.content-1'));
    };
    return Twich;
}());
;
$(document).ready(function () {
    var twich = new Twich();
    var $nav = $(".slide-toggle:input");
    var $con_search = $('.con-search');
    var $input = $('.s-input');
    var $src_btn = $('.s-btn');
    var check = false;
    $nav.on('click', function (e) {
        var id = e.delegateTarget.id;
        var lastEl = id.substr(id.length - 1);
        for (var i = 1; i < 4; i++) {
            $('.content-' + i).css('display', 'none');
            $('.content-' + i).removeClass('sc');
            if (i === Number(lastEl)) {
                $('.content-' + i).css('display', 'block');
                $('.content-' + i).addClass('sc');
            }
        }
    });
    $con_search.on('click', function () {
        check = !check;
        (check) ? $(this).addClass('s-active') : $(this).removeClass('s-active');
    });
    $input.keyup(function () {
        var val = String($(this).val());
        var arr = $('.sc .wrap').find('p.p-con');
        for (var i = 0; i < arr.length; i++) {
            var string = arr[i].innerHTML.split('<')[0].toLowerCase();
            if (string.indexOf(val.toLowerCase()) > -1) {
                arr[i].parentElement.style.display = "";
            }
            else {
                arr[i].parentElement.style.display = "none";
            }
        }
    });
    twich.init();
});
