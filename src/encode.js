var bmoor = require('bmoor'),
	ops;

function parse( def, path, val ){
	var method;

	if (val === null || val === undefined) {
		return;
	}
	
	if ( bmoor.isArray(val) ){
		method = 'array';
	}else{
		method = typeof(val);
	}

	ops[method]( def, path.slice(0), val );
}

function formatProperty( prop ){
	if ( prop.charAt(0) !== '[' && prop.search(/[\W]/) !== -1 ){
		prop = '["'+prop+'"]';
	}

	return prop;
}

function join( path ){
	var rtn = '';

	if ( path && path.length ){
		rtn = formatProperty(path.shift());

		while( path.length ){
			let prop = formatProperty(path.shift()),
				nextChar = prop[0];

			if ( nextChar !== '[' ){
				rtn += '.';
			}

			rtn += prop;
		}
	}

	return rtn;
}

ops = {
	array: function( def, path, val ){
		// always encode first value of array
		var next = val[0];

		path.push('[]');

		parse( def, path, next );
	},
	object: function( def, path, val ){
		var pos = path.length;

		Object.keys(val).forEach( function( key ){
			path[pos] = key;

			parse( def, path, val[key]);
		});
	},
	number: function( def, path, val ){
		def.push({
			path: join(path),
			type: 'number',
			sample: val
		});
	},
	boolean: function( def, path, val ){
		def.push({
			path: join(path),
			type: 'boolean',
			sample: val
		});
	},
	string: function( def, path, val ){
		def.push({
			path: join(path),
			type: 'string',
			sample: val
		});
	}
};

function encode( json ){
	var t = [];

	if ( json ){
		parse( t, [], json );

		return t;
	}else{
		return json;
	}
}

encode.$ops = ops;

module.exports = encode;
