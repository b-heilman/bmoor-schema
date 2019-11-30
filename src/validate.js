
const Path = require('./Path.js').default;
const {Config} = require('bmoor/src/lib/config.js');

const config = new Config({
	tests: [
		function( def, v, errors ){
			if (typeof(v) !== def.type && (def.required || v !== undefined)){
				errors.push({
					path: def.path,
					type: 'type',
					value: v,
					expect: def.type
				});
			}
		}
	]
});

function validate( schema, obj ){
	var errors = [];

	schema.forEach(function( def ){
		var arr = (new Path(def.path)).flatten( obj );

		if (def.required && arr.length === 1 && arr[0] === undefined) {
			errors.push({
				path: def.path,
				type: 'missing',
				value: undefined,
				expect: def.type
			});
		} else if (arr.length) {
			arr.forEach(function( v ){
				config.get('tests').forEach(function( fn ){
					fn( def, v, errors );
				});
			});
		}
	});

	if ( errors.length ){
		return errors;
	}else{
		return null;
	}
}

module.exports = {
	config,
	validate,
	default: validate
};
