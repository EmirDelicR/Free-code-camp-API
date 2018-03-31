///< reference path="../node_modules/@types/jquery/index.d.ts" />

class Wiki {
    searchList: string[] = [];
    things: string[] = ['stretch','gray', 'expensive','curl', 'private', 'stale', 'drunk', 'imminent', 'care', 'afterthought', 'story', 'debonair', 'bedroom', 'mess', 'hand', 'plan', 'pour', 'abhorrent', 'noise', 'fix'];
    numOfArtcle: number = 5;
    $box: JQuery = $('.content');
    public fetchContent(value: string) {
        this.searchList.push(value);
        this.renderDataList();
        let theUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+value+'&limit='+this.numOfArtcle+'&format=json&origin=*';
        this.httpGetAsync(theUrl, this.fetchData);
    }

    public randomArticle() {
        let thing = this.things[Math.floor(Math.random()*this.things.length)];
        let theUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+thing+'&limit='+this.numOfArtcle+'&format=json&origin=*';
        this.httpGetAsync(theUrl, this.fetchData);
    }

    private renderDataList() {
        let $dataList = $('.data-list');
        $dataList.empty();
        for(let i = this.searchList.length; i>=0 ; i--) {
            let $opt = $('<option/>').val(this.searchList[i]);
            $dataList.append($opt);
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

    private draw(content: any) {
        this.$box.empty();
        for(let i = 0; i < this.numOfArtcle ; i++ ) {
            let $card = $('<div/>').addClass('card');
            let $header = $('<h3/>').html(content[1][i]);
            let $text = $('<p/>').html(content[2][i]);
            let $link = $('<a/>').html('Visit').attr({
                'target': '_blank',
                'href': content[3][i]
            });
            $card.append($header);
            $card.append($text);
            $card.append($link);
            this.$box.append($card);
        }
    }
};




$( document ).ready(function() {
    let wiki = new Wiki();
    let $search = $('#search');
    
    var $form = $('.wrap');

    $form.on('keyup', 'input', function(e) {
        let $this = $(this),
            $input: any = $this.val();
        if ($input.length > 0) {
            $form.find('label').addClass('active');
                $form.find('button').addClass('active');
                if (e.which === 13) {
                    $form.find('button').click();
                    $this.blur();
                }
            $(this).addClass('active');
        } else {
            if (e.which === 13) { 
                wiki.randomArticle();
            }
            $form.find('label').removeClass('active');
            $form.find('button').removeClass('active');
            $(this).removeClass('active');
        }
    });

    $form.on('click', 'button.active', function(e) {
        e.preventDefault;
        var $this = $(this);
        let inputVal: any = $form.find('input').val();
        wiki.fetchContent(inputVal);
        setTimeout(()=> {
            $form.find('input').val('').removeClass('active');
            $form.find('label').removeClass('active');
            $this.removeClass('active');
        }, 1200);
    })

});
