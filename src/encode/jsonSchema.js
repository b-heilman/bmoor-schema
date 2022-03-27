const Tokenizer = require('../path/Tokenizer.js').default;

var go;

function buildLeaf(info, token, prior) {
	let t = {},
		types = [info.type];

	if (info.sensitivity && info.sensitivity === 'ignore') {
		t.ignore = true;
		types.push('null');
	} else if (info.sensitivity && info.sensitivity === 'required') {
		prior.push(token);
	} else {
		types.push('null');
	}

	t.type = types;

	if (info.encrypted) {
		t.encrypted = true;
	}

	if (info.assign) {
		Object.assign(t, info.assign);
	}

	return t;
}

function decorateObject(tokens, obj, info) {
	// could also be blank object coming from
	if (!obj.type) {
		obj.type = ['object', 'null'];
	}

	if (!obj.required) {
		obj.required = [];
	}

	if (!obj.properties) {
		obj.properties = {};
	}

	go(tokens, obj.properties, info, obj.required);
}

function decorateArray(tokens, obj, token, info) {
	var path = token.value,
		next = token.next;

	if (!obj.type) {
		obj.type = ['array', 'null'];
	}

	if (!obj.items) {
		obj.items = {};
	}

	if (info.sensitivity === 'required') {
		obj.minItems = 1;
	}

	if (next) {
		if (next.charAt(0) === '[') {
			decorateArray(tokens, obj.items, tokens.next(), info);
		} else {
			decorateObject(tokens, obj.items, info);
		}
	} else {
		obj.items = buildLeaf(info, path, []);
	}
}

go = function (tokens, root, info, prior) {
	var token = tokens.next(),
		path = token.value,
		pos = path.indexOf('['),
		next = token.next;

	if (pos !== -1 && path.charAt(pos + 1) === ']') {
		// this is an array
		let prop = path.substr(0, pos),
			t = root[prop];

		if (!t) {
			t = root[prop] = {};
		}

		decorateArray(tokens, t, token, info);
	} else {
		if (pos === 0) {
			path = path.substring(2, path.length - 2);
		}

		if (next) {
			let t = root[path];

			if (!t) {
				t = root[path] = {};
			}

			decorateObject(tokens, t, info);
		} else {
			root[path] = buildLeaf(info, path, prior);
		}
	}
};

function encode(fields, shift, extra) {
	var root = {},
		reqs = [];

	if (shift) {
		shift += '.';
	} else {
		shift = '';
	}

	fields.map(function (field) {
		var path = shift + field.path;

		try {
			let tokens = new Tokenizer(path);

			go(tokens, root, field, reqs);
		} catch (ex) {
			console.log('-------');
			console.log(path);
			console.log(ex.message);
			console.log(ex);
		}
	});

	return Object.assign(
		{
			$schema: 'http://json-schema.org/schema#',
			type: 'object',
			required: reqs,
			properties: root
		},
		extra || {}
	);
}

module.exports = {
	encode,
	default: encode
};
