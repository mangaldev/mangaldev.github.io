(function() {
    //data, i have copiedit directly instead of making an ajax request, we can do it for ajax request too, but its design will be
    //different from existing design
    var data = [{

        "paymentId": 435456,
        "orderDate": "05/11/2015",
        "merchatId": 3245,
        "customerEmail": "varun@gmail.com",
        "amount": 234.56,
        "paymentStatus": 'Initiated'

    }, {

        "paymentId": 435466,
        "orderDate": "06/21/2015",
        "merchatId": 3289,
        "customerEmail": "rahul@gmail.com",
        "amount": 122.66,
        "paymentStatus": 'Failed'

    }, {

        "paymentId": 435459,
        "orderDate": "02/23/2015",
        "merchatId": 4567,
        "customerEmail": "alok@gmail.com",
        "amount": 4567.33,
        "paymentStatus": 'Initiated'

    }, {

        "paymentId": 435476,
        "orderDate": "04/06/1989",
        "merchatId": 3245,
        "customerEmail": "rohit@gmail.com",
        "amount": 23345,
        "paymentStatus": 'Success'

    }, {

        "paymentId": 112345,
        "orderDate": "08/24/2015",
        "merchatId": 3245,
        "customerEmail": "sapna@gmail.com",
        "amount": 567.96,
        "paymentStatus": 'Refunded'

    }, {

        "paymentId": 345654,
        "orderDate": "05/11/2015",
        "merchatId": 3245,
        "customerEmail": "kamal@gmail.com",
        "amount": 2434.43,
        "paymentStatus": 'Initiated'

    }, {

        "paymentId": 435451,
        "orderDate": "03/10/2015",
        "merchatId": 3245,
        "customerEmail": "shrey@gmail.com",
        "amount": 729.56,
        "paymentStatus": 'Dropped'

    }, {

        "paymentId": 435486,
        "orderDate": "03/16/2015",
        "merchatId": 3245,
        "customerEmail": "amar@gmail.com",
        "amount": 3947.57,
        "paymentStatus": 'Initiated'

    }]

    //element on which we have to bind grid
    var element = document.getElementById('myGrid');

    //formatter for status
    var statusFormatter = function(elem) {
            if (elem.innerHTML == 'Initiated') {
                elem.className += ' initiated';
            }
            if (elem.innerHTML == 'Failed') {
                elem.className += ' failed';
            }
            if (elem.innerHTML == 'Dropped') {
                elem.className += ' dropped';
            }
            if (elem.innerHTML == 'Success') {
                elem.className += ' success';
            }
            if (elem.innerHTML == 'Refunded') {
                elem.className += ' refunded';
            }
            return elem;
        }
        //initiate grid
    grid(data, element, {
        formatting: {
            'paymentStatus': statusFormatter
        },
        pageSize: 4,
        sorting: ['paymentId', 'orderDate', 'amount'],
        filters: ['paymentStatus']
    }).Init();
})();