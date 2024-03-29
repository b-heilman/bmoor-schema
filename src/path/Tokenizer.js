const bmoor = require('bmoor');
const {AccessList} = require('./AccessList.js');

function nextToken(path) {
	let char = path.charAt(0);

	if (char === '#') {
		path = path.substring(1);

		let next = path.search(/[.[#]/);
		let action = null;

		if (next === -1) {
			action = path;
			next = null;
		} else {
			action = path.substring(0, next);
			next = path.substring(next + (path.charAt(next) === '.' ? 1 : 0));
		}

		let params = {};

		let pos = action.indexOf('{');
		if (pos !== -1) {
			params = JSON.parse(action.substring(pos));
			action = action.substring(0, pos);
		}

		return {
			type: 'action',
			params,
			next,
			value: action,
			accessor: null
		};
	} else {
		let i = 0;
		let c = path.length;
		let accessor = null;

		if (path.charAt(1) === ']') {
			// don't do anything
		} else if (char === '[') {
			let count = 0;

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
			let more = true;

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

		let token = path.substring(0, i),
			isArray = false;

		if (char === '[' && path.charAt(i + 1) === ']') {
			token += '[]';
			i += 2;

			isArray = true;
		}

		if (path.charAt(i) === '.') {
			i++;
		}

		let next = path.substring(i) || null;

		return {
			type: isArray ? 'array' : 'linear',
			next,
			value: token,
			accessor
		};
	}
}

class Tokenizer {
	constructor(path) {
		var tokens;

		this.begin();

		if (bmoor.isString(path)) {
			let cur = null;

			path = path.trim();
			tokens = [];

			while (path) {
				cur = nextToken(path);

				tokens.push(cur);
				path = cur.next;
			}

			if (path === null && cur.type === 'array') {
				tokens.push({
					type: 'stub',
					value: null,
					accessor: null
				});
			}
		} else {
			tokens = path;
		}

		this.tokens = tokens;
	}

	_makeChild(arr) {
		return new this.constructor(arr);
	}

	begin() {
		this.pos = 0;
	}

	hasNext() {
		return this.tokens.length > this.pos + 1;
	}

	next() {
		var token = this.tokens[this.pos];

		if (token) {
			this.pos++;

			let rtn = Object.create(token);
			rtn.done = false;

			return rtn;
		} else {
			return {
				done: true
			};
		}
	}

	getAccessList() {
		var rtn = this.accessors;

		if (rtn === undefined) {
			let path = null;

			rtn = [];

			for (let i = 0, c = this.tokens.length; i < c; i++) {
				let token = this.tokens[i];

				if (token.type === 'action') {
					rtn.push({
						path,
						action: token.value,
						params: token.params,
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
							path,
							action: false,
							isArray: true
						});

						path = null;
					}
				}
			}

			if (path) {
				rtn.push({
					path: path.length ? path : null,
					action: false,
					isArray: false
				});
			}

			this.accessors = rtn;
		}

		return new AccessList(this.accessors);
	}

	chunk() {
		var rtn = this.chunks;

		if (rtn === undefined) {
			let cur = null;
			let token = null;

			rtn = [];

			for (let i = 0, c = this.tokens.length; i < c; i++) {
				let join = '.';

				token = this.tokens[i];

				if (token.type !== 'stub') {
					if (token.value.charAt(0) === '[') {
						join = '';
					} else if (token.type === 'action') {
						join = '#';
					}

					if (cur) {
						cur += join + token.value;
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

	findArray() {
		if (this.arrayPos === undefined) {
			var found = -1,
				tokens = this.tokens;

			for (let i = 0, c = tokens.length; i < c; i++) {
				if (tokens[i].type === 'array') {
					found = i;
					i = c;
				}
			}

			this.arrayPos = found;
		}

		return this.arrayPos;
	}

	root(returnAccessor) {
		return returnAccessor
			? this.getAccessList().getFront().access.path
			: this.chunk()[0].path;
	}

	remainder() {
		var found = this.findArray();

		found++; // -1 goes to 0

		if (found && found < this.tokens.length) {
			return this._makeChild(this.tokens.slice(found));
		} else {
			return null;
		}
	}
}

module.exports = {
	default: Tokenizer,
	Tokenizer
};
