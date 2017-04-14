var bmoor = require('bmoor'),
	makeGetter = bmoor.makeGetter,
	makeSetter = bmoor.makeSetter;

class Path {
	// normal path: foo.bar
	// array path : foo[]bar
	constructor( path ){
		var end,
			dex = path.indexOf('[');

		if ( dex === -1 ){
			// normal path
			this.path = path;
		}else{
			end = path.indexOf( ']', dex );

			this.op = path.substring( dex+1, end );
			this.path = path.substr( 0, dex );
			this.remainder = path.substr( end + 1 );
		}

		// if we want to, we can optimize path performance
		this.get = makeGetter( this.path );
		this.set = makeSetter( this.path );
	}

	flatten( obj ){
		var t,
			rtn,
			next;

		if ( this.remainder === undefined ){
			return [ this.get(obj) ];
		}else{
			t = this.get(obj);
			rtn = [];
			next = new Path( this.remainder );
			t.forEach(function( o ){
				rtn = rtn.concat( next.flatten(o) );
			});

			return rtn;
		}
	}

	exec( obj, fn ){
		this.flatten( obj ).forEach(function( o ){
			fn( o );
		});
	}
}

module.exports = Path;