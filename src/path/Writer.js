
const makeSetter = require('bmoor').makeSetter;

class Writer{
	constructor(tokenizer,pos){
		if (!pos){
			pos = 0;
		}

		this.token = tokenizer.tokens[pos];

		if ( pos + 1 < tokenizer.tokens.length ){
			this.child = new Writer(tokenizer,pos+1);
		}

		this.set = makeSetter(this.token.accessor);
	}
}

module.exports = {
	default: Writer
};
