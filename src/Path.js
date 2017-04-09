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

			this.hasArray = true;
			this.op = path.substring( dex+1, end );
			this.path = path.substr( 0, dex );
			this.remainder = path.substr( end + 1 );
		}
	}
}

module.exports = Path;