
const makeGetter = require('bmoor').makeGetter;

class Reader{
	constructor(tokenizer,pos){
		if (!pos){
			pos = 0;
		}

		this.token = tokenizer.tokens[pos];

		if ( pos + 1 < tokenizer.tokens.length ){
			this.child = new Reader(tokenizer,pos+1);
		}

		this.get = makeGetter(this.token.accessor);
	}
}

module.exports = {
	default: Reader
};
