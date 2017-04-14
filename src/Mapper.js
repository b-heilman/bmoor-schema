var Path = require('./Path.js'),
	bmoor = require('bmoor'),
	makeGetter = bmoor.makeGetter,
	Mapping = require('./Mapping.js');

function stack( fn, old ){
	if ( old ){
		return function( to, from, dex ){
			old( to, from, dex );
			fn( to, from, dex );
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

	addMapping( to, from ){
		if ( from.indexOf('[') === -1 ){
			this.addLinearMapping( to, from );
		}else{
			this.addArrayMapping( to, from );
		}
	}

	addLinearMapping( toPath, fromPath ){
		var pipe = ( new Mapping(toPath,fromPath) ).run;

		// fn( to, from )
		this.run = stack( pipe, this.run );
	}

	addArrayMapping( toPath, fromPath ){
		var fn,
			valGet,
			to = new Path( toPath, {get:true,set:true} ),
			from = new Path( fromPath, {get:true} ),
			dex = to.path+'-'+from.path,
			child = this.mappings[ dex ];

		if ( !child ){
			// so the path ended with []
			if ( to.remainder === '' ){
				// straight insertion
				valGet = makeGetter( from.remainder );
				
				fn = function( to, fromObj ){
					to.push( valGet(fromObj) );
				};
			}else{
				// more complex object down there
				child = this.mappings[ dex ] = new Mapper();

				fn = function( arrTo, fromObj ){
					var t;

					if ( to.remainder.charAt(0) === '[' ){
						if ( to.remainder.charAt(1) === 'm' ){
							// this means merge
							t = arrTo;
						}else{
							t = [];
						}
					}else{
						t = {};
					}

					if ( arrTo !== t ){
						arrTo.push( t );
					}

					child.run( t, fromObj );
				};
			}

			this.run = stack( function( t, f ){
				var i, c,
					fromArr,
					toArr;

				// does an array already exist there?
				toArr = to.get( t );
				if ( !toArr ){
					toArr = [];
					to.set( t, toArr );
				}

				fromArr = from.get(f);

				for( i = 0, c = fromArr.length; i < c; i++ ){
					fn( toArr, fromArr[i] );
				}
			}, this.run );
		}

		if ( child ){
			child.addMapping( to.remainder, from.remainder );
		}
	}
}

module.exports = Mapper;
