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
            //extend by function call
            this.settings = $.extend(true, {
                debug: true,
                waves_num: 2,
                bezier_path_length: 20,
                distance: 100,
                bezier_control_point_distance_min: 200
            }, options);

            this.$element = $(element);

            //extend by data options
            this.data_options = this.$element.data('waver');
            this.settings = $.extend(true, this.settings, this.data_options);

            this.items = this.get_items(this.$element.find('.waver-item'));
            this.waves = this.get_waves();

            this.init();
        }

        get_items($elements) {
            let items = [];
            $elements.each(function() {
                let item = {};
                item.$el = $(this);
                items.push(item);
            });
            return items;
        }

        update_items() {
            this.items.forEach(function (item) {
                item.x = item.$el.position().left + item.$el.outerWidth() / 2;
                item.y = item.$el.position().top + item.$el.outerHeight() / 2;
            });
        }

        on_update(position) {
            this.items.forEach(function (item) {

                let distance = this.get_distance(item.x, item.y, position.x, position.y);

                if (distance < this.settings.distance && !item.active) {
                    item.distance = distance;
                    item.active = true;
                    item.$el.addClass('active');
                } else if (item.active && !item.wait_disappear) {
                    item.wait_disappear = true;

                    setTimeout(function () {
                        item.$el.removeClass('active');
                        item.active = false;
                        item.wait_disappear = false;
                    }, 2000 - item.distance * (2000 / this.settings.distance))
                }
            }.bind(this));

            if (this.settings.debug) {
                this.update_debug_point();
            }
        }

        init() {
            this.run();
            if (this.settings.debug) {
                this.init_debug();
            }
            this.resize_handler();
        }

        get_waves() {
            let waves = [];
            for (let i = 0; i < this.settings.waves_num; i++) {
                let bezier_values = [];
                for (let j = 0; j < this.settings.bezier_path_length; j++) {
                    bezier_values.push({x:0, y:0})
                }
                let wave = {
                    bezier_values: bezier_values,
                    current_position: {x:this.math_random(this.$element.innerWidth()), y:this.math_random(this.$element.innerHeight())}
                };
                waves.push(wave);
            }
            return waves;
        }

        get_distance(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
        }

        update_waves() {
            for (let wave_index = 0; wave_index < this.settings.waves_num; wave_index++) {
                for (let bezier_index = 0; bezier_index < this.settings.bezier_path_length; bezier_index++) {
                    let x = 0,
                        y = 0,
                        attempt_count = 0,
                        distance;
                    do {
                        x = this.math_random(this.$element.innerWidth());
                        y = this.math_random(this.$element.innerHeight());
                        if (bezier_index === 0) break;
                        let prev = this.waves[wave_index].bezier_values[bezier_index - 1];
                        distance = this.get_distance(x, y, prev.x, prev.y);
                        if (this.settings.debug && attempt_count === 9) {
                            console.log('9 attempts to find appropriate coords');
                        }
                    }

                    while (++attempt_count < 10 && distance < this.settings.bezier_control_point_distance_min) ;

                    this.waves[wave_index].bezier_values[bezier_index].x = x;
                    this.waves[wave_index].bezier_values[bezier_index].y = y;
                }
            }
        }

        run() {
            this.update_waves();
            this.update_items();
            this.run_tween();
        }

        run_tween() {
            this.waves.forEach(function(wave) {
                wave.tween_comet = TweenMax.to(wave.current_position, this.settings.bezier_path_length, {
                    bezier: {values: wave.bezier_values, timeResolution: 0, type: "soft"},
                    yoyo: true,
                    repeat: -1,
                    onUpdate: function () {
                        this.on_update(wave.current_position);
                    }.bind(this),
                    ease: Linear.easeNone
                });
            }.bind(this));
        }

        resize_handler() {
            $(window).resize(function () {
                if (this.resizeTO) clearTimeout(this.resizeTO);
                this.resizeTO = setTimeout(function () {
                    $(this).trigger('resize_end');
                }, 500);
            });

            $(window).on('resize_end', function () {
                this.run();
            }.bind(this))
        }

        math_random(X) {
            return Math.random() * X
        }

        update_debug_point() {
            this.waves.forEach(function (wave) {
                TweenLite.set(wave.$debug_point, {x: wave.current_position.x, y: wave.current_position.y})
            })
        }

        init_debug() {
            let self = this;
            this.waves.forEach(function (wave, index) {
                wave.$debug_point = $('<div class="waver-debug-point waver-debug-point-' + index + '" style="background: red; width: 20px; height: 20px; position: absolute;"></div>');
                self.$element.append(wave.$debug_point);
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
            if (typeof opt === 'object' || typeof opt === 'undefined')
                $this[i].waver = new Waver($this[i], opt);
            else
                ret = $this[i].waver[opt].apply($this[i].waver, args);
            if (typeof ret !== 'undefined') return ret;
        }
        return $this;
    };

})(jQuery);