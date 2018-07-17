var Path = require('./Path.js');

var tests = [
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
	];

function validate( schema, obj ){
	var errors = [];

	schema.forEach(function( def ){
		var arr = (new Path(def.path)).flatten( obj );

		if ( arr.length ){
			arr.forEach(function( v ){
				tests.forEach(function( fn ){
					fn( def, v, errors );
				});
			});
		}else if (def.required){
			errors.push({
				path: def.path,
				type: 'missing',
				value: undefined,
				expect: def.type
			});
		}
	});

	if ( errors.length ){
		return errors;
	}else{
		return null;
	}
}

validate.$ops = tests;

module.exports = validate;
