var fbPageSearch = function () {

    var $jsonp = (function () {
        var that = {};

        that.send = function (src, options) {
            var callback_name = options.callbackName || 'callback',
                on_success = options.onSuccess || function () {
                    },
                on_timeout = options.onTimeout || function () {
                    },
                timeout = options.timeout || 10; // sec

            var timeout_trigger = window.setTimeout(function () {
                window[callback_name] = function () {
                };
                on_timeout();
            }, timeout * 1000);

            window[callback_name] = function (data) {
                window.clearTimeout(timeout_trigger);
                on_success(data);
            }

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = src;

            document.getElementsByTagName('head')[0].appendChild(script);
        }

        return that;
    })();

    var config = {
        access_token: 'Id|Secret',
        callback: 'handleStuff',
        baseUrl: 'https://graph.facebook.com/v2.3/',
        searchPath: 'search'
    };
    var util = {
        serializeObj: function (obj) {
            var str = [];
            for (var p in obj)
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            return '?' + str.join("&");
        },

        removeClass: function (classes, classToRemove) {
            var index = classes.indexOf(classToRemove)
            if (index > -1)
                return classes.replace(classToRemove, '')

            return classes
        },
        addClass: function (classes, classToAdd) {
            var index = classes.indexOf(classToAdd)
            if (index == -1) {
                classes = classes + ' ' + classToAdd
            }
            return classes
        }
    };


    var templatingEngine = function (obj, templateId) {
        var tempalte = document.getElementById(templateId).innerHTML;
        var keys = Object.getOwnPropertyNames(obj)
        for (var i = 0; i < keys.length; i++) {
            var regex = new RegExp('{{' + keys[i] + '}}', 'g');
            tempalte = tempalte.replace(regex, obj[keys[i]])
        }
        return tempalte;
    };

    
    function openCard(id) {
        var getParams = function () {
            return {
                access_token: config.access_token,
                callback: config.callback
            }
        }
        var getUrl = function () {
            var url = config.baseUrl + id + util.serializeObj(getParams())
            return url;
        }
        $jsonp.send(getUrl(), {
            callbackName: config.callback,
            onSuccess: function (json) {
                var ele = templatingEngine({
                    id: json.id,
                    name: json.name,
                    about: json.about,
                    url: json.cover ? json.cover.source : ''
                }, "cardDetailTemplate")
                document.getElementById("card-" + id).getElementsByClassName("card--body")[0].innerHTML = ele;
                var rate = sessionStorage[json.id]
                if(rate) {
                    document.getElementById("card-" + id).querySelectorAll('[value="' + rate + '"]')[0].setAttribute('checked', 'checked')
                }
                var list = document.getElementsByClassName('card--body')
                var list1 = document.getElementsByClassName('card')
                for (var i = 0; i < list.length; i++) {
                    var card = list[i]
                    card.className = util.removeClass(card.className, 'show')
                    card.className = util.addClass(card.className, 'hide')
                }

                var currentClass = document.getElementById("card-" + id).getElementsByClassName("card--body")[0].className;
                var currentClass = util.removeClass(currentClass, 'hide');
                document.getElementById("card-" + id).getElementsByClassName("card--body")[0].className = util.addClass(currentClass, 'show')
            },
            onTimeout: function () {
                console.log('timeout!');
            },
            timeout: 5
        });
    }
    function onClickEnter(){
        if (event.keyCode == 13)
            searchPage();
    }

    function onRating(cardId, rating){
        event.stopPropagation()
        event.preventDefault()
        event.target.setAttribute('checked', 'checked')
        sessionStorage[cardId] = JSON.stringify(rating)
    }



    function searchPage() {
        var getParams = function () {
            return {
                access_token: config.access_token,
                callback: config.callback,
                type: 'page',
                q: document.getElementById("search-box").value
            }
        };
        var getUrl = function () {
            return config.baseUrl + config.searchPath + util.serializeObj(getParams());
        };
        var success = function (json) {
            var elements = "";
            for (var i = 0; i < json.data.length; i++) {
                var id = json.data[i].id;
                elements += templatingEngine(json.data[i], 'cardTemplate');

            }
            document.getElementById("card-list").innerHTML = elements;
            var list = document.getElementsByClassName('card--body')
            for (var i = 0; i < list.length; i++) {
                var card = list[i]
                card.className = util.addClass(card.className, 'hide')
            }
        };

        $jsonp.send(getUrl(), {
            callbackName: config.callback,
            onSuccess: success,
            onTimeout: function () {
                console.log('timeout!');
            },
            timeout: 10
        });
    }

    return {
        searchPage: searchPage,
        openCard: openCard,
        onClickEnter: onClickEnter,
        onRating: onRating
    }
}

var $ = fbPageSearch()
