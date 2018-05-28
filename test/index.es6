require("./sass/style.scss");

require("jquery");

require('../build/waver.js');


$(document).ready(function () {


    for (let i = 0; i < 790; i++) {
        $('.waver-demo').append('<div class="waver-item"></div>')
    }

    $('.waver-demo').waver();

});