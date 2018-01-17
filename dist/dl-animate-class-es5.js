"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DLAnimate = function () {
	function DLAnimate() {
		_classCallCheck(this, DLAnimate);

		this.raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		var divTest = document.createElement("div");

		/* checking browser for necessary opportunities */
		this.canAnimate = typeof this.raf === "function" && "classList" in divTest && _typeof(divTest.style.transition) !== undefined;

		if (this.canAnimate) {
			this.raf = this.raf.bind(window);
		}

		/* requestAnimationFrame queue */
		this.frames = [];
		this.framesRun = false;
	}

	_createClass(DLAnimate, [{
		key: "show",
		value: function show(el) {
			var _this = this;

			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			if (!this.canAnimate) {
				this._show(el);
			}

			if (!this._isHidden(el)) {
				return;
			}

			/* merge defaults and users options */
			var settings = this._calcOptions(options);

			/* set handler on animation finish */
			this._setFinishHandler(el, settings.track, settings.duration, function () {
				_this._removeClasses(el, settings.classNames.enterActive);
				_this._removeClasses(el, settings.classNames.enterTo);
				settings.afterEnter(el);
			});

			this._show(el);
			this._addClasses(el, settings.classNames.enter);
			settings.beforeEnter(el);

			this._addFrame(function () {
				_this._addClasses(el, settings.classNames.enterActive);
			});

			this._addFrame(function () {
				_this._removeClasses(el, settings.classNames.enter);
				_this._addClasses(el, settings.classNames.enterTo);
			});
		}
	}, {
		key: "hide",
		value: function hide(el) {
			var _this2 = this;

			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			if (!this.canAnimate) {
				this._hide(el);
			}

			if (this._isHidden(el)) {
				return;
			}

			var settings = this._calcOptions(options);

			this._setFinishHandler(el, settings.track, settings.duration, function () {
				_this2._hide(el);
				_this2._removeClasses(el, settings.classNames.leaveActive);
				_this2._removeClasses(el, settings.classNames.leaveTo);
				options.systemOnEnd && options.systemOnEnd();
				settings.afterLeave(el);
			});

			this._addClasses(el, settings.classNames.leave);

			settings.beforeLeave(el);

			this._addFrame(function () {
				_this2._addClasses(el, settings.classNames.leaveActive);
			});

			this._addFrame(function () {
				_this2._addClasses(el, settings.classNames.leaveTo);
				_this2._removeClasses(el, settings.classNames.leave);
			});
		}
	}, {
		key: "insert",
		value: function insert(target, el) {
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
			var before = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

			this._hide(el);
			target.insertBefore(el, before);
			this.show(el, options);
		}
	}, {
		key: "remove",
		value: function remove(el) {
			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			options.systemDoneCallback = function () {
				el.parentNode.removeChild(el);
			};

			this.hide(el, options);
		}
	}, {
		key: "_setFinishHandler",
		value: function _setFinishHandler(el, track, duration, fn) {
			var eventName = void 0;
			var isCssTrack = true;

			if (track === 'transition') {
				eventName = 'transitionend';
			} else if (track === 'animation') {
				eventName = 'animationend';
			} else {
				isCssTrack = false;
			}

			if (isCssTrack) {
				var handler = function handler() {
					el.removeEventListener(eventName, handler);
					fn();
				};

				el.addEventListener(eventName, handler);
			} else {
				setTimeout(fn, duration);
			}
		}
	}, {
		key: "_calcOptions",
		value: function _calcOptions(options) {
			var name = options.name !== undefined ? options.name : 'dl-nothing-doing-class';
			var classNames = this._mergeSettings(this._classNames(name), options.classNames);

			delete options.classNames;

			var defaults = {
				name: '',
				track: 'transition',
				duration: null,
				classNames: classNames,
				beforeEnter: function beforeEnter(el) {},
				afterEnter: function afterEnter(el) {},
				beforeLeave: function beforeLeave(el) {},
				afterLeave: function afterLeave(el) {},
				systemDoneCallback: function systemDoneCallback(el) {}
			};

			var norm = this._mergeSettings(defaults, options);

			/* analize track & duration error */

			return norm;
		}
	}, {
		key: "_classNames",
		value: function _classNames(name) {
			return {
				enter: name + '-enter',
				enterActive: name + '-enter-active',
				enterTo: name + '-enter-to',
				leave: name + '-leave',
				leaveActive: name + '-leave-active',
				leaveTo: name + '-leave-to'
			};
		}
	}, {
		key: "_addFrame",
		value: function _addFrame(fn) {
			this.frames.push(fn);

			if (!this.framesRun) {
				this._nextFrame();
			}
		}
	}, {
		key: "_nextFrame",
		value: function _nextFrame() {
			var _this3 = this;

			if (this.frames.length === 0) {
				this.framesRun = false;
				return;
			}

			var frame = this.frames.shift();

			this.raf(function () {
				_this3.raf(function () {
					frame();
					_this3._nextFrame();
				});
			});
		}
	}, {
		key: "_addClasses",
		value: function _addClasses(el, str) {
			var arr = str.split(' ');

			for (var i = 0; i < arr.length; i++) {
				el.classList.add(arr[i]);
			}
		}
	}, {
		key: "_removeClasses",
		value: function _removeClasses(el, str) {
			var arr = str.split(' ');

			for (var i = 0; i < arr.length; i++) {
				el.classList.remove(arr[i]);
			}
		}
	}, {
		key: "_mergeSettings",
		value: function _mergeSettings(defaults, extra) {
			if ((typeof extra === "undefined" ? "undefined" : _typeof(extra)) !== "object") {
				return defaults;
			}

			var res = {};

			for (var k in defaults) {
				res[k] = extra[k] !== undefined ? extra[k] : defaults[k];
			}

			return res;
		}
	}, {
		key: "_hide",
		value: function _hide(el) {
			el.style.display = 'none';
		}
	}, {
		key: "_show",
		value: function _show(el) {
			el.style.removeProperty('display');

			if (this._isHidden(el)) {
				el.style.display = 'block';
			}
		}
	}, {
		key: "_isHidden",
		value: function _isHidden(el) {
			return this._getStyle(el, 'display') === 'none';
		}
	}, {
		key: "_getStyle",
		value: function _getStyle(el, prop) {
			return getComputedStyle(el)[prop];
		}
	}]);

	return DLAnimate;
}();