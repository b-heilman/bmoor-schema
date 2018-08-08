
const bmoor = require('bmoor');

function nextToken( path ){
	var i = 0,
		c = path.length,
		char = path.charAt(0),
		more = true;

	let access = null;

	if ( path.charAt(1) === ']' ){
		// don't do anything
	}else if ( char === '[' ){
		let count = 0;

		do {
			if ( char === '[' ){
				count++;
			}else if ( char === ']' ){
				count--;
			}

			i++;
			char = path.charAt(i);
		} while( count && i < c );

		access = path.substring(2,i-2);
	}else{
		do {
			if ( char === '.' || char === '[' ){
				more = false;
			} else {
				i++;
				char = path.charAt(i);
			}
		} while( more && i < c );

		access = path.substring(0,i);
	}
	

	let token = path.substring(0,i),
		isArray = false;

	if ( char === '[' && path.charAt(i+1) === ']' ){
		token += '[]';
		i += 2;

		isArray = true;
	}

	if ( path.charAt(i) === '.' ){
		i++;
	}

	let next = path.substring(i);

	return {
		value: token,
		next: next,
		done: false,
		isArray: isArray,
		accessor: access
	};
}

class Tokenizer{
	constructor(path){
		var tokens;

		this.begin();

		if ( bmoor.isString(path) ){
			tokens = [];

			while( path ){
				let cur = nextToken(path);
				tokens.push(cur);
				path = cur.next;
			}
		}else{
			tokens = path;
		}

		
		this.tokens = tokens;
	}

	_makeChild(arr){
		return new (this.constructor)(arr);
	}

	begin(){
		this.pos = 0;
	}

	next(){
		var token = this.tokens[this.pos];

		if (token){
			this.pos++;

			return token;
		}else{
			return {
				done: true
			};
		}
	}

	getAccessors(){
		var rtn = this.accessors;

		if ( rtn === undefined ){
			let cur = null;

			rtn = [];

			for (let i = 0, c = this.tokens.length; i < c; i++){
				let token = this.tokens[i];

				if (cur){
					cur.push(token.accessor);
				}else if (token.accessor){
					cur = [token.accessor];
				}else{
					cur = [];
				}

				if (token.isArray){
					rtn.push(cur);
					cur = null;
				}
			}

			if (cur){
				rtn.push(cur);
			}

			this.accessors = rtn;
		}

		return rtn;
	}

	chunk(){
		var rtn = this.chunks;

		if ( rtn === undefined ){
			let cur = null;

			rtn = [];

			for (let i = 0, c = this.tokens.length; i < c; i++){
				let token = this.tokens[i];

				if (cur){
					if ( token.value.charAt(0) === '[' ){
						cur += token.value;
					}else{
						cur += '.'+token.value;
					}
				}else{
					cur = token.value;
				}

				if (token.isArray){
					rtn.push(cur);
					cur = null;
				}
			}

			if (cur){
				rtn.push(cur);
			}

			this.chunks = rtn;
		}

		return rtn;
	}

	findArray(){
		if (this.arrayPos === undefined){
			var found = -1,
				tokens = this.tokens;

			for( let i = 0, c = tokens.length; i < c; i++ ){
				if ( tokens[i].isArray ){
					found = i;
					i = c;
				}
			}

			this.arrayPos = found;
		}

		return this.arrayPos;
	}

	root(accessors){
		return (accessors ? 
			this.getAccessors() : this.chunk()
		)[0];
	}

	remainder(){
		var found = this.findArray();
		
		found++; // -1 goes to 0

		if ( found && found < this.tokens.length ){
			return this._makeChild(this.tokens.slice(found));
		}else{
			return null;
		}
	}
}

module.exports = {
	default: Tokenizer
};
