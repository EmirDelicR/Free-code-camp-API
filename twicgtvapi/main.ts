///< reference path="../node_modules/@types/jquery/index.d.ts" />

class Twich {
    strApi: string = "https://wind-bow.glitch.me/twitch-api/streams/";
    chlApi: string = "https://wind-bow.glitch.me/twitch-api/channels/";
    chl: string[] =["freecodecamp","ESL_SC2"];
    arrStr = [];
    arrChl = [];
 
    public init = () => {
        this.fetchContent()
    }

    private fetchContent = () => {
        for(let i = 0; i < this.chl.length; i++) {
            let str_url = this.strApi + this.chl[i];
            let chl_url = this.chlApi + this.chl[i];
            this.getJson(str_url, chl_url , i);
        }
    }

    private getJson = (url_str: string, url_chl: string,  index: number) => {
        $.getJSON(url_str, (data) => {
            if(data.stream === null) {
               this.arrStr[index] = "Offline";
            } else {
               this.arrStr[index] = "Online";
            } 
            $.getJSON(url_chl,(data) => {
               this.arrChl[index] = data;
               this.check();
            });
        }); 
    }

    private check = () => {
        let num = this.chl.length;
        if(this.arrChl.length == num && this.arrStr.length == num) {
            this.draw(num);
        }
    }

    private draw = (num: number) => {
        for(let i = 0; i<num ; i++) {
            
            let $wrap: JQuery = $('<div/>').addClass('wrap'); 
            let $name: JQuery = $('<p/>').addClass('p-con').html(this.arrChl[i].display_name);
            let $logo: JQuery = $('<img/>').addClass('img').attr('src', this.arrChl[i].logo);
            let $logoWrap: JQuery = $('<p/>').addClass('img-w');
            let $descr: JQuery = $('<span/>').addClass('descr').html(this.arrChl[i].game +' - '+this.arrChl[i].language);
            let $status: JQuery = $('<i/>');
            $logoWrap.append($logo);
            $wrap.append($logoWrap);

            if(this.arrStr[i] == "Offline") {
                 $status.addClass('fa fa-volume-off');
                 $name.append($status);
                 $wrap.append($name);
                 this.setBox1($wrap);
            } else {
                 $status.addClass('fa fa-volume-up');
                 $name.append($status, '<br/>', $descr);
                 $wrap.append($name);
                 this.setBox2($wrap);
            }
        }
    }

    private setBox1(elem: JQuery) {
        elem.appendTo($('.content-3')).clone().appendTo($('.content-1'));
    }
    private setBox2(elem: JQuery) {
        elem.appendTo($('.content-2')).clone().appendTo($('.content-1'));
    }
  
};




$( document ).ready(() => {
    let twich = new Twich();
    let $nav = $(".slide-toggle:input");
    let $con_search = $('.con-search');
    let $input = $('.s-input');
    let $src_btn = $('.s-btn');
    let check = false;
    
    $nav.on('click', (e) => {
        let id = e.delegateTarget.id;
        let lastEl = id.substr(id.length - 1); 
        for(let i = 1; i < 4; i++) {
            $('.content-'+i).css('display', 'none');
            $('.content-'+i).removeClass('sc');
            if(i === Number(lastEl)) {
                $('.content-'+i).css('display', 'block');
                $('.content-'+i).addClass('sc');
            }
        }
    });
    
    $con_search.on('click', function() {
        check = !check;
        (check) ?  $(this).addClass('s-active') : $(this).removeClass('s-active');
        
    });

    $input.keyup(function() {
        let val = String($(this).val());
          let arr = $('.sc .wrap').find('p.p-con');
        for(let i = 0; i < arr.length; i++) {
            let string = arr[i].innerHTML.split('<')[0].toLowerCase();
            if(string.indexOf(val.toLowerCase()) > -1){
                arr[i].parentElement.style.display = "";
            } else {
                arr[i].parentElement.style.display = "none";
            }    
        }
    });

    twich.init();
    

});