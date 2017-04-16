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
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(1);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
		encode: __webpack_require__(2),
		Mapper: __webpack_require__(4),
		Mapping: __webpack_require__(6),
		Path: __webpack_require__(5),
		translate: __webpack_require__(7),
		validate: __webpack_require__(8)
	};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var bmoor = __webpack_require__(3),
	    ops;

	function parse(def, path, val) {
		var method;

		if (bmoor.isArray(val)) {
			method = 'array';
		} else {
			method = typeof val === 'undefined' ? 'undefined' : _typeof(val);
		}

		ops[method](def, path, val);
	}

	ops = {
		array: function array(def, path, val) {
			parse(def, path + '[]', val[0]);
		},
		object: function object(def, path, val) {
			if (path.length && path.charAt(path.length - 1) !== ']') {
				path += '.';
			}

			Object.keys(val).forEach(function (key) {
				parse(def, path + key, val[key]);
			});
		},
		number: function number(def, path, val) {
			def.push({
				from: path,
				type: 'number',
				sample: val
			});
		},
		boolean: function boolean(def, path, val) {
			def.push({
				from: path,
				type: 'boolean',
				sample: val
			});
		},
		string: function string(def, path, val) {
			def.push({
				from: path,
				type: 'string',
				sample: val
			});
		}
	};

	function encode(json) {
		var t = [];

		parse(t, '', json);

		return t;
	}

	encode.$ops = ops;

	module.exports = encode;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = bmoor;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Path = __webpack_require__(5),
	    bmoor = __webpack_require__(3),
	    makeGetter = bmoor.makeGetter,
	    Mapping = __webpack_require__(6);

	function stack(fn, old) {
		if (old) {
			return function (to, from, dex) {
				old(to, from, dex);
				fn(to, from, dex);
			};
		} else {
			return fn;
		}
	}

	// TODO : merging arrays

	// converts one object structure to another

	var Mapper = function () {
		function Mapper(settings) {
			var _this = this;

			_classCallCheck(this, Mapper);

			this.mappings = {};

			// this.run is defined via recursive stacks
			if (settings) {
				Object.keys(settings).forEach(function (to) {
					var from = settings[to];

					if (bmoor.isObject(from)) {
						// so it's an object, parent is an array
						if (from.to) {
							to = from.to;
						}

						if (from.from) {
							from = from.from;
						} else {
							throw new Error('I can not find a from clause');
						}
					}

					_this.addMapping(to, from);
				});
			}
		}

		_createClass(Mapper, [{
			key: 'addMapping',
			value: function addMapping(to, from) {
				if (from.indexOf('[') === -1) {
					this.addLinearMapping(to, from);
				} else {
					this.addArrayMapping(to, from);
				}
			}
		}, {
			key: 'addLinearMapping',
			value: function addLinearMapping(toPath, fromPath) {
				var pipe = new Mapping(toPath, fromPath).run;

				// fn( to, from )
				this.run = stack(pipe, this.run);
			}
		}, {
			key: 'addArrayMapping',
			value: function addArrayMapping(toPath, fromPath) {
				var fn,
				    valGet,
				    to = new Path(toPath, { get: true, set: true }),
				    from = new Path(fromPath, { get: true }),
				    dex = to.path + '-' + from.path,
				    child = this.mappings[dex];

				if (!child) {
					// so the path ended with []
					if (to.remainder === '') {
						// straight insertion
						valGet = makeGetter(from.remainder);

						fn = function fn(to, fromObj) {
							to.push(valGet(fromObj));
						};
					} else {
						// more complex object down there
						child = this.mappings[dex] = new Mapper();

						fn = function fn(arrTo, fromObj) {
							var t;

							if (to.remainder.charAt(0) === '[') {
								if (to.remainder.charAt(1) === 'm') {
									// this means merge
									t = arrTo;
								} else {
									t = [];
								}
							} else {
								t = {};
							}

							if (arrTo !== t) {
								arrTo.push(t);
							}

							child.run(t, fromObj);
						};
					}

					this.run = stack(function (t, f) {
						var i, c, fromArr, toArr;

						// does an array already exist there?
						toArr = to.get(t);
						if (!toArr) {
							toArr = [];
							to.set(t, toArr);
						}

						fromArr = from.get(f);

						for (i = 0, c = fromArr.length; i < c; i++) {
							fn(toArr, fromArr[i]);
						}
					}, this.run);
				}

				if (child) {
					child.addMapping(to.remainder, from.remainder);
				}
			}
		}]);

		return Mapper;
	}();

	module.exports = Mapper;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var bmoor = __webpack_require__(3),
	    makeGetter = bmoor.makeGetter,
	    makeSetter = bmoor.makeSetter;

	var Path = function () {
		// normal path: foo.bar
		// array path : foo[]bar
		function Path(path) {
			_classCallCheck(this, Path);

			var end,
			    dex = path.indexOf('[');

			if (dex === -1) {
				// normal path
				this.path = path;
			} else {
				end = path.indexOf(']', dex);

				this.op = path.substring(dex + 1, end);
				this.path = path.substr(0, dex);
				this.remainder = path.substr(end + 1);
			}

			// if we want to, we can optimize path performance
			this.get = makeGetter(this.path);
			this.set = makeSetter(this.path);
		}

		_createClass(Path, [{
			key: 'flatten',
			value: function flatten(obj) {
				var t, rtn, next;

				if (this.remainder === undefined) {
					return [this.get(obj)];
				} else {
					t = this.get(obj);
					rtn = [];
					next = new Path(this.remainder);
					t.forEach(function (o) {
						rtn = rtn.concat(next.flatten(o));
					});

					return rtn;
				}
			}
		}, {
			key: 'exec',
			value: function exec(obj, fn) {
				this.flatten(obj).forEach(function (o) {
					fn(o);
				});
			}
		}]);

		return Path;
	}();

	module.exports = Path;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var bmoor = __webpack_require__(3),
	    makeGetter = bmoor.makeGetter,
	    makeSetter = bmoor.makeSetter;

	var Mapping = function Mapping(toPath, fromPath) {
		_classCallCheck(this, Mapping);

		var getFrom = makeGetter(fromPath),
		    setTo = makeSetter(toPath);

		this.get = getFrom;
		this.set = setTo;
		this.run = function (to, from) {
			setTo(to, getFrom(from));
		};
	};

	module.exports = Mapping;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	'use strict';

	function go(from, root, info) {
		var cur = from.shift();

		if (cur[cur.length - 1] === ']') {
			cur = cur.substr(0, cur.length - 2);

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

		if (from.length) {
			if (!root[cur]) {
				root[cur] = {
					type: 'object',
					properties: {}
				};
			}
			go(from, root[cur].properties, info);
		} else {
			root[cur] = info;
		}
	}

	function split(str) {
		return str.replace(/]([^$])/g, '].$1').split('.');
	}

	function encode(schema) {
		var i,
		    c,
		    d,
		    rtn,
		    root,
		    path = schema[0].to || schema[0].from;

		if (split(path)[0] === '[]') {
			rtn = { type: 'array' };
			root = rtn;
		} else {
			rtn = { type: 'object', properties: {} };
			root = rtn.properties;
		}

		for (i = 0, c = schema.length; i < c; i++) {
			d = schema[i];

			path = d.to || d.from;
			go(split(path), root, {
				type: d.type,
				alias: d.from
			});
		}

		return rtn;
	}

	module.exports = encode;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var Path = __webpack_require__(5);

	var tests = [function (def, v, errors) {
		if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) !== def.type) {
			errors.push({
				from: def.from,
				type: 'type',
				value: v,
				expect: def.type
			});
		}
	}];

	function validate(schema, obj) {
		var errors = [];

		schema.forEach(function (def) {
			new Path(def.from).exec(obj, function (v) {
				tests.forEach(function (fn) {
					fn(def, v, errors);
				});
			});
		});

		if (errors.length) {
			return errors;
		} else {
			return null;
		}
	}

	validate.$ops = tests;

	module.exports = validate;

/***/ })
/******/ ]);