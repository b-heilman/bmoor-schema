const bmoor = require('bmoor'),
	makeGetter = bmoor.makeGetter,
	// makeSetter = bmoor.makeSetter,
	Writer = require('./path/Writer.js').default,
	Reader = require('./path/Reader.js').default,
	Tokenizer = require('./path/Tokenizer.js').default;

class Path {
	// normal path: foo.bar
	// array path : foo[].bar
	constructor( path ){
		this.tokenizer = new Tokenizer(path);
	}

	// converts something like [{a:1},{a:2}] to [1,2]
	// when given [].a
	flatten( obj ){
		var target = [obj],
			chunks = this.tokenizer.accessors();

		while( chunks.length ){
			let chunk = chunks.shift(),
				getter = makeGetter(chunk);

			target = target.map(getter)
				.reduce((rtn,arr) => rtn.concat(arr), []);
		}

		return target;
	}

	// call this method against 
	exec( obj, fn ){
		this.flatten( obj ).forEach(function( o ){
			fn( o );
		});
	}

	getReader(){
		return new Reader(this.tokenizer);
	}

	getWriter(){
		return new Writer(this.tokenizer);
	}
}

module.exports = Path;
