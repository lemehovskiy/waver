require("./sass/style.scss");

require("jquery");

require('../build/waver.js');


$(document).ready(function () {


    for (let i = 0; i < 400; i++) {
        $('.waver-demo').append('<div class="waver-item"></div>')
    }

    $('.waver-demo').waver({
        distance: 200,
        waves_num: 2

    });

    for (let i = 0; i < 789; i++) {
        $('.waver-demo-2').append('<div class="waver-item"></div>')
    }

    $('.waver-demo-2').waver({
        distance: 200

    });

});