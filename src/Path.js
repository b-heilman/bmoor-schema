const bmoor = require('bmoor'),
	makeGetter = bmoor.makeGetter,
	Tokenizer = require('./path/Tokenizer.js').default;

class Path {
	// normal path: foo.bar
	// array path : foo[].bar
	constructor(path) {
		if (path instanceof Tokenizer) {
			this.tokenizer = path;
		} else {
			this.tokenizer = new Tokenizer(path);
		}

		this.root = this.tokenizer.tokens[0];
		this.hasArray = this.root.isArray;
	}

	_makeChild(path) {
		return new this.constructor(path);
	}

	// converts something like [{a:1},{a:2}] to [1,2]
	// when given [].a
	flatten(obj) {
		var target = [obj],
			chunks = this.tokenizer.getAccessList().simplify();

		while (chunks.length) {
			let chunk = chunks.shift(),
				getter = makeGetter(chunk);

			target = target.map(getter).reduce((rtn, arr) => rtn.concat(arr), []);
		}

		return target;
	}

	// call this method against
	exec(obj, fn) {
		this.flatten(obj).forEach(fn);
	}

	root(accessors) {
		return this.tokenizer.root(accessors);
	}

	remainder() {
		return this._makeChild(this.tokenizer.remainder());
	}
}

module.exports = {
	Path,
	default: Path
};
