///< reference path="../node_modules/@types/jquery/index.d.ts" />

class Wheter {
    imges: string[] = [
        "https://www.desktopbackground.org/p/2014/07/11/791539_copyright-free-tulip-images-for-commercial-use-best-free-stock_5407x3605_h.jpg",
        "https://www.desktopbackground.org/download/800x600/2015/04/15/933546_summer-impression-summer-lifestyle-summer-vacation-summer_1024x768_h.jpg",
        "https://www.desktopbackground.org/download/800x600/2011/05/26/209420_autumn-nature-wallpaper-desktop-desktop-wallpaper-autumn-nature-autumn-wallpaper-for-computer-1680-by-1050-jpg_1600x1200_h.jpg",
        "https://www.desktopbackground.org/download/800x600/2015/03/03/911476_animated-winter-wallpapers-cold-winter-photos-of-extra-ordinary_1305x733_h.jpg"
    ];
    $background: JQuery = $('.box');
    $locationError: JQuery = $('.error');
    winter: number[] = [11,0,1];
    spring: number[] = [2,3,4];
    summer: number[] = [5,6,7];
    fall: number[]   = [8,9,10];
    imgNum: number = 2;
    $tmpBox: JQuery = $('.tmp');
    $wheterContent: JQuery = $('.content');
    curentTemp: string = '0';
       

    public init() {
        this.imgNum = this.checkTimeOfYear();
        this.setBackgroudImg(this.imgNum);
        this.getLocation();
    }

    private setBackgroudImg(num : number) {
        this.$background.css('background-image', 'url("' + this.imges[num] + '")');
    }

    private getLocation() {
        if (navigator.geolocation) {
            let self = this;
            navigator.geolocation.getCurrentPosition(function(position: any){
                let theUrl = 'https://fcc-weather-api.glitch.me/api/current?lat='+position.coords.latitude+'&lon='+position.coords.longitude;
                self.httpGetAsync(theUrl, self.fetchData);
            });
        } else { 
            this.$locationError.html("Geolocation is not supported by this browser.");
        }
    }

    private httpGetAsync(theUrl: string, callback: (content: any, self: any) => void) {
        let xmlHttp = new XMLHttpRequest();
        let self = this;
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText, self);
        }
        xmlHttp.open("GET", theUrl, true); 
        xmlHttp.send(null);
    }

    private fetchData(content: any, self: any) {
        self.draw(JSON.parse(content));
    }

    private checkTimeOfYear() {
        let month = new Date().getMonth();
        if (this.winter.indexOf(month) != -1) {
            return 3;
        } else if (this.spring.indexOf(month) != -1) {
            return 0;
        } else if (this.summer.indexOf(month) != -1) {
            return 1;
        } else {
            return 2;
        }
    }

    private draw(content: any) {
        this.curentTemp = content.main.temp + ' C';
        let icon = this.createElemet('img', content.weather[0].icon);
        let tmp = this.createElemet('div', content.main.temp + ' C', 'tmp-val');
        let location = this.createElemet('div', content.name);
        let description = this.createElemet('div', content.weather[0].description);
        let wind = this.createElemet('div', content.wind.speed + ' knots');
        this.$tmpBox.append(icon);
        this.$tmpBox.append(tmp); 
        this.$wheterContent.append(location);
        this.$wheterContent.append(description);
        this.$wheterContent.append(wind);
    }

    private createElemet(elm : string, content: string, id?: string) {
        switch(elm) {
            case 'img':
            return $('<img/>').addClass('content-icon').attr("src", content);
            case 'div':
            let div = $('<div/>').addClass('content-div').html(content);
            if(id) {
                div.attr('id', id);
            }
            return div;
            default:
            return $('<p/>').addClass('content-paragraf');
        }
    }

    private convertTemp(type: string, tmp: number) {
        switch(type) {
            case 'F':
            return ((tmp - 32) * 5 / 9).toFixed(1); 
            default:
            return tmp * 9 / 5 + 32;
        }
    }

    public chengeTemp(btn: any) {
        let arr = this.curentTemp.split(' ');
        let tmpDiv = $('#tmp-val');
        let val = this.convertTemp(arr[1], Number(arr[0]));
        this.curentTemp = val +' '+ btn.html();
        tmpDiv.html(this.curentTemp);
        btn.html(arr[1]);
    }
};




$( document ).ready(function() {
    let wheter = new Wheter();
    wheter.init();

    let $btn = $('.change-tmp');
    $btn.on('click', function() {
         wheter.chengeTemp($(this));
    });
});

