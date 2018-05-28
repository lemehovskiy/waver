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

                debug: true

            }, options);

            self.$element = $(element);

            //extend by data options
            self.data_options = self.$element.data('waver');
            self.settings = $.extend(true, self.settings, self.data_options);

            self.waver_items_data = [];

            self.$waver_items = self.$element.find('.waver-item');

            self.position = { x: 0, y: 0, rotation: 0 };

            self.init();
        }

        _createClass(Waver, [{
            key: 'init',
            value: function init() {
                var self = this;

                self.set_waver_items_position();

                var math_random = function math_random(X) {
                    return Math.random() * X;
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
                            bezier_element[i].TweenLite.kill();
                        }

                        TweenMax.to(self.position, count * 2, {
                            bezier: { values: bezier_values, timeResolution: 0, type: "soft" },
                            onUpdate: function onUpdate() {
                                self.on_update();
                            }, ease: Linear.easeNone
                        });

                        if (self.settings.debug) {

                            TweenMax.to(bezier_element[i], count * 2, {
                                bezier: { timeResolution: 0, type: "soft", values: bezier_values },
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
        }, {
            key: 'on_update',
            value: function on_update() {
                var self = this;

                // console.log(self.waver_items_data);
                self.waver_items_data.forEach(function (waver_item) {

                    var a = waver_item.x - self.position.x;
                    var b = waver_item.y - self.position.y;

                    var distance = Math.sqrt(a * a + b * b);

                    if (distance < 200 && !waver_item.active) {
                        waver_item.distance = distance;
                        waver_item.active = true;
                        waver_item.$el.addClass('active');
                    } else if (waver_item.active) {
                        setTimeout(function () {
                            waver_item.$el.removeClass('active');
                            waver_item.active = false;
                        }, 10000 - waver_item.distance * (10000 / 200));
                    }
                });
            }
        }, {
            key: 'set_waver_items_position',
            value: function set_waver_items_position() {
                var self = this;

                self.$waver_items.each(function () {

                    self.waver_items_data.push({
                        $el: $(this),
                        x: $(this).offset().left + $(this).outerWidth() / 2,
                        y: $(this).offset().top + $(this).outerHeight() / 2
                    });
                });
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