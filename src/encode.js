function go( path, root, info ){
	var isArray = false,
		cur = path.shift();

	if ( cur[cur.length-1] === ']' ){
		isArray = true;
		cur = cur.substr( 0, cur.length - 2 );
	}

	if ( isArray ){
		if ( cur === '' ){
			// don't think anything...
		}else{
			if ( !root[cur] ){
				root[cur] = {
					type: 'array'
				};
			}
			root = root[cur];
		}
		cur = 'items';
	}

	if ( path.length ){
		if ( !root[cur] ){
			root[cur] = {
				type: 'object',
				properties: {}
			};
		}
		go( path, root[cur].properties, info );
	}else{
		root[ cur ] = info;
	}
}

function encode( schema ){
	var i, c,
		d,
		rtn,
		root;

	if ( schema[0].path.split('.')[0] === '[]' ){
		rtn = { type: 'array' };
		root = rtn;
	}else{
		rtn = { type: 'object', properties: {} };
		root = rtn.properties;
	}

	for( i = 0, c = schema.length; i < c; i++ ){
		d = schema[i];

		go( d.path.split('.'), root, {
			type: d.type,
			alias: d.path
		});
	}

	return rtn;
}

module.exports = encode;
