var bmoorSchema =
/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * The core of bmoor's usefulness
 * @module bmoor
 **/

/**
 * Tests if the value is undefined
 *
 * @function isUndefined
 * @param {*} value - The variable to test
 * @return {boolean}
 **/
function isUndefined(value) {
	return value === undefined;
}

/**
 * Tests if the value is not undefined
 *
 * @function isDefined
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isDefined(value) {
	return value !== undefined;
}

/**
 * Tests if the value is a string
 *
 * @function isString
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isString(value) {
	return typeof value === 'string';
}

/**
 * Tests if the value is numeric
 *
 * @function isNumber
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isNumber(value) {
	return typeof value === 'number';
}

/**
 * Tests if the value is a function
 *
 * @function isFuncion
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isFunction(value) {
	return typeof value === 'function';
}

/**
 * Tests if the value is an object
 *
 * @function isObject
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isObject(value) {
	return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
}

/**
 * Tests if the value is a boolean
 *
 * @function isBoolean
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isBoolean(value) {
	return typeof value === 'boolean';
}

/**
 * Tests if the value can be used as an array
 *
 * @function isArrayLike
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isArrayLike(value) {
	// for me, if you have a length, I'm assuming you're array like, might change
	if (value) {
		return isObject(value) && (value.length === 0 || 0 in value && value.length - 1 in value);
	} else {
		return false;
	}
}

/**
 * Tests if the value is an array
 *
 * @function isArray
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isArray(value) {
	return value instanceof Array;
}

/**
 * Tests if the value has no content.
 * If an object, has no own properties.
 * If array, has length == 0.
 * If other, is not defined
 *
 * @function isEmpty
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isEmpty(value) {
	var key;

	if (isObject(value)) {
		for (key in value) {
			if (value.hasOwnProperty(key)) {
				return false;
			}
		}
	} else if (isArrayLike(value)) {
		return value.length === 0;
	} else {
		return isUndefined(value);
	}

	return true;
}

function parse(path) {
	if (!path) {
		return [];
	} else if (isString(path)) {
		return path.split('.');
	} else if (isArray(path)) {
		return path.slice(0);
	} else {
		throw new Error('unable to parse path: ' + path + ' : ' + (typeof path === 'undefined' ? 'undefined' : _typeof(path)));
	}
}

/**
 * Sets a value to a namespace, returns the old value
 *
 * @function set
 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
 * @param {string|array} space The namespace
 * @param {*} value The value to set the namespace to
 * @return {*}
 **/
function set(root, space, value) {
	var i,
	    c,
	    val,
	    nextSpace,
	    curSpace = root;

	space = parse(space);

	val = space.pop();

	for (i = 0, c = space.length; i < c; i++) {
		nextSpace = space[i];

		if (isUndefined(curSpace[nextSpace])) {
			curSpace[nextSpace] = {};
		}

		curSpace = curSpace[nextSpace];
	}

	curSpace[val] = value;

	return curSpace;
}

function _makeSetter(property, next) {
	if (next) {
		return function (ctx, value) {
			var t = ctx[property];

			if (!t) {
				t = ctx[property] = {};
			}

			return next(t, value);
		};
	} else {
		return function (ctx, value) {
			ctx[property] = value;
			return ctx;
		};
	}
}

function makeSetter(space) {
	var i,
	    fn,
	    readings = parse(space);

	for (i = readings.length - 1; i > -1; i--) {
		fn = _makeSetter(readings[i], fn);
	}

	return fn;
}

/**
 * get a value from a namespace, if it doesn't exist, the path will be created
 *
 * @function get
 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
 * @param {string|array|function} space The namespace
 * @return {array}
 **/
function get(root, path) {
	var i,
	    c,
	    space,
	    nextSpace,
	    curSpace = root;

	if (!root) {
		return root;
	}

	space = parse(path);
	if (space.length) {
		for (i = 0, c = space.length; i < c; i++) {
			nextSpace = space[i];

			if (isUndefined(curSpace[nextSpace])) {
				return;
			}

			curSpace = curSpace[nextSpace];
		}
	}

	return curSpace;
}

function _makeGetter(property, next) {
	if (next) {
		return function (obj) {
			try {
				return next(obj[property]);
			} catch (ex) {
				return undefined;
			}
		};
	} else {
		return function (obj) {
			try {
				return obj[property];
			} catch (ex) {
				return undefined;
			}
		};
	}
}

function makeGetter(path) {
	var i,
	    fn,
	    space = parse(path);

	if (space.length) {
		for (i = space.length - 1; i > -1; i--) {
			fn = _makeGetter(space[i], fn);
		}
	} else {
		return function (obj) {
			return obj;
		};
	}

	return fn;
}

/**
 * Delete a namespace, returns the old value
 *
 * @function del
 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
 * @param {string|array} space The namespace
 * @return {*}
 **/
function del(root, space) {
	var old,
	    val,
	    nextSpace,
	    curSpace = root;

	if (space && (isString(space) || isArrayLike(space))) {
		space = parse(space);

		val = space.pop();

		for (var i = 0; i < space.length; i++) {
			nextSpace = space[i];

			if (isUndefined(curSpace[nextSpace])) {
				return;
			}

			curSpace = curSpace[nextSpace];
		}

		old = curSpace[val];
		delete curSpace[val];
	}

	return old;
}

/**
 * Call a function against all elements of an array like object, from 0 to length.  
 *
 * @function loop
 * @param {array} arr The array to iterate through
 * @param {function} fn The function to call against each element
 * @param {object} context The context to call each function against
 **/
function loop(arr, fn, context) {
	var i, c;

	if (!context) {
		context = arr;
	}

	if (arr.forEach) {
		arr.forEach(fn, context);
	} else {
		for (i = 0, c = arr.length; i < c; ++i) {
			if (i in arr) {
				fn.call(context, arr[i], i, arr);
			}
		}
	}
}

/**
 * Call a function against all own properties of an object.  
 *
 * @function each
 * @param {object} arr The object to iterate through
 * @param {function} fn The function to call against each element
 * @param {object} context The context to call each function against
 **/
function each(obj, fn, context) {
	var key;

	if (!context) {
		context = obj;
	}

	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			fn.call(context, obj[key], key, obj);
		}
	}
}

/**
 * Call a function against all own properties of an object, skipping specific framework properties.
 * In this framework, $ implies a system function, _ implies private, so skip _
 *
 * @function iterate
 * @param {object} obj The object to iterate through
 * @param {function} fn The function to call against each element
 * @param {object} context The scope to call each function against
 **/
function iterate(obj, fn, context) {
	var key;

	if (!context) {
		context = obj;
	}

	for (key in obj) {
		if (obj.hasOwnProperty(key) && key.charAt(0) !== '_') {
			fn.call(context, obj[key], key, obj);
		}
	}
}

/**
 * Call a function against all own properties of an object, skipping specific framework properties.
 * In this framework, $ implies a system function, _ implies private, so skip both
 *
 * @function safe
 * @param {object} obj - The object to iterate through
 * @param {function} fn - The function to call against each element
 * @param {object} scope - The scope to call each function against
 **/
function safe(obj, fn, context) {
	var key;

	if (!context) {
		context = obj;
	}

	for (key in obj) {
		if (obj.hasOwnProperty(key) && key.charAt(0) !== '_' && key.charAt(0) !== '$') {
			fn.call(context, obj[key], key, obj);
		}
	}
}

function naked(obj, fn, context) {
	safe(obj, function (t, k, o) {
		if (!isFunction(t)) {
			fn.call(context, t, k, o);
		}
	});
}

