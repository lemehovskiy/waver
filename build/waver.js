(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 Version: 1.0.0
 Author: lemehovskiy
 Website: http://lemehovskiy.github.io
 Repo: https://github.com/lemehovskiy/waver
 */



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    var Waver = function () {
        function Waver(element, options) {
            _classCallCheck(this, Waver);

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

        _createClass(Waver, [{
            key: 'get_items',
            value: function get_items($elements) {
                var items = [];
                $elements.each(function () {
                    var item = {};
                    item.$el = $(this);
                    items.push(item);
                });
                return items;
            }
        }, {
            key: 'update_items',
            value: function update_items() {
                this.items.forEach(function (item) {
                    item.x = item.$el.position().left + item.$el.outerWidth() / 2;
                    item.y = item.$el.position().top + item.$el.outerHeight() / 2;
                });
            }
        }, {
            key: 'on_update',
            value: function on_update(position) {
                this.items.forEach(function (item) {

                    var distance = this.get_distance(item.x, item.y, position.x, position.y);

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
                        }, 2000 - item.distance * (2000 / this.settings.distance));
                    }
                }.bind(this));

                if (this.settings.debug) {
                    this.update_debug_point();
                }
            }
        }, {
            key: 'init',
            value: function init() {
                this.run();
                if (this.settings.debug) {
                    this.init_debug();
                }
                this.resize_handler();
            }
        }, {
            key: 'get_waves',
            value: function get_waves() {
                var waves = [];
                for (var i = 0; i < this.settings.waves_num; i++) {
                    var bezier_values = [];
                    for (var j = 0; j < this.settings.bezier_path_length; j++) {
                        bezier_values.push({ x: 0, y: 0 });
                    }
                    var wave = { bezier_values: bezier_values, current_position: { x: 0, y: 0 } };
                    waves.push(wave);
                }
                return waves;
            }
        }, {
            key: 'update_waves',
            value: function update_waves() {
                for (var wave_index = 0; wave_index < this.settings.waves_num; wave_index++) {
                    for (var bezier_index = 0; bezier_index < this.settings.bezier_path_length; bezier_index++) {
                        var x = void 0,
                            y = void 0;
                        var attempt_count = 0;
                        var distance = void 0;
                        do {
                            x = this.math_random(this.$element.innerWidth());
                            y = this.math_random(this.$element.innerHeight());
                            if (bezier_index === 0) break;
                            var prev = this.waves[wave_index].bezier_values[bezier_index - 1];
                            distance = this.get_distance(x, y, prev.x, prev.y);
                            if (this.settings.debug && attempt_count === 9) {
                                console.log('9 attempts to find appropriate coords');
                            }
                        } while (++attempt_count < 10 && distance < this.settings.bezier_control_point_distance_min);
                        this.waves[wave_index].bezier_values[bezier_index].x = x;
                        this.waves[wave_index].bezier_values[bezier_index].y = y;
                    }
                }
            }
        }, {
            key: 'run',
            value: function run() {
                this.update_waves();
                this.update_items();
                this.run_tween();
            }
        }, {
            key: 'run_tween',
            value: function run_tween() {
                this.waves.forEach(function (wave) {
                    wave.tween_comet = TweenMax.to(wave.current_position, this.settings.bezier_path_length, {
                        bezier: { values: wave.bezier_values, timeResolution: 0, type: "soft" },
                        yoyo: true,
                        repeat: -1,
                        onUpdate: function () {
                            this.on_update(wave.current_position);
                        }.bind(this),
                        ease: Linear.easeNone
                    });
                }.bind(this));
            }
        }, {
            key: 'resize_handler',
            value: function resize_handler() {
                $(window).resize(function () {
                    if (this.resizeTO) clearTimeout(this.resizeTO);
                    this.resizeTO = setTimeout(function () {
                        $(this).trigger('resize_end');
                    }, 500);
                });

                $(window).on('resize_end', function () {
                    this.run();
                }.bind(this));
            }
        }, {
            key: 'update_debug_point',
            value: function update_debug_point() {
                this.waves.forEach(function (wave) {
                    TweenLite.set(wave.$debug_point, { x: wave.current_position.x, y: wave.current_position.y });
                });
            }
        }, {
            key: 'init_debug',
            value: function init_debug() {
                var self = this;
                this.waves.forEach(function (wave, index) {
                    wave.$debug_point = $('<div class="waver-debug-point waver-debug-point-' + index + '" style="background: red; width: 20px; height: 20px; position: absolute;"></div>');
                    self.$element.append(wave.$debug_point);
                });
            }
        }], [{
            key: 'get_distance',
            value: function get_distance(x1, y1, x2, y2) {
                return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            }
        }, {
            key: 'math_random',
            value: function math_random(X) {
                return Math.random() * X;
            }
        }]);

        return Waver;
    }();

    $.fn.waver = function () {
        var $this = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            length = $this.length,
            i = void 0,
            ret = void 0;
        for (i = 0; i < length; i++) {
            if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) === 'object' || typeof opt === 'undefined') $this[i].waver = new Waver($this[i], opt);else ret = $this[i].waver[opt].apply($this[i].waver, args);
            if (typeof ret !== 'undefined') return ret;
        }
        return $this;
    };
})(jQuery);

/***/ })
/******/ ]);
});