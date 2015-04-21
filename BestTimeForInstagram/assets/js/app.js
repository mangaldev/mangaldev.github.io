var instaShare = function () {

    var config = {
        callback: 'handleStuff',
        baseUrl: 'https://graph.facebook.com/v2.3/',
        client_id: 'b1fd0900abc44ab3bff20abf085f037e',
        client_secret: 'cb90e1ec58b9463682f8f8d2dcb61693'
    };

    var util = {
        serializeObj: function (obj) {
            var str = [];
            for (var p in obj)
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            return '?' + str.join("&");
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


    return {}
}

var insta = instaShare();
var access_token = '';

$('#connect-instagram-link').on('click', function (e) {
    console.log('clicked on link');

});

$('#follwers-btn').on('click', function (e) {
    if (!access_token) {
        access_token = location.hash.replace('#', '').substring(13);
    }
    var instaFollowersAPI = "https://api.instagram.com/v1/users/self/follows?access_token=" + access_token + "&callback=callbackFunction";

    $.ajax({
        url: instaFollowersAPI,
        dataType: "jsonp"
    })
        .done(function (response) {
            console.log(response)
            $.each(response.data, function (i, follower) {
                $('#list-followers-box').append("<div class='row'><div class='col-md-3'> <img src='" + follower.profile_picture + "'></img></div> <div class='col-md-3'>" + follower.full_name + "</div> <div class='col-md-3'>" + follower.id + "</div>");
            });
        });

});

$('#recent-activity-btn').on('click', function () {
    if (!access_token) {
        access_token = location.hash.replace('#', '').substring(13);
    }
    var recentActivityAPI = "https://api.instagram.com/v1/users/" + $('#user-id').val() + "/media/recent/?access_token=" + access_token + "&callback=callbackFunction";
    $.ajax({
        url: recentActivityAPI,
        dataType: "jsonp"
    })
        .done(function (response) {
            console.log(response)
            $.each(response.data, function (i, follower) {
                console.log(follower)
            });
        });
});