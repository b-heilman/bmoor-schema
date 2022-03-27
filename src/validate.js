const Path = require('./Path.js').default;
const {Config} = require('bmoor/src/lib/config.js');

const tests = new Config({
	type: function (def, v, errors) {
		if (typeof v !== def.type && (def.required || v !== undefined)) {
			errors.push({
				path: def.path,
				value: v,
				expect: def.type
			});
		}
	}
});

function validate(schema, obj) {
	var errors = [];

	schema.forEach(function (def) {
		var arr = new Path(def.path).flatten(obj);

		if (def.required && arr.length === 1 && arr[0] === undefined) {
			errors.push({
				path: def.path,
				type: 'missing',
				value: undefined,
				expect: def.type
			});
		} else if (arr.length) {
			arr.forEach(function (v) {
				tests.keys().forEach(function (type) {
					const fn = tests.get(type);

					const subErrors = [];

					fn(def, v, subErrors);

					if (subErrors.length) {
						errors.push(
							...subErrors.map((datum) => {
								datum.type = type;

								return datum;
							})
						);
					}
				});
			});
		}
	});

	if (errors.length) {
		return errors;
	} else {
		return null;
	}
}

module.exports = {
	tests,
	validate,
	default: validate
};
