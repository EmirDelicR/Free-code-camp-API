///< reference path="../node_modules/@types/jquery/index.d.ts" />
var Wheter = /** @class */ (function () {
    function Wheter() {
        this.imges = [
            "https://www.desktopbackground.org/p/2014/07/11/791539_copyright-free-tulip-images-for-commercial-use-best-free-stock_5407x3605_h.jpg",
            "https://www.desktopbackground.org/download/800x600/2015/04/15/933546_summer-impression-summer-lifestyle-summer-vacation-summer_1024x768_h.jpg",
            "https://www.desktopbackground.org/download/800x600/2011/05/26/209420_autumn-nature-wallpaper-desktop-desktop-wallpaper-autumn-nature-autumn-wallpaper-for-computer-1680-by-1050-jpg_1600x1200_h.jpg",
            "https://www.desktopbackground.org/download/800x600/2015/03/03/911476_animated-winter-wallpapers-cold-winter-photos-of-extra-ordinary_1305x733_h.jpg"
        ];
        this.$background = $('.box');
        this.$locationError = $('.error');
        this.winter = [11, 0, 1];
        this.spring = [2, 3, 4];
        this.summer = [5, 6, 7];
        this.fall = [8, 9, 10];
        this.imgNum = 2;
        this.$tmpBox = $('.tmp');
        this.$wheterContent = $('.content');
        this.curentTemp = '0';
    }
    Wheter.prototype.init = function () {
        this.imgNum = this.checkTimeOfYear();
        this.setBackgroudImg(this.imgNum);
        this.getLocation();
    };
    Wheter.prototype.setBackgroudImg = function (num) {
        this.$background.css('background-image', 'url("' + this.imges[num] + '")');
    };
    Wheter.prototype.getLocation = function () {
        if (navigator.geolocation) {
            var self_1 = this;
            navigator.geolocation.getCurrentPosition(function (position) {
                var theUrl = 'https://fcc-weather-api.glitch.me/api/current?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude;
                self_1.httpGetAsync(theUrl, self_1.fetchData);
            });
        }
        else {
            this.$locationError.html("Geolocation is not supported by this browser.");
        }
    };
    Wheter.prototype.httpGetAsync = function (theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        var self = this;
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText, self);
        };
        xmlHttp.open("GET", theUrl, true);
        xmlHttp.send(null);
    };
    Wheter.prototype.fetchData = function (content, self) {
        self.draw(JSON.parse(content));
    };
    Wheter.prototype.checkTimeOfYear = function () {
        var month = new Date().getMonth();
        if (this.winter.indexOf(month) != -1) {
            return 3;
        }
        else if (this.spring.indexOf(month) != -1) {
            return 0;
        }
        else if (this.summer.indexOf(month) != -1) {
            return 1;
        }
        else {
            return 2;
        }
    };
    Wheter.prototype.draw = function (content) {
        this.curentTemp = content.main.temp + ' C';
        var icon = this.createElemet('img', content.weather[0].icon);
        var tmp = this.createElemet('div', content.main.temp + ' C', 'tmp-val');
        var location = this.createElemet('div', content.name);
        var description = this.createElemet('div', content.weather[0].description);
        var wind = this.createElemet('div', content.wind.speed + ' knots');
        this.$tmpBox.append(icon);
        this.$tmpBox.append(tmp);
        this.$wheterContent.append(location);
        this.$wheterContent.append(description);
        this.$wheterContent.append(wind);
    };
    Wheter.prototype.createElemet = function (elm, content, id) {
        switch (elm) {
            case 'img':
                return $('<img/>').addClass('content-icon').attr("src", content);
            case 'div':
                var div = $('<div/>').addClass('content-div').html(content);
                if (id) {
                    div.attr('id', id);
                }
                return div;
            default:
                return $('<p/>').addClass('content-paragraf');
        }
    };
    Wheter.prototype.convertTemp = function (type, tmp) {
        switch (type) {
            case 'F':
                return ((tmp - 32) * 5 / 9).toFixed(1);
            default:
                return tmp * 9 / 5 + 32;
        }
    };
    Wheter.prototype.chengeTemp = function (btn) {
        var arr = this.curentTemp.split(' ');
        var tmpDiv = $('#tmp-val');
        var val = this.convertTemp(arr[1], Number(arr[0]));
        this.curentTemp = val + ' ' + btn.html();
        tmpDiv.html(this.curentTemp);
        btn.html(arr[1]);
    };
    return Wheter;
}());
;
$(document).ready(function () {
    var wheter = new Wheter();
    wheter.init();
    var $btn = $('.change-tmp');
    $btn.on('click', function () {
        wheter.chengeTemp($(this));
    });
});
