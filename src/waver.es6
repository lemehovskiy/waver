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
                waves_num: 2,
                bezier_path_length: 2,
                distance: 100,
                bezierControlPointDistanceMin: 200
            }, options);

            self.$element = $(element);

            //extend by data options
            self.data_options = self.$element.data('waver');
            self.settings = $.extend(true, self.settings, self.data_options);

            self.waver_items_data = [];

            self.$waver_items = self.$element.find('.waver-item');

            self.waves = [];
            // self.waves.length = self.settings.waves_num;
            for (let i = 0; i < self.settings.waves_num; i++) {
                let bezier_values = [];
                for (let j = 0; j < self.settings.bezier_path_length; j++) {
                    bezier_values.push({x:0, y:0})
                }
                let wave = {bezier_values: bezier_values, current_position: {x:0, y:0}};
                self.waves.push(wave);
            }
            // let bezier_values = [];
            // bezier_values.length = self.settings.bezier_path_length;
            // self.waves.fill(bezier_values);

            self.init();

        }

        init() {
            let self = this;


            self.store_waver_items();
            self.set_waver_items_position();

            self.generate_waves();

            self.run();

            if (self.settings.debug) {
                self.init_debug();
            }

            self.resize_handler();

        }

        getDistance(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
        }

        generate_waves() {
            let self = this;

            // self.waves.splice(0, self.waves.length);

            for (let i = 0; i < self.settings.waves_num; i++) {

                // let bezier_values = [];

                // let bezier_values = self.waves[i]
                // for (let i = 0; i < self.settings.bezier_path_length; i++) {
                for (let j = 0; j < self.settings.bezier_path_length; j++) {
                    // bezier_values.push({
                    //     x: self.math_random(self.$element.innerWidth()),
                    //     y: self.math_random(self.$element.innerHeight())
                    // });
                    let distanceMin = this.settings.bezierControlPointDistanceMin;
                    let x = self.math_random(self.$element.innerWidth());
                    let y = self.math_random(self.$element.innerHeight());
                    if (j > 0) {
                        x = self.math_random(self.$element.innerWidth() - 2 * distanceMin);
                        y = self.math_random(self.$element.innerHeight() - 2 * distanceMin);
                        if (x > self.waves[i].bezier_values[j - 1].x - distanceMin) {
                            x = x + 2 * distanceMin;
                        }
                        if (y > self.waves[i].bezier_values[j - 1].y - distanceMin) {
                            y = y + 2 * distanceMin;
                        }
                    }
                    self.waves[i].bezier_values[j].x = x;
                    self.waves[i].bezier_values[j].y = y;
                }

                // self.waves[i] = {
                //     bezier_values: bezier_values,
                //     current_position: {
                //         x: self.math_random(self.$element.innerWidth()),
                //         y: self.math_random(self.$element.innerHeight())
                //     }
                // };

                self.waves[i].current_position.x = self.math_random(self.$element.innerWidth());
                self.waves[i].current_position.y = self.math_random(self.$element.innerHeight());

            }

        }

        run() {
            let self = this;

            self.waves.forEach(function (wave, index) {

                if (typeof wave.tweenComet !== 'undefined' /*&& self.tweenComet.isActive()*/) {
                    wave.tweenComet.kill();
                }

                wave.tweenComet = TweenMax.to(wave.current_position, self.settings.bezier_path_length, {
                    bezier: {values: wave.bezier_values, timeResolution: 0, type: "soft"},
                    yoyo: true,
                    repeat: -1,
                    onUpdate: function () {
                        self.on_update(wave.current_position);
                    }, ease: Linear.easeNone
                });
            })
        }

        resize_handler() {
            let self = this;

            $(window).resize(function () {
                if (this.resizeTO) clearTimeout(this.resizeTO);
                this.resizeTO = setTimeout(function () {
                    $(this).trigger('resize_end');
                }, 500);
            });

            $(window).on('resize_end', function () {
                self.generate_waves();
                self.set_waver_items_position();
                self.run();
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
            });

            if (self.settings.debug) {
                self.update_debug_point();
            }

        }


        store_waver_items() {
            let self = this;

            self.$waver_items.each(function () {

                self.waver_items_data.push(
                    {
                        $el: $(this)
                    }
                );
            })
        }

        set_waver_items_position() {
            let self = this;

            self.waver_items_data.forEach(function (item) {
                item.x = item.$el.position().left + item.$el.outerWidth() / 2;
                item.y = item.$el.position().top + item.$el.outerHeight() / 2;
            })

        }

        update_debug_point() {
            let self = this;

            this.waves.forEach(function (wave, index) {

                TweenLite.set(wave.$debug_point, {x: wave.current_position.x, y: wave.current_position.y})
                // wave.$debug_point.css({'x': wave.current_position.x, 'y': wave.current_position.y});

            })
        }

        init_debug() {
            let self = this;

            this.waves.forEach(function (wave, index) {
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