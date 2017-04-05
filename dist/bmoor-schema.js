var bmoorSchema =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
		Schema: __webpack_require__(2),
		parser: __webpack_require__(4)
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var encode = __webpack_require__(3),
	    parsing = __webpack_require__(4);

	var Schema = function () {
		function Schema(jsonObj) {
			_classCallCheck(this, Schema);

			var i = [];

			parsing.$decode(i, '', jsonObj);

			this.info = i;
		}

		_createClass(Schema, [{
			key: 'toJsonSchema',
			value: function toJsonSchema() {
				return encode(this.info);
			}
		}]);

		return Schema;
	}();

	module.exports = Schema;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	function go(path, root, info) {
		var isArray = false,
		    cur = path.shift();

		if (cur[cur.length - 1] === ']') {
			isArray = true;
			cur = cur.substr(0, cur.length - 2);
		}

		if (isArray) {
			if (cur === '') {
				// don't think anything...
			} else {
				if (!root[cur]) {
					root[cur] = {
						type: 'array'
					};
				}
				root = root[cur];
			}
			cur = 'items';
		}

		if (path.length) {
			if (!root[cur]) {
				root[cur] = {
					type: 'object',
					properties: {}
				};
			}
			go(path, root[cur].properties, info);
		} else {
			root[cur] = info;
		}
	}

	function encode(schema) {
		var i, c, d, rtn, root;

		if (schema[0].path.split('.')[0] === '[]') {
			rtn = { type: 'array' };
			root = rtn;
		} else {
			rtn = { type: 'object', properties: {} };
			root = rtn.properties;
		}

		for (i = 0, c = schema.length; i < c; i++) {
			d = schema[i];

			go(d.path.split('.'), root, {
				type: d.type,
				alias: d.path
			});
		}

		return rtn;
	}

	module.exports = encode;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var bmoor = __webpack_require__(5);

	module.exports = {
		$decode: function $decode(def, path, val) {
			var method;

			if (bmoor.isArray(val)) {
				method = 'array';
			} else {
				method = typeof val === 'undefined' ? 'undefined' : _typeof(val);
			}

			this[method](def, path, val);
		},
		array: function array(def, path, val) {
			this.$decode(def, path + '[]', val[0]);
		},
		object: function object(def, path, val) {
			var _this = this;

			if (path !== '') {
				path += '.';
			}

			Object.keys(val).forEach(function (key) {
				_this.$decode(def, path + key, val[key]);
			});
		},
		number: function number(def, path, val) {
			def.push({
				path: path,
				type: 'number',
				sample: val
			});
		},
		boolean: function boolean(def, path, val) {
			def.push({
				path: path,
				type: 'boolean',
				sample: val
			});
		},
		string: function string(def, path, val) {
			def.push({
				path: path,
				type: 'string',
				sample: val
			});
		}
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = bmoor;

/***/ }
/******/ ]);