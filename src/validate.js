var Path = require('./Path.js');

var tests = [
		function( def, v, errors ){
			if ( typeof(v) !== def.type ){
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
		(new Path(def.path)).exec( obj, function( v ){
			tests.forEach(function( fn ){
				fn( def, v, errors );
			});
		});
	});

	if ( errors.length ){
		return errors;
	}else{
		return null;
	}
}

validate.$ops = tests;

module.exports = validate;