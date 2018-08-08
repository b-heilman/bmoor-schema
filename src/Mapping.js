var Path = require('./Path.js').default;

function all( next ){
	return function( toObj, fromObj ){
		var i, c,
			dex,
			t;

		for( i = 0, c = fromObj.length; i < c; i++ ){
			t = {};
			dex = toObj.length;

			toObj.push(t);
			
			next( t, fromObj[i], toObj, dex );
		}
	};
}

var arrayMethods = {
	'': all,
	'*': all,
	'merge': function( next ){
		return function( toObj, fromObj, toRoot, toVar ){
			var i, c,
				dex,
				t;

			if ( fromObj.length ){
				next( toObj, fromObj[0], toRoot, toVar );

				for( i = 1, c = fromObj.length; i < c; i++ ){
					t = {};
					dex = toRoot.length;

					toRoot.push( t );
					
					next( t, fromObj[i], toRoot, dex );
				}
			}
		};
	},
	'first': function( next ){
		return function( toObj, fromObj, toRoot, toVar ){
			var t = {};

			toRoot[toVar] = t;

			next( t, fromObj[0], toRoot, toVar );
		};
	},
	'last': function( next ){
		return function( toObj, fromObj, toRoot, toVar ){
			var t = {};

			toRoot[toVar] = t;

			next( t, fromObj[fromObj.length-1], toRoot, toVar );
		};	
	},
	'pick': function( next, args ){
		return function( toObj, fromObj, toRoot, toVar ){
			var t = {},
				dex = parseInt( args, 10 );

			toRoot[toVar] = t;

			next( t, fromObj[dex], toRoot, toVar );
		};	
	}
};

function buildArrayMap( to, from, next ){
	var fn = arrayMethods[to.op]( next, to.args );

	if ( to.path.length ){
		return function( toObj, fromObj ){
			var t = [],
				parent = to.set( toObj, t );

			fn( t, from.get(fromObj), parent, to.path[to.path.length-1] );
		};
	}else{
		return function( toObj, fromObj, toRoot, toVar ){
			var t = [],
				myRoot;

			if ( toRoot ){
				t = [];
				toRoot[toVar] = t;
				myRoot = toRoot;
			}else{
				// this must be when an array leads
				myRoot = t = toObj;
			}

			fn( t, from.get(fromObj), myRoot, toVar );
		};
	}
}

function stackChildren( old, fn ){
	if ( old ){
		return function( toObj, fromObj, toRoot, toVar ){
			fn( toObj, fromObj, toRoot, toVar );
			old( toObj, fromObj, toRoot, toVar );
		};
	}else{
		return fn;
	}
}

class Mapping {
	constructor( toPath, fromPath ){
		var to = toPath instanceof Path ? toPath : new Path( toPath ),
			from = fromPath instanceof Path ? fromPath : new Path( fromPath );

		this.chidren = {};

		if ( to.type === 'linear' && from.type === to.type ){
			if ( to.path.length ){
				this.go = function( toObj, fromObj ){
					to.set( toObj, from.get(fromObj) );
				};
			}else if ( from.path.length ){
				this.go = function( ignore, fromObj, toRoot, i ){
					toRoot[i] = from.get(fromObj);
				};
			}else{
				this.go = function( ignore, value, toRoot, i ){
					toRoot[i] = value;
				};
			}
		}else if ( to.type === 'array' && from.type === to.type ){
			this.addChild( to.remainder, from.remainder );
			this.go = buildArrayMap(
				to,
				from,
				( toObj, fromObj, toRoot, toVar ) => {
					this.callChildren( toObj, fromObj, toRoot, toVar );
				}
			);
		}else{
			throw new Error(
				'both paths needs same amount of array hooks'
			);
		}
	}

	addChild( toPath, fromPath ){
		var child,
			to = new Path( toPath ),
			from = new Path( fromPath ),
			dex = to.leading + '-' + from.leading;

		child = this.chidren[ dex ];

		if ( child ){
			child.addChild( to.remainder, from.remainder );
		}else{
			child = new Mapping( to, from );
			this.callChildren = stackChildren(
				this.callChildren,
				child.go
			);
		}
	}
}

module.exports = {
	default: Mapping
};

