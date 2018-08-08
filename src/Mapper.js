const Path = require('./Path.js').default,
	bmoor = require('bmoor'),
	Mapping = require('./Mapping.js');

function stack( fn, old ){
	if ( old ){
		return function( to, from ){
			old( to, from );
			fn( to, from );
		};
	}else{
		return fn;
	}
}

// TODO : merging arrays

// converts one object structure to another
class Mapper {

	constructor( settings ){
		this.mappings = {};

		// this.run is defined via recursive stacks
		if ( settings ){
			Object.keys( settings ).forEach( ( to ) => {
				var from = settings[to];

				if ( bmoor.isObject(from) ){
					// so it's an object, parent is an array
					if ( from.to ){
						to = from.to;
					}

					if ( from.from ){
						from = from.from;
					}else{
						throw new Error('I can not find a from clause');
					}
				}

				this.addMapping( to, from );
			});
		}
	}

	addMapping( toPath, fromPath ){
		var to = new Path( toPath ),
			from = new Path( fromPath ),
			fromNext = from.remainder();

		if ( fromNext ){
			let dex = from.root()+'=>'+to.root(),
				mapping = this.mappings[dex];

			if ( mapping ){
				mapping.addChild( to, from );
			}else{
				mapping = new Mapping( to, from );
				this.mappings[ dex ] = mapping;

				this.process = stack( mapping.process, this.process );
			}
		}
	}
}

module.exports = Mapper;
