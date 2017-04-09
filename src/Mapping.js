var bmoor = require('bmoor'),
	makeGetter = bmoor.makeGetter,
	makeSetter = bmoor.makeSetter;

class Mapping {
	constructor( toPath, fromPath ){
		var getFrom = makeGetter( fromPath ),
			setTo = makeSetter( toPath );

		this.get = getFrom;
		this.set = setTo;
		this.run = function( to, from ){
			setTo( to, getFrom(from) );
		};
	}
}

module.exports = Mapping;