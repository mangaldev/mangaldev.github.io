

    var fbPageSearch = function() {

        var $jsonp = (function(){
            var that = {};

            that.send = function(src, options) {
                var callback_name = options.callbackName || 'callback',
                    on_success = options.onSuccess || function(){},
                    on_timeout = options.onTimeout || function(){},
                    timeout = options.timeout || 10; // sec

                var timeout_trigger = window.setTimeout(function(){
                    window[callback_name] = function(){};
                    on_timeout();
                }, timeout * 1000);

                window[callback_name] = function(data){
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
            access_token: '1654518208111531|2839cfca4a6778246de5aa39fed7d4c1',
            callback: 'handleStuff',
            baseUrl: 'https://graph.facebook.com/v2.3/',
            searchPath: 'search'
        }
        var util = {
            serializeObj: function (obj) {
                var str = [];
                for (var p in obj)
                    if (obj.hasOwnProperty(p)) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                return '?' + str.join("&");
            }
        }


        var templatingEnigne = function (obj, templateId) {
            var tempalte = document.getElementById(templateId).innerHTML;
            var keys = Object.getOwnPropertyNames(obj)
            for (var i = 0; i < keys.length; i++) {
                var regex = new RegExp('{{' + keys[i] + '}}', 'g');
                tempalte = tempalte.replace(regex, obj[keys[i]])
            }
            return tempalte;
        }

        templatingEnigne({id: 1, name: 'mangal'}, 'cardTemplate')
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
                    var ele = "<div>"
                        + "<div>"
                        + json.name
                        + "</div>"
                        + "<div class='card-inner' id='card-inner-" + json.id + "'>"
                        + "<div>"
                        + json.about
                        + "</div>"
                        + "<img class='cover-image' src='" + json.cover.source + "'/>"
                        + "</div>"
                        + "</div>";
                    document.getElementById("card-" + id).innerHTML = ele;
                    var list = document.getElementsByClassName('card-inner')
                    var list1 = document.getElementsByClassName('card')
                    for (var i = 0; i < list.length; i++) {
                        var card = list[i]
                        card.className = 'card-inner hide';
                    }
                    for (var i = 0; i < list1.length; i++) {
                        var card = list1[i]
                        card.className = 'card';
                    }
                    document.getElementById("card-" + id).className = "card card-opened";
                    document.getElementById("card-inner-" + id).className = "card-inner";
                },
                onTimeout: function () {
                    console.log('timeout!');
                },
                timeout: 5
            });
        }

        function searchPage() {
            var getParams = function () {
                return {
                    access_token: config.access_token,
                    callback: config.callback,
                    type: 'page',
                    q: document.getElementById("search-box").value
                }
            }
            var getUrl = function () {
                return config.baseUrl + config.searchPath + util.serializeObj(getParams());
            }
            var success = function (json) {
                var elements = "";
                for (var i = 0; i < json.data.length; i++) {
                    var id = json.data[i].id;
                    elements += templatingEnigne(json.data[i], 'cardTemplate');

                }
                document.getElementById("card-list").innerHTML = elements;
            }
            $jsonp.send(getUrl(), {
                callbackName: config.callback,
                onSuccess: success,
                onTimeout: function () {
                    console.log('timeout!');
                },
                timeout: 10
            });
        }

        return{
            searchPage: searchPage,
            openCard: openCard
        }
    }

var $ = fbPageSearch()