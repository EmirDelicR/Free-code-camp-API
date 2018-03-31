///< reference path="../node_modules/@types/jquery/index.d.ts" />
var Wiki = /** @class */ (function () {
    function Wiki() {
        this.searchList = [];
        this.things = ['stretch', 'gray', 'expensive', 'curl', 'private', 'stale', 'drunk', 'imminent', 'care', 'afterthought', 'story', 'debonair', 'bedroom', 'mess', 'hand', 'plan', 'pour', 'abhorrent', 'noise', 'fix'];
        this.numOfArtcle = 5;
        this.$box = $('.content');
    }
    Wiki.prototype.fetchContent = function (value) {
        this.searchList.push(value);
        this.renderDataList();
        var theUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + value + '&limit=' + this.numOfArtcle + '&format=json&origin=*';
        this.httpGetAsync(theUrl, this.fetchData);
    };
    Wiki.prototype.randomArticle = function () {
        var thing = this.things[Math.floor(Math.random() * this.things.length)];
        var theUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + thing + '&limit=' + this.numOfArtcle + '&format=json&origin=*';
        this.httpGetAsync(theUrl, this.fetchData);
    };
    Wiki.prototype.renderDataList = function () {
        var $dataList = $('.data-list');
        $dataList.empty();
        for (var i = this.searchList.length; i >= 0; i--) {
            var $opt = $('<option/>').val(this.searchList[i]);
            $dataList.append($opt);
        }
    };
    Wiki.prototype.httpGetAsync = function (theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        var self = this;
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText, self);
        };
        xmlHttp.open("GET", theUrl, true);
        xmlHttp.send(null);
    };
    Wiki.prototype.fetchData = function (content, self) {
        self.draw(JSON.parse(content));
    };
    Wiki.prototype.draw = function (content) {
        this.$box.empty();
        for (var i = 0; i < this.numOfArtcle; i++) {
            var $card = $('<div/>').addClass('card');
            var $header = $('<h3/>').html(content[1][i]);
            var $text = $('<p/>').html(content[2][i]);
            var $link = $('<a/>').html('Visit').attr({
                'target': '_blank',
                'href': content[3][i]
            });
            $card.append($header);
            $card.append($text);
            $card.append($link);
            this.$box.append($card);
        }
    };
    return Wiki;
}());
;
$(document).ready(function () {
    var wiki = new Wiki();
    var $search = $('#search');
    var $form = $('.wrap');
    $form.on('keyup', 'input', function (e) {
        var $this = $(this), $input = $this.val();
        if ($input.length > 0) {
            $form.find('label').addClass('active');
            $form.find('button').addClass('active');
            if (e.which === 13) {
                $form.find('button').click();
                $this.blur();
            }
            $(this).addClass('active');
        }
        else {
            if (e.which === 13) {
                wiki.randomArticle();
            }
            $form.find('label').removeClass('active');
            $form.find('button').removeClass('active');
            $(this).removeClass('active');
        }
    });
    $form.on('click', 'button.active', function (e) {
        e.preventDefault;
        var $this = $(this);
        var inputVal = $form.find('input').val();
        wiki.fetchContent(inputVal);
        setTimeout(function () {
            $form.find('input').val('').removeClass('active');
            $form.find('label').removeClass('active');
            $this.removeClass('active');
        }, 1200);
    });
});
