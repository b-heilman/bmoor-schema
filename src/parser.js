var bmoor = require('bmoor');

module.exports = {
	$decode: function( def, path, val ){
		var method;

		if ( bmoor.isArray(val) ){
			method = 'array';
		}else{
			method = typeof(val);
		}

		this[method]( def, path, val );
	},
	array: function( def, path, val ){
		this.$decode( def, path+'[]', val[0] );
	},
	object: function( def, path, val ){
		if ( path !== '' ){
			path += '.';
		}

		Object.keys(val).forEach( ( key ) => {
			this.$decode( def, path+key, val[key]);
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