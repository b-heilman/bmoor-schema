var encode = require('./encode.js'),
	parsing = require('./parser.js');

class Schema {
	constructor( jsonObj ){
		var i = [];

		parsing.$decode( i, '', jsonObj );

		this.info = i;
	}

	toJsonSchema(){
		return encode( this.info );
	}
}

module.exports = Schema;