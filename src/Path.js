var bmoor = require('bmoor'),
	makeGetter = bmoor.makeGetter,
	makeSetter = bmoor.makeSetter;

class Path {
	// normal path: foo.bar
	// array path : foo[]bar
	constructor( path ){
		var end,
			dex = path.indexOf('['),
			args;

		this.raw = path;

		if ( dex === -1 ){
			this.type = 'linear';
		}else{
			this.type = 'array';

			end = path.indexOf( ']', dex );
			this.remainder = path.substr( end + 1 );

			this.op = path.substring( dex+1, end );
			args = this.op.indexOf(':');

			if ( args === -1 ){
				this.args = '';
			}else{
				this.args = this.op.substr( args+1 );
				this.op = this.op.substring( 0, args );
			}

			path = path.substr( 0, dex );
		}

		this.leading = path;

		if ( path === '' ){
			this.path = [];
		}else{
			this.path = path.split('.');
			this.set = makeSetter( this.path );
		}

		// if we want to, we can optimize path performance
		this.get = makeGetter( this.path );
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
