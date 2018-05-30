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
                debug: false,
                waves_num: 1,
                bezier_path_length: 2,
                distance: 100

            }, options);

            self.$element = $(element);

            //extend by data options
            self.data_options = self.$element.data('waver');
            self.settings = $.extend(true, self.settings, self.data_options);

            self.waver_items_data = [];

            self.$waver_items = self.$element.find('.waver-item');

            self.waves = [];

            self.init();

        }

        init() {
            let self = this;


            self.set_waver_items_position();

            self.generate_waves();

            self.run();

            if (self.settings.debug) {
                self.init_debug();
            }

        }

        generate_waves() {
            let self = this;


            for (let i = 0; i < self.settings.waves_num; i++) {

                let bezier_values = [];

                for (let i = 0; i < self.settings.bezier_path_length; i++) {
                    bezier_values.push({
                        x: self.math_random(self.$element.innerWidth()),
                        y: self.math_random(self.$element.innerHeight())
                    });
                }

                self.waves.push({
                    bezier_values: bezier_values,
                    current_position: {
                        x: self.math_random(self.$element.innerWidth()),
                        y: self.math_random(self.$element.innerHeight())
                    }
                })

            }

        }

        run() {
            let self = this;

            self.waves.forEach(function (wave, index) {

                TweenMax.to(wave.current_position, self.settings.bezier_path_length, {
                    bezier: {values: wave.bezier_values, timeResolution: 0, type: "soft"},
                    yoyo: true,
                    repeat: -1,
                    onUpdate: function () {
                        self.on_update(wave.current_position);
                    }, ease: Linear.easeNone
                });
            })
        }

        math_random(X) {
            return Math.random() * X
        }

        on_update(position) {
            let self = this;

            self.waver_items_data.forEach(function (waver_item) {

                let a = waver_item.x - position.x;
                let b = waver_item.y - position.y;

                let distance = Math.sqrt(a * a + b * b);

                if (distance < self.settings.distance && !waver_item.active) {
                    waver_item.distance = distance;
                    waver_item.active = true;
                    waver_item.$el.addClass('active');
                }
                else if (waver_item.active && !waver_item.wait_disappear) {
                    waver_item.wait_disappear = true;

                    setTimeout(function () {
                        waver_item.$el.removeClass('active');
                        waver_item.active = false;
                        waver_item.wait_disappear = false;
                    }, 2000 - waver_item.distance * (2000 / self.settings.distance))
                }
            })

            if (self.settings.debug) {
                self.update_debug_point();
            }

        }


        set_waver_items_position() {
            let self = this;

            self.$waver_items.each(function () {

                self.waver_items_data.push(
                    {
                        $el: $(this),
                        x: $(this).position().left + $(this).outerWidth() / 2,
                        y: $(this).position().top + $(this).outerHeight() / 2
                    }
                );
            })

        }

        update_debug_point() {
            let self = this;

            self.waves.forEach(function (wave, index) {

                TweenLite.set(wave.$debug_point, {x: wave.current_position.x, y: wave.current_position.y})

            })
        }

        init_debug() {
            let self = this;

            self.waves.forEach(function (wave, index) {
                wave.$debug_point = $('<div class="waver-debug-point waver-debug-point-' + index + '" style="background: red; width: 20px; height: 20px; position: absolute;"></div>');

                self.$element.append(wave.$debug_point);
            })


            //self let example
            // console.log('self let example');
            // console.log(this);
            //
            // setTimeout(function(){
            //     console.log(this);
            //     console.log(self);
            // }, 1000)
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