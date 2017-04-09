var bmoor = require('bmoor'),
	ops;

function parse( def, path, val ){
	var method;

	if ( bmoor.isArray(val) ){
		method = 'array';
	}else{
		method = typeof(val);
	}

	ops[method]( def, path, val );
}

ops = {
	array: function( def, path, val ){
		parse( def, path+'[]', val[0] );
	},
	object: function( def, path, val ){
		if ( path.length && path.charAt(path.length-1) !== ']' ){
			path += '.';
		}

		Object.keys(val).forEach( function( key ){
			parse( def, path+key, val[key]);
		});
	},
	number: function( def, path, val ){
		def.push({
			from: path,
			type: 'number',
			sample: val
		});
	},
	boolean: function( def, path, val ){
		def.push({
			from: path,
			type: 'boolean',
			sample: val
		});
	},
	string: function( def, path, val ){
		def.push({
			from: path,
			type: 'string',
			sample: val
		});
	}
};

function encode( json ){
	var t = [];

	parse( t, '', json );

	return t;
}

encode.$ops = ops;

module.exports = encode;
