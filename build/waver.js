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

            var self = this;

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

        _createClass(Waver, [{
            key: 'init',
            value: function init() {
                var self = this;

                self.store_waver_items();
                self.set_waver_items_position();

                self.generate_waves();

                self.run();

                if (self.settings.debug) {
                    self.init_debug();
                }

                self.resize_handler();
            }
        }, {
            key: 'generate_waves',
            value: function generate_waves() {
                var self = this;

                for (var i = 0; i < self.settings.waves_num; i++) {

                    var bezier_values = [];

                    for (var _i = 0; _i < self.settings.bezier_path_length; _i++) {
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
                    });
                }
            }
        }, {
            key: 'run',
            value: function run() {
                var self = this;

                self.waves.forEach(function (wave, index) {

                    TweenMax.to(wave.current_position, self.settings.bezier_path_length, {
                        bezier: { values: wave.bezier_values, timeResolution: 0, type: "soft" },
                        yoyo: true,
                        repeat: -1,
                        onUpdate: function onUpdate() {
                            self.on_update(wave.current_position);
                        }, ease: Linear.easeNone
                    });
                });
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

                $(window).on('resize_end', function () {});
            }
        }, {
            key: 'math_random',
            value: function math_random(X) {
                return Math.random() * X;
            }
        }, {
            key: 'on_update',
            value: function on_update(position) {
                var self = this;

                self.waver_items_data.forEach(function (waver_item) {

                    var a = waver_item.x - position.x;
                    var b = waver_item.y - position.y;

                    var distance = Math.sqrt(a * a + b * b);

                    if (distance < self.settings.distance && !waver_item.active) {
                        waver_item.distance = distance;
                        waver_item.active = true;
                        waver_item.$el.addClass('active');
                    } else if (waver_item.active && !waver_item.wait_disappear) {
                        waver_item.wait_disappear = true;

                        setTimeout(function () {
                            waver_item.$el.removeClass('active');
                            waver_item.active = false;
                            waver_item.wait_disappear = false;
                        }, 2000 - waver_item.distance * (2000 / self.settings.distance));
                    }
                });

                if (self.settings.debug) {
                    self.update_debug_point();
                }
            }
        }, {
            key: 'store_waver_items',
            value: function store_waver_items() {
                var self = this;

                self.$waver_items.each(function () {

                    self.waver_items_data.push({
                        $el: $(this)
                    });
                });
            }
        }, {
            key: 'set_waver_items_position',
            value: function set_waver_items_position() {
                var self = this;

                self.waver_items_data.forEach(function (item) {
                    item.x = item.$el.position().left + item.$el.outerWidth() / 2;
                    item.y = item.$el.position().top + item.$el.outerHeight() / 2;
                });
            }
        }, {
            key: 'update_debug_point',
            value: function update_debug_point() {
                var self = this;

                self.waves.forEach(function (wave, index) {

                    TweenLite.set(wave.$debug_point, { x: wave.current_position.x, y: wave.current_position.y });
                });
            }
        }, {
            key: 'init_debug',
            value: function init_debug() {
                var self = this;

                self.waves.forEach(function (wave, index) {
                    wave.$debug_point = $('<div class="waver-debug-point waver-debug-point-' + index + '" style="background: red; width: 20px; height: 20px; position: absolute;"></div>');

                    self.$element.append(wave.$debug_point);
                });

                //self let example
                // console.log('self let example');
                // console.log(this);
                //
                // setTimeout(function(){
                //     console.log(this);
                //     console.log(self);
                // }, 1000)
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
            if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) == 'object' || typeof opt == 'undefined') $this[i].waver = new Waver($this[i], opt);else ret = $this[i].waver[opt].apply($this[i].waver, args);
            if (typeof ret != 'undefined') return ret;
        }
        return $this;
    };
})(jQuery);

/***/ })
/******/ ]);
});