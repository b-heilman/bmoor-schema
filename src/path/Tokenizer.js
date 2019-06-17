
const bmoor = require('bmoor');
const {AccessList} = require('./AccessList.js');

function nextToken(path){
	let char = path.charAt(0);

	if (char === '#'){
		path = path.substring(1);

		let next = path.search(/[\.\[#]/);
		let action = path.substring(0, next);

		next = path.substring(next+(path.charAt(next) === '.' ? 1 : 0));

		return {
			type: 'action',
			next: next,
			value: action,
			accessor: null
		};
	} else {
		let i = 0;
		let c = path.length;
		let accessor = null;

		if (path.charAt(1) === ']'){
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

			accessor = path.substring(2,i-2);
		}else{
			let more = true;

			do {
				if ( char === '.' || char === '[' ){
					more = false;
				} else {
					i++;
					char = path.charAt(i);
				}
			} while( more && i < c );

			accessor = path.substring(0,i);
		}
		

		let token = path.substring(0,i),
			isArray = false;

		if (char === '[' && path.charAt(i+1) === ']'){
			token += '[]';
			i += 2;

			isArray = true;
		}

		if ( path.charAt(i) === '.' ){
			i++;
		}

		let next = path.substring(i);

		return {
			type: isArray ? 'array' : 'linear',
			next,
			value: token,
			accessor
		};
	}
}

class Tokenizer{
	constructor(path){
		var tokens;

		this.begin();

		if (bmoor.isString(path)){
			path = path.trim();
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

	hasNext(){
		return this.tokens.length > this.pos + 1; 
	}

	next(){
		var token = this.tokens[this.pos];

		if (token){
			this.pos++;

			let rtn = Object.create(token);
			rtn.done = false;

			return rtn;
		}else{
			return {
				done: true
			};
		}
	}

	getAccessList(){
		var rtn = this.accessors;

		if (rtn === undefined){
			let path = null;

			rtn = [];

			for (let i = 0, c = this.tokens.length; i < c; i++){
				let token = this.tokens[i];

				if (token.type === 'action'){
					rtn.push({
						path,
						action: token.value,
						isArray: false
					});

					path = null;
				} else {
					if (path){
						path.push(token.accessor);
					}else if (token.accessor){
						path = [token.accessor];
					}else{
						path = [];
					}

					if (token.type === 'array'){
						rtn.push({
							path,
							action: false,
							isArray: true
						});

						path = null;
					}
				}
			}

			if (path){
				rtn.push({
					path,
					action: false,
					isArray: false
				});
			}

			this.accessors = rtn;
		}

		return new AccessList(this.accessors);
	}

	// TODO : I don't think chunk is used anymore
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

				if (token.type !== 'linear' ){
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
				if ( tokens[i].type === 'array' ){
					found = i;
					i = c;
				}
			}

			this.arrayPos = found;
		}

		return this.arrayPos;
	}

	root(returnAccessor){
		return returnAccessor ? 
			this.getAccessList().getFront().access.path : this.chunk()[0];
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
	default: Tokenizer,
	Tokenizer
};
