/*
 Version: 1.0.0
 Author: lemehovskiy
 Website: http://lemehovskiy.github.io
 Repo: https://github.com/lemehovskiy/waver
 */

'use strict';

(function ($) {

    class Waver {

        constructor(element, options) {

            let self = this;

            //extend by function call
            self.settings = $.extend(true, {

                debug: true

            }, options);

            self.$element = $(element);

            //extend by data options
            self.data_options = self.$element.data('waver');
            self.settings = $.extend(true, self.settings, self.data_options);

            self.waver_items_data = [];

            self.$waver_items = self.$element.find('.waver-item');

            self.position = {x: 0, y: 0, rotation: 0};

            self.init();

        }

        init() {
            let self = this;


            self.set_waver_items_position();


            var math_random = function (X) {
                    return Math.random() * X
                },
                bezier_element = document.querySelectorAll('.GSAP');

            function BTweens() {
                var window_width = window.innerWidth,
                    window_height = window.innerHeight,
                    count = 40;

                TweenLite.killDelayedCallsTo(BTweens);
                TweenLite.delayedCall(count * 4, BTweens);

                for (var i = bezier_element.length; i--;) {
                    var c = count,
                        bezier_values = [],
                        bezier_element_width = bezier_element[i].offsetWidth,
                        bezier_element_height = bezier_element[i].offsetHeight;

                    while (c--) {
                        bezier_values.push({
                            x: math_random(window_width - bezier_element_width),
                            y: math_random(window_height - bezier_element_height),
                            zIndex: Math.round(math_random(1) * 7)
                        });
                    }

                    if (bezier_element[i].TweenLite) {
                        bezier_element[i].TweenLite.kill()
                    }


                    TweenMax.to(self.position, count, {
                        bezier: {values: bezier_values, timeResolution: 0, type: "soft"},
                        yoyo: true,
                        repeat: -1,
                        onUpdate: function () {
                            self.on_update();
                        }, ease: Linear.easeNone
                    });


                    if (self.settings.debug) {
                        TweenMax.to(bezier_element[i], count, {
                            yoyo: true,
                            repeat: -1,
                            bezier: {timeResolution: 0, type: "soft", values: bezier_values},
                            ease: Linear.easeNone
                        });
                    }
                }
            }

            BTweens();

            window.onresize = function () {
                TweenLite.killDelayedCallsTo(BTweens);
                TweenLite.delayedCall(0.4, BTweens);
            };

        }

        on_update(){
            let self = this;


            // console.log(self.waver_items_data);
            self.waver_items_data.forEach(function(waver_item){

                let a = waver_item.x - self.position.x;
                let b = waver_item.y - self.position.y;

                let distance = Math.sqrt( a*a + b*b );

                if (distance < 200 && !waver_item.active) {
                    waver_item.distance = distance;
                    waver_item.active = true;
                    waver_item.$el.addClass('active');
                }
                else if (waver_item.active && !waver_item.wait_disappear) {
                    waver_item.wait_disappear = true;

                    setTimeout(function(){
                        waver_item.$el.removeClass('active');
                        waver_item.active = false;
                        waver_item.wait_disappear = false;
                    }, 2000 - waver_item.distance * (2000 / 200))
                }

            })

        }


        set_waver_items_position() {
            let self = this;

            self.$waver_items.each(function () {

                self.waver_items_data.push(
                    {
                        $el: $(this),
                        x: $(this).offset().left + $(this).outerWidth() / 2,
                        y: $(this).offset().top + $(this).outerHeight() / 2,
                    }
                );
            })

        }
    }


    $.fn.waver = function () {
        let $this = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            length = $this.length,
            i,
            ret;
        for (i = 0; i < length; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                $this[i].waver = new Waver($this[i], opt);
            else
                ret = $this[i].waver[opt].apply($this[i].waver, args);
            if (typeof ret != 'undefined') return ret;
        }
        return $this;
    };

})(jQuery);