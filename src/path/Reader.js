
const makeGetter = require('bmoor').makeGetter;

class Reader{
	constructor(tokenizer){
		this.token = tokenizer.next();

		if (tokenizer.hasNext()){
			this.child = this._makeChild(tokenizer);
		}

		this.get = makeGetter(this.token.accessor);
	}

	_makeChild(tokenizer){
		return new (this.constructor)(tokenizer);
	}
}

module.exports = {
	default: Reader
};
