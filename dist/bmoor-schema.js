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
		encode: __webpack_require__(2),
		Mapper: __webpack_require__(4),
		Mapping: __webpack_require__(6),
		Path: __webpack_require__(5),
		translate: __webpack_require__(7),
		validate: __webpack_require__(8)
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var bmoor = __webpack_require__(3),
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

	function encode(json, escaped) {
	    var t = [];

	    if (!escaped) {
	        escaped = /[\W]/;
	    }

	    if (json) {
	        parse(t, [], json);

	        t.forEach(function (d) {
	            return d.path = join(d.path, escaped);
	        });

	        return t;
	    } else {
	        return json;
	    }
	}

	encode.$ops = ops;

	module.exports = encode;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = bmoor;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Path = __webpack_require__(5),
	    bmoor = __webpack_require__(3),
	    Mapping = __webpack_require__(6);

	function stack(fn, old) {
		if (old) {
			return function (to, from) {
				old(to, from);
				fn(to, from);
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
			value: function addMapping(toPath, fromPath) {
				var to = new Path(toPath),
				    from = new Path(fromPath),
				    dex = to.leading + '-' + from.leading,
				    mapping = this.mappings[dex];

				if (mapping) {
					mapping.addChild(to.remainder, from.remainder);
				} else {
					mapping = new Mapping(to, from);
					this.mappings[dex] = mapping;

					this.go = stack(mapping.go, this.go);
				}
			}
		}]);

		return Mapper;
	}();

	module.exports = Mapper;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

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
			    dex = path.indexOf('['),
			    args;

			this.raw = path;

			if (dex === -1) {
				this.type = 'linear';
			} else {
				this.type = 'array';

				end = path.indexOf(']', dex);

				this.op = path.substring(dex + 1, end);
				args = this.op.indexOf(':');

				if (path.charAt(end + 1) === '.') {
					end++;
				}

				this.remainder = path.substr(end + 1);

				if (args === -1) {
					this.args = '';
				} else {
					this.args = this.op.substr(args + 1);
					this.op = this.op.substring(0, args);
				}

				path = path.substr(0, dex);
			}

			this.leading = path;

			if (path === '') {
				this.path = [];
			} else {
				this.path = path.split('.');
				this.set = makeSetter(this.path);
			}

			// if we want to, we can optimize path performance
			this.get = makeGetter(this.path);
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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Path = __webpack_require__(5);

	function all(next) {
		return function (toObj, fromObj) {
			var i, c, dex, t;

			for (i = 0, c = fromObj.length; i < c; i++) {
				t = {};
				dex = toObj.length;

				toObj.push(t);

				next(t, fromObj[i], toObj, dex);
			}
		};
	}

	var arrayMethods = {
		'': all,
		'*': all,
		'merge': function merge(next) {
			return function (toObj, fromObj, toRoot, toVar) {
				var i, c, dex, t;

				if (fromObj.length) {
					next(toObj, fromObj[0], toRoot, toVar);

					for (i = 1, c = fromObj.length; i < c; i++) {
						t = {};
						dex = toRoot.length;

						toRoot.push(t);

						next(t, fromObj[i], toRoot, dex);
					}
				}
			};
		},
		'first': function first(next) {
			return function (toObj, fromObj, toRoot, toVar) {
				var t = {};

				toRoot[toVar] = t;

				next(t, fromObj[0], toRoot, toVar);
			};
		},
		'last': function last(next) {
			return function (toObj, fromObj, toRoot, toVar) {
				var t = {};

				toRoot[toVar] = t;

				next(t, fromObj[fromObj.length - 1], toRoot, toVar);
			};
		},
		'pick': function pick(next, args) {
			return function (toObj, fromObj, toRoot, toVar) {
				var t = {},
				    dex = parseInt(args, 10);

				toRoot[toVar] = t;

				next(t, fromObj[dex], toRoot, toVar);
			};
		}
	};

	function buildArrayMap(to, from, next) {
		var fn = arrayMethods[to.op](next, to.args);

		if (to.path.length) {
			return function (toObj, fromObj) {
				var t = [],
				    parent = to.set(toObj, t);

				fn(t, from.get(fromObj), parent, to.path[to.path.length - 1]);
			};
		} else {
			return function (toObj, fromObj, toRoot, toVar) {
				var t = [],
				    myRoot;

				if (toRoot) {
					t = [];
					toRoot[toVar] = t;
					myRoot = toRoot;
				} else {
					// this must be when an array leads
					myRoot = t = toObj;
				}

				fn(t, from.get(fromObj), myRoot, toVar);
			};
		}
	}

	function stackChildren(old, fn) {
		if (old) {
			return function (toObj, fromObj, toRoot, toVar) {
				fn(toObj, fromObj, toRoot, toVar);
				old(toObj, fromObj, toRoot, toVar);
			};
		} else {
			return fn;
		}
	}

	var Mapping = function () {
		function Mapping(toPath, fromPath) {
			var _this = this;

			_classCallCheck(this, Mapping);

			var to = toPath instanceof Path ? toPath : new Path(toPath),
			    from = fromPath instanceof Path ? fromPath : new Path(fromPath);

			this.chidren = {};

			if (to.type === 'linear' && from.type === to.type) {
				if (to.path.length) {
					this.go = function (toObj, fromObj) {
						to.set(toObj, from.get(fromObj));
					};
				} else if (from.path.length) {
					this.go = function (ignore, fromObj, toRoot, i) {
						toRoot[i] = from.get(fromObj);
					};
				} else {
					this.go = function (ignore, value, toRoot, i) {
						toRoot[i] = value;
					};
				}
			} else if (to.type === 'array' && from.type === to.type) {
				this.addChild(to.remainder, from.remainder);
				this.go = buildArrayMap(to, from, function (toObj, fromObj, toRoot, toVar) {
					_this.callChildren(toObj, fromObj, toRoot, toVar);
				});
			} else {
				throw new Error('both paths needs same amount of array hooks');
			}
		}

		_createClass(Mapping, [{
			key: 'addChild',
			value: function addChild(toPath, fromPath) {
				var child,
				    to = new Path(toPath),
				    from = new Path(fromPath),
				    dex = to.leading + '-' + from.leading;

				child = this.chidren[dex];

				if (child) {
					child.addChild(to.remainder, from.remainder);
				} else {
					child = new Mapping(to, from);
					this.callChildren = stackChildren(this.callChildren, child.go);
				}
			}
		}]);

		return Mapping;
	}();

	module.exports = Mapping;

/***/ },
/* 7 */
/***/ function(module, exports) {

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
		return str.replace(/]([^\.$])/g, '].$1').split('.');
	}

	function encode(schema) {
		var i,
		    c,
		    d,
		    t,
		    rtn,
		    root,
		    path = schema[0].to || schema[0].path;

		if (split(path)[0] === '[]') {
			rtn = { type: 'array' };
			root = rtn;
		} else {
			rtn = { type: 'object', properties: {} };
			root = rtn.properties;
		}

		for (i = 0, c = schema.length; i < c; i++) {
			d = schema[i];

			path = d.to || d.path;

			t = { type: d.type };

			if (d.from) {
				t.alias = d.from;
			}

			go(split(path), root, t);
		}

		return rtn;
	}

	module.exports = encode;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var Path = __webpack_require__(5);

	var tests = [function (def, v, errors) {
		if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) !== def.type) {
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
			new Path(def.path).exec(obj, function (v) {
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

/***/ }
/******/ ]);