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
		Mapper: __webpack_require__(7),
		Mapping: __webpack_require__(11),
		Path: __webpack_require__(8),
		path: {
			Tokenizer: __webpack_require__(6).default
		},
		validate: __webpack_require__(12)
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	    bmoorSchema: __webpack_require__(3).default,
	    jsonSchema: __webpack_require__(5).default
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var bmoor = __webpack_require__(4),
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

	module.exports = {
		default: encode,
		types: ops
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = bmoor;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Tokenizer = __webpack_require__(6).default;

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

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function nextToken(path) {
	    var i = 0,
	        c = path.length,
	        char = path.charAt(0),
	        more = true;

	    var access = null;

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

	        access = path.substring(2, i - 2);
	    } else {
	        do {
	            if (char === '.' || char === '[') {
	                more = false;
	            } else {
	                i++;
	                char = path.charAt(i);
	            }
	        } while (more && i < c);

	        access = path.substring(0, i);
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

	    var next = path.substring(i);

	    return {
	        value: token,
	        next: next,
	        done: false,
	        isArray: isArray,
	        accessor: access
	    };
	}

	var Tokenizer = function () {
	    function Tokenizer(path) {
	        _classCallCheck(this, Tokenizer);

	        var tokens = [];

	        this.path = path;

	        while (path) {
	            var cur = nextToken(path);
	            tokens.push(cur);
	            path = cur.next;
	        }

	        this.pos = 0;
	        this.tokens = tokens;
	    }

	    _createClass(Tokenizer, [{
	        key: 'next',
	        value: function next() {
	            var token = this.tokens[this.pos];

	            if (token) {
	                this.pos++;

	                return token;
	            } else {
	                return {
	                    done: true
	                };
	            }
	        }
	    }, {
	        key: 'accessors',
	        value: function accessors() {
	            var rtn = [],
	                cur = null;

	            for (var i = 0, c = this.tokens.length; i < c; i++) {
	                var token = this.tokens[i];

	                if (cur) {
	                    cur.push(token.accessor);
	                } else if (token.accessor) {
	                    cur = [token.accessor];
	                } else {
	                    cur = [];
	                }

	                if (token.isArray) {
	                    rtn.push(cur);
	                    cur = null;
	                }
	            }

	            if (cur) {
	                rtn.push(cur);
	            }

	            return rtn;
	        }
	    }, {
	        key: 'chunk',
	        value: function chunk() {
	            var rtn = [],
	                cur = null;

	            for (var i = 0, c = this.tokens.length; i < c; i++) {
	                var token = this.tokens[i];

	                if (cur) {
	                    if (token.value.charAt(0) === '[') {
	                        cur += token.value;
	                    } else {
	                        cur += '.' + token.value;
	                    }
	                } else {
	                    cur = token.value;
	                }

	                if (token.isArray) {
	                    rtn.push(cur);
	                    cur = null;
	                }
	            }

	            if (cur) {
	                rtn.push(cur);
	            }

	            return rtn;
	        }
	    }]);

	    return Tokenizer;
	}();

	module.exports = {
	    default: Tokenizer
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Path = __webpack_require__(8),
	    bmoor = __webpack_require__(4),
	    Mapping = __webpack_require__(11);

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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var bmoor = __webpack_require__(4),
	    makeGetter = bmoor.makeGetter,

	// makeSetter = bmoor.makeSetter,
	Writer = __webpack_require__(9).default,
	    Reader = __webpack_require__(10).default,
	    Tokenizer = __webpack_require__(6).default;

	var Path = function () {
		// normal path: foo.bar
		// array path : foo[].bar
		function Path(path) {
			_classCallCheck(this, Path);

			this.tokenizer = new Tokenizer(path);
		}

		// converts something like [{a:1},{a:2}] to [1,2]
		// when given [].a


		_createClass(Path, [{
			key: 'flatten',
			value: function flatten(obj) {
				var target = [obj],
				    chunks = this.tokenizer.accessors();

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
				this.flatten(obj).forEach(function (o) {
					fn(o);
				});
			}
		}, {
			key: 'getReader',
			value: function getReader() {
				return new Reader(this.tokenizer);
			}
		}, {
			key: 'getWriter',
			value: function getWriter() {
				return new Writer(this.tokenizer);
			}
		}]);

		return Path;
	}();

	module.exports = Path;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var makeSetter = __webpack_require__(4).makeSetter;

	var Writer = function Writer(tokenizer, pos) {
		_classCallCheck(this, Writer);

		if (!pos) {
			pos = 0;
		}

		this.token = tokenizer.tokens[pos];

		if (pos + 1 < tokenizer.tokens.length) {
			this.child = new Writer(tokenizer, pos + 1);
		}

		this.set = makeSetter(this.token.accessor);
	};

	module.exports = {
		default: Writer
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var makeGetter = __webpack_require__(4).makeGetter;

	var Reader = function Reader(tokenizer, pos) {
		_classCallCheck(this, Reader);

		if (!pos) {
			pos = 0;
		}

		this.token = tokenizer.tokens[pos];

		if (pos + 1 < tokenizer.tokens.length) {
			this.child = new Reader(tokenizer, pos + 1);
		}

		this.get = makeGetter(this.token.accessor);
	};

	module.exports = {
		default: Reader
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Path = __webpack_require__(8);

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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var Path = __webpack_require__(8);

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

	module.exports = validate;

/***/ }
/******/ ]);