module.exports = {
	// booleans
	isUndefined: isUndefined,
	isDefined: isDefined,
	isString: isString,
	isNumber: isNumber,
	isFunction: isFunction,
	isObject: isObject,
	isBoolean: isBoolean,
	isArrayLike: isArrayLike,
	isArray: isArray,
	isEmpty: isEmpty,
	// access
	parse: parse,
	set: set,
	makeSetter: makeSetter,
	get: get,
	makeGetter: makeGetter,
	del: del,
	// controls
	loop: loop,
	each: each,
	iterate: iterate,
	safe: safe,
	naked: naked
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = Object.create(__webpack_require__(0));

bmoor.dom = __webpack_require__(10);
bmoor.data = __webpack_require__(11);
bmoor.flow = __webpack_require__(12);
bmoor.array = __webpack_require__(15);
bmoor.build = __webpack_require__(16);
bmoor.object = __webpack_require__(20);
bmoor.string = __webpack_require__(21);
bmoor.promise = __webpack_require__(22);

bmoor.Memory = __webpack_require__(23);
bmoor.Eventing = __webpack_require__(24);

module.exports = bmoor;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(1),
    makeGetter = bmoor.makeGetter,
    Tokenizer = __webpack_require__(4).default;

var Path = function () {
	// normal path: foo.bar
	// array path : foo[].bar
	function Path(path) {
		_classCallCheck(this, Path);

		if (path instanceof Tokenizer) {
			this.tokenizer = path;
		} else {
			this.tokenizer = new Tokenizer(path);
		}

		this.root = this.tokenizer.tokens[0];
		this.hasArray = this.root.isArray;
	}

	_createClass(Path, [{
		key: '_makeChild',
		value: function _makeChild(path) {
			return new this.constructor(path);
		}

		// converts something like [{a:1},{a:2}] to [1,2]
		// when given [].a

	}, {
		key: 'flatten',
		value: function flatten(obj) {
			var target = [obj],
			    chunks = this.tokenizer.getAccessList().simplify();

			while (chunks.length) {
				var chunk = chunks.shift(),
				    getter = makeGetter(chunk);

				target = target.map(getter).reduce(function (rtn, arr) {
					return rtn.concat(arr);
				}, []);
			}

			return target;
		}

		// call this method against 

	}, {
		key: 'exec',
		value: function exec(obj, fn) {
			this.flatten(obj).forEach(fn);
		}
	}, {
		key: 'root',
		value: function root(accessors) {
			return this.tokenizer.root(accessors);
		}
	}, {
		key: 'remainder',
		value: function remainder() {
			return this._makeChild(this.tokenizer.remainder());
		}
	}]);

	return Path;
}();

module.exports = {
	Path: Path,
	default: Path
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (cb, min, max, settings) {
	var ctx, args, next, limit, timeout;

	if (!settings) {
		settings = {};
	}

	function fire() {
		limit = null;
		cb.apply(settings.context || ctx, args);
	}

	function run() {
		var now = Date.now();

		if (now >= limit || now >= next) {
			fire();
		} else {
			timeout = setTimeout(run, Math.min(limit, next) - now);
		}
	}

	var fn = function windowed() {
		var now = Date.now();

		ctx = this;
		args = arguments;
		next = now + min;

		if (!limit) {
			limit = now + max;
			timeout = setTimeout(run, min);
		}
	};

	fn.clear = function () {
		clearTimeout(timeout);
		timeout = null;
		limit = null;
	};

	fn.flush = function () {
		fire();
		fn.clear();
	};

	fn.shift = function (diff) {
		limit += diff;
	};

	return fn;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(1);

var _require = __webpack_require__(5),
    AccessList = _require.AccessList;

function nextToken(path) {
	var char = path.charAt(0);

	if (char === '#') {
		path = path.substring(1);

		var next = path.search(/[\.\[#]/);
		var action = path.substring(0, next);

		next = path.substring(next + (path.charAt(next) === '.' ? 1 : 0));

		return {
			type: 'action',
			next: next,
			value: action,
			accessor: null
		};
	} else {
		var i = 0;
		var c = path.length;
		var accessor = null;

		if (path.charAt(1) === ']') {
			// don't do anything
		} else if (char === '[') {
			var count = 0;

			do {
				if (char === '[') {
					count++;
				} else if (char === ']') {
					count--;
				}

				i++;
				char = path.charAt(i);
			} while (count && i < c);

			accessor = path.substring(2, i - 2);
		} else {
			var more = true;

			do {
				if (char === '.' || char === '[') {
					more = false;
				} else {
					i++;
					char = path.charAt(i);
				}
			} while (more && i < c);

			accessor = path.substring(0, i);
		}

		var token = path.substring(0, i),
		    isArray = false;

		if (char === '[' && path.charAt(i + 1) === ']') {
			token += '[]';
			i += 2;

			isArray = true;
		}

		if (path.charAt(i) === '.') {
			i++;
		}

		var _next = path.substring(i);

		return {
			type: isArray ? 'array' : 'linear',
			next: _next,
			value: token,
			accessor: accessor
		};
	}
}

var Tokenizer = function () {
	function Tokenizer(path) {
		_classCallCheck(this, Tokenizer);

		var tokens;

		this.begin();

		if (bmoor.isString(path)) {
			path = path.trim();
			tokens = [];

			while (path) {
				var cur = nextToken(path);
				tokens.push(cur);
				path = cur.next;
			}
		} else {
			tokens = path;
		}

		this.tokens = tokens;
	}

	_createClass(Tokenizer, [{
		key: '_makeChild',
		value: function _makeChild(arr) {
			return new this.constructor(arr);
		}
	}, {
		key: 'begin',
		value: function begin() {
			this.pos = 0;
		}
	}, {
		key: 'hasNext',
		value: function hasNext() {
			return this.tokens.length > this.pos + 1;
		}
	}, {
		key: 'next',
		value: function next() {
			var token = this.tokens[this.pos];

			if (token) {
				this.pos++;

				var rtn = Object.create(token);
				rtn.done = false;

				return rtn;
			} else {
				return {
					done: true
				};
			}
		}
	}, {
		key: 'getAccessList',
		value: function getAccessList() {
			var rtn = this.accessors;

			if (rtn === undefined) {
				var path = null;

				rtn = [];

				for (var i = 0, c = this.tokens.length; i < c; i++) {
					var token = this.tokens[i];

					if (token.type === 'action') {
						rtn.push({
							path: path,
							action: token.value,
							isArray: false
						});

						path = null;
					} else {
						if (path) {
							path.push(token.accessor);
						} else if (token.accessor) {
							path = [token.accessor];
						} else {
							path = [];
						}

						if (token.type === 'array') {
							rtn.push({
								path: path,
								action: false,
								isArray: true
							});

							path = null;
						}
					}
				}

				if (path) {
					rtn.push({
						path: path,
						action: false,
						isArray: false
					});
				}

				this.accessors = rtn;
			}

			return new AccessList(this.accessors);
		}
	}, {
		key: 'chunk',
		value: function chunk() {
			var rtn = this.chunks;

			if (rtn === undefined) {
				var cur = null;
				var token = null;

				rtn = [];

				for (var i = 0, c = this.tokens.length; i < c; i++) {
					token = this.tokens[i];

					if (cur) {
						if (token.value.charAt(0) === '[') {
							cur += token.value;
						} else {
							cur += '.' + token.value;
						}
					} else {
						cur = token.value;
					}

					if (token.type !== 'linear') {
						rtn.push({
							type: token.type,
							path: cur
						});
						cur = null;
					}
				}

				if (cur) {
					rtn.push({
						type: token.type,
						path: cur
					});
				}

				this.chunks = rtn;
			}

			return rtn;
		}
	}, {
		key: 'findArray',
		value: function findArray() {
			if (this.arrayPos === undefined) {
				var found = -1,
				    tokens = this.tokens;

				for (var i = 0, c = tokens.length; i < c; i++) {
					if (tokens[i].type === 'array') {
						found = i;
						i = c;
					}
				}

				this.arrayPos = found;
			}

			return this.arrayPos;
		}
	}, {
		key: 'root',
		value: function root(returnAccessor) {
			return returnAccessor ? this.getAccessList().getFront().access.path : this.chunk()[0].path;
		}
	}, {
		key: 'remainder',
		value: function remainder() {
			var found = this.findArray();

			found++; // -1 goes to 0

			if (found && found < this.tokens.length) {
				return this._makeChild(this.tokens.slice(found));
			} else {
				return null;
			}
		}
	}]);

	return Tokenizer;
}();

module.exports = {
	default: Tokenizer,
	Tokenizer: Tokenizer
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(26),
    Accessor = _require.Accessor;

var AccessList = function () {
	function AccessList(accessors) {
		_classCallCheck(this, AccessList);

		if (accessors[0] instanceof Accessor) {
			this.accessors = accessors;
		} else {
			this.accessors = accessors.map(function (access) {
				return new Accessor(access);
			});
		}
	}

	_createClass(AccessList, [{
		key: 'getFront',
		value: function getFront() {
			return this.accessors[0];
		}
	}, {
		key: 'getFollowing',
		value: function getFollowing() {
			if (this.accessors.length === 1) {
				return null;
			} else {
				return new AccessList(this.accessors.slice(1));
			}
		}
	}, {
		key: 'raw',
		value: function raw() {
			return this.accessors.map(function (accessor) {
				return accessor.access;
			});
		}
	}, {
		key: 'simplify',
		value: function simplify() {
			return this.accessors.map(function (accessor) {
				return accessor.access.path;
			});
		}
	}]);

	return AccessList;
}();

module.exports = {
	AccessList: AccessList,
	default: AccessList
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoorSchema = __webpack_require__(7);

console.log('We are running speed tests');

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	encode: __webpack_require__(8),
	Generator: __webpack_require__(27),
	Path: __webpack_require__(2),
	validate: __webpack_require__(30)
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    bmoorSchema: __webpack_require__(9).default,
    jsonSchema: __webpack_require__(25).default
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var bmoor = __webpack_require__(1),
    ops;

function parse(def, path, val) {
	var method;

	if (val === null || val === undefined) {
		return;
	}

	if (bmoor.isArray(val)) {
		method = 'array';
	} else {
		method = typeof val === 'undefined' ? 'undefined' : _typeof(val);
	}

	ops[method](def, path.slice(0), val);
}

function formatProperty(prop, escaped) {
	if (prop.charAt(0) !== '[' && prop.search(escaped) !== -1) {
		prop = '["' + prop + '"]';
	}

	return prop;
}

function join(path, escaped) {
	var rtn = '';

	if (path && path.length) {
		rtn = formatProperty(path.shift(), escaped);

		while (path.length) {
			var prop = formatProperty(path.shift(), escaped),
			    nextChar = prop[0];

			if (nextChar !== '[') {
				rtn += '.';
			}

			rtn += prop;
		}
	}

	return rtn;
}

ops = {
	array: function array(def, path, val) {
		// TODO : I'd like to encode all items in the array and merge
		// always encode first value of array
		var next = val[0];

		path.push('[]');

		parse(def, path, next);
	},
	object: function object(def, path, val) {
		var pos = path.length;

		Object.keys(val).forEach(function (key) {
			path[pos] = key;

			parse(def, path, val[key]);
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

function encode(json) {
	var escaped = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /[\W]/;

	var t = [];

	if (json) {
		parse(t, [], json);

		t.forEach(function (d) {
			d.path = join(d.path, escaped);
		});

		return t;
	} else {
		return json;
	}
}

module.exports = {
	encode: encode,
	default: encode,
	types: ops
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(0),
    regex = {};

// TODO: put in a polyfill block
if (typeof window !== 'undefined' && !bmoor.isFunction(window.CustomEvent)) {

	var _CustomEvent = function _CustomEvent(event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };

		var evt = document.createEvent('CustomEvent');

		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

		return evt;
	};

	_CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = _CustomEvent;
}

if (typeof Element !== 'undefined' && !Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector;
}

function getReg(className) {
	var reg = regex[className];

	if (!reg) {
		reg = new RegExp('(?:^|\\s)' + className + '(?!\\S)');
		regex[className] = reg;
	}

	return reg;
}

function getScrollPosition(doc) {
	if (!doc) {
		doc = document;
	}

	return {
		left: window.pageXOffset || (doc.documentElement || doc.body).scrollLeft,
		top: window.pageYOffset || (doc.documentElement || doc.body).scrollTop
	};
}

function getBoundryBox(element) {
	return element.getBoundingClientRect();
}

function centerOn(element, target, doc) {
	var el = getBoundryBox(element),
	    targ = getBoundryBox(target),
	    pos = getScrollPosition(doc);

	if (!doc) {
		doc = document;
	}

	element.style.top = pos.top + targ.top + targ.height / 2 - el.height / 2;
	element.style.left = pos.left + targ.left + targ.width / 2 - el.width / 2;
	element.style.right = '';
	element.style.bottom = '';

	element.style.position = 'absolute';
	doc.body.appendChild(element);
}

function showOn(element, target, doc) {
	var direction,
	    targ = getBoundryBox(target),
	    x = targ.x + targ.width / 2,
	    y = targ.y + targ.height / 2,
	    centerX = window.innerWidth / 2,
	    centerY = window.innerHeight / 2,
	    pos = getScrollPosition(doc);

	if (!doc) {
		doc = document;
	}

	if (x < centerX) {
		// right side has more room
		direction = 'r';
		element.style.left = pos.left + targ.right;
		element.style.right = '';
	} else {
		// left side has more room
		//element.style.left = targ.left - el.width - offset;
		direction = 'l';
		element.style.right = window.innerWidth - targ.left - pos.left;
		element.style.left = '';
	}

	if (y < centerY) {
		// more room on bottom
		direction = 'b' + direction;
		element.style.top = pos.top + targ.bottom;
		element.style.bottom = '';
	} else {
		// more room on top
		direction = 't' + direction;
		element.style.bottom = window.innerHeight - targ.top - pos.top;
		element.style.top = '';
	}

	element.style.position = 'absolute';
	doc.body.appendChild(element);

	return direction;
}

function massage(elements) {
	if (!bmoor.isArrayLike(elements)) {
		elements = [elements];
	}

	return elements;
}

function getDomElement(element, doc) {
	if (!doc) {
		doc = document;
	}

	if (bmoor.isString(element)) {
		return doc.querySelector(element);
	} else {
		return element;
	}
}

function getDomCollection(elements, doc) {
	var i,
	    c,
	    j,
	    co,
	    el,
	    selection,
	    els = [];

	if (!doc) {
		doc = document;
	}

	elements = massage(elements);

	for (i = 0, c = elements.length; i < c; i++) {
		el = elements[i];
		if (bmoor.isString(el)) {
			selection = doc.querySelectorAll(el);
			for (j = 0, co = selection.length; j < co; j++) {
				els.push(selection[j]);
			}
		} else {
			els.push(el);
		}
	}

	return els;
}

function addClass(elements, className) {
	var i,
	    c,
	    node,
	    baseClass,
	    reg = getReg(className);

	elements = massage(elements);

	for (i = 0, c = elements.length; i < c; i++) {
		node = elements[i];
		baseClass = node.getAttribute('class') || '';

		if (!baseClass.match(reg)) {
			node.setAttribute('class', baseClass + ' ' + className);
		}
	}
}

function removeClass(elements, className) {
	var i,
	    c,
	    node,
	    reg = getReg(className);

	elements = massage(elements);

	for (i = 0, c = elements.length; i < c; i++) {
		node = elements[i];
		node.setAttribute('class', (node.getAttribute('class') || '').replace(reg, ''));
	}
}

function bringForward(elements) {
	var i, c, node;

	elements = massage(elements);

	for (i = 0, c = elements.length; i < c; i++) {
		node = elements[i];

		if (node.parentNode) {
			node.parentNode.appendChild(node);
		}
	}
}

function triggerEvent(node, eventName, eventData, eventSettings) {
	if (node.dispatchEvent) {
		if (!eventSettings) {
			eventSettings = { 'view': window, 'bubbles': true, 'cancelable': true };
		} else {
			if (eventSettings.bubbles === undefined) {
				eventSettings.bubbles = true;
			}
			if (eventSettings.cancelable === undefined) {
				eventSettings.cancelable = true;
			}
		}

		eventSettings.detail = eventData;

		var event = new CustomEvent(eventName, eventSettings);
		event.$bmoor = true; // allow detection of bmoor events

		node.dispatchEvent(event);
	} else if (node.fireEvent) {
		var doc = void 0;

		if (!bmoor.isString(eventName)) {
			throw new Error('Can not throw custom events in IE');
		}

		if (node.ownerDocument) {
			doc = node.ownerDocument;
		} else if (node.nodeType === 9) {
			// the node may be the document itself, nodeType 9 = DOCUMENT_NODE
			doc = node;
		} else if (typeof document !== 'undefined') {
			doc = document;
		} else {
			throw new Error('Invalid node passed to fireEvent: ' + node.id);
		}

		var _event = doc.createEventObject();
		_event.detail = eventData;
		_event.$bmoor = true; // allow detection of bmoor events

		node.fireEvent('on' + eventName, _event);
	} else {
		throw new Error('We can not trigger events here');
	}
}

function onEvent(node, eventName, cb, qualifier) {
	node.addEventListener(eventName, function (event) {
		if (qualifier && !(event.target || event.srcElement).matches(qualifier)) {
			return;
		}

		cb(event.detail, event);
	});
}

module.exports = {
	getScrollPosition: getScrollPosition,
	getBoundryBox: getBoundryBox,
	getDomElement: getDomElement,
	getDomCollection: getDomCollection,
	showOn: showOn,
	centerOn: centerOn,
	addClass: addClass,
	removeClass: removeClass,
	bringForward: bringForward,
	triggerEvent: triggerEvent,
	onEvent: onEvent,
	on: function on(node, settings) {
		Object.keys(settings).forEach(function (eventName) {
			var ops = settings[eventName];

			if (bmoor.isFunction(ops)) {
				onEvent(node, eventName, ops);
			} else {
				Object.keys(ops).forEach(function (qualifier) {
					var cb = ops[qualifier];

					onEvent(node, eventName, cb, qualifier);
				});
			}
		});
	}
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Array helper functions
 * @module bmoor.data
 **/

var _id = 0;

function nextUid() {
	return ++_id;
}

function setUid(obj) {
	var t = obj.$$bmoorUid;

	if (!t) {
		t = obj.$$bmoorUid = nextUid();
	}

	return t;
}

function getUid(obj) {
	if (!obj.$$bmoorUid) {
		setUid(obj);
	}

	return obj.$$bmoorUid;
}

module.exports = {
	setUid: setUid,
	getUid: getUid
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	soon: __webpack_require__(13),
	debounce: __webpack_require__(14),
	window: __webpack_require__(3)
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (cb, time, settings) {
	var ctx, args, timeout;

	if (!settings) {
		settings = {};
	}

	function fire() {
		timeout = null;
		cb.apply(settings.context || ctx, args);
	}

	var fn = function sooned() {
		ctx = this;
		args = arguments;

		if (!timeout) {
			timeout = setTimeout(fire, time);
		}
	};

	fn.clear = function () {
		clearTimeout(timeout);
		timeout = null;
	};

	fn.flush = function () {
		fire();
		fn.clear();
	};

	return fn;
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (cb, time, settings) {
	var ctx, args, limit, timeout;

	if (!settings) {
		settings = {};
	}

	function fire() {
		timeout = null;
		cb.apply(settings.context || ctx, args);
	}

	function run() {
		var now = Date.now();

		if (now >= limit) {
			fire();
		} else {
			timeout = setTimeout(run, limit - now);
		}
	}

	var fn = function debounced() {
		var now = Date.now();

		ctx = this;
		args = arguments;
		limit = now + time;

		if (!timeout) {
			timeout = setTimeout(run, time);
		}
	};

	fn.clear = function () {
		clearTimeout(timeout);
		timeout = null;
		limit = null;
	};

	fn.flush = function () {
		fire();
		fn.clear();
	};

	fn.shift = function (diff) {
		limit += diff;
	};

	return fn;
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Array helper functions
 * @module bmoor.array
 **/

var bmoor = __webpack_require__(0);

/**
 * Search an array for an element and remove it, starting at the begining or a specified location
 *
 * @function remove
 * @param {array} arr An array to be searched
 * @param {*} searchElement Content for which to be searched
 * @param {integer} fromIndex The begining index from which to begin the search, defaults to 0
 * @return {array} array containing removed element
 **/
function remove(arr, searchElement, fromIndex) {
	var pos = arr.indexOf(searchElement, fromIndex);

	if (pos > -1) {
		return arr.splice(pos, 1)[0];
	}
}

/**
 * Search an array for an element and remove all instances of it, starting at the begining or a specified location
 *
 * @function remove
 * @param {array} arr An array to be searched
 * @param {*} searchElement Content for which to be searched
 * @param {integer} fromIndex The begining index from which to begin the search, defaults to 0
 * @return {integer} number of elements removed
 **/
function removeAll(arr, searchElement, fromIndex) {
	var r,
	    pos = arr.indexOf(searchElement, fromIndex);

	if (pos > -1) {
		r = removeAll(arr, searchElement, pos + 1);
		r.unshift(arr.splice(pos, 1)[0]);

		return r;
	} else {
		return [];
	}
}

function bisect(arr, value, func, preSorted) {
	var idx,
	    val,
	    bottom = 0,
	    top = arr.length - 1;

	if (!preSorted) {
		arr.sort(function (a, b) {
			return func(a) - func(b);
		});
	}

	if (func(arr[bottom]) >= value) {
		return {
			left: bottom,
			right: bottom
		};
	}

	if (func(arr[top]) <= value) {
		return {
			left: top,
			right: top
		};
	}

	if (arr.length) {
		while (top - bottom > 1) {
			idx = Math.floor((top + bottom) / 2);
			val = func(arr[idx]);

			if (val === value) {
				top = idx;
				bottom = idx;
			} else if (val > value) {
				top = idx;
			} else {
				bottom = idx;
			}
		}

		// if it is one of the end points, make it that point
		if (top !== idx && func(arr[top]) === value) {
			return {
				left: top,
				right: top
			};
		} else if (bottom !== idx && func(arr[bottom]) === value) {
			return {
				left: bottom,
				right: bottom
			};
		} else {
			return {
				left: bottom,
				right: top
			};
		}
	}
}

/**
 * Compare two arrays.
 *
 * @function remove
 * @param {array} arr1 An array to be compared
 * @param {array} arr2 An array to be compared
 * @param {function} func The comparison function
 * @return {object} an object containing the elements unique to the left, matched, and unqiue to the right
 **/
function compare(arr1, arr2, func) {
	var cmp,
	    left = [],
	    right = [],
	    leftI = [],
	    rightI = [];

	arr1 = arr1.slice(0);
	arr2 = arr2.slice(0);

	arr1.sort(func);
	arr2.sort(func);

	while (arr1.length > 0 && arr2.length > 0) {
		cmp = func(arr1[0], arr2[0]);

		if (cmp < 0) {
			left.push(arr1.shift());
		} else if (cmp > 0) {
			right.push(arr2.shift());
		} else {
			leftI.push(arr1.shift());
			rightI.push(arr2.shift());
		}
	}

	while (arr1.length) {
		left.push(arr1.shift());
	}

	while (arr2.length) {
		right.push(arr2.shift());
	}

	return {
		left: left,
		intersection: {
			left: leftI,
			right: rightI
		},
		right: right
	};
}

/**
 * Create a new array that is completely unique
 *
 * @function unique
 * @param {array} arr The array to be made unique
 * @param {function|boolean} sort If boolean === true, array is presorted.  If function, use to sort
 **/
function unique(arr, sort, uniqueFn) {
	var rtn = [];

	if (arr.length) {
		if (sort) {
			// more efficient because I can presort
			if (bmoor.isFunction(sort)) {
				arr = arr.slice(0).sort(sort);
			}

			var last = void 0;

			for (var i = 0, c = arr.length; i < c; i++) {
				var d = arr[i],
				    v = uniqueFn ? uniqueFn(d) : d;

				if (v !== last) {
					last = v;
					rtn.push(d);
				}
			}
		} else if (uniqueFn) {
			var hash = {};

			for (var _i = 0, _c = arr.length; _i < _c; _i++) {
				var _d = arr[_i],
				    _v = uniqueFn(_d);

				if (!hash[_v]) {
					hash[_v] = true;
					rtn.push(_d);
				}
			}
		} else {
			// greedy and inefficient
			for (var _i2 = 0, _c2 = arr.length; _i2 < _c2; _i2++) {
				var _d2 = arr[_i2];

				if (rtn.indexOf(_d2) === -1) {
					rtn.push(_d2);
				}
			}
		}
	}

	return rtn;
}

// I could probably make this sexier, like allow uniqueness algorithm, but I'm keeping it simple for now
function intersection(arr1, arr2) {
	var rtn = [];

	if (arr1.length > arr2.length) {
		var t = arr1;

		arr1 = arr2;
		arr2 = t;
	}

	for (var i = 0, c = arr1.length; i < c; i++) {
		var d = arr1[i];

		if (arr2.indexOf(d) !== -1) {
			rtn.push(d);
		}
	}

	return rtn;
}

function difference(arr1, arr2) {
	var rtn = [];

	for (var i = 0, c = arr1.length; i < c; i++) {
		var d = arr1[i];

		if (arr2.indexOf(d) === -1) {
			rtn.push(d);
		}
	}

	return rtn;
}

module.exports = {
	remove: remove,
	removeAll: removeAll,
	bisect: bisect,
	compare: compare,
	unique: unique,
	intersection: intersection,
	difference: difference
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(0),
    mixin = __webpack_require__(17),
    plugin = __webpack_require__(18),
    decorate = __webpack_require__(19);

function proc(action, proto, def) {
	var i, c;

	if (bmoor.isArray(def)) {
		for (i = 0, c = def.length; i < c; i++) {
			action(proto, def[i]);
		}
	} else {
		action(proto, def);
	}
}

function maker(root, config, base) {
	if (!base) {
		base = function BmoorPrototype() {};

		if (config) {
			if (bmoor.isFunction(root)) {
				base = function BmoorPrototype() {
					root.apply(this, arguments);
				};

				base.prototype = Object.create(root.prototype);
			} else {
				base.prototype = Object.create(root);
			}
		} else {
			config = root;
		}
	}

	if (config.mixin) {
		proc(mixin, base.prototype, config.mixin);
	}

	if (config.decorate) {
		proc(decorate, base.prototype, config.decorate);
	}

	if (config.plugin) {
		proc(plugin, base.prototype, config.plugin);
	}

	return base;
}

maker.mixin = mixin;
maker.decorate = decorate;
maker.plugin = plugin;

module.exports = maker;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(0);

module.exports = function (to, from) {
	bmoor.iterate(from, function (val, key) {
		to[key] = val;
	});
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var bmoor = __webpack_require__(0);

function override(key, target, action, plugin) {
	var old = target[key];

	if (old === undefined) {
		if (bmoor.isFunction(action)) {
			target[key] = function () {
				return action.apply(plugin, arguments);
			};
		} else {
			target[key] = action;
		}
	} else {
		if (bmoor.isFunction(action)) {
			if (bmoor.isFunction(old)) {
				target[key] = function () {
					var backup = plugin.$old,
					    reference = plugin.$target,
					    rtn;

					plugin.$target = target;
					plugin.$old = function () {
						return old.apply(target, arguments);
					};

					rtn = action.apply(plugin, arguments);

					plugin.$old = backup;
					plugin.$target = reference;

					return rtn;
				};
			} else {
				console.log('attempting to plug-n-play ' + key + ' an instance of ' + (typeof old === 'undefined' ? 'undefined' : _typeof(old)));
			}
		} else {
			console.log('attempting to plug-n-play with ' + key + ' and instance of ' + (typeof action === 'undefined' ? 'undefined' : _typeof(action)));
		}
	}
}

module.exports = function (to, from, ctx) {
	bmoor.iterate(from, function (val, key) {
		override(key, to, val, ctx);
	});
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var bmoor = __webpack_require__(0);

function override(key, target, action) {
	var old = target[key];

	if (old === undefined) {
		target[key] = action;
	} else {
		if (bmoor.isFunction(action)) {
			if (bmoor.isFunction(old)) {
				target[key] = function () {
					var backup = this.$old,
					    rtn;

					this.$old = old;

					rtn = action.apply(this, arguments);

					this.$old = backup;

					return rtn;
				};
			} else {
				console.log('attempting to decorate ' + key + ' an instance of ' + (typeof old === 'undefined' ? 'undefined' : _typeof(old)));
			}
		} else {
			console.log('attempting to decorate with ' + key + ' and instance of ' + (typeof action === 'undefined' ? 'undefined' : _typeof(action)));
		}
	}
}

module.exports = function (to, from) {
	bmoor.iterate(from, function (val, key) {
		override(key, to, val);
	});
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Object helper functions
 * @module bmoor.object
 **/

var bmoor = __webpack_require__(0);

function values(obj) {
	var res = [];

	bmoor.naked(obj, function (v) {
		res.push(v);
	});

	return res;
}

function keys(obj) {
	var res = [];

	if (Object.keys) {
		return Object.keys(obj);
	} else {
		bmoor.naked(obj, function (v, key) {
			res.push(key);
		});

		return res;
	}
}

/**
 * Takes a hash and uses the indexs as namespaces to add properties to an objs
 *
 * @function explode
 * @param {object} target The object to map the variables onto
 * @param {object} mappings An object orientended as [ namespace ] => value
 * @return {object} The object that has had content mapped into it
 **/
function explode(target, mappings) {
	if (!mappings) {
		mappings = target;
		target = {};
	}

	bmoor.iterate(mappings, function (val, mapping) {
		bmoor.set(target, mapping, val);
	});

	return target;
}

function makeExploder(paths) {
	var fn;

	paths.forEach(function (path) {
		var old = fn,
		    setter = bmoor.makeSetter(path);

		if (old) {
			fn = function fn(ctx, obj) {
				setter(ctx, obj[path]);
				old(ctx, obj);
			};
		} else {
			fn = function fn(ctx, obj) {
				setter(ctx, obj[path]);
			};
		}
	});

	return function (obj) {
		var rtn = {};

		fn(rtn, obj);

		return rtn;
	};
}

function implode(obj, ignore) {
	var rtn = {};

	if (!ignore) {
		ignore = {};
	}

	bmoor.iterate(obj, function (val, key) {
		var t = ignore[key];

		if (bmoor.isObject(val)) {
			if (t === false) {
				rtn[key] = val;
			} else if (!t || bmoor.isObject(t)) {
				bmoor.iterate(implode(val, t), function (v, k) {
					rtn[key + '.' + k] = v;
				});
			}
		} else if (!t) {
			rtn[key] = val;
		}
	});

	return rtn;
}

/**
 * Create a new instance from an object and some arguments
 *
 * @function mask
 * @param {function} obj The basis for the constructor
 * @param {array} args The arguments to pass to the constructor
 * @return {object} The new object that has been constructed
 **/
function mask(obj) {
	if (Object.create) {
		var T = function Masked() {};

		T.prototype = obj;

		return new T();
	} else {
		return Object.create(obj);
	}
}

/**
 * Create a new instance from an object and some arguments.  This is a shallow copy to <- from[...]
 * 
 * @function extend
 * @param {object} to Destination object.
 * @param {...object} src Source object(s).
 * @returns {object} Reference to `dst`.
 **/
function extend(to) {
	bmoor.loop(arguments, function (cpy) {
		if (cpy !== to) {
			if (to && to.extend) {
				to.extend(cpy);
			} else {
				bmoor.iterate(cpy, function (value, key) {
					to[key] = value;
				});
			}
		}
	});

	return to;
}

function empty(to) {
	bmoor.iterate(to, function (v, k) {
		delete to[k]; // TODO : would it be ok to set it to undefined?
	});
}

function copy(to) {
	empty(to);

	return extend.apply(undefined, arguments);
}

// Deep copy version of extend
function merge(to) {
	var from,
	    i,
	    c,
	    m = function m(val, key) {
		to[key] = merge(to[key], val);
	};

	for (i = 1, c = arguments.length; i < c; i++) {
		from = arguments[i];

		if (to === from) {
			continue;
		} else if (to && to.merge) {
			to.merge(from);
		} else if (!bmoor.isObject(from)) {
			to = from;
		} else if (!bmoor.isObject(to)) {
			to = merge({}, from);
		} else {
			bmoor.safe(from, m);
		}
	}

	return to;
}

/**
 * A general comparison algorithm to test if two objects are equal
 *
 * @function equals
 * @param {object} obj1 The object to copy the content from
 * @param {object} obj2 The object into which to copy the content
 * @preturns {boolean}
 **/
function equals(obj1, obj2) {
	var t1 = typeof obj1 === 'undefined' ? 'undefined' : _typeof(obj1),
	    t2 = typeof obj2 === 'undefined' ? 'undefined' : _typeof(obj2),
	    c,
	    i,
	    keyCheck;

	if (obj1 === obj2) {
		return true;
	} else if (obj1 !== obj1 && obj2 !== obj2) {
		return true; // silly NaN
	} else if (obj1 === null || obj1 === undefined || obj2 === null || obj2 === undefined) {
		return false; // undefined or null
	} else if (obj1.equals) {
		return obj1.equals(obj2);
	} else if (obj2.equals) {
		return obj2.equals(obj1); // because maybe somene wants a class to be able to equal a simple object
	} else if (t1 === t2) {
		if (t1 === 'object') {
			if (bmoor.isArrayLike(obj1)) {
				if (!bmoor.isArrayLike(obj2)) {
					return false;
				}

				if ((c = obj1.length) === obj2.length) {
					for (i = 0; i < c; i++) {
						if (!equals(obj1[i], obj2[i])) {
							return false;
						}
					}

					return true;
				}
			} else if (!bmoor.isArrayLike(obj2)) {
				keyCheck = {};
				for (i in obj1) {
					if (obj1.hasOwnProperty(i)) {
						if (!equals(obj1[i], obj2[i])) {
							return false;
						}

						keyCheck[i] = true;
					}
				}

				for (i in obj2) {
					if (obj2.hasOwnProperty(i)) {
						if (!keyCheck && obj2[i] !== undefined) {
							return false;
						}
					}
				}
			}
		}
	}

	return false;
}

module.exports = {
	keys: keys,
	values: values,
	explode: explode,
	makeExploder: makeExploder,
	implode: implode,
	mask: mask,
	extend: extend,
	empty: empty,
	copy: copy,
	merge: merge,
	equals: equals
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(0);

/**
 * Array helper functions
 * @module bmoor.string
 **/

function trim(str, chr) {
	if (!chr) {
		chr = '\\s';
	}
	return str.replace(new RegExp('^' + chr + '+|' + chr + '+$', 'g'), '');
}

function ltrim(str, chr) {
	if (!chr) {
		chr = '\\s';
	}
	return str.replace(new RegExp('^' + chr + '+', 'g'), '');
}

function rtrim(str, chr) {
	if (!chr) {
		chr = '\\s';
	}
	return str.replace(new RegExp(chr + '+$', 'g'), '');
}

// TODO : eventually I will make getCommands and getFormatter more complicated, but for now
//        they work by staying simple
function getCommands(str) {
	var commands = str.split('|');

	commands.forEach(function (command, key) {
		var args = command.split(':');

		args.forEach(function (arg, k) {
			args[k] = trim(arg);
		});

		commands[key] = {
			command: command,
			method: args.shift(),
			args: args
		};
	});

	return commands;
}

function stackFunctions(newer, older) {
	return function (o) {
		return older(newer(o));
	};
}

var filters = {
	precision: function precision(dec) {
		dec = parseInt(dec, 10);

		return function (num) {
			return parseFloat(num, 10).toFixed(dec);
		};
	},
	currency: function currency() {
		return function (num) {
			return '$' + num;
		};
	},
	url: function url() {
		return function (param) {
			return encodeURIComponent(param);
		};
	}
};

function doFilters(ters) {
	var fn, command, filter;

	while (ters.length) {
		command = ters.pop();
		fn = filters[command.method];

		if (fn) {
			fn = fn.apply(null, command.args);

			if (filter) {
				filter = stackFunctions(fn, filter);
			} else {
				filter = fn;
			}
		}
	}

	return filter;
}

function doVariable(lines) {
	var fn, rtn, dex, line, getter, command, commands, remainder;

	if (!lines.length) {
		return null;
	} else {
		line = lines.shift();
		dex = line.indexOf('}}');
		fn = doVariable(lines);

		if (dex === -1) {
			return function () {
				return '| no close |';
			};
		} else if (dex === 0) {
			// is looks like this {{}}
			remainder = line.substr(2);
			getter = function getter(o) {
				if (bmoor.isObject(o)) {
					return JSON.stringify(o);
				} else {
					return o;
				}
			};
		} else {
			commands = getCommands(line.substr(0, dex));
			command = commands.shift().command;
			remainder = line.substr(dex + 2);
			getter = bmoor.makeGetter(command);

			if (commands.length) {
				commands = doFilters(commands, getter);

				if (commands) {
					getter = stackFunctions(getter, commands);
				}
			}
		}

		//let's optimize this a bit
		if (fn) {
			// we have a child method
			rtn = function rtn(obj) {
				return getter(obj) + remainder + fn(obj);
			};
			rtn.$vars = fn.$vars;
		} else {
			// this is the last variable
			rtn = function rtn(obj) {
				return getter(obj) + remainder;
			};
			rtn.$vars = [];
		}

		if (command) {
			rtn.$vars.push(command);
		}

		return rtn;
	}
}

function getFormatter(str) {
	var fn,
	    rtn,
	    lines = str.split(/{{/g);

	if (lines.length > 1) {
		str = lines.shift();
		fn = doVariable(lines);
		rtn = function rtn(obj) {
			return str + fn(obj);
		};
		rtn.$vars = fn.$vars;
	} else {
		rtn = function rtn() {
			return str;
		};
		rtn.$vars = [];
	}

	return rtn;
}

getFormatter.filters = filters;

module.exports = {
	trim: trim,
	ltrim: ltrim,
	rtrim: rtrim,
	getCommands: getCommands,
	getFormatter: getFormatter
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var window = __webpack_require__(3);

function always(promise, func) {
	promise.then(func, func);
	return promise;
}

function stack(calls, settings) {

	if (!calls) {
		throw new Error('calling stack with no call?');
	}

	if (!settings) {
		settings = {};
	}

	var min = settings.min || 1,
	    max = settings.max || 10,
	    limit = settings.limit || 5,
	    update = window(settings.update || function () {}, min, max);

	return new Promise(function (resolve, reject) {
		var run,
		    timeout,
		    errors = [],
		    active = 0,
		    callStack = calls.slice(0);

		function registerError(err) {
			errors.push(err);
		}

		function next() {
			active--;

			update({ active: active, remaining: callStack.length });

			if (callStack.length) {
				if (!timeout) {
					timeout = setTimeout(run, 1);
				}
			} else if (!active) {
				if (errors.length) {
					reject(errors);
				} else {
					resolve();
				}
			}
		}

		run = function run() {
			timeout = null;

			while (active < limit && callStack.length) {
				var fn = callStack.pop();

				active++;

				fn().catch(registerError).then(next);
			}
		};

		run();
	});
}

function hash(obj) {
	var rtn = {};

	return Promise.all(Object.keys(obj).map(function (key) {
		var p = obj[key];

		if (p && p.then) {
			p.then(function (v) {
				rtn[key] = v;
			});
		} else {
			rtn[key] = p;
		}

		return p;
	})).then(function () {
		return rtn;
	});
}

module.exports = {
	hash: hash,
	stack: stack,
	always: always
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var master = {};

var Memory = function () {
	function Memory(name) {
		_classCallCheck(this, Memory);

		var index = {};

		this.name = name;
		this.get = function (name) {
			return index[name];
		};

		this.check = function (name) {
			console.log('Memory::check will soon removed');
			return index[name];
		};

		this.isSet = function (name) {
			return !!index[name];
		};

		this.register = function (name, obj) {
			index[name] = obj;
		};

		this.clear = function (name) {
			if (name in index) {
				delete index[name];
			}
		};

		this.keys = function () {
			return Object.keys(index);
		};
	}

	_createClass(Memory, [{
		key: 'import',
		value: function _import(json) {
			var _this = this;

			Object.keys(json).forEach(function (key) {
				_this.register(key, json[key]);
			});
		}
	}, {
		key: 'export',
		value: function _export() {
			var _this2 = this;

			return this.keys().reduce(function (rtn, key) {
				rtn[key] = _this2.get(key);

				return rtn;
			}, {});
		}
	}]);

	return Memory;
}();

module.exports = {
	Memory: Memory,
	use: function use(title) {
		var rtn = master[title];

		if (rtn) {
			throw new Error('Memory already exists ' + title);
		} else {
			rtn = master[title] = new Memory(title);
		}

		return rtn;
	}
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Eventing = function () {
	function Eventing() {
		_classCallCheck(this, Eventing);

		this._listeners = {};
	}

	_createClass(Eventing, [{
		key: "on",
		value: function on(event, cb) {
			var listeners;

			if (!this._listeners[event]) {
				this._listeners[event] = [];
			}

			listeners = this._listeners[event];

			listeners.push(cb);

			return function clear$on() {
				listeners.splice(listeners.indexOf(cb), 1);
			};
		}
	}, {
		key: "once",
		value: function once(event, cb) {
			var clear,
			    fn = function fn() {
				clear();
				cb.apply(this, arguments);
			};

			clear = this.on(event, fn);

			return clear;
		}
	}, {
		key: "subscribe",
		value: function subscribe(subscriptions) {
			var dis = this,
			    kills = [],
			    events = Object.keys(subscriptions);

			events.forEach(function (event) {
				var action = subscriptions[event];

				kills.push(dis.on(event, action));
			});

			return function killAll() {
				kills.forEach(function (kill) {
					kill();
				});
			};
		}
	}, {
		key: "trigger",
		value: function trigger(event) {
			var _this = this;

			var args = Array.prototype.slice.call(arguments, 1);

			if (this.hasWaiting(event)) {
				this._listeners[event].slice(0).forEach(function (cb) {
					cb.apply(_this, args);
				});
			}
		}
	}, {
		key: "hasWaiting",
		value: function hasWaiting(event) {
			return !!this._listeners[event];
		}
	}]);

	return Eventing;
}();

module.exports = Eventing;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Tokenizer = __webpack_require__(4).default;

var go;

function buildLeaf(info, token, prior) {
	var t = {},
	    types = [info.type];

	if (info.sensitivity && info.sensitivity === 'ignore') {
		t.ignore = true;
		types.push('null');
	} else if (info.sensitivity && info.sensitivity === 'required') {
		prior.push(token);
	} else {
		types.push('null');
	}

	t.type = types;

	if (info.encrypted) {
		t.encrypted = true;
	}

	return t;
}

function decorateObject(tokens, obj, info) {
	// could also be blank object coming from 
	if (!obj.type) {
		obj.type = ['object', 'null'];
	}

	if (!obj.required) {
		obj.required = [];
	}

	if (!obj.properties) {
		obj.properties = {};
	}

	go(tokens, obj.properties, info, obj.required);
}

function decorateArray(tokens, obj, token, info) {
	var path = token.value,
	    next = token.next;

	if (!obj.type) {
		obj.type = ['array', 'null'];
	}

	if (!obj.items) {
		obj.items = {};
	}

	if (info.sensitivity === 'required') {
		obj.minItems = 1;
	}

	if (next) {
		if (next.charAt(0) === '[') {
			decorateArray(tokens, obj.items, tokens.next(), info);
		} else {
			decorateObject(tokens, obj.items, info);
		}
	} else {
		obj.items = buildLeaf(info, path, []);
	}
}

go = function go(tokens, root, info, prior) {
	var token = tokens.next(),
	    path = token.value,
	    pos = path.indexOf('['),
	    next = token.next;

	if (pos !== -1 && path.charAt(pos + 1) === ']') {
		// this is an array
		var prop = path.substr(0, pos),
		    t = root[prop];

		if (!t) {
			t = root[prop] = {};
		}

		decorateArray(tokens, t, token, info);
	} else {
		if (pos === 0) {
			path = path.substring(2, path.length - 2);
		}

		if (next) {
			var _t = root[path];

			if (!_t) {
				_t = root[path] = {};
			}

			decorateObject(tokens, _t, info);
		} else {
			root[path] = buildLeaf(info, path, prior);
		}
	}
};

function encode(fields, shift, extra) {
	var root = {},
	    reqs = [];

	if (shift) {
		shift += '.';
	} else {
		shift = '';
	}

	fields.map(function (field) {
		var path = shift + field.path;

		try {
			var tokens = new Tokenizer(path);

			go(tokens, root, field, reqs);
		} catch (ex) {
			console.log('-------');
			console.log(path);
			console.log(ex.message);
			console.log(ex);
		}
	});

	return Object.assign({
		'$schema': 'http://json-schema.org/schema#',
		type: 'object',
		required: reqs,
		properties: root
	}, extra || {});
}

module.exports = {
	default: encode
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Accessor = function Accessor(access) {
	_classCallCheck(this, Accessor);

	this.ref = (access.action ? access.action + '#' : '') + (access.path ? access.path.join('.') : '');
	this.access = access;
};

module.exports = {
	Accessor: Accessor,
	default: Accessor
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(1);
var Path = __webpack_require__(2).default;
var Writer = __webpack_require__(28).default;

var characterSet = '#$?<>()"\'\\ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(cfg) {
	var length = cfg.string || Math.floor(Math.random() * (cfg.stringLength || 10)) + (cfg.stringMin || 4);

	var rtn = '';
	for (var i = 0; i < length; i++) {
		rtn += characterSet.charAt(Math.floor(Math.random() * characterSet.length));
	}

	return rtn;
}

var generators = {
	constant: function constant(cfg) {
		var value = cfg.value;
		return function () {
			return value;
		};
	},
	string: {
		random: function random() {
			var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			return function () {
				var rtn = [];
				var length = cfg.sentence || Math.floor(Math.random() * (cfg.sentenceLength || 10)) + (cfg.sentenceMin || 1);

				for (var i = 0; i < length; i++) {
					rtn.push(generateString(cfg));
				}

				return rtn.join(' ');
			};
		}
	},
	number: {
		index: function index() {
			var count = 1;
			return function () {
				return count++;
			};
		},
		random: function random(cfg) {
			if (!cfg) {
				cfg = {};
			}

			if (!cfg.min) {
				cfg.min = 1;
			}

			if (!cfg.max) {
				cfg.max = 100;
			}

			return function () {
				var val = Math.random() * (cfg.max - cfg.min);

				return val + cfg.min;
			};
		}
	},
	boolean: {
		random: function random() {
			return function () {
				return Math.random() * 10 % 2 === 0;
			};
		}
	},
	array: function array(cfg) {
		return function () {
			var count = cfg.length || 1;

			if (count < 1) {
				count = 1;
			}

			var rtn = [];

			while (count) {
				rtn.push({});
				count--;
			}

			return rtn;
		};
	}
};

var Generator = function () {
	function Generator(config) {
		var _this = this;

		_classCallCheck(this, Generator);

		this.fields = {};

		config.forEach(function (cfg) {
			_this.addField(new Path(cfg.path), cfg.generator, cfg.options);
		});
	}

	/*
 	path:
 	---
 	string: generator
 	object: options
 	||
 	any: value
 	||
 	function: factory
 */


	_createClass(Generator, [{
		key: 'addField',
		value: function addField(path, generator, options) {
			if (bmoor.isString(generator)) {
				generator = bmoor.get(generators, generator)(options);
			}

			var accessors = path.tokenizer.getAccessList();

			var writer = new Writer(accessors.getFront());
			path = writer.accessor.ref;

			var found = this.fields[path];

			if (found) {
				writer = found;
			} else {
				this.fields[path] = writer;
			}

			var following = accessors.getFollowing();

			if (following) {
				writer.addChild(following, generator);
			} else {
				writer.setGenerator(generator);
			}

			return writer;
		}
	}, {
		key: 'generate',
		value: function generate() {
			var rtn = {};

			for (var f in this.fields) {
				var field = this.fields[f];

				field.go(rtn);
			}

			return rtn;
		}
	}]);

	return Generator;
}();

module.exports = {
	Generator: Generator,
	default: Generator,
	generators: generators
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(1);
var makeSetter = bmoor.makeSetter;

var Path = __webpack_require__(2).default;
var Actionable = __webpack_require__(29).default;

var Writer = function (_Actionable) {
	_inherits(Writer, _Actionable);

	function Writer(accessor) {
		_classCallCheck(this, Writer);

		var _this = _possibleConstructorReturn(this, (Writer.__proto__ || Object.getPrototypeOf(Writer)).call(this, accessor));

		_this.set = makeSetter(_this.accessor.access.path);

		_this.setGenerator(function () {
			return [{}];
		});
		return _this;
	}

	_createClass(Writer, [{
		key: 'setAction',
		value: function setAction(action) {
			this.setGenerator(action);
		}
	}, {
		key: 'setGenerator',
		value: function setGenerator(fn) {
			this.generator = fn;
		}
	}, {
		key: 'go',
		value: function go(to) {
			var _this2 = this;

			var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var action = this.accessor.access.action;
			var res = action ? ctx.runAction(action, to) : this.generator(ctx);

			if (bmoor.isArray(res)) {
				res.forEach(function (datum) {
					for (var p in _this2.children) {
						var child = _this2.children[p];

						child.go(datum, ctx);
					}
				});
			} else {
				for (var p in this.children) {
					var child = this.children[p];

					child.go(res, ctx);
				}
			}

			if (this.set) {
				this.set(to, res);

				return to;
			} else {
				return res;
			}
		}
	}]);

	return Writer;
}(Actionable);

function listFactory(pathStr) {
	var path = new Path(pathStr);
	var accessorList = path.tokenizer.getAccessList();
	var writer = new Writer(accessorList.getFront());

	return writer.getList(accessorList.getFollowing());
}

module.exports = {
	Writer: Writer,
	listFactory: listFactory,
	default: Writer
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var makeGetter = __webpack_require__(1).makeGetter;

var Path = __webpack_require__(2).default;
var AccessList = __webpack_require__(5).default;

var Action = function () {
	function Action(accessor) {
		_classCallCheck(this, Action);

		if (accessor instanceof Path) {
			accessor = accessor.tokenizer.getAccessList();
		}

		if (accessor instanceof AccessList) {
			accessor = accessor.getFront();
		}

		this.get = makeGetter(accessor.access.path);
		this.action = null;
		this.accessor = accessor;
		this.children = {};
	}

	_createClass(Action, [{
		key: '_makeChild',
		value: function _makeChild(accessor) {
			return new this.constructor(accessor);
		}
	}, {
		key: 'setAction',
		value: function setAction(action) {
			this.action = action;
		}
	}, {
		key: 'addChild',
		value: function addChild(accessList, action) {
			var front = accessList.getFront();
			var following = accessList.getFollowing();

			var path = front.ref;
			var child = this.children[path];

			if (!child) {
				child = this._makeChild(front);
				this.children[path] = child;
			}

			if (following) {
				var rtn = child.addChild(following, action);

				rtn.unshift(this);

				return rtn;
			} else {
				if (action) {
					child.setAction(action);
				}

				return [this, child];
			}
		}
	}, {
		key: 'addPath',
		value: function addPath(path, action) {
			if (!(path instanceof Path)) {
				path = new Path(path);
			}

			var accessList = path.tokenizer.getAccessList();

			if (accessList.getFront().ref !== this.accessor.ref) {
				throw new Error('can not add path that does not ' + 'have matching first accessor');
			}

			var following = accessList.getFollowing();

			if (following) {
				return this.addChild(following, action);
			} else {
				this.setAction(action);

				return [this];
			}
		}
	}, {
		key: 'getList',
		value: function getList(accessList, action) {
			if (accessList) {
				return this.addChild(accessList, action);
			} else {
				return [this];
			}
		}
	}]);

	return Action;
}();

module.exports = {
	Action: Action,
	default: Action
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Path = __webpack_require__(2).default;

var tests = [function (def, v, errors) {
	if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) !== def.type && (def.required || v !== undefined)) {
		errors.push({
			path: def.path,
			type: 'type',
			value: v,
			expect: def.type
		});
	}
}];

function validate(schema, obj) {
	var errors = [];

	schema.forEach(function (def) {
		var arr = new Path(def.path).flatten(obj);

		if (def.required && arr.length === 1 && arr[0] === undefined) {
			errors.push({
				path: def.path,
				type: 'missing',
				value: undefined,
				expect: def.type
			});
		} else if (arr.length) {
			arr.forEach(function (v) {
				tests.forEach(function (fn) {
					fn(def, v, errors);
				});
			});
		}
	});

	if (errors.length) {
		return errors;
	} else {
		return null;
	}
}

validate.$ops = tests;

module.exports = {
	default: validate,
	tests: tests
};

/***/ })
/******/ ]);