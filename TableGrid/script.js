var util = {
    //this function will extend the source object with target one
    extend: function(a, b) {
        for (var key in b)
            if (b.hasOwnProperty(key))
                a[key] = b[key];
        return a;
    },
    //check if string is date
    isDate: function(val) {
        var date = new Date(val);
        return !isNaN(date.valueOf());
    },
    //it will serialize the object in querystring format
    serializeObj: function(obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return '?' + str.join("&");
    },
    //it will remove class from string and return string
    removeClass: function(classes, classToRemove) {
        var index = classes.indexOf(classToRemove)
        if (index > -1)
            return classes.replace(classToRemove, '')

        return classes
    },
    //it will add a new class 
    addClass: function(classes, classToAdd) {
        var index = classes.indexOf(classToAdd)
        if (index == -1) {
            classes = classes + ' ' + classToAdd
        }
        return classes
    }
};