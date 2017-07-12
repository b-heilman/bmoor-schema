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

	ops[method]( def, path, val );
}

ops = {
	array: function( def, path, val ){
		var next = val[0];

		parse( def, path+'[]', next );
	},
	object: function( def, path, val ){
		if ( path.length ){
			path += '.';
		}
		
		Object.keys(val).forEach( function( key ){
			parse( def, path+key, val[key]);
		});
	},
	number: function( def, path, val ){
		def.push({
			path: path,
			type: 'number',
			sample: val
		});
	},
	boolean: function( def, path, val ){
		def.push({
			path: path,
			type: 'boolean',
			sample: val
		});
	},
	string: function( def, path, val ){
		def.push({
			path: path,
			type: 'string',
			sample: val
		});
	}
};

function encode( json ){
	var t = [];

	if ( json ){
		parse( t, '', json );

		return t;
	}else{
		return json;
	}
}

encode.$ops = ops;

module.exports = encode;